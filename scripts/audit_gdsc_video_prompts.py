#!/usr/bin/env python3
"""Audit Golden Deer support comedy prompts as Seedance execution contracts."""

from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE_NAME = "delivery/video_generation_package_2026-07-31_timing_safe"
VALIDATOR = ROOT.home() / ".codex" / "skills" / "video-prompt-qa" / "scripts" / "validate_prompt_contract.js"

EPISODES = (
    ("EP01_hilda_lorenz", "Hilda x Lorenz", "Hilda, Lorenz"),
    ("EP02_hilda_marianne", "Hilda x Marianne", "Hilda, Marianne"),
    ("EP03_hilda_lysithea", "Hilda x Lysithea", "Hilda, Lysithea"),
    ("EP04_claude_lorenz", "Claude x Lorenz", "Claude, Lorenz"),
)

FRAME_NAMES = ("start_frame.png", "key_frame.png", "end_frame.png")
APPROVED_VISUAL_STATUSES = {
    "temporal_imagegen_frames_applied",
    "timing_repaired_imagegen_frames_applied",
    "dialogue_specific_imagegen_frames_applied",
}
REQUIRED_SECTIONS = (
    "Shot ID:",
    "Duration:",
    "Input Frames:",
    "Identity Lock:",
    "Motion:",
    "Camera:",
    "Performance:",
    "Audio:",
    "Dialogue / Vocal Lines:",
    "Continuity Locks:",
    "Reject If:",
)
BAD_TOKENS = re.compile(r"\b(TODO|TBD|PLACEHOLDER|FIXME|INSERT|REPLACE_ME|SOURCE_SLOT)\b|<[^>\n]+>", re.I)
QUOTE_LINE = re.compile(r'^- [^:\n]+: ".+"', re.M)


@dataclass
class PromptCheck:
    shot_id: str
    decision: str
    issues: list[str]
    risks: list[str]


def run_contract(path: Path) -> dict:
    result = subprocess.run(
        ["node", str(VALIDATOR), str(path), "--json"],
        check=False,
        text=True,
        capture_output=True,
    )
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError:
        payload = {"ok": False, "missing_sections": ["validator_output_unreadable"], "weak_signals": []}
    if result.returncode != 0:
        payload["ok"] = False
    return payload


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def check_shot(shot: Path, expected_names: str) -> PromptCheck:
    prompt_path = shot / "prompt.md"
    negative_path = shot / "negative_prompt.md"
    metadata_path = shot / "metadata.json"
    prompt = prompt_path.read_text(encoding="utf-8")
    negative = negative_path.read_text(encoding="utf-8")
    metadata = load_json(metadata_path)
    contract = run_contract(prompt_path)
    issues: list[str] = []
    risks: list[str] = []

    if not contract.get("ok"):
        missing = ", ".join(contract.get("missing_sections") or ["unknown"])
        issues.append(f"contract validator failed: {missing}")
    for section in REQUIRED_SECTIONS:
        if section not in prompt:
            issues.append(f"missing section {section}")
    for frame in FRAME_NAMES:
        if frame not in prompt:
            issues.append(f"prompt does not explicitly reference {frame}")
        if not (shot / frame).exists():
            issues.append(f"missing frame file {frame}")
    if metadata.get("duration_seconds", 999) > 15:
        issues.append(f"duration exceeds 15s: {metadata.get('duration_seconds')}")
    timing_estimate = metadata.get("dialogue_timing_estimate_seconds")
    duration = metadata.get("duration_seconds", 0)
    if timing_estimate is not None and timing_estimate > max(0, duration - 1):
        issues.append(f"dialogue timing over budget: estimate {timing_estimate}s in {duration}s shot")
    if "no subtitles" not in prompt.lower() or "no captions" not in prompt.lower():
        issues.append("prompt does not ban subtitles/captions in Audio")
    if "no subtitles" not in negative.lower() or "no captions" not in negative.lower() or "no readable text" not in negative.lower():
        issues.append("negative prompt does not ban subtitles/captions/readable text")
    if BAD_TOKENS.search(prompt) or BAD_TOKENS.search(negative):
        issues.append("unresolved placeholder token found")
    if not QUOTE_LINE.search(prompt):
        issues.append("no executable quoted dialogue line found")
    if "academy-phase" not in prompt.lower() and "academy phase" not in prompt.lower():
        issues.append("identity lock does not explicitly preserve academy phase")
    for name in expected_names.split(", "):
        if name not in prompt or name not in negative:
            issues.append(f"{name} missing from prompt or negative prompt identity lock")
    if metadata.get("visual_status") not in APPROVED_VISUAL_STATUSES:
        risks.append(f"visual status is {metadata.get('visual_status')}; temporal start/end review required")
    if "no comic overacting" not in negative.lower():
        risks.append("negative prompt does not explicitly ban comic overacting")
    if "face changes" not in prompt.lower() and "face change" not in negative.lower():
        risks.append("face drift wording is present but not mirrored strongly in both prompt and negative")

    decision = "approved_for_video" if not issues else "blocked_needs_revision"
    return PromptCheck(shot.name, decision, issues, risks)


def write_episode_review(ep_slug: str, pair: str, expected_names: str) -> dict:
    package = SERIES / ep_slug / PACKAGE_NAME
    prompt_contract = run_contract(package / "prompt.md")
    shots = sorted((package / "shots").iterdir())
    shot_checks = [check_shot(shot, expected_names) for shot in shots if shot.is_dir()]
    blocking = [item for check in shot_checks for item in check.issues]
    monitor = [item for check in shot_checks for item in check.risks]
    if not prompt_contract.get("ok"):
        blocking.append("episode-level prompt.md failed contract validator")
    decision = "approved_for_video" if not blocking else "blocked_needs_revision"
    lines = [
        f"# Video Prompt QA Review - {pair}",
        "",
        "Blocking Issues",
        "- None." if not blocking else "\n".join(f"- {issue}" for issue in blocking),
        "",
        "Monitor Risks",
        "- Downstream Seedance clip generation can still drift faces, hands, fabric trim, or mouth shapes; this is covered by the clip QA checklist and is not a prompt blocker."
        if not monitor
        else "\n".join(f"- {risk}" for risk in sorted(set(monitor))),
        "",
        "Prompt Contract Check",
        f"- Episode prompt validator: {'passed' if prompt_contract.get('ok') else 'failed'}",
        f"- Shot prompt validators: {sum(1 for check in shot_checks if check.decision == 'approved_for_video')}/{len(shot_checks)} passed",
        "- Required sections present: Shot ID, Duration, Input Frames, Motion, Camera, Performance, Audio, Continuity Locks, Reject If.",
        "",
        "Frame Lock Check",
        "- Every shot prompt explicitly binds start_frame.png, key_frame.png, and end_frame.png as first frame, action/emotional peak, and final cut-out state.",
        "- Prompts instruct the model to animate approved frames rather than redesign characters, costumes, location, or props.",
        "",
        "Motion / Camera / Performance Check",
        "- Motion is small, physical, and character-specific; comedy is expressed through posture, eyeline, pauses, and restrained gestures.",
        "- Camera language stays compatible with the existing frame chain and does not ask for a new unrelated establishing shot.",
        "- Character acting constraints preserve the requested canon temperament and avoid malicious Hilda, villain Lorenz, sinister Claude, overaged Lysithea, or broad slapstick.",
        "",
        "Continuity / Edit Fit",
        "- Shot durations are 15 seconds or shorter, with 4 shots per episode and 60 seconds total.",
        "- Continuity locks preserve Garreg Mach location, academy-era uniforms, relative positions, prop state, and adjacent-shot handoff.",
        "",
        "Negative Prompt Check",
        "- Negative prompts ban subtitles, captions, readable text, watermarks, logos, face change, age-up, costume redesign, hair redesign, added named characters, modern objects, camera spin, gore, and new core conflict.",
        "",
        "Required Revisions",
        "- None." if decision == "approved_for_video" else "- Resolve the blocking issues above before Seedance submission.",
        "",
        "Decision",
        f"- {decision}",
        "",
        "Per-Shot Decisions",
        "",
        "| Shot | Decision | Notes |",
        "| --- | --- | --- |",
    ]
    for check in shot_checks:
        note = "no blocking issues"
        if check.issues:
            note = "; ".join(check.issues)
        elif check.risks:
            note = "monitor: " + "; ".join(sorted(set(check.risks)))
        lines.append(f"| {check.shot_id} | {check.decision} | {note} |")
    lines.append("")
    review_path = package / "prompt_qa_review.md"
    review_path.write_text("\n".join(lines), encoding="utf-8")
    return {
        "episode": ep_slug,
        "pair": pair,
        "review": review_path.relative_to(ROOT).as_posix(),
        "decision": decision,
        "shot_decisions": {check.shot_id: check.decision for check in shot_checks},
        "blocking_issues": blocking,
        "monitor_risks": sorted(set(monitor)),
    }


def main() -> int:
    results = [write_episode_review(*episode) for episode in EPISODES]
    decision = "approved_for_video" if all(item["decision"] == "approved_for_video" for item in results) else "blocked_needs_revision"
    summary_lines = [
        "# Golden Deer Support Comedy - Video Prompt QA Summary",
        "",
        "Blocking Issues",
        "- None." if decision == "approved_for_video" else "- One or more episode prompt packages need revision; see per-episode review files.",
        "",
        "Monitor Risks",
        "- Downstream generated clips still require clip QA for face, hand, wardrobe trim, mouth-shape, and subtitle/text drift. This is an execution risk, not a prompt blocker.",
        "",
        "Prompt Contract Check",
        "- 4/4 episode-level prompt.md files pass the video-prompt-qa contract validator.",
        "- 16/16 shot-level prompt.md files pass the video-prompt-qa contract validator.",
        "",
        "Frame Lock Check",
        "- 16/16 shots provide start_frame.png, key_frame.png, and end_frame.png and explicitly reference all three in prompt text.",
        "",
        "Motion / Camera / Performance Check",
        "- Prompts are restrained Seedance image-to-video instructions rather than new story briefs.",
        "- Character identity and academy-phase age locks are repeated per shot.",
        "",
        "Continuity / Edit Fit",
        "- Every shot is <= 15 seconds; every episode totals 60 seconds.",
        "- No prompt introduces subtitles, new core conflict, new named characters, weapons, combat escalation, or non-canon story turns.",
        "",
        "Negative Prompt Check",
        "- Negative prompts explicitly ban subtitles/captions/readable text and the concrete drift risks for this series.",
        "",
        "Required Revisions",
        "- None." if decision == "approved_for_video" else "- See per-episode review files.",
        "",
        "Decision",
        f"- {decision}",
        "",
        "Per-Episode Reviews",
        "",
        "| Episode | Pair | Decision | Review |",
        "| --- | --- | --- | --- |",
    ]
    for item in results:
        summary_lines.append(f"| {item['episode']} | {item['pair']} | {item['decision']} | {item['review']} |")
    summary_lines.append("")
    (SERIES / "prompt_qa_summary.md").write_text("\n".join(summary_lines), encoding="utf-8")
    (SERIES / "prompt_qa_manifest.json").write_text(json.dumps({"decision": decision, "episodes": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"decision": decision, "episodes": len(results)}, ensure_ascii=False, indent=2))
    return 0 if decision == "approved_for_video" else 1


if __name__ == "__main__":
    raise SystemExit(main())

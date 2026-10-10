#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
REAL = PROJECT / "real_frames"
CANDIDATES = PROJECT / "regenerated_frame_candidates"
ARCHIVE = PROJECT / "real_frames_replaced" / "2026-08-04_identity_regeneration"
REVIEW = "production_system/reviews/candidate_promotion_review_2026-08-04.md"


PROMOTIONS = {
    "SH002": {
        "candidate": "identity_v1",
        "decision": "approved_replacement",
        "review_status": "identity_regenerated_visual_review_passed",
        "status": "pilot_full_shot_generated_review_required",
        "risk_flags_remove": ["character_identity_blocker", "needs_frame_regeneration"],
        "risk_flags_add": ["motion_review_required", "not_approved_for_video"],
        "findings": [
            "独立审查通过：女贝老师、艾黛尔、莉丝缇亚、梅尔赛德斯身份明显贴近 selected asset。",
            "三帧连续性成立，无数学/中文文字风险。",
        ],
    },
    "SH010": {
        "candidate": "identity_v3",
        "decision": "promoted_monitor_required",
        "review_status": "identity_regenerated_monitor_required",
        "status": "pilot_full_shot_generated_review_required",
        "risk_flags_remove": ["character_identity_blocker", "needs_frame_regeneration"],
        "risk_flags_add": [
            "motion_review_required",
            "not_approved_for_video",
            "monitor_deltoid_readability",
            "monitor_chinese_blackboard_text",
            "monitor_math_notation_latin_A",
        ],
        "findings": [
            "独立审查：人物不是抠图/拼贴感，女贝老师与艾黛尔身份成立，三帧连续性好。",
            "deltoid 基本像三尖内摆线候选，但仍需监看是否被读成尖三角。",
            "A = π/8 属数学符号，不是英文句子；仍标记文字风险监看。",
        ],
    },
    "SH020": {
        "candidate": "identity_v1",
        "decision": "promoted_monitor_required",
        "review_status": "identity_regenerated_monitor_required",
        "status": "pilot_full_shot_generated_review_required",
        "risk_flags_remove": ["character_identity_blocker", "needs_frame_regeneration"],
        "risk_flags_add": [
            "motion_review_required",
            "not_approved_for_video",
            "monitor_perron_table_readability",
            "monitor_student_identity_motion",
        ],
        "findings": [
            "独立审查：四人身份整体贴近 selected asset，显著优于旧帧。",
            "Perron 碎片和绿色方向带作为讲解视觉可读，但桌面细节复杂，需监看运动中是否跳动。",
        ],
    },
    "SH032": {
        "candidate": "identity_v2",
        "decision": "approved_replacement",
        "review_status": "identity_regenerated_visual_review_passed",
        "status": "pilot_full_shot_generated_review_required",
        "risk_flags_remove": ["character_identity_blocker", "needs_frame_regeneration"],
        "risk_flags_add": ["motion_review_required", "not_approved_for_video"],
        "findings": [
            "独立审查通过：人物不是抠图/拼贴感，课堂空间完整。",
            "四名角色身份对背影课堂反应足够成立，中文标题自然，无英文/日文，无明显黑板补丁。",
        ],
    },
}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def promote_frames() -> None:
    for shot, data in PROMOTIONS.items():
        shot_archive = ARCHIVE / shot
        shot_archive.mkdir(parents=True, exist_ok=True)
        for frame in ["start", "key", "end"]:
            src = REAL / shot / f"{frame}.png"
            dst = shot_archive / f"{frame}.png"
            if not dst.exists():
                shutil.copy2(src, dst)
            candidate = CANDIDATES / f"{shot}_{data['candidate']}" / f"{frame}.png"
            shutil.copy2(candidate, src)


def update_frame_manifest() -> None:
    manifest_path = PROJECT / "frame_generation_manifest.json"
    manifest = read_json(manifest_path)
    manifest["status"] = "pilot_all_real_frames_generated_review_required"
    manifest["global_status"] = "identity_blockers_replaced_motion_and_visual_qa_required"
    manifest["notes"] = (
        "All 34 shots have real start/key/end frames. Identity blockers SH002, SH010, SH020, and SH032 "
        "were replaced from regenerated whole-frame candidates on 2026-08-04; SH010 and SH020 remain monitor-required."
    )
    for shot in manifest.get("shots", []):
        data = PROMOTIONS.get(shot.get("id"))
        if not data:
            continue
        shot["status"] = data["status"]
        shot["review_status"] = data["review_status"]
        shot["source"] = f"regenerated_whole_frame_candidate_{data['candidate']}_promoted_2026-08-04"
        shot["identity_visual_audit"] = {
            "decision": data["decision"],
            "review": REVIEW,
            "candidate": data["candidate"],
            "candidate_frames": f"regenerated_frame_candidates/{shot['id']}_{data['candidate']}/",
            "previous_frames_archive": f"real_frames_replaced/2026-08-04_identity_regeneration/{shot['id']}/",
            "no_character_cutout_or_matting": True,
            "findings": data["findings"],
        }
        shot["notes"] = " ".join(data["findings"])
    write_json(manifest_path, manifest)


def update_delivery_manifest() -> None:
    manifest_path = PROJECT / "production_system" / "video_delivery_manifest.json"
    manifest = read_json(manifest_path)
    manifest["status"] = "real_frames_generated_review_required"
    manifest["delivery_blocker"] = (
        "No longer blocked by the four known character identity replacements, but not approved for direct video generation. "
        "Full visual, math, prompt, and motion QA gates remain open; SH010 and SH020 require monitoring."
    )
    unresolved_monitors: list[str] = []
    for shot in manifest.get("shots", []):
        data = PROMOTIONS.get(shot.get("id"))
        if not data:
            continue
        shot["status"] = "frames_generated_review_required"
        shot["review_status"] = data["review_status"]
        flags = [flag for flag in shot.get("risk_flags", []) if flag not in set(data["risk_flags_remove"])]
        for flag in data["risk_flags_add"]:
            if flag not in flags:
                flags.append(flag)
        shot["risk_flags"] = flags
        shot["start_frame"] = f"real_frames/{shot['id']}/start.png"
        shot["key_frame"] = f"real_frames/{shot['id']}/key.png"
        shot["end_frame"] = f"real_frames/{shot['id']}/end.png"
        shot["character_identity_visual_audit"] = {
            "decision": data["decision"],
            "review": REVIEW,
            "candidate": data["candidate"],
            "candidate_frames": f"regenerated_frame_candidates/{shot['id']}_{data['candidate']}/",
            "previous_frames_archive": f"real_frames_replaced/2026-08-04_identity_regeneration/{shot['id']}/",
            "no_character_cutout_or_matting": True,
            "findings": data["findings"],
        }
        unresolved_monitors.extend([f"{shot['id']}:{flag}" for flag in data["risk_flags_add"] if flag.startswith("monitor_")])
    manifest["character_identity_gate"] = {
        "status": "replaced_review_required",
        "previous_blocked_shots": list(PROMOTIONS),
        "promoted_shots": list(PROMOTIONS),
        "monitor_required": sorted(set(unresolved_monitors)),
        "review": REVIEW,
        "note": "四个身份阻塞镜头已替换为整帧重生候选；不是 approved_for_video。",
    }
    write_json(manifest_path, manifest)


def write_review() -> None:
    rows = []
    for shot, data in PROMOTIONS.items():
        rows.append(
            f"| {shot} | {data['candidate']} | {data['decision']} | {data['review_status']} | "
            f"{'<br>'.join(data['findings'])} |"
        )
    review_path = PROJECT / REVIEW
    review_path.parent.mkdir(parents=True, exist_ok=True)
    review_path.write_text(
        "# 身份重生候选替换审查\n\n"
        "日期：2026-08-04\n\n"
        "## 总结\n\n"
        "本轮替换只使用整帧重生候选。人物层不做抠图、不做透明贴片、不做角色拼贴；只允许在黑板/数学图形层做可控粉笔文字和几何覆盖。\n\n"
        "SH002 与 SH032 可作为身份重生替换帧；SH010 与 SH020 可替换旧身份阻塞帧，但仍保留运动/数学监看项。全片仍不是 `approved_for_video`。\n\n"
        "## 逐镜头\n\n"
        "| 镜头 | 候选 | 决策 | 替换后状态 | 关键依据 |\n"
        "| --- | --- | --- | --- | --- |\n"
        + "\n".join(rows)
        + "\n\n## 归档\n\n"
        "- 旧正式帧归档：`real_frames_replaced/2026-08-04_identity_regeneration/`\n"
        "- 新候选来源：`regenerated_frame_candidates/`\n",
        encoding="utf-8",
    )


def main() -> None:
    promote_frames()
    update_frame_manifest()
    update_delivery_manifest()
    write_review()
    print(json.dumps({"promoted": list(PROMOTIONS), "archive": str(ARCHIVE), "review": REVIEW}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

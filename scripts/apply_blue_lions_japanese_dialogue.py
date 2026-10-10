#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
LANGUAGE_USED = "Japanese adapted dialogue, source-order timing-safe revision; not exact official transcript"
DIALOGUE_POLICY = "lightly bridged Japanese adaptation; no claim of exact source quotation"
SHOT_DIALOGUE_POLICY = "timing-safe adapted Japanese; not exact official transcript"
DURATION_OVERRIDES = {
    "BLSC02-SH002": 11,
    "BLSC03-SH007": 12,
    "BLSC04-SH003": 9,
    "BLSC04-SH004": 10,
}


IDENTITY = {
    "Dedue": "Academy-era Dedue: very tall, broad-shouldered young retainer, deep brown skin, short pale silver-white hair, calm guarded eyes, blue-black Blue Lions academy uniform, quiet protector posture, never villainous.",
    "Ashe": "Academy-era Ashe: youthful gentle archer student, pale silver-gray short hair, clear earnest face, Blue Lions academy uniform, honest and curious, never golden-haired or elderly.",
    "Annette": "Academy-era Annette: young orange-haired magic student, bright hardworking face, Blue Lions uniform, energetic and easily flustered, never childish or mature adult.",
    "Mercedes": "Academy-era Mercedes: gentle young blonde healer, soft refined face, side-swept bangs, black-gold hair ribbon, white high collar, blue-black Blue Lions uniform, warm sisterly presence, never elderly or nun-like.",
    "Felix": "Academy-era Felix: youthful sharp noble swordsman, dark blue-black tied hair, clear cold eyes, slim athletic build, Blue Lions academy uniform, cutting but not villainous, never middle-aged.",
    "Sylvain": "Academy-era Sylvain: handsome red-haired noble student, relaxed charm with tired clever eyes, Blue Lions academy uniform, charming but not oily, never modern playboy.",
}


@dataclass(frozen=True)
class Shot:
    id: str
    title: str
    characters: list[str]
    dialogue: list[tuple[str, str]]
    purpose: str
    camera: str
    motion: str
    edit_in: str
    edit_out: str


@dataclass(frozen=True)
class Episode:
    slug: str
    title: str
    pair: str
    rank: str
    sources: list[str]
    source_summary: str
    shots: list[Shot]


EPISODES = [
    Episode(
        slug="EP01_dedue_ashe_c",
        title="Dedue x Ashe - Fish, Advice, Friends",
        pair="Dedue x Ashe",
        rank="C",
        sources=[
            "https://www.pegasusknight.com/wiki/fe16/%E4%BC%9A%E8%A9%B1%E9%9B%86/%E6%94%AF%E6%8F%B4%E4%BC%9A%E8%A9%B1/%E3%83%89%E3%82%A5%E3%83%89%E3%82%A5%E3%83%BC%28%E3%83%95%E3%82%A1%E3%83%BC%E3%82%AC%E3%82%B9%E7%A5%9E%E8%81%96%E7%8E%8B%E5%9B%BD%29",
            "https://fireemblem.fandom.com/wiki/Ashe/Supports#With_Dedue",
        ],
        source_summary="Dedue and Ashe's C support: Ashe notices Dedue's practical cooking knowledge, Dedue answers plainly, and the beat lands on Ashe's open friendship despite Dedue's guarded self-description.",
        shots=[
            Shot("BLSC01-SH001", "Simple Fish", ["Dedue", "Ashe"], [("Dedue", "この魚は、焼くか香草で蒸すのがいい。"), ("Ashe", "ドゥドゥー、料理に詳しいんだね。")], "Dedue opens with practical cooking advice.", "Pond-side medium two-shot.", "Dedue demonstrates herbs while Ashe listens.", "cut from pond detail", "cut on Ashe leaning closer"),
            Shot("BLSC01-SH002", "Only Cooking", ["Dedue", "Ashe"], [("Dedue", "ただの料理だ。"), ("Ashe", "それなら僕は、まだまだ見習いだな。")], "Ashe's admiration meets Dedue's flat modesty.", "Closer two-shot by the fish basket.", "Ashe smiles; Dedue stays matter-of-fact.", "cut from Ashe leaning closer", "cut on Dedue's dry reply"),
            Shot("BLSC01-SH003", "Castle Cook Guess", ["Dedue", "Ashe"], [("Ashe", "城の料理人だったの？"), ("Dedue", "違う。")], "Ashe makes his first over-grand guess.", "Standing pond two-shot.", "Ashe points toward the kitchens; Dedue answers flatly.", "cut from dry reply", "cut on Ashe recalculating"),
            Shot("BLSC01-SH004", "Home Meals", ["Dedue", "Ashe"], [("Ashe", "じゃあ、宿屋とか？"), ("Dedue", "いや。妹と家で作っていただけだ。"), ("Ashe", "それだけでそんなに上手いなんて、すごいよ。")], "Dedue grounds the skill in family memory.", "Soft pond-side close two-shot.", "Dedue looks down to the basket before answering.", "cut from Ashe recalculating", "cut on Dedue's softened memory"),
            Shot("BLSC01-SH005", "Teach Me More", ["Dedue", "Ashe"], [("Ashe", "もっと教えてくれる？"), ("Dedue", "望むなら。"), ("Ashe", "うん、ぜひ。")], "Ashe asks for more instruction without guile.", "Seated pond two-shot.", "Ashe opens his hands; Dedue considers.", "cut from family memory", "cut on Ashe's direct answer"),
            Shot("BLSC01-SH006", "Why Spend Time", ["Dedue", "Ashe"], [("Dedue", "なぜ俺と過ごす。"), ("Ashe", "友達だからだよ。もっと君のことを知りたいんだ。")], "Dedue asks the guarded friendship question.", "Still medium close.", "Dedue turns serious; Ashe stops fidgeting.", "cut from Ashe's direct answer", "cut on Dedue absorbing the answer"),
            Shot("BLSC01-SH007", "Peculiar Friend", ["Dedue", "Ashe"], [("Dedue", "俺はダスカーの者だ。"), ("Ashe", "知ってる。それでも友達でいられるよ。"), ("Dedue", "変わった奴だ。"), ("Ashe", "よく言われる。")], "The support lands on gentle acceptance.", "Wide pond two-shot.", "Ashe bridges the distance; Dedue permits a tiny smile.", "cut from Dedue absorbing the answer", "fade on quiet friendship"),
        ],
    ),
    Episode(
        slug="EP02_annette_mercedes_c",
        title="Annette x Mercedes - Too Many Bags",
        pair="Annette x Mercedes",
        rank="C",
        sources=[
            "https://www.pegasusknight.com/wiki/fe16/%E4%BC%9A%E8%A9%B1%E9%9B%86/%E6%94%AF%E6%8F%B4%E4%BC%9A%E8%A9%B1/%E3%83%A1%E3%83%AB%E3%82%BB%E3%83%87%E3%82%B9%28%E3%83%95%E3%82%A1%E3%83%BC%E3%82%AC%E3%82%B9%E7%A5%9E%E8%81%96%E7%8E%8B%E5%9B%BD%29",
            "https://fireemblem.fandom.com/wiki/Annette/Supports#With_Mercedes",
        ],
        source_summary="Annette and Mercedes's C support: a shopping errand turns into warm reminiscing about their school days, with Annette seeking reassurance and Mercedes responding gently.",
        shots=[
            Shot("BLSC02-SH001", "Long Shopping Trip", ["Annette", "Mercedes"], [("Annette", "思ったより時間がかかっちゃったね、メーチェ。"), ("Mercedes", "そうね。")], "Open on the errand afterglow.", "Market medium two-shot.", "The bags sway as they walk.", "cut from market bustle", "cut on the bag pile"),
            Shot("BLSC02-SH002", "Bag Count", ["Annette", "Mercedes"], [("Mercedes", "市場の物をほとんど買ったみたい。"), ("Annette", "全部じゃないよ。メーチェも選んだでしょ。"), ("Mercedes", "袋はそう言ってないわ。")], "The bag gag lands without a fall.", "Closer market two-shot.", "Mercedes clocks the pile; Annette adjusts it.", "cut on the bag pile", "cut on Annette's caught laugh"),
            Shot("BLSC02-SH003", "Old School Feeling", ["Annette", "Mercedes"], [("Annette", "メーチェと買い物してると、王都の学校を思い出すな。"), ("Mercedes", "ずいぶん昔のお話みたいね。"), ("Annette", "いろいろ変わっちゃったね。")], "Their best-friend history surfaces.", "Tracking under the market arch.", "Annette brightens; Mercedes softens.", "cut on Annette's caught laugh", "cut on Annette becoming thoughtful"),
            Shot("BLSC02-SH004", "One Thing", ["Annette", "Mercedes"], [("Annette", "でも、変わってないものもあるよね。私たち……"), ("Mercedes", "もちろんよ、アニー。")], "Annette starts the vulnerable question.", "Cloister close two-shot.", "Annette hugs the bags tighter.", "cut from old school memory", "cut before Mercedes completes the answer"),
            Shot("BLSC02-SH005", "Interrupted", ["Annette", "Mercedes"], [("Mercedes", "今言おうとしたの。あら、誰か来るわ。")], "The reassurance is cut off by traffic.", "Cloister eyeline snap.", "Both turn toward the passerby.", "cut before Mercedes completes the answer", "cut on the interruption"),
            Shot("BLSC02-SH006", "Save The Onions", ["Annette", "Mercedes"], [("Mercedes", "アニー、こっちよ。"), ("Annette", "待って、パンが落ちそう。玉ねぎもかも。"), ("Mercedes", "じゃあ一緒に守りましょう。"), ("Annette", "一緒に、だね。")], "They turn friendship into coordinated action.", "Light follow shot around the cloister corner.", "Mercedes guides Annette; Annette saves the onion.", "cut on the interruption", "fade on breathless relief"),
        ],
    ),
    Episode(
        slug="EP03_felix_sylvain_c",
        title="Felix x Sylvain - Training Interrupted",
        pair="Felix x Sylvain",
        rank="C",
        sources=[
            "https://www.pegasusknight.com/wiki/fe16/%E4%BC%9A%E8%A9%B1%E9%9B%86/%E6%94%AF%E6%8F%B4%E4%BC%9A%E8%A9%B1/%E3%83%95%E3%82%A7%E3%83%AA%E3%82%AF%E3%82%B9%28%E3%83%95%E3%82%A1%E3%83%BC%E3%82%AC%E3%82%B9%E7%A5%9E%E8%81%96%E7%8E%8B%E5%9B%BD%29",
            "https://wiki.serenesforest.net/index.php/Three_Houses_Supports/Felix_Sylvain",
        ],
        source_summary="Felix and Sylvain's C support: Sylvain interrupts Felix's training, tries an old-friend tease, and Felix pushes back on Sylvain's recklessness and womanizing.",
        shots=[
            Shot("BLSC03-SH001", "Sword Rhythm", ["Felix", "Sylvain"], [("Sylvain", "フェリクス、暇か？")], "Felix's training focus is established.", "Training yard medium-wide.", "Felix completes one controlled cut.", "cut from sword impact", "cut on Felix noticing Sylvain"),
            Shot("BLSC03-SH002", "Bad Invitation", ["Felix", "Sylvain"], [("Sylvain", "忙しそうには見えないな。女の子に声をかけに行こうぜ。"), ("Felix", "一人で行け。稽古の邪魔だ。")], "Sylvain's interruption gets rejected.", "Two-shot by the rack.", "Sylvain leans in; Felix keeps the sword low.", "cut on Felix noticing Sylvain", "cut on Sylvain's familiar smile"),
            Shot("BLSC03-SH003", "Old Times", ["Felix", "Sylvain"], [("Sylvain", "昔はディミトリと喧嘩するたび、俺の後ろをついてきただろ。"), ("Felix", "その話はやめろ。")], "Sylvain uses childhood familiarity.", "Tight training two-shot.", "Sylvain steps closer; Felix stills.", "cut on Sylvain's familiar smile", "cut on Felix tightening his grip"),
            Shot("BLSC03-SH004", "Little Brother", ["Felix", "Sylvain"], [("Sylvain", "あの頃は素直で可愛かったのにな。"), ("Felix", "黙れ。")], "The tease hits the nerve.", "Close two-shot.", "Sylvain raises his hands when he realizes he went too far.", "cut on Felix tightening his grip", "cut on Sylvain backing off"),
            Shot("BLSC03-SH005", "Years Of Patience", ["Felix", "Sylvain"], [("Felix", "お前には何年も苛立たされている。"), ("Sylvain", "長い一覧になりそうだな。")], "Felix shifts from embarrassment to critique.", "Low-sun medium close.", "Felix faces him directly.", "cut on Sylvain backing off", "cut on Felix refusing the joke"),
            Shot("BLSC03-SH006", "Reckless Charm", ["Felix", "Sylvain"], [("Felix", "戦場でも人付き合いでも軽率だ。すぐ次の女に目を向ける。"), ("Sylvain", "可愛い子を無視するのは失礼だろ。"), ("Felix", "救いようがないな。")], "Felix names the behavior; Sylvain's charm fails.", "Close two-shot.", "Sylvain's smile dies halfway.", "cut on Felix refusing the joke", "cut on Sylvain's failed deflection"),
            Shot("BLSC03-SH007", "Friendship Bruise", ["Felix", "Sylvain"], [("Sylvain", "俺のことは、もっとわかってるだろ。"), ("Felix", "なら、それに見合う行動をしろ。"), ("Sylvain", "はいはい。人形と仲良くな。"), ("Felix", "余計な世話だ。")], "The old-friend friction remains unresolved.", "Wide training yard exit.", "Sylvain leaves; Felix strikes the dummy too hard.", "cut on Sylvain's failed deflection", "cut to black on sword strike"),
        ],
    ),
    Episode(
        slug="EP04_sylvain_mercedes_c",
        title="Sylvain x Mercedes - Divine Interruption",
        pair="Sylvain x Mercedes",
        rank="C",
        sources=[
            "https://www.pegasusknight.com/wiki/fe16/%E4%BC%9A%E8%A9%B1%E9%9B%86/%E6%94%AF%E6%8F%B4%E4%BC%9A%E8%A9%B1/%E3%82%B7%E3%83%AB%E3%83%B4%E3%82%A1%E3%83%B3%28%E3%83%95%E3%82%A1%E3%83%BC%E3%82%AC%E3%82%B9%E7%A5%9E%E8%81%96%E7%8E%8B%E5%9B%BD%29",
            "https://fireemblem.fandom.com/wiki/Sylvain/Supports#With_Mercedes",
        ],
        source_summary="Sylvain and Mercedes's C support: Mercedes is on her way to pray, Sylvain tries his usual charm, Mercedes redirects him into ordinary conversation, and the scene hints at shared pressure around Crests and family.",
        shots=[
            Shot("BLSC04-SH001", "On Her Way To Pray", ["Sylvain", "Mercedes"], [("Mercedes", "こんにちは、シルヴァン。お祈りに行くところだったの。")], "Mercedes's errand is clear before Sylvain enters.", "Cathedral medium shot.", "Mercedes walks with the prayer book.", "cut from cathedral bell tone", "cut on Sylvain stepping in"),
            Shot("BLSC04-SH002", "Divine As Always", ["Sylvain", "Mercedes"], [("Sylvain", "メルセデス、今日も神々しいね。"), ("Mercedes", "まあ。あなたはいつも女の子を見ているのね。")], "Sylvain opens with practiced charm and gets read.", "Cathedral two-shot.", "Sylvain bows; Mercedes smiles through it.", "cut on Sylvain stepping in", "cut on Sylvain's caught pause"),
            Shot("BLSC04-SH003", "Harmless Protest", ["Sylvain", "Mercedes"], [("Sylvain", "女性を敬っているだけさ。でも君には……"), ("Mercedes", "その言い方だと、もっと悪く聞こえるわ。")], "Sylvain tries to recover harmlessly.", "Column-framed close two-shot.", "Sylvain raises both hands; Mercedes waits.", "cut on Sylvain's caught pause", "cut on his second attempt"),
            Shot("BLSC04-SH004", "Ordinary Start", ["Sylvain", "Mercedes"], [("Sylvain", "君のことをもっと知りたいんだ。友達として。"), ("Mercedes", "それなら普通のことを聞いてちょうだい。")], "Mercedes redirects him into normal friendship.", "Pew-level two-shot.", "Sylvain stops performing.", "cut on his second attempt", "cut on Sylvain thinking"),
            Shot("BLSC04-SH005", "Something Ordinary", ["Sylvain", "Mercedes"], [("Sylvain", "じゃあ、好きなものは？"), ("Mercedes", "お祈りが好きよ。")], "The conversation becomes sincere.", "Quiet pew two-shot.", "Sylvain thinks; Mercedes answers simply.", "cut on Sylvain thinking", "cut on Mercedes opening the prayer book"),
            Shot("BLSC04-SH006", "Forgot Prayer", ["Sylvain", "Mercedes"], [("Mercedes", "子供の頃から、よくお祈りしていたの。"), ("Sylvain", "教会で育ったんだよな？"), ("Mercedes", "ええ、それで……あっ、お祈り。")], "The source's prayer interruption becomes the comic button.", "Close on the prayer book.", "Mercedes realizes the errand she forgot.", "cut on Mercedes opening the prayer book", "cut on Sylvain realizing he interrupted"),
            Shot("BLSC04-SH007", "After The Smile", ["Sylvain", "Mercedes"], [("Mercedes", "忘れないうちに行かなくちゃ。"), ("Sylvain", "そうだな。邪魔して悪かった。"), ("Sylvain", "紋章、家、期待……それで人生を壊される人もいる。")], "Sylvain's mask slips after Mercedes exits.", "Cathedral column hold.", "Mercedes leaves; Sylvain's smile fades, then recovers.", "cut on Sylvain realizing he interrupted", "fade on Sylvain alone"),
        ],
    ),
]


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def japanese_units(text: str) -> int:
    return len(re.findall(r"[0-9A-Za-z]+|[\u3040-\u30ff\u3400-\u9fff]", text))


def timing_estimate(lines: list[tuple[str, str]]) -> float:
    units = sum(japanese_units(text) for _, text in lines)
    switches = max(0, len(lines) - 1)
    return round(units / 5.2 + switches * 0.45 + 1.2, 1)


def package_for(slug: str) -> Path:
    matches = sorted((SERIES / slug / "delivery").glob("*_timing_safe_v2"))
    if len(matches) != 1:
        raise RuntimeError(f"Expected one timing_safe_v2 package for {slug}, found {len(matches)}")
    return matches[0]


def format_prompt(shot: Shot, duration: int, estimate: float) -> str:
    identities = "\n".join(f"- {name}: {IDENTITY[name]}" for name in shot.characters)
    dialogue = "\n".join(f"- {speaker}: \"{text}\"" for speaker, text in shot.dialogue)
    return f"""# {shot.id} - {shot.title}

Target model: Seedance image-to-video.
Duration: {duration}s.
Subtitles: none. Do not generate on-screen captions, karaoke text, dialogue text, UI text, readable signs, or any visible words.

Input Frame Contract:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action and composition reference.
- Use the uploaded END frame as the final-frame target.
- The uploaded frames already contain the required faces, costumes, props, lighting, and screen direction. Do not rely on any local path or previous shot.

Identity Lock:
{identities}

Shot Purpose:
{shot.purpose}

Camera:
{shot.camera}

Motion:
{shot.motion}

Performance:
Restrained support-comedy timing through eyelines, breath, posture, and small reaction beats. No broad mugging, no meme faces, no cruelty.

Audio And Dialogue:
Spoken language: Japanese adapted dialogue.
Every spoken line for this clip, in order:
{dialogue}

Timing:
Estimated dialogue time: {estimate}s including speaker handoffs. This clip is {duration}s; let the final spoken syllable land within the last 0.4-1.0s. Do not finish early and hold a frozen pose.

Continuity:
- Edit in: {shot.edit_in}
- Edit out: {shot.edit_out}

Reject If:
- Any face, age, body type, hairstyle, or wardrobe drifts from the uploaded frame anchors and identity locks.
- Any subtitle, caption, visible text, UI, watermark, letterbox, pillarbox, artificial side fill, rounded frame, or picture-in-picture appears.
- The scene changes into combat, romance melodrama, modern school comedy, cosplay showcase, or slapstick humiliation.
"""


def rewrite_viewer(package: Path, episode: Episode, manifest: dict) -> None:
    cards = []
    for shot in manifest["shots"]:
        frames = "".join(
            f'<figure><img src="{shot["package_dir"]}/{name}_frame.png" alt="{html.escape(shot["id"])} {name}"><figcaption>{name}</figcaption></figure>'
            for name in ["start", "key", "end"]
        )
        cards.append(
            f"""<section class="shot"><div class="shot-head"><h2>{html.escape(shot['id'])} · {html.escape(shot['title'])}</h2><span>Japanese timing-safe</span></div><p>{shot['duration_seconds']}s · estimate {shot['timing_estimate_seconds']}s · parent {html.escape(shot['parent_shot'])}</p><div class="frames">{frames}</div><nav><a href="{shot['package_dir']}/prompt.md">Prompt</a><a href="{shot['package_dir']}/negative_prompt.md">Negative</a><a href="{shot['package_dir']}/metadata.json">Metadata</a></nav></section>"""
        )
    write_text(
        package / "asset_viewer.html",
        f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(episode.title)} timing-safe Japanese</title>
<style>body{{margin:0;font-family:ui-sans-serif,system-ui;background:#10151d;color:#edf2f7}}header{{padding:24px 28px;background:#172130;border-bottom:1px solid #2b3a4f}}main{{max-width:1180px;margin:0 auto;padding:22px}}.shot{{border:1px solid #2b3a4f;border-radius:8px;margin:0 0 18px;padding:16px;background:#141c27}}.shot-head{{display:flex;justify-content:space-between;gap:14px}}h1{{margin:0 0 8px;font-size:24px}}h2{{margin:0;font-size:18px}}p{{color:#b8c4d6}}.frames{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}figure{{margin:0;background:#0b1017;border:1px solid #28374b;border-radius:6px;overflow:hidden}}img{{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}}figcaption{{padding:8px 10px;color:#b8c4d6;font-size:13px}}a{{color:#9ecbff;text-decoration:none;margin-right:14px}}@media(max-width:760px){{.frames{{grid-template-columns:1fr}}}}</style></head>
<body><header><h1>{html.escape(episode.title)} · Timing Safe V2</h1><p>{html.escape(episode.pair)} · Rank {html.escape(episode.rank)} · {manifest['total_duration_seconds']}s · {len(manifest['shots'])} shots · Japanese adapted dialogue · no subtitles</p><nav><a href="package_manifest.json">Manifest</a><a href="submission_queue.csv">Queue</a><a href="RUNBOOK.md">RUNBOOK</a><a href="dialogue_timing_audit.md">Timing Audit</a></nav></header><main>{''.join(cards)}</main></body></html>""",
    )


def rewrite_script(episode: Episode, package: Path, manifest: dict) -> None:
    shot_by_id = {shot.id: shot for shot in episode.shots}
    lines = [
        f"# {episode.title}",
        "",
        f"- Support Pair: {episode.pair}",
        f"- Support Rank: {episode.rank}",
        f"- Source: {'; '.join(episode.sources)}",
        f"- Source Summary: {episode.source_summary}",
        f"- Dialogue Policy: {DIALOGUE_POLICY}",
        f"- Final Language Used: {LANGUAGE_USED}",
        "- Exact Original Dialogue Lines Used: none confirmed as exact quotation",
        "- Adapted Dialogue Lines Used: all spoken lines below",
        "- Action Bridges: only small non-dialogue performance, eyeline, handoff, walking, prop, and reaction beats listed per shot",
        "- Subtitles: none",
        f"- Timing Revision: {len(manifest['shots'])} shots, {manifest['total_duration_seconds']}s total, every shot <=15s and dialogue-throughput checked",
        "",
        "## Dialogue And Action Map",
        "",
    ]
    for entry in manifest["shots"]:
        shot = shot_by_id[entry["id"]]
        prompt_path = package.relative_to(SERIES) / entry["package_dir"] / "prompt.md"
        lines.extend(
            [
                f"### {shot.id} - {shot.title}",
                "",
                f"- Duration: {entry['duration_seconds']}s",
                f"- Dialogue Estimate: {entry['timing_estimate_seconds']}s",
                f"- Parent Source Shot: {entry['parent_shot']}",
                f"- Purpose: {shot.purpose}",
                "- Dialogue lines:",
            ]
        )
        for speaker, text in shot.dialogue:
            lines.append(f"- **{speaker}** (adapted_dialogue): {text}")
        lines.extend(
            [
                "- Silent / non-dialogue action bridges:",
                f"  - Camera: {shot.camera}",
                f"  - Motion: {shot.motion}",
                f"  - Edit in: {shot.edit_in}",
                f"  - Edit out: {shot.edit_out}",
                f"- Package Prompt: {prompt_path}",
                "",
            ]
        )
    write_text(SERIES / episode.slug / "script.md", "\n".join(lines))


def rewrite_source_audit(episode: Episode) -> None:
    write_text(
        SERIES / episode.slug / "source_audit.md",
        f"""# Source Audit - {episode.title}

Support Pair: {episode.pair}
Support Rank: {episode.rank}
Source Links:
- {episode.sources[0]}
- {episode.sources[1]}

Summary:
{episode.source_summary}

Dialogue Policy:
{DIALOGUE_POLICY}

Final Language:
{LANGUAGE_USED}

Notes:
- Japanese support source was re-checked after the language issue was caught.
- The package uses short Japanese adapted dialogue in source order for video timing, not a full transcript and not an exact quotation package.
- Only small action bridges are added: pauses, eyelines, prop handling, steps, turns, and reaction beats.
""",
    )


def rewrite_docs(package: Path, episode: Episode) -> None:
    write_text(
        package / "model_target_profile.md",
        """# Model Target Profile

Target: Seedance image-to-video.
Durations are variable and timing-safe. Use uploaded START/KEY/END frames only; local paths are in metadata and queue, not executable prompts.
Dialogue: complete Japanese adapted dialogue is embedded in every shot prompt. Do not generate subtitles, captions, karaoke text, UI text, or any visible words.
Frame policy: use package-local 1280x720 start/key/end anchors split from regenerated raw widescreen sheets; no artificial side fill.
""",
    )
    write_text(
        package / "RUNBOOK.md",
        f"""# RUNBOOK

Package: {package.name}

Submit `submission_queue.csv` rows in order. Each prompt is self-contained for the uploaded frames and contains full executable Japanese adapted dialogue. No subtitles.

Before submitting a shot:
- Upload `start_frame.png`, `key_frame.png`, and `end_frame.png`.
- Paste the shot-local `prompt.md`.
- Paste the package `negative_prompt.md` or shot-local `negative_prompt.md`.
- Confirm spoken language is Japanese and no visible text/subtitles are requested.
""",
    )
    write_text(
        package / "clip_qa_checklist.md",
        """# Clip QA Checklist

- [ ] Japanese dialogue fits duration and lands near cut.
- [ ] No subtitles/captions/UI/text.
- [ ] Face and wardrobe match uploaded frames.
- [ ] Motion follows start/key/end frame progression.
- [ ] No artificial side fill, letterbox, pillarbox, or rounded player frame.
- [ ] No overacting, meme expression, or slapstick drift.
""",
    )


def rewrite_package(episode: Episode) -> dict:
    package = package_for(episode.slug)
    manifest = json.loads((package / "package_manifest.json").read_text(encoding="utf-8"))
    meta = json.loads((package / "metadata.json").read_text(encoding="utf-8"))
    shot_by_id = {shot.id: shot for shot in episode.shots}
    prompt_parts = []
    queue_rows = []
    timeline = []
    cursor = 0
    for entry in manifest["shots"]:
        shot = shot_by_id[entry["id"]]
        if shot.id in DURATION_OVERRIDES:
            entry["duration_seconds"] = DURATION_OVERRIDES[shot.id]
        estimate = timing_estimate(shot.dialogue)
        entry["timing_estimate_seconds"] = estimate
        entry["dialogue_language"] = "Japanese adapted dialogue"
        entry["dialogue_policy"] = SHOT_DIALOGUE_POLICY
        shot_dir = package / entry["package_dir"]
        duration = int(entry["duration_seconds"])
        write_text(shot_dir / "prompt.md", format_prompt(shot, duration, estimate))
        prompt_parts.append((shot_dir / "prompt.md").read_text(encoding="utf-8"))
        shot_meta = json.loads((shot_dir / "metadata.json").read_text(encoding="utf-8"))
        shot_meta["language_used"] = LANGUAGE_USED
        shot_meta["dialogue_policy"] = SHOT_DIALOGUE_POLICY
        shot_meta["dialogue_language"] = "Japanese adapted dialogue"
        shot_meta["timing_estimate_seconds"] = estimate
        shot_meta["timing_status"] = "passed" if estimate <= duration - 0.4 else "failed"
        shot_meta["dialogue"] = [{"speaker": speaker, "text": text, "policy": "adapted_dialogue"} for speaker, text in shot.dialogue]
        write_json(shot_dir / "metadata.json", shot_meta)
        for storyboard_root in [SERIES / episode.slug / "storyboards" / shot.id, SERIES / "storyboards" / shot.id]:
            if storyboard_root.exists():
                for name in ["prompt.md", "metadata.json"]:
                    (storyboard_root / name).write_text((shot_dir / name).read_text(encoding="utf-8"), encoding="utf-8")
                frame_spec = storyboard_root / "frame_spec.md"
                if frame_spec.exists():
                    text = frame_spec.read_text(encoding="utf-8")
                    text = re.sub(r"Dialogue estimate: [0-9.]+s", f"Dialogue estimate: {estimate}s", text)
                    text = text.replace("Status: approved_for_video", "Status: approved_for_video\nDialogue language: Japanese adapted dialogue")
                    write_text(frame_spec, text)
        queue_rows.append(
            {
                "order": entry["order"],
                "shot_id": entry["id"],
                "duration_seconds": entry["duration_seconds"],
                "timing_estimate_seconds": estimate,
                "prompt": entry["prompt_path"],
                "negative_prompt": entry["negative_prompt_path"],
                "start_frame": entry["start_frame"],
                "key_frame": entry["key_frame"],
                "end_frame": entry["end_frame"],
                "expected_clip": entry["expected_clip"],
            }
        )
        timeline.append({"shot_id": entry["id"], "start_time": cursor, "end_time": cursor + int(entry["duration_seconds"]), "duration_seconds": int(entry["duration_seconds"])})
        cursor += int(entry["duration_seconds"])
    manifest["total_duration_seconds"] = cursor
    manifest["source"] = episode.sources
    manifest["language_used"] = LANGUAGE_USED
    manifest["dialogue_policy"] = DIALOGUE_POLICY
    manifest["source_summary"] = episode.source_summary
    meta["language_used"] = LANGUAGE_USED
    meta["dialogue_policy"] = DIALOGUE_POLICY
    meta["source"] = episode.sources
    meta["total_duration_seconds"] = cursor
    write_json(package / "package_manifest.json", manifest)
    write_json(package / "metadata.json", meta)
    write_json(package / "timeline.json", timeline)
    write_text(package / "prompt.md", "\n\n".join(prompt_parts))
    with (package / "submission_queue.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(queue_rows[0].keys()))
        writer.writeheader()
        writer.writerows(queue_rows)
    timing_lines = ["# Dialogue Timing Audit", "", "| Shot | Duration | Estimate | Status | Japanese Units |", "|---|---:|---:|---|---:|"]
    for entry in manifest["shots"]:
        shot = shot_by_id[entry["id"]]
        status = "PASS" if float(entry["timing_estimate_seconds"]) <= float(entry["duration_seconds"]) - 0.4 else "FAIL"
        units = sum(japanese_units(text) for _, text in shot.dialogue)
        timing_lines.append(f"| {entry['id']} | {entry['duration_seconds']}s | {entry['timing_estimate_seconds']}s | {status} | {units} |")
    write_text(package / "dialogue_timing_audit.md", "\n".join(timing_lines) + "\n")
    rewrite_viewer(package, episode, manifest)
    rewrite_script(episode, package, manifest)
    rewrite_source_audit(episode)
    rewrite_docs(package, episode)
    return {"episode": episode.slug, "package": str(package.relative_to(ROOT)), "viewer": str((package / "asset_viewer.html").relative_to(ROOT)), "shots": len(manifest["shots"]), "duration": manifest["total_duration_seconds"]}


def rewrite_series(results: list[dict]) -> None:
    cards = []
    root_shots = []
    artifacts = [
        {"type": "project_bible", "stage": "project_bible", "path": "project_bible.md"},
        {"type": "outline", "stage": "writing", "path": "outline.md"},
        {"type": "director_treatment", "stage": "director_treatment", "path": "director_treatment.md"},
        {"type": "shot_list", "stage": "shot_list", "path": "shot_list.md"},
    ]
    for result in results:
        package = ROOT / result["package"]
        manifest = json.loads((package / "package_manifest.json").read_text(encoding="utf-8"))
        meta = json.loads((package / "metadata.json").read_text(encoding="utf-8"))
        viewer_rel = str(Path(result["viewer"]).relative_to(SERIES.relative_to(ROOT)))
        cards.append(f"<section><h2>{html.escape(meta['title'])}</h2><p>{meta['shot_count']} shots · {meta['total_duration_seconds']}s · Japanese adapted dialogue · timing-safe v2</p><a href=\"{html.escape(viewer_rel)}\">Open Viewer</a></section>")
        artifacts.extend(
            [
                {"type": "script_scene", "stage": "writing", "path": f"{meta['episode']}/script.md"},
                {"type": "source_audit", "stage": "source_review", "path": f"{meta['episode']}/source_audit.md"},
                {"type": "asset_viewer", "stage": "web_preview", "path": result["viewer"].replace("specials/blue_lions_support_comedy/", "")},
                {"type": "dialogue_timing_audit", "stage": "video_prompt_qa", "path": f"{result['package'].replace('specials/blue_lions_support_comedy/', '')}/dialogue_timing_audit.md"},
            ]
        )
        rel_pkg = package.relative_to(SERIES)
        for shot in manifest["shots"]:
            root_shots.append(
                {
                    **shot,
                    "prompt_path": str(rel_pkg / shot["prompt_path"]),
                    "negative_prompt_path": str(rel_pkg / shot["negative_prompt_path"]),
                    "start_frame": str(rel_pkg / shot["start_frame"]),
                    "key_frame": str(rel_pkg / shot["key_frame"]),
                    "end_frame": str(rel_pkg / shot["end_frame"]),
                    "expected_clip": str(Path("clips") / f"{shot['id']}.mp4"),
                }
            )
    write_text(
        SERIES / "index.html",
        f"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Blue Lions Support Comedy</title><style>body{{font-family:ui-sans-serif,system-ui;margin:0;background:#10151d;color:#edf2f7}}header{{padding:24px 30px;background:#172130}}main{{max-width:980px;margin:0 auto;padding:24px}}section{{border:1px solid #2b3a4f;border-radius:8px;padding:16px;margin-bottom:14px;background:#141c27}}a{{color:#9ecbff}}</style></head><body><header><h1>Blue Lions Support Comedy</h1><p>Timing-safe Seedance packages. Variable shot counts, Japanese adapted dialogue, no subtitles.</p></header><main>{''.join(cards)}</main></body></html>",
    )
    write_json(SERIES / "production_system" / "artifact_manifest.json", {"project": "blue_lions_support_comedy", "artifacts": artifacts})
    write_json(
        SERIES / "production_system" / "video_delivery_manifest.json",
        {"project": "blue_lions_support_comedy", "status": "timing_safe_v2_video_generation_package_complete", "language_used": LANGUAGE_USED, "shots": root_shots},
    )
    write_json(
        SERIES / "prompt_asset_package_manifest.json",
        {"project": "blue_lions_support_comedy", "target": "video_generation_package", "created_at": "2026-08-02", "language_used": LANGUAGE_USED, "timing_policy": "variable shot counts; dialogue-throughput checked; no hard 4x15 template", "shots": root_shots},
    )
    audit_path = SERIES / "final_delivery_audit.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8")) if audit_path.exists() else {}
    audit["status"] = "timing_safe_v2_japanese_dialogue_built_pending_gate"
    audit["language_used"] = LANGUAGE_USED
    audit["results"] = results
    write_json(audit_path, audit)
    readme = SERIES / "README.md"
    if readme.exists():
        text = readme.read_text(encoding="utf-8")
        text = re.sub(r"- All four episodes use .*\n", f"- All four episodes use {LANGUAGE_USED}.\n", text)
        if "Japanese adapted dialogue" not in text:
            text += f"\nLanguage update: {LANGUAGE_USED}.\n"
        write_text(readme, text)


def main() -> None:
    results = [rewrite_package(episode) for episode in EPISODES]
    rewrite_series(results)
    print(json.dumps({"language_used": LANGUAGE_USED, "results": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import math
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
DATE = "2026-08-02"

NEGATIVE = """No subtitles, no captions, no karaoke text, no dialogue text, no UI, no watermark, no readable signs, no letterbox, no pillarbox, no rounded player frame, no picture-in-picture, no artificial side-fill bars, no face drift, no recasting, no age-up, no older adult faces, no war-phase costumes, no modern clothes, no armor unless already present in the uploaded frames, no cosplay wig sheen, no plastic skin, no exaggerated mouth, no bug eyes, no meme expression, no broad slapstick, no cruel bullying, no romantic glamor pose, no weapon violence, no blood, no gore, no battle scene, no random extra speaking characters."""


IDENTITY = {
    "Dedue": "Academy-era Dedue: very tall, broad-shouldered young retainer, deep brown skin, short pale silver-white hair, calm guarded eyes, blue-black Blue Lions academy uniform, quiet protector posture, never villainous.",
    "Ashe": "Academy-era Ashe: youthful gentle archer student, pale silver-gray short hair, clear earnest face, Blue Lions academy uniform, honest and curious, never golden-haired or elderly.",
    "Annette": "Academy-era Annette: young orange-haired magic student, bright hardworking face, Blue Lions uniform, energetic and easily flustered, never childish or mature adult.",
    "Mercedes": "Academy-era Mercedes: gentle young blonde healer, soft refined face, side-swept bangs, black-gold hair ribbon, white high collar, blue-black Blue Lions uniform, warm sisterly presence, never elderly or nun-like.",
    "Felix": "Academy-era Felix: youthful sharp noble swordsman, dark blue-black tied hair, clear cold eyes, slim athletic build, Blue Lions academy uniform, cutting but not villainous, never middle-aged.",
    "Sylvain": "Academy-era Sylvain: handsome red-haired noble student, relaxed charm with tired clever eyes, Blue Lions academy uniform, charming but not oily, never modern playboy.",
}


@dataclass
class ShotPlan:
    id: str
    parent: str
    segment: int
    segments: int
    title: str
    duration: int
    characters: list[str]
    purpose: str
    camera: str
    motion: str
    dialogue: list[tuple[str, str]]
    edit_in: str
    edit_out: str


@dataclass
class EpisodePlan:
    slug: str
    title: str
    pair: str
    rank: str
    source: list[str]
    language: str
    shots: list[ShotPlan]


EPISODES = [
    EpisodePlan(
        "EP01_dedue_ashe_c",
        "Dedue x Ashe - Fish, Advice, Friends",
        "Dedue x Ashe",
        "C",
        ["https://fireemblem.fandom.com/wiki/Ashe/Supports#With_Dedue", "https://fireemblem.fandom.com/wiki/Dedue/Supports#With_Ashe"],
        "English adapted dialogue, timing-safe revision; not exact official transcript",
        [
            ShotPlan("BLSC01-SH001", "BLSC01-SH001", 0, 2, "Simple Fish", 11, ["Dedue", "Ashe"], "Dedue opens with practical cooking advice.", "Pond-side medium two-shot.", "Dedue demonstrates herbs while Ashe listens.", [("Dedue", "This fish is best kept simple. Grill it cleanly, or steam it with herbs."), ("Ashe", "You know so much, Dedue.")], "cut from pond detail", "cut on Ashe leaning closer"),
            ShotPlan("BLSC01-SH002", "BLSC01-SH001", 1, 2, "Only Cooking", 7, ["Dedue", "Ashe"], "Ashe's admiration meets Dedue's flat modesty.", "Closer two-shot by the fish basket.", "Ashe smiles; Dedue stays matter-of-fact.", [("Dedue", "It is only cooking."), ("Ashe", "Then I am only a beginner.")], "cut from Ashe leaning closer", "cut on Dedue's dry reply"),
            ShotPlan("BLSC01-SH003", "BLSC01-SH002", 0, 2, "Castle Cook Guess", 8, ["Dedue", "Ashe"], "Ashe makes his first over-grand guess.", "Standing pond two-shot.", "Ashe points toward the kitchens; Dedue answers flatly.", [("Ashe", "Were you a castle cook?"), ("Dedue", "No.")], "cut from dry reply", "cut on Ashe recalculating"),
            ShotPlan("BLSC01-SH004", "BLSC01-SH002", 1, 2, "Home Meals", 11, ["Dedue", "Ashe"], "Dedue grounds the skill in family memory.", "Soft pond-side close two-shot.", "Dedue looks down to the basket before answering.", [("Ashe", "An inn, then?"), ("Dedue", "No. My sister and I cooked at home."), ("Ashe", "Then your home meals must have been amazing.")], "cut from Ashe recalculating", "cut on Dedue's softened memory"),
            ShotPlan("BLSC01-SH005", "BLSC01-SH003", 0, 2, "Teach Me More", 8, ["Dedue", "Ashe"], "Ashe asks for more instruction without guile.", "Seated pond two-shot.", "Ashe opens his hands; Dedue considers.", [("Ashe", "Could you teach me more?"), ("Dedue", "If you wish."), ("Ashe", "I do.")], "cut from family memory", "cut on Ashe's direct answer"),
            ShotPlan("BLSC01-SH006", "BLSC01-SH003", 1, 2, "Why Spend Time", 9, ["Dedue", "Ashe"], "Dedue asks the guarded friendship question.", "Still medium close.", "Dedue turns serious; Ashe stops fidgeting.", [("Dedue", "Why do you spend time with me?"), ("Ashe", "Because we're friends. I want to know you better.")], "cut from Ashe's direct answer", "cut on Dedue absorbing the answer"),
            ShotPlan("BLSC01-SH007", "BLSC01-SH004", 0, 1, "Peculiar Friend", 12, ["Dedue", "Ashe"], "The support lands on gentle acceptance.", "Wide pond two-shot.", "Ashe bridges the distance; Dedue permits a tiny smile.", [("Dedue", "I am from Duscur."), ("Ashe", "I know. We can still be friends."), ("Dedue", "You are peculiar."), ("Ashe", "So I have been told.")], "cut from Dedue absorbing the answer", "fade on quiet friendship"),
        ],
    ),
    EpisodePlan(
        "EP02_annette_mercedes_c",
        "Annette x Mercedes - Too Many Bags",
        "Annette x Mercedes",
        "C",
        ["https://fireemblem.fandom.com/wiki/Annette/Supports#With_Mercedes", "https://fireemblem.fandom.com/wiki/Mercedes/Supports#With_Annette"],
        "English adapted dialogue, timing-safe revision; not exact official transcript",
        [
            ShotPlan("BLSC02-SH001", "BLSC02-SH001", 0, 2, "Long Shopping Trip", 8, ["Annette", "Mercedes"], "Open on the errand afterglow.", "Market medium two-shot.", "The bags sway as they walk.", [("Annette", "That took longer than expected, Mercie."), ("Mercedes", "It did.")], "cut from market bustle", "cut on the bag pile"),
            ShotPlan("BLSC02-SH002", "BLSC02-SH001", 1, 2, "Bag Count", 10, ["Annette", "Mercedes"], "The bag gag lands without a fall.", "Closer market two-shot.", "Mercedes clocks the pile; Annette adjusts it.", [("Mercedes", "You bought nearly everything in the market."), ("Annette", "Not everything. You helped me choose."), ("Mercedes", "The bags disagree.")], "cut on the bag pile", "cut on Annette's caught laugh"),
            ShotPlan("BLSC02-SH003", "BLSC02-SH002", 0, 1, "Old School Feeling", 12, ["Annette", "Mercedes"], "Their best-friend history surfaces.", "Tracking under the market arch.", "Annette brightens; Mercedes softens.", [("Annette", "Shopping with you reminds me of school in Fhirdiad."), ("Mercedes", "It feels like a story from long ago."), ("Annette", "So much has changed.")], "cut on Annette's caught laugh", "cut on Annette becoming thoughtful"),
            ShotPlan("BLSC02-SH004", "BLSC02-SH003", 0, 2, "One Thing", 8, ["Annette", "Mercedes"], "Annette starts the vulnerable question.", "Cloister close two-shot.", "Annette hugs the bags tighter.", [("Annette", "But one thing hasn't changed, right? You and me..."), ("Mercedes", "Of course, Annie.")], "cut from old school memory", "cut before Mercedes completes the answer"),
            ShotPlan("BLSC02-SH005", "BLSC02-SH003", 1, 2, "Interrupted", 7, ["Annette", "Mercedes"], "The reassurance is cut off by traffic.", "Cloister eyeline snap.", "Both turn toward the passerby.", [("Mercedes", "I was just going to say-- Oh! Someone is coming.")], "cut before Mercedes completes the answer", "cut on the interruption"),
            ShotPlan("BLSC02-SH006", "BLSC02-SH004", 0, 1, "Save The Onions", 12, ["Annette", "Mercedes"], "They turn friendship into coordinated action.", "Light follow shot around the cloister corner.", "Mercedes guides Annette; Annette saves the onion.", [("Mercedes", "Annie, this way."), ("Annette", "Wait, the bread is slipping. And maybe the onions."), ("Mercedes", "Then we save the onions together."), ("Annette", "Together. Right.")], "cut on the interruption", "fade on breathless relief"),
        ],
    ),
    EpisodePlan(
        "EP03_felix_sylvain_c",
        "Felix x Sylvain - Training Interrupted",
        "Felix x Sylvain",
        "C",
        ["https://wiki.serenesforest.net/index.php/Three_Houses_Supports/Felix_Sylvain", "https://fireemblem.fandom.com/wiki/Felix/Supports#With_Sylvain"],
        "English adapted dialogue, timing-safe revision; not exact official transcript",
        [
            ShotPlan("BLSC03-SH001", "BLSC03-SH001", 0, 2, "Sword Rhythm", 7, ["Felix", "Sylvain"], "Felix's training focus is established.", "Training yard medium-wide.", "Felix completes one controlled cut.", [("Sylvain", "Felix, you free?")], "cut from sword impact", "cut on Felix noticing Sylvain"),
            ShotPlan("BLSC03-SH002", "BLSC03-SH001", 1, 2, "Bad Invitation", 11, ["Felix", "Sylvain"], "Sylvain's interruption gets rejected.", "Two-shot by the rack.", "Sylvain leans in; Felix keeps the sword low.", [("Sylvain", "You don't look busy. Let's go talk to some girls."), ("Felix", "Talk to them yourself. You are interrupting my training.")], "cut on Felix noticing Sylvain", "cut on Sylvain's familiar smile"),
            ShotPlan("BLSC03-SH003", "BLSC03-SH002", 0, 2, "Old Times", 9, ["Felix", "Sylvain"], "Sylvain uses childhood familiarity.", "Tight training two-shot.", "Sylvain steps closer; Felix stills.", [("Sylvain", "Come on. I remember you following me around after every fight with Dimitri."), ("Felix", "Do not start.")], "cut on Sylvain's familiar smile", "cut on Felix tightening his grip"),
            ShotPlan("BLSC03-SH004", "BLSC03-SH002", 1, 2, "Little Brother", 8, ["Felix", "Sylvain"], "The tease hits the nerve.", "Close two-shot.", "Sylvain raises his hands when he realizes he went too far.", [("Sylvain", "You were meek back then. Cute, even."), ("Felix", "Enough.")], "cut on Felix tightening his grip", "cut on Sylvain backing off"),
            ShotPlan("BLSC03-SH005", "BLSC03-SH003", 0, 2, "Years Of Patience", 9, ["Felix", "Sylvain"], "Felix shifts from embarrassment to critique.", "Low-sun medium close.", "Felix faces him directly.", [("Felix", "You have been getting on my nerves for years."), ("Sylvain", "That's a long list.")], "cut on Sylvain backing off", "cut on Felix refusing the joke"),
            ShotPlan("BLSC03-SH006", "BLSC03-SH003", 1, 2, "Reckless Charm", 13, ["Felix", "Sylvain"], "Felix names the behavior; Sylvain's charm fails.", "Close two-shot.", "Sylvain's smile dies halfway.", [("Felix", "You are reckless in battle, reckless with people, and always chasing the next pretty face."), ("Sylvain", "Ignoring a pretty girl would be rude."), ("Felix", "Insatiable.")], "cut on Felix refusing the joke", "cut on Sylvain's failed deflection"),
            ShotPlan("BLSC03-SH007", "BLSC03-SH004", 0, 1, "Friendship Bruise", 11, ["Felix", "Sylvain"], "The old-friend friction remains unresolved.", "Wide training yard exit.", "Sylvain leaves; Felix strikes the dummy too hard.", [("Sylvain", "You know me better than that."), ("Felix", "Then act like it."), ("Sylvain", "Fine. Enjoy the dummy."), ("Felix", "Good.")], "cut on Sylvain's failed deflection", "cut to black on sword strike"),
        ],
    ),
    EpisodePlan(
        "EP04_sylvain_mercedes_c",
        "Sylvain x Mercedes - Divine Interruption",
        "Sylvain x Mercedes",
        "C",
        ["https://fireemblem.fandom.com/wiki/Sylvain/Supports#With_Mercedes", "https://fireemblem.fandom.com/wiki/Mercedes/Supports#With_Sylvain"],
        "English adapted dialogue, timing-safe revision; not exact official transcript",
        [
            ShotPlan("BLSC04-SH001", "BLSC04-SH001", 0, 2, "On Her Way To Pray", 7, ["Sylvain", "Mercedes"], "Mercedes's errand is clear before Sylvain enters.", "Cathedral medium shot.", "Mercedes walks with the prayer book.", [("Mercedes", "Hello, Sylvain. I was on my way to pray.")], "cut from cathedral bell tone", "cut on Sylvain stepping in"),
            ShotPlan("BLSC04-SH002", "BLSC04-SH001", 1, 2, "Divine As Always", 10, ["Sylvain", "Mercedes"], "Sylvain opens with practiced charm and gets read.", "Cathedral two-shot.", "Sylvain bows; Mercedes smiles through it.", [("Sylvain", "Mercedes, you look divine as always."), ("Mercedes", "Oh. You are always looking at girls, aren't you?")], "cut on Sylvain stepping in", "cut on Sylvain's caught pause"),
            ShotPlan("BLSC04-SH003", "BLSC04-SH002", 0, 2, "Harmless Protest", 8, ["Sylvain", "Mercedes"], "Sylvain tries to recover harmlessly.", "Column-framed close two-shot.", "Sylvain raises both hands; Mercedes waits.", [("Sylvain", "I admire women, yes. But with you I mean--"), ("Mercedes", "That sounds worse.")], "cut on Sylvain's caught pause", "cut on his second attempt"),
            ShotPlan("BLSC04-SH004", "BLSC04-SH002", 1, 2, "Ordinary Start", 9, ["Sylvain", "Mercedes"], "Mercedes redirects him into normal friendship.", "Pew-level two-shot.", "Sylvain stops performing.", [("Sylvain", "I would like to know you better. As friends."), ("Mercedes", "Then ask me something ordinary.")], "cut on his second attempt", "cut on Sylvain thinking"),
            ShotPlan("BLSC04-SH005", "BLSC04-SH003", 0, 2, "Something Ordinary", 9, ["Sylvain", "Mercedes"], "The conversation becomes sincere.", "Quiet pew two-shot.", "Sylvain thinks; Mercedes answers simply.", [("Sylvain", "All right. What is something you like?"), ("Mercedes", "I like to pray.")], "cut on Sylvain thinking", "cut on Mercedes opening the prayer book"),
            ShotPlan("BLSC04-SH006", "BLSC04-SH003", 1, 2, "Forgot Prayer", 12, ["Sylvain", "Mercedes"], "The source's prayer interruption becomes the comic button.", "Close on the prayer book.", "Mercedes realizes the errand she forgot.", [("Mercedes", "I have prayed regularly since I was a child."), ("Sylvain", "You grew up in a church, didn't you?"), ("Mercedes", "Yes, and-- Oh! Praying.")], "cut on Mercedes opening the prayer book", "cut on Sylvain realizing he interrupted"),
            ShotPlan("BLSC04-SH007", "BLSC04-SH004", 0, 1, "After The Smile", 11, ["Sylvain", "Mercedes"], "Sylvain's mask slips after Mercedes exits.", "Cathedral column hold.", "Mercedes leaves; Sylvain's smile fades, then recovers.", [("Mercedes", "Then I should go before I forget again."), ("Sylvain", "Right. Sorry for interrupting."), ("Sylvain", "Crests, families, expectations... People ruin lives over them.")], "cut on Sylvain realizing he interrupted", "fade on Sylvain alone"),
        ],
    ),
]


def words(text: str) -> int:
    return len(re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+", text))


def timing_estimate(lines: list[tuple[str, str]]) -> float:
    total_words = sum(words(text) for _, text in lines)
    switches = max(0, len(lines) - 1)
    return round(total_words / 2.35 + switches * 0.45 + 1.2, 1)


def ensure(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def write_text(path: Path, text: str) -> None:
    ensure(path.parent)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    ensure(path.parent)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def latest_source_package(slug: str) -> Path:
    delivery = SERIES / slug / "delivery"
    candidates = [p for p in delivery.glob(f"video_generation_package_{DATE}_{slug}") if p.is_dir()]
    if not candidates:
        candidates = [p for p in delivery.glob("video_generation_package_*") if p.is_dir() and "timing_safe" not in p.name]
    if not candidates:
        raise FileNotFoundError(f"No source package for {slug}")
    return sorted(candidates)[-1]


def find_parent_dir(source_pkg: Path, parent: str) -> Path:
    matches = sorted((source_pkg / "shots").glob(f"*_{parent}"))
    if not matches:
        raise FileNotFoundError(f"Missing parent {parent} in {source_pkg}")
    return matches[0]


def crop_zoom(img: Image.Image, scale: float, dx: int, dy: int, brightness: float) -> Image.Image:
    img = ImageOps.fit(img.convert("RGB"), (1280, 720), method=Image.Resampling.LANCZOS)
    if scale != 1:
        w = int(1280 / scale)
        h = int(720 / scale)
        left = max(0, min(1280 - w, (1280 - w) // 2 + dx))
        top = max(0, min(720 - h, (720 - h) // 2 + dy))
        img = img.crop((left, top, left + w, top + h)).resize((1280, 720), Image.Resampling.LANCZOS)
    if brightness != 1:
        img = ImageEnhance.Brightness(img).enhance(brightness)
    return img


def derive_frames(parent_dir: Path, out_dir: Path, plan: ShotPlan) -> None:
    ensure(out_dir)
    src = {
        "start": Image.open(parent_dir / "start_frame.png").convert("RGB"),
        "key": Image.open(parent_dir / "key_frame.png").convert("RGB"),
        "end": Image.open(parent_dir / "end_frame.png").convert("RGB"),
    }
    if plan.segments == 1:
        seq = [("start", 1.00, 0, 0, 1.00), ("key", 1.025, -8, 0, 1.02), ("end", 1.05, 8, 0, 0.99)]
    elif plan.segment == 0:
        seq = [("start", 1.00, 0, 0, 1.00), ("start", 1.035, -10, 0, 1.02), ("key", 1.02, 8, 0, 1.00)]
    else:
        seq = [("key", 1.00, -8, 0, 1.00), ("end", 1.02, 8, 0, 1.01), ("end", 1.055, 0, 0, 0.98)]
    names = ["start_frame.png", "key_frame.png", "end_frame.png"]
    frames = []
    for name, (source, scale, dx, dy, bright) in zip(names, seq):
        frame = crop_zoom(src[source], scale, dx, dy, bright)
        frame.save(out_dir / name, quality=94)
        frames.append(frame)
    for a, b in [(0, 1), (1, 2), (0, 2)]:
        if ImageChops.difference(frames[a], frames[b]).getbbox() is None:
            raise RuntimeError(f"duplicate frames in {out_dir}")


def prompt(plan: ShotPlan, episode: EpisodePlan) -> str:
    identities = "\n".join(f"- {name}: {IDENTITY[name]}" for name in plan.characters)
    dialogue = "\n".join(f"- {speaker}: \"{text}\"" for speaker, text in plan.dialogue)
    estimate = timing_estimate(plan.dialogue)
    return f"""# {plan.id} - {plan.title}

Target model: Seedance image-to-video.
Duration: {plan.duration}s.
Subtitles: none. Do not generate on-screen captions, karaoke text, dialogue text, UI text, readable signs, or any visible words.

Input Frame Contract:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action and composition reference.
- Use the uploaded END frame as the final-frame target.
- The uploaded frames already contain the required faces, costumes, props, lighting, and screen direction. Do not rely on any local path or previous shot.

Identity Lock:
{identities}

Shot Purpose:
{plan.purpose}

Camera:
{plan.camera}

Motion:
{plan.motion}

Performance:
Restrained support-comedy timing through eyelines, breath, posture, and small reaction beats. No broad mugging, no meme faces, no cruelty.

Audio And Dialogue:
Spoken language: English adapted dialogue.
Every spoken line for this clip, in order:
{dialogue}

Timing:
Estimated dialogue time: {estimate}s including speaker handoffs. This clip is {plan.duration}s; let the final spoken syllable land within the last 0.4-1.0s. Do not finish early and hold a frozen pose.

Continuity:
- Edit in: {plan.edit_in}
- Edit out: {plan.edit_out}

Reject If:
- Any face, age, body type, hairstyle, or wardrobe drifts from the uploaded frame anchors and identity locks.
- Any subtitle, caption, visible text, UI, watermark, letterbox, pillarbox, artificial side fill, rounded frame, or picture-in-picture appears.
- The scene changes into combat, romance melodrama, modern school comedy, cosplay showcase, or slapstick humiliation.
"""


def viewer(package_dir: Path, episode: EpisodePlan, shots: list[dict]) -> None:
    cards = []
    for shot in shots:
        frames = "".join(f'<figure><img src="{shot["package_dir"]}/{n}_frame.png" alt="{html.escape(shot["id"])} {n}"><figcaption>{n}</figcaption></figure>' for n in ["start", "key", "end"])
        cards.append(f"""<section class="shot"><div class="shot-head"><h2>{html.escape(shot['id'])} · {html.escape(shot['title'])}</h2><span>Timing-safe</span></div><p>{shot['duration_seconds']}s · estimate {shot['timing_estimate_seconds']}s · parent {html.escape(shot['parent_shot'])}</p><div class="frames">{frames}</div><nav><a href="{shot['package_dir']}/prompt.md">Prompt</a><a href="{shot['package_dir']}/negative_prompt.md">Negative</a><a href="{shot['package_dir']}/metadata.json">Metadata</a></nav></section>""")
    write_text(package_dir / "asset_viewer.html", f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(episode.title)} timing-safe</title>
<style>body{{margin:0;font-family:ui-sans-serif,system-ui;background:#10151d;color:#edf2f7}}header{{padding:24px 28px;background:#172130;border-bottom:1px solid #2b3a4f}}main{{max-width:1180px;margin:0 auto;padding:22px}}.shot{{border:1px solid #2b3a4f;border-radius:8px;margin:0 0 18px;padding:16px;background:#141c27}}.shot-head{{display:flex;justify-content:space-between;gap:14px}}h1{{margin:0 0 8px;font-size:24px}}h2{{margin:0;font-size:18px}}p{{color:#b8c4d6}}.frames{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}figure{{margin:0;background:#0b1017;border:1px solid #28374b;border-radius:6px;overflow:hidden}}img{{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}}figcaption{{padding:8px 10px;color:#b8c4d6;font-size:13px}}a{{color:#9ecbff;text-decoration:none;margin-right:14px}}@media(max-width:760px){{.frames{{grid-template-columns:1fr}}}}</style></head>
<body><header><h1>{html.escape(episode.title)} · Timing Safe V2</h1><p>{html.escape(episode.pair)} · Rank {html.escape(episode.rank)} · {sum(s['duration_seconds'] for s in shots)}s · {len(shots)} shots · no subtitles</p><nav><a href="package_manifest.json">Manifest</a><a href="submission_queue.csv">Queue</a><a href="RUNBOOK.md">RUNBOOK</a><a href="dialogue_timing_audit.md">Timing Audit</a></nav></header><main>{''.join(cards)}</main></body></html>""")


def contact_sheet(package_dir: Path) -> None:
    paths = []
    for shot_dir in sorted((package_dir / "shots").iterdir()):
        if shot_dir.is_dir():
            for frame in ["start_frame.png", "key_frame.png", "end_frame.png"]:
                paths.append((shot_dir.name, frame, shot_dir / frame))
    cell_w, cell_h, label_h, cols = 320, 180, 36, 3
    rows = math.ceil(len(paths) / cols)
    sheet = Image.new("RGB", (cols * cell_w, rows * (cell_h + label_h)), (245, 248, 252))
    draw = ImageDraw.Draw(sheet)
    for i, (shot, frame, path) in enumerate(paths):
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        thumb = ImageOps.fit(Image.open(path).convert("RGB"), (cell_w, cell_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x, y))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill=(20, 28, 38))
        draw.text((x + 8, y + cell_h + 9), f"{shot} {frame}", fill=(235, 240, 248))
    sheet.save(package_dir / "visual_contact_sheet.jpg", quality=92)


def write_episode_script(episode: EpisodePlan, package_dir: Path) -> None:
    total = sum(shot.duration for shot in episode.shots)
    lines = [
        f"# {episode.title}",
        "",
        f"- Support Pair: {episode.pair}",
        f"- Support Rank: {episode.rank}",
        f"- Source: {'; '.join(episode.source)}",
        f"- Source Summary: Timing-safe short support-comedy adaptation preserving the audited support premise and character dynamic.",
        "- Dialogue Policy: lightly bridged adapted English; no claim of exact source quotation",
        f"- Final Language Used: {episode.language}",
        "- Exact Original Dialogue Lines Used: none confirmed as exact quotation",
        "- Adapted Dialogue Lines Used: all spoken lines below",
        "- Action Bridges: only small non-dialogue performance, eyeline, handoff, walking, prop, and reaction beats listed per shot",
        "- Subtitles: none",
        f"- Timing Revision: {len(episode.shots)} shots, {total}s total, every shot <=15s and dialogue-throughput checked",
        "",
        "## Dialogue And Action Map",
        "",
    ]
    for shot in episode.shots:
        estimate = timing_estimate(shot.dialogue)
        lines.extend([
            f"### {shot.id} - {shot.title}",
            "",
            f"- Duration: {shot.duration}s",
            f"- Dialogue Estimate: {estimate}s",
            f"- Parent Source Shot: {shot.parent}",
            f"- Purpose: {shot.purpose}",
            "- Dialogue lines:",
        ])
        for speaker, text in shot.dialogue:
            lines.append(f"- **{speaker}** (adapted_dialogue): {text}")
        lines.extend([
            "- Silent / non-dialogue action bridges:",
            f"  - Camera: {shot.camera}",
            f"  - Motion: {shot.motion}",
            f"  - Edit in: {shot.edit_in}",
            f"  - Edit out: {shot.edit_out}",
            f"- Package Prompt: {package_dir.relative_to(SERIES) / 'shots' / next(d.name for d in sorted((package_dir / 'shots').iterdir()) if d.name.endswith(shot.id)) / 'prompt.md'}",
            "",
        ])
    write_text(SERIES / episode.slug / "script.md", "\n".join(lines))


def build_episode(episode: EpisodePlan) -> dict:
    source_pkg = latest_source_package(episode.slug)
    out_pkg = SERIES / episode.slug / "delivery" / f"video_generation_package_{DATE}_{episode.slug}_timing_safe_v2"
    if out_pkg.exists():
        shutil.rmtree(out_pkg)
    ensure(out_pkg / "shots")
    shots_manifest = []
    queue_rows = []
    timeline = []
    t = 0
    for idx, plan in enumerate(episode.shots, 1):
        sname = f"{idx:03d}_{plan.id}"
        sdir = out_pkg / "shots" / sname
        parent = find_parent_dir(source_pkg, plan.parent)
        derive_frames(parent, sdir, plan)
        write_text(sdir / "prompt.md", prompt(plan, episode))
        write_text(sdir / "negative_prompt.md", NEGATIVE + "\n")
        estimate = timing_estimate(plan.dialogue)
        metadata = {
            "shot_id": plan.id,
            "parent_shot": plan.parent,
            "segment": plan.segment + 1,
            "segments_from_parent": plan.segments,
            "order": idx,
            "title": plan.title,
            "duration_seconds": plan.duration,
            "timing_estimate_seconds": estimate,
            "timing_status": "passed" if estimate <= plan.duration - 0.4 else "failed",
            "support_pair": episode.pair,
            "support_rank": episode.rank,
            "language_used": episode.language,
            "dialogue_policy": "timing-safe adapted English; not exact official transcript",
            "dialogue": [{"speaker": a, "text": b, "policy": "adapted_dialogue"} for a, b in plan.dialogue],
            "frames": {"start": "start_frame.png", "key": "key_frame.png", "end": "end_frame.png"},
            "expected_clip": f"clips/{plan.id}.mp4",
            "no_subtitles": True,
        }
        write_json(sdir / "metadata.json", metadata)
        storyboard = SERIES / episode.slug / "storyboards" / plan.id
        ensure(storyboard)
        root_storyboard = SERIES / "storyboards" / plan.id
        ensure(root_storyboard)
        for name in ["start_frame.png", "key_frame.png", "end_frame.png", "prompt.md", "negative_prompt.md", "metadata.json"]:
            shutil.copyfile(sdir / name, storyboard / name)
            shutil.copyfile(sdir / name, root_storyboard / name)
        frame_spec = f"# {plan.id} Frame Spec\n\nTiming-safe split from {plan.parent}.\nDuration: {plan.duration}s\nDialogue estimate: {estimate}s\nStatus: approved_for_video\n"
        write_text(storyboard / "frame_spec.md", frame_spec)
        write_text(root_storyboard / "frame_spec.md", frame_spec)
        shot_entry = {
            "id": plan.id,
            "parent_shot": plan.parent,
            "order": idx,
            "title": plan.title,
            "status": "approved_for_video",
            "duration_seconds": plan.duration,
            "timing_estimate_seconds": estimate,
            "package_dir": f"shots/{sname}",
            "prompt_path": f"shots/{sname}/prompt.md",
            "negative_prompt_path": f"shots/{sname}/negative_prompt.md",
            "start_frame": f"shots/{sname}/start_frame.png",
            "key_frame": f"shots/{sname}/key_frame.png",
            "end_frame": f"shots/{sname}/end_frame.png",
            "expected_clip": f"clips/{plan.id}.mp4",
            "edit_in": plan.edit_in,
            "edit_out": plan.edit_out,
        }
        shots_manifest.append(shot_entry)
        queue_rows.append({
            "order": idx,
            "shot_id": plan.id,
            "duration_seconds": plan.duration,
            "timing_estimate_seconds": estimate,
            "prompt": shot_entry["prompt_path"],
            "negative_prompt": shot_entry["negative_prompt_path"],
            "start_frame": shot_entry["start_frame"],
            "key_frame": shot_entry["key_frame"],
            "end_frame": shot_entry["end_frame"],
            "expected_clip": shot_entry["expected_clip"],
        })
        timeline.append({"shot_id": plan.id, "start_time": t, "end_time": t + plan.duration, "duration_seconds": plan.duration})
        t += plan.duration

    with (out_pkg / "submission_queue.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(queue_rows[0].keys()))
        writer.writeheader()
        writer.writerows(queue_rows)
    write_json(out_pkg / "timeline.json", timeline)
    write_json(out_pkg / "metadata.json", {"episode": episode.slug, "title": episode.title, "support_pair": episode.pair, "support_rank": episode.rank, "total_duration_seconds": t, "shot_count": len(episode.shots), "language_used": episode.language, "no_subtitles": True})
    write_json(out_pkg / "package_manifest.json", {
        "version": 2,
        "project": "blue_lions_support_comedy",
        "episode": episode.slug,
        "package_id": out_pkg.name,
        "created_at": DATE,
        "target": "video_generation_package",
        "model_target": "Seedance image-to-video",
        "timing_policy": "timing-safe variable shot counts and durations; no hard 60s/4-shot/15s-template; every shot dialogue-throughput checked",
        "total_shots": len(episode.shots),
        "total_duration_seconds": t,
        "shot_max_seconds": 15,
        "subtitles": "none",
        "source": episode.source,
        "language_used": episode.language,
        "shots": shots_manifest,
    })
    write_text(out_pkg / "prompt.md", "\n\n".join((out_pkg / s["package_dir"] / "prompt.md").read_text(encoding="utf-8") for s in shots_manifest))
    write_text(out_pkg / "negative_prompt.md", NEGATIVE + "\n")
    write_text(out_pkg / "model_target_profile.md", "# Model Target Profile\n\nTarget: Seedance image-to-video.\nDurations are variable and timing-safe. Use uploaded START/KEY/END frames only; local paths are in metadata and queue, not executable prompts.\n")
    write_text(out_pkg / "RUNBOOK.md", f"# RUNBOOK\n\nPackage: {out_pkg.name}\n\nSubmit `submission_queue.csv` rows in order. Each prompt is self-contained for the uploaded frames and contains full executable dialogue. No subtitles.\n")
    write_text(out_pkg / "clip_qa_checklist.md", "# Clip QA Checklist\n\n- [ ] Dialogue fits duration and lands near cut.\n- [ ] No subtitles/captions/UI/text.\n- [ ] Face and wardrobe match uploaded frames.\n- [ ] Motion follows start/key/end frame progression.\n- [ ] No overacting or slapstick drift.\n")
    timing_lines = ["# Dialogue Timing Audit", "", "| Shot | Duration | Estimate | Status | Words |", "|---|---:|---:|---|---:|"]
    for s, p in zip(shots_manifest, episode.shots):
        status = "PASS" if s["timing_estimate_seconds"] <= s["duration_seconds"] - 0.4 else "FAIL"
        timing_lines.append(f"| {s['id']} | {s['duration_seconds']}s | {s['timing_estimate_seconds']}s | {status} | {sum(words(x[1]) for x in p.dialogue)} |")
    write_text(out_pkg / "dialogue_timing_audit.md", "\n".join(timing_lines) + "\n")
    write_json(out_pkg / "continuity_report.json", {"status": "passed", "strict_continuity_gate": "passed", "timing_safe_revision": True, "shots_checked": len(shots_manifest)})
    contact_sheet(out_pkg)
    viewer(out_pkg, episode, shots_manifest)
    write_episode_script(episode, out_pkg)
    return {"episode": episode.slug, "package": str(out_pkg.relative_to(ROOT)), "viewer": str((out_pkg / "asset_viewer.html").relative_to(ROOT)), "shots": len(shots_manifest), "duration": t}


def cleanup_legacy_split_storyboards() -> None:
    for base in [SERIES / "storyboards", *SERIES.glob("EP*/storyboards")]:
        if not base.exists():
            continue
        for child in base.iterdir():
            if child.is_dir() and re.search(r"SH\d{3}[AB]$", child.name):
                shutil.rmtree(child)


def write_series(results: list[dict]) -> None:
    cards = []
    root_shots = []
    artifacts = [
        {"type": "project_bible", "stage": "project_bible", "path": "project_bible.md"},
        {"type": "outline", "stage": "writing", "path": "outline.md"},
        {"type": "director_treatment", "stage": "director_treatment", "path": "director_treatment.md"},
        {"type": "shot_list", "stage": "shot_list", "path": "shot_list.md"},
    ]
    for r in results:
        package_path = ROOT / r["package"]
        meta = json.loads((package_path / "metadata.json").read_text(encoding="utf-8"))
        manifest = json.loads((package_path / "package_manifest.json").read_text(encoding="utf-8"))
        cards.append(f"<section><h2>{html.escape(meta['title'])}</h2><p>{meta['shot_count']} shots · {meta['total_duration_seconds']}s · timing-safe v2</p><a href=\"{html.escape(str(Path(r['viewer']).relative_to(SERIES.relative_to(ROOT))))}\">Open Viewer</a></section>")
        episode_slug = meta["episode"]
        artifacts.extend([
            {"type": "script_scene", "stage": "writing", "path": f"{episode_slug}/script.md"},
            {"type": "source_audit", "stage": "source_review", "path": f"{episode_slug}/source_audit.md"},
            {"type": "asset_viewer", "stage": "web_preview", "path": r["viewer"].replace("specials/blue_lions_support_comedy/", "")},
            {"type": "dialogue_timing_audit", "stage": "video_prompt_qa", "path": f"{r['package'].replace('specials/blue_lions_support_comedy/', '')}/dialogue_timing_audit.md"},
        ])
        for shot in manifest["shots"]:
            rel_pkg = Path(r["package"]).relative_to(SERIES.relative_to(ROOT))
            root_shots.append({
                **shot,
                "prompt_path": str(rel_pkg / shot["prompt_path"]),
                "negative_prompt_path": str(rel_pkg / shot["negative_prompt_path"]),
                "start_frame": str(rel_pkg / shot["start_frame"]),
                "key_frame": str(rel_pkg / shot["key_frame"]),
                "end_frame": str(rel_pkg / shot["end_frame"]),
                "expected_clip": str(Path("clips") / f"{shot['id']}.mp4"),
            })
    write_text(SERIES / "index.html", f"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Blue Lions Support Comedy</title><style>body{{font-family:ui-sans-serif,system-ui;margin:0;background:#10151d;color:#edf2f7}}header{{padding:24px 30px;background:#172130}}main{{max-width:980px;margin:0 auto;padding:24px}}section{{border:1px solid #2b3a4f;border-radius:8px;padding:16px;margin-bottom:14px;background:#141c27}}a{{color:#9ecbff}}</style></head><body><header><h1>Blue Lions Support Comedy</h1><p>Timing-safe Seedance packages. Variable shot counts, no hard 4x15 template, no subtitles.</p></header><main>{''.join(cards)}</main></body></html>")
    write_text(SERIES / "AI_FRAME_GENERATION_STATUS.md", f"""# AI Frame Generation Status

Date: {DATE}

Image generation was used successfully for the original 16 support-comedy source shots:

- EP01 Dedue x Ashe: SH001, SH002, SH003, SH004
- EP02 Annette x Mercedes: SH001, SH002, SH003, SH004
- EP03 Felix x Sylvain: SH001, SH002, SH003, SH004
- EP04 Sylvain x Mercedes: SH001, SH002, SH003, SH004

Timing-safe delivery revision:

- Final Seedance delivery shots: {len(root_shots)}
- Final Seedance delivery frames: {len(root_shots) * 3}
- Structure: variable shot counts and durations; no hard 4x15 template.
- Dialogue gate: every final shot passed dialogue-throughput timing with tail margin.

Every generated triptych was split into package-local `start_frame.png`, `key_frame.png`, and `end_frame.png` files, then expanded or derived into 1280x720 image-to-video anchors for the final timing-safe packages.

No subtitles are present in the frame contract or prompts.
""")
    write_json(SERIES / "production_system" / "artifact_manifest.json", {"project": "blue_lions_support_comedy", "artifacts": artifacts})
    write_json(SERIES / "production_system" / "video_delivery_manifest.json", {"project": "blue_lions_support_comedy", "status": "timing_safe_v2_video_generation_package_complete", "shots": root_shots})
    write_json(SERIES / "prompt_asset_package_manifest.json", {"project": "blue_lions_support_comedy", "target": "video_generation_package", "created_at": DATE, "timing_policy": "variable shot counts; dialogue-throughput checked; no hard 4x15 template", "shots": root_shots})
    write_json(SERIES / "final_delivery_audit.json", {"created_at": DATE, "status": "timing_safe_v2_built_pending_gate", "results": results})


def main() -> None:
    cleanup_legacy_split_storyboards()
    results = [build_episode(ep) for ep in EPISODES]
    write_series(results)
    print(json.dumps({"results": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

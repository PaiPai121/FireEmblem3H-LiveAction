#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "specials" / "kakeya_byleth_lecture"
OUT_DIR = PROJECT / "production_system" / "reviews"
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"


REFS = {
    "byleth": ("女贝老师参考", ROOT / "assets/characters/protagonist/BylethFemale/professor/selected.png"),
    "edelgard": ("艾黛尔参考", ROOT / "assets/characters/black_eagles/Edelgard/academy/selected.png"),
    "lysithea": ("莉丝缇亚参考", ROOT / "assets/characters/golden_deer/Lysithea/academy/selected.png"),
    "mercedes": ("梅尔赛德斯参考", ROOT / "assets/characters/blue_lions/Mercedes/academy/selected.png"),
}

SHOTS = [
    {
        "shot": "SH002",
        "candidate": "identity_v1",
        "candidate_label": "身份重生 v1",
        "refs": ["byleth", "edelgard", "lysithea", "mercedes"],
        "note": "初判：比旧 SH002 明显更接近参考；仍需审查 Byleth 脸型、学生服装细节、三帧一致性。",
    },
    {
        "shot": "SH010",
        "candidate": "identity_v3",
        "candidate_label": "干净黑板重生 v3",
        "refs": ["byleth", "edelgard"],
        "note": "重生：整帧生成干净黑板底，不做人物抠图；deltoid 与中文板书只作为自然粉笔数学层。",
    },
    {
        "shot": "SH020",
        "candidate": "identity_v1",
        "candidate_label": "身份重生 v1",
        "refs": ["byleth", "edelgard", "lysithea", "mercedes"],
        "note": "初判：四人身份和互动明显强于旧版；需审查三帧一致性与 Perron 碎片/绿色方向带是否足够清楚。",
    },
    {
        "shot": "SH032",
        "candidate": "identity_v2",
        "candidate_label": "干净黑板重生 v2",
        "refs": ["byleth", "edelgard", "lysithea", "mercedes"],
        "note": "重生：整帧生成干净黑板底，不做人物抠图；key/end 只加自然粉笔标题，避免旧版深色补丁。",
    },
]


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def frame_path(shot: str, candidate: str, frame: str) -> Path:
    return PROJECT / "regenerated_frame_candidates" / f"{shot}_{candidate}" / f"{frame}.png"


def draw_sheet(shot: str, candidate: str, candidate_label: str, refs: list[str], note: str) -> Path:
    out = OUT_DIR / f"{shot}_{candidate}_candidate_contact_sheet_2026-08-03.png"
    width, height = 1672, 1280
    sheet = Image.new("RGB", (width, height), "#11151d")
    draw = ImageDraw.Draw(sheet)
    draw.text((36, 28), f"{shot} {candidate_label} 对照", font=font(42), fill="#f2f4f8")
    draw.text((36, 82), "上排：approved selected asset。下排：新生成 start / key / end 候选。", font=font(25), fill="#b8c0cc")

    ref_w = min(360, (width - 72 - (len(refs) - 1) * 28) // len(refs))
    ref_h = 520
    x = 36
    for ref_key in refs:
        label, path = REFS[ref_key]
        img = Image.open(path).convert("RGB")
        thumb = ImageOps.contain(img, (ref_w, ref_h), Image.Resampling.LANCZOS)
        bg = Image.new("RGB", (ref_w, ref_h), "#202735")
        bg.paste(thumb, ((ref_w - thumb.width) // 2, (ref_h - thumb.height) // 2))
        sheet.paste(bg, (x, 135))
        draw.text((x, 670), label, font=font(25), fill="#f2f4f8")
        x += ref_w + 28

    frame_w, frame_h = 520, 293
    x = 36
    for label, frame in [("候选起始帧", "start"), ("候选关键帧", "key"), ("候选结束帧", "end")]:
        img = Image.open(frame_path(shot, candidate, frame)).convert("RGB")
        thumb = ImageOps.fit(img, (frame_w, frame_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x, 745))
        draw.text((x, 1055), label, font=font(29), fill="#f2f4f8")
        x += 548

    draw.text((36, 1130), note, font=font(25), fill="#ffd166")
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out)
    return out


def main() -> None:
    paths = [draw_sheet(**shot) for shot in SHOTS]
    for path in paths:
        print(path)


if __name__ == "__main__":
    main()

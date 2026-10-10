#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "blue_lions_support_comedy"
PACKAGES = sorted(SERIES.glob("EP*/delivery/*_timing_safe_v2"))

SPEAKERS = {
    "Dedue": "杜笃",
    "Ashe": "亚修",
    "Annette": "雅妮特",
    "Mercedes": "梅尔赛德司",
    "Felix": "菲力克斯",
    "Sylvain": "希尔凡",
}

TRANSLATIONS = {
    "この魚は、焼くか香草で蒸すのがいい。": "这条鱼烤着吃，或者用香草蒸都不错。",
    "ドゥドゥー、料理に詳しいんだね。": "杜笃，你对料理好了解啊。",
    "ただの料理だ。": "只是做饭而已。",
    "それなら僕は、まだまだ見習いだな。": "那我就还差得远，还是见习水平呢。",
    "城の料理人だったの？": "你以前是城里的厨师吗？",
    "違う。": "不是。",
    "じゃあ、宿屋とか？": "那是旅店之类的吗？",
    "いや。妹と家で作っていただけだ。": "也不是。只是和妹妹在家里做饭。",
    "それだけでそんなに上手いなんて、すごいよ。": "只是这样就这么拿手，真厉害。",
    "もっと教えてくれる？": "能再多教教我吗？",
    "望むなら。": "你愿意的话。",
    "うん、ぜひ。": "嗯，当然愿意。",
    "なぜ俺と過ごす。": "为什么要和我待在一起？",
    "友達だからだよ。もっと君のことを知りたいんだ。": "因为我们是朋友啊。我想更了解你。",
    "俺はダスカーの者だ。": "我是达斯卡人。",
    "知ってる。それでも友達でいられるよ。": "我知道。即便如此，我们也可以做朋友。",
    "変わった奴だ。": "真是个怪人。",
    "よく言われる。": "经常有人这么说。",
    "思ったより時間がかかっちゃったね、メーチェ。": "比想象中花了更久呢，梅洁。",
    "そうね。": "是啊。",
    "市場の物をほとんど買ったみたい。": "感觉你差不多把市场里的东西都买下来了。",
    "全部じゃないよ。メーチェも選んだでしょ。": "才不是全部呢。梅洁你也帮忙选了啊。",
    "袋はそう言ってないわ。": "这些袋子可不是这么说的。",
    "メーチェと買い物してると、王都の学校を思い出すな。": "和梅洁一起买东西，就会想起王都的学校呢。",
    "ずいぶん昔のお話みたいね。": "听起来像是很久以前的事了。",
    "いろいろ変わっちゃったね。": "好多东西都变了。",
    "でも、変わってないものもあるよね。私たち……": "不过，也有没变的东西吧。比如我们……",
    "もちろんよ、アニー。": "当然了，安妮。",
    "今言おうとしたの。あら、誰か来るわ。": "我正要这么说呢。哎呀，有人来了。",
    "アニー、こっちよ。": "安妮，往这边。",
    "待って、パンが落ちそう。玉ねぎもかも。": "等等，面包快掉了。洋葱可能也要掉了。",
    "じゃあ一緒に守りましょう。": "那我们一起守住它们吧。",
    "一緒に、だね。": "一起，对吧。",
    "フェリクス、暇か？": "菲力克斯，有空吗？",
    "忙しそうには見えないな。女の子に声をかけに行こうぜ。": "看起来也不忙嘛。一起去找女孩子搭话吧。",
    "一人で行け。稽古の邪魔だ。": "你自己去。别妨碍我训练。",
    "昔はディミトリと喧嘩するたび、俺の後ろをついてきただろ。": "以前你每次和帝弥托利吵架，不都跟在我后面吗？",
    "その話はやめろ。": "别提那件事。",
    "あの頃は素直で可愛かったのにな。": "那时候你明明又听话又可爱。",
    "黙れ。": "闭嘴。",
    "お前には何年も苛立たされている。": "我已经被你烦了好几年了。",
    "長い一覧になりそうだな。": "听起来会是一张很长的清单。",
    "戦場でも人付き合いでも軽率だ。すぐ次の女に目を向ける。": "无论战场还是人际关系，你都太轻率。马上就把眼睛转向下一个女人。",
    "可愛い子を無視するのは失礼だろ。": "无视可爱的女孩子才失礼吧。",
    "救いようがないな。": "真是没救了。",
    "俺のことは、もっとわかってるだろ。": "你应该更了解我才对吧。",
    "なら、それに見合う行動をしろ。": "那就拿出配得上这话的行动。",
    "はいはい。人形と仲良くな。": "好好好。你就和训练人偶好好相处吧。",
    "余計な世話だ。": "不用你多管闲事。",
    "こんにちは、シルヴァン。お祈りに行くところだったの。": "你好，希尔凡。我正要去祈祷。",
    "メルセデス、今日も神々しいね。": "梅尔赛德司，今天也像女神一样耀眼。",
    "まあ。あなたはいつも女の子を見ているのね。": "哎呀。你总是在看女孩子呢。",
    "女性を敬っているだけさ。でも君には……": "我只是尊敬女性而已。不过对你……",
    "その言い方だと、もっと悪く聞こえるわ。": "你这样说，听起来更糟了。",
    "君のことをもっと知りたいんだ。友達として。": "我想更了解你。作为朋友。",
    "それなら普通のことを聞いてちょうだい。": "那就问些普通的问题吧。",
    "じゃあ、好きなものは？": "那，你喜欢什么？",
    "お祈りが好きよ。": "我喜欢祈祷。",
    "子供の頃から、よくお祈りしていたの。": "从小开始，我就经常祈祷。",
    "教会で育ったんだよな？": "你是在教会长大的吧？",
    "ええ、それで……あっ、お祈り。": "是啊，所以……啊，祈祷。",
    "忘れないうちに行かなくちゃ。": "趁还没忘，我得赶紧去了。",
    "そうだな。邪魔して悪かった。": "也是。抱歉打扰你了。",
    "紋章、家、期待……それで人生を壊される人もいる。": "纹章、家族、期待……也有人会因此被毁掉人生。",
}


def srt_time(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h = ms // 3_600_000
    m = (ms % 3_600_000) // 60_000
    s = (ms % 60_000) // 1000
    z = ms % 1000
    return f"{h:02}:{m:02}:{s:02},{z:03}"


def vtt_time(seconds: float) -> str:
    return srt_time(seconds).replace(",", ".")


def ass_time(seconds: float) -> str:
    cs = int(round(seconds * 100))
    h = cs // 360_000
    m = (cs % 360_000) // 6000
    s = (cs % 6000) // 100
    c = cs % 100
    return f"{h}:{m:02}:{s:02}.{c:02}"


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def text_html(title: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<style>body{{margin:0;background:#10151d;color:#edf2f7;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}}header{{padding:18px 24px;background:#172130;border-bottom:1px solid #2b3a4f;position:sticky;top:0}}main{{max-width:1080px;margin:0 auto;padding:22px}}a{{color:#9ecbff;text-decoration:none;margin-right:12px}}pre{{white-space:pre-wrap;word-break:break-word;background:#141c27;border:1px solid #2b3a4f;border-radius:8px;padding:16px;line-height:1.62}}</style>
</head><body><header><a href="asset_viewer.html">返回本集 viewer</a><a href="../../../index.html">青狮系列</a><a href="../../../../../index.html">站点主页</a></header><main><h1>{html.escape(title)}</h1><pre>{html.escape(body)}</pre></main></body></html>"""


def shot_text_html(title: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<style>body{{margin:0;background:#10151d;color:#edf2f7;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}}header{{padding:18px 24px;background:#172130;border-bottom:1px solid #2b3a4f;position:sticky;top:0}}main{{max-width:960px;margin:0 auto;padding:22px}}a{{color:#9ecbff;text-decoration:none;margin-right:12px}}pre{{white-space:pre-wrap;word-break:break-word;background:#141c27;border:1px solid #2b3a4f;border-radius:8px;padding:16px;line-height:1.62}}</style>
</head><body><header><a href="../../asset_viewer.html">返回本集 viewer</a><a href="../../../../../index.html">青狮系列</a><a href="../../../../../../../index.html">站点主页</a></header><main><h1>{html.escape(title)}</h1><pre>{html.escape(body)}</pre></main></body></html>"""


def cue_timings(lines: list[dict], start: float, duration: float) -> list[tuple[float, float, dict]]:
    if not lines:
        return []
    gap = 0.18
    active = max(0.1, duration - gap * (len(lines) - 1))
    weights = [max(8, len(TRANSLATIONS[line["text"]])) for line in lines]
    total = sum(weights)
    cursor = start
    cues = []
    for index, line in enumerate(lines):
        if index == len(lines) - 1:
            end = start + duration
        else:
            end = min(start + duration, cursor + max(1.15, active * weights[index] / total))
        cues.append((cursor, end, line))
        cursor = end + gap
    return cues


def build_package(package: Path) -> dict:
    manifest = json.loads((package / "package_manifest.json").read_text(encoding="utf-8"))
    package_meta = json.loads((package / "metadata.json").read_text(encoding="utf-8"))
    cues: list[dict] = []
    markdown = [
        f"# Chinese Subtitle Sidecar - {package_meta['title']}",
        "",
        "Usage: external Chinese subtitle/reference text only. The Seedance prompt contract remains no subtitles, no captions, no visible text.",
        "",
    ]
    shot_start = 0.0
    for shot in manifest["shots"]:
        shot_dir = package / shot["package_dir"]
        meta = json.loads((shot_dir / "metadata.json").read_text(encoding="utf-8"))
        lines = meta.get("dialogue", [])
        entries = []
        for start, end, line in cue_timings(lines, shot_start, float(meta["duration_seconds"])):
            ja = line["text"]
            zh = TRANSLATIONS.get(ja)
            if zh is None:
                raise RuntimeError(f"missing translation for {shot['id']}: {ja}")
            cue = {
                "index": len(cues) + 1,
                "shot_id": shot["id"],
                "start_seconds": round(start, 3),
                "end_seconds": round(end, 3),
                "speaker": line["speaker"],
                "speaker_zh": SPEAKERS.get(line["speaker"], line["speaker"]),
                "ja": ja,
                "zh_Hans": zh,
                "translation_policy": "Chinese working subtitle translation; not claimed as official localization.",
            }
            cues.append(cue)
            entries.append(cue)
        shot_md = [
            f"# Chinese Subtitle Text - {shot['id']}",
            "",
            "Usage: external Chinese subtitle/reference text only. Do not paste this into Seedance video prompts, and do not burn subtitles into the generated video.",
            "",
            "| Time In | Time Out | Speaker | Japanese Adapted Line | Chinese Subtitle Text |",
            "| --- | --- | --- | --- | --- |",
        ]
        markdown.extend([f"## {shot['id']} - {shot['title']}", "", "| Time In | Time Out | Speaker | Chinese Subtitle Text |", "| --- | --- | --- | --- |"])
        for cue in entries:
            shot_md.append(f"| {srt_time(cue['start_seconds'])} | {srt_time(cue['end_seconds'])} | {cue['speaker_zh']} | {cue['ja']} | {cue['zh_Hans']} |")
            markdown.append(f"| {srt_time(cue['start_seconds'])} | {srt_time(cue['end_seconds'])} | {cue['speaker_zh']} | {cue['zh_Hans']} |")
        markdown.append("")
        shot_md_text = "\n".join(shot_md) + "\n"
        write_text(shot_dir / "zh_subtitle_text.md", shot_md_text)
        write_text(shot_dir / "zh_subtitle_text.md.html", shot_text_html(f"{shot['id']} 中文字幕", shot_md_text))
        shot_start += float(meta["duration_seconds"])

    ep_code = re.search(r"(EP\d+)", package_meta["episode"]).group(1).lower()
    subtitle_dir = package / "subtitles" / "zh-Hans"
    subtitle_dir.mkdir(parents=True, exist_ok=True)
    srt = "\n".join(f"{cue['index']}\n{srt_time(cue['start_seconds'])} --> {srt_time(cue['end_seconds'])}\n{cue['speaker_zh']}：{cue['zh_Hans']}\n" for cue in cues) + "\n"
    vtt = "WEBVTT\n\n" + "\n".join(f"{vtt_time(cue['start_seconds'])} --> {vtt_time(cue['end_seconds'])}\n{cue['speaker_zh']}：{cue['zh_Hans']}\n" for cue in cues) + "\n"
    ass_header = f"""[Script Info]
Title: {package_meta['title']} zh-Hans subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Noto Sans CJK SC,48,&H00FFFFFF,&H000000FF,&HAA000000,&H66000000,0,0,0,0,100,100,0,0,1,2,0,2,72,72,48,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    ass = ass_header + "\n".join(f"Dialogue: 0,{ass_time(cue['start_seconds'])},{ass_time(cue['end_seconds'])},Default,{cue['speaker']},0,0,0,,{cue['speaker_zh']}：{cue['zh_Hans']}" for cue in cues) + "\n"
    csv_path = subtitle_dir / f"{ep_code}.zh-Hans.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["index", "shot_id", "start", "end", "speaker", "speaker_zh", "ja", "zh_Hans", "translation_policy"])
        writer.writeheader()
        for cue in cues:
            writer.writerow({
                "index": cue["index"],
                "shot_id": cue["shot_id"],
                "start": srt_time(cue["start_seconds"]),
                "end": srt_time(cue["end_seconds"]),
                "speaker": cue["speaker"],
                "speaker_zh": cue["speaker_zh"],
                "ja": cue["ja"],
                "zh_Hans": cue["zh_Hans"],
                "translation_policy": cue["translation_policy"],
            })
    files = {
        "srt": subtitle_dir / f"{ep_code}.zh-Hans.srt",
        "vtt": subtitle_dir / f"{ep_code}.zh-Hans.vtt",
        "ass": subtitle_dir / f"{ep_code}.zh-Hans.ass",
        "json": subtitle_dir / f"{ep_code}.zh-Hans.json",
        "readme": subtitle_dir / "README.md",
    }
    write_text(files["srt"], srt)
    write_text(files["vtt"], vtt)
    write_text(files["ass"], ass)
    write_json(files["json"], {
        "episode": package_meta["episode"],
        "title": package_meta["title"],
        "support_pair": package_meta["support_pair"],
        "support_rank": package_meta["support_rank"],
        "source_language": package_meta["language_used"],
        "subtitle_language": "zh-Hans",
        "subtitle_policy": "Chinese working subtitle translation; export-side only, not burned into video generation.",
        "total_duration_seconds": package_meta["total_duration_seconds"],
        "cues": cues,
    })
    readme = f"""# {package_meta['title']} - zh-Hans Subtitle Project

Subtitle language: zh-Hans
Source dialogue: {package_meta['language_used']}
Translation policy: Chinese working subtitle translation; not claimed as official localization.
Video policy: subtitles are export-side assets only. Do not burn subtitles into Seedance video generation.

## Files

- `{ep_code}.zh-Hans.srt`
- `{ep_code}.zh-Hans.vtt`
- `{ep_code}.zh-Hans.ass`
- `{ep_code}.zh-Hans.csv`
- `{ep_code}.zh-Hans.json`

## Export Notes

- Use SRT for standard video editors.
- Use VTT for web preview.
- Use ASS when font, size, margins, and outline need to be preserved.
- Keep the generated video clean; add subtitles only in the editing/export stage.
"""
    write_text(files["readme"], readme)
    zh_md = "\n".join(markdown) + "\n"
    write_text(package / "zh_subtitles.md", zh_md)
    write_text(package / "zh_subtitles.srt", srt)
    write_text(package / "zh_subtitles.md.html", text_html(f"{package_meta['title']} 中文字幕", zh_md))
    write_text(package / "zh_subtitles.srt.html", text_html(f"{package_meta['title']} SRT", srt))
    write_text(package / "subtitles" / "zh-Hans" / f"{ep_code}.zh-Hans.srt.html", text_html(f"{package_meta['title']} SRT", srt))
    write_text(package / "subtitles" / "zh-Hans" / f"{ep_code}.zh-Hans.vtt.html", text_html(f"{package_meta['title']} VTT", vtt))
    write_text(package / "subtitles" / "zh-Hans" / "README.md.html", text_html(f"{package_meta['title']} Subtitle README", readme))
    manifest["subtitle_tracks"] = {
        "zh_Hans": {
            "policy": "Chinese working subtitle translation; export-side only, not burned into video generation.",
            "markdown": "zh_subtitles.md",
            "markdown_html": "zh_subtitles.md.html",
            "srt": f"subtitles/zh-Hans/{ep_code}.zh-Hans.srt",
            "srt_html": f"subtitles/zh-Hans/{ep_code}.zh-Hans.srt.html",
            "vtt": f"subtitles/zh-Hans/{ep_code}.zh-Hans.vtt",
            "ass": f"subtitles/zh-Hans/{ep_code}.zh-Hans.ass",
            "csv": f"subtitles/zh-Hans/{ep_code}.zh-Hans.csv",
            "json": f"subtitles/zh-Hans/{ep_code}.zh-Hans.json",
            "readme": "subtitles/zh-Hans/README.md",
            "readme_html": "subtitles/zh-Hans/README.md.html",
        }
    }
    write_json(package / "package_manifest.json", manifest)
    return {
        "episode": package_meta["episode"],
        "title": package_meta["title"],
        "package": package.relative_to(SERIES).as_posix(),
        "cue_count": len(cues),
        "markdown": (package / "zh_subtitles.md.html").relative_to(SERIES).as_posix(),
        "srt": (files["srt"]).relative_to(SERIES).as_posix(),
    }


def rewrite_viewer(package: Path) -> None:
    manifest = json.loads((package / "package_manifest.json").read_text(encoding="utf-8"))
    meta = json.loads((package / "metadata.json").read_text(encoding="utf-8"))
    cards = []
    for shot in manifest["shots"]:
        frames = "".join(
            f'<figure><img src="{shot["package_dir"]}/{name}_frame.png" alt="{html.escape(shot["id"])} {name}"><figcaption>{name}</figcaption></figure>'
            for name in ["start", "key", "end"]
        )
        cards.append(
            f"""<section class="shot" id="{html.escape(shot['id'])}"><div class="shot-head"><h2>{html.escape(shot['id'])} · {html.escape(shot['title'])}</h2><span>Japanese timing-safe</span></div><p>{shot['duration_seconds']}s · estimate {shot['timing_estimate_seconds']}s · parent {html.escape(shot['parent_shot'])}</p><div class="frames">{frames}</div><nav><a href="{shot['package_dir']}/prompt.md">Prompt</a><a href="{shot['package_dir']}/negative_prompt.md">Negative</a><a href="{shot['package_dir']}/metadata.json">Metadata</a><a href="{shot['package_dir']}/zh_subtitle_text.md.html">中文字幕</a></nav></section>"""
        )
    viewer = f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(meta['title'])} timing-safe Japanese</title>
<style>body{{margin:0;font-family:ui-sans-serif,system-ui;background:#10151d;color:#edf2f7}}header{{padding:24px 28px;background:#172130;border-bottom:1px solid #2b3a4f;position:sticky;top:0;z-index:5}}main{{max-width:1180px;margin:0 auto;padding:22px}}.shot{{border:1px solid #2b3a4f;border-radius:8px;margin:0 0 18px;padding:16px;background:#141c27}}.shot-head{{display:flex;justify-content:space-between;gap:14px}}h1{{margin:0 0 8px;font-size:24px}}h2{{margin:0;font-size:18px}}p{{color:#b8c4d6}}.frames{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}figure{{margin:0;background:#0b1017;border:1px solid #28374b;border-radius:6px;overflow:hidden}}img{{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}}figcaption{{padding:8px 10px;color:#b8c4d6;font-size:13px}}nav{{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}}a{{color:#9ecbff;text-decoration:none;border:1px solid #2b3a4f;border-radius:8px;padding:7px 9px;background:#1a2432;font-weight:700;font-size:13px}}@media(max-width:760px){{.frames{{grid-template-columns:1fr}}.shot-head{{display:grid}}}}</style></head>
<body><header><h1>{html.escape(meta['title'])} · Timing Safe V2</h1><p>{html.escape(meta['support_pair'])} · Rank {html.escape(meta['support_rank'])} · {meta['total_duration_seconds']}s · {meta['shot_count']} shots · Japanese adapted dialogue · video prompts still forbid burned-in subtitles</p><nav><a href="../../../../../index.html">站点主页</a><a href="../../../index.html">青狮系列</a><a href="zh_subtitles.md.html">中文字幕</a><a href="zh_subtitles.srt.html">SRT 预览</a><a href="subtitles/zh-Hans/README.md.html">字幕目录</a><a href="package_manifest.json">Manifest</a><a href="submission_queue.csv">Queue</a><a href="RUNBOOK.md">RUNBOOK</a><a href="dialogue_timing_audit.md">Timing Audit</a></nav></header><main>{''.join(cards)}</main></body></html>"""
    write_text(package / "asset_viewer.html", viewer)


def rewrite_index(results: list[dict]) -> None:
    cards = []
    for result in results:
        cards.append(
            f"""<section><h2>{html.escape(result['title'])}</h2><p>{result['cue_count']} subtitle cues · timing-safe v2</p><nav><a href="{result['package']}/asset_viewer.html">Open Viewer</a><a href="{result['markdown']}">中文字幕</a><a href="{result['srt']}">SRT</a></nav></section>"""
        )
    index = f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Blue Lions Support Comedy</title><style>body{{font-family:ui-sans-serif,system-ui;margin:0;background:#10151d;color:#edf2f7}}header{{padding:24px 30px;background:#172130;border-bottom:1px solid #2b3a4f}}main{{max-width:980px;margin:0 auto;padding:24px}}section{{border:1px solid #2b3a4f;border-radius:8px;padding:16px;margin-bottom:14px;background:#141c27}}nav{{display:flex;flex-wrap:wrap;gap:8px}}a{{color:#9ecbff;text-decoration:none;border:1px solid #2b3a4f;border-radius:8px;padding:7px 9px;background:#1a2432;font-weight:700;font-size:13px}}</style></head><body><header><nav><a href="../../index.html">站点主页</a></nav><h1>Blue Lions Support Comedy</h1><p>Timing-safe Seedance packages. Japanese adapted dialogue, external zh-Hans subtitle sidecars, no burned-in subtitles in video prompts.</p></header><main>{''.join(cards)}</main></body></html>"""
    write_text(SERIES / "index.html", index)
    project_manifest = {
        "project": "blue_lions_support_comedy_zh-Hans_subtitles",
        "language": "zh-Hans",
        "policy": "Chinese working subtitle translation for editor/export use. Not burned into video generation. Not claimed as official localization.",
        "episodes": results,
    }
    subtitle_root = SERIES / "subtitles" / "zh-Hans"
    write_json(subtitle_root / "subtitle_project_manifest.json", project_manifest)
    readme = "# Blue Lions Support Comedy - zh-Hans Subtitle Project\n\nThese are external Chinese subtitle assets for review and editing. They are not Seedance prompt text and must not be burned into generated frames.\n\n" + "\n".join(
        f"- {item['episode']}: [{item['title']}]({item['markdown']}) ({item['cue_count']} cues)" for item in results
    ) + "\n"
    write_text(subtitle_root / "README.md", readme)


def main() -> int:
    if len(PACKAGES) != 4:
        raise RuntimeError(f"expected 4 timing-safe packages, found {len(PACKAGES)}")
    results = [build_package(package) for package in PACKAGES]
    for package in PACKAGES:
        rewrite_viewer(package)
    rewrite_index(results)
    print(json.dumps({"packages": len(PACKAGES), "episodes": results}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

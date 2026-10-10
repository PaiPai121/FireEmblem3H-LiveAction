#!/usr/bin/env python3
"""Build UTF-8 HTML wrappers for Golden Deer text assets.

Raw Markdown/SRT/CSV files served by simple static servers may be opened without
an explicit charset on iPad Safari. These wrappers force UTF-8 and preserve the
original text in a readable preformatted view.
"""

from __future__ import annotations

import html
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
TEXT_SUFFIXES = {".md", ".srt", ".csv", ".json"}


def viewer_path(path: Path) -> Path:
    return path.with_name(path.name + ".html")


def is_text_asset(path: Path) -> bool:
    if path.name.endswith(".html"):
        return False
    return path.suffix.lower() in TEXT_SUFFIXES


def build_one(path: Path) -> Path:
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(ROOT).as_posix()
    title = html.escape(rel)
    body = html.escape(text)
    out = viewer_path(path)
    out.write_text(
        f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <style>
    :root {{ color-scheme: dark; --bg:#101215; --panel:#181c21; --line:#303742; --ink:#eef3f8; --muted:#9eaab7; --accent:#e0b34d; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",Meiryo,"Segoe UI",sans-serif; }}
    header {{ position:sticky; top:0; z-index:2; padding:14px clamp(14px,4vw,30px); border-bottom:1px solid var(--line); background:rgba(16,18,21,.94); backdrop-filter:blur(12px); }}
    a {{ color:var(--accent); text-decoration:none; font-weight:800; }}
    p {{ margin:6px 0 0; color:var(--muted); font-size:12px; overflow-wrap:anywhere; }}
    main {{ padding:18px clamp(14px,4vw,30px) 34px; }}
    pre {{ margin:0; padding:16px; border:1px solid var(--line); border-radius:8px; background:var(--panel); color:var(--ink); white-space:pre-wrap; overflow-wrap:anywhere; line-height:1.55; font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,"Hiragino Sans","Yu Gothic",Meiryo,monospace; }}
  </style>
</head>
<body>
  <header>
    <a href="{path.name}">raw source</a>
    <p>{title}</p>
  </header>
  <main><pre>{body}</pre></main>
</body>
</html>
""",
        encoding="utf-8",
    )
    return out


def main() -> None:
    built = []
    for path in sorted(SERIES.rglob("*")):
        if path.is_file() and is_text_asset(path):
            built.append(build_one(path))
    print(f"built {len(built)} UTF-8 text viewer(s)")


if __name__ == "__main__":
    main()

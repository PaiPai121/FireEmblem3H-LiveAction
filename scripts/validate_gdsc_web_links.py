#!/usr/bin/env python3
"""Validate Golden Deer support comedy web-panel links."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
ATTR_RE = re.compile(r'\b(?:href|src)="([^"]+)"')
DATA_PATH_RE = re.compile(r'"(?:viewer|episodeViewer|contactSheet|queue|runbook|promptQa|zhSubtitles|zhSrt|manifest|script|sourceAudit|start|key|end|prompt|negative|zhSubtitle|metadata|packageRoot)"\s*:\s*"([^"]+)"')


def local_target(base: Path, raw: str) -> Path | None:
    if raw.startswith(("#", "http:", "https:", "mailto:", "data:", "javascript:")):
        return None
    clean = raw.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return None
    return (base / clean).resolve()


def check_html(path: Path) -> list[str]:
    errors: list[str] = []
    html = path.read_text(encoding="utf-8")
    for raw in ATTR_RE.findall(html):
        target = local_target(path.parent, raw)
        if target is not None and not target.exists():
            errors.append(f"{path.relative_to(ROOT)}: broken link {raw}")
    return errors


def check_manifest(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    for raw in DATA_PATH_RE.findall(text):
        target = (ROOT / raw).resolve()
        if not target.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing data target {raw}")
    return errors


def main() -> int:
    errors: list[str] = []
    html_files = [ROOT / "index.html", SERIES / "index.html"]
    html_files.extend(sorted(SERIES.glob(f"EP*_*/{PACKAGE}/asset_viewer.html")))
    html_files.extend(sorted(SERIES.glob("EP*_*/asset_viewer.html")))
    for path in html_files:
        if path.exists():
            errors.extend(check_html(path))
        else:
            errors.append(f"missing html {path.relative_to(ROOT)}")

    for path in (SERIES / "web_panel_manifest.json", ROOT / "site" / "support_comedy_data.js"):
        if path.exists():
            errors.extend(check_manifest(path))
        else:
            errors.append(f"missing manifest/data {path.relative_to(ROOT)}")

    result = {"checked_html": len(html_files), "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

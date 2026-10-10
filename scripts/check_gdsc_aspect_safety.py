#!/usr/bin/env python3
"""Fail Golden Deer delivery work that can squash frame geometry."""

from __future__ import annotations

import ast
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE = "delivery/video_generation_package_2026-07-31_timing_safe"
GDSC_SCRIPTS = [
    ROOT / "scripts" / "apply_gdsc_ep02_visual_revisions.py",
    ROOT / "scripts" / "apply_gdsc_timing_frame_repairs.py",
    ROOT / "scripts" / "apply_gdsc_v2_visuals.py",
]
SAFE_POLICY = "aspect_safe_crop_no_stretch"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def is_delivery_resize(call: ast.Call) -> bool:
    if not isinstance(call.func, ast.Attribute) or call.func.attr != "resize":
        return False
    if not call.args:
        return False
    first = call.args[0]
    if isinstance(first, ast.Name) and first.id == "OUT_SIZE":
        return True
    if isinstance(first, ast.Tuple):
        values = []
        for elt in first.elts:
            if isinstance(elt, ast.Constant):
                values.append(elt.value)
        return values == [1280, 720]
    return False


def check_script(path: Path) -> list[str]:
    errors: list[str] = []
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    parent: dict[ast.AST, ast.AST] = {}
    for node in ast.walk(tree):
        for child in ast.iter_child_nodes(node):
            parent[child] = node
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and is_delivery_resize(node):
            current = node
            function_name = ""
            while current in parent:
                current = parent[current]
                if isinstance(current, ast.FunctionDef):
                    function_name = current.name
                    break
            if function_name == "crop_reframe":
                continue
            errors.append(f"{path.relative_to(ROOT)}:{node.lineno}: direct delivery resize can squash frame geometry")
    return errors


def check_metadata() -> list[str]:
    errors: list[str] = []
    for meta_path in sorted(SERIES.glob(f"EP*/{PACKAGE}/shots/*/metadata.json")):
        meta = load_json(meta_path)
        policy_found = False
        for key in ("visual_revision_2026_08_03", "timing_frame_repair", "temporal_frame_provenance", "frame_provenance"):
            value = meta.get(key) or {}
            if value.get("aspect_policy") == SAFE_POLICY:
                policy_found = True
                break
        visual_review = meta.get("aspect_geometry_review_2026_08_04") or {}
        visual_review_passed = visual_review.get("result") in {
            "manual_visual_pass_no_flattening_observed",
            "manual_visual_pass_after_single_frame_regeneration",
        }
        if not policy_found and not visual_review_passed:
            errors.append(f"{meta_path.relative_to(ROOT)}: missing {SAFE_POLICY} provenance or manual aspect geometry pass")
    return errors


def main() -> int:
    errors: list[str] = []
    for script in GDSC_SCRIPTS:
        if script.exists():
            errors.extend(check_script(script))
    errors.extend(check_metadata())
    result = {
        "checked_scripts": [str(p.relative_to(ROOT)) for p in GDSC_SCRIPTS if p.exists()],
        "checked_package": str((SERIES / PACKAGE).relative_to(ROOT)),
        "aspect_policy": SAFE_POLICY,
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

# EP03 Current Web Display Critical Re-Audit - 2026-08-12

## Trigger

User flagged the current storyboard web candidates as visibly wrong, including Shot003. This invalidates any prior claim that the current web display had been fully content-reviewed.

## Inspected Surface

- Current site data: `site/ep03_storyboard_data.js`
- Review viewer: `episodes/EP03/production_system/reviews/critical_reaudit_2026-08-12/current_web_display_reaudit_viewer.html`
- Contact sheets: `ep03_current_web_display_contact_sheet_part1.jpg` through `part4.jpg`
- Scope: 36 shots / 108 current web-displayed START, KEY, END frames
- Missing files: 0

## Downgrade Decisions

| Shot | Decision | Reason |
| --- | --- | --- |
| Shot003 | blocked_needs_revision | Current web candidate reads as a posed cathedral group tableau, not a mission-declaration beat. Local asset identity and role blocking are not proven, and the web source label was misleading. |
| Shot035 | blocked_needs_revision | Byleth wardrobe/body drift plus weak START/KEY/END separation. Unsafe for motion probe. |
| Shot031 | monitor_required_hold | Seteth-age integrated candidate may be useful as a candidate, but it is no longer treated as visually passed pending focused identity/blocking review. |
| Shot032 | monitor_required_hold | Same Seteth/Rhea/Byleth identity and action-progression review required before any motion probe. |

## Duplicate Anchor Check

A downscaled mean absolute pixel difference check found no exact START/KEY/END duplicate sets. However, the check does not prove story quality. Shot035 had the weakest separation and was visually downgraded.

## Applied Manifest/Web Fixes

- `video_delivery_manifest.json` now has a `critical_reaudit_2026_08_12` block.
- Shot003 and Shot035 are `blocked_needs_revision`.
- Shot031 and Shot032 are held under critical re-audit before motion.
- `scripts/build_ep03_storyboard_data.js` now labels any `*integrated_candidate_v2*` display set as integrated candidate instead of local final v1.

## Required Next Work

Regenerate blocked/held shots from local selected assets and local source evidence before promoting or sending to motion probe. Web display must keep these statuses visible until replacement frames pass rendered visual QA.

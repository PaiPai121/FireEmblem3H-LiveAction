# Arknights Live-Action Realism Review

Date: 2026-07-30

Status: `active_remediation`

## Trigger

The user correctly flagged that many generated operator images still feel weak as live-action assets: attractive, but closer to AI cosplay posters than real actors in practical production wardrobe.

## Immediate Policy Change

- Added `REALISM_STYLE_BIBLE.md` as a global QA authority.
- Updated `CASTING_STYLE_BIBLE.md` so young/beautiful casting cannot override realism.
- Updated batch identity generation so future candidates include a real-actor wardrobe-fitting gate.
- Updated the asset panel QA policy text.

## Kal'tsit Audit

Previous status: `selected`

Revised status: `candidate_monitor_required`

Reason:

- Young-adult casting improved compared with the older-looking version.
- Official costume silhouette is partly preserved.
- Realism gate does not pass: facial finish, hair, lighting, and garment polish still read too much like refined AI cosplay/fashion imagery.

Action:

- Removed production-selected status by moving `Kaltsit/selected.png` to `Kaltsit/selected_demoted_young_v2_realism_monitor.png`.
- `candidates_young_v2/review.md` now records monitor status.
- Next candidate must be generated as `candidates_realism_v3/` and reviewed before any new `selected.png` can exist.

## Batch Rule

Do not continue bulk generation until at least one calibration operator passes the realism gate in a visible review. Preferred calibration set:

- Kal'tsit: hard test for young-but-authoritative medical realism.
- Nian: hard test for beautiful director/cameo presence while preserving original outfit.
- Aak or Magallan: test for non-default face and practical prop/wardrobe believability.

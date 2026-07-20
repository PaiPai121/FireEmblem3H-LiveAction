# Hilda Academy Youth Identity V4 Notes

Date: 2026-07-19

## Source Concern

The previous `academy/selected.png` was path-valid and had the correct twin-tail direction, but it still read too mature for the academy phase in close review. This failed the intended "student first" visual standard even though file integrity checks passed.

## Selected Candidate

- Candidate: `assets/characters/golden_deer/Hilda/academy/candidates_youth_identity_v4_2026-07-19/candidate_01.png`
- Synced selected: `assets/characters/golden_deer/Hilda/academy/selected.png`
- Previous selected backup: `assets/characters/golden_deer/Hilda/academy/selected_before_youth_identity_v4_2026-07-19/previous_selected.png`
- Built-in generation source: `/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/ig_07799b997ffcf160016a5ced808f748191a4d53e9b44afefe1.png`

## Visual QA

- Pass: reads younger and closer to academy-age student casting than the previous selected image.
- Pass: pink twin ponytails, black academy jacket, white blouse, cream front panel, gold trim, dark skirt, boots, and Golden Deer color language remain readable.
- Pass: compact wooden training axe reads as safe mock-battle weapon.
- Pass: no mature glamour pose, adult warrior armor, war-phase styling, text, or watermark.

## Downstream Constraint

Any existing Scene09 generated start/key frame that already contains Hilda was created before this replacement and should be treated as stale for video generation until regenerated with this v4 selected asset.

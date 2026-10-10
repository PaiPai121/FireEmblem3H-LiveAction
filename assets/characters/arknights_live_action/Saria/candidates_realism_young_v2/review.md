# Saria Realism Young V2 Candidate QA

Reviewer: asset realism QA

Decision: `blocked_needs_revision`

Status: `superseded_user_rejected`

## Failure-First Review

P0 blocker found after user-facing review: the still does not meet the updated young-beautiful casting target strongly enough.

The old selected image failed the updated casting direction because Saria read too old. V2 improved the costume and shield, but the face, makeup, and expression still read too mature/harsh for the active `CASTING_STYLE_BIBLE.md` requirement.

## Gate Checks

- Reference exists: pass, `references/wiki_terra_saria_base.png`.
- Young-adult casting: fail, reads older and less fresh-faced than the required 18-22 young-adult casting target.
- Costume silhouette: pass, white/black/orange armored lab-security suit, high collar, harness, gloves, boots, headgear, and shield.
- Shield/defender identity: pass, large rectangular shield remains central without fully hiding costume.
- Realism: pass, practical studio/lab set, matte floor, scuffed shield, believable technical fabric and armor.
- Face differentiation: pass, distinct from Kal'tsit, Ch'en, and Texas.
- Artifact check: pass at review resolution; hands, shield edge, boots, headgear, and device props have no P0 breakage.
- Downstream usability: fail until replaced by a younger, prettier, still clearly adult Saria identity lock.

## Monitor Notes

- Do not use wording that implies older executive, mature boss, or middle-aged scientist.
- Treat badge/device markings as abstract patches; do not request readable text.
- Video prompts must lock shield size and body visibility together.

## Gate

Blocked. `selected.png` was demoted to `selected_demoted_young_v2_user_rejected.png`.

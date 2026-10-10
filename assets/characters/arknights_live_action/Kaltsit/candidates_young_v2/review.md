# Kal'tsit Young V2 Candidate QA

Reviewer: asset QA

Decision: `monitor_required`

Status: `candidate_monitor_required`

## Failure-First Review

No P0 blocker found against the young-adult casting rule. Candidate reads as a beautiful clearly adult young woman around 18-22 rather than an older doctor.

However, this review predates the active real-actor wardrobe realism gate. Under `REALISM_STYLE_BIBLE.md`, the image is not approved for `selected.png`: the face and finish still read too polished, too porcelain, and too close to a refined cosplay/fashion still rather than a grounded film-production costume fitting.

## Remaining Monitor Notes

- The inner garment still has a dress-like fashion read, so future video prompts must emphasize the Rhodes Island medical coat and high-collar black inner layer.
- Do not let the face soften into a generic idol expression; keep the cold clinical gaze.
- Regenerate with neutral wardrobe-fitting lighting, less glamour finish, more natural skin texture, practical sewn garment construction, and less AI-perfect hair.

## Passed Locks

- Young adult casting target.
- Long light green hair.
- Feline/head silhouette.
- White/black coat with green medical palette.
- Clean lab setting and medical authority.
- Distinct face from the existing selected operators.

## Gate

Not approved for `selected.png` under the active realism gate. Existing `selected.png` was demoted to `selected_demoted_young_v2_realism_monitor.png`; downstream packages must not use it as a production identity lock.

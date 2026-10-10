# Nian Candidate Reference V9 Review

Integrity / Gate Blockers

- Candidate image exists at `candidate_01.png`.
- Local official-style references exist in `Nian/references/`.
- No `selected.png` promotion has occurred.

Visual Audit Coverage

- Reviewed `candidate_01.png`.
- Compared against `wiki_terra_nian_thunderbolt_director.png`, `wiki_terra_nian_base.png`, and the previous v8 candidate.

Blocking Issues

- P0: Costume does not match the Thunderbolt Director reference at a structural level.
- P0: The official reference has a seated director silhouette with an oversized circular hat/backplate shape, laptop/desk/camera-set language, red-white-black layered panels, and a very specific asymmetrical director outfit. V9 turns that into a generic standing cosplay/full-body coat look.
- P0: The candidate preserves some surface tokens, but it changes the actual garment construction, pose language, and silhouette enough that downstream prompts would inherit the wrong Nian design.
- Not approved as selected.

Continuity Issues

- Full body, boots, coat hem, horns, hair, sunglasses, and tail are visible, but visibility is not approval.
- Cleaner background than v8, but that does not compensate for the costume mismatch.

Character / Canon Issues

- Partial identity tokens survive: white hair, red horns, sunglasses, tail, black/red/white color family.
- Failed identity/costume lock: the official Thunderbolt Director outfit's silhouette, seated director staging, hat/backplate, laptop/table setup, and precise layered white-red-black garment language are not preserved.
- Face is still polished and cosplay-like; this is secondary to the costume failure.

Cinematography / Blocking Issues

- Simple full-body standing pose supports asset review.
- Hands do not hide the central torso panels.
- Studio set context reads as modern production rather than fantasy location.

Motion or Downstream Risks

- Tail flame should be locked or simplified in video prompts to avoid deformation.
- Horns, sunglasses, red collar, and white wrap panels need explicit prompt locks.
- If used in long shots, the small red trim may drift; use close references for costume-critical shots.

Existing Material Findings

- V9 is not a valid game-costume candidate.
- V8 may remain a loose mood reference only, but should not be used as a costume reference.
- V6/V7 remain blocked and should not be promoted.

Required Revisions

1. Create a revision prompt that treats `wiki_terra_nian_thunderbolt_director.png` as costume and staging authority, not just mood.
2. Preserve the seated director composition, oversized circular hat/backplate, laptop/table, camera-set elements, red high collar, black jacket, white asymmetric torso panels, white engraved lower garment panel, black pants/shorts asymmetry, boot language, horns, sunglasses, and tail.
3. Use any generated image only after an explicit checklist compares every required reference element.

Decision

`blocked_needs_revision`

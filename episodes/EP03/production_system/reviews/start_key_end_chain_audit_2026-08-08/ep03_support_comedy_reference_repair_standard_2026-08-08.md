# EP03 Support-Comedy Reference Repair Standard - 2026-08-08

## Why This Standard Exists

EP03 is not a support comedy episode, but the local Golden Deer and Black Eagles support-comedy packages are the correct reference for dialogue-heavy image-to-video packaging. They prove how a quiet conversation shot can still have a playable start/key/end chain instead of three near-identical stills.

This standard supersedes any earlier interpretation that treated existing EP03 frames as video-ready merely because they were present, attractive, or traceable to local assets.

## Local Reference Packages Reviewed

- Golden Deer timing-safe contact sheet: `specials/golden_deer_support_comedy/all_episodes_contact_sheet_timing_safe.jpg`
- Golden Deer timing audit summary: `specials/golden_deer_support_comedy/dialogue_timing_audit_summary.md`
- Golden Deer prompt QA summary: `specials/golden_deer_support_comedy/prompt_qa_summary.md`
- Golden Deer representative timing-safe manifest: `specials/golden_deer_support_comedy/EP01_hilda_lorenz/delivery/video_generation_package_2026-07-31_timing_safe/package_manifest.json`
- Black Eagles EP04 visual contact sheet: `specials/black_eagles_support_comedy/delivery/video_generation_package_2026-07-28_ep04_petra_bernadetta_c/visual_contact_sheet.jpg`
- Black Eagles final delivery audit: `specials/black_eagles_support_comedy/final_delivery_audit.md`
- Black Eagles video prompt hardening audit: `specials/black_eagles_support_comedy/video_prompt_hardening_audit.md`
- Black Eagles representative manifest: `specials/black_eagles_support_comedy/delivery/video_generation_package_2026-07-28_ep04_petra_bernadetta_c/package_manifest.json`

## Extracted Production Rules

1. A dialogue shot must still be a playable beat. The frame chain should show a concrete change in body position, eyeline, hand gesture, distance, prop state, or emotional attention.
2. START, KEY, and END must be visually distinct enough to read as pre-action state, peak/turning point, and edit handoff.
3. Long dialogue blocks should be timing-safe. Golden Deer repaired dense 15s blocks into shorter 6-12s style beats when needed; EP3 should not hide an 18s line inside a static hold.
4. Prompt-contract pass is not visual approval. Black Eagles passed prompts only after adding identity, wardrobe, acting, frame-presentation, and motion-probe gates.
5. Japanese spoken dialogue belongs in the audio anchor. Chinese text may exist in working docs, but executable video prompts must not request Chinese/Mandarin voiceover or burned-in Chinese subtitles.
6. Clean 16:9 single-frame image anchors are required. No game UI, no subtitles, no contact-sheet crop, no rounded player frame, no letterbox/pillarbox, no artificial side fill.
7. Local references must drive the image work, but executable web prompts should refer only to the uploaded START/KEY/END frames. Local asset paths stay in metadata, manifests, operator notes, and review docs.
8. Full-duration generation should not be blind-submitted. Use a 3-second motion probe first, then approve only if face, academy-era costume topology, frame presentation, and restrained acting hold.

## EP03 Repair Policy

Current highest truthful stage: `prompt_asset_package`.

The current visible frames may be used only as local-asset layout/reference material unless a per-shot review proves that:

- the frame set uses local game/source evidence and local identity plates;
- the start/key/end chain contains a real playable change;
- Japanese audio timing lands near the cut;
- no Chinese/Mandarin voiceover is requested;
- no subtitles, UI, rounded frame, letterbox/pillarbox, or artificial side fill are present;
- the shot has a 3-second motion-probe requirement before full generation.

## Shot-Specific Revision Directives

| Shot | Current Decision | Support-Comedy Style Repair |
| --- | --- | --- |
| Shot003 | `blocked_needs_revision` | Rebuild the cathedral briefing as a Rhea/Seteth institutional beat: START on the students entering or settling below the dais, KEY on Rhea naming Lonato with a visible hand/face/authority turn, END on Dimitri/Byleth absorbing the order and preparing the Ashe handoff. |
| Shot012 | `blocked_needs_revision` | Rebuild the rebel-camp reveal as surveillance cause/effect: START from obscured recon foreground, KEY reveals organized Western Church signs/prayer/formation, END shifts attention toward the Blue Lions tactical halt. |
| Shot023 | `blocked_needs_revision` | Rebuild Lonato's refusal as a moral pressure beat: START on Ashe's plea reaching him, KEY on Lonato looking to Ashe while refusing to lower his weapon, END on the line hardening into tactical danger for Byleth's command. |
| Shot030 | `blocked_needs_revision` | Rebuild aftermath as silent reaction chain: START on students after Lonato falls, KEY isolates Ashe/Dimitri or the group realizing this was not training, END transitions emotionally toward the return to Rhea. |
| Shot031 | `blocked_needs_revision` | Rebuild the cathedral return as institutional erasure: START on mud/fog-marked students before Rhea, KEY on Rhea's calm blessing/judgment, END on Ashe/Dimitri or Byleth registering the mismatch before the execution-order cut. |
| Shot035 | `blocked_needs_revision` | Rebuild Dimitri night talk as an acting beat: START on quiet shared corridor space, KEY on Dimitri's line visibly landing as he turns or lowers his gaze, END leaves Byleth alone with the moral aftertaste for Shot036. |

## Promotion Gate

These six shots remain blocked until new or reselected anchors pass visual review under this standard. The remaining thirty shots remain `monitor_required` and require full-resolution visual review plus 3-second motion probes before any `approved_for_video` claim.

Decision: `blocked_needs_revision` for EP03 video-generation readiness.

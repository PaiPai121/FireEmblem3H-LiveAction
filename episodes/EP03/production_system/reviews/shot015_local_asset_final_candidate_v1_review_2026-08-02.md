# Shot015 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: `production_system/reviews/shot015_local_asset_final_candidate_v1_review_2026-08-02.jpg`
- Start: `storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Key: `storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`
- End: `storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Continuity input: `storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`
- Source evidence: `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot015/Shot015_local_video_source_evidence_2026-08-01.jpg`
- Local proof: `production_system/reviews/local_asset_previs_proof_2026-07-31/Shot015_local_asset_previs_proof_2026-07-31.jpg`

## Visual Audit

Shot purpose: make the opposing force disciplined and faith-driven, not disposable targets.

- Start frame: passes as emergence from fog after Shot014's shield impact. The formation reads as organized Western Church soldiers rather than raiders.
- Key frame: passes as the action peak. Shields, spears, church-derived banners, holy tokens, and chant performance are visible without subtitles or readable text.
- End frame: passes as edit handoff. The formation is close and aligned, with Byleth's edge silhouette setting up Dimitri's controlled response.
- Character/faction identity: SeirosSoldier visual language and church flags are locally traceable; Byleth is edge/partial by design.
- Frame chain: start/key/end are visually distinct and communicate emergence, formation clarity, and near-contact handoff states.

## Blocking Issues

No still-frame story/action blocker for Shot015 final candidate v1.

## Downstream Risks

- Rebel soldiers may become faceless clones or a chaotic swarm.
- Model may turn church believers into generic bandits, monsters, or villainous raiders.
- Flags, shields, or prayer tokens may generate readable text.
- Chant timing may add subtitles or overacting.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, run chant timing QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to `approved_for_video` if disciplined formation, faction identity, non-graphic tone, no-readable-text, and no-UI/no-subtitle presentation survive the probe.

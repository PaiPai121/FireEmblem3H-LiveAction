# Shot025 Critical Re-audit Review

- Shot: `Shot025`
- Version: `critical_reaudit_regen_v8_2026-09-02`
- Reviewer role: `independent-critical-reaudit-visual-qa-agent`
- Review date: `2026-09-02`
- Still-frame decision: `visual_review_passed`
- Downstream status: `monitor_required`

## Exact Outputs Reviewed

- `storyboards/Shot025/critical_reaudit_regen_v8_2026-09-02/start_frame.png`
- `storyboards/Shot025/critical_reaudit_regen_v8_2026-09-02/key_frame.png`
- `storyboards/Shot025/critical_reaudit_regen_v8_2026-09-02/end_frame.png`
- `storyboards/Shot025/critical_reaudit_regen_v8_2026-09-02/contact_sheet.jpg`

## Source Provenance

- START source: `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-0b5bcd42-6900-4f79-818a-a9c8addf54f2.png`
- KEY source: `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-04a02270-0d1b-457c-aac1-ccc01d583f3e.png`
- END source: `/Users/zekun/.codex/generated_images/019fa905-14b8-7523-8ffe-84b1cca2e055/exec-b6d1c35d-aa9b-4467-9cad-42b1d898eab3.png`
- Generation mode: `imagegen_integrated_live_action_with_canonical_local_identity_and_terrain_separation`
- Local identity/style references: female Byleth weapon-fullbody selected asset, Lonato selected asset, Ashe selected asset, BanditSoldier selected asset, and the EP03 Lonato battlefield live-action style reference.

## Visual Findings

- The previous v7 set was rejected for review because its three frames were too close in composition and did not make the beat progression readable enough, even though the stated geography was safer.
- v8 START is a genuine side-offset extreme wide: the academy formation is behind the lower-right foreground barricade; the broad muddy basin, drainage ditch and second rise dominate the route; two rebel guards occupy separate middle barriers; Lonato is a tiny isolated figure on the far upper-left ridge.
- v8 KEY keeps the same long distance while showing a restrained command gesture and a lateral guard step that closes one crossing gap. Byleth's sword remains sheathed and no student enters the basin.
- v8 END shifts modestly right and settles the formation behind the barricade while the two guards finish the offset barrier. Ashe remains at the safe right flank for Shot026, and Lonato remains distant.
- START/KEY/END are visibly different images and read as command, guard closure, and settled containment rather than three duplicate stills.
- The performers, terrain, wet contact, timber barriers and practical lanterns read as integrated live action. No game UI, screenshot treatment, pasted portrait plate, subtitle, border, text or named duplicate was observed.

## Continuity / Reject Conditions

- Shot024 -> Shot025: receives the rear command pocket and reveals the terrain-separated containment geography.
- Shot025 -> Shot026: hands off the same lower-right Ashe mark and far upper-left Lonato direction without moving the academy formation forward.
- Reject if a student or Byleth can reach Lonato in one sword step, the basin or terrain breaks disappear, the middle guard barrier collapses, Lonato enlarges into a face-to-face target, START/KEY/END collapse into one pose, or any Chinese/Mandarin voice, subtitle, UI, border or pasted cutout appears.

## Remaining Gates

- Prompt-against-frame QA: pending.
- Strict adjacent continuity QA: pending.
- Native Japanese audio probe: pending; this shot has no authorized spoken line and uses battlefield ambience only.
- Three-second motion probe: pending.
- Do not promote to `approved_for_video` until these gates pass.

# EP02 Scene09 Teacher Separation Patch Review

Date: 2026-07-27

Decision: `superseded_monitor_required`

Supersession note:
- This review records the 2026-07-27 teacher-separation pass. Its original Shot034B empty-objective conclusion is no longer current.
- Current authoritative Shot034B state is the 2026-07-30 Hanneman single-lane patch: visible named-only is Byleth, Dimitri, Hanneman; Manuela is absent, offscreen, silent, and never paired with Hanneman.

Scope:
- Shot033B was rebuilt as a student-only split-route command.
- Shot034B is superseded by Hanneman's separate faculty lane ruling with Byleth, Dimitri, and Hanneman only.
- Hanneman and Manuela must not appear together as readable figures in Shot033B or later.

Reviewed frames:
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_start.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_key.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_end.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_start.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_key.png`
- `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_end.png`

Visual findings:
- Shot033B now contains Byleth, Ashe, Felix, and Ingrid only. No Hanneman, Manuela, teacher figure, adult examiner, crowd, or extra readable human appears.
- Shot033B start/key/end form a coherent action chain: Byleth gives the command, Ashe/Felix/Ingrid split into left/center/right routes, and two far-separated empty objective markers stay visible.
- Student eyelines and body orientation now face the objective routes rather than the camera.
- Current Shot034B is a quiet Hanneman single-lane ruling: Byleth, Dimitri, and Hanneman only; Manuela is absent, and no teacher pair appears.

Prompt and manifest findings:
- `production_system/video_delivery_manifest.json` lists Shot033B visible named only as Byleth, Ashe, Ingrid, Felix.
- Shot033B prompt uses the no-teacher frame paths and rejects Hanneman, Manuela, teacher figures, adult examiners, occupied markers, and route collapse.
- Current Shot034B prompt and manifest list visible named only as Byleth, Dimitri, Hanneman; they reject Manuela, extra readable humans, and any paired-teacher staging.
- `scripts/audit_scene09_prompt_frame_consistency.js` passes for 42 shots after the patch.
- Prompt contract validation passes for Shot033B and Shot034B.

Residual risks:
- Shot033B is visually suitable as a prompt asset, but it remains `monitor_required` because AI video may still drift weapons, faces, or add figures during motion.
- This patch does not upgrade the whole Scene09 package to `video_generation_package`.

Required next checks before expensive video generation:
- Keep Shot033B/034B under clip-level motion QA after video generation.
- Re-run strict adjacent-shot continuity if any later rebuild script modifies the frame paths or visible named-only lists.
- Reject any generated clip that reintroduces Hanneman and Manuela together in the same readable frame.

# Shot012 Frame Spec

Shot ID: Shot012
Stage: storyboard
Status: frames_pending
Depends On: script.md; shot_list.md; source_video_breakdown.md
Script Beat: 叛军营地远望
Shot Purpose: 让观众先看到 Lonato 的人不是普通盗匪。
Duration Target: 14s
Location: rebelCamp
Characters Visible: Byleth, Ashe, SeirosSoldier
Character Identity Locks:
- Byleth: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy-era professor identity only, no male Byleth, no war-phase aging, no generic extra face.
- Ashe: assets/characters/blue_lions/Ashe/academy/selected.png; academy-era identity, no war-phase aging, no generic extra face.
- SeirosSoldier: assets/characters/church_of_seiros/SeirosSoldier/selected.png; academy-era identity, no war-phase aging, no generic extra face.
Asset References:
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/church_of_seiros/SeirosSoldier/selected.png`
- `assets/locations/EP03/act01/WesternChurchRebelCamp/WesternChurchRebelCamp_reference.png`
- `source_refs/Shot012_source.png` as source/layout reference
Start Frame Intent: Establish the pre-action state for 叛军营地远望; preserve geography from the source reference and keep the viewer's first read clear.
Key Frame Intent: Capture the decisive visible beat: 西方教会叛军营地，旧旗、祈祷木牌、疲惫士兵围着火。
End Frame Intent: Land on the state needed for the next cut: cut to Blue Lions tactical halt.
Camera: Byleth 视角低角度窥看。
Blocking: 西方教会叛军营地，旧旗、祈祷木牌、疲惫士兵围着火。
Screen Direction: Maintain Blue Lions moving from lower/right foreground toward upper/left fog ridge unless the cathedral/monastery scene is static.
Action Peak: 让观众先看到 Lonato 的人不是普通盗匪。
Dialogue / Audio Anchor: Distant prayers and armor friction. No spoken dialogue.
Edit In: cut from village
Edit Out: cut to Blue Lions tactical halt
Continuity Requirements: Shot 12 must preserve mud/fog residue, academy uniforms, and the established moral pressure into adjacent shots.
Motion Risks: bandits instead of organized rebels
Reject If:
- visible game UI, subtitles, dialogue boxes, damage numbers, or menus appear
- named character identity drifts from listed assets
- academy students read as adult war-phase soldiers
- the shot contradicts the non-graphic, duty-focused tone

Planned Frames:
- start_frame.png: pending generation
- key_frame.png: pending generation
- end_frame.png: pending generation

Support-Comedy Reference Repair Pass - 2026-08-08:
- Reference standard: `production_system/reviews/start_key_end_chain_audit_2026-08-08/ep03_support_comedy_reference_repair_standard_2026-08-08.md`
- Current decision: `blocked_needs_revision`; the current anchors read as one fog/camp mood image rather than a surveillance beat.
- START must begin from obscured recon foreground, with Byleth/Ashe or Seiros scout presence used only if identity remains readable and source-supported.
- KEY must reveal organized Western Church evidence: prayer posture, old flags, disciplined camp layout, or exhausted soldiers around the fire.
- END must redirect attention toward the Blue Lions tactical halt, with screen direction preserved into Shot013.
- Reject if the camp becomes generic bandits, if the faith/organization clue is not visible, or if all three frames keep the same distant fog composition.
- Required probe: 3-second identity/wardrobe/frame-presentation probe before any full-duration generation.

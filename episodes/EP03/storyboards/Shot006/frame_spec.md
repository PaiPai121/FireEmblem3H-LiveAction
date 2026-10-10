# Shot006 Frame Spec

Shot ID: Shot006
Stage: storyboard
Status: monitor_required
Script Beat: Ashe 讲出旧恩
Shot Purpose: Ashe 主动面对任务，证明自己不是被剧情拖着走。
Duration Target: 13 seconds
Location: classroom
Characters Visible: Ashe, female academy Byleth, Dimitri

## Identity Locks

- Ashe: assets/characters/blue_lions/Ashe/academy/selected.png; youthful academy archer and bow.
- Byleth: assets/characters/protagonist/BylethFemale/professor/selected.png; female academy professor only.
- Dimitri: assets/characters/blue_lions/Dimitri/academy/selected.png; academy-era prince only.

## Adjacent Continuity

Shot005 END hands off on Ashe crossing the classroom threshold while Dimitri holds the door open and Byleth remains inside with an open hand. Shot006 START must match that door, direction, wardrobe, lighting, and body momentum. Do not reset Ashe to the window or another side of the room.

Start Frame Intent: Match action from Shot005 END: Ashe is halfway through the open doorway, one hand on the door edge; Dimitri holds the door from the room side; Byleth remains inside and still offers the path.

Key Frame Intent: Ashe stops at the threshold and turns his upper body back toward Byleth while keeping one hand on the latch. Byleth takes one small step toward him; Dimitri keeps the door open. The line is delivered during the stop-and-turn.

End Frame Intent: Ashe turns back into the corridor and crosses the threshold. Dimitri follows one step behind and pulls the door inward. Byleth stays inside watching them leave.

Camera: Match-action doorway coverage, preserving the axis and light of Shot005 END; move from the threshold to Ashe's turn and settle on the corridor exit.
Blocking: START Ashe out / Byleth in / Dimitri at door; KEY Ashe turns back at the threshold; END Ashe exits, Dimitri follows, Byleth remains.
Action Peak: Ashe pauses mid-departure to tell Byleth what Lonato gave him, then chooses to leave with the group.
Dialogue / Audio Anchor: Ashe, in Japanese: 彼は、僕と弟妹に居場所をくれました。でも今の僕は、あなたの生徒です。

Asset References:
- assets/characters/blue_lions/Ashe/academy/selected.png
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/blue_lions/Dimitri/academy/selected.png
- assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png
- episodes/EP03/storyboards/Shot005/critical_reaudit_regen_v2_2026-08-21/end_frame.png as match-action reference

Continuity Requirements: START, KEY, and END must share the same door axis, floor contact, academy wardrobe, and daylight. They must be distinct physical states, not a reset tableau or lighting-only change. No pasted cutouts.

Reject If:
- Shot006 START returns Ashe to the window or reverses the Shot005 exit direction
- the door is absent, closed in START, or never becomes a real exit
- Byleth becomes male, war-phase, or detached from the floor
- the bow changes into a sword or disappears
- the frames become a static three-person conversation, subtitle, text, or game UI

Planned Frames:
- start_frame.png: storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/start_frame.png
- key_frame.png: storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/key_frame.png
- end_frame.png: storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/end_frame.png
- contact_sheet.jpg: storyboards/Shot006/critical_reaudit_regen_v2_2026-08-21/contact_sheet.jpg

Critical Re-audit Repair Pass — 2026-08-21

The first v2 attempt failed adjacent continuity because it jumped from Shot005's doorway exit back to Ashe at the classroom window. The current v2 is a match-action repair: threshold exit, stop-and-turn dialogue, then corridor departure. Keep monitor_required until prompt QA and a 3-second motion probe confirm the door axis and handoff.


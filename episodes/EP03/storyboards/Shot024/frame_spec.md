# Shot024 Frame Spec

Shot ID: Shot024
Stage: storyboard
Status: monitor_required
Current Version: critical_reaudit_regen_v3_2026-08-23
Script Beat: Byleth 下令包围
Shot Purpose: Byleth 保护学生与平民，同时把 Lonato 留在远端，先用队形和路线控制战场。
Duration Target: 7.6 seconds
Location: Lonato battlefield ridge
Characters Visible: female Byleth, Ashe, Lonato, Dimitri, Dedue, Ingrid

## Critical Re-audit Finding

Shot024 v2 made the command readable, but the foreground Byleth and distant Lonato were not physically explicit enough. v3 establishes a protected command center behind Ashe. Byleth does not walk into Lonato's reach; the sword tip indicates empty flank lanes only. The command frame must show that the Blue Lions are building a buffer, not surrounding a man for an immediate execution.

## Character Identity Locks

- Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`; female academy-era professor only, no male or war-phase Byleth.
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; bow lowered, right/nearer negotiation mark.
- Lonato: `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`; older white-haired armored man, shield grounded, sword low, far uphill.
- Dimitri: `assets/characters/blue_lions/Dimitri/academy/selected.png`; blond, blue cape, sword, front-left lane.
- Dedue: `assets/characters/blue_lions/Dedue/academy/selected.png`; academy identity, visible compact silver-white nape braid where angle permits, front-center lane.
- Ingrid: `assets/characters/blue_lions/Ingrid/academy/selected.png`; academy identity, right fog lane.

## Presence and Geography Locks

- Exactly six named readable performers. Wounded people and rebels are indistinct background pressure only.
- Byleth is in the middle/rear command pocket, at least 3 metres behind Ashe and well short of Lonato. Her sword never points at a body.
- Ashe and Lonato retain the Shot023 road buffer. Lonato stays far uphill; Ashe remains the near witness with bow low.
- Dimitri, Dedue, and Ingrid begin movement from the rear lanes. They do not arrive beside Lonato inside this shot.
- No Catherine, Rhea, Felix, Mercedes, Annette, Sylvain, horse, charge, or graphic injury.

## Asset References

- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/characters/kingdom/Lonato/legacy_ep01/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png`
- `assets/characters/blue_lions/Ingrid/academy/selected.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `storyboards/Shot023/critical_reaudit_regen_v6_2026-08-23/end_frame.png`

## Frame Intents

Start Frame Intent: Receive the wide Shot023 road and refusal. The camera sits behind the student line: Ashe is nearer right, Lonato is small and uphill left, Byleth enters from the rear center, and Dimitri/Dedue/Ingrid remain separated in rear lanes. The first state is Byleth measuring distance, not confronting Lonato.

Key Frame Intent: Byleth gives the order from the protected command pocket. She turns her eyes across Ashe, the wounded road edge, and Lonato, then extends the sword tip low toward two empty side lanes. The blade points at mud and space, never at Lonato or a person. The central road buffer remains visible.

End Frame Intent: Byleth retracts the sword. Dimitri and Dedue take first small steps into the left/center lane while Ingrid begins the right fog lane. Ashe and Lonato remain separated at their marks. The two wings are only beginning, with no encirclement completed.

## Camera and Blocking

Camera: 16:9 live-action road-axis progression: wide observation, readable tactical medium-wide command, then wider formation handoff. Keep ground perspective and scale; no poster lineup, no game-map aerial, no sword-to-body close-up.

Blocking: Byleth rear center -> low empty-lane command -> remains rear center. Ashe near right and Lonato far uphill left stay fixed. Dimitri/Dedue peel left-center; Ingrid peels right. Preserve a central open road.

Screen Direction: retain Lonato left/uphill and Ashe right/nearer from Shot023. Blue Lions move from the lower/rear road toward side lanes, never straight at Lonato.

Action Peak: Byleth's controlled command and the first flank separation.
Dialogue / Audio Anchor: Byleth, in Japanese: 護衛を分断しろ。村道へ近づけるな。
Edit In: cut from Lonato refusal
Edit Out: cut to two-wing move

## Continuity Requirements

- Receive Shot023 v6's wide road buffer, low weapons, fog, blue banner, and left/right axis.
- Female Byleth only; Dedue's visible nape braid and academy age must survive.
- The command must make the later Shot025 buffer and Shot026 arrow line spatially inevitable.
- All performers share physical ground contact, scale, wet light, and one live-action environment.

## Reject If

- Byleth is close enough to Lonato to read as an immediate execution opportunity
- the sword tip points at a body, becomes a strike, or the command becomes a charge
- Ashe raises/fires the bow, Lonato attacks, or Dimitri/Dedue/Ingrid arrive at Lonato's side
- Byleth becomes male/war-phase, Dedue loses the braid, or a named extra appears
- the frames are a flat row, pasted cutouts, mismatched ground contact, UI, subtitles, Chinese/Mandarin voice, or readable text
- START, KEY, END collapse into one tableau or lose the central road buffer

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v3_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v3_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v3_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v3_2026-08-23/contact_sheet.jpg`

Current Visual Review: v3 is a rear-command and buffer-continuity rebuild. Keep `monitor_required` until exact-frame visual review, prompt-against-frame QA, and a 3-second motion probe pass.

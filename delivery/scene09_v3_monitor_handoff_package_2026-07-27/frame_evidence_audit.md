# Scene09 V3 Frame Evidence Audit

Date: 2026-08-01
Decision: frame_evidence_audit_passed_monitor_required
Shots checked: 42
Frames checked: 126/126
Frames passed: 126/126

## What This Proves

- All packaged start/key/end PNG files exist and meet basic delivery dimensions.
- Packaged frame digests match their declared source-frame files.
- Shot034B uses the current `34D_Shot034B_empty_objective_*` frame set, not the deprecated Hanneman-lane frame set.
- Shot033B uses the no-teachers split-route frame set.
- Shot034G and Shot036 use the current core-victory lance/final-lance frame sets.
- Codex full-size visual spotcheck covers Shot032, Shot032F, Shot032G, Shot034B, and Shot034G with package frame SHA-256 evidence.
- ASCII-labeled high-risk contact sheet: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/high_risk_contact_sheet_ascii_2026-08-01.jpg` (1580x1640, sha256 ad78c2445fa198d39068f80ca282538533a08478a7bd3210c3fb3594e54cbab3).

## Full-Size Visual Spotcheck

### Shot032

Status: `visual_spotcheck_passed_monitor_required`
Frames reviewed: key
Expected visible: Dedue, Mercedes
Observation: Key frame shows Mercedes behind Dedue with a short white healing pulse into Dedue's shield-arm line; no extra readable people.

- key: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/key_frame.png (1672x941, sha256 82569c1037c27b9fb175aa279b1668a3e596a2b6bebfefe9b3487b54eb09bdf7)
- Problems: none

### Shot032F

Status: `visual_spotcheck_passed_monitor_required`
Frames reviewed: key
Expected visible: Felix, Ashe, Hubert
Observation: Key frame reads as Felix and Ashe containing Hubert in a nonlethal capture beat; no anonymous students or spectators.

- key: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/key_frame.png (1672x941, sha256 a5e23d1855f90130f1681071c5f630afe9eca949b2c7c033aec0a61263c73b60)
- Problems: none

### Shot032G

Status: `visual_spotcheck_passed_monitor_required`
Frames reviewed: key
Expected visible: Claude, Leonie, Dorothea, Bernadetta
Observation: Key frame reads as Claude and Leonie controlling Dorothea and Bernadetta on the Black Eagles backline; no extra readable people.

- key: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/key_frame.png (1672x941, sha256 1a1b3615d05ac8a80152270beb4070ac3e4a5911a9956a9621a7c7b9346be67a)
- Problems: none

### Shot034B

Status: `visual_spotcheck_passed_monitor_required`
Frames reviewed: start, key, end
Expected visible: Byleth, Dimitri
Observation: Full-size start/key/end frames show Byleth and Dimitri at two far-separated empty faculty objective markers; Hanneman and Manuela are absent/offscreen/silent/unpaired.

- start: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/start_frame.png (1672x941, sha256 5bd1ba1899110a4779c96555781116b0239eb03e38cdd701b84c872e50269422)
- key: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/key_frame.png (1672x941, sha256 150dcdfc01fabf1e7ef17f597a6c42433a4b8df74555a2ed63d8722f50f6ae04)
- end: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/end_frame.png (1672x941, sha256 9df14c2b918346dda69ff8651d610b952a7f46d2bf64c4ccc0a15fb781b2e8a4)
- Problems: none

### Shot034G

Status: `visual_spotcheck_passed_monitor_required`
Frames reviewed: key
Expected visible: Byleth, Dimitri, Dedue
Observation: Key frame keeps the final victory to the exhausted Byleth, Dimitri, and Dedue core; the full Blue Lions class does not reset into the win image.

- key: delivery/scene09_v3_monitor_handoff_package_2026-07-27/shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/key_frame.png (1672x941, sha256 32fb2b560dc26350dcf7392c00b78d2c827389bcdc5503d107a017ad884c8186)
- Problems: none

## What Still Needs Clip QA

- The generated video model can still invent extra readable people, face drift, weapon drift, or illegal active-combat re-entry.
- Promotion beyond `monitor_required` requires real clips, extracted review frames, and Codex motion self-audit.

## Problems

- none


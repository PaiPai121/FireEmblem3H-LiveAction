# Scene09 V3 Codex Motion Self-Audit Packet

Use this only after real model-generated clips exist and `build_scene09_v3_clip_motion_review_assets.js` has extracted start/mid/end frames.

Codex must inspect each clip and extracted frame set directly. The user should not be asked to approve continuity, identity, or motion rows.

## Global Rejects

- Any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette.
- Any captured, defeated, stood-down, route-cut, or spent character returning to active combat.
- Hanneman and Manuela staged as a same-lane/same-sigil teacher pair.
- Shot034B without exactly Byleth and Dimitri readable, with empty faculty objective markers and Hanneman/Manuela absent.
- Shot034G as a full-class Blue Lions celebration instead of an exhausted core win.
- Blood, lethal impacts, humiliation, subtitles, captions, visible text, or watermark.

## Files

- `motion_self_audit_matrix.csv`: full per-shot review matrix.
- `decision_update_template.jsonl`: machine-readable rows for motion decision updates.
- `../motion_self_audit_apply_gate.md/json`: validation report written by the apply gate before any decision rows can be trusted.

## Apply Gate

After Codex inspects the real full clip and the extracted start/mid/end review frames for all 42 shots, update `decision_update_template.jsonl` with final `motion_review_passed`, `blocked_needs_revision`, or `rejected` decisions. Keep each row's `clip_signature` bound to the exact current `expected_clip` file size, mtime, and SHA-256; also keep `review_evidence.review_frame_signatures.start/mid/end` bound to the exact current extracted frame paths, file sizes, mtimes, and SHA-256 hashes. Set `review_evidence.full_clip_reviewed`, all `review_evidence.review_frames_checked` flags, and `review_evidence.clip_signature_verified` to `true` only after direct inspection. Then run:

```bash
node scripts/apply_scene09_v3_motion_self_audit_decisions.js delivery/scene09_v3_monitor_handoff_package_2026-07-27/motion_self_audit/decision_update_template.jsonl --apply
```

The apply gate rejects pending rows, user/operator approvals, missing or stale clip signatures, missing or stale start/mid/end frame signatures, missing frame-review evidence, missing reviewer notes, unsupported decisions, and any passed row without all required checks set to `pass`.

## Shot Rows

### 01 Shot025

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Edelgard, Claude
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 02 Shot025A

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: none
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: none. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 03 Shot026

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 04 Shot026B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 05 Shot026C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 06 Shot027

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Ashe, Claude
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Ashe, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 07 Shot027B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Ferdinand, Edelgard, Hubert, Dorothea
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Ferdinand, Edelgard, Hubert, Dorothea. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 08 Shot027C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Ferdinand, Edelgard, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 09 Shot027D

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: none
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 10 Shot028

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Annette, Mercedes, Ignatz
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Annette:pressured; Mercedes:pressured
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Annette, Mercedes, Ignatz. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 11 Shot028B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Edelgard, Hubert, Dorothea, Dimitri, Dedue
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Edelgard, Hubert, Dorothea, Dimitri, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 12 Shot028C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 13 Shot029

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 14 Shot029C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Claude, Ashe, Edelgard
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Annette, Mercedes
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Claude, Ashe, Edelgard. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 15 Shot029D

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Claude, Ashe
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Ashe:displaced; Leonie:hidden_flanker
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Claude, Ashe. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 16 Shot029B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Hilda, Lorenz, Ignatz, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 17 Shot030

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Byleth, Ferdinand
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 18 Shot030B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Byleth
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 19 Shot030C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Ignatz, Annette, Mercedes, Dorothea
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: Annette:pressured; Mercedes:pressured; Dorothea:pressured; Bernadetta:pressured
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Ignatz, Annette, Mercedes, Dorothea. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 20 Shot031

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Felix
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Felix. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 21 Shot031B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: none
- Must Not Return Active: none
- Changed This Shot: none
- No-Active-Combat Line: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 22 Shot032

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dedue, Mercedes
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Ashe, Annette; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
- Defeated / Removed After: blue_lions: Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Mercedes
- Must Not Return Active: blue_lions: Mercedes
- Changed This Shot: Dedue:restored_frontline; Mercedes:spent_after_heal
- No-Active-Combat Line: Mercedes
- Hard rejects: Visible named-only must stay exactly: Dedue, Mercedes. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Mercedes. | No-Active-Combat Line after this shot: Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 23 Shot032A

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Annette, Mercedes, Ashe, Claude
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: Annette:spent_stood_down; Mercedes:spent_stood_down; Ashe:restored_angle; Claude:displaced
- No-Active-Combat Line: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Annette, Mercedes, Ashe, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 24 Shot032B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Dedue, Hanneman
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 25 Shot032C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Edelgard, Hubert, Dorothea, Claude, Hilda
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Edelgard, Hubert, Dorothea, Claude, Hilda. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 26 Shot032D

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Edelgard, Claude
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 27 Shot032E

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes
- Changed This Shot: Byleth:active_available; Dimitri:engaged; Edelgard:pressured; Claude:displaced; Hilda:pressured
- No-Active-Combat Line: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 28 Shot032F

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Ashe, Hubert
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Captured / Objective-Defeated After: black_eagles: Hubert
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Changed This Shot: Hubert:captured_by_felix_and_ashe; Felix:captor_active; Ashe:captor_active
- No-Active-Combat Line: Annette, Mercedes, Hubert
- Hard rejects: Visible named-only must stay exactly: Felix, Ashe, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 29 Shot032G

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Claude, Leonie, Dorothea, Bernadetta
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: Dorothea:captured_by_leonie_and_claude; Bernadetta:captured_by_leonie_and_claude; Claude:captor_active; Leonie:captor_active
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Claude, Leonie, Dorothea, Bernadetta. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 30 Shot033

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Byleth, Dedue, Hanneman
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Dimitri, Byleth, Dedue, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 31 Shot033B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Ashe, Ingrid, Felix
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: none
- No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Byleth, Ashe, Ingrid, Felix. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 32 Shot033C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Ashe, Hanneman
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Changed This Shot: Hanneman:objective_suppressed; Ashe:spent_stood_down
- No-Active-Combat Line: Ashe, Annette, Mercedes, Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Ashe, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Ashe, Annette, Mercedes, Hubert, Dorothea, Bernadetta. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 33 Shot033D

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Ingrid, Manuela, Sylvain
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Changed This Shot: Manuela:route_cut; Ingrid:spent_stood_down; Sylvain:spent_stood_down
- No-Active-Combat Line: Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Dorothea, Bernadetta, Manuela
- Hard rejects: Visible named-only must stay exactly: Ingrid, Manuela, Sylvain. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Dorothea, Bernadetta, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 34 Shot034C

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Ferdinand
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Changed This Shot: Ferdinand:defeated_by_route_block; Felix:spent_stood_down
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Manuela
- Hard rejects: Visible named-only must stay exactly: Felix, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 35 Shot034D

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Hanneman
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Hanneman:objective_defeated_off_sigil
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 36 Shot034B

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Limited But Not Defeated After: black_eagles: Edelgard; golden_deer: Hilda
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Dimitri:surviving_winner; Byleth:surviving_command; Hanneman:objective_defeated_separate_lane; Manuela:route_cut_offscreen_unpaired
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela. | Shot034B hard lock: only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman and Manuela are absent/offscreen/silent/unpaired. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 37 Shot034E

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Claude, Hilda, Lorenz, Ignatz, Leonie
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard
- Limited But Not Defeated After: black_eagles: Edelgard
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Claude:stood_down_defeated_house; Hilda:stood_down_defeated_house; Lorenz:stood_down_defeated_house; Ignatz:stood_down_defeated_house; Leonie:stood_down_defeated_house
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Claude, Hilda, Lorenz, Ignatz, Leonie. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 38 Shot034F

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Edelgard, Ferdinand
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Edelgard:stood_down_defeated_house; Ferdinand:defeated_by_route_block
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Edelgard, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 39 Shot034G

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Byleth, Dimitri, Dedue
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: Dimitri:surviving_winner_exhausted; Dedue:surviving_winner_exhausted; Annette:spent_stood_down; Mercedes:spent_stood_down; Sylvain:spent_stood_down; Ingrid:spent_stood_down; Ashe:spent_stood_down
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Shot034G hard lock: exhausted Byleth, Dimitri, Dedue core only; no full Blue Lions class celebration or reset. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 40 Shot034

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Edelgard, Claude
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 41 Shot035

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Felix, Byleth
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

### 42 Shot036

- Expected clip: episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4
- Current clip signature: missing clip
- Current review frame signatures: {"start":null,"mid":null,"end":null}
- Visible named-only: Dimitri, Byleth
- Current decision: pending_clip
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Limited But Not Defeated After: none
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Changed This Shot: none
- No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Dimitri, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Reject if the clip becomes lethal, bloody, humiliating, text/subtitle/watermark-bearing, or drifts from the start/key/end chain. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Do not pass any clip containing unnamed readable people. | Do not pass any clip that reactivates Hubert after Shot032F capture. | Do not pass any clip that reactivates Dorothea or Bernadetta after Shot032G capture. | Do not pass any clip that stages Hanneman and Manuela as same-side partners. | Do not pass Shot034B unless only Byleth and Dimitri are readable; both faculty objective markers stay empty; Hanneman, Manuela, students, extras, spectators, crowds, and readable silhouettes are absent.

# Scene09 V3 Motion Probe Codex Review Packet

Decision: `motion_probe_review_packet_ready_clips_pending`

This packet is for the 3-second motion probe clips only. It does not approve full-duration generation by itself.

## Required Release Rule

- Codex must inspect every returned probe clip and the extracted start/mid/end review frames.
- Every check in `decision_update_template.jsonl` must be `pass` before `approve_full_duration` can be changed to `true`.
- No user/operator approval can replace Codex visual motion review.
- Full-duration generation remains blocked until every returned probe passes Codex visual motion review.
- If any unnamed readable person appears, or if a defeated/captured/stood-down character returns active, full-duration generation remains blocked.

## Files

- `motion_probe_review_matrix.csv`: per-shot probe review matrix.
- `decision_update_template.jsonl`: machine-readable probe review update rows.
- `frames/`: extracted start/mid/end evidence frames after real probe clips exist.
- `motion_probe_review_manifest.json`: signatures and current pending/review-required state.

## Current Summary

- Expected probe clips: 42
- Playable probe clips: 0
- Review frame sets ready: 0
- Full-duration approvals: 0

## Shot Rows

### 01 Shot025

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/01_Shot025_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4
- Visible named-only: Dimitri, Edelgard, Claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 02 Shot025A

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/02_Shot025A_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4
- Visible named-only: none
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: none. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 03 Shot026

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/03_Shot026_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 04 Shot026B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/04_Shot026B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4
- Visible named-only: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 05 Shot026C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/05_Shot026C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4
- Visible named-only: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 06 Shot027

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/06_Shot027_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4
- Visible named-only: Ashe, Claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Ashe, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 07 Shot027B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/07_Shot027B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4
- Visible named-only: Ferdinand, Edelgard, Hubert, Dorothea
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Ferdinand, Edelgard, Hubert, Dorothea. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 08 Shot027C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/08_Shot027C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4
- Visible named-only: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Ferdinand, Edelgard, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 09 Shot027D

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/09_Shot027D_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 10 Shot028

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/10_Shot028_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4
- Visible named-only: Annette, Mercedes, Ignatz
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Annette, Mercedes, Ignatz. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 11 Shot028B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/11_Shot028B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4
- Visible named-only: Edelgard, Hubert, Dorothea, Dimitri, Dedue
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Edelgard, Hubert, Dorothea, Dimitri, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 12 Shot028C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/12_Shot028C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4
- Visible named-only: Felix, Byleth, Ferdinand, Dedue
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 13 Shot029

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/13_Shot029_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4
- Visible named-only: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 14 Shot029C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/14_Shot029C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4
- Visible named-only: Claude, Ashe, Edelgard
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Claude, Ashe, Edelgard. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 15 Shot029D

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/15_Shot029D_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4
- Visible named-only: Claude, Ashe
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Claude, Ashe. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 16 Shot029B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/16_Shot029B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4
- Visible named-only: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Hilda, Lorenz, Ignatz, Sylvain, Ingrid. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 17 Shot030

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/17_Shot030_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4
- Visible named-only: Felix, Byleth, Ferdinand
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 18 Shot030B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/18_Shot030B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4
- Visible named-only: Felix, Byleth
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 19 Shot030C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/19_Shot030C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4
- Visible named-only: Ignatz, Annette, Mercedes, Dorothea
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Ignatz, Annette, Mercedes, Dorothea. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 20 Shot031

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/20_Shot031_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4
- Visible named-only: Byleth, Felix
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Felix. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 21 Shot031B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/21_Shot031B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4
- Visible named-only: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: none
- Captured / Objective-Defeated After: none
- Must Not Return Active: none
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: none. | No-Active-Combat Line after this shot: none.

### 22 Shot032

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/22_Shot032_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4
- Visible named-only: Dedue, Mercedes
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Mercedes
- Hard rejects: Visible named-only must stay exactly: Dedue, Mercedes. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Mercedes. | No-Active-Combat Line after this shot: Mercedes.

### 23 Shot032A

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/23_Shot032A_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4
- Visible named-only: Annette, Mercedes, Ashe, Claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Annette, Mercedes, Ashe, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes.

### 24 Shot032B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/24_Shot032B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4
- Visible named-only: Dimitri, Dedue, Hanneman
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Dimitri, Dedue, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes.

### 25 Shot032C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/25_Shot032C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4
- Visible named-only: Edelgard, Hubert, Dorothea, Claude, Hilda
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Edelgard, Hubert, Dorothea, Claude, Hilda. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes.

### 26 Shot032D

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/26_Shot032D_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4
- Visible named-only: Byleth, Dimitri, Edelgard, Claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes.

### 27 Shot032E

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/27_Shot032E_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4
- Visible named-only: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes
- Captured / Objective-Defeated After: none
- Must Not Return Active: blue_lions: Annette, Mercedes
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: none. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes. | No-Active-Combat Line after this shot: Annette, Mercedes.

### 28 Shot032F

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/28_Shot032F_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4
- Visible named-only: Felix, Ashe, Hubert
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Captured / Objective-Defeated After: black_eagles: Hubert
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert
- Hard rejects: Visible named-only must stay exactly: Felix, Ashe, Hubert. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert. | Shot032F hard lock: Hubert is defeated/captured by Felix and Ashe; Hubert must not continue active combat afterward.

### 29 Shot032G

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/29_Shot032G_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4
- Visible named-only: Claude, Leonie, Dorothea, Bernadetta
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Claude, Leonie, Dorothea, Bernadetta. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta. | Shot032G hard lock: Dorothea and Bernadetta are captured/objective-defeated by Leonie and Claude; neither returns readable or active afterward.

### 30 Shot033

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/30_Shot033_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4
- Visible named-only: Dimitri, Byleth, Dedue, Hanneman
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Dimitri, Byleth, Dedue, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta.

### 31 Shot033B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/31_Shot033B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4
- Visible named-only: Byleth, Ashe, Ingrid, Felix
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
- Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Byleth, Ashe, Ingrid, Felix. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta. | Must Not Return Active after this shot: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Annette, Mercedes, Hubert, Dorothea, Bernadetta.

### 32 Shot033C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/32_Shot033C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4
- Visible named-only: Ashe, Hanneman
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
- Hard rejects: Visible named-only must stay exactly: Ashe, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta. | No-Active-Combat Line after this shot: Ashe, Annette, Mercedes, Hubert, Dorothea, Bernadetta.

### 33 Shot033D

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/33_Shot033D_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4
- Visible named-only: Ingrid, Manuela, Sylvain
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Ingrid, Manuela, Sylvain. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Dorothea, Bernadetta, Manuela.

### 34 Shot034C

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/34_Shot034C_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4
- Visible named-only: Felix, Ferdinand
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Felix, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Manuela.

### 35 Shot034D

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/35_Shot034D_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4
- Visible named-only: Byleth, Hanneman
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Hanneman. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela.

### 36 Shot034B

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/36_Shot034B_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4
- Visible named-only: Byleth, Dimitri
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela; faculty_objectives: Hanneman, Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; faculty_objectives: Hanneman, Manuela
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela; faculty_objectives: Hanneman, Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; faculty_objectives: Hanneman, Manuela. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela; faculty_objectives: Hanneman, Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela. | Shot034B hard lock: Byleth and Dimitri only; both faculty objective markers stay empty; Hanneman and Manuela are absent/offscreen/silent/unpaired.

### 37 Shot034E

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/37_Shot034E_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4
- Visible named-only: Claude, Hilda, Lorenz, Ignatz, Leonie
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Claude, Hilda, Lorenz, Ignatz, Leonie. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.

### 38 Shot034F

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/38_Shot034F_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4
- Visible named-only: Edelgard, Ferdinand
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Edelgard, Ferdinand. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.

### 39 Shot034G

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/39_Shot034G_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4
- Visible named-only: Byleth, Dimitri, Dedue
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Byleth, Dimitri, Dedue. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela. | Shot034G hard lock: exhausted Byleth, Dimitri, Dedue core only; final win is battered, not a reset or full-class celebration.

### 40 Shot034

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/40_Shot034_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4
- Visible named-only: Dimitri, Edelgard, Claude
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Dimitri, Edelgard, Claude. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.

### 41 Shot035

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/41_Shot035_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4
- Visible named-only: Felix, Byleth
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Felix, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.

### 42 Shot036

- Status: probe_clip_pending
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/42_Shot036_probe.mp4
- Parent full clip: episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4
- Visible named-only: Dimitri, Byleth
- Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
- Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
- Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
- Hard rejects: Visible named-only must stay exactly: Dimitri, Byleth. | Reject if any unnamed readable student, spectator, soldier, bystander, crowd, or silhouette appears. | Reject if subtitles, captions, visible text, watermark, playback UI, letterbox, pillarbox, rounded frame, or artificial side-fill appears. | Reject if any face, age, wardrobe topology, house color, training weapon, or prop changes from the input frames. | Reject if any captured, defeated, stood-down, route-cut, or spent character resumes active combat. | Alive / Safe After this shot: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | Active / Controlling After this shot: command: Byleth; blue_lions: Dimitri, Dedue. | Captured / Objective-Defeated After this shot: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman. | Must Not Return Active after this shot: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela. | No-Active-Combat Line after this shot: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela.

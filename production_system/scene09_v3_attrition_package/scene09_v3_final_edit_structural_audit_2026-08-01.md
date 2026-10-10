# Scene09 V3 Final Edit Structural Audit
Date: 2026-08-01
Decision: final_edit_pending
Final output: `episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4`
Expected duration: 252s
## Result
- Exists: no
- OK: no
- Issue: final_edit_pending
- Final concat binding: blocked
- Final concat sidecar: blocked
- Final concat provenance: blocked
## Structural Checks
- final mp4 path exists
- file is non-zero
- ffprobe can parse container metadata
- at least one video stream is present
- duration is within +/-3s of package total duration
- final concat input contract signatures match the current package manifest
- final concat gate passed 8/8 against the current expected clip list before final edit approval
- final edit concat sidecar exists beside the mp4 and matches the current concat list exactly
- final edit concat provenance exists beside the mp4 and binds final SHA, concat-list SHA, source clip rows, and concat producer
## Final Concat Binding Problems
- final_concat_gate decision final_concat_blocked_clips_pending
- final_concat_gate checks 2/8 are not 8/8
- final_concat_gate direct expected-clip probe is not 42/42 for current package
## Final Concat Sidecar Problems
- missing final concat sidecar episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.concat.txt
## Final Concat Provenance Problems
- missing final concat provenance episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.provenance.json
# Motion Probe Upload Checklist

- Upload this batch as a 3-second image-to-video probe batch.
- Use `probe_batch.jsonl` for structured submitters or `probe_batch.csv` for manual entry.
- Do not use this batch to produce full-duration clips.
- Save returned clips according to `expected_probe_downloads.csv`.

## Rows

### 031_Shot033B_probe

- Shot: Shot033B
- Probe duration: 3s
- Visible named-only: Byleth, Ashe, Ingrid, Felix
- Visible But No Active Combat After: none
- Probe prompt: shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/probe_prompt.md
- Negative prompt: shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/negative_prompt.md
- Frames: shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/start_frame.png | shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/key_frame.png | shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/31_Shot033B_probe.mp4
- Must not return active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta

### 032_Shot033C_probe

- Shot: Shot033C
- Probe duration: 3s
- Visible named-only: Ashe, Hanneman
- Visible But No Active Combat After: Ashe
- Probe prompt: shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/probe_prompt.md
- Negative prompt: shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/negative_prompt.md
- Frames: shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/start_frame.png | shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/key_frame.png | shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/32_Shot033C_probe.mp4
- Must not return active: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta

### 033_Shot033D_probe

- Shot: Shot033D
- Probe duration: 3s
- Visible named-only: Ingrid, Manuela, Sylvain
- Visible But No Active Combat After: Ingrid, Manuela, Sylvain
- Probe prompt: shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/probe_prompt.md
- Negative prompt: shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/negative_prompt.md
- Frames: shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/start_frame.png | shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/key_frame.png | shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/33_Shot033D_probe.mp4
- Must not return active: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela

### 034_Shot034C_probe

- Shot: Shot034C
- Probe duration: 3s
- Visible named-only: Felix, Ferdinand
- Visible But No Active Combat After: Felix, Ferdinand
- Probe prompt: shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/probe_prompt.md
- Negative prompt: shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/negative_prompt.md
- Frames: shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/start_frame.png | shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/key_frame.png | shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/34_Shot034C_probe.mp4
- Must not return active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela

### 035_Shot034D_probe

- Shot: Shot034D
- Probe duration: 3s
- Visible named-only: Byleth, Hanneman
- Visible But No Active Combat After: Hanneman
- Probe prompt: shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/probe_prompt.md
- Negative prompt: shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/negative_prompt.md
- Frames: shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/start_frame.png | shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/key_frame.png | shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/35_Shot034D_probe.mp4
- Must not return active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela

### 036_Shot034B_probe

- Shot: Shot034B
- Probe duration: 3s
- Visible named-only: Byleth, Dimitri
- Visible But No Active Combat After: none
- Probe prompt: shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/probe_prompt.md
- Negative prompt: shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/negative_prompt.md
- Frames: shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/start_frame.png | shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/key_frame.png | shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/end_frame.png
- Expected probe clip: episodes/EP02/video_outputs/scene09_v3_attrition/motion_probes/36_Shot034B_probe.mp4
- Must not return active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela

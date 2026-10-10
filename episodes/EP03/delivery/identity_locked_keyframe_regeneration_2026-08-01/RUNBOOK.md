# RUNBOOK

1. Open `index.html` and choose the shot.
2. For each shot, submit `start_frame_prompt.md`, `key_frame_prompt.md`, and `end_frame_prompt.md` separately to the image model.
3. Include the local character assets, local identity plates, location assets, local asset proof sheet, and local previs frame listed in each prompt as references.
4. Save outputs to the `expected_outputs` paths in `metadata.json`.
5. Build a new proof sheet comparing local assets to the regenerated outputs.
6. Run visual QA before changing any shot status.
7. Only after all shots pass visual QA, run video-prompt QA against the actual regenerated frames and strict adjacent continuity.

Do not build an immutable video_generation_package from this folder. It is a regeneration handoff, not approved delivery.

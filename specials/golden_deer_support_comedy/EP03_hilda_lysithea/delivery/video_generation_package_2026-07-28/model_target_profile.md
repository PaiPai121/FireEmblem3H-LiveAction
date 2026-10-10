# Model Target Profile

Model: Seedance image-to-video
Runtime target: 60 seconds
Shot max: 15 seconds
Input mode: start_frame.png, key_frame.png, end_frame.png per shot
Dialogue: Japanese original; every prompt includes executable vocal lines
Subtitles: forbidden

Generation constraints:
- Use the three frames as hard visual anchors.
- Preserve exact face, hair, uniform, age, and body identity across shots.
- Animate only the declared motion, camera, and performance.
- Do not add captions, visible text, logos, or new plot material.

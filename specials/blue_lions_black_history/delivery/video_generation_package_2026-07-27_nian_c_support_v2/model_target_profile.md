# Model Target Profile

Target: Seedance image-to-video

## Package Shape

- Five ordered clips, 60 seconds total.
- Each shot has `start_frame.png`, `key_frame.png`, `end_frame.png`, `prompt.md`, `negative_prompt.md`, and `metadata.json`.
- Dialogue is Japanese adapted text inside each prompt.
- No subtitles or visible generated text.

## Recommended Submission Settings

- Mode: image-to-video with start/key/end visual anchors.
- Camera: preserve the prompt camera; avoid generated camera spins.
- Motion: restrained support-scene body language, light comedy timing.
- Audio: Japanese dialogue plus corridor ambience.
- Output: save each clip to the package-local `clips/` path listed in `metadata.json`.

## Identity Priorities

1. Ingrid's youthful academy face and blue uniform.
2. Sylvain's academy face, red hair, and black/gold uniform.
3. Nian only in SH001 as cameo trigger.
4. Same Garreg Mach corridor throughout.

## Negative Priorities

Reject subtitles, readable text, Nian after SH001, mature Ingrid, jealous Ingrid, predatory Sylvain, romance framing, visible crowd focus, watermarks, logos, and major costume drift.

# Seedance Model Profile

Target model: Seedance image-to-video
Runtime: 95 seconds
Shot cap: 15 seconds
Inputs per shot: start_frame.png, key_frame.png, end_frame.png, prompt.md, negative_prompt.md, metadata.json
Dialogue: Japanese original, source-excerpted and package-local, no placeholders
Subtitles: forbidden

Model instructions:
- Treat start/key/end as locked visual anchors, not concept references to redesign.
- Highest priority: preserve face, hair, age, body type, academy uniform topology, insignia, cape/mantle, collars, cuffs, belts, straps, and props from the input frames.
- Do not let action words imply a wardrobe change. Training, hiding, running, or exhaustion must not produce robes, casual clothes, armor, pajamas, martial-arts clothing, or simplified plain-black outfits.
- Keep comedy in timing, pauses, and small reactions. Avoid giant open mouths, bug eyes, meme faces, cartoon smiles, or broad stage mugging.
- Run motion_probe_queue.csv first at 3 seconds per shot. Full-duration generation is allowed only after the probe preserves face, wardrobe topology, frame presentation, and restrained acting.
- If a probe fails, split the shot into 3-5 second microclips or regenerate controlled frames. Do not keep resubmitting the same 15-second prompt.
- Generate spoken audio/dialogue only if the downstream Seedance workflow supports it; otherwise keep dialogue in the work order for voice/audio pass.
- Do not add visible text.

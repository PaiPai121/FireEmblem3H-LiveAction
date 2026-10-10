# Shot012 3-Second Motion Probe Prompt

Shot ID:
Shot012

Duration:
3 seconds. This is a short motion probe only, not the final full-duration clip.

Input Frames:
Use the uploaded START frame as the exact first-frame anchor and pre-action state.
Use the uploaded KEY frame as the peak pose, reveal, or emotional beat reference.
Use the uploaded END frame as the final-frame target and cut-out state.
Do not read or depend on local paths, source asset folders, previous shots, or external references.

Motion:
Animate only the small visible change implied by the uploaded START -> KEY -> END frames. Preserve character identity, wardrobe, props, lighting, background geometry, and screen direction. Keep the motion restrained and physically grounded.
Use subtle posture, eyeline, hand, cloth, breath, fog, and camera movement only when it is already supported by the three uploaded frames.

Camera:
Preserve the uploaded frame composition and shot size. Use a minimal cinematic hold, slow push, or tiny parallax only if it does not hide the KEY beat or redesign the scene.
No camera spin, no line cross, no reframing into a new establishing shot.

Performance:
Use visible acting only: eye line, breath, jaw tension, posture, hesitation, hand pressure, or quiet reaction. Avoid broad comedy, melodrama, shouting, or genre redesign.
Keep expressions restrained and consistent with the uploaded frames.

Audio:
Use Japanese spoken dialogue only when the uploaded frames and shot beat clearly support a short line; otherwise use silence, breath, distant ambience, cloth, armor, footsteps, rain, fog, or room tone. Never generate Chinese or Mandarin voiceover. No visible subtitles or captions.
Probe audio is only an edit anchor; it does not need to complete the final full-duration dialogue.

Continuity Locks:
- Preserve the exact faces, apparent ages, hairstyles, costume topology, faction colors, weapons, props, and silhouettes visible in the uploaded frames.
- Preserve the time of day, weather, fog level, corridor or battlefield geography, and light direction visible in the uploaded frames.
- Preserve the emotional state recorded in the frame chain. This probe tests whether the model can maintain identity and frame presentation, not whether it can invent new action.
- Current QA note: Critical re-audit regen v1 replaces the prior Shot012 integrated candidate because the previous END redesigned female Byleth into a sexualized leather/glamor costume with exposed chest/fishnet-like styling risk, while the prompt carried template contamination and the frame chain remained too similar in fog-camp surveillance mood. New START/KEY/END use Shot011 smoke continuity, a local character reference board, and the Western Church rebel camp reference. The chain now reads as discovery from cover, organized faith-marked camp evidence, then Byleth/Ashe silently pulling back for a tactical halt while female Byleth stays academy-professor coded.
- Required next gate: Keep monitor_required before video: run 3-second motion probe and reject if Byleth becomes male/ambiguous or sexualized, Ashe identity drifts, the camp becomes generic bandits, Seiros/Western Church organization clues disappear, or START/KEY/END collapse into a static surveillance hold.

Reject If:
- face, age, hairstyle, costume, weapon, prop, or role drifts from the uploaded frames
- characters detach from the environment, gain cutout edges, halos, mismatched shadows, or pasted/sticker appearance
- the model adds new named characters, extra foreground characters, combat beats, gore, triumphal violence, or joke acting
- the model adds visible subtitles, captions, Chinese/Mandarin voiceover, UI overlays, game dialogue boxes, logos, watermarks, borders, rounded player frames, letterbox, pillarbox, artificial side fill, warning/refusal screens, placeholders, or black frames
- start/key/end order is ignored or the clip cannot plausibly cut from START through KEY to END

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.

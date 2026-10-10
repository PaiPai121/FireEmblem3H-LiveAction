# Shot016 3-Second Motion Probe Prompt

Shot ID:
Shot016

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
- Current QA note: 2026-08-22 sequential re-audit: the frozen Shot016 v1 frames did not make Dedue's newly corrected nape braid readable, and the action chain still read too much like a generic line hold. v2 uses the canonical braid-repaired Dedue asset with local female Byleth and Dimitri references. START establishes the handoff from Shot015, KEY makes Dimitri's over-pursuit meet Byleth's raised stop hand, and END lowers the spear into a clean Shot017 eyeline handoff. All three performers are integrated into the same wet battlefield rather than pasted portrait plates.
- Required next gate: Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Byleth becomes male or war-phase, Dedue's braid disappears or detaches, Dimitri strikes a visible person, the spear geometry mutates, the trio becomes a posed lineup, or Chinese/Mandarin/subtitles/UI/borders appear.

Reject If:
- face, age, hairstyle, costume, weapon, prop, or role drifts from the uploaded frames
- characters detach from the environment, gain cutout edges, halos, mismatched shadows, or pasted/sticker appearance
- the model adds new named characters, extra foreground characters, combat beats, gore, triumphal violence, or joke acting
- the model adds visible subtitles, captions, Chinese/Mandarin voiceover, UI overlays, game dialogue boxes, logos, watermarks, borders, rounded player frames, letterbox, pillarbox, artificial side fill, warning/refusal screens, placeholders, or black frames
- start/key/end order is ignored or the clip cannot plausibly cut from START through KEY to END

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.

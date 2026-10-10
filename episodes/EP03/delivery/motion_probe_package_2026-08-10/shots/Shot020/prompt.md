# Shot020 3-Second Motion Probe Prompt

Shot ID:
Shot020

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
- Current QA note: 2026-08-23 critical re-audit: user feedback requires live-action frames that do not read as static game-like portraits. Shot020 v3 had correct female Byleth and Thunderbrand identity, but START and END still read as a posed trio. v4 regenerates the chain as moving entry, one localized Thunderbrand cut, and a layered forward handoff: Catherine enters at left, Byleth and Ashe move through different depths, and END leaves the route open for Shot021.
- Required next gate: Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Byleth becomes male/ambiguous/war-phase, Thunderbrand becomes a polearm, Catherine becomes a superhero pose, lightning becomes a beam or full-frame effect, Byleth and Ashe freeze as a background pair, the trio forms a horizontal row, any named character enters early, or Chinese/Mandarin/subtitles/UI/borders appear.

Reject If:
- face, age, hairstyle, costume, weapon, prop, or role drifts from the uploaded frames
- characters detach from the environment, gain cutout edges, halos, mismatched shadows, or pasted/sticker appearance
- the model adds new named characters, extra foreground characters, combat beats, gore, triumphal violence, or joke acting
- the model adds visible subtitles, captions, Chinese/Mandarin voiceover, UI overlays, game dialogue boxes, logos, watermarks, borders, rounded player frames, letterbox, pillarbox, artificial side fill, warning/refusal screens, placeholders, or black frames
- start/key/end order is ignored or the clip cannot plausibly cut from START through KEY to END

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.

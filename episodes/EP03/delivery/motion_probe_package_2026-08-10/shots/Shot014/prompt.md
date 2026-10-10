# Shot014 3-Second Motion Probe Prompt

Shot ID:
Shot014

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
- Current QA note: Critical re-audit 2026-08-14: previous Shot014 web candidate falsely relied on a Dedue-like shield bearer who did not match the local Dedue selected asset closely enough; the action was readable but identity lock was unsafe. Replaced with local-reference imagegen frames where Dedue has dark skin, very short bleached hair, broad academy build, and shields Dimitri from the first arrow. Still monitor_required because KEY/END are compositionally close and need a 3-second motion probe before promotion. Byleth gender consistency lock 2026-08-14: EP03 must use female Byleth only from assets/characters/protagonist/BylethFemale/professor/selected.png. Existing candidates generated from old male/ambiguous Byleth references are monitor-only and must be visually re-audited or regenerated before video use.
- Required next gate: Run 3-second motion probe only. Reject if Dedue becomes pale, long-haired, generic, or adult war-phase; if the arrow hits a body or becomes bloody; if the shield/Blue Lions uniform drifts; if subtitles/UI/Chinese voice appear; or if KEY-to-END collapses into a static hold.

Reject If:
- face, age, hairstyle, costume, weapon, prop, or role drifts from the uploaded frames
- characters detach from the environment, gain cutout edges, halos, mismatched shadows, or pasted/sticker appearance
- the model adds new named characters, extra foreground characters, combat beats, gore, triumphal violence, or joke acting
- the model adds visible subtitles, captions, Chinese/Mandarin voiceover, UI overlays, game dialogue boxes, logos, watermarks, borders, rounded player frames, letterbox, pillarbox, artificial side fill, warning/refusal screens, placeholders, or black frames
- start/key/end order is ignored or the clip cannot plausibly cut from START through KEY to END

This is a safe, appropriate, non-graphic fictional cinematic scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.

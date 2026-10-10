Shot ID: BE-SC-EP03-SH003
Duration: 15s
Target Model: Seedance image-to-video

Input Frames:
Use start_frame.png as the exact first frame and identity master.
Use key_frame.png only as the approved midpoint pose/action reference.
Use end_frame.png only as the approved final pose/cut-out reference.
Do not reinterpret these frames as concept art. Do not redesign characters, costumes, props, location, shot size, or aspect presentation.

Priority Order:
1. Preserve exact faces, hair, age, body type, costume topology, props, and character positions from the input frames.
2. Preserve the start -> key -> end action chain without adding new beats.
3. Add only small natural motion needed to connect the three frames.
4. Keep dialogue as the audio/edit script; subtitles stay off-screen and export-only.

Identity / Wardrobe Lock:
- Caspar: assets/characters/black_eagles/Caspar/academy/selected.png | Academy-era Caspar: youthful compact build, short pale-blue tousled hair, direct earnest face, Black Eagles black academy uniform with red cape and house sleeve patch; urgent body language but controlled mouth and eyes, never a mature bulky strongman.
- Bernadetta: assets/characters/black_eagles/Bernadetta/academy/selected.png | Academy-era Bernadetta: short purple hair, small guarded posture, anxious but readable eyes, Black Eagles academy uniform; comic nervousness through posture and hesitation, not horror and not meme-faced.
Wardrobe topology locks:
- Caspar: Keep Caspar's exact input-frame wardrobe topology: black academy jacket, gold piping, white collar, red cape/shoulder mantle, Black Eagles sleeve patch, brown diagonal strap when visible, same buttons and cuffs. Do not create armor, casual clothes, training gi, sleeveless outfit, plain black robe, or modern clothing.
- Bernadetta: Keep Bernadetta's exact input-frame wardrobe topology: Black Eagles academy uniform, red accents, student silhouette, same sleeve and collar shapes. Do not create pajamas, cloak, horror costume, modern sweater, or generic peasant clothes.
Expression and acting limits:
- Caspar: Caspar may look eager or startled, but keep realistic human mouth size, natural eyes, and grounded teen expression; no bulging eyes, giant open-mouth grin, meme face, or cartoon excitement.
- Bernadetta: Bernadetta can be startled and comic, but keep fear stylized and humane; no horror face, no screaming-mask distortion, no giant mouth, no bug eyes.

Motion:
Animate only the approved frame chain for this character dialogue shot. Use restrained live-action motion: subtle head turns, eye-line shifts, breath, hand/arm settling, small steps, and tiny posture changes. Do not add fighting choreography, running, jumping, spinning, falling, or slapstick impacts. Do not change clothing layers, collars, sleeves, cape shape, insignia, belts, book, training weapon, or hair silhouette during motion.
Frame intent anchors:
- Start: Caspar remembers the scenic view and brightens like he solved everything.
- Key: Caspar hoists Bernadetta over one shoulder in a non-threatening slapstick carry; she flails in panic.
- End: They rush out of the corridor toward sunset light.

Camera:
Live-action cinematic adaptation of Fire Emblem: Three Houses, academy-era Garreg Mach. Preserve the same shot size, lens feel, screen direction, eyelines, lighting, and background geometry shown in the frames. Use locked camera or a very slow stabilized push under 5 percent. No reframing that cuts off heads, hands, insignia, or props. No rounded corners, black UI frame, letterbox, pillarbox, or picture-in-picture look.

Performance:
Turn Caspar's helpful impulse into a physical comedy carry without changing the original conflict.
Keep comedy in timing and reaction, not in distorted faces. Keep all faces realistic, young, and consistent with the input frames. Mouth shapes should match speech but remain natural; eyes must not enlarge or bulge. Avoid anime reaction faces, meme expressions, broad stage mugging, exaggerated open-mouth laughs, and sudden emotional redesigns.

Audio:
Spoken dialogue only; no subtitles or on-screen text. Use these complete executable lines in order:
Caspar: 一緒にすんげえ景色を見てたら仲良くなっちまったんだよなあ……。
Caspar: とりあえずその景色、見せてやる。よし！
Bernadetta: えっ！ ちょ、ちょっと……！ どこ触って……ぎえええっ！？
Bernadetta: 何やってるんですかあああ！ あたし、う、浮いて、浮いて……！？
Caspar: うっせーな、担いでるだけだろ。ほら、行くぜ！

Continuity Locks:
- Location reference: assets/locations/EP02/act01/DormitoryCorridor/DormitoryCorridor_reference.png
- Academy phase only; all students remain young.
- Costumes, hair color, face shape, build, house insignia, and emotional state must match the input frames exactly from first frame through final frame.
- If a model cannot preserve the academy uniform for every visible character, the clip is failed even if motion and dialogue are good.
- This shot is 3 of 4 in EP03; preserve the exit state for the adjacent cut.
- Dialogue policy: excerpted / lightly bridged; source language: Japanese original.

Reject If:
- Any subtitle, caption, karaoke text, speech bubble, UI, watermark, or visible written dialogue appears.
- Any face, hairstyle, age, costume, body type, or house identity drifts from the references and frames.
- Any character changes into robes, wrap tunics, casual clothes, armor, training gi, pajamas, modern clothing, or a simplified plain-black outfit.
- Any face becomes cartoonish, meme-like, bug-eyed, giant-mouthed, over-smiling, or significantly more mature.
- Any rounded black frame, letterbox, pillarbox, playback UI, border, artificial side fill, or picture-in-picture framing appears.
- Shot duration exceeds 15s or adds a new story beat not in the dialogue above.
- The scene becomes horror, slapstick violence, romance escalation, or modern school comedy.
- The model changes the source language or invents extra dialogue.

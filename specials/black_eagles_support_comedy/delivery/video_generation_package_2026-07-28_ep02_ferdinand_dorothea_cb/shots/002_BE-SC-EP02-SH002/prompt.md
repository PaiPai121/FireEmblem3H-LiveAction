Shot ID: BE-SC-EP02-SH002
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
- Ferdinand: assets/characters/black_eagles/Ferdinand/academy/selected.png | Academy-era Ferdinand: refined orange hair, aristocratic posture, clean youthful face, immaculate Black Eagles academy uniform with gold trim and noble bearing; earnest and formal, not caricatured.
- Dorothea: assets/characters/black_eagles/Dorothea/academy/selected.png | Academy-era Dorothea: dark wavy hair under academy cap, mature clever expression, Black Eagles academy uniform; amused and perceptive, never cruel or exaggerated.
Wardrobe topology locks:
- Ferdinand: Keep Ferdinand's exact input-frame wardrobe topology: immaculate Black Eagles academy uniform, high collar, gold trim, red accents, polished noble silhouette. Do not create armor, formal suit, casual shirt, apron, work clothes, or servant outfit.
- Dorothea: Keep Dorothea's exact input-frame wardrobe topology: Black Eagles academy dress uniform and cap when shown, gold trim, red accents, mature student silhouette. Do not create opera costume, modern dress, maid outfit, casual clothes, or exaggerated stagewear.
Expression and acting limits:
- Ferdinand: Ferdinand stays formal and overearnest with controlled noble posture; no clownish mugging, no inflated chest pose, no smug villain expression.
- Dorothea: Dorothea stays amused and sharp with small facial changes; no cruel sneer, no exaggerated eye-roll, no stage-villain smile.

Motion:
Animate only the approved frame chain for this character dialogue shot. Use restrained live-action motion: subtle head turns, eye-line shifts, breath, hand/arm settling, small steps, and tiny posture changes. Do not add fighting choreography, running, jumping, spinning, falling, or slapstick impacts. Do not change clothing layers, collars, sleeves, cape shape, insignia, belts, book, training weapon, or hair silhouette during motion.
Frame intent anchors:
- Start: Dorothea circles lightly around Ferdinand, enjoying the challenge.
- Key: Dorothea gives the bee clue with a bright, teasing smile.
- End: Ferdinand is left alone, visibly overthinking the clue.

Camera:
Live-action cinematic adaptation of Fire Emblem: Three Houses, academy-era Garreg Mach. Preserve the same shot size, lens feel, screen direction, eyelines, lighting, and background geometry shown in the frames. Use locked camera or a very slow stabilized push under 5 percent. No reframing that cuts off heads, hands, insignia, or props. No rounded corners, black UI frame, letterbox, pillarbox, or picture-in-picture look.

Performance:
Set the riddle that drives the combined C/B mini-theater.
Keep comedy in timing and reaction, not in distorted faces. Keep all faces realistic, young, and consistent with the input frames. Mouth shapes should match speech but remain natural; eyes must not enlarge or bulge. Avoid anime reaction faces, meme expressions, broad stage mugging, exaggerated open-mouth laughs, and sudden emotional redesigns.

Audio:
Spoken dialogue only; no subtitles or on-screen text. Use these complete executable lines in order:
Dorothea: 貴方が訳を当てられたら、正直に認めてあげようかしら。
Ferdinand: 挑まれたからには当ててみせよう。
Dorothea: 貴方が蜜蜂のようだから、かしらねえ。
Dorothea: 後は自分で考えて。じゃあねえ、フェルくん。
Ferdinand: ううむ、蜜蜂か……。自分の役割を全うしている、ということか？

Continuity Locks:
- Location reference: assets/locations/EP02/act01/DiningHall/DiningHall_reference.png
- Academy phase only; all students remain young.
- Costumes, hair color, face shape, build, house insignia, and emotional state must match the input frames exactly from first frame through final frame.
- If a model cannot preserve the academy uniform for every visible character, the clip is failed even if motion and dialogue are good.
- This shot is 2 of 4 in EP02; preserve the exit state for the adjacent cut.
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

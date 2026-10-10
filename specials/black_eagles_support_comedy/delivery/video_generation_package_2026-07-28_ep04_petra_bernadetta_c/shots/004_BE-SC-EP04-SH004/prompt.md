Shot ID: BE-SC-EP04-SH004
Duration: 8s
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
- Petra: assets/characters/black_eagles/Petra/academy/selected.png | Academy-era Petra: warm brown skin, long purple braid, face markings, white high-collar blouse with gold trim, black fitted waist bodice, black skirt, light shoulder strap; sincere and direct without caricature.
- Bernadetta: assets/characters/black_eagles/Bernadetta/academy/selected.png | Academy-era Bernadetta: short purple hair, small guarded posture, anxious but readable eyes, Black Eagles academy uniform; comic nervousness through posture and hesitation, not horror and not meme-faced.
Wardrobe topology locks:
- Petra: Keep Petra's exact input-frame wardrobe topology: white high-collar blouse with gold trim, black fitted waist bodice, black skirt, light shoulder strap, braid, face markings, academy student silhouette. Do not convert her into a black jacket uniform, tribal costume, hunter outfit, armor, fur/leather stereotype clothing, robe, tunic, or modern clothes.
- Bernadetta: Keep Bernadetta's exact input-frame wardrobe topology: Black Eagles academy uniform, red accents, student silhouette, same sleeve and collar shapes. Do not create pajamas, cloak, horror costume, modern sweater, or generic peasant clothes.
Expression and acting limits:
- Petra: Petra stays calm, sincere, and attentive; no predatory leer, no exoticized posing, no deadpan caricature.
- Bernadetta: Bernadetta can be startled and comic, but keep fear stylized and humane; no horror face, no screaming-mask distortion, no giant mouth, no bug eyes.

Motion:
Animate only the approved frame chain for this character dialogue shot. Use restrained live-action motion: subtle head turns, eye-line shifts, breath, hand/arm settling, small steps, and tiny posture changes. Do not add fighting choreography, running, jumping, spinning, falling, or slapstick impacts. Do not change clothing layers, collars, sleeves, cape shape, insignia, belts, book, training weapon, or hair silhouette during motion.
Frame intent anchors:
- Start: Bernadetta gathers herself after Petra's explanation.
- Key: Bernadetta fidgets with her sleeves and looks up for a nervous question.
- End: Petra listens attentively, calm and open.

Camera:
Live-action cinematic adaptation of Fire Emblem: Three Houses, academy-era Garreg Mach. Preserve the same shot size, lens feel, screen direction, eyelines, lighting, and background geometry shown in the frames. Use locked camera or a very slow stabilized push under 5 percent. No reframing that cuts off heads, hands, insignia, or props. No rounded corners, black UI frame, letterbox, pillarbox, or picture-in-picture look.

Performance:
Let Bernadetta carefully ask whether Petra sees her as a friend.
Keep comedy in timing and reaction, not in distorted faces. Keep all faces realistic, young, and consistent with the input frames. Mouth shapes should match speech but remain natural; eyes must not enlarge or bulge. Avoid anime reaction faces, meme expressions, broad stage mugging, exaggerated open-mouth laughs, and sudden emotional redesigns.

Audio:
Spoken dialogue only; no subtitles or on-screen text. Use these complete executable lines in order:
Bernadetta: あたしたち、仲良くなれるかもっていうか、その、ペトラさんが……
Bernadetta: あたしのことどう思ってるかなって。友達というか何というか……。

Continuity Locks:
- Location reference: assets/locations/EP02/act01/ThreeHousesCourtyard/ThreeHousesCourtyard_reference.png
- Academy phase only; all students remain young.
- Costumes, hair color, face shape, build, house insignia, and emotional state must match the input frames exactly from first frame through final frame.
- If a model cannot preserve the academy uniform for every visible character, the clip is failed even if motion and dialogue are good.
- This shot is 4 of 12 in EP04; preserve the exit state for the adjacent cut.
- Dialogue policy: excerpted / lightly bridged; source language: Japanese original.

Reject If:
- Any subtitle, caption, karaoke text, speech bubble, UI, watermark, or visible written dialogue appears.
- Any face, hairstyle, age, costume, body type, or house identity drifts from the references and frames.
- Any character changes into robes, wrap tunics, casual clothes, armor, training gi, pajamas, modern clothing, or a simplified plain-black outfit.
- Any face becomes cartoonish, meme-like, bug-eyed, giant-mouthed, over-smiling, or significantly more mature.
- Any rounded black frame, letterbox, pillarbox, playback UI, border, artificial side fill, or picture-in-picture framing appears.
- Shot duration exceeds 8s or adds a new story beat not in the dialogue above.
- The scene becomes horror, slapstick violence, romance escalation, or modern school comedy.
- The model changes the source language or invents extra dialogue.

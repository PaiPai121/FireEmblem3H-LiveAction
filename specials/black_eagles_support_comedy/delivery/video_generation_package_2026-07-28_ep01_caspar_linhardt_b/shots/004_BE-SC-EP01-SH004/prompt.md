Shot ID: BE-SC-EP01-SH004
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
- Linhardt: assets/characters/black_eagles/Linhardt/academy/selected.png | Academy-era Linhardt: sleepy green medium-length hair, soft intelligent face, slender student build, Black Eagles academy uniform with collar, gold trim, red/black mantle detail, and book when visible; tired and dry, not gloomy, not in robes.
Wardrobe topology locks:
- Caspar: Keep Caspar's exact input-frame wardrobe topology: black academy jacket, gold piping, white collar, red cape/shoulder mantle, Black Eagles sleeve patch, brown diagonal strap when visible, same buttons and cuffs. Do not create armor, casual clothes, training gi, sleeveless outfit, plain black robe, or modern clothing.
- Linhardt: Keep Linhardt's exact input-frame wardrobe topology: black academy coat/jacket, gold trim, white collar, red/black mantle detail, fitted student silhouette, book prop only when already shown. Do not create a kimono, monk robe, martial-arts robe, wrap tunic, plain black shirt, bathrobe, armor, or casual clothes.
Expression and acting limits:
- Caspar: Caspar may look eager or startled, but keep realistic human mouth size, natural eyes, and grounded teen expression; no bulging eyes, giant open-mouth grin, meme face, or cartoon excitement.
- Linhardt: Linhardt stays dry, sleepy, and mildly annoyed with half-lidded or tired eyes; no angry scowl, no blank corpse stare, no melodramatic despair.

Motion:
Animate only the approved frame chain for this character dialogue shot. Use restrained live-action motion: subtle head turns, eye-line shifts, breath, hand/arm settling, small steps, and tiny posture changes. Do not add fighting choreography, running, jumping, spinning, falling, or slapstick impacts. Do not change clothing layers, collars, sleeves, cape shape, insignia, belts, book, training weapon, or hair silhouette during motion.
Frame intent anchors:
- Start: Caspar pulls Linhardt toward practice with a wooden training weapon ready.
- Key: Linhardt is exhausted, leaning on his knees while Caspar is still eager.
- End: Linhardt slips away toward water while Caspar slowly realizes he escaped.

Camera:
Live-action cinematic adaptation of Fire Emblem: Three Houses, academy-era Garreg Mach. Preserve the same shot size, lens feel, screen direction, eyelines, lighting, and background geometry shown in the frames. Use locked camera or a very slow stabilized push under 5 percent. No reframing that cuts off heads, hands, insignia, or props. No rounded corners, black UI frame, letterbox, pillarbox, or picture-in-picture look.

Performance:
Pay off Linhardt's laziness after Caspar turns advice into mandatory sparring.
Keep comedy in timing and reaction, not in distorted faces. Keep all faces realistic, young, and consistent with the input frames. Mouth shapes should match speech but remain natural; eyes must not enlarge or bulge. Avoid anime reaction faces, meme expressions, broad stage mugging, exaggerated open-mouth laughs, and sudden emotional redesigns.

Audio:
Spoken dialogue only; no subtitles or on-screen text. Use these complete executable lines in order:
Caspar: 君が疎かにしがちな守りを、まずは鍛えなきゃね。
Caspar: そうか。じゃあ早速、付き合ってくれよ。
Linhardt: やれやれ……。はあ……適当なとこで逃げよ。
Caspar: さあ、もう一度だ、リンハルト！ 来い！
Linhardt: 水、取ってくる……じゃあね……。
Caspar: ……しまった！ あいつ、逃げやがったな！？

Continuity Locks:
- Location reference: assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png
- Academy phase only; all students remain young.
- Costumes, hair color, face shape, build, house insignia, and emotional state must match the input frames exactly from first frame through final frame.
- If a model cannot preserve the academy uniform for every visible character, the clip is failed even if motion and dialogue are good.
- This shot is 4 of 4 in EP01; preserve the exit state for the adjacent cut.
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

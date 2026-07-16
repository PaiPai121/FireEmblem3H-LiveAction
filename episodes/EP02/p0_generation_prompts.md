# EP02 P0 Generation Prompts

用途：首轮只生成 EP02 的主线关键镜头，用于判断资产、人物年龄感、服装还原、场景调性和镜头连贯性是否成立。不要在这一轮追求全片覆盖。

首轮生成结果：

- `episodes/EP02/generated/p0_v1/contact_sheet_p0_v1.png`
- `episodes/EP02/generated/p0_v1/review.md`

## 通用规则

- Use the listed local visual assets as design authority.
- Live-action cinematic fantasy drama, high-budget medieval academy monastery, realistic fabric and armor, restrained acting, no game UI, no subtitles, no readable text, no watermark, no anime, no plastic cosplay.
- Keep characters recognizable from their selected assets. Do not age up students. Do not redesign Rhea, Seteth, Dimitri, or Flame Emperor.
- Keep EP02 as academy-phase Blue Lions route: bright monastery authority, political quiet pressure, youthful class tension, then dark conspiracy cliffhanger.

## Asset Set

Locations:

- Cathedral antechamber: `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- Training ground: `assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png`
- Mountain ruins night: `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png`

Characters:

- Byleth professor: `assets/characters/protagonist/Byleth/professor/selected.png`
- Jeralt mercenary: `assets/characters/protagonist/Jeralt/mercenary/candidates_reference_v1/candidate_01.png`
- Rhea academy: `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- Seteth academy: `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- Dimitri academy: `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Dedue academy: `assets/characters/blue_lions/Dedue/academy/selected.png`
- Felix academy: `assets/characters/blue_lions/Felix/academy/selected.png`
- Sylvain academy: `assets/characters/blue_lions/Sylvain/academy/selected.png`
- Edelgard academy: `assets/characters/black_eagles/Edelgard/academy/selected.png`
- Claude academy: `assets/characters/golden_deer/Claude/academy/selected.png`
- Kostas: `assets/characters/antagonists/Kostas/selected.png`
- Flame Emperor: `assets/characters/antagonists/FlameEmperor/selected.png`

Extras:

- Academy student extras: `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png`
- Church knight extras: `assets/characters/extras/ChurchKnightExtra/legacy_ep02/selected.png`

## P0 Shot Prompts

### Shot005 - Rhea Authority Still

Source: `04:30-10:00`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`

Prompt:

Live-action cinematic still inside the cathedral antechamber of Garreg Mach monastery. Rhea stands centered in soft holy light from high stained glass, serene and unreadable, white and blue archbishop vestments and ornate headpiece clearly visible. Seteth stands one step behind and to the side in deep navy church attire, stern and watchful. The stone hall feels sacred, formal, and politically powerful. Low camera angle, symmetrical composition, quiet pressure, realistic stone, fabric, and candlelight. No villain grin, no throne-room excess, no game UI, no text.

Purpose:

- Establish Rhea as gentle but immovable authority.
- Establish Seteth as guardian of church order.

### Shot006 - Old Acquaintance Confrontation

Source: `04:30-10:00`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- `assets/characters/protagonist/Jeralt/mercenary/candidates_reference_v1/candidate_01.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`

Prompt:

Live-action cinematic dialogue still in the cathedral antechamber. Rhea faces Jeralt with calm recognition, saying without warmth or hostility that he has returned. Jeralt stands guarded and uncomfortable, veteran mercenary posture, one hand near his belt, refusing to fully bow. Byleth stands beside Jeralt, silent and unreadable. Seteth watches from behind Rhea with suspicion. Use a tense cross-axis composition, holy light behind Rhea, softer shadow around Jeralt and Byleth. Serious restrained performance, no melodrama, no game UI, no subtitles.

Purpose:

- Show Rhea and Jeralt have history.
- Make Byleth feel pulled into an old political relationship.

### Shot007 - Seteth Suspicion Still

Source: `04:30-10:00`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/protagonist/Jeralt/mercenary/candidates_reference_v1/candidate_01.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`

Prompt:

Live-action medium close still focused on Seteth in the cathedral antechamber. Seteth studies Byleth and Jeralt with restrained suspicion, deep navy church uniform, teal hair, gold trim, administrative authority. Byleth and Jeralt are visible out of focus in the foreground or side of frame; Rhea remains a bright calm presence deeper in the hall. The shot should feel like an internal objection before formal acceptance. Clean realistic skin, no exaggerated scowl, no villain framing, no text.

Purpose:

- Give Seteth a clear function beyond standing beside Rhea.
- Prepare the audience for church oversight.

### Shot008 - Teacher Appointment Still

Source: `04:30-10:00`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/protagonist/Jeralt/mercenary/candidates_reference_v1/candidate_01.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`

Prompt:

Live-action still of Rhea offering Byleth a teaching post. Rhea stands in calm authority, hand slightly extended or lowered in ceremonial invitation. Byleth faces her in composed silence, young professor silhouette, dark academy clothing. Jeralt stands beside Byleth with tense profile, visibly uneasy. The cathedral antechamber remains bright but oppressive. Use a slow-push composition translated into a still: Rhea's light, Byleth's decision, Jeralt's warning tension. No fantasy menu, no written contract, no game UI.

Purpose:

- Make the appointment feel like destiny and trap at the same time.

### Shot017 - House Choice Ceremony

Source: `31:00-39:30`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- `assets/characters/black_eagles/Edelgard/academy/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/golden_deer/Claude/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`

Prompt:

Formal live-action ceremony still. Rhea stands at the center of the cathedral antechamber, asking Byleth to choose a house to teach. Seteth records or observes from one side. Edelgard, Dimitri, and Claude stand separated in three visual zones, each with restrained posture and different energy: Edelgard composed and political, Dimitri sincere and dutiful, Claude relaxed and watchful. Byleth stands in the foreground with back or three-quarter profile, the decision point centered on Dimitri. Sacred hall, banners or light separation, quiet ceremonial pressure. No game menu, no floating icons, no text.

Purpose:

- Replace the game selection UI with a cinematic decision tableau.
- Keep all three lords visible, but guide viewer attention to Dimitri.

### Shot018 - Choice Moment

Source: `31:00-39:30`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`

Prompt:

Live-action close decision still. Byleth looks toward Dimitri across the formal hall. Dimitri receives the gaze with surprise, gratitude, and restrained responsibility. The background should imply the ceremony but keep the frame intimate. Cool stone, soft church light, shallow depth of field. Byleth calm and unreadable; Dimitri young, noble, sincere, not war phase, not kingly. No text, no UI, no exaggerated smile.

Purpose:

- Make "Blue Lions" a human choice, not a menu selection.

### Shot019 - Dimitri Accepts Teacher

Source: `31:00-39:30`

Assets:

- `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png`
- `assets/characters/blue_lions/Dimitri/academy/selected.png`
- `assets/characters/blue_lions/Dedue/academy/selected.png`
- `assets/characters/blue_lions/Felix/academy/selected.png`
- `assets/characters/blue_lions/Sylvain/academy/selected.png`
- `assets/characters/protagonist/Byleth/professor/selected.png`

Prompt:

Live-action medium wide still after Byleth chooses Blue Lions. Dimitri steps forward and bows formally to Byleth, sincere and responsible. Dedue stands close behind him, silent and protective. Felix watches with skeptical intensity, Sylvain softens the tension with an easy posture. Byleth remains composed as the new teacher. Sacred ceremony background, but the emotional focus is the Blue Lions accepting their professor. Keep everyone academy-phase young. No war armor, no game UI, no text.

Purpose:

- Start the Blue Lions ensemble relationship.
- Show the group has internal tension even in a formal moment.

### Shot037 - Church Observation

Source: `49:20-51:00`

Assets:

- `assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png`
- `assets/characters/church_of_seiros/Rhea/academy/selected.png`
- `assets/characters/church_of_seiros/Seteth/academy/selected.png`
- `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png`

Prompt:

Long-lens live-action still from the edge of the academy training ground. Rhea and Seteth stand in the foreground watching Byleth and the Blue Lions in the distance after the mock battle. Rhea is serene, almost satisfied; Seteth remains cautious. The students in the background are small, tired, and energized after training. The image should feel political: church authority observing youth being shaped for war. Bright outdoor training ground, banners, dust, no blood, no game UI, no text.

Purpose:

- Tell the audience the church is watching Byleth's teaching.
- Close the training sequence with surveillance, not celebration.

### Shot040 - Kostas Kneels

Source: `51:00-52:29`

Assets:

- `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png`
- `assets/characters/antagonists/Kostas/selected.png`
- `assets/characters/antagonists/FlameEmperor/selected.png`

Prompt:

Dark live-action mountain ruins at night. Wet stone, low fog, broken steps, cold moonlight and dim torchlight. Kostas kneels in the mud, battered and furious, looking up from below. The Flame Emperor stands above him in a red horned mask, black-red cloak, silver helmet sides, and red shoulder fins, calm and menacing. Use a low angle that makes Kostas small and the Flame Emperor dominant. No gore, no monster, no bandit camp crowd, no game UI, no readable text.

Purpose:

- Reframe the opening bandit attack as part of a larger conspiracy.

### Shot041 - Flame Emperor Mask Close-Up

Source: `51:00-52:29`

Assets:

- `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png`
- `assets/characters/antagonists/FlameEmperor/selected.png`

Prompt:

Live-action close-up of the Flame Emperor in the mountain ruins at night. The red horned mask dominates the frame, silver side helmet and red feather-like shoulder fins visible, black-red cloak in low torchlight. The figure is still, calculating, and unreadable. Wet stone and cold fog blur behind the mask. Cinematic villain reveal, strong negative space, no exposed identity, no ordinary knight redesign, no text, no watermark, no game UI.

Purpose:

- End the episode with a memorable masked conspirator image.

## P1 Student Group Introduction Strategy

需要有学生群像介绍，但不做成逐个角色资料卡。EP02 应该用镜头语言让观众理解阵营差异：

- Black Eagles: one composed political contrast shot. Edelgard and Hubert are enough; avoid expanding into full roster in this episode unless later cut needs it.
- Golden Deer: one relaxed watchful contrast shot. Claude can carry the house identity; extras or blurred students can support.
- Blue Lions: main emotional group. Use Shot013-016 as the real class introduction: full lineup, Dimitri greeting, Felix/Sylvain contrast, Mercedes/Annette/Ashe/Ingrid reaction montage.

Recommended next P1 prompts:

- Shot011: Black Eagles comparison still.
- Shot012: Golden Deer comparison still.
- Shot013: Blue Lions lineup.
- Shot016: Blue Lions reaction montage.

Do not pause the story for biography narration. The group introduction should answer only three questions: who has power, who is watching Byleth, and why Blue Lions become the main class.

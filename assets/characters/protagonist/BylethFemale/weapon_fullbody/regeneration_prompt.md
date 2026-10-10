# Female Byleth Weapon Fullbody Regeneration Prompt

Use case: project character asset, live-action adaptation, weapon continuity reference

Primary request:

Create a cinematic photorealistic live-action full-body or nearly full-body reference of female Byleth / 贝雷丝 as a late-teen pretty academy heroine, young teacher, and former mercenary, holding the Sword of the Creator / 天帝之剑 for protagonist identity and key-story continuity.

Fidelity requirements:

- Late-teen pretty girl with teal-blue medium-length hair, green eyes, a youthful beautiful face that is not overly childlike, and emotionally restrained command posture.
- Canon academy Female Byleth clothing structure: black short capelet / shoulder mantle, high black collar, cropped black upper garment with visible midriff gap, gold crest/star chest ornament, silver forearm armor, black shorts or skirt panels over patterned black tights, asymmetric knee guard, tall black boots, belts and weapon harness details. Do not simplify into a generic black long coat, modern leather coat, full black robe, normal teacher coat, or generic fantasy dress.
- Weapon must read as the Sword of the Creator / 天帝之剑, using `assets/props/shared/sword_of_creator/selected.png` as the strict design authority: black-and-antique-gold asymmetrical hooked guard, prominent hollow circular ring at the guard center, long narrow single relic blade, segmented vertebra-like blade plates, one notched/serrated organic edge, dark central groove, aged metal, normal sword form rather than whip form.
- Figure must read as a cold prodigy professor/mercenary in a young academy-heroine register, not a regular student, sorceress, older knight commander, fashion portrait, sweet idol, adult-glamour styling, or low-age doll face.
- Body proportions should read like a real full-body cosplay/editorial photograph: roughly 6.8-7.1 heads tall, head not tiny, lower legs not stretched, boots modest and grounded, cape opened enough that stance and legs remain readable.
- Costume should preserve distinct layers from cosplay/official structure: base shirt, structured coat/tunic panels, waistband/belts, modest armor plates, arm guards, boot guards, and heavy cape. Avoid one-piece glossy leather or latex readings.

Composition:

Vertical full-body reference with generous padding, clear face, visible weapon, full costume silhouette readable from head to boots, Garreg Mach academy stone training yard, muted daylight.

Negative prompt:

male character, middle-aged teacher, anime, cartoon, plastic cosplay, generic fantasy sorceress, revealing outfit, modern clothes, generic medieval sword, wood sword, plain steel sword, red jewel sword, red glowing cracks, double blade, two parallel rail blade, oversized fantasy sword, blood, battle wounds, wrong hair color, smiling, text, logo, watermark

Selected output:

`assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png`

Current selected pass:

`candidates_v1/candidate_46_selected_return_to_candidate37_face.png`

Weapon authority:

`assets/props/shared/sword_of_creator/selected.png`

Face authority:

`assets/characters/protagonist/BylethFemale/weapon_fullbody/candidates_v1/candidate_46_selected_return_to_candidate37_face.png`

Reference notes:

- Candidate 31 was rejected after closer body review: the floor-length cape/robe-column silhouette hid proportion problems and the head/body scale still read too elongated.
- Candidate 35 improved the short-cape/mid-thigh body read, but still retained too much fashion/hero elongation.
- A local 6.8-head normal-body reference board now exists at `assets/characters/protagonist/BylethFemale/references/anatomy/normal_female_6_8_head_body_reference.png`.
- Candidate 40 was the 2026-07-31 selected pass. It uses the anatomy reference as the primary input and better matches normal head/body ratio, hip midpoint, knee placement, shorter shins, and modest boot scale.
- Candidate 41 introduced a separate face-casting reference to reduce the polished AI-face look, but read slightly too fatigued.
- Candidate 42 improved beauty using the second face-casting reference, but retained mild tall-leg/boot elongation and tight sword-edge framing.
- Candidate 43 used the selected face-casting portrait as face authority, the anatomy board as body authority, and the standalone Sword of the Creator prop as weapon authority. It improved natural facial texture and beauty while keeping a more compact body read and full sword visibility.
- Candidate 44 tested the user's clarified workflow by using a stronger real-actor casting anchor first, then adapting it into the fullbody asset. It improved face realism but drifted back toward a smaller head, longer legs, and tight sword-tip framing.
- Candidate 45 was the 2026-08-01 selected pass for the real-actor casting-anchor method. It kept the real-actor casting-anchor method while correcting candidate_44's body-proportion drift and preserving the full Sword of the Creator in frame, but was superseded by the user-requested candidate_37 face reversion.
- Candidate 46 is the current 2026-08-01 selected pass after the user explicitly asked to return to the face from the attached/candidate_37 version. It is a re-promoted copy of `candidate_37_anatomy_reference_wardrobe_corrected.png`, chosen for face direction and overall user preference. Future regeneration should treat candidate_46 as face/aesthetic authority, while still using the 6.8-head anatomy board and Sword of the Creator prop to correct any body/weapon drift.
- Keep the short-cape/mid-thigh silhouette in future regeneration unless a separate official fullbody reference proves a longer cape is required.
- Future regeneration must include the face-casting selected image and anatomy reference board as hard inputs. Reject outputs where the face returns to a generic AI influencer look, the head shrinks, knees drop, shins lengthen, boots enlarge, or the figure returns to an 8-head fashion/hero body.
- Web cosplay references checked for clothing and prop structure only: Calssara Female Byleth, Miccostumes Female Byleth uniform listing, GoodFon Byleth cosplay wallpaper, and Chaorenbuy Sword of the Creator prop listing. Do not copy cosplayer faces or named real-person likeness.

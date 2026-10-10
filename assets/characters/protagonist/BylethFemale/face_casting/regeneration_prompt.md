# Female Byleth Face Casting Regeneration Prompt

Use case: project character asset, live-action adaptation, face/casting reference

Primary request:

Create a cinematic photorealistic bust portrait for female Byleth / 贝雷丝 as an original non-identifying East Asian late-teen/young-adult academy professor-warrior. This face reference is an aesthetic and realism authority for later full-body assets; it must not copy any recognizable actor, model, idol, cosplayer, or adult performer.

Fidelity requirements:

- Beautiful but credible real-person face: slim oval-to-soft-diamond face, refined cheekbones, clean jawline, balanced eye spacing, almond green eyes, elegant straight nose, natural soft lips, and calm intelligent gaze.
- Youthful but not childlike, serious but not tired, modest and non-glamour.
- Natural photographic imperfections must remain visible: fine skin texture, subtle pores, faint under-eye shadows, slight eyelid and lip-line asymmetry, natural nose and nostril structure, individual hair strands and flyaways.
- Teal-black hair with loose bangs, green eyes, and black high-collar academy-warrior wardrobe visible at shoulders.
- Avoid one-person likeness prompting. Named beauty references may be abstracted into facial-design dimensions only, never used as direct identity targets.

Composition:

Chest-up portrait, slight 3/4 angle, eyes near camera, Garreg Mach-like stone cloister, muted daylight, no weapon.

Negative prompt:

real-person likeness, actor likeness, model likeness, idol likeness, cosplayer likeness, adult performer likeness, round baby face, doll face, porcelain skin, plastic symmetry, over-smoothed cheeks, huge anime eyes, sleepy dead eyes, seductive expression, glamour shoot, exposed skin, text, logo, watermark

Selected output:

`assets/characters/protagonist/BylethFemale/face_casting/selected.png`

Current selected pass:

`candidates_v1/candidate_03_real_actor_anchor.png`

Reference notes:

- `candidate_01_natural_face_reference.png` reduced the AI-polished face problem but read slightly too tired.
- `candidate_02_beauty_natural_reference.png` was the prior 2026-08-01 selected face authority. It kept natural texture and asymmetry while restoring stronger beauty and clearer heroine/casting appeal.
- `candidate_03_real_actor_anchor.png` supersedes candidate_02 as the 2026-08-01 selected face authority after the user clarified the desired method: start from a real-person casting-photo level of beauty, then de-identify and adapt into the character. The image is an original non-identifying actor-type anchor, not a direct real-person likeness.
- `candidate_04_specific_japanese_beauty_anchor.png` was generated after the user requested a concrete named-person anchor. It should be treated as a non-identifying specific Japanese beauty-direction candidate, not a depiction or copy of the named person and not yet promoted to selected.
- Future full-body generations should use this face reference together with the 6.8-head anatomy board and Sword of the Creator prop authority.

# Arknights Live-Action Realism Style Bible

Status: `active_global_rule`

## Target Look

Every selected operator image must read like a real actor photographed during a film production costume fitting, not like AI character art, cosplay glamour, game promo art, or a fashion poster.

Preferred visual language:

- Real actor portrait or full-body wardrobe fitting photo.
- Neutral studio, fitting room, rehearsal room, backlot, or practical set.
- Documentary/editorial camera feel: 35mm or 50mm lens, natural perspective, grounded exposure.
- Real skin texture: pores, tiny asymmetry, normal under-eye texture, imperfect hairline, natural lips.
- Practical wardrobe: sewn layers, weighted cloth, visible seams, believable fasteners, real boots/gloves/armor pieces.
- Production usability: the outfit silhouette, hair, ears/horns/halo/tail, weapons, and major color blocks must be readable for later storyboard and video prompt locks.

## Hard Rejects

Reject or downgrade to `monitor_required` if a candidate has any of these:

- Porcelain, wax, doll, plastic, airbrushed, or beauty-filter skin.
- Same default AI model face repeated across operators.
- Over-polished cosplay convention photo, idol poster, perfume ad, fashion editorial, or fantasy splash art lighting.
- Floaty impossible costume layers, melted trim, nonsensical belts, broken armor, fake-looking wig blocks, or unclear garment construction.
- Huge magical glow, cinematic particles, illustration texture, painterly background, or game-poster composition.
- Costume is attractive but no longer follows the official base outfit reference.
- Expression is generic model posing instead of the operator's job, faction, and personality.

## Prompt Defaults

Use these phrases in candidate prompts unless a project-specific reason overrides them:

- "real actor wardrobe fitting photo"
- "practical live-action costume test"
- "neutral studio or production backlot"
- "natural skin texture, slight facial asymmetry, pores, flyaway hair"
- "sewn fabric, real seams, weighted cloth, functional fasteners"
- "no cosplay convention styling, no fantasy poster lighting, no AI doll face, no wax skin, no beauty filter"

## Selection Rule

`selected.png` may only be created when the candidate passes both:

- `CASTING_STYLE_BIBLE.md`: young-adult beautiful, clearly adult, distinct face.
- `REALISM_STYLE_BIBLE.md`: real actor / real wardrobe / practical production photograph.

When these conflict, realism wins over polish. A less perfect but believable actor photo is better than a flawless AI-looking poster.

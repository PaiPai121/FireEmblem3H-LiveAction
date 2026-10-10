# Shot020 Frame Spec

Shot ID: Shot020
Stage: storyboard
Status: monitor_required
Current Version: critical_reaudit_regen_v4_2026-08-23
Depends On: script.md; shot_list.md; source_video_breakdown.md
Script Beat: Catherine 破雾
Shot Purpose: 表现 Catherine 是教会王牌，同时让 Byleth 和 Ashe 在同一动作链中感到力量冲击。
Duration Target: 14s
Location: Lonato battlefield ridge
Characters Visible: Catherine, female Byleth, Ashe

Critical Re-audit Finding:
- v3 的 Thunderbrand 和身份锁定正确，但 START/END 仍然接近三人静态合照；v4 重做为进入、横切、分层推进的连续动作。
- v4 replaces v3 as the current candidate. v1-v3 remain immutable audit evidence and must not be used as the delivery display.

Character Identity Locks:
- Catherine: `assets/characters/church_of_seiros/Catherine/academy/selected.png`; academy-era church knight, blonde ponytail, silver armor, no war-phase aging.
- Byleth: `assets/characters/protagonist/BylethFemale/professor/selected.png`; female academy-era professor only, dark teal hair and black professor coat, never male or ambiguous.
- Ashe: `assets/characters/blue_lions/Ashe/academy/selected.png`; academy-era silver-haired archer, wooden bow held low and un-drawn.

Asset References:
- `assets/characters/church_of_seiros/Catherine/academy/selected.png`
- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/blue_lions/Ashe/academy/selected.png`
- `assets/props/shared/hero_relics/thunderbrand_reference.png`
- `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png`
- `source_refs/Shot020_source.png` as provenance only, never as a generation fallback

Presence Lock:
- Only Catherine, female Byleth, Ashe, and indistinct distant rebels may be readable.
- No Rhea, Lonato close-up, Dimitri, Felix, or extra named character enters this frame set.

Weapon Lock:
- Catherine carries exactly one Thunderbrand: a single-handed pale jagged sword with hooked teeth, ornate gold guard, purple crest stone, and wrapped grip.
- Reject any axe, spear, lance, staff, halberd, polearm, double-ended weapon, or long shaft.

Start Frame Intent:
- Hard cut from the support road into the wet battlefield. Catherine enters from the extreme screen-left foreground in a weighted step, Thunderbrand low and trailing.
- Female Byleth moves diagonally through the midground with one hand low and the other only beginning a protective reflex. Ashe is one half-step behind at screen-right, turning with the action and keeping his bow low.
- Three depths and different movement lines must be visible; no shoulder-to-shoulder lineup.

Key Frame Intent:
- Catherine carries her weight through one compact lateral Thunderbrand cut toward screen-right.
- A narrow white-blue lightning arc hugs the sword and opens only one slim fog lane. Byleth shields her eyes for the brief flash while stepping; Ashe turns and advances behind her.
- No full-frame lightning, beam, explosion, blood, wound, or second attack.

End Frame Intent:
- The lightning has faded. Catherine is at the left foreground lowering Thunderbrand into a guarded low diagonal and looking toward the opened lane.
- Byleth advances into the center lane; Ashe follows one step behind/right with the bow still lowered.
- Keep the central muddy route open toward the upper-left ridge for Shot021's Lonato silhouette. The students must not form a static row.

Camera:
- Eye-level 35mm handheld follow with a restrained lateral move. START catches Catherine entering, KEY holds the single cut and reactions, END lets the students move into the opened route.
- Preserve wet-ground contact, armor/cape momentum, shared shadows, fog depth, and the lower/right to upper/left movement axis. No spin, fisheye, whip-pan, poster close-up, or artificial shake.

Blocking:
- Catherine: left foreground entry -> two weighted steps into lane -> one controlled cut -> lowered guard at left.
- Byleth: midground diagonal movement -> brief forearm shield at KEY -> purposeful step into center lane.
- Ashe: background/right turn and step -> follows Byleth with low wooden bow.
- Rebels: indistinct ridge silhouettes only; they recoil/open without readable faces or attack detail.

Action Peak: Catherine's disciplined single-handed Thunderbrand cut and the students' active reaction, not a superhero pose or victory celebration.
Dialogue / Audio Anchor: No spoken dialogue. Thunder and wet battlefield ambience only.
Edit In: cut from Shot019 support line
Edit Out: cut to Shot021 Lonato silhouette

Continuity Requirements:
- Preserve the wet ridge, gray fog, blue banners, academy wardrobe, female Byleth identity, and lower/right to upper/left movement axis.
- START/KEY/END must read as moving entry, one localized sword cut, and lowered-weapon forward handoff; not lighting/crop variants.
- Thunderbrand remains the same single-handed sword in every state. Exactly one bow belongs to Ashe.
- Catherine, Byleth, and Ashe share one physical environment with believable scale, feet, shadows, and wet fabric. No pasted character plates or layout_reference staging.
- The next shot receives Byleth/Ashe moving toward the upper-left ridge; Dimitri and Lonato appear only after the cut.

Reject If:
- Byleth becomes male, ambiguous, adult/war-phase, or changes identity across frames
- Thunderbrand mutates into a polearm or any weapon other than the single-handed jagged sword
- Catherine reads as a superhero reveal, theatrical pose, or celebratory victory stance
- lightning becomes a beam, explosion, full-frame wash, or detached effect
- Byleth and Ashe freeze as a background poster, the trio forms a horizontal row, or START/KEY/END duplicate one pose
- rebels become named characters, an army wall, or a graphic attack
- blood, wounds, bodies, UI, subtitles, readable text, logos, borders, Chinese/Mandarin speech, or modern objects appear
- feet float, shared scale breaks, or any performer looks pasted onto the ridge

Planned Frames:
- start_frame.png: `critical_reaudit_regen_v4_2026-08-23/start_frame.png`
- key_frame.png: `critical_reaudit_regen_v4_2026-08-23/key_frame.png`
- end_frame.png: `critical_reaudit_regen_v4_2026-08-23/end_frame.png`
- contact_sheet.jpg: `critical_reaudit_regen_v4_2026-08-23/contact_sheet.jpg`

Current Visual Review: v4 contact sheet inspected after generation. START has Catherine entering with Byleth and Ashe moving in separate depths; KEY has one readable Thunderbrand cut with localized lightning; END lowers the weapon and sends the students into an open lane. Status remains monitor_required until prompt-against-frame QA and a 3-second motion probe.

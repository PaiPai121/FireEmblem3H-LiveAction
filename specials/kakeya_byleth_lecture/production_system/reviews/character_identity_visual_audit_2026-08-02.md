# 角色身份视觉审查：二维挂谷女贝老师短片

Status: `blocked_needs_identity_regeneration`
Date: 2026-08-02

## 结论

这次用户质疑成立。当前真实帧不能算完成视觉身份 QA：SH002、SH010、SH020、SH032 中的学生角色不是严格还原 selected asset，而是泛化的学级色彩替身。它们必须重生或基于 approved selected assets 重新合成之后，才可以进入视频生成。

## 对照图

- SH002 单镜头对照：`production_system/reviews/SH002_identity_contact_sheet_2026-08-02.png`
- 四个互动镜头总对照：`production_system/reviews/character_identity_contact_sheet_2026-08-02.png`

## 必须使用的角色资产

- `assets/characters/protagonist/BylethFemale/professor/selected.png`
- `assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png`
- `assets/characters/black_eagles/Edelgard/academy/selected.png`
- `assets/characters/golden_deer/Lysithea/academy/selected.png`
- `assets/characters/blue_lions/Mercedes/academy/selected.png`

## 逐镜头结论

| 镜头 | 可见角色 | 决策 | 主要问题 |
| --- | --- | --- | --- |
| SH002 | Female Byleth, Edelgard, Lysithea, Mercedes | blocked_needs_identity_regeneration | Female Byleth is broadly recognizable, but the frame is not sufficient to approve the whole shot because the visible student trio fails asset fidelity.<br>Edelgard reads as a generic pale-blonde red-cloak student, not the academy asset with black-red uniform, red leggings, and exact face/hair lock.<br>Lysithea reads as a generic white-haired student; costume and face are not tightly matched to the academy selected asset.<br>Mercedes reads as a generic blonde beige-cloak student; silhouette, face, and outfit do not tightly match the academy selected asset.<br>Source frame spec previously allowed shoulder silhouettes while the generated frame shows fully visible students, creating an audit/spec contradiction. |
| SH010 | Female Byleth, Edelgard | blocked_needs_identity_regeneration | Edelgard is a visible speaking character but reads as a generic red-cloak noble/student rather than the academy selected asset.<br>The previous source frame spec treated the student as optional silhouette, which is incompatible with a visible Edelgard dialogue beat.<br>Byleth is broadly readable but the shot cannot pass because the speaking student's identity is not asset-locked. |
| SH020 | Female Byleth, Edelgard, Lysithea, Mercedes | blocked_needs_identity_regeneration | All three students are fully visible around the sand table, so shoulder-silhouette tolerance does not apply.<br>Edelgard, Lysithea, and Mercedes are only house-color approximations and do not pass exact academy selected-asset fidelity.<br>Because SH020 is a student objection beat, generic replacements weaken both story logic and continuity. |
| SH032 | Female Byleth, Edelgard, Lysithea, Mercedes | blocked_needs_identity_regeneration | The students are visible in the name-reveal reaction shot, but are not asset-faithful enough to approve.<br>The previous source frame spec listed only Female Byleth, while the generated frame visibly includes all three students.<br>The board is useful, but the character layer must be regenerated or composited from approved assets before video submission. |

## 后续要求

- 这四个镜头不得提交视频模型。
- 重新生成 start/key/end 三帧时，必须把对应 selected.png 作为引用图，而不是只在文字提示词里写角色名。
- 网页、manifest、one-pass 队列都必须显示阻塞状态，直到新帧通过人工视觉审查。

# Felix / Mercedes 去 AI 味修正记录（2026-07-16）

## 结论

观众反馈成立。上一轮年轻化版本在部分角色上把“年轻漂亮”推成了二次元/AI 精修脸：

- Felix 学院篇：脸部过尖、过偶像化，弱化了真人电影选角感。
- Mercedes 战争篇：脸部过像 AI 娃娃 / Cosplay 写真，反而不如 reference 版本自然。

## 已执行

- Felix 学院篇 selected 已回到更自然的 reference 版本：
  - `assets/characters/blue_lions/Felix/academy/selected.png`
  - 旧 AI 味版本备份：`assets/characters/blue_lions/Felix/academy/selected_before_grounded_face_v3_2026-07-16/previous_selected.png`
- Mercedes 战争篇 selected 已回到更自然的 reference 版本：
  - `assets/characters/blue_lions/Mercedes/war/selected.png`
  - 旧 AI 味版本备份：`assets/characters/blue_lions/Mercedes/war/selected_before_grounded_face_v3_2026-07-16/previous_selected.png`
- 已更新角色 profile：
  - `assets/characters/blue_lions/Felix/profile.md`
  - `assets/characters/blue_lions/Mercedes/profile.md`
- 已更新角色索引：
  - `production/character_asset_index.yaml`

## 新约束

- 年轻化不能等于二次元化。
- 保留真人电影选角感、自然皮肤、真实五官比例和骨相。
- 禁止塑料磨皮、尖下巴、娃娃脸、Cosplay 写真感、K-pop 偶像化。

## 审计图

- 初始审计：`production/Felix_Mercedes_anime_face_audit_2026-07-16.png`
- 修正后对比：`production/Felix_Mercedes_grounded_face_v3_contact_sheet_2026-07-16.png`


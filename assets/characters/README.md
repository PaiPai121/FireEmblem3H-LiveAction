# Character Asset Structure

本目录按阵营和时间线组织角色资产。

## Top Level

- `protagonist/`：主角与主角亲属 / 核心同伴。
- `black_eagles/`：黑鹫学级。
- `blue_lions/`：青狮学级。
- `golden_deer/`：金鹿学级。
- `church_of_seiros/`：赛罗司教会、修道院教师、骑士团。
- `divine/`：神性 / 梦境 / 非普通阵营角色。
- `antagonists/`：主要反派与敌对角色。
- `extras/`：群众、杂兵、一次性背景角色。

## Character Folder

每个角色目录优先使用以下结构：

```text
<Character>/
  profile.md
  academy/
  war/
  references/
```

特殊角色可以增加剧情阶段：

- `Edelgard/emperor/`
- `Dimitri/war_broken/`
- `Dimitri/king/`
- `Claude/leader/`
- `Byleth/professor/`
- `Sothis/dream/`

## Candidate Status

- `legacy_ep01/`：EP01 早期资产，可临时使用。
- `legacy_overaged/`：旧学院篇候选图，年龄感偏成熟，不应作为正式学院篇最终资产。
- `candidate_01.png` 到 `candidate_04.png`：同一轮候选。
- `contact_sheet.png`：同一轮候选的 2x2 汇总图。
- `selected.png`：最终选定资产。没有最终选择时不要创建。

## Source Of Truth

角色状态以 `production/character_asset_index.yaml` 为准。生成、替换或选定资产后，必须同步更新索引。

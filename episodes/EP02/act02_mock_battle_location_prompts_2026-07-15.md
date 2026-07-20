# EP02 Act02 学级模拟战场地点生成提示

日期：2026-07-15

2026-07-17 修正：本文件废弃“训练功能区”思路。学级模拟战应按原作 `Rivalry of the Houses` 的户外战棋地图影视化处理，而不是 Formation Yard / Archery Range / Magic Practice Lane / Side Flank Lane 等小训练场。

通用要求：

- Live-action cinematic fantasy academy mock battle map.
- Garreg Mach monastery style: stone walls, Gothic academy architecture, bright outdoor daylight.
- One continuous outdoor tactical field: southeast start, mid-west pressure line, thickets, low stone walls, slopes, northeast heal tile+ faculty line.
- Controlled school exercise, nonlethal wooden/blunted weapons, but not target practice.
- No blood, no corpses, no lethal combat, no game grid UI, no readable text, no watermark, no modern objects.
- No straw target lanes, padded obstacle courses, chalk boundaries, or isolated teacher arena.

## 1. MockBattleGrounds / 原作式总览

Path:

- `assets/locations/EP02/act02/MockBattleGrounds/`

Prompt:

Wide live-action cinematic reference of the Garreg Mach academy mock battle map, adapted from the Rivalry of the Houses battle. Blue Lions would start from the southeast edge; the mid-west route has moving enemy pressure; wooded thickets and low stone walls create Golden Deer cover; the northeast contains a dangerous approach and subtle heal-tile-like faculty support ground. The field is one continuous outdoor tactical map, supervised and nonlethal, not a set of training ranges. Bright daylight, monastery stone walls, dust, Gothic academy architecture. No game grid, no straw targets, no chalk lanes, no arena, no battlefield carnage, no readable text.

## 2. Mid-West Pressure / 中西部第一波

Path:

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsGolden_FlankRange/`

Prompt:

Live-action cinematic reference of the mid-west pressure line on the Garreg Mach academy mock battle map. Grass, uneven dirt paths, low stone walls, sparse trees, and a small natural rise create a place where Ashe can pressure Dorothea, Lorenz, and Ignatz as they move first. Yellow markers may sit deeper in thicket cover, but this is not an archery range or target lane. Controlled nonlethal academy exercise mood, bright daylight, monastery wall in the background. No straw targets, no padded shield targets, no person-in-target-lane composition, no blood, no game UI.

## 3. Thicket Flank / 林地与掩体

Path:

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsGolden_FlankRange/`

Prompt:

Live-action cinematic reference of a wooded thicket flank on the Garreg Mach academy mock battle map. Long grass, trees, low stone walls, and sloped ground give Golden Deer students cover and allow Sylvain/Ingrid to lure and cut through the flank. Yellow house markers should be subtle and embedded in terrain, not training flags in a lane. The space must feel like part of the same outdoor map. No obstacle course, no straw targets, no chalk boundaries, no battlefield gore, no game UI.

## 4. Northeast Trigger Approach / 东北触发入口

Path:

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/`

Prompt:

Live-action cinematic reference of the northeast trigger approach on the Garreg Mach academy mock battle map. Stone steps, low walls, grass, worn dirt paths, and distant red-black markers make the route feel dangerous: pushing too far would draw multiple enemy groups. Blue Lions would enter from the southeast side, with Byleth able to stop Felix before the opening. This is a tactical choke point, not a straight training corridor. No chalk lanes, no padded dummies, no isolated duel arena, no blood, no game UI.

## 5. Heal Tile+ Faculty Line / 教师治疗地形线

Path:

- `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/`
- `assets/locations/EP02/act02/MockBattleGrounds_BlackVsGolden_Backfield/`

Prompt:

Live-action cinematic reference of the northeast faculty support line on the Garreg Mach academy mock battle map. A slightly raised stone area with subtle healing sigils marks Hanneman and Manuela's heal tile+ positions. The surrounding field has low stone walls, grass, thickets, and red-black/yellow enemy depth. The space should support a rout finish where the teachers leave the healing ground and students lower training weapons. No judge podium, no ring, no arena, no target range, no lethal injury, no readable text.

# Scene09 V3 Execution Asset Integrity

Date: 2026-07-28
Decision: execution_asset_integrity_passed
Shots ready: 42/42
Problems: 0
Warnings: 0

## Scope

- Verifies each package-local prompt, model prompt, negative prompt, metadata file, and start/key/end PNG.
- Verifies PNG hashes and dimensions, source-frame copy integrity, submission JSONL hashes, execution-plan order, expected clip paths, visible roster locks, no-extra-human locks, no-active-combat lines, and no text/subtitle/caption locks.
- Keeps generated clips out of scope; clip status remains controlled by the generated-clip QA and motion-review gates.

## Dimension Groups

- 1672x941: 99 frame(s)
- 1672x940: 27 frame(s)

## Problems

- none

## Shot Summary

| Order | Shot | Decision | Visible Named Only | Frame Sizes | Expected Clip |
| --- | --- | --- | --- | --- | --- |
| 1 | Shot025 | execution_assets_ready | Dimitri, Edelgard, Claude | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4 |
| 2 | Shot025A | execution_assets_ready | none | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4 |
| 3 | Shot026 | execution_assets_ready | Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4 |
| 4 | Shot026B | execution_assets_ready | Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4 |
| 5 | Shot026C | execution_assets_ready | Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4 |
| 6 | Shot027 | execution_assets_ready | Ashe, Claude | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4 |
| 7 | Shot027B | execution_assets_ready | Ferdinand, Edelgard, Hubert, Dorothea | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4 |
| 8 | Shot027C | execution_assets_ready | Dimitri, Dedue, Ferdinand, Edelgard, Hubert | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4 |
| 9 | Shot027D | execution_assets_ready | Felix, Byleth, Ferdinand, Dedue | start:1672x941; key:1672x941; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4 |
| 10 | Shot028 | execution_assets_ready | Annette, Mercedes, Ignatz | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4 |
| 11 | Shot028B | execution_assets_ready | Edelgard, Hubert, Dorothea, Dimitri, Dedue | start:1672x940; key:1672x940; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4 |
| 12 | Shot028C | execution_assets_ready | Felix, Byleth, Ferdinand, Dedue | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4 |
| 13 | Shot029 | execution_assets_ready | Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz | start:1672x941; key:1672x941; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4 |
| 14 | Shot029C | execution_assets_ready | Claude, Ashe, Edelgard | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4 |
| 15 | Shot029D | execution_assets_ready | Claude, Ashe | start:1672x940; key:1672x940; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4 |
| 16 | Shot029B | execution_assets_ready | Hilda, Lorenz, Ignatz, Sylvain, Ingrid | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4 |
| 17 | Shot030 | execution_assets_ready | Felix, Byleth, Ferdinand | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4 |
| 18 | Shot030B | execution_assets_ready | Felix, Byleth | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4 |
| 19 | Shot030C | execution_assets_ready | Ignatz, Annette, Mercedes, Dorothea | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4 |
| 20 | Shot031 | execution_assets_ready | Byleth, Felix | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4 |
| 21 | Shot031B | execution_assets_ready | Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes | start:1672x941; key:1672x941; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4 |
| 22 | Shot032 | execution_assets_ready | Dedue, Mercedes | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4 |
| 23 | Shot032A | execution_assets_ready | Annette, Mercedes, Ashe, Claude | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4 |
| 24 | Shot032B | execution_assets_ready | Dimitri, Dedue, Hanneman | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4 |
| 25 | Shot032C | execution_assets_ready | Edelgard, Hubert, Dorothea, Claude, Hilda | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4 |
| 26 | Shot032D | execution_assets_ready | Byleth, Dimitri, Edelgard, Claude | start:1672x941; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4 |
| 27 | Shot032E | execution_assets_ready | Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4 |
| 28 | Shot032F | execution_assets_ready | Felix, Ashe, Hubert | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4 |
| 29 | Shot032G | execution_assets_ready | Claude, Leonie, Dorothea, Bernadetta | start:1672x940; key:1672x940; end:1672x940 | episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4 |
| 30 | Shot033 | execution_assets_ready | Dimitri, Byleth, Dedue, Hanneman | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4 |
| 31 | Shot033B | execution_assets_ready | Byleth, Ashe, Ingrid, Felix | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4 |
| 32 | Shot033C | execution_assets_ready | Ashe, Hanneman | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4 |
| 33 | Shot033D | execution_assets_ready | Ingrid, Manuela, Sylvain | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4 |
| 34 | Shot034C | execution_assets_ready | Felix, Ferdinand | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4 |
| 35 | Shot034D | execution_assets_ready | Byleth, Hanneman | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4 |
| 36 | Shot034B | execution_assets_ready | Byleth, Dimitri | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4 |
| 37 | Shot034E | execution_assets_ready | Claude, Hilda, Lorenz, Ignatz, Leonie | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4 |
| 38 | Shot034F | execution_assets_ready | Edelgard, Ferdinand | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4 |
| 39 | Shot034G | execution_assets_ready | Byleth, Dimitri, Dedue | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4 |
| 40 | Shot034 | execution_assets_ready | Dimitri, Edelgard, Claude | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4 |
| 41 | Shot035 | execution_assets_ready | Felix, Byleth | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4 |
| 42 | Shot036 | execution_assets_ready | Dimitri, Byleth | start:1672x941; key:1672x941; end:1672x941 | episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4 |

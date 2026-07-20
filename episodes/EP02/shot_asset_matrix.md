# EP02 Shot Asset Matrix

用途：把 `shot_list.md` 的镜头落到源视频时间码、场景资产、角色资产和生成优先级。生成镜头图时优先使用本表。

P0 首轮生成提示词见：`episodes/EP02/p0_generation_prompts.md`

P1 学级介绍提示词见：`episodes/EP02/p1_student_intro_prompts.md`

P1 模拟战提示词见：`episodes/EP02/p1_mock_battle_prompts.md`

| Shot | Source ref | Priority | Location asset | Characters | Output needed |
| --- | --- | --- | --- | --- | --- |
| Shot001 | 00:00-02:30 / 02:30-04:30 | P2 | `assets/locations/EP02/act01/GarregMachMountainRoad/GarregMachMountainRoad_reference.png` | none or tiny escort silhouettes | Establishing still |
| Shot002 | 02:30-04:30 | P2 | `GarregMachMountainRoad` | Byleth, Jeralt, `assets/characters/extras/ChurchKnightExtra/legacy_ep02/selected.png` | Character travel still |
| Shot003 | 04:30-06:00 | P2 | `assets/locations/EP02/act01/MonasteryMainGatePlaza/MonasteryMainGatePlaza_reference.png`; `assets/locations/EP02/act00/MonasteryGate_InteriorReverse/MonasteryGate_InteriorReverse_reference.png` | Byleth, Jeralt, `assets/characters/extras/ChurchKnightExtra/legacy_ep02/selected.png`, `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png` | Arrival crowd still / gate reverse |
| Shot004 | 04:30-06:00 | P2 | `assets/locations/EP02/act00/MonasteryGate_InteriorReverse/MonasteryGate_InteriorReverse_reference.png`; `MonasteryMainGatePlaza` | Dimitri, Byleth, Jeralt | First Dimitri acknowledgement |
| Shot005 | 04:30-10:00 | P0 | `assets/locations/EP02/act01/MonasteryCathedralAntechamber/MonasteryCathedralAntechamber_reference.png` | Rhea, Seteth | Rhea authority still |
| Shot006 | 04:30-10:00 | P0 | `MonasteryCathedralAntechamber` | Rhea, Jeralt, Byleth, Seteth | Old acquaintance confrontation |
| Shot007 | 04:30-10:00 | P0 | `MonasteryCathedralAntechamber` | Seteth, Byleth, Jeralt, Rhea | Seteth suspicion still |
| Shot008 | 04:30-10:00 | P0 | `MonasteryCathedralAntechamber` | Byleth, Jeralt, Rhea | Teacher appointment still |
| Shot009 | 10:00-18:00 | P2 | `assets/locations/EP02/act01/MonasteryMainCloister_DayStudentFlow/MonasteryMainCloister_DayStudentFlow_reference.png`; `assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png` | `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png`, monks | Cloister montage still |
| Shot010 | 10:00-18:00 | P2 | `assets/locations/EP02/act01/MonasteryMainCloister_DayStudentFlow/MonasteryMainCloister_DayStudentFlow_reference.png`; `MonasteryMainCloister` | Hanneman, Manuela, Byleth | Faculty introduction still |
| Shot011 | 18:00-31:00 | P2 | `assets/locations/EP02/act01/ThreeHousesCourtyard/ThreeHousesCourtyard_reference.png` | Edelgard, Hubert | Black Eagles comparison still |
| Shot012 | 18:00-31:00 | P2 | `ThreeHousesCourtyard` | Claude | Golden Deer comparison still |
| Shot013 | 18:00-31:00 | P1 | `ThreeHousesCourtyard` | Dimitri, Dedue, Felix, Sylvain, Mercedes, Annette, Ashe, Ingrid | Blue Lions lineup |
| Shot014 | 18:00-31:00 | P1 | `ThreeHousesCourtyard` | Dimitri, Dedue, Byleth | Dimitri greeting |
| Shot015 | 18:00-31:00 | P1 | `ThreeHousesCourtyard` | Felix, Sylvain, Byleth | Felix/Sylvain exchange |
| Shot016 | 18:00-31:00 | P1 | `ThreeHousesCourtyard` | Mercedes, Annette, Ashe, Ingrid | Reaction montage |
| Shot017 | 31:00-39:30 | P0 | `assets/locations/EP02/act01/AudienceHall_ChoiceCeremony/AudienceHall_ChoiceCeremony_reference.png` | Rhea, Seteth, Edelgard, Dimitri, Claude, Byleth | House choice ceremony |
| Shot018 | 31:00-39:30 | P0 | `assets/locations/EP02/act01/AudienceHall_ChoiceCeremony/AudienceHall_ChoiceCeremony_reference.png` | Byleth, Dimitri | Choice moment |
| Shot019 | 31:00-39:30 | P0 | `assets/locations/EP02/act01/AudienceHall_ChoiceCeremony/AudienceHall_ChoiceCeremony_reference.png` | Dimitri, Dedue, Felix, Sylvain, Byleth | Dimitri accepts teacher |
| Shot020 | 39:30-42:30 | P2 | `assets/locations/EP02/act01/LibraryOrTeacherOffice/LibraryOrTeacherOffice_reference.png` | Jeralt, Byleth | Private warning |
| Shot021 | 39:30-42:30 | P2 | `assets/locations/EP02/act01/LibraryOrTeacherOffice/LibraryOrTeacherOffice_reference.png` | Jeralt hands only, `assets/props/EP02/mercenary_badge/mercenary_badge_reference.png` | Mercenary badge insert |
| Shot022 | 39:30-42:30 / adapted | P1 | `assets/locations/EP02/act01/OfficersAcademyClassroom_TeacherPOV/OfficersAcademyClassroom_TeacherPOV_reference.png`; `assets/locations/EP02/act01/OfficersAcademyClassroom_StudentRows/OfficersAcademyClassroom_StudentRows_reference.png`; `assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png` | Blue Lions full class, Byleth | First class wide |
| Shot023 | adapted | P1 | `assets/locations/EP02/act01/OfficersAcademyClassroom_TeacherPOV/OfficersAcademyClassroom_TeacherPOV_reference.png`; `OfficersAcademyClassroom` | Byleth, students, `assets/props/EP02/training_weapons/training_weapons_reference.png` | Training sword insert |
| Shot024 | adapted | P1 | `assets/locations/EP02/act01/OfficersAcademyClassroom_StudentRows/OfficersAcademyClassroom_StudentRows_reference.png`; `OfficersAcademyClassroom` | Felix | Felix stands |
| Shot025 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png`; `assets/locations/EP02/act02/MockBattleGrounds_BlackVsGolden_Backfield/MockBattleGrounds_BlackVsGolden_Backfield_reference.png` | three houses, teachers, `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png`, `assets/props/EP02/training_weapons/training_weapons_reference.png` | Canon 20x22-inspired outdoor mock battle map |
| Shot026 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png`; `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/MockBattleGrounds_BlueVsBlack_TacticalLane_reference.png` | Byleth, Blue Lions | Southeast start and route choice |
| Shot027 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsGolden_FlankRange/MockBattleGrounds_BlueVsGolden_FlankRange_reference.png`; `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Ashe, Dorothea, Lorenz, Ignatz | First moving enemy wave / high-ground pressure |
| Shot028 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Annette, Mercedes | Rear-line magic support on same outdoor map |
| Shot029 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsGolden_FlankRange/MockBattleGrounds_BlueVsGolden_FlankRange_reference.png` | Sylvain, Ingrid, Claude, Hilda | Thicket flank beat against Golden Deer |
| Shot030 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/MockBattleGrounds_BlueVsBlack_TacticalLane_reference.png` | Felix | Break formation toward northeast trigger zone |
| Shot031 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/MockBattleGrounds_BlueVsBlack_TacticalLane_reference.png` | Byleth, Felix | Byleth stops Felix before dual-group trigger |
| Shot032 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/MockBattleGrounds_BlueVsBlack_TacticalLane_reference.png` | Dedue, Dimitri, Hubert, Ferdinand | Guard beat at northeast approach |
| Shot033 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlueVsBlack_TacticalLane/MockBattleGrounds_BlueVsBlack_TacticalLane_reference.png` | Dimitri, Byleth, Hanneman, Manuela | Dimitri restraint before faculty heal-tile line |
| Shot034 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds_BlackVsGolden_Backfield/MockBattleGrounds_BlackVsGolden_Backfield_reference.png`; `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Blue Lions, Hanneman, Manuela, Edelgard, Claude, opponents | Rout finish / faculty leave heal tile+ |
| Shot035 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Felix, Byleth | Felix respect beat at map edge |
| Shot036 | 42:30-49:20 | P1 | `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Dimitri, Byleth | Dimitri dark-line beat after rout |
| Shot037 | 49:20-51:00 | P0 | `assets/locations/EP02/act02/TrainingGround_ObservationEdge/TrainingGround_ObservationEdge_reference.png`; `assets/locations/EP02/act02/MockBattleGrounds/MockBattleGrounds_reference.png` | Rhea, Seteth, distant Blue Lions | Church observation over full map |
| Shot038 | 49:20-51:00 | P2 | `assets/locations/EP02/act03/NightMainCloister_GreenReflection/NightMainCloister_GreenReflection_reference.png`; `assets/locations/EP02/act01/NightMainCloister/NightMainCloister_reference.png` | Byleth, Sothis reflection | Sothis appears |
| Shot039 | 49:20-51:00 | P2 | `assets/locations/EP02/act03/NightMainCloister_EmptyLongHall/NightMainCloister_EmptyLongHall_reference.png`; `assets/locations/EP02/act01/NightMainCloister/NightMainCloister_reference.png` | Byleth | Empty corridor after Sothis |
| Shot040 | 51:00-52:29 | P0 | `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png` | `assets/characters/antagonists/Kostas/selected.png`, Flame Emperor | Kostas kneels |
| Shot041 | 51:00-52:29 | P0 | `assets/locations/EP02/act01/MountainRuinsNight/MountainRuinsNight_reference.png` | Flame Emperor | Mask close-up |
| Shot042 | 52:29 | P2 | none | none | Black transition |

## Immediate Missing Visual Assets

- none for current EP02 storyboard matrix

## Newly Linked Assets

- `assets/props/EP02/mercenary_badge/mercenary_badge_reference.png`
- `assets/props/EP02/training_weapons/training_weapons_reference.png`
- `assets/characters/antagonists/Kostas/selected.png`
- `assets/characters/extras/ChurchKnightExtra/legacy_ep02/selected.png`
- `assets/characters/extras/AcademyStudentExtra/legacy_ep02/selected.png`

# EP02 Scene09 Direction Continuity Pass

Date: 2026-07-19

Background master: `assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png`

## Hard Map Rules

- North is screen top. Southeast is lower right. West thicket is screen left. Northeast platform is upper right.
- Blue Lions screen direction: lower-right to center / upper-right. They should usually face north, northwest or northeast.
- Black Eagles screen direction: upper / right-depth toward center. They should usually face south or southwest when resisting Blue Lions.
- Golden Deer screen direction: left / western thicket into center. They should usually face east or southeast when disrupting either side.
- Teachers hold the northeast platform and face down the stairs toward the center until they are cut off.
- Byleth is the axis anchor. He moves between the central Blue-vs-Black line and the Blue rear / Golden Deer pressure lane, but he should not chase west into the thicket.

## Shot Direction Table

| Shot | Camera Axis | Required Blocking / Facing |
| --- | --- | --- |
| Shot025 | High south/southeast master looking north/northeast | Empty map or distant students only. Blue Lions read from lower-right, Black Eagles from top/right, Golden Deer from left thicket. |
| Shot025A | High tactical tilt over full field | Show all major landmarks in fixed places: west thicket left, central choke middle, northeast platform upper-right. |
| Shot026 | Southeast ground-level circle, platform in far upper-right | Byleth faces northeast while drawing route. Blue Lions form a half-circle behind and beside him, facing into the map, not toward camera. |
| Shot026B | Over Byleth shoulder from southeast | Byleth points toward central lane / northeast. Felix looks toward the dangerous upper-right opening. |
| Shot026C | Low tracking from southeast toward center | Dimitri and Dedue advance away from camera toward Black Eagles; Felix remains offset on their right but does not cross ahead. |
| Shot027 | Ashe high point looking west-to-center | Ashe faces diagonally left/center, reading both Golden Deer thicket and Black Eagles lane. |
| Shot027B | North/center reverse toward Blue approach | Black Eagles face south/southwest. Blue Lions enter frame from lower-right depth, not from left. |
| Shot027C | Side-on central lane | Dimitri/Dedue push northward; Black Eagles absorb southward. Keep the low wall between lines. |
| Shot027D | Tight central lane from Blue side | Felix faces north/northeast but sword remains inside the contact line. Ferdinand turns slightly away, exposing side gap. |
| Shot028 | Rear support lane behind low wall | Annette and Mercedes face center/northeast, moving parallel to the wall, not straight through open ground. |
| Shot028B | Black Eagles depth looking south | Edelgard and Hubert face downfield. Their line bends but does not collapse. |
| Shot028C | Side-cut lane | Felix and Ferdinand face each other across a diagonal line; Felix must not be beyond Dimitri/Dedue depth yet. |
| Shot029 | Right flank from Blue rear | Sylvain and Ingrid face west/northwest toward Golden Deer pressure coming out of thicket. |
| Shot029B | Western thicket lane | Golden Deer emerge from screen left facing east/southeast; Blue flank turns to meet them. |
| Shot029C | Claude POV from western cover | Claude looks across two gaps: Blue front overextended to center and Black side exposed near north line. |
| Shot029D | Ashe high point under pressure | Arrow pressure enters from left/west. Ashe withdraws down/right, preserving Golden Deer as left-side threat. |
| Shot030 | Felix footline toward northeast opening | Felix starts to move upper-right before Byleth intercepts. This is the dangerous overextension vector. |
| Shot030B | Northeast trigger view | Show that Felix's route would pull Black Eagles depth and expose Blue support; direction must be toward upper-right. |
| Shot030C | Rear support lane compressed | Golden Deer arrows split both Black side and Blue support. Annette/Mercedes duck behind low wall facing northeast, not away from battle. |
| Shot031 | Byleth intercepts Felix from inner line | Byleth crosses from center-left into Felix's path, facing him side-on, blocking the upper-right push. |
| Shot031B | Two-line command axis | Byleth stands between central line and support lane, one hand points north to keep pressure, the other points west/southwest to contain Golden Deer. |
| Shot032 | Dedue/Mercedes support beat | Dedue faces north/northeast holding shield. Mercedes stays behind low wall to the south/southeast, healing forward into his shoulder/arm. Dimitri remains behind Dedue, facing platform. |
| Shot032B | Northeast entrance hold | Dimitri and Dedue hold the entrance from below the platform; Black Eagles pressure comes from upper/right depth. |
| Shot032C | Black Eagles turn on Golden Deer | Hubert faces west/left into thicket; Claude is forced to move rightward or deeper left, proving Golden Deer also suffer pressure. |
| Shot032D | High oblique three-line view | Three lines stay readable: Blue pushes north, Golden Deer pushes east/southeast from left, Black Eagles split south and west. |
| Shot032E | Three-way local entanglement | Byleth pushes Black Eagles toward Golden Deer zone, so motion converges near central-left obstacle group without becoming a pile. |
| Shot033 | Platform approach | Dimitri and Dedue move uphill toward upper-right. Byleth remains lower/center, visible as control anchor. |
| Shot033B | Command cut to teachers | Byleth points upper-right toward platform. Ashe/Ingrid/Felix peel in separate lanes rather than all charging from one line. |
| Shot033C | Ashe suppresses Hanneman | Ashe fires from lower/left or center-left toward upper-right platform. Hanneman faces down the stairs; spell angle is blocked. |
| Shot033D | Ingrid cuts Manuela return | Ingrid enters from right flank / lower-right stairs and faces Manuela's return path, stopping her from stepping back onto the tile. |
| Shot034 | Wide finish | Blue Lions occupy central lane and platform approach; Black Eagles and Golden Deer lower weapons in their original depths. |
| Shot034B | Faculty tile rout | Hanneman and Manuela step off the upper-right tile. Edelgard and Claude remain in depth, not next to teachers. |
| Shot034C | Felix opens stairs | Felix faces Ferdinand at stair base, holding him laterally so Dimitri/Dedue can move upper-right behind him. |
| Shot034D | Byleth breaks Hanneman spell | Byleth enters Hanneman's blind side from lower/center stairs, taps wrist with sheathed blade. Dimitri holds below the teacher, not overstriking. |
| Shot035 | Felix respect beat | Felix faces Byleth after battle with the field behind them; his posture softens but stays guarded. |
| Shot036 | Dimitri dark-line beat | Dimitri faces Byleth while lowering weapon. Rhea/Seteth stay distant on platform or monastery edge, watching from upper-right depth. |

## Prompt Changes Required

- Every future Scene09 generation prompt must include the coordinate lock paragraph above.
- Use the raster background master, not `TrainingGround_*` references, for Scene09 production frames.
- Do not describe Golden Deer as "behind Blue Lions" without also specifying they press Black Eagles side lanes from west/left.
- Do not let Blue Lions reverse and chase west; Byleth's win condition is pushing Black Eagles into Golden Deer disruption, then cutting the northeast teacher platform.

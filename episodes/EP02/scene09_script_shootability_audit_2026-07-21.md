# EP02 Scene09 Script Shootability Audit

Date: 2026-07-21

Decision: **blocked_needs_revision** for image/video generation until the shooting script and v2 shot list below are treated as the source of truth.

This audit reviews Scene09 as something that must be shot, storyboarded, and generated frame by frame. It does not judge whether the prose is good; the prose is already stronger than the current image batch. The issue is that several good dramatic ideas are still packed into broad paragraphs, and broad paragraphs become generic crowd fights, wrong weapons, wrong facing, and unprovable character outcomes when converted to images or video.

## Working Contract

- Blue Lions win narrowly through route control and objective timing.
- Black Eagles and Golden Deer must both look competent.
- Golden Deer pressure both Blue Lions and Black Eagles, not only Blue Lions.
- The objective is the northeast healing sigil / teacher platform, not knocking students down.
- All weapons are training weapons or nonlethal spell pressure.
- Every named student who appears readably must have correct academy-age identity, house color, silhouette, and weapon.
- Every start/key frame must show one clear change: route opened, lane blocked, spell angle denied, shield restored, bowline recovered, weapon lowered, or teacher displaced.

## Blocking Issues

| Issue | Why It Blocks Generation | Required Fix |
| --- | --- | --- |
| Too many simultaneous actions in several paragraphs. | Image models collapse multi-action prose into anonymous melee or camera-facing poses. | Split beats into one visible tactical change per shot. |
| Character coverage is stronger in text than in visual assignments. | Annette, Dorothea, Lorenz, Ignatz, Hilda, Edelgard can still become background faces. | Assign each a contribution shot and a stand-down / exit shot. |
| Direction rules are established but not repeated at shot level. | Shots drift into characters looking at camera while threats are off-screen. | Each shot needs screen direction: who faces north, west, northeast, or southeast. |
| Teacher objective is intermittently implied, not always staged. | The ending can read as a duel win instead of a rule-objective win. | Keep the northeast sigil visible in every objective-chain shot. |
| Dedue / Mercedes anchor risks melodrama or wrong inspiration. | A fallen-warrior rescue tableau would be too derivative and would break mock-battle stakes. | Use an original shield-line restoration beat: Dedue remains standing under strain, Mercedes works from cover, and the visible result is the line closing again. No gore, no collapse, no saintly tableau. |
| Black Eagles / Golden Deer dignity is mostly post-action narration. | Video will not prove they fought evenly if exits are only described in text. | Add explicit stand-down inserts for both houses. |
| Current image batch has creative failures despite file-integrity pass. | Missing images are not the only problem; wrong faces/weapons/facing invalidate video use. | Keep all current Scene09 frames as layout reference only. |

## Continuity Rules For V2

| Axis | Rule |
| --- | --- |
| Map | North is screen up / deep field. Blue Lions start southeast, Black Eagles hold north and northeast, Golden Deer enter from west thicket, teachers hold northeast platform. |
| Blue Lions facing | Front line faces north/northeast. Support faces north but checks west. Flank guards face west/northwest when Golden Deer enters. |
| Black Eagles facing | Center faces south/southeast against Blue Lions. Counterpressure turns west/southwest toward Golden Deer. Edelgard remains oriented toward center and objective. |
| Golden Deer facing | They move from west to east/southeast, alternating pressure toward Blue Lions rear and Black Eagles side. They should not appear behind Black Eagles as a single ambush line. |
| Teachers facing | Hanneman faces down the stone steps / central lane. Manuela faces the healing sigil return route and later Ingrid's block. |
| Camera-facing exceptions | Only post-action reactions: Felix respect beat, Dimitri aftermath, Claude/Edelgard concession. Combat shots must privilege threat/objective facing. |

## Character Coverage Requirements

| Character | Must Be Seen Doing | Must Be Seen Yielding / Exiting |
| --- | --- | --- |
| Byleth | Reads map, restrains Felix, holds front/side split, calls teacher cut, taps Hanneman's casting wrist with sheathed sword. | Palm-down "收" stops Dimitri; quiet after victory. |
| Dimitri | Drives central lane with training lance, stays forward after Dedue tells him to look ahead, threatens platform. | Lowers lance after Byleth signal, hand still tense. |
| Dedue | Holds shield under Ferdinand / Hubert pressure; shield dips but does not collapse. | Shield raised again after Mercedes heal; exits standing. |
| Felix | Waits under command, later blocks Ferdinand's return route. | Does not beat Ferdinand down; gives clipped respect line. |
| Sylvain | Guards support line against Hilda / Lorenz pressure. | Lowers lance and clears Ingrid's path after whistle. |
| Ingrid | Stops Lorenz lane, later cuts Manuela's return route. | Maintains controlled lance until teacher call, then stands down. |
| Ashe | Loses first overwatch point to Claude, regains angle through Annette's dust, suppresses Hanneman. | Lowers bow after Claude's lane collapses. |
| Annette | Freezes, then creates wind/dust cover that lets Ashe recover. | Closes book after victory, hands no longer shaking. |
| Mercedes | Keeps Annette low, heals Dedue from behind cover with empty hands / white light. | Drops healing light only after confirming Dedue stands. |
| Edelgard | Holds Black Eagles center, signals Hubert/Dorothea to counter Golden Deer. | Signals clean stand-down after objective is lost. |
| Hubert | Pressures Dedue/Dimitri, then turns dark magic into west thicket to deny Claude. | Withdraws half-step still calculating. |
| Ferdinand | Refuses first charge and later attempts to retake stairs. | Upright, weapon steady, blocked by Felix but not defeated. |
| Dorothea | Uses controlled spell rhythm to slow Hilda side pressure. | Stops final note only after Edelgard's signal. |
| Claude | Reads both Blue rear stretch and Black side exposure; pins Ashe first. | Lowers bow with a smile when firing geometry is gone. |
| Hilda | Pressures side lane with youthful academy look and training axe. | Retreats to rail, dusts armor, unhurt and amused. |
| Lorenz | Adds formal lane threat beside Hilda. | Halts upright at Ingrid's lance line. |
| Ignatz | Marks Blue support route and Black side route with precise arrows. | Returns arrow to quiver after dust/Ashe reduce his lane. |
| Hanneman | Holds spell/court angle over sigil. | Steps off sigil after Byleth interrupts casting. |
| Manuela | Announces rules, guards return path, uses a brief Nosferatu pressure beat before Ingrid cuts the return line. | Raises hand and leaves sigil by rule. |

## Required Revision Shape

1. Replace broad action paragraphs with shootable beats that each have: purpose, visible action, dialogue, facing, start state, key state, result.
2. Keep the prose script as episode script, but make `scene09_shooting_script_v2_2026-07-21.md` the generation source.
3. Make `scene09_shot_list_v2_2026-07-21.md` the only prompt source for new Scene09 frames.
4. Generate new frames in small batches: objective chain first, Dedue/Mercedes anchor before surrounding coverage, then three-house pressure, then exits.
5. Audit locally from image files after every batch against identity, weapon, facing, tactical action, outcome coverage, and start/key continuity.

## Decision

The story direction is viable and matches the user's intent: Blue Lions win by a narrow tactical window while Black Eagles and Golden Deer remain dangerous and dignified.

The current production state is **not** viable for paid video generation. It must move through shooting-script v2, shot-list v2, fresh frames, and creative image review before video prompts become final.

# EP02 Scene09 Full Rebuild Scope

Date: 2026-07-20

## Corrected Status

The current Scene09 image batch is not video-ready.

The earlier `36/36` QA result is hereby scoped down to file-delivery integrity only. It does not approve character likeness, weapon correctness, screen direction, tactical logic, dialogue/action coverage, or per-character outcome coverage.

For production purposes, all current Scene09 start/key frames are downgraded to **layout reference only** until a new creative rebuild pass replaces and re-audits them. Do not feed the current batch into paid video generation.

Audit synthesis: `episodes/EP02/scene09_audit_synthesis_2026-07-20.md`. Independent audits can prioritize rebuild order, but they do not restore video readiness to the current batch.

Generation source update, 2026-07-21:

- Shootability audit: `episodes/EP02/scene09_script_shootability_audit_2026-07-21.md`
- Shooting script v2: `episodes/EP02/scene09_shooting_script_v2_2026-07-21.md`
- Shot list v2: `episodes/EP02/scene09_shot_list_v2_2026-07-21.md`

The 2026-07-19 full prompt delivery package is historical until this v2 source is converted into fresh image briefs and locally re-audited frames.

P1 source fixes applied on 2026-07-21 before generation:

- Shot033D now explicitly includes Manuela's brief Nosferatu pressure beat before Ingrid cuts the return path.
- Shot032 / Dedue-Mercedes wording now uses "shield-line restoration" and removes external cinematic-reference language from generation source.
- Shooting Script V2 Beat15 is split into 15A Golden Deer stand-down, 15B Black Eagles stand-down, 15C Blue Lions stand-down, and 15D full-field resolution so generation follows separated exit shots.

## Why A Full Rebuild Is Needed

- Many frames rely on generic or mannequin-like faces instead of the selected character assets.
- Named characters often use wrong or ambiguous weapons.
- Several shots face characters toward camera while enemies or objectives are elsewhere.
- Some frames introduce anonymous crowd masses that break tactical readability.
- The teacher-platform objective is not consistently staged as route control.
- The storyboard text claims every house has high lights and dignified exits, but the current image batch does not visually prove that coverage.
- File QA and contact sheets made missing-image problems visible, but they did not solve creative correctness.

## Rebuild Rule

Each rebuilt shot must pass all five gates:

| Gate | Requirement |
| --- | --- |
| Identity | Every readable named character must match the selected asset for face, age, hair, silhouette, and house color. |
| Weapon | Every readable weapon/action must match the Scene09 weapon lock. Ambiguous weapon silhouettes fail. |
| Facing | Characters must face the active threat, route, ally, or objective. Camera-facing poses are allowed only in post-action reaction shots. |
| Tactical action | The frame must show the intended tactical beat, not a generic fight tableau. |
| Outcome coverage | The frame must support a character contribution, pressure point, route block, stand-down, or dignified exit. |

## Current Batch Triage

| Shot | Current Status | Rebuild Brief |
| --- | --- | --- |
| Shot025 | rebuild | Establish full field with teacher objective, three clean house entry zones, no tiny unreadable armies. |
| Shot025A | rebuild | Clean tactical map plate / geography reference; use as diagram-like cinematic field plate, not generic high-angle crowd. |
| Shot026 | rebuild | Byleth mud-map briefing with named Blue Lions only; no camera-facing class portrait drift. |
| Shot026B | rebuild | Byleth route call from southeast; students look toward field lanes and teacher platform. |
| Shot026C | rebuild | Blue Lions horn movement with Dimitri lance, Dedue shield, Felix sword, support line separated. |
| Shot027 | rebuild | Ashe overwatch should be asset-accurate and side/back to west/center threat; no portrait pose. |
| Shot027B | rebuild | Compact named enemy wave only: Ferdinand, Edelgard, Hubert, Dorothea; no anonymous crowd. |
| Shot027C | rebuild | First Blue Lions vs Black Eagles contact; Ferdinand holds without collapse, Dedue/Dimitri correct weapons. |
| Shot027D | rebuild | Felix is restrained by Byleth command; Felix and Ferdinand line must be readable. |
| Shot028 | rebuild | Annette/Mercedes support route behind low wall; Mercedes empty-handed, Annette book/wind focus. |
| Shot028B | rebuild | Black Eagles stabilize center; Edelgard, Hubert, Ferdinand, Dorothea roles separated. |
| Shot028C | rebuild | Felix side cut held, not generic action pose; Byleth command pressure implied. |
| Shot029 | rebuild | Sylvain/Ingrid wide flank setup with long lances and accurate faces; no short blade. |
| Shot029C | rebuild | Claude reads both Blue rear stretch and Black side exposure from west thicket. |
| Shot029D | rebuild | Claude arrow suppresses Ashe observation point nonlethally; Ashe asset and bowline correct. |
| Shot029B | rebuild | Golden Deer high light: Hilda youth v4, Claude, Lorenz, Ignatz pressure both Blue and Black lanes. |
| Shot030 | rebuild | Felix overextension temptation; route and Byleth intercept geometry clear. |
| Shot030B | rebuild | Felix moves toward northeast trigger; not a random duel. |
| Shot030C | rebuild | Golden Deer arrows cut both teams' support routes; Mercedes remains empty-handed behind cover. |
| Shot031 | rebuild | Byleth stops Felix side-on with sword sheath or command body line; no lecture portrait. |
| Shot031B | rebuild | Byleth dual-line command: central pressure and side containment visible at once. |
| Shot032 | rebuild | Dedue shield strain / Mercedes short healing line; strong warrior-healer composition, no injury melodrama. |
| Shot032B | rebuild | Dimitri/Dedue northeast hold below platform; teacher objective visible in depth. |
| Shot032C | rebuild | Black Eagles counterpressure on Golden Deer; Edelgard/Hubert/Dorothea competent, Golden Deer pressured but dignified. |
| Shot032D | rebuild | High oblique three-line geography; Blue/Black/Golden lanes readable, no crowd pile. |
| Shot032E | rebuild | First local three-way entanglement; Byleth exploits chaos, no house becomes passive or comic. |
| Shot033 | rebuild | Dimitri restraint before objective cut; Byleth palm-down control must be readable. |
| Shot033B | rebuild | Byleth command-and-reaction toward teacher platform; Blue Lions peel into separate routes. |
| Shot033C | rebuild | Ashe arrow suppresses Hanneman spell angle at step/marker, not a beam duel. |
| Shot033D | rebuild | Ingrid cuts Manuela's return path off healing sigil; Manuela yields by rule, unhurt. |
| Shot034C | rebuild | Felix blocks Ferdinand's route at stair base; Ferdinand remains upright and competent. |
| Shot034D | rebuild | Byleth interrupts Hanneman with sheathed-sword wrist/forearm tap; no bare-hand/high-five ambiguity. |
| Shot034B | rebuild | Faculty heal-tile rout / teachers off sigil; route objective clear. |
| Shot034 | rebuild | Exercise ends with all three houses lowering weapons with dignity; not a victory crowd blur. |
| Shot035 | rebuild | Felix respect beat after action; character close-up acceptable, asset fidelity required. |
| Shot036 | rebuild | Dimitri post-battle dark-line beat; weapon lowered but hand tension visible, not active combat. |

## Required Rebuild Order

1. Rewrite the final shot list and dialogue/action ledger so each character's contribution and exit is assigned to a visible frame.
2. Create fresh per-shot image briefs using only named characters and weapon locks.
3. Generate new start/key frames in small batches of 3-5 shots.
4. After every batch, run local image review against identity, weapon, facing, tactical action, and outcome coverage.
5. Only after full creative pass, prepare low-cost motion tests. Direct final video generation remains blocked.

## Immediate Priority

Rebuild the objective chain first:

- Shot032 Dedue / Mercedes warrior-healer anchor.
- Shot033B Byleth command reaction.
- Shot033C Ashe suppresses Hanneman.
- Shot033D Ingrid routes Manuela.
- Shot034C Felix blocks Ferdinand.
- Shot034D Byleth interrupts Hanneman.
- Shot034 / Shot034B three-house dignified stand-down.

Then rebuild the three-house pressure chain:

- Shot027B / Shot027C / Shot028B Black Eagles high light.
- Shot029C / Shot029D / Shot029B Golden Deer high light.
- Shot032C / Shot032D / Shot032E three-way exploit.

Independent-audit hot spots should be included early in the above batches: Shot027C, Shot028, Shot031B, Shot032E, Shot034C, Shot035, Shot036.

## Character Coverage Gaps

Independent coverage audit confirms the script is stronger than the current images. The rebuild must make these visual gaps explicit:

| Character | Required visual proof | Current gap | Rebuild requirement |
| --- | --- | --- | --- |
| Annette | Nervous support student becomes useful by raising wind/dust cover so Ashe can regain angle. | Current images mostly show her being protected or suppressed; no strong visual of her contribution. | Add Shot032A or rebuild Shot030C/032 transition: Annette behind low wall opens wind/dust cover, Ashe uses it. |
| Dorothea | Black Eagles support caster slows Hilda/Golden Deer side pressure, then stands down only after Edelgard's signal. | Current images make her a background member; no clear contribution or exit. | Add Shot032C insert/variant: Dorothea short rhythm pressure against Hilda lane; add Shot034 stand-down beat where she stops magic after Edelgard signal. |
| Lorenz | Formal Golden Deer lane threat supports Hilda, then is stopped by Ingrid's lance line without humiliation. | Current images do not clearly show him as an active participant or dignified stop. | Rebuild Shot029B or add Shot034 insert: Lorenz tries to enter, Ingrid's long lance blocks route, Lorenz halts upright. |
| Ignatz | Precise arrows redirect both support routes; later his lane is reduced by Annette/Ashe and he returns arrow to quiver. | His action blends into Claude's arrow pressure; exit is not visible. | Rebuild Shot030C or add Shot034 insert: Ignatz arrow line is identifiable, then dust/Ashe pressure forces him to lower bow. |
| Sylvain | Holds Blue Lions flank and lowers lance after whistle, giving Ingrid route space. | Contribution exists, but exit/stand-down is weak. | Strengthen Shot034: Sylvain lowers lance and steps aside as Ingrid maintains route discipline. |
| Edelgard | Commands disciplined Black Eagles adjustment and accepts result cleanly. | Current high light can read as static command pose. | Strengthen Shot032C and Shot034: visible hand signal, Hubert/Dorothea respond, then Edelgard cleanly signals stand-down. |
| Hilda | Golden Deer side pressure is effective but she exits playful/unhurt. | Pressure visible in some frames, but dignified exit is mostly textual. | Add Shot034 insert: Hilda youth v4 at wooden rail, axe lowered, dusting护具, not embarrassed. |

## New Required Inserts / Variants

The rebuild may keep the broad 36-shot structure, but it needs additional subshots or stronger variants:

| New / Revised Beat | Purpose | Characters | Brief |
| --- | --- | --- | --- |
| Shot032A Annette Dust Cover | Blue Lions support contribution | Annette, Mercedes, Ashe | Annette uses wind/dust from behind low wall; Mercedes keeps her low; Ashe reclaims bow angle through cover. |
| Shot032C-Dorothea Insert | Black Eagles support high light | Edelgard, Dorothea, Hubert, Hilda | Edelgard signals; Dorothea's short spell rhythm slows Hilda's side surge while Hubert pressures Claude's cover. |
| Shot029B-Lorenz/Ignatz Variant | Golden Deer team high light beyond Claude/Hilda | Hilda, Lorenz, Ignatz, Sylvain, Ingrid | Lorenz creates formal lane threat; Ignatz marks route with arrow; Sylvain/Ingrid contain without humiliating them. |
| Shot034-Golden Deer Exit Insert | Dignified Golden Deer exit | Claude, Hilda, Lorenz, Ignatz | Claude lowers bow; Hilda dusts护具; Lorenz halts upright; Ignatz returns arrow to quiver. |
| Shot034-Black Eagles Exit Insert | Dignified Black Eagles exit | Edelgard, Hubert, Dorothea, Ferdinand | Edelgard signals stand-down; Dorothea stops magic; Hubert retreats calculating; Ferdinand remains upright but blocked. |

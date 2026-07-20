# EP02 Scene09 Pre-Video Deep Audit

Date: 2026-07-19

Scope: script logic, character dignity, local image review, asset age/identity, weapon locks, facing continuity, and start/key suitability before expensive AI video generation.

## Executive Verdict

Do not run the full Scene09 video batch yet.

Path integrity is clean, but the image batch is not creatively usable. Major blocking still problems were partially addressed by targeted regeneration, but the later full-batch review concluded that the whole Scene09 start/key set must be treated as layout reference only. The rebuilt local contact sheet uses current official PNGs, and secondary visual QA reports 36/36 file-delivery pass, but that number only validates paths, dimensions, checks, and start-key association. It does not validate cinematic logic, character likeness, weapon correctness, facing, outcome coverage, or final video motion.

Active production status: full rebuild required. See `episodes/EP02/scene09_full_rebuild_scope_2026-07-20.md`.

## What Passed

- All referenced Scene09 image paths exist in the generated web data.
- The battlefield background master exists: `assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png`.
- Shot032 v2 is a major improvement over v1: Dedue stays upright, Mercedes heals from cover, and the shot now reads as shield-line restoration instead of injury melodrama.
- Three-way geography is broadly readable in Shot032D/Shot032E: Blue Lions press center, Black Eagles resist and counter Golden Deer, Golden Deer pressure both sides.
- Secondary visual QA has been rerun after the regenerated stills and status-script fix: 36/36 start-key pairs pass delivery integrity, dimensions, checks, and association. This is no longer treated as creative approval.
- The whole current batch is downgraded to layout reference only. No paid video generation should use it.

## Blocking Issues Before Video

| Priority | Shot / Asset | Issue | Required Action |
| --- | --- | --- | --- |
| Blocker | Hilda academy asset | Previous selected passed path/faction checks but still read too mature for academy. | Replaced with `assets/characters/golden_deer/Hilda/academy/candidates_youth_identity_v4_2026-07-19/candidate_01.png`; regenerate Hilda-visible frames before video. |
| Resolved still / video monitor | Shot029B | Prior frame was stale after Hilda youth identity v4. | Replaced start/key with v4 Hilda candidates; low-cost motion test still required. |
| Resolved still / video monitor | Shot034D | Prior keyframe could read as Byleth bare-hand contact / high five, not sheathed-sword wrist tap. | Replaced keyframe with visible sheathed-sword wrist/forearm contact; low-cost motion test must preserve it. |
| Resolved still / video monitor | Shot030C | Prior keyframe appeared to give Mercedes a staff/weapon-like focus, conflicting with empty-hand support magic. | Replaced start/key with Mercedes empty hands and Annette book behind cover. |
| Resolved still / video monitor | Shot032C | Prior Hilda-visible frame predated Hilda youth identity v4 and Black Eagles high light was weak. | Replaced start/key with Edelgard signal, Hubert/Dorothea pressure, and Hilda v4 giving ground from thicket. |
| Resolved still / video monitor | Shot032E | Prior frame predated Hilda youth identity v4 and had crowd-pile risk. | Replaced start/key with Hilda v4, visible practice axe, and three readable lanes. |
| Monitor | Shot029 | Hilda is distant, but Ingrid weapon silhouette can read short-blade. | Decision applied: Shot029 is only a brief wide flank setup / lance monitor; Shot029B carries the full Golden Deer flank high light. |
| Replaced still / video monitor | Shot027B | Prior frame contained too many unidentified figures and unstable lookalikes for "First Moving Enemy Wave." | Replaced start/key with compact named Black Eagles wave; test motion for crowd growth and weapon drift. |
| Replaced still / video monitor | Shot029 | Prior Sylvain/Ingrid likeness and Ingrid weapon silhouette failed role/asset expectations. | Replaced start/key with long-lance wide flank setup; Shot029B still carries the detailed Golden Deer high light. |
| Replaced still / video monitor | Shot033B | Prior Byleth pose did not read as tactical command with Blue Lions execution response. | Replaced start/key as command-and-reaction toward teacher platform; test motion for multiple visible route responses. |
| Replaced still / video monitor | Shot033C | Prior Hanneman magic read like active beam, not interrupted spell angle. | Replaced keyframe with arrow landing on step/spell marker; test motion so shimmer stays local. |
| Replaced still / video monitor | Shot033D | Prior Ingrid was not the active route cutter; Manuela appeared to attack Sylvain. | Replaced keyframe with Ingrid blocking Manuela's return path off heal tile; test motion for route readability. |
| High | Shot027 | Original preflight put "金鹿在侧面" too early. | Fixed in animatic: Shot027 is setup; reveal line moves to Shot029D after Claude's first arrow. |
| High | Shot033 | Animatic skipped Dimitri restraint before cutting teachers. | Fixed in animatic: Shot033 now holds Byleth's palm-down restraint beat before Shot033B. |
| High | Shot036 | Byleth "收" was placed in the aftermath. | Fixed: "收" belongs to the active restraint/cut-teacher resolution; Shot036 keeps only Dimitri's post-battle line. |

## Script Logic Corrections Applied

- Rules now state the objective: force both裁定 teachers off the healing sigil / teacher platform.
- The battle is explicitly framed as an even match: Blue Lions win narrowly by timing, not raw superiority.
- Black Eagles are not routed: Edelgard stabilizes center, Hubert pressures both Dedue and Claude, Ferdinand is route-blocked rather than defeated, Dorothea stands down on command.
- Golden Deer are not simply backstabbers: Claude attacks both Blue Lions and Black Eagles geometry, Hilda/Lorenz/Ignatz pressure the west lane, then withdraw because their safe thicket space collapses.
- Blue Lions do not win by everyone charging: Dedue anchors, Mercedes restores, Ashe suppresses, Annette covers, Sylvain/Ingrid contain, Felix seals Ferdinand, Byleth times the objective.

## Character Asset Gate

Any academy-phase generated image fails if a named student reads as:

- Mature adult / teacher age.
- War-phase veteran.
- Adult glamour model or mature photoshoot.
- Noticeably older than surrounding students.
- Correct path but wrong face age.

This gate explicitly applies to Hilda after the 2026-07-19 v4 replacement.

## Shot Status For Video

| Shot | Status | Reason |
| --- | --- | --- |
| Shot027 | Use only after prompt fix | Setup shot is fine, but no Golden Deer reveal line here. |
| Shot029B | Replaced stills / motion monitor | Hilda now uses youth identity v4; still test motion for face age and flank logic. |
| Shot030C | Replaced stills / motion monitor | Mercedes is empty-hand support and Annette uses book/wind focus. |
| Shot032 | Low-cost motion test only | Good v2 stills, but healing line must not attach to Dimitri's lance. |
| Shot032D | Conditional | Map read works; if Hilda face is readable, regenerate or demote Hilda to distant extra. |
| Shot032E | Replaced stills / motion monitor | Hilda now uses youth identity v4 and three house lanes are readable. |
| Shot033 | Add to animatic | Needed for Dimitri restraint before teacher cut. |
| Shot033C | Low-cost motion test only | Bowline works; Hanneman identity needs lock. |
| Shot033D | Prompt-lock before video | Manuela route-cut works; keep Ingrid lance controlled and nonlethal. |
| Shot034C | Add to animatic | Ferdinand must be route-blocked, not ignored. |
| Shot034D | Replaced keyframe / motion monitor | New keyframe shows visible sheathed-sword wrist/forearm contact. |

## Next Production Order

1. Run low-cost motion tests for replaced Shot029B, Shot030C, Shot032C, Shot032E, Shot034D, plus Shot032, Shot033C, Shot032D.
2. Use Shot029 only as a brief side-flank setup with strict Sylvain/Ingrid lance prompt; Shot029B carries the full Golden Deer flank high light.
3. Only then start the expensive full Scene09 video batch.

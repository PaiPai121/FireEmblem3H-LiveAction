# EP03 Production Notes

## Completion Target

Target: `prompt_asset_package`

This package contains the full script, source breakdown, director treatment, shot list, per-shot frame specs, video prompts, negative prompts, manifests, source reference stills, and review records. Actual AI-generated start/key/end storyboard frames are intentionally marked `frames_pending` and should be generated in the next stage before building a `video_generation_package`.

Important correction: `source_refs/*.png` are game-video screenshots. They are source/layout reference only. They are not live-action storyboard frames, not approved visual material, and must not be displayed as completed shot assets.

## Source References

- Primary video: `/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4`
- Primary audio: `/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[01].mp4`
- Local extracted source stills: `episodes/EP03/source_refs/ShotXXX_source.png`

## Required Character Assets

| Character | Asset |
| --- | --- |
| Byleth | `assets/characters/protagonist/BylethFemale/professor/selected.png` |
| Sothis | `assets/characters/divine/Sothis/dream/legacy_ep01/candidate_03.png` |
| Rhea | `assets/characters/church_of_seiros/Rhea/academy/selected.png` |
| Seteth | `assets/characters/church_of_seiros/Seteth/academy/selected.png` |
| Catherine | `assets/characters/church_of_seiros/Catherine/academy/selected.png` |
| Dimitri | `assets/characters/blue_lions/Dimitri/academy/selected.png` |
| Ashe | `assets/characters/blue_lions/Ashe/academy/selected.png` |
| Lonato | `assets/characters/kingdom/Lonato/legacy_ep01/selected.png` |
| Blue Lions ensemble | Dedue, Felix, Sylvain, Mercedes, Annette, Ingrid academy selected assets |

## Required Location Assets

| Location | Asset |
| --- | --- |
| Monastery cloister | `assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png` |
| Cathedral | `assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png` |
| Classroom | `assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png` |
| Magdred fog road | `assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png` |
| Faerghus border village | `assets/locations/EP03/act01/FaerghusBorderVillage/FaerghusBorderVillage_reference.png` |
| Western Church rebel camp | `assets/locations/EP03/act01/WesternChurchRebelCamp/WesternChurchRebelCamp_reference.png` |
| Lonato battlefield ridge | `assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png` |
| Fog chapel ruins | `assets/locations/EP03/act01/FogChapelRuins/FogChapelRuins_reference.png` |

## Pending Visual Work

Generate real start/key/end frames for all 36 shots into:

`episodes/EP03/storyboards/ShotXXX/start_frame.png`
`episodes/EP03/storyboards/ShotXXX/key_frame.png`
`episodes/EP03/storyboards/ShotXXX/end_frame.png`

Use source stills only as layout/canon reference; do not treat them as approved live-action frames.

## Global Reject If

- The battle becomes a game UI sequence with grids, damage numbers, menus, subtitles, or dialogue boxes.
- Lonato becomes a generic villain or bandit.
- Ashe kills Lonato directly in a triumphant beat.
- Rhea is played as openly malicious rather than serene and institutionally absolute.
- Catherine's action becomes graphic or celebratory.
- Academy students look like adult soldiers or war-phase versions.

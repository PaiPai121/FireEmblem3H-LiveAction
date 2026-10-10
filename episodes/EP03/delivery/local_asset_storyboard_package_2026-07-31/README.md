# EP03 Local Asset Storyboard Package

Created: 2026-07-31

This package is the current EP03 shot asset review package. It prioritizes traceable local assets over the blocked imagegen candidates.

## Status

- Target represented here: local asset storyboard / prompt asset review package.
- Highest pipeline target currently satisfied: prompt_asset_package.
- Video-generation status: blocked.
- Local selected.png composited previs frame sets: 36/36.
- Local asset proof sheets: 36/36.
- Local video source evidence boards: 36/36.
- Local identity plate coverage: 36/36.
- Identity comparison sheets: 19/36.
- Blocked imagegen candidate frame sets: 19/36.
- Delivery statuses: monitor_required=36.

## Use

Open `index.html` for review. The large start/key/end strips are local selected.png composited previs frames. They are usable for identity, role, layout, edit-intent, and prompt review, but they are not approved final live-action video keyframes.

The imagegen candidate frames are preserved only as blocked composition studies. They must not be used as payload images until regenerated and independently reviewed against the local selected.png identity locks.

## Included Package Files

- `script.md`
- `shot_list.md`
- `director_treatment.md`
- `production_notes.md`
- `source_video_breakdown.md`
- `prompt_asset_package_manifest.snapshot.json`
- `video_delivery_manifest.snapshot.json`
- `manifest.json`
- `shots.json`
- `shot_index.md`
- `index.html`
- `package_review_2026-07-31.md`

## Referenced Root-Relative Assets

- 36 local start/key/end previs frame sets under `episodes/EP03/storyboards/Shot*/`
- 36 local asset proof sheets under `episodes/EP03/production_system/reviews/local_asset_previs_proof_2026-07-31/`
- 36 corrected local video source evidence boards under `episodes/EP03/production_system/reviews/local_video_source_frames_2026-08-01/per_shot/`
- Source timecode audit at `episodes/EP03/production_system/source_timecode_audit_2026-08-01.json`
- EP03 local identity plates under `episodes/EP03/production_system/reviews/local_identity_plates_2026-08-01/`
- Prompt, negative prompt, metadata, frame spec, and source reference for every shot
- Identity comparison sheets where available

## Blocking Issues

- Shot001: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if the dream becomes a flat collage, the hand reach is absent, Sothis becomes an adult glamorous woman, Byleth becomes male, magic only changes brightness, or START/KEY/END collapse into one stare.
- Shot002: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if Byleth floats, turns male, looks pasted onto the cloister, if the shot becomes three static monastery views, if the distant group becomes a lineup, or if any spoken dialogue, subtitle, or UI appears.
- Shot003: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if Seteth looks young or generic, if female Byleth becomes male, if the folio handoff is absent, if Rhea only changes expression, or if the four characters remain a static symmetrical tableau.
- Shot004: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if Ashe remains in a neutral pose, if he looks adult or generic, if Byleth becomes male, if the bow disappears or becomes a sword, or if the shot only alternates close-ups without a stop-and-go action.
- Shot005: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if the classroom becomes a posed group portrait, if Dimitri looks out the window instead of addressing Byleth, if Ashe never rises, if the exit does not become usable, or if Byleth becomes male.
- Shot006: monitor_required; Run prompt-against-frame QA and a 3-second motion probe. Reject if Shot006 reverses Shot005 exit direction, resets to the window, loses the door axis, makes Byleth male, changes the bow, or collapses into a static conversation.
- Shot007: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if the doorway handoff, lantern/strap/sword contacts, female Byleth identity, academy age, or Shot008 eyeline drifts.
- Shot008: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Thunderbrand loses its jagged gold guard/purple crest, becomes a generic sword or glow, Catherine ages/drifts, or the adjacent eyelines reverse.
- Shot009: monitor_required; Keep monitor_required before video: run 3-second motion probe and reject if Byleth becomes male/ambiguous, END turns into anonymous back silhouettes, Catherine/Dimitri/Ashe identities swap, the shot becomes a battle beat, or START/KEY/END collapse into repeated stills.
- Shot010: monitor_required; Keep monitor_required before video: run 3-second motion probe and reject if Byleth becomes male/ambiguous, Dedue becomes a bald generic soldier, Ingrid costume drifts further into non-academy armor, fog swallows identity, or START/KEY/END collapse into repeated fog-road stills.
- Shot011: monitor_required; Keep monitor_required before video: run 3-second motion probe and reject if Byleth becomes male/ambiguous, Mercedes drifts into war-phase armor or oversized ceremonial cloak, Ashe identity drifts, villagers become a spectacle crowd, or START/KEY/END collapse into repeated door-facing stills.
- Shot012: monitor_required; Keep monitor_required before video: run 3-second motion probe and reject if Byleth becomes male/ambiguous or sexualized, Ashe identity drifts, the camp becomes generic bandits, Seiros/Western Church organization clues disappear, or START/KEY/END collapse into a static surveillance hold.
- Shot013: monitor_required; Run a 3-second motion probe before any approved_for_video promotion. Reject if Byleth becomes male/ambiguous/war-phase/sexualized, Byleth merges with Felix, Ashe fires or advances alone, the mud sketch becomes UI/grid/text/glowing markers, arrow impact appears before Shot014, START/KEY/END collapse into a static hold, or subtitles/UI/Chinese voice appear.
- Shot014: monitor_required; Run 3-second motion probe only. Reject if Dedue becomes pale, long-haired, generic, or adult war-phase; if the arrow hits a body or becomes bloody; if the shield/Blue Lions uniform drifts; if subtitles/UI/Chinese voice appear; or if KEY-to-END collapses into a static hold.
- Shot015: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if the unit becomes a clone wall/endless army, a named character enters early, the arrow echo disappears, feet lose ground contact, the spear strikes, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot016: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Byleth becomes male or war-phase, Dedue's braid disappears or detaches, Dimitri strikes a visible person, the spear geometry mutates, the trio becomes a posed lineup, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot017: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe; reject if Byleth becomes male or war-phase, Ashe fires or ages up, the bow remains taut in END, the shield emblem becomes text or a glowing icon, Shot016's stop-hand gesture repeats, Felix appears early, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot018: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Felix does not cross in front of Ashe, the left danger is mirrored, Felix looks right, Ashe fires/overtakes, the block becomes a killing blow, any named attacker enters, the chain becomes a static lineup or pasted character plates, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot019: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Ingrid or any unlisted named character appears, the two women collapse into a row, Annette creates spectacle magic, the civilian becomes a named or graphic subject, the center road is blocked, characters look pasted onto the road, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot020: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Byleth becomes male/ambiguous/war-phase, Thunderbrand becomes a polearm, Catherine becomes a superhero pose, lightning becomes a beam or full-frame effect, Byleth and Ashe freeze as a background pair, the trio forms a horizontal row, any named character enters early, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot021: monitor_required; Keep monitor_required until the Japanese dialogue prompt is reviewed against the uploaded START/KEY/END frames and a 3-second motion probe confirms Lonato age/identity, active student reactions, non-graphic restraint, and a moving tail hold.
- Shot022: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Ashe/Lonato become sword-distance, Dimitri or Byleth stand beside Lonato as executioners, Dimitri gets a bow, Byleth becomes male, Lonato attacks, Ashe raises/fires, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot023: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if KEY becomes sword-distance, the central gap disappears, the axis reverses, Lonato attacks, Ashe draws/fires, rebels become named, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot024: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot023→024 continuity QA, and a 3-second motion probe. Reject if Byleth is close enough to execute Lonato, the sword targets a body, Ashe raises/fires, Lonato attacks, Dedue loses the braid, or Chinese/Mandarin/subtitles/UI/borders appear.
- Shot025: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot024->025 and 025->026 continuity QA, and a 3-second motion probe. Reject if any performer enters the ravine, the middle gate or two guards disappear, Byleth reads as being on Lonato's ridge, the camera pushes toward Lonato, START/KEY/END collapse into one pose, or Lonato becomes a face-to-face target.
- Shot026: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, action handoff breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot027: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, action handoff breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot028: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, action handoff breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot029: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, female Byleth identity, or non-rushing witness geography breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot030: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, action handoff breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot031: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot030->031 and 031->032 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Seteth reads young or war-phase, the folio handoff disappears, the five collapse into a static lineup, students look clean and reset, any unlisted named character enters, or Chinese/Mandarin/subtitles/UI/pasted plates appear.
- Shot032: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot031->032 and 032->033 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Seteth reads young or war-phase, the handoff is missing, Rhea becomes cartoonishly evil, START/KEY/END collapse into one pose, any unlisted named character enters, or Chinese/Mandarin/subtitles/UI/pasted plates appear.
- Shot033: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot032->Shot033 and Shot033->Shot034 continuity QA, and a 3-second motion probe. Reject if the four become a lineup or cutout plates, the door/eyeline handoff disappears, weapons rise, Byleth reads male, a fifth named person appears, or Chinese/Mandarin speech, subtitles, UI, borders, or pasted cutouts appear.
- Shot034: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict adjacent continuity QA, and a 3-second motion probe. Reject if the declared distance, guard interaction, weapon state, action handoff breaks, or Chinese/Mandarin voice, subtitles, UI, borders, or pasted cutouts appear.
- Shot035: monitor_required; Keep monitor_required. Run prompt-against-frame QA, strict Shot034->035 and 035->036 continuity QA, and a 3-second motion probe. Reject if Dimitri becomes war-phase, Byleth reads male or ambiguous, the hand-to-stone action disappears, the distance collapses into a static two-shot, an extra person enters, or Chinese/Mandarin/subtitles/UI/pasted plates/black borders appear.
- Shot036: monitor_required; Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Byleth becomes male/older/war-phase, loses the covered high-collar black professor outfit, Sothis becomes a solid companion or duplicate, Rhea moves into close-up, green VFX overexposes the frame, subtitles/UI/text appear, or START/KEY/END collapse into a frozen hold.

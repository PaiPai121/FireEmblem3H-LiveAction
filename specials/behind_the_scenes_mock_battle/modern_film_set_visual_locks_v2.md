# Modern Film Set Visual Locks V2

Purpose: revise the behind-the-scenes special so every frame reads first as a modern film production set shooting a Fire Emblem-style fantasy scene.

## Global Visual Rule

Every start/key/end frame must include at least two unmistakable modern film-set markers, and at least one should be prominent enough to read at thumbnail size.

Every frame with named characters must be generated from the repository's selected character assets. Do not use no-reference generation for Byleth, Edelgard, Dimitri, or Claude. A frame that gets the modern film set correct but replaces the named characters with generic actors is a P0 failure and must be rejected.

Required character references:

- Nian director cameo: `assets/characters/cameos/Nian/director/selected.png`
- Byleth: `assets/characters/protagonist/Byleth/professor/selected.png`
- Edelgard: `assets/characters/black_eagles/Edelgard/academy/selected.png`
- Dimitri: `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Claude: `assets/characters/golden_deer/Claude/academy/selected.png`

Approved modern markers:

- cinema camera body on tripod, dolly, shoulder rig, crane, or gimbal;
- matte box, follow-focus unit, lens case, camera cart, video village, director monitor;
- C-stands, combo stands, LED panels, diffusion frames, reflectors, flags, sandbags;
- boom microphone, wireless lav pack, sound mixer bag, headphones;
- walkie-talkies, headset, crew lanyards, call sheets, production clipboard;
- tape marks on floor/ground, safety mats, padded stunt props, prop tags;
- craft-services table, lunch trays, water bottles, folding tables, pop-up tents;
- cable ramps, coiled cables, power distro boxes, battery chargers.

## Failure Conditions

Reject the frame if:

- it reads as a fantasy courtyard, training ground, banquet hall, or monastery scene with only tiny background crew;
- production equipment is cropped, blurred, hidden, or too small to anchor the shot;
- the frame could be mistaken for in-world canon footage;
- the fantasy banners/castle architecture dominate more than the film infrastructure;
- crew look like generic extras rather than working film crew;
- named characters are generated without the required repository character references;
- Nian, Byleth, Edelgard, Dimitri, or Claude become generic replacement actors;
- Nian appears as a canon combat participant instead of a modern film-set director;
- the shot loses the declared gag or emotional beat while adding equipment.

## Shot-Specific Requirements

- BTS-SH000: Nian director must be visible with director monitor/camera-side equipment, headset or megaphone, and a clear "calling cut" performance; the four leads must be stopped mid-take or just dropping out of character.
- BTS-SH001: slate plus camera rig or light stand must dominate the opening.
- BTS-SH002: lunch must read as craft services or cast meal on set, with folding tables, labeled trays, water bottles, crew cases, or pop-up tent.
- BTS-SH003: prop/wardrobe table must include prop tags, padded weapons, clamps, tape, tool cases, and wardrobe rack.
- BTS-SH004: rehearsal lane must show camera, monitor, boom or light stands, tape marks, and crew at the edge.
- BTS-SH005: video village must be unmistakable, with director monitor, headphones, cables, playback cart, and crew presence.
- BTS-SH006: wrap photo must include lights, crew, slate, camera/photographer, and a visible set environment.

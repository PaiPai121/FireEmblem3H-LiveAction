# Frame Generation Queue

Status: pending_generation

Use this queue to generate the actual start/key/end PNG frames required before final video delivery packaging. Save outputs exactly to the listed paths. After generation, run visual-material audit before promoting any shot to `approved_for_video`.

## Shared Reference Locks

- Byleth professor: `assets/characters/protagonist/Byleth/professor/selected.png`
- Edelgard academy: `assets/characters/black_eagles/Edelgard/academy/selected.png`
- Dimitri academy: `assets/characters/blue_lions/Dimitri/academy/selected.png`
- Claude academy: `assets/characters/golden_deer/Claude/academy/selected.png`
- Dining hall: `assets/locations/EP02/act01/DiningHall/DiningHall_reference.png`
- Training ground: `assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png`
- Mock battle grounds: `assets/locations/EP02/act02/MockBattleGrounds_CanonMap/MockBattleGrounds_CanonMap_master_2026-07-19.png`
- Training weapons: `assets/props/EP02/training_weapons/training_weapons_reference.png`

## Global Image Style

Live-action behind-the-scenes still, cinematic documentary photography, 16:9, natural light, restrained film-set details, academy/professor costumes preserved, Garreg Mach fantasy backlot mixed with controlled modern film equipment. Avoid glossy poster posing; every frame must prove a shot beat.

## BTS-SH001

### start_frame

Output: `storyboards/BTS-SH001/start_frame.png`

Prompt: Close foreground film clapperboard reading "Mock Battle - Behind the Scenes", held before a Garreg Mach training-ground backlot. Behind the slate, Byleth, Edelgard, Dimitri, and Claude hold serious rehearsal marks in academy/professor costume. Wooden fences, soft training weapons, one light stand, and a small crew presence are visible. The shot must immediately read as a live-action production set.

Reject if: slate missing, main four unreadable, weapons look lethal, or it reads as in-world battle only.

### key_frame

Output: `storyboards/BTS-SH001/key_frame.png`

Prompt: Exact slate-clap moment. The clapperboard is closing, and behind it the main four start relaxing out of combat seriousness. Crew movement begins in the background. The frame must show the transition from in-character battle to behind-the-scenes break.

Reject if: no visible slate clap, crew/equipment missing, or actor identities become generic.

### end_frame

Output: `storyboards/BTS-SH001/end_frame.png`

Prompt: Wider pullback view of the training-ground film set. The actors and crew share the frame; soft weapons are being collected, light stands and sound equipment are visible, wooden fences line the mock battle lane, and the mood has shifted toward lunch break.

Reject if: too many extras crowd the leads, equipment disappears, or the setting stops looking like Garreg Mach.

## BTS-SH002

### start_frame

Output: `storyboards/BTS-SH002/start_frame.png`

Prompt: Long lunch table in Garreg Mach dining hall or crew lunch setup. Edelgard, Dimitri, Claude, and Byleth sit in academy/professor costumes with plates and cups. The image should look like a period fantasy production lunch, not a modern cafeteria. Character order supports a left-to-right table scan.

Reject if: modern branding, phones, unreadable leads, or costume drift.

### key_frame

Output: `storyboards/BTS-SH002/key_frame.png`

Prompt: Claude is caught subtly sliding unwanted greens away while giving a tiny guilty smile toward camera. Dimitri's oversized meal and Edelgard's immaculate plate frame the joke. Byleth remains calm at the table. The humor is small and behavior-based.

Reject if: exaggerated comedy, distorted hands/food, or Claude becomes a variety-show host.

### end_frame

Output: `storyboards/BTS-SH002/end_frame.png`

Prompt: Camera has landed on Byleth calmly eating as the others react around them. Claude has a small guilty smile, Dimitri looks sincerely puzzled, Edelgard hides a restrained reaction. The group remains warm and in character.

Reject if: Byleth overreacts, anyone becomes generic, or the table gag is unreadable.

## BTS-SH003

### start_frame

Output: `storyboards/BTS-SH003/start_frame.png`

Prompt: Foreground detail of padded training weapons, cape clasps, costume brushes, thread, and a prop cart beside the training ground. Wardrobe racks and a few crew silhouettes sit in the background. Fantasy costume craft should dominate over modern equipment.

Reject if: sharp weapons, industrial warehouse look, or clutter hides the props.

### key_frame

Output: `storyboards/BTS-SH003/key_frame.png`

Prompt: Prop master gently takes Claude's bow away mid-pose. Claude accepts with an easy expression. Edelgard checks a cape clasp with exact focus. Dimitri holds a padded lance and studies its balance too seriously. All costumes remain academy-era.

Reject if: bow becomes lethal, Claude becomes clownish, or character costumes redesign.

### end_frame

Output: `storyboards/BTS-SH003/end_frame.png`

Prompt: Resolved prop/wardrobe moment. The prop master now has the bow, Claude accepts it lightly, Edelgard's cape clasp is corrected, and Dimitri still studies the padded lance like a tactical object. The frame should bridge naturally into rehearsal.

Reject if: unsafe weapons, modern gear dominance, or too many new crew characters.

## BTS-SH004

### start_frame

Output: `storyboards/BTS-SH004/start_frame.png`

Prompt: Locked wide rehearsal setup on a mock battle lane with wooden fences. Byleth stands near a director monitor edge, Edelgard near a fence mark, Dimitri ready at his start mark, Claude centered with prop bow lowered. Assistant director is off to one side. The frame is safe, controlled, and nonlethal.

Reject if: chaotic battle, lethal weapons, or missing monitor/film-set context.

### key_frame

Output: `storyboards/BTS-SH004/key_frame.png`

Prompt: Simultaneous NG peak. Dimitri has overshot his mark by one safe step, Edelgard's cape catches lightly on the fence, Claude turns the mishap into an improvised line, and Byleth watches with quiet control. This must be funny but dignified.

Reject if: anyone falls, gets hurt, looks humiliated, or the action becomes combat.

### end_frame

Output: `storyboards/BTS-SH004/end_frame.png`

Prompt: Director has called cut. Edelgard frees the cape, Dimitri turns back apologetically, Claude smiles, and Byleth gestures for reset without speaking. The cast relaxes while staying recognizable.

Reject if: Byleth becomes expressive, cape tears, or characters leave frame.

## BTS-SH005

### start_frame

Output: `storyboards/BTS-SH005/start_frame.png`

Prompt: Over-shoulder view near a director monitor station. Byleth, Edelgard, Dimitri, and Claude gather around the monitor in three-quarter profile. Crew silhouettes, cables, and a simple monitor are present but subdued.

Reject if: modern office look, unreadable faces, or monitor dominates the characters.

### key_frame

Output: `storyboards/BTS-SH005/key_frame.png`

Prompt: Monitor playback reaction peak. Claude points lightly at the playback, Dimitri bows his head in sincere apology, Edelgard almost smiles while trying not to, and Byleth watches calmly. The monitor content should be indistinct or a simple echo of the prior NG.

Reject if: monitor shows unrelated detailed footage, expressions become exaggerated, or faces drift.

### end_frame

Output: `storyboards/BTS-SH005/end_frame.png`

Prompt: Byleth gives one small approving nod while the others accept that the NG belongs in the extras. The group mood is relaxed and warm. Byleth remains minimal and centered.

Reject if: Byleth talks or overacts, group becomes generic, or the monitor station disappears.

## BTS-SH006

### start_frame

Output: `storyboards/BTS-SH006/start_frame.png`

Prompt: Group arranges for a wrap photo on monastery steps or the training-ground set. Byleth, Edelgard, Dimitri, and Claude are centered or front row, with academy extras and a few crew around them. A light stand or crew member is still stepping out.

Reject if: main four are not readable, random crowd dominates, or modern gear overwhelms the fantasy setting.

### key_frame

Output: `storyboards/BTS-SH006/key_frame.png`

Prompt: A clapperboard accidentally enters the edge of the group-photo frame. Claude notices and plays subtly to camera, Dimitri relaxes, Edelgard tries not to laugh, and Byleth remains quietly centered. Warm wrap energy.

Reject if: broad slapstick, unreadable leads, or Claude overacts.

### end_frame

Output: `storyboards/BTS-SH006/end_frame.png`

Prompt: Final warm group photo. Everyone settles into a still pose, Byleth gives the faintest smile, and the frame can hold like a freeze-frame before fade. Main four remain clearly readable.

Reject if: the main four are lost, costumes change, or the ending loses warmth.


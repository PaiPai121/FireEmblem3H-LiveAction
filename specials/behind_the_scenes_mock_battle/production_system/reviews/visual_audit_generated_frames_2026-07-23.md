# Visual Audit - Generated Frames

Project: behind_the_scenes_mock_battle  
Date: 2026-07-23  
Reviewer role: visual-material-reviewer-agent  
Reviewed material: 18 generated start/key/end frames plus SH006 delivery-normalized 16:9 variants.

## Retraction

This audit decision is retracted as of 2026-07-23 after user review. The frames prove the broad behind-the-scenes beats, but they do not read strongly enough as a modern film set. Fantasy monastery/backlot cues dominate too many frames, and the prior `approved_for_video` decision was too permissive.

Revised decision: `blocked_needs_revision`.

Required V2 correction: regenerate frames using `modern_film_set_visual_locks_v2.md`, with modern production infrastructure visible in every start/key/end frame.

## Integrity Summary

- Frame files present: 18/18 source frames.
- Prompt files present: 6/6 prompts and 6/6 negative prompts.
- Prompt contract validation: passed for BTS-SH001 through BTS-SH006.
- Dimension issue found: BTS-SH006 source frames were 1536x1024 while BTS-SH001 through BTS-SH005 were 1672x941.
- Dimension correction: created SH006 `*_frame_delivery_16x9.png` variants at 1672x941 for delivery packaging.
- Contact sheet: `production_system/reviews/contact_sheet_generated_frames_2026-07-23.jpg`.

## Visual Audit Coverage

- Reviewed shots: BTS-SH001, BTS-SH002, BTS-SH003, BTS-SH004, BTS-SH005, BTS-SH006.
- Reviewed source frames: all start/key/end frames.
- Unavailable shots: none.

## Per-Shot Decisions

### BTS-SH001

- Declared purpose: reveal this is behind-the-scenes film footage, not an in-world battle.
- Frame chain: slate close-up, slate clap, wider crew/set reveal.
- Story beat proven: yes.
- Character identity: main four readable enough for the slate/opening beat.
- Action peak: slate clap is visible.
- Edit handoff: end frame reveals crew and set, cutting cleanly to lunch.
- Decision: visual_review_passed.
- Notes: slate text is visible and useful; preserve it only as the opening prop, not as recurring text.

### BTS-SH002

- Declared purpose: lunch-break character contrast.
- Frame chain: table scan, Claude caught with greens, Byleth quiet resolution.
- Story beat proven: yes.
- Character identity: all four readable, with stable table geography.
- Action peak: Claude's food gag is visible but subtle.
- Edit handoff: end frame can cut to props/wardrobe.
- Decision: visual_review_passed.
- Notes: video prompt must keep hands and food conservative; reject if the table becomes a modern cafeteria or Byleth overacts.

### BTS-SH003

- Declared purpose: ground fiction through props and wardrobe safety.
- Frame chain: prop/wardrobe table, prop master interacts with Claude's bow, Dimitri tests padded weapon while Edelgard handles costume detail.
- Story beat proven: yes.
- Character identity: leaders readable in key/end; start is environment-led by design.
- Action peak: prop master intervention is visible.
- Edit handoff: end frame supports cut into rehearsal lane.
- Decision: visual_review_passed.
- Notes: start-to-key continuity is a push-in from objects to performers rather than exact same framing; acceptable for this long-take prop segment. Reject video if weapons become sharp or combat-ready.

### BTS-SH004

- Declared purpose: main NG gag while preserving dignity.
- Frame chain: rehearsal marks, cape snag and overshoot, director calls cut and reset gesture.
- Story beat proven: yes.
- Character identity: main four readable enough in wide shot.
- Action peak: Edelgard cape/fence snag and Dimitri overshoot are visible.
- Edit handoff: end frame leads directly to monitor playback.
- Decision: visual_review_passed.
- Notes: background banners and weapon details are visually busy; video prompt must keep the action nonlethal, restrained, and locked wide.

### BTS-SH005

- Declared purpose: playback warmth and Byleth's quiet authority.
- Frame chain: monitor cluster, Claude points at playback, Byleth settles the beat with restraint.
- Story beat proven: yes.
- Character identity: stable and readable.
- Action peak: Claude point and group micro-reactions are clear.
- Edit handoff: end frame cuts cleanly to wrap photo.
- Decision: visual_review_passed.
- Notes: strongest generated continuity chain in the package.

### BTS-SH006

- Declared purpose: warm wrap-photo ending.
- Frame chain: group arranges, slate accidentally enters, slate lowers and final warm pose settles.
- Story beat proven: yes.
- Character identity: main four readable; crew and lights remain secondary.
- Action peak: accidental slate intrusion is visible without covering faces.
- Edit handoff: final frame can freeze or fade.
- Decision: visual_review_passed with delivery-normalized frames required.
- Notes: source aspect ratio differs from prior shots; delivery manifest uses normalized 16:9 variants.

## Original Promotion Decision - Retracted

- Integrity blockers: none after SH006 delivery normalization.
- Existing shots failed: none.
- Layout reference only: none.
- Monitor required: none at package gate; per-shot reject criteria remain in prompts and metadata for downstream clip QA.
- Visual review passed: BTS-SH001, BTS-SH002, BTS-SH003, BTS-SH004, BTS-SH005, BTS-SH006.
- Retracted promotion decision: do not use this v1 package for video generation.

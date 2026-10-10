# EP4 Source Video Breakdown

## Source package

- Video: `/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P5. 白云之章EP4女神再生仪式（青狮）)[00].mp4`
- Audio: `/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P5. 白云之章EP4女神再生仪式（青狮）)[01].mp4`
- Comment XML: `/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P5. 白云之章EP4女神再生仪式（青狮）).cmt.xml`
- Technical probe: video-only H.264 852×480 / 30 fps / 1157.166 s; separate AAC 48 kHz stereo audio / 1157.247833 s.
- The XML contains two viewer comments around 344–348 s and no transcript. Dialogue in this package is an original Japanese adaptation, not a transcript claim.

## Reconstructed event map

| Source window | Visible source beat | EP4 adaptation use | Reference policy |
| ---: | --- | --- | --- |
| 00:00–02:20 | Illustrated opening, sacred imagery, castle/monastery atmosphere, chapter title | Ceremony-before-danger prologue and visual thesis | Source stills are layout-only |
| 02:20–05:00 | Cathedral/monastery briefing with Byleth, Dimitri, Dedue and faculty | Rhea/Seteth frame the rite as a security and faith problem | Re-stage as live-action ensemble, no UI |
| 05:00–07:45 | Mission title, Holy Mausoleum tactical view, party entering the tomb | Translate map geography into stone thresholds, doors, wet steps, and light | Map frames are planning-only |
| 07:45–09:00 | Death Knight, magic/weapon action, bright sword beats | Build a short, causal combat chain; no gore or game effects | Action board is planning-only |
| 09:00–12:00 | Return to cathedral/monastery; Rhea, Seteth, Manuela, Hanneman and students discuss the aftermath | Institution absorbs the attack and redefines it as procedure | UI/dialogue boxes removed |
| 12:00–16:00 | Forest exchange with Flame Emperor and another armored/masked presence | Antagonist scene about the rite, the Death Knight, and “ownership” | Helmet/identity refs only |
| 16:00–19:17 | Church return and quiet Byleth/Sothis coda | End on an unanswered trust question | Dream reference controls palette, not literal game imagery |

## Source-frame notes

`source_refs/game_frame_*.jpg` are extracted from the game recording for event order, blocking, costume, and spatial research. They are explicitly `planning_only`; they are not live-action frames, not image-generation inputs at runtime, and not approval evidence for video delivery. The episode package carries a local reference pack with provenance for all reusable character, location, and style references.

## Adaptation principles

1. Replace tactical UI with physical geography: thresholds, columns, wet stone, torch falloff, and the direction of the party’s movement.
2. Replace dialogue-box staging with eyelines and listener reactions. A line belongs to one shot-local window and is spoken once.
3. Use the Death Knight encounter as a controlled threat, not a boss battle. One readable near-miss and one protected retreat are enough for the prompt package.
4. Keep the Flame Emperor scene red but not operatic: practical forest haze, dark iron, and a single warm source rather than a glowing villain poster.
5. End with Sothis in an intimate, low-volume register. The answer is withheld by behavior, not explained by narration.

# EP03 Probe Clip QA Checklist

Decision values: `motion_review_passed`, `monitor_required`, `blocked_needs_revision`.

For each 3-second probe, check:

- START frame is preserved as the first-frame anchor.
- KEY beat appears naturally without camera hiding it.
- END frame is approached as the cut-out state.
- Face, age, hairstyle, costume topology, faction colors, weapons, props, and role remain stable.
- Characters share environment lighting, shadows, fog, reflections, and ground contact.
- No cutout/sticker/halo or pasted-character look.
- No visible subtitles, captions, UI, logos, watermarks, refusal/warning screen, placeholder, black frame, borders, rounded player frame, letterbox, pillarbox, or artificial side fill.
- No Chinese/Mandarin voiceover.
- No added named foreground characters or unintended action escalation.
- Clip can plausibly cut to adjacent shots after continuity review.

Passing this checklist allows a shot to proceed to full-duration test generation, not automatic final approval.

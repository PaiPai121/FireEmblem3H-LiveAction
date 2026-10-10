# Video Prompt QA: Human Set V3

Date: 2026-07-24  
Reviewer role: video-prompt-reviewer-agent  
Project: behind_the_scenes_mock_battle

## Blocking Issues

None after V3 rewrite.

## Prompt Contract Check

All seven production prompts passed `validate_prompt_contract.js`.

## Frame Lock Check

Every prompt names the V3 start/key/end frames and defines how each frame should be used. The prompts animate approved frames rather than redesigning characters, locations, or story logic.

## Motion / Camera / Performance Check

Motion is conservative and human-scale: rehearsal stops, reset notes, over-careful sparring, lunch gestures, improved take, monitor review, and wrap photo. Camera instructions avoid orbiting and uncontrolled zooms.

## Continuity / Edit Fit

The prompts preserve the arc from failed take to reset, second take, rest, improved take, review, and final photo. Adjacent edit handoffs are explicit in the delivery manifest.

## Negative Prompt Check

Negative prompts cover the current concrete risks: Nian replacement, AI/monitor malfunction framing, subtitles, staff exposition, metal weapon drift, face/costume drift, random crowds, and camera drift.

## Required Revisions

None before V3 continuity gate. Downstream generated clips still need normal clip QA after video model output.

## Decision

approved_for_video

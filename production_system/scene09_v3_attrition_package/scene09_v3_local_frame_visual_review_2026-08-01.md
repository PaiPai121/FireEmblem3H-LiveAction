# Scene09 V3 Local Frame Visual Review

Date: 2026-08-01
Scope: current 42-shot monitor handoff package, packaged start/key/end PNGs, contact-sheet triage, and full-size evidence checks for key continuity shots.

## Decision

Status: `monitor_required_before_video`.

The current web-facing frame package is structurally usable for monitored image-to-video tests. It is not final-edit approved because generated clips are still pending and the video model can still introduce identity, weapon, crowd, or re-entry drift.

## Current Critical Fixes Verified

- Shot034B is now `空教师目标裁定` across the delivery package.
- Shot034B visible roster is exactly `Byleth, Dimitri`.
- Shot034B start/key/end frames point to `34D_Shot034B_empty_objective_*`; the deprecated Hanneman-lane frame set is not used in delivery.
- Full-size Shot034B start/key/end frames show two empty faculty objective markers with Hanneman and Manuela absent/offscreen/silent/unpaired.
- Shot032 preserves the Dedue/Mercedes healer-tank beat: Mercedes spends effort behind Dedue while Dedue restores the shield line.
- Shot032F preserves Hubert captured by Felix and Ashe.
- Shot032G preserves Dorothea and Bernadetta captured by Leonie and Claude.
- Shot034G keeps the exhausted Byleth/Dimitri/Dedue core victory instead of a full Blue Lions class reset.
- Contact sheets remain triage only; if a thumbnail label or tiny distant figure is ambiguous, the full-size package PNG is the authoritative visual evidence.

## Frame Evidence

- Frame evidence audit: `production_system/scene09_v3_attrition_package/scene09_v3_frame_evidence_audit_2026-08-01.md`
- Frame CSV: `production_system/scene09_v3_attrition_package/scene09_v3_frame_evidence_audit_2026-08-01.csv`
- Packaged copy: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/frame_evidence_audit.md`
- ASCII high-risk contact sheet: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/high_risk_contact_sheet_ascii_2026-08-01.jpg`

## Risks To Monitor In Video Probes

- Shot025 may still need a closer three-leader insert if the edit needs all house leaders visibly introduced rather than only battlefield geography.
- Shot029C should be treated primarily as Claude's high point; Ashe and Edelgard are not the strongest readable beats at contact-sheet scale.
- Shot034E/F are stand-down tableaus and need restrained motion in video so they do not feel like static lineup cards.
- All generated clips must be rejected if the model adds unnamed readable people, restores captured characters, shows Hanneman or Manuela in Shot034B, pairs the teachers, or turns training weapons lethal.


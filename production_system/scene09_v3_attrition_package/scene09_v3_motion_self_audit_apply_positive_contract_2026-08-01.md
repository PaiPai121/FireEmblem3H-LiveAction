# Scene09 V3 Motion Self-Audit Apply Positive Contract

Date: 2026-08-01
Decision: motion_self_audit_apply_positive_contract_passed

This audit runs the real apply gate against a temporary signed fixture. It proves the gate has a positive path when real clips, start/mid/end review frames, current clip SHA-256 signatures, current frame signatures, Codex reviewer identity, notes, and all required pass checks are present. It does not approve production clips.

## Counts

- Expected shots: 42
- Proposal rows: 42
- Applied passed rows: 42
- Clip signature matched rows: 42
- Review-frame signature matched rows: 42
- Review evidence complete rows: 42
- Ledger matched rows: 42
- Battle ledger rows digest: ok
- Active-return state-machine digest: ok
- Required checks complete rows: 42
- Stale battle ledger digest rejected: yes
- Stale active-return state-machine digest rejected: yes

## Problems

- none

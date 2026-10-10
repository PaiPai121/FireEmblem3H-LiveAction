# Scene09 V3 Provider Ingest Provenance Contract

Date: 2026-08-01
Decision: provider_ingest_provenance_contract_passed

This contract proves provider-ingest provenance records the original returned source digest and that `clip_provenance_gate` rejects provider provenance missing `source_sha256`.

## Positive Path

- Ingest applied: yes
- Provenance gate passed: yes
- Source SHA-256 recorded: yes
- Output SHA-256 recorded: yes

## Negative Path

- Missing source_sha256 rejected: yes

## Problems

- none

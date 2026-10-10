# Scene09 V3 Executable Prompt Semantics Audit

Date: 2026-08-01
Decision: executable_prompt_semantics_passed
Shots checked: 42

## Scope

- Negative prompts must carry teacher-separation tokens for every shot.
- `model_prompt.md` must be a web-upload executable prompt: uploaded START/KEY/END only, no local paths, URLs, image filenames, or previous-shot dependencies.
- Ledger must-not-return names must become concrete negative tokens.
- Non-visible names may appear in executable sections only as absence, offscreen, captured, or no-return locks.
- Visible must-not-return names cannot be contradicted by `no readable` negative tokens or active-combat language.

## Problems

- none

## Warnings

- none


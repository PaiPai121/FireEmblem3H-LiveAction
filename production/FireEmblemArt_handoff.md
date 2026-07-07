# FireEmblemArt Handoff

Source transcript: `history.md`

Conversation id seen in generated image paths:

- `019f31be-af9a-7823-87f7-61516e10d4a1`

## Diagnosis

- The old Codex session was long and image-heavy.
- It hit repeated transport failures:
  - `stream disconnected before completion: Transport error: network error: error decoding response body`
  - `Error running remote compact task: stream disconnected before completion: error sending request for url (https://chatgpt.com/backend-api/codex/responses/compact)`
- This means the previous session likely failed while streaming or while remote compaction was trying to summarize the long context.
- A new session cannot automatically read the private server-side context of that old conversation. The local transcript in `history.md` is the usable recovery source.

## Completed According To Transcript

- Black Eagles recovery:
  - Dorothea, Petra completed after earlier infographic failures.
- Blue Lions reference v1:
  - Felix
  - Ashe
  - Sylvain
  - Mercedes
  - Annette
  - Ingrid
- Golden Deer reference v1:
  - Lorenz
  - Raphael
  - Ignatz
  - Lysithea
  - Marianne
  - Hilda
  - Leonie
- Church of Seiros reference v1:
  - Seteth
  - Flayn
  - Hanneman
  - Manuela, with latest candidate noted as `candidate_02.png`
  - Alois
  - Catherine
  - Shamir
  - Cyril
  - Gilbert
  - Jeritza

## Current Breakpoint

The old session was working on antagonist / enemy characters:

- DeathKnight
- FlameEmperor
- Solon
- Kronya
- Thales
- Nemesis
- Kostas

Observed issue at the breakpoint:

- `assets/characters/antagonists/DeathKnight/references/official_local/concept/fireemblemwiki_main.png` appeared to be Jeritza unmasked, not Death Knight armor.
- The old session attempted to replace it with:
  - `https://www.creativeuncut.com/gallery-37/art/feth-reaper-knight.jpg`
- The session disconnected immediately after that attempted download.
- Follow-up fix completed: local reference was replaced with Fire Emblem Wiki armored official art:
  - `https://cdn.fireemblemwiki.org/8/86/FETH_Death_Knight_02.png`
  - SHA-256: `a9fb51bff72b3c8f4776e925e2b56254c3459c3d3bfd699118b67518729fc440`
- `FlameEmperor` local concept reference was visually checked as correct in the transcript, despite suspicious download-report metadata.

## Next Practical Steps

1. Create antagonist reference-v1 directories, likely:
   - `assets/characters/antagonists/<Name>/concept/candidates_reference_v1/`
2. Generate one character at a time.
3. For each candidate:
   - save `candidate_01.png`
   - visually inspect with `view_image`
   - update local `notes.md`
   - update `production/角色素材优化进度.md`
   - update `production/character_asset_index.yaml`

## Prompt Guardrail

Start image prompts with:

`Single photorealistic live-action character still. One person only. No text, no labels, no poster, no diagram, no infographic.`

This guardrail was added because the previous image context repeatedly produced infographic-style failures.

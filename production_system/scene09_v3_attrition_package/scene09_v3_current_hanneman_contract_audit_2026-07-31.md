# Scene09 V3 Current Hanneman Contract Audit

Decision: current_hanneman_contract_failed

## Problems
- model_prompt: missing "Allowed readable humans: Byleth, Dimitri, Hanneman."
- model_prompt: missing "Visible named-only list: Byleth, Dimitri, Hanneman."
- model_prompt: missing "Reject if anyone outside Byleth, Dimitri, and Hanneman appears."
- model_prompt: missing "Reject if Manuela appears in any readable form"
- model_prompt: missing "Reject if Hanneman and Manuela stand together, share a sigil, or are treated as allied combatants."
- submission_payload.prompt_text: missing "Allowed readable humans: Byleth, Dimitri, Hanneman."
- submission_payload.prompt_text: missing "Visible named-only list: Byleth, Dimitri, Hanneman."
- submission_payload.prompt_text: missing "Reject if anyone outside Byleth, Dimitri, and Hanneman appears."
- submission_payload.prompt_text: missing "Reject if Manuela appears in any readable form"
- submission_payload.prompt_text: missing "Reject if Hanneman and Manuela stand together, share a sigil, or are treated as allied combatants."
- model_submission_index: missing delivery/scene09_v3_monitor_handoff_package_2026-07-27/model_submission_batches/index.html
- usable_assets: missing Byleth/Dimitri/Hanneman visible evidence
- usable_assets: missing Hanneman-lane frame evidence

## Evidence
- Shot034B current visible lock is Byleth, Dimitri, Hanneman.
- Shot034B current start/key/end frame source uses 34D_Shot034B_hanneman_lane.
- Manuela is absent/offscreen/silent/unpaired and banned by prompt plus negative prompt.
- Submission payload rows remain 42 and include the current Shot034B prompt.

# Scene09 V3 Model CLI Template Positive Contract

Date: 2026-08-01
Decision: model_cli_template_positive_contract_passed
Cases checked: 4

This contract proves the model CLI template audit has a positive path for a complete local image-to-video command and rejects unsafe or incomplete templates without changing the production audit report.

## Cases

- valid_full_template_passes: status 0; decision model_cli_template_ready; problems 0
- missing_output_placeholder_rejected: status 1; decision model_cli_template_blocked; problems 1
- unsupported_placeholder_rejected: status 1; decision model_cli_template_blocked; problems 2
- placeholder_executable_rejected: status 1; decision model_cli_template_blocked; problems 1

## Problems

- none

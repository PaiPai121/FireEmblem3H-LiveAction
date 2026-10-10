# Scene09 V3 Report Freshness Malformed JSON Contract

Date: 2026-08-01
Decision: report_freshness_malformed_json_contract_passed
Probe exit status: 1
Probe decision: report_freshness_blocked

This contract corrupts a temporary package-local report and proves the freshness gate emits an auditable blocker instead of crashing or modifying production reports.

## Probe Problems

- submission_contract_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- model_cli_template_audit: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- model_cli_template_positive_contract: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- generated_clip_structural_audit: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- frame_evidence_audit: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- narrative_hard_constraints_audit: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- current_status_consistency_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- provider_preflight_consistency_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- motion_self_audit_evidence_contract: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- motion_self_audit_apply_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- production_delivery_truth_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- clip_provenance_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- proxy_misuse_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- final_concat_gate: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- final_edit_structural_audit: package_manifest delivery/scene09_v3_monitor_handoff_package_2026-07-27/package_manifest.json does not match ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/package_manifest.json
- operator_preflight_status: invalid JSON ../../../var/folders/ty/bhcjhxhd6nq6mr95lsdlf8g40000gn/T/scene09_v3_report_freshness_contract.LLIBaR/package/operator_preflight_status.json: Expected double-quoted property name in JSON at position 39 (line 1 column 40)

## Contract Problems

- none

# Submission Queue With Battle Ledger

Decision: passed
Rows: 42

This operator table joins each video-model work order with the post-shot battle ledger, so captured, defeated, stood-down, or objective-defeated characters cannot accidentally re-enter active combat in later clips.

## Problems

- none

## Critical Continuity Rows

| # | Shot | Visible | Visible But No Active Combat After | Captured / Objective Defeated After | Must Not Return Active After | Changed |
| --- | --- | --- | --- | --- | --- | --- |
| 28 | Shot032F | Felix; Ashe; Hubert | Hubert | black_eagles: Hubert | blue_lions: Annette, Mercedes; black_eagles: Hubert | Hubert:captured_by_felix_and_ashe; Felix:captor_active; Ashe:captor_active |
| 29 | Shot032G | Claude; Leonie; Dorothea; Bernadetta | Dorothea, Bernadetta | black_eagles: Hubert, Dorothea, Bernadetta | blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta | Dorothea:captured_by_leonie_and_claude; Bernadetta:captured_by_leonie_and_claude; Claude:captor_active; Leonie:captor_active |
| 36 | Shot034B | Byleth; Dimitri | none | black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman | blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela | Dimitri:surviving_winner; Byleth:surviving_command; Hanneman:objective_defeated_separate_lane; Manuela:route_cut_offscreen_unpaired |
| 39 | Shot034G | Byleth; Dimitri; Dedue | none | black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman | blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela | Dimitri:surviving_winner_exhausted; Dedue:surviving_winner_exhausted; Annette:spent_stood_down; Mercedes:spent_stood_down; Sylvain:spent_stood_down; Ingrid:spent_stood_down; Ashe:spent_stood_down |
| 42 | Shot036 | Dimitri; Byleth | none | black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman | blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela | none |

## Files

- CSV: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/submission_queue_with_battle_ledger.csv`
- Source queue: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/submission_queue.csv`
- Source battle ledger: `production_system/scene09_v3_attrition_package/scene09_v3_battle_ledger_timeline_2026-07-28.json`


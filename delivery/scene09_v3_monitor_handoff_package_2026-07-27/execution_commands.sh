#!/usr/bin/env bash
set -euo pipefail

# Configure VIDEO_MODEL_CLI_ARGV_JSON before executing real video generation.
# This file lists every shot and expected output for handoff.

# 01 Shot025
# visible: Dimitri, Edelgard, Claude
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/model_prompt.md
# start/key/end: shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/start_frame.png | shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/key_frame.png | shots/001_EP02-SC09-SHOT-Shot025-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/01_Shot025.mp4

# 02 Shot025A
# visible: none
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/model_prompt.md
# start/key/end: shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/start_frame.png | shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/key_frame.png | shots/002_EP02-SC09-SHOT-Shot025A-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/02_Shot025A.mp4

# 03 Shot026
# visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/model_prompt.md
# start/key/end: shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/start_frame.png | shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/key_frame.png | shots/003_EP02-SC09-SHOT-Shot026-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/03_Shot026.mp4

# 04 Shot026B
# visible: Byleth, Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/model_prompt.md
# start/key/end: shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/start_frame.png | shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/key_frame.png | shots/004_EP02-SC09-SHOT-Shot026B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/04_Shot026B.mp4

# 05 Shot026C
# visible: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/model_prompt.md
# start/key/end: shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/start_frame.png | shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/key_frame.png | shots/005_EP02-SC09-SHOT-Shot026C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/05_Shot026C.mp4

# 06 Shot027
# visible: Ashe, Claude
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/model_prompt.md
# start/key/end: shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/start_frame.png | shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/key_frame.png | shots/006_EP02-SC09-SHOT-Shot027-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/06_Shot027.mp4

# 07 Shot027B
# visible: Ferdinand, Edelgard, Hubert, Dorothea
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/model_prompt.md
# start/key/end: shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/start_frame.png | shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/key_frame.png | shots/007_EP02-SC09-SHOT-Shot027B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/07_Shot027B.mp4

# 08 Shot027C
# visible: Dimitri, Dedue, Ferdinand, Edelgard, Hubert
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/model_prompt.md
# start/key/end: shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/start_frame.png | shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/key_frame.png | shots/008_EP02-SC09-SHOT-Shot027C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/08_Shot027C.mp4

# 09 Shot027D
# visible: Felix, Byleth, Ferdinand, Dedue
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: none
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/model_prompt.md
# start/key/end: shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/start_frame.png | shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/key_frame.png | shots/009_EP02-SC09-SHOT-Shot027D-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/09_Shot027D.mp4

# 10 Shot028
# visible: Annette, Mercedes, Ignatz
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Annette, Mercedes
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: Annette:pressured; Mercedes:pressured
# No-Active-Combat Line: none
# prompt: shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/model_prompt.md
# start/key/end: shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/start_frame.png | shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/key_frame.png | shots/010_EP02-SC09-SHOT-Shot028-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/10_Shot028.mp4

# 11 Shot028B
# visible: Edelgard, Hubert, Dorothea, Dimitri, Dedue
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Annette, Mercedes
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/model_prompt.md
# start/key/end: shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/start_frame.png | shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/key_frame.png | shots/011_EP02-SC09-SHOT-Shot028B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/11_Shot028B.mp4

# 12 Shot028C
# visible: Felix, Byleth, Ferdinand, Dedue
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Annette, Mercedes
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/model_prompt.md
# start/key/end: shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/start_frame.png | shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/key_frame.png | shots/012_EP02-SC09-SHOT-Shot028C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/12_Shot028C.mp4

# 13 Shot029
# visible: Sylvain, Ingrid, Annette, Mercedes, Hilda, Lorenz
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Annette, Mercedes
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/model_prompt.md
# start/key/end: shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/start_frame.png | shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/key_frame.png | shots/013_EP02-SC09-SHOT-Shot029-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/13_Shot029.mp4

# 14 Shot029C
# visible: Claude, Ashe, Edelgard
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Annette, Mercedes
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/model_prompt.md
# start/key/end: shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/start_frame.png | shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/key_frame.png | shots/014_EP02-SC09-SHOT-Shot029C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/14_Shot029C.mp4

# 15 Shot029D
# visible: Claude, Ashe
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: Ashe:displaced; Leonie:hidden_flanker
# No-Active-Combat Line: none
# prompt: shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/model_prompt.md
# start/key/end: shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/start_frame.png | shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/key_frame.png | shots/015_EP02-SC09-SHOT-Shot029D-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/15_Shot029D.mp4

# 16 Shot029B
# visible: Hilda, Lorenz, Ignatz, Sylvain, Ingrid
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/model_prompt.md
# start/key/end: shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/start_frame.png | shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/key_frame.png | shots/016_EP02-SC09-SHOT-Shot029B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/16_Shot029B.mp4

# 17 Shot030
# visible: Felix, Byleth, Ferdinand
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/model_prompt.md
# start/key/end: shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/start_frame.png | shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/key_frame.png | shots/017_EP02-SC09-SHOT-Shot030-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/17_Shot030.mp4

# 18 Shot030B
# visible: Felix, Byleth
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/model_prompt.md
# start/key/end: shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/start_frame.png | shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/key_frame.png | shots/018_EP02-SC09-SHOT-Shot030B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/18_Shot030B.mp4

# 19 Shot030C
# visible: Ignatz, Annette, Mercedes, Dorothea
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: Annette:pressured; Mercedes:pressured; Dorothea:pressured; Bernadetta:pressured
# No-Active-Combat Line: none
# prompt: shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/model_prompt.md
# start/key/end: shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/start_frame.png | shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/key_frame.png | shots/019_EP02-SC09-SHOT-Shot030C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/19_Shot030C.mp4

# 20 Shot031
# visible: Byleth, Felix
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/model_prompt.md
# start/key/end: shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/start_frame.png | shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/key_frame.png | shots/020_EP02-SC09-SHOT-Shot031-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/20_Shot031.mp4

# 21 Shot031B
# visible: Byleth, Dimitri, Dedue, Sylvain, Ingrid, Annette, Mercedes
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
# Defeated / Removed After: none
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: none
# Must Not Return Active: none
# Changed This Shot: none
# No-Active-Combat Line: none
# prompt: shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/model_prompt.md
# start/key/end: shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/start_frame.png | shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/key_frame.png | shots/021_EP02-SC09-SHOT-Shot031B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/21_Shot031B.mp4

# 22 Shot032
# visible: Dedue, Mercedes
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Ashe, Annette; black_eagles: Dorothea, Bernadetta; golden_deer: Leonie
# Defeated / Removed After: blue_lions: Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Mercedes
# Must Not Return Active: blue_lions: Mercedes
# Changed This Shot: Dedue:restored_frontline; Mercedes:spent_after_heal
# No-Active-Combat Line: Mercedes
# prompt: shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/model_prompt.md
# start/key/end: shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/start_frame.png | shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/key_frame.png | shots/022_EP02-SC09-SHOT-Shot032-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/22_Shot032.mp4

# 23 Shot032A
# visible: Annette, Mercedes, Ashe, Claude
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes
# Changed This Shot: Annette:spent_stood_down; Mercedes:spent_stood_down; Ashe:restored_angle; Claude:displaced
# No-Active-Combat Line: Annette, Mercedes
# prompt: shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/model_prompt.md
# start/key/end: shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/start_frame.png | shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/key_frame.png | shots/023_EP02-SC09-SHOT-Shot032A-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/23_Shot032A.mp4

# 24 Shot032B
# visible: Dimitri, Dedue, Hanneman
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes
# Changed This Shot: none
# No-Active-Combat Line: Annette, Mercedes
# prompt: shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/model_prompt.md
# start/key/end: shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/start_frame.png | shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/key_frame.png | shots/024_EP02-SC09-SHOT-Shot032B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/24_Shot032B.mp4

# 25 Shot032C
# visible: Edelgard, Hubert, Dorothea, Claude, Hilda
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes
# Changed This Shot: none
# No-Active-Combat Line: Annette, Mercedes
# prompt: shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/model_prompt.md
# start/key/end: shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/start_frame.png | shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/key_frame.png | shots/025_EP02-SC09-SHOT-Shot032C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/25_Shot032C.mp4

# 26 Shot032D
# visible: Byleth, Dimitri, Edelgard, Claude
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: black_eagles: Dorothea, Bernadetta; golden_deer: Claude, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes
# Changed This Shot: none
# No-Active-Combat Line: Annette, Mercedes
# prompt: shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/model_prompt.md
# start/key/end: shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/start_frame.png | shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/key_frame.png | shots/026_EP02-SC09-SHOT-Shot032D-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/26_Shot032D.mp4

# 27 Shot032E
# visible: Byleth, Dimitri, Edelgard, Claude, Hilda, Hubert
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes
# Captured / Objective-Defeated After: none
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes
# Changed This Shot: Byleth:active_available; Dimitri:engaged; Edelgard:pressured; Claude:displaced; Hilda:pressured
# No-Active-Combat Line: Annette, Mercedes
# prompt: shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/model_prompt.md
# start/key/end: shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/start_frame.png | shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/key_frame.png | shots/027_EP02-SC09-SHOT-Shot032E-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/27_Shot032E.mp4

# 28 Shot032F
# visible: Felix, Ashe, Hubert
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Leonie
# Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert
# Captured / Objective-Defeated After: black_eagles: Hubert
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert
# Changed This Shot: Hubert:captured_by_felix_and_ashe; Felix:captor_active; Ashe:captor_active
# No-Active-Combat Line: Annette, Mercedes, Hubert
# prompt: shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/model_prompt.md
# start/key/end: shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/start_frame.png | shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/key_frame.png | shots/028_EP02-SC09-SHOT-Shot032F-V2-20260724/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/28_Shot032F.mp4

# 29 Shot032G
# visible: Claude, Leonie, Dorothea, Bernadetta
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Changed This Shot: Dorothea:captured_by_leonie_and_claude; Bernadetta:captured_by_leonie_and_claude; Claude:captor_active; Leonie:captor_active
# No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
# prompt: shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/model_prompt.md
# start/key/end: shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/start_frame.png | shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/key_frame.png | shots/029_EP02-SC09-SHOT-Shot032G-V2-20260724/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/29_Shot032G.mp4

# 30 Shot033
# visible: Dimitri, Byleth, Dedue, Hanneman
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Changed This Shot: none
# No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
# prompt: shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/model_prompt.md
# start/key/end: shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/start_frame.png | shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/key_frame.png | shots/030_EP02-SC09-SHOT-Shot033-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/30_Shot033.mp4

# 31 Shot033B
# visible: Byleth, Ashe, Ingrid, Felix
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta
# Stood Down / Post-Battle After: blue_lions: Annette, Mercedes
# Must Not Return Active: blue_lions: Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Changed This Shot: none
# No-Active-Combat Line: Annette, Mercedes, Hubert, Dorothea, Bernadetta
# prompt: shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/model_prompt.md
# start/key/end: shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/start_frame.png | shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/key_frame.png | shots/031_EP02-SC09-SHOT-Shot033B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/31_Shot033B.mp4

# 32 Shot033C
# visible: Ashe, Hanneman
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes
# Must Not Return Active: blue_lions: Ashe, Annette, Mercedes; black_eagles: Hubert, Dorothea, Bernadetta
# Changed This Shot: Hanneman:objective_suppressed; Ashe:spent_stood_down
# No-Active-Combat Line: Ashe, Annette, Mercedes, Hubert, Dorothea, Bernadetta
# prompt: shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/model_prompt.md
# start/key/end: shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/start_frame.png | shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/key_frame.png | shots/032_EP02-SC09-SHOT-Shot033C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/32_Shot033C.mp4

# 33 Shot033D
# visible: Ingrid, Manuela, Sylvain
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue, Felix; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
# Changed This Shot: Manuela:route_cut; Ingrid:spent_stood_down; Sylvain:spent_stood_down
# No-Active-Combat Line: Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Dorothea, Bernadetta, Manuela
# prompt: shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/model_prompt.md
# start/key/end: shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/start_frame.png | shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/key_frame.png | shots/033_EP02-SC09-SHOT-Shot033D-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/33_Shot033D.mp4

# 34 Shot034C
# visible: Felix, Ferdinand
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; manuela_faculty_lane: Manuela
# Changed This Shot: Ferdinand:defeated_by_route_block; Felix:spent_stood_down
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Manuela
# prompt: shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/model_prompt.md
# start/key/end: shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/start_frame.png | shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/key_frame.png | shots/034_EP02-SC09-SHOT-Shot034C-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/34_Shot034C.mp4

# 35 Shot034D
# visible: Byleth, Hanneman
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
# Limited But Not Defeated After: blue_lions: Dimitri; black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: Hanneman:objective_defeated_off_sigil
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela
# prompt: shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/model_prompt.md
# start/key/end: shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/start_frame.png | shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/key_frame.png | shots/035_EP02-SC09-SHOT-Shot034D-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/35_Shot034D.mp4

# 36 Shot034B
# visible: Byleth, Dimitri
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie
# Limited But Not Defeated After: black_eagles: Edelgard; golden_deer: Hilda
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: Dimitri:surviving_winner; Byleth:surviving_command; Hanneman:objective_defeated_separate_lane; Manuela:route_cut_offscreen_unpaired
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Hanneman, Manuela
# prompt: shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/model_prompt.md
# start/key/end: shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/start_frame.png | shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/key_frame.png | shots/036_EP02-SC09-SHOT-Shot034B-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/36_Shot034B.mp4

# 37 Shot034E
# visible: Claude, Hilda, Lorenz, Ignatz, Leonie
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue; black_eagles: Edelgard
# Limited But Not Defeated After: black_eagles: Edelgard
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: Claude:stood_down_defeated_house; Hilda:stood_down_defeated_house; Lorenz:stood_down_defeated_house; Ignatz:stood_down_defeated_house; Leonie:stood_down_defeated_house
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/model_prompt.md
# start/key/end: shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/start_frame.png | shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/key_frame.png | shots/037_EP02-SC09-SHOT-Shot034E-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/37_Shot034E.mp4

# 38 Shot034F
# visible: Edelgard, Ferdinand
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
# Limited But Not Defeated After: none
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: Edelgard:stood_down_defeated_house; Ferdinand:defeated_by_route_block
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/model_prompt.md
# start/key/end: shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/start_frame.png | shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/key_frame.png | shots/038_EP02-SC09-SHOT-Shot034F-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/38_Shot034F.mp4

# 39 Shot034G
# visible: Byleth, Dimitri, Dedue
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
# Limited But Not Defeated After: none
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: Dimitri:surviving_winner_exhausted; Dedue:surviving_winner_exhausted; Annette:spent_stood_down; Mercedes:spent_stood_down; Sylvain:spent_stood_down; Ingrid:spent_stood_down; Ashe:spent_stood_down
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/model_prompt.md
# start/key/end: shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/start_frame.png | shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/key_frame.png | shots/039_EP02-SC09-SHOT-Shot034G-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/39_Shot034G.mp4

# 40 Shot034
# visible: Dimitri, Edelgard, Claude
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
# Limited But Not Defeated After: none
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: none
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/model_prompt.md
# start/key/end: shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/start_frame.png | shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/key_frame.png | shots/040_EP02-SC09-SHOT-Shot034-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/40_Shot034.mp4

# 41 Shot035
# visible: Felix, Byleth
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
# Limited But Not Defeated After: none
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: none
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/model_prompt.md
# start/key/end: shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/start_frame.png | shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/key_frame.png | shots/041_EP02-SC09-SHOT-Shot035-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/41_Shot035.mp4

# 42 Shot036
# visible: Dimitri, Byleth
# Alive / Safe After: command: Byleth; blue_lions: Dimitri, Dedue, Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Active / Controlling After: command: Byleth; blue_lions: Dimitri, Dedue
# Limited But Not Defeated After: none
# Defeated / Removed After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Captured / Objective-Defeated After: black_eagles: Hubert, Dorothea, Bernadetta; hanneman_faculty_lane: Hanneman
# Stood Down / Post-Battle After: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Ferdinand; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; manuela_faculty_lane: Manuela
# Must Not Return Active: blue_lions: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid; black_eagles: Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta; golden_deer: Claude, Hilda, Lorenz, Ignatz, Leonie; hanneman_faculty_lane: Hanneman; manuela_faculty_lane: Manuela
# Changed This Shot: none
# No-Active-Combat Line: Felix, Ashe, Annette, Mercedes, Sylvain, Ingrid, Edelgard, Hubert, Ferdinand, Dorothea, Bernadetta, Claude, Hilda, Lorenz, Ignatz, Leonie, Hanneman, Manuela
# prompt: shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/model_prompt.md
# start/key/end: shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/start_frame.png | shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/key_frame.png | shots/042_EP02-SC09-SHOT-Shot036-V2-20260721/end_frame.png
# output: episodes/EP02/video_outputs/scene09_v3_attrition/42_Shot036.mp4

# Scene09 Motion Probe Upload Pack

Generated: 2026-08-15T06:32:38.973Z
Decision: motion_probe_upload_pack_ready
Batches: 7
Probe rows: 42

## Upload Rule

Upload only the files under motion_probe_upload_pack/zips. Keep returned probe mp4 files in each row's return_dir, then run the dry-run ingest command before apply.

## Files To Upload

| # | Batch | Shot Range | Zip | Bytes | SHA-256 |
|---:|---|---|---|---:|---|
| 1 | probe_batch_001_shots_001-006 | 001_Shot025-006_Shot027 | [probe_batch_001_shots_001-006.zip](zips/probe_batch_001_shots_001-006.zip) | 49401500 | `252a55cece10a99f24d26757bd67c032d4545eff38ff43eab7beba8d822ce328` |
| 2 | probe_batch_002_shots_007-012 | 007_Shot027B-012_Shot028C | [probe_batch_002_shots_007-012.zip](zips/probe_batch_002_shots_007-012.zip) | 46535571 | `458712a90e2a7b0cd66604deeba3115f0622f6389e0ebe31775ecc353dea69b1` |
| 3 | probe_batch_003_shots_013-018 | 013_Shot029-018_Shot030B | [probe_batch_003_shots_013-018.zip](zips/probe_batch_003_shots_013-018.zip) | 46477764 | `116f5d964cd8b814371ae1355d8aa37bd2e63978242bbb4101d4a57e30bf80dc` |
| 4 | probe_batch_004_shots_019-024 | 019_Shot030C-024_Shot032B | [probe_batch_004_shots_019-024.zip](zips/probe_batch_004_shots_019-024.zip) | 46365051 | `8ef6cf66c13423d24a296cfe4b00dec9615096d5ef5d96e36730f5a455f87820` |
| 5 | probe_batch_005_shots_025-030 | 025_Shot032C-030_Shot033 | [probe_batch_005_shots_025-030.zip](zips/probe_batch_005_shots_025-030.zip) | 49155821 | `91f8b62cac8ae01e66c53cf1094ffdb479045cf108fc024a50bdf9ad9a833be3` |
| 6 | probe_batch_006_shots_031-036 | 031_Shot033B-036_Shot034B | [probe_batch_006_shots_031-036.zip](zips/probe_batch_006_shots_031-036.zip) | 47893620 | `4a17f2526a7d537e5bb8be68dbbe5ba1d3824ac762e5fc4a64f6312fe2b5d9da` |
| 7 | probe_batch_007_shots_037-042 | 037_Shot034E-042_Shot036 | [probe_batch_007_shots_037-042.zip](zips/probe_batch_007_shots_037-042.zip) | 36879164 | `a87333f8bee001b1c8f9fa32f4d4f0b2710c65f37bc58ebe73e4bb4542d38a2e` |

## Verification

- `SHA256SUMS.txt` contains one checksum per upload zip.
- `upload_manifest.json` and `upload_manifest.csv` carry the return directories and ingest commands.
- `RETURN_DIRECTORIES.md` is the operator-facing return map.

## Problems

- none

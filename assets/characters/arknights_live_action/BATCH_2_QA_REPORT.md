# Arknights Live-Action Batch 2 QA Report

Reviewed: 2026-07-28T07:14:37.869Z

Scope: 30 additional six-star operators after the first 36 processed entries. W and Skadi the Corrupting Heart remain skipped per user instruction; base Skadi is included.

## Outcome

- Selected: 15 (Phantom, Passenger, Specter the Unchained, Penance, Qiubai, Hoederer, Zuo Le, Kirin R Yato, Fiammetta, Stainless, Ebenholz, Gnosis, Flametail, Saileach, Fartooth)
- Monitor required: 12 (Mostima, Ifrit, Siege, Skadi, Lin, Ulpianus, Ray, Ela, Ash, Dorothy, Blemishine, Pallas)
- Blocked/rejected: 3 (Weedy, Angelina, Nymph)

## Gate Rule

Only operators with `selected.png` may enter downstream storyboard, video prompt, or video generation packages.

Monitor candidates are retained as visual direction and must be reviewed again before use in production.

Blocked/rejected candidates are retained as failure evidence and revision targets.

## Reference URL Repair

Resolved direct image URLs were recorded for Fiammetta, Dorothy, Stainless, Flametail, Fartooth, and Pallas because their initial redirect downloads returned an HTML challenge page before repair.

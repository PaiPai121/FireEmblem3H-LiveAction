#!/usr/bin/env bash
set -euo pipefail

# Official source art is downloaded for private production reference only.
# .gitignore excludes every references/official_local/ directory.

download() {
  local label="$1"
  local url="$2"
  local out="$3"

  mkdir -p "$(dirname "$out")"
  printf 'Downloading %s\n  %s\n  -> %s\n' "$label" "$url" "$out"
  curl -L "$url" -o "$out"
}

download "Byleth main official reference" \
  "https://cdn.fireemblemwiki.org/6/6a/FETH_Byleth_m_f.png" \
  "assets/characters/protagonist/Byleth/references/official_local/professor/fireemblemwiki_main.png"

download "Sothis main official reference" \
  "https://cdn.fireemblemwiki.org/c/c5/FETH_Sothis.png" \
  "assets/characters/divine/Sothis/references/official_local/dream/fireemblemwiki_main.png"

download "Edelgard academy official reference" \
  "https://cdn.fireemblemwiki.org/c/ce/FETH_Edelgard_02.png" \
  "assets/characters/black_eagles/Edelgard/references/official_local/academy/fireemblemwiki_main.png"

download "Dimitri academy official reference" \
  "https://cdn.fireemblemwiki.org/4/48/FETH_Dimitri_02.png" \
  "assets/characters/blue_lions/Dimitri/references/official_local/academy/fireemblemwiki_main.png"

download "Claude academy official reference" \
  "https://cdn.fireemblemwiki.org/2/26/FETH_Claude_02.png" \
  "assets/characters/golden_deer/Claude/references/official_local/academy/fireemblemwiki_main.png"

download "Rhea archbishop official reference" \
  "https://cdn.fireemblemwiki.org/0/0d/FETH_Rhea_02.png" \
  "assets/characters/church_of_seiros/Rhea/references/official_local/archbishop/fireemblemwiki_main.png"

cat <<'MSG'

Done.

These files are intentionally local-only:
  **/references/official_local/

Do not commit downloaded official art unless rights are cleared.
MSG

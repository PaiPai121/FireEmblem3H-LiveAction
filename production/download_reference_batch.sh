#!/usr/bin/env bash
set -euo pipefail

targets="${1:-production/reference_targets.tsv}"
report="production/reference_download_report.tsv"

printf 'id\tstatus\turl\toutput\n' > "$report"

url_encode() {
  printf '%s' "$1" | sed 's/ /%20/g'
}

find_direct_url() {
  local title="$1"
  local page_url="https://fireemblemwiki.org/wiki/$(url_encode "$title")"
  local page
  page="$(curl -L -s "$page_url")"

  printf '%s' "$page" \
    | rg -o 'https://cdn\.fireemblemwiki\.org/[0-9a-f]/[0-9a-f]{2}/[^" ]+\.(png|jpg|jpeg)' \
    | rg -i 'FETH|FE16|Three_Houses|Death|Flame|Kostas|Solon|Kronya|Thales|Nemesis' \
    | rg -vi 'Small_portrait|Rank|Skill|Is_fe16|Icon|Map|Mini|Sprite|voice_credits|bond_ring|inheritance' \
    | head -1
}

tail -n +2 "$targets" | while IFS=$'\t' read -r id wiki_title character_root stage; do
  out_dir="$character_root/references/official_local/$stage"
  out="$out_dir/fireemblemwiki_main.png"
  mkdir -p "$out_dir"

  case "$id" in
    Byleth) url="https://cdn.fireemblemwiki.org/6/6a/FETH_Byleth_m_f.png" ;;
    Linhardt) url="https://cdn.fireemblemwiki.org/c/c7/FETH_Linhardt_01.png" ;;
    Dimitri) url="https://cdn.fireemblemwiki.org/4/48/FETH_Dimitri_02.png" ;;
    Claude) url="https://cdn.fireemblemwiki.org/2/26/FETH_Claude_02.png" ;;
    Lorenz) url="https://cdn.fireemblemwiki.org/8/8d/FETH_Lorenz.png" ;;
    Jeritza) url="https://cdn.fireemblemwiki.org/f/f6/Portrait_jeritza_fewa2.png" ;;
    DeathKnight) url="https://cdn.fireemblemwiki.org/f/f6/Portrait_jeritza_fewa2.png" ;;
    FlameEmperor) url="https://cdn.fireemblemwiki.org/6/67/FETH_Flame_Emperor_01.png" ;;
    Solon) url="https://cdn.fireemblemwiki.org/5/59/FETH_Solon.png" ;;
    Nemesis) url="https://cdn.fireemblemwiki.org/1/1c/FETH_Nemesis_concept_art.png" ;;
    *) url="$(find_direct_url "$wiki_title" || true)" ;;
  esac
  if [[ -z "$url" ]]; then
    printf '%s\tmissing\t\t%s\n' "$id" "$out" | tee -a "$report"
    continue
  fi

  if curl -L -s "$url" -o "$out"; then
    printf '%s\tdownloaded\t%s\t%s\n' "$id" "$url" "$out" | tee -a "$report"
  else
    printf '%s\tfailed\t%s\t%s\n' "$id" "$url" "$out" | tee -a "$report"
  fi
done

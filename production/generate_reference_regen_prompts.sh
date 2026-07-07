#!/usr/bin/env bash
set -euo pipefail

targets="${1:-production/reference_targets.tsv}"

prompt_dir() {
  local root="$1"
  local stage="$2"

  case "$stage" in
    archbishop)
      printf '%s\n' "$root/academy"
      ;;
    concept|legacy_ep01)
      printf '%s\n' "$root"
      ;;
    *)
      printf '%s\n' "$root/$stage"
      ;;
  esac
}

selected_path() {
  local root="$1"
  local stage="$2"

  case "$stage" in
    professor)
      test -f "$root/professor/selected.png" && printf '%s\n' "$root/professor/selected.png" && return
      ;;
    dream)
      test -f "$root/dream/legacy_ep01/candidate_03.png" && printf '%s\n' "$root/dream/legacy_ep01/candidate_03.png" && return
      ;;
    mercenary)
      test -f "$root/mercenary/legacy_ep01/candidate_02.png" && printf '%s\n' "$root/mercenary/legacy_ep01/candidate_02.png" && return
      ;;
    archbishop)
      test -f "$root/academy/selected.png" && printf '%s\n' "$root/academy/selected.png" && return
      ;;
    concept|legacy_ep01)
      test -f "$root/selected.png" && printf '%s\n' "$root/selected.png" && return
      ;;
    *)
      test -f "$root/$stage/selected.png" && printf '%s\n' "$root/$stage/selected.png" && return
      ;;
  esac

  find "$root" -name selected.png -type f | sort | head -1
}

tail -n +2 "$targets" | while IFS=$'\t' read -r id wiki_title root stage; do
  official="$root/references/official_local/$stage/fireemblemwiki_main.png"
  current="$(selected_path "$root" "$stage")"
  dir="$(prompt_dir "$root" "$stage")"
  out="$dir/regeneration_prompt_from_reference.md"
  mkdir -p "$dir"

  cat > "$out" <<MD
# ${id} Reference-Based Regeneration Prompt

Use case: project character asset, live-action adaptation

Official reference image, local only:

\`${official}\`

Current generated candidate:

\`${current}\`

Primary request:

Create a new photorealistic live-action adaptation of ${id} from Fire Emblem: Three Houses. Use the official reference image as the source of truth for hair shape, costume silhouette, color blocking, accessories, and faction identity. Use the current generated candidate only as a quality baseline for cinematic realism, not as the design authority.

Fidelity requirements:

- Preserve the official hairstyle, hair color, eye color, and signature facial attitude.
- Preserve the official costume silhouette before inventing realistic fabric details.
- Keep the faction color language clear and readable.
- Translate game design into grounded live-action wardrobe, not generic medieval fantasy clothing.
- Keep age and era appropriate for the \`${stage}\` version.

Composition:

Cinematic half-body or three-quarter portrait, head-to-waist costume visible, natural realistic lighting, Garreg Mach or role-appropriate background, high detail on fabric, hair, and accessories.

Negative prompt:

anime, cartoon, plastic cosplay, generic fantasy noble, generic wizard robe, generic armor, wrong hair color, wrong haircut, missing signature accessories, adult version when academy version is requested, overdesigned jewelry, modern fashion, text, logo, watermark

Review checklist:

- Hair silhouette matches official reference.
- Main costume color blocks match official reference.
- Collar, shoulders, cape/mantle, belts, ornaments, and faction markers are recognizable.
- The image still feels like a real actor in a film still.
- It is more faithful than the current selected image.
MD

  printf '%s\n' "$out"
done

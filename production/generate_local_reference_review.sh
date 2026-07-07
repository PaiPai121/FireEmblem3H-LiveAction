#!/usr/bin/env bash
set -euo pipefail

targets="${1:-production/reference_targets.tsv}"
out="production/local_reference_review.html"

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

candidate_dir() {
  local root="$1"
  local stage="$2"

  case "$stage" in
    professor)
      printf '%s\n' "$root/professor/candidates_reference_v1"
      ;;
    dream)
      printf '%s\n' "$root/dream/candidates_reference_v1"
      ;;
    archbishop)
      printf '%s\n' "$root/academy/candidates_reference_v1"
      ;;
    concept|legacy_ep01)
      printf '%s\n' "$root/candidates_reference_v1"
      ;;
    *)
      printf '%s\n' "$root/$stage/candidates_reference_v1"
      ;;
  esac
}

cat > "$out" <<'HTML'
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Local Official Reference Review</title>
  <style>
    body { margin: 0; background: #f4f6f8; color: #20242a; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    header { position: sticky; top: 0; z-index: 1; padding: 20px 28px; background: rgba(244,246,248,.94); border-bottom: 1px solid #d9dee5; backdrop-filter: blur(12px); }
    h1 { margin: 0 0 6px; font-size: 28px; }
    p { margin: 0; color: #66717d; }
    main { display: grid; gap: 18px; padding: 24px 28px 56px; }
    article { display: grid; grid-template-columns: 160px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; padding: 14px; background: white; border: 1px solid #d9dee5; border-radius: 8px; }
    h2 { margin: 0 0 8px; font-size: 18px; }
    .meta { color: #66717d; font-size: 13px; }
    .panel { display: grid; gap: 8px; }
    .label { font-size: 12px; font-weight: 800; color: #9c2f39; text-transform: uppercase; }
    img { display: block; width: 100%; max-height: 520px; object-fit: contain; background: #e5e9ee; border-radius: 6px; }
    code { color: #66717d; overflow-wrap: anywhere; font-size: 12px; }
    .missing { min-height: 160px; display: grid; place-items: center; background: #e5e9ee; border-radius: 6px; color: #66717d; font-size: 13px; }
    @media (max-width: 900px) { article { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
<header>
  <h1>本地官方参考对照</h1>
  <p>左侧为角色信息，后面依次为本地 official_local 参考、当前真人化候选、reference v1 最新候选。官方参考图不会发布到 GitHub Pages。</p>
</header>
<main>
HTML

tail -n +2 "$targets" | while IFS=$'\t' read -r id wiki_title root stage; do
  official="$root/references/official_local/$stage/fireemblemwiki_main.png"
  selected="$(selected_path "$root" "$stage")"
  candidates="$(candidate_dir "$root" "$stage")"
  cat >> "$out" <<HTML
  <article>
    <section>
      <h2>${id}</h2>
      <p class="meta">${wiki_title}</p>
      <p class="meta">stage: ${stage}</p>
    </section>
    <section class="panel">
      <div class="label">Official Reference</div>
      <img src="../${official}" alt="${id} official reference">
      <code>${official}</code>
    </section>
    <section class="panel">
      <div class="label">Current Candidate</div>
      <img src="../${selected}" alt="${id} current candidate">
      <code>${selected}</code>
    </section>
    <section class="panel">
      <div class="label">Reference V1</div>
      <div class="missing" data-candidates="../${candidates}" data-alt="${id} reference v1 candidate">Checking candidates...</div>
      <code data-candidate-path>No reference v1 candidate yet</code>
    </section>
  </article>
HTML
done

cat >> "$out" <<'HTML'
</main>
<script>
  async function imageExists(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = path + "?t=" + Date.now();
    });
  }

  async function hydrateCandidates() {
    const panels = document.querySelectorAll("[data-candidates]");
    for (const placeholder of panels) {
      const base = placeholder.dataset.candidates;
      const alt = placeholder.dataset.alt;
      const code = placeholder.parentElement.querySelector("[data-candidate-path]");
      let found = "";
      for (let i = 12; i >= 1; i -= 1) {
        const candidate = `${base}/candidate_${String(i).padStart(2, "0")}.png`;
        if (await imageExists(candidate)) {
          found = candidate;
          break;
        }
      }
      if (!found) {
        placeholder.textContent = "No reference v1 candidate yet";
        continue;
      }
      const img = document.createElement("img");
      img.src = found;
      img.alt = alt;
      placeholder.replaceWith(img);
      code.textContent = found.replace(/^\.\.\//, "");
    }
  }

  hydrateCandidates();
</script>
</body>
</html>
HTML

printf '%s\n' "$out"

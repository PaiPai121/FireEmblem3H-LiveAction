const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rosterPath = path.join(root, "six_star_roster_v0.json");
const roster = JSON.parse(fs.readFileSync(rosterPath, "utf8"));

const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function exists(filePath) {
  return fs.existsSync(filePath);
}

function listFilesRecursive(dir) {
  if (!exists(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function rel(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function readTextMaybe(filePath) {
  return exists(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function getCandidateGroups(operatorDir) {
  if (!exists(operatorDir)) return [];
  return fs
    .readdirSync(operatorDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("candidates"))
    .map((entry) => {
      const dir = path.join(operatorDir, entry.name);
      const images = listFilesRecursive(dir)
        .filter((file) => imageExt.has(path.extname(file).toLowerCase()))
        .sort()
        .map((file) => rel(file));
      const reviewPath = path.join(dir, "review.md");
      const review = readTextMaybe(reviewPath);
      const rejected = /Decision:\s*`?rejected`?/i.test(review);
      const blocked = /blocked_needs_reference|blocked_needs_revision/i.test(review);
      const monitorRequired = /Decision:\s*`?monitor_required`?|monitor_required/i.test(review);
      return {
        name: entry.name,
        path: rel(dir),
        images,
        review: exists(reviewPath) ? rel(reviewPath) : null,
        prompt: exists(path.join(dir, "prompt.md")) ? rel(path.join(dir, "prompt.md")) : null,
        notes: exists(path.join(dir, "notes.md")) ? rel(path.join(dir, "notes.md")) : null,
        rejected,
        blocked,
        monitorRequired,
      };
    })
    .filter((group) => group.images.length || group.review || group.prompt || group.notes)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function hasApprovedRealismReview(groups) {
  return groups.some((group) => {
    if (!group.review) return false;
    const reviewPath = path.join(root, group.review);
    const review = readTextMaybe(reviewPath);
    return /Decision:\s*`?approved_selected`?/i.test(review) &&
      /REALISM_STYLE_BIBLE|Realism|realism|wardrobe fitting|production wardrobe/i.test(review);
  });
}

function getReferenceImages(operatorDir) {
  const refDir = path.join(operatorDir, "references");
  return listFilesRecursive(refDir)
    .filter((file) => imageExt.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => rel(file));
}

function getPrimaryImage(operatorDir, groups) {
  const selected = path.join(operatorDir, "selected.png");
  if (exists(selected)) {
    return {
      src: rel(selected),
      kind: hasApprovedRealismReview(groups) ? "selected" : "selected_missing_realism_gate",
    };
  }

  const usableGroups = groups.filter((group) => !group.rejected && group.images.length);
  if (usableGroups.length) {
    const latest = usableGroups[usableGroups.length - 1];
    return { src: latest.images[latest.images.length - 1], kind: "candidate" };
  }

  const rejectedGroups = groups.filter((group) => group.rejected && group.images.length);
  if (rejectedGroups.length) {
    const latest = rejectedGroups[rejectedGroups.length - 1];
    return { src: latest.images[latest.images.length - 1], kind: "rejected" };
  }

  return { src: null, kind: "none" };
}

function inferStatus(operatorDir, groups, references) {
  if (exists(path.join(operatorDir, "selected.png"))) {
    return hasApprovedRealismReview(groups) ? "selected" : "selected_missing_realism_gate";
  }
  if (groups.some((group) => !group.rejected && group.images.length && group.monitorRequired)) return "candidate_monitor_required";
  if (groups.some((group) => !group.rejected && group.blocked)) return "candidate_blocked_revision";
  if (groups.some((group) => !group.rejected && group.images.length) && !references.length) return "candidate_blocked_reference";
  if (groups.some((group) => !group.rejected && group.images.length)) return "candidate";
  if (groups.some((group) => group.rejected)) return "rejected";
  if (!references.length) return "needs_reference";
  return "scaffolded";
}

const operators = roster.operators.map((item) => {
  const operatorDir = path.join(root, item.slug);
  const groups = getCandidateGroups(operatorDir);
  const references = getReferenceImages(operatorDir);
  const primary = getPrimaryImage(operatorDir, groups);
  const status = inferStatus(operatorDir, groups, references);
  return {
    rank: item.popularity_rank_v0,
    operator: item.operator,
    slug: item.slug,
    rarity: item.rarity,
    status,
    primaryImage: primary.src,
    primaryImageKind: primary.kind,
    beautyTypeSeed: item.beauty_type_seed,
    rankingStatus: item.ranking_status,
    sourceStatus: item.source_status,
    directory: item.slug,
    links: {
      readme: exists(path.join(operatorDir, "README.md")) ? `${item.slug}/README.md` : null,
      identityLocks: exists(path.join(operatorDir, "identity_locks.md")) ? `${item.slug}/identity_locks.md` : null,
      usageNotes: exists(path.join(operatorDir, "usage_notes.md")) ? `${item.slug}/usage_notes.md` : null,
      references: exists(path.join(operatorDir, "references")) ? `${item.slug}/references/` : null,
    },
    references,
    candidateGroups: groups,
  };
});

const stats = operators.reduce(
  (acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  },
  { total: 0, selected: 0, selected_missing_realism_gate: 0, candidate: 0, candidate_monitor_required: 0, candidate_blocked_reference: 0, candidate_blocked_revision: 0, rejected: 0, needs_reference: 0, scaffolded: 0 }
);

const manifest = {
  schema: "arknights_live_action_asset_manifest_v1",
  generatedAt: new Date().toISOString(),
  root: "assets/characters/arknights_live_action",
  qaPolicy: {
    referenceGate: "Do not generate or promote named operator candidates without approved visual references.",
    castingStyleBible: "CASTING_STYLE_BIBLE.md",
    realismStyleBible: "REALISM_STYLE_BIBLE.md",
    promotionRule: "Only selected.png is treated as production-ready, and only after reference, costume, face-diversity, realism, artifact, and downstream-usability QA. Candidate and rejected images must not enter downstream video packages.",
    rejectedRule: "Rejected material may be displayed only as a negative reference.",
  },
  roster: {
    count: roster.count,
    rankingSource: roster.ranking_source,
    rosterSourceStatus: roster.roster_source_status,
  },
  stats,
  operators,
};

fs.writeFileSync(path.join(root, "asset_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const statusLabels = {
  selected: "Selected",
  selected_missing_realism_gate: "Selected, realism unverified",
  candidate: "Candidate",
  candidate_monitor_required: "Candidate, monitor",
  candidate_blocked_reference: "Candidate, needs reference",
  candidate_blocked_revision: "Candidate, needs revision",
  rejected: "Rejected",
  needs_reference: "Needs reference",
  scaffolded: "Scaffolded",
};

const embeddedManifestJson = JSON.stringify(manifest).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Arknights Live-Action Asset Panel</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f2ec;
      --ink: #1e1f21;
      --muted: #68615a;
      --line: #d8d0c4;
      --panel: #fffaf2;
      --panel-strong: #f0e5d7;
      --accent: #b7332f;
      --accent-ink: #fff;
      --ok: #2f7d59;
      --warn: #b07320;
      --bad: #a82d38;
      --blocked: #8d4a20;
      --neutral: #646a72;
      --shadow: 0 10px 24px rgba(33, 28, 21, 0.12);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
    }

    a { color: inherit; }

    header {
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--line);
      background: rgba(245, 242, 236, 0.96);
      backdrop-filter: blur(14px);
    }

    .shell {
      width: min(1440px, calc(100% - 32px));
      margin: 0 auto;
    }

    .topbar {
      display: grid;
      grid-template-columns: minmax(240px, 1fr) auto;
      gap: 18px;
      align-items: center;
      padding: 18px 0;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      line-height: 1.15;
      letter-spacing: 0;
    }

    .subtitle {
      margin-top: 6px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }

    .controls {
      display: grid;
      grid-template-columns: minmax(220px, 320px) auto auto;
      gap: 10px;
      align-items: center;
    }

    input, select {
      min-height: 40px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fffdf8;
      color: var(--ink);
      padding: 0 12px;
      font: inherit;
    }

    main {
      padding: 22px 0 40px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-bottom: 18px;
    }

    .stat {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 12px 14px;
      min-height: 76px;
    }

    .stat strong {
      display: block;
      font-size: 24px;
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat span {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .notice {
      border: 1px solid #d9b6a9;
      border-left: 4px solid var(--accent);
      border-radius: 8px;
      background: #fff7ef;
      padding: 14px 16px;
      margin-bottom: 18px;
      color: #4a2b25;
      font-size: 14px;
      line-height: 1.5;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .card {
      display: grid;
      grid-template-rows: 280px auto;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
    }

    .thumb {
      position: relative;
      display: grid;
      place-items: center;
      background: #e7ded2;
      border-bottom: 1px solid var(--line);
      min-height: 280px;
    }

    .thumb img {
      width: calc(100% - 18px);
      height: calc(100% - 18px);
      object-fit: contain;
      display: block;
      cursor: zoom-in;
    }

    .placeholder {
      width: 76%;
      min-height: 150px;
      display: grid;
      place-items: center;
      border: 1px dashed #b7aca0;
      border-radius: 8px;
      color: var(--muted);
      text-align: center;
      padding: 16px;
      font-size: 13px;
      line-height: 1.45;
    }

    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      border-radius: 999px;
      color: white;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
    }

    .selected { background: var(--ok); }
    .selected_missing_realism_gate { background: #6a4b9a; }
    .candidate { background: var(--warn); }
    .candidate_monitor_required { background: #6f6d25; }
    .candidate_blocked_reference { background: #9a6822; }
    .candidate_blocked_revision { background: var(--blocked); }
    .rejected { background: var(--bad); }
    .needs_reference { background: var(--neutral); }
    .scaffolded { background: #827568; }

    .body {
      display: grid;
      gap: 10px;
      padding: 13px;
    }

    .titleline {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }

    .titleline h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
      letter-spacing: 0;
    }

    .rank {
      flex: 0 0 auto;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .seed {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
      min-height: 38px;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: #fffdf8;
      padding: 5px 8px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      min-height: 28px;
    }

    .links a, .small-button {
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel-strong);
      color: var(--ink);
      padding: 6px 8px;
      font-size: 12px;
      line-height: 1;
      text-decoration: none;
      cursor: pointer;
    }

    dialog {
      width: min(1100px, calc(100% - 24px));
      border: 0;
      border-radius: 8px;
      padding: 0;
      background: #171717;
      color: #fff;
      box-shadow: var(--shadow);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.72);
    }

    .modal-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    }

    .modal-head button {
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 6px;
      background: transparent;
      color: white;
      padding: 8px 10px;
      cursor: pointer;
    }

    .modal-image {
      display: block;
      width: 100%;
      max-height: 78vh;
      object-fit: contain;
      background: #111;
    }

    @media (max-width: 820px) {
      .topbar, .controls {
        grid-template-columns: 1fr;
      }

      .stats {
        grid-template-columns: repeat(2, minmax(130px, 1fr));
      }

      .card {
        grid-template-rows: 230px auto;
      }

      .thumb {
        min-height: 230px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="shell topbar">
      <div>
        <h1>Arknights Live-Action Asset Panel</h1>
        <div class="subtitle">Six-star operator asset ledger. Reference, costume, face-diversity, and real-actor wardrobe realism gates are enforced before selected.png promotion.</div>
      </div>
      <div class="controls">
        <input id="search" type="search" placeholder="Search operator, status, note">
        <select id="view-mode">
          <option value="active" selected>Active review</option>
          <option value="all">All operators</option>
        </select>
        <select id="status">
          <option value="all">All statuses</option>
          ${Object.entries(statusLabels).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}
        </select>
      </div>
    </div>
  </header>

  <main class="shell">
    <section class="stats" id="stats"></section>
    <section class="notice">
      QA Gate: no named operator may be promoted without approved visual references, official-costume checks, distinct young-adult casting, and real-actor wardrobe realism. Pretty AI/cosplay poster images are monitor or rejected, not production locks.
    </section>
    <section class="grid" id="grid"></section>
  </main>

  <dialog id="viewer">
    <div class="modal-head">
      <div id="viewer-title"></div>
      <button id="close-viewer" type="button">Close</button>
    </div>
    <img class="modal-image" id="viewer-image" alt="">
  </dialog>

  <script id="asset-data" type="application/json">${embeddedManifestJson}</script>
  <script>
    const data = JSON.parse(document.getElementById("asset-data").textContent);
    const labels = ${JSON.stringify(statusLabels)};
    const grid = document.getElementById("grid");
    const stats = document.getElementById("stats");
    const search = document.getElementById("search");
    const viewMode = document.getElementById("view-mode");
    const statusFilter = document.getElementById("status");
    const viewer = document.getElementById("viewer");
    const viewerImage = document.getElementById("viewer-image");
    const viewerTitle = document.getElementById("viewer-title");

    function renderStats(items) {
      const live = items.reduce((acc, item) => {
        acc.total += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, { total: 0, selected: 0, selected_missing_realism_gate: 0, candidate: 0, rejected: 0, needs_reference: 0, scaffolded: 0 });

      stats.innerHTML = [
        ["total", "Visible"],
        ["selected", "Selected"],
        ["selected_missing_realism_gate", "Selected, realism unverified"],
        ["candidate", "Candidate"],
        ["candidate_monitor_required", "Candidate, monitor"],
        ["candidate_blocked_reference", "Candidate, needs reference"],
        ["candidate_blocked_revision", "Candidate, needs revision"],
        ["rejected", "Rejected"],
        ["needs_reference", "Needs reference"],
      ].map(([key, label]) => \`
        <div class="stat">
          <strong>\${live[key] || 0}</strong>
          <span>\${label}</span>
        </div>
      \`).join("");
    }

    function link(label, href) {
      return href ? \`<a href="\${href}">\${label}</a>\` : "";
    }

    function card(item) {
      const image = item.primaryImage
        ? \`<img src="\${item.primaryImage}" alt="\${item.operator}" data-view-image="\${item.primaryImage}" data-title="\${item.operator}">\`
        : \`<div class="placeholder">No approved reference or candidate image yet.</div>\`;
      const groupCount = item.candidateGroups.length;
      const blockedCount = item.candidateGroups.filter(group => group.blocked).length;
      const refCount = item.references.length;
      const statusLabel = labels[item.status] || item.status;
      return \`
        <article class="card" data-search="\${[
          item.operator,
          item.slug,
          item.status,
          item.beautyTypeSeed,
          item.sourceStatus,
          item.rankingStatus
        ].join(" ").toLowerCase()}">
          <div class="thumb">
            \${image}
            <span class="badge \${item.status}">\${statusLabel}</span>
          </div>
          <div class="body">
            <div class="titleline">
              <h2>\${item.operator}</h2>
              <span class="rank">#\${item.rank}</span>
            </div>
            <div class="seed">\${item.beautyTypeSeed}</div>
            <div class="meta">
              <span class="pill">\${refCount} reference\${refCount === 1 ? "" : "s"}</span>
              <span class="pill">\${groupCount} candidate set\${groupCount === 1 ? "" : "s"}</span>
              \${blockedCount ? \`<span class="pill">\${blockedCount} blocked review\${blockedCount === 1 ? "" : "s"}</span>\` : ""}
              <span class="pill">\${item.primaryImageKind}</span>
            </div>
            <div class="links">
              \${link("README", item.links.readme)}
              \${link("Identity", item.links.identityLocks)}
              \${link("Usage", item.links.usageNotes)}
              \${link("References", item.links.references)}
              \${item.candidateGroups.map(group => link(group.name, group.path + "/")).join("")}
            </div>
          </div>
        </article>
      \`;
    }

    function visibleItems() {
      const q = search.value.trim().toLowerCase();
      const status = statusFilter.value;
      const mode = viewMode.value;
      return data.operators.filter((item) => {
        if (mode === "active") {
          const active = item.status !== "needs_reference" || item.references.length || item.candidateGroups.length;
          if (!active) return false;
        }
        if (status !== "all" && item.status !== status) return false;
        if (!q) return true;
        const haystack = [
          item.operator,
          item.slug,
          item.status,
          item.beautyTypeSeed,
          item.rankingStatus,
          item.sourceStatus
        ].join(" ").toLowerCase();
        return haystack.includes(q);
      });
    }

    function render() {
      const items = visibleItems();
      renderStats(items);
      grid.innerHTML = items.map(card).join("");
    }

    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-view-image]");
      if (!target) return;
      viewerImage.src = target.dataset.viewImage;
      viewerImage.alt = target.dataset.title;
      viewerTitle.textContent = target.dataset.title;
      viewer.showModal();
    });

    document.getElementById("close-viewer").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) viewer.close();
    });
    search.addEventListener("input", render);
    viewMode.addEventListener("change", render);
    statusFilter.addEventListener("change", render);

    render();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);

console.log(JSON.stringify({ manifest: rel(path.join(root, "asset_manifest.json")), html: rel(path.join(root, "index.html")), stats }, null, 2));

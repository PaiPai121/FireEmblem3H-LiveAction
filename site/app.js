const data = window.ASSET_REVIEW_DATA;

const factionNames = {
  protagonist: "主角",
  black_eagles: "黑鹫",
  blue_lions: "青狮",
  golden_deer: "金鹿",
  church_of_seiros: "赛罗司教会",
  divine: "神性 / 梦境",
  antagonists: "反派",
  extras: "群众",
};

const eraNames = {
  academy: "学院篇",
  war: "战争篇",
  professor: "导师",
  enlightened: "觉醒导师",
  emperor: "皇帝",
  king: "国王",
  leader: "盟主",
  war_broken: "崩坏战争篇",
  dream: "梦境",
  concept: "概念版",
  legacy_ep01: "EP01 旧版"
};

const state = {
  view: "characters",
  query: "",
  faction: "all",
  era: "all",
  status: "all"
};

const els = {
  search: document.querySelector("#searchInput"),
  faction: document.querySelector("#factionFilter"),
  era: document.querySelector("#eraFilter"),
  status: document.querySelector("#statusFilter"),
  stats: document.querySelector("#stats"),
  grid: document.querySelector("#characterGrid"),
  episodeFeature: document.querySelector("#episodeFeature"),
  shotList: document.querySelector("#shotList"),
  docsList: document.querySelector("#docsList"),
  dialog: document.querySelector("#previewDialog"),
  previewImage: document.querySelector("#previewImage"),
  previewTitle: document.querySelector("#previewTitle"),
  previewPath: document.querySelector("#previewPath")
};

function normalizeCharacter(row) {
  const [id, nameZh, faction, era, path] = row;
  return { id, nameZh, faction, era, path, status: "selected" };
}

const characters = data.characters.map(normalizeCharacter);

function uniqueOptions(items, key, labelMap) {
  const values = [...new Set(items.map((item) => item[key]))].sort();
  return [["all", "全部"], ...values.map((value) => [value, labelMap[value] || value])];
}

function fillSelect(select, options) {
  select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

function cardTemplate(item) {
  const faction = factionNames[item.faction] || item.faction;
  const era = eraNames[item.era] || item.era;
  return `
    <article class="asset-card">
      <button class="image-button" type="button" data-preview="${item.path}" data-title="${item.nameZh} / ${item.id}" data-path="${item.path}">
        <img src="${item.path}" alt="${item.nameZh} ${era}" loading="lazy">
      </button>
      <div class="card-body">
        <div>
          <h3>${item.nameZh}</h3>
          <p>${item.id}</p>
        </div>
        <div class="chips">
          <span>${faction}</span>
          <span>${era}</span>
        </div>
        <a class="path" href="${item.path}" target="_blank" rel="noreferrer">${item.path}</a>
      </div>
    </article>
  `;
}

function matches(item) {
  const text = `${item.id} ${item.nameZh} ${item.faction} ${item.era} ${item.path}`.toLowerCase();
  return (!state.query || text.includes(state.query))
    && (state.faction === "all" || item.faction === state.faction)
    && (state.era === "all" || item.era === state.era)
    && (state.status === "all" || item.status === state.status);
}

function renderStats(filtered) {
  const factions = new Set(filtered.map((item) => item.faction)).size;
  const eras = new Set(filtered.map((item) => item.era)).size;
  els.stats.innerHTML = `
    <div><strong>${filtered.length}</strong><span>当前素材</span></div>
    <div><strong>${characters.length}</strong><span>角色图总数</span></div>
    <div><strong>${factions}</strong><span>当前阵营</span></div>
    <div><strong>${eras}</strong><span>当前阶段</span></div>
  `;
}

function renderCharacters() {
  const filtered = characters.filter(matches);
  renderStats(filtered);
  els.grid.innerHTML = filtered.length
    ? filtered.map(cardTemplate).join("")
    : `<p class="empty">没有匹配的素材。</p>`;
}

function renderEpisode() {
  els.episodeFeature.innerHTML = data.episodeAssets.map((item) => `
    <article class="feature-item">
      <button class="image-button" type="button" data-preview="${item.path}" data-title="${item.label}" data-path="${item.path}">
        <img src="${item.path}" alt="${item.label}" loading="lazy">
      </button>
      <div>
        <p class="eyebrow">${item.title}</p>
        <h3>${item.label}</h3>
        <p>${item.note}</p>
        <a href="${item.path}" target="_blank" rel="noreferrer">${item.path}</a>
      </div>
    </article>
  `).join("");

  els.shotList.innerHTML = data.shots.map(([shot, duration, purpose, path]) => `
    <a class="shot-row" href="${path}" target="_blank" rel="noreferrer">
      <strong>${shot}</strong>
      <span>${duration}</span>
      <p>${purpose}</p>
    </a>
  `).join("");
}

function renderDocs() {
  els.docsList.innerHTML = data.documents.map(([title, path]) => `
    <a class="doc-row" href="${path}" target="_blank" rel="noreferrer">
      <strong>${title}</strong>
      <span>${path}</span>
    </a>
  `).join("");
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${view}View`);
  });
}

function openPreview(path, title) {
  els.previewImage.src = path;
  els.previewImage.alt = title;
  els.previewTitle.textContent = title;
  els.previewPath.textContent = path;
  els.dialog.showModal();
}

fillSelect(els.faction, uniqueOptions(characters, "faction", factionNames));
fillSelect(els.era, uniqueOptions(characters, "era", eraNames));
renderCharacters();
renderEpisode();
renderDocs();

els.search.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  renderCharacters();
});
els.faction.addEventListener("change", (event) => {
  state.faction = event.target.value;
  renderCharacters();
});
els.era.addEventListener("change", (event) => {
  state.era = event.target.value;
  renderCharacters();
});
els.status.addEventListener("change", (event) => {
  state.status = event.target.value;
  renderCharacters();
});
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preview]");
  if (!button) return;
  openPreview(button.dataset.preview, button.dataset.title);
});
document.querySelector("#closeDialog").addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", (event) => {
  if (event.target === els.dialog) els.dialog.close();
});

const fs = require("fs");
const path = require("path");

const outputDir = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21";
const queuePath = path.join(outputDir, "frame_generation_queue.json");
const rosterPath = path.join(outputDir, "roster_continuity_by_shot.json");
const markdownPath = "episodes/EP02/scene09_roster_continuity_2026-07-23.md";
const shotListPath = "episodes/EP02/scene09_shot_list_v2_2026-07-21.md";

const houses = {
  blue_lions: ["Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid"],
  black_eagles: ["Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta"],
  golden_deer: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  faculty: ["Hanneman", "Manuela"],
  command: ["Byleth"],
};

const houseLabels = {
  blue_lions: "青狮",
  black_eagles: "黑鹫",
  golden_deer: "金鹿",
  faculty: "教师裁定",
  command: "贝雷特",
};

const statusLabels = {
  active: "可继续行动",
  standby: "待命/未入线",
  hidden_active: "隐蔽可行动",
  objective_control: "控制目标/裁定中",
  engaged: "交战中",
  pressured: "受压但未退场",
  contained: "被路线封住但未退场",
  displaced: "离开原位置但未退场",
  restored: "恢复战线",
  checked: "被克制提醒但未退场",
  surviving_winner_exhausted: "胜者核心/疲惫但未退场",
  spent_stood_down: "出力耗尽/收手退场",
  objective_displaced: "离开目标纹/目标判定失守",
  captured: "被俘/模拟战判定退场",
  captor: "押俘/控制俘虏",
  stood_down: "哨响后收武器退场",
  post_battle: "赛后可见但不再参战",
};

const allNames = Object.values(houses).flat();

function initialState() {
  const state = new Map();
  for (const name of allNames) state.set(name, "standby");
  for (const name of houses.blue_lions) state.set(name, "active");
  for (const name of houses.black_eagles) state.set(name, "active");
  for (const name of houses.golden_deer) state.set(name, "active");
  for (const name of houses.faculty) state.set(name, "objective_control");
  state.set("Byleth", "active");
  return state;
}

const events = {
  Shot025: {
    note: "规则与胜利条件建立；所有学生仍可行动，教师控制治疗纹目标。",
    updates: {},
  },
  Shot025A: {
    note: "纯地理镜头；仅确认三方起始区域和目标，不改变角色状态。",
    updates: {},
  },
  Shot026: {
    note: "青狮听取分工；无人退场。",
    updates: {},
  },
  Shot026B: {
    note: "青狮读场并转向目标；无人退场。",
    updates: {},
  },
  Shot026C: {
    note: "青狮分线启动；菲力克斯仍在阵线后方，未越线。",
    updates: {
      Dimitri: "engaged",
      Dedue: "engaged",
      Felix: "active",
      Ashe: "active",
      Annette: "active",
      Mercedes: "active",
      Sylvain: "active",
      Ingrid: "active",
    },
  },
  Shot027: {
    note: "阿修取得观察点；克劳德隐蔽可行动。",
    updates: {
      Ashe: "active",
      Claude: "hidden_active",
    },
  },
  Shot027B: {
    note: "黑鹫入线并保持完整阵形。",
    updates: {
      Edelgard: "engaged",
      Hubert: "engaged",
      Ferdinand: "engaged",
      Dorothea: "engaged",
    },
  },
  Shot027C: {
    note: "中央第一次接触；费尔迪南特后退半步但仍稳住阵线。",
    updates: {
      Dimitri: "engaged",
      Dedue: "engaged",
      Ferdinand: "pressured",
      Edelgard: "engaged",
      Hubert: "engaged",
    },
  },
  Shot027D: {
    note: "菲力克斯被贝雷特口令延迟，未切过头；费尔迪南特仍可回防。",
    updates: {
      Felix: "checked",
      Ferdinand: "engaged",
    },
  },
  Shot028: {
    note: "雅妮特和梅尔塞德斯被弓线迫低，但仍在支援线内。",
    updates: {
      Annette: "pressured",
      Mercedes: "pressured",
      Ignatz: "hidden_active",
    },
  },
  Shot028B: {
    note: "黑鹫稳定中央；帝弥托利/杜笃受阻但没有退场。",
    updates: {
      Edelgard: "engaged",
      Hubert: "engaged",
      Dorothea: "engaged",
      Dimitri: "pressured",
      Dedue: "pressured",
    },
  },
  Shot028C: {
    note: "菲力克斯看到路线但被贝雷特按住；他仍可行动，不能单独越线。",
    updates: {
      Felix: "checked",
      Ferdinand: "engaged",
      Dedue: "engaged",
    },
  },
  Shot029: {
    note: "西侧压力出现；希尔凡和英谷莉特转为侧翼守线。",
    updates: {
      Sylvain: "engaged",
      Ingrid: "engaged",
      Hilda: "engaged",
      Lorenz: "engaged",
    },
  },
  Shot029C: {
    note: "克劳德读出两边空隙；他仍是隐蔽指挥位。",
    updates: {
      Claude: "hidden_active",
      Ashe: "active",
      Edelgard: "engaged",
    },
  },
  Shot029D: {
    note: "阿修观察点被非致命箭线驱离；阿修离开高点但未出局。雷欧尼按已完成视频设定进入黑鹫后排绕后线。",
    updates: {
      Ashe: "displaced",
      Claude: "hidden_active",
      Leonie: "hidden_active",
    },
  },
  Shot029B: {
    note: "金鹿全线施压，同时影响青狮和黑鹫；金鹿全员仍可行动。",
    updates: {
      Claude: "engaged",
      Hilda: "engaged",
      Lorenz: "engaged",
      Ignatz: "engaged",
      Sylvain: "pressured",
      Ingrid: "pressured",
    },
  },
  Shot030: {
    note: "菲力克斯有过度前插风险，被贝雷特预判拦截。",
    updates: {
      Felix: "checked",
      Ferdinand: "engaged",
    },
  },
  Shot030B: {
    note: "菲力克斯触线被贝雷特身体/手势切断路线；未退场。",
    updates: {
      Felix: "checked",
    },
  },
  Shot030C: {
    note: "伊古纳兹封路线，雅妮特/梅尔塞德斯和黑鹫侧路都被迫调整但仍可行动；多洛和贝尔处于金鹿绕后压力下。",
    updates: {
      Ignatz: "engaged",
      Annette: "pressured",
      Mercedes: "pressured",
      Dorothea: "pressured",
      Bernadetta: "pressured",
      Leonie: "hidden_active",
    },
  },
  Shot031: {
    note: "贝雷特正式制止菲力克斯；菲力克斯被约束在队形内。",
    updates: {
      Felix: "checked",
      Byleth: "active",
    },
  },
  Shot031B: {
    note: "贝雷特双线指挥；青狮前线与侧翼都继续运作。",
    updates: {
      Dimitri: "engaged",
      Dedue: "engaged",
      Sylvain: "engaged",
      Ingrid: "engaged",
      Annette: "active",
      Mercedes: "active",
      Byleth: "active",
    },
  },
  Shot032: {
    note: "杜笃短暂受压，梅尔塞德斯治疗后盾线恢复；梅尔塞德斯完成高光后耗尽支援线，不再主动参战。",
    updates: {
      Dedue: "restored",
      Mercedes: "spent_stood_down",
      Dimitri: "engaged",
      Ferdinand: "engaged",
      Hubert: "engaged",
    },
  },
  Shot032A: {
    note: "雅妮特造尘掩护，阿修重新取得弓线；克劳德被迫移动但仍可行动。",
    updates: {
      Annette: "spent_stood_down",
      Ashe: "active",
      Mercedes: "spent_stood_down",
      Claude: "displaced",
    },
  },
  Shot032B: {
    note: "帝弥托利/杜笃抵达平台下方；教师仍控制目标。",
    updates: {
      Dimitri: "engaged",
      Dedue: "engaged",
      Hanneman: "objective_control",
      Manuela: "objective_control",
    },
  },
  Shot032C: {
    note: "黑鹫反压金鹿；金鹿被压缩但不退场。",
    updates: {
      Edelgard: "engaged",
      Hubert: "engaged",
      Dorothea: "engaged",
      Claude: "pressured",
      Hilda: "pressured",
    },
  },
  Shot032D: {
    note: "三线互相压缩；三学级仍势均力敌，没人被判出局。",
    updates: {
      Dimitri: "engaged",
      Edelgard: "engaged",
      Claude: "engaged",
      Byleth: "active",
    },
  },
  Shot032E: {
    note: "贝雷特利用混战窗口转向目标；黑鹫和金鹿互相牵制，青狮获得切向教师目标的短窗口。此镜头只建立窗口，不判定黑鹫后排退场。",
    updates: {
      Byleth: "active",
      Dimitri: "engaged",
      Edelgard: "pressured",
      Claude: "pressured",
      Hilda: "pressured",
      Hubert: "pressured",
      Dorothea: "pressured",
      Bernadetta: "pressured",
      Leonie: "hidden_active",
    },
    result: "目标窗口成立；休伯特、多洛、贝尔仍需后续插入镜头证明其模拟战退场，不能只靠状态文字直接消失。",
  },
  Shot032F: {
    note: "菲力克斯和阿修联手切断休伯特施法角度；休伯特被迫举手/后撤，按模拟战规则退场。",
    updates: {
      Hubert: "captured",
      Felix: "captor",
      Ashe: "captor",
    },
    result: "此后休伯特不得再作为主动战斗者出现；只能作为被控制、离场或赛后反应出现。",
  },
  Shot032G: {
    note: "雷欧尼和库罗德从金鹿绕后线控制多洛缇雅、贝尔；两人被迫收手退场，但黑鹫整体仍由艾黛尔贾特和费尔迪南特维持正面尊严。",
    updates: {
      Claude: "captor",
      Dorothea: "captured",
      Bernadetta: "captured",
      Leonie: "captor",
    },
    result: "此后多洛缇雅、贝尔不得再作为主动战斗者出现；只能作为被控制、离场或赛后反应出现。",
  },
  Shot033: {
    note: "帝弥托利接近目标但接受贝雷特克制信号；未失控，未退场。",
    updates: {
      Dimitri: "checked",
      Dedue: "engaged",
      Hanneman: "objective_control",
    },
  },
  Shot033B: {
    note: "贝雷特下达切教师目标；青狮分三路切入。",
    updates: {
      Byleth: "active",
      Ashe: "active",
      Ingrid: "engaged",
      Felix: "engaged",
      Hanneman: "objective_control",
      Manuela: "objective_control",
    },
  },
  Shot033C: {
    note: "阿修封住汉尼曼施法角度，完成自己的高光后收弓退线；汉尼曼被压制但仍未离开目标纹。",
    updates: {
      Ashe: "spent_stood_down",
      Hanneman: "contained",
    },
  },
  Shot033D: {
    note: "英谷莉特和希尔凡切断玛努艾拉回纹路线，完成侧翼高光后收手退线；玛努艾拉被封路线但未受伤。",
    updates: {
      Ingrid: "spent_stood_down",
      Manuela: "contained",
      Sylvain: "spent_stood_down",
    },
  },
  Shot034C: {
    note: "菲力克斯封住费尔迪南特回援路线，随后收剑退出主动战斗；费尔迪南特被挡住但保持站姿。",
    updates: {
      Felix: "spent_stood_down",
      Ferdinand: "contained",
    },
  },
  Shot034D: {
    note: "贝雷特打断汉尼曼施法判定；汉尼曼即将离开目标纹。",
    updates: {
      Byleth: "engaged",
      Hanneman: "objective_displaced",
    },
  },
  Shot034B: {
    note: "贝雷特和帝弥托利只在汉尼曼自己的教师目标线确认判定；汉尼曼可见但已失去目标控制，玛努艾拉在另一条教师线被切断路线且不入画，绝不与汉尼曼并肩成组。",
    updates: {
      Hanneman: "objective_displaced",
      Manuela: "objective_displaced",
      Dimitri: "engaged",
      Byleth: "active",
    },
    result: "青狮目标胜利成立；034B 画面只允许贝雷特、帝弥托利、汉尼曼三名可读人物，接下来所有学生应进入收武器/退场状态，不再新增主动攻击。",
  },
  Shot034E: {
    note: "金鹿有序收弓/收斧/停步；库罗德和雷欧尼保持对多洛、贝尔的俘虏控制，不再主动进攻。",
    updates: {
      Claude: "stood_down",
      Hilda: "stood_down",
      Lorenz: "stood_down",
      Ignatz: "stood_down",
      Leonie: "stood_down",
    },
  },
  Shot034F: {
    note: "黑鹫确认教师离纹后有序收手；休伯特、多洛、贝尔已按前述设定被俘，不能被镜头重置为普通主动队形成员。",
    updates: {
      Edelgard: "stood_down",
      Ferdinand: "stood_down",
    },
  },
  Shot034G: {
    note: "青狮惨胜但不全员回场：贝雷特、帝弥托利、杜笃是仍可读的胜者核心，其余青狮学生保持收手退场。",
    updates: {
      Byleth: "active",
      Dimitri: "surviving_winner_exhausted",
      Dedue: "surviving_winner_exhausted",
      Felix: "stood_down",
      Ashe: "stood_down",
      Annette: "stood_down",
      Mercedes: "stood_down",
      Sylvain: "stood_down",
      Ingrid: "stood_down",
    },
  },
  Shot034: {
    note: "全场进入赛后状态；三学级和教师都可见但不再参战，被俘结果继续保留到后续剧情。",
    updates: {
      ...Object.fromEntries(allNames.map((name) => [name, "post_battle"])),
      Hubert: "captured",
      Dorothea: "captured",
      Bernadetta: "captured",
    },
  },
  Shot035: {
    note: "赛后菲力克斯和贝雷特对话；其他人不得作为 active 战斗者重新入场。",
    updates: {
      Felix: "post_battle",
      Byleth: "post_battle",
    },
  },
  Shot036: {
    note: "赛后帝弥托利收束情绪；其他人仍保持赛后/离场状态。",
    updates: {
      Dimitri: "post_battle",
      Byleth: "post_battle",
    },
  },
};

function byHouse(state, predicate) {
  return Object.fromEntries(Object.entries(houses).map(([house, names]) => [
    house,
    names.filter((name) => predicate(state.get(name), name)),
  ]));
}

function flattenByHouse(groups) {
  return Object.entries(groups)
    .filter(([, names]) => names.length)
    .map(([house, names]) => `${houseLabels[house]}: ${names.join(", ")}`)
    .join("; ");
}

function changedLabels(event) {
  const updates = event?.updates || {};
  return Object.entries(updates)
    .map(([name, status]) => `${name}: ${statusLabels[status] || status}`)
    .join("; ") || "无";
}

function toRosterEntry(item, state, event) {
  const activeStatuses = new Set(["active", "hidden_active", "objective_control", "engaged", "pressured", "contained", "displaced", "restored", "checked", "captor", "surviving_winner_exhausted"]);
  const limitedStatuses = new Set(["pressured", "contained", "displaced", "restored", "checked"]);
  const retiredStatuses = new Set(["spent_stood_down", "objective_displaced", "captured", "stood_down", "post_battle"]);
  const aliveByHouse = Object.fromEntries(Object.entries(houses).map(([house, names]) => [house, [...names]]));
  const activeByHouse = byHouse(state, (status) => activeStatuses.has(status));
  const limitedByHouse = byHouse(state, (status) => limitedStatuses.has(status));
  const retiredByHouse = byHouse(state, (status) => retiredStatuses.has(status));
  const capturedOrRuleDefeatedByHouse = byHouse(state, (status) => status === "captured" || status === "objective_displaced");
  const stoodDownOrPostBattleByHouse = byHouse(state, (status) => status === "stood_down" || status === "post_battle");
  const hasRetired = Object.values(retiredByHouse).some((names) => names.length);
  const statusByHouse = Object.fromEntries(Object.entries(houses).map(([house, names]) => [
    house,
    names.map((name) => ({
      name,
      status: state.get(name),
      label: statusLabels[state.get(name)] || state.get(name),
    })),
  ]));
  const changedThisShot = Object.entries(event?.updates || {}).map(([name, status]) => ({
    name,
    status,
    label: statusLabels[status] || status,
  }));
  const battleLedgerAfter = {
    rule_cn: "学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。",
    all_named_characters_alive: true,
    alive_by_house: aliveByHouse,
    still_active_or_controlling_objective_by_house: activeByHouse,
    limited_but_not_defeated_by_house: limitedByHouse,
    mock_battle_defeated_or_removed_by_house: retiredByHouse,
    captured_or_objective_defeated_by_house: capturedOrRuleDefeatedByHouse,
    stood_down_or_post_battle_by_house: stoodDownOrPostBattleByHouse,
    must_not_return_active_by_house: retiredByHouse,
    changed_this_shot: changedThisShot,
    note_cn: [
      `安全存活/非致命：${flattenByHouse(aliveByHouse) || "无"}`,
      `仍可主动参战/控制目标：${flattenByHouse(activeByHouse) || "无"}`,
      `受限但未败：${flattenByHouse(limitedByHouse) || "无"}`,
      `已击败/被俘/目标判负/退场，不可再主动战斗：${flattenByHouse(retiredByHouse) || "无"}`,
    ].join(" "),
  };
  const battleAfter = {
    all_named_characters_alive: true,
    alive_by_house: aliveByHouse,
    active_or_available_by_house: activeByHouse,
    limited_not_out_by_house: limitedByHouse,
    defeated_or_retired_by_rule_by_house: retiredByHouse,
    must_not_return_active_by_house: retiredByHouse,
    battle_ledger_after: battleLedgerAfter,
    changed_this_shot: changedThisShot,
    summary_cn: [
      "模拟战非致命，全部具名学生和教师生命安全；本账本只记录模拟战行动资格。",
      `仍可主动参战/控制目标：${flattenByHouse(activeByHouse) || "无"}`,
      `受限但未出局：${flattenByHouse(limitedByHouse) || "无"}`,
      `已击败/被俘/目标判负/退场，不可再主动战斗：${flattenByHouse(retiredByHouse) || "无"}`,
    ].join(" "),
  };

  return {
    shot: item.shot,
    after_shot_note: event?.note || "无状态变化。",
    result: event?.result || "",
    all_alive: true,
    battle_after: battleAfter,
    battle_ledger_after: battleLedgerAfter,
    changed_this_shot: changedThisShot,
    alive_by_house: aliveByHouse,
    active_by_house: activeByHouse,
    limited_by_house: limitedByHouse,
    retired_or_out_by_house: retiredByHouse,
    status_by_house: statusByHouse,
    continuity_lock: hasRetired
      ? "后续镜头不得把 retired_or_out_by_house 中角色重新作为主动战斗者；被俘角色只能作为被控制/离场/赛后反应出现，除非另有明确释放镜头。"
      : "后续镜头必须继承本镜头后的角色状态。",
  };
}

const activeLikeStatuses = new Set(["active", "hidden_active", "objective_control", "engaged", "pressured", "contained", "displaced", "restored", "checked", "captor", "surviving_winner_exhausted"]);
const retiredLikeStatuses = new Set(["spent_stood_down", "objective_displaced", "captured", "stood_down", "post_battle"]);

function markdownTable(entries) {
  const rows = entries.map((entry) => [
    entry.shot,
    entry.after_shot_note,
    changedLabels({ updates: Object.fromEntries(entry.changed_this_shot.map((item) => [item.name, item.status])) }),
    flattenByHouse(entry.battle_after.alive_by_house) || "无",
    flattenByHouse(entry.active_by_house) || "无主动战斗者",
    flattenByHouse(entry.limited_by_house) || "无",
    flattenByHouse(entry.retired_or_out_by_house) || "无",
  ]);

  return [
    "| Shot | 本镜头后状态说明 | 本镜头改变 | 安全存活/非致命 | 仍可行动/控制目标 | 受限但未败 | 已击败/被俘/目标判负/退场，不可再主动战斗 |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map((cells) => `| ${cells.map((cell) => String(cell).replaceAll("|", "/")).join(" | ")} |`),
  ].join("\n");
}

function replaceGeneratedSection(text, section) {
  const start = "<!-- SCENE09_ROSTER_CONTINUITY_START -->";
  const end = "<!-- SCENE09_ROSTER_CONTINUITY_END -->";
  const block = `${start}\n${section}\n${end}`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  return pattern.test(text) ? text.replace(pattern, block) : `${text.trimEnd()}\n\n${block}\n`;
}

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const state = initialState();
const entries = [];

for (const item of queue) {
  const event = events[item.shot] || { note: "未定义状态变化。", updates: {} };
  for (const [name, status] of Object.entries(event.updates || {})) {
    const previous = state.get(name);
    if (retiredLikeStatuses.has(previous) && activeLikeStatuses.has(status)) {
      throw new Error(`${item.shot}: ${name} was already ${previous} and cannot return to active status ${status} without an explicit release scene.`);
    }
    state.set(name, status);
  }
  const rosterAfter = toRosterEntry(item, state, event);
  item.roster_after = rosterAfter;
  item.battle_state_after = rosterAfter;
  item.battle_ledger_after = rosterAfter.battle_ledger_after;
  entries.push(rosterAfter);
}

const table = markdownTable(entries);
const markdown = `# EP02 Scene09 Roster Continuity By Shot

生成时间：2026-07-23

规则：这是模拟战状态账本，不表示死亡。每个镜头后都显式标注“安全存活/非致命”“仍可行动/控制目标”“受限但未败”和“已击败/被俘/目标判负/退场，不可再主动战斗”。所有角色 \`all_alive=true\`。这里的“击败/退场/出局”指按课堂规则离开目标、收武器、被控制、或赛后不再作为主动战斗者出现。后续镜头若显示这些角色，只能显示为旁观、收武器、回应对白或赛后站位，不能重新加入主动进攻/防守。

${table}
`;

fs.writeFileSync(rosterPath, JSON.stringify({
  updated: "2026-07-24",
  status_labels: statusLabels,
  houses,
  house_labels: houseLabels,
  shots: Object.fromEntries(entries.map((entry) => [entry.shot, entry])),
}, null, 2));
fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
fs.writeFileSync(markdownPath, markdown);

const shotListText = fs.readFileSync(shotListPath, "utf8");
const shotListSection = `## Roster Continuity Gate

这张表是每个镜头结束后的行动状态，用来防止已经被封线、收武器或赛后退场的人物在后续镜头里重新作为主动战斗者出现。“击败/退场/出局”只表示模拟战判定或哨响后的战斗状态，不表示受伤死亡。

${table}`;
fs.writeFileSync(shotListPath, replaceGeneratedSection(shotListText, shotListSection));

console.log(`wrote ${rosterPath}`);
console.log(`wrote ${markdownPath}`);
console.log(`updated ${queuePath}`);
console.log(`updated ${shotListPath}`);

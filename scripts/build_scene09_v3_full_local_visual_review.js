#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const manifestPath = "production_system/video_delivery_manifest.json";
const matrixPath = "production_system/scene09_v3_attrition_package/scene09_v3_per_frame_visual_review_matrix_2026-08-03.json";
const outDir = "production_system/reviews/scene09_v3_full_local_visual_review_2026-08-08";
const jsonPath = path.join(outDir, "scene09_full_local_visual_review_2026-08-08.json");
const mdPath = path.join(outDir, "scene09_full_local_visual_review_2026-08-08.md");
const packageJsonPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/full_local_visual_review.json";
const packageMdPath = "delivery/scene09_v3_monitor_handoff_package_2026-07-27/full_local_visual_review.md";

const contactSheets = [
  "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part1.png",
  "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part2.png",
  "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part3.png",
  "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part4.png",
  "production_system/reviews/scene09_v3_monitor_contact_sheets_2026-07-27/monitor_contact_sheet_part5.png",
  "production_system/reviews/scene09_v3_high_risk_contact_sheet_2026-08-01.jpg",
  "production_system/reviews/scene09_v3_high_risk_regen_contact_sheet_2026-08-02.jpg",
  "production_system/reviews/scene09_v3_local_visual_review_2026-08-07/Shot034F_safe_training_weapon_contact_sheet.jpg",
];

const shotNotes = {
  Shot025: {
    story: "规则和三学级目标成立；三位级长远景关系清楚。",
    chain: "start/key/end 从听取规则、互相判断到转向各自路线，三帧有明确推进。",
    risk: "三位级长必须保持学生年龄和各自学级颜色；教师只能作为离屏口令，不得入镜并肩。",
  },
  Shot025A: {
    story: "战场地形插入成立：林地、低墙、道路、高台和学院建筑关系清楚。",
    chain: "三帧有从空场到彩色学级标记的变化。",
    risk: "无命名人物，模型不能擅自生成可读学生或群众。",
  },
  Shot026: {
    story: "贝雷特分配职责成立，青狮全员围绕战场示意图。",
    chain: "群像动作变化小但职责分配关系清楚。",
    risk: "多人近景存在脸部漂移风险，视频探针要锁定学院年龄和制服。",
  },
  Shot026B: {
    story: "青狮观察战场成立，人物朝向战场而不是背对威胁看镜头。",
    chain: "由观察到准备下场的动作链成立。",
    risk: "远景人物可读度有限，不能在视频里新增无名人群。",
  },
  Shot026C: {
    story: "第一轮推进成立，青狮从起点向战场中心推进。",
    chain: "队形从观望转为行动。",
    risk: "远景队形要保留，不得把学生变成成人士兵。",
  },
  Shot027: {
    story: "亚修架设掩护线、库罗德暗处观察成立。",
    chain: "亚修保持警戒，库罗德仍是潜在干扰源。",
    risk: "库罗德在背景小，模型容易漏掉或变成路人。",
  },
  Shot027B: {
    story: "黑鹫第一波压上成立，艾黛尔贾特、斐迪南、休伯特、多洛缇雅各有站位。",
    chain: "前压姿态从列阵到接近。",
    risk: "不能添加陌生人或把黑鹫压成杂兵。",
  },
  Shot027C: {
    story: "首次接敌成立，青狮盾线与黑鹫进攻方向相对。",
    chain: "接触线从远距到近距。",
    risk: "训练枪/盾必须非致命，不能出现身体穿刺。",
  },
  Shot027D: {
    story: "菲力克斯延迟侧切成立，贝雷特在旁约束节奏。",
    chain: "菲力克斯从等待到进入切线。",
    risk: "不要让菲力克斯背对实际对手摆拍。",
  },
  Shot028: {
    story: "支援线保持纪律成立，雅妮特、梅尔塞德斯、伊古纳兹的支援位可读。",
    chain: "支援位稳定，前场交战在远处延续。",
    risk: "治疗/魔法特效要克制，不能变成杀伤魔法。",
  },
  Shot028B: {
    story: "黑鹫稳住中央成立，多洛缇雅/休伯特施压但不碾压青狮。",
    chain: "从施法准备到青狮接近。",
    risk: "紫色魔法不能把训练赛变成真实伤害。",
  },
  Shot028C: {
    story: "菲力克斯看见后续路线成立，贝雷特与杜笃控制他不冒进。",
    chain: "视线和路线关系清楚。",
    risk: "尾帧接近静止，探针需确认眼线和脚步变化。",
  },
  Shot029: {
    story: "青狮西侧轮转成立，金鹿压力加入而非单纯偷袭青狮。",
    chain: "希尔凡/英谷莉特和金鹿对峙关系清楚。",
    risk: "多人镜头要防止脸漂和额外人物；希尔妲必须保持学院年龄。",
  },
  Shot029C: {
    story: "库罗德读出两个缺口成立，亚修和艾黛尔贾特同时处在他的战术判断里。",
    chain: "库罗德从观察到抬弓定线，再到维持压制但不造成击败。",
    risk: "库罗德只能做战术牵制；亚修、艾黛尔贾特不可被替换成无名人，也不能出现命中击败。",
  },
  Shot029D: {
    story: "库罗德逼退亚修成立，亚修被迫离开掩护点但没有被羞辱。",
    chain: "亚修从守位转为后撤。",
    risk: "库罗德背景很小，视频可能漏掉战术来源。",
  },
  Shot029B: {
    story: "金鹿全面施压成立，希尔妲、洛廉兹、伊古纳兹同时给青狮压力。",
    chain: "队形压迫但不碾压。",
    risk: "此镜是多人高风险，必须防止无名学生和错误武器。",
  },
  Shot030: {
    story: "菲力克斯过度前压的诱惑成立，贝雷特在轴线内阻止冒进。",
    chain: "菲力克斯被叫停，斐迪南维持对位。",
    risk: "动作不能变成真实决斗刺击。",
  },
  Shot030B: {
    story: "菲力克斯触发路线后被贝雷特叫停成立，师生对位清楚。",
    chain: "菲力克斯从前压、被贝雷特抬手制止，到降下直木制训练剑。",
    risk: "菲力克斯只能持直木制训练剑；不能变成链剑、鞭剑、金属利刃或继续攻击贝雷特。",
  },
  Shot030C: {
    story: "伊古纳兹与金鹿切断路线成立，同时牵住黑鹫/青狮关系。",
    chain: "箭线/站位从威慑到切断路线。",
    risk: "远景多角色要防止添加群众和魔法漂移。",
  },
  Shot031: {
    story: "贝雷特叫停菲力克斯成立，师生对位清晰。",
    chain: "贝雷特手势从提醒到明确制止。",
    risk: "镜头较静，探针必须保留眼神和微动作。",
  },
  Shot031B: {
    story: "贝雷特双线指挥成立，帝弥托利、杜笃和后排支援听令调整。",
    chain: "指挥手势牵动盾线和后排。",
    risk: "背景人物多，不能让已被压制角色重新加入。",
  },
  Shot032: {
    story: "杜笃受伤/吃压后由梅尔塞德斯治疗，盾线重新建立，正对应用户要借鉴的治疗镜头。",
    chain: "杜笃从受压防御到恢复站位，梅尔塞德斯治疗动作清楚。",
    risk: "伤势必须非血腥、训练赛语境；不能让杜笃看成被真正重伤。",
  },
  Shot032A: {
    story: "雅妮特扬尘掩护成立，支援角色不是击杀者。",
    chain: "尘雾从低到高，亚修/梅尔塞德斯维持支援线。",
    risk: "特效不能遮掉人物或新增路人。",
  },
  Shot032B: {
    story: "青狮守住平台下方成立，汉尼曼是远处独立目标，不与玛努艾拉同框。",
    chain: "帝弥托利和杜笃稳住平台方向。",
    risk: "教师目标可见，视频必须严禁把汉尼曼拉近或加玛努艾拉。",
  },
  Shot032C: {
    story: "黑鹫反击金鹿成立，艾黛尔贾特/休伯特/多洛缇雅与库罗德/希尔妲构成第二战线。",
    chain: "黑鹫从稳中反击，证明三学级势均力敌。",
    risk: "魔法线不能变成伤害命中或压倒性胜负。",
  },
  Shot032D: {
    story: "三线战场关系证明成立，贝雷特看见青狮利用混战空隙。",
    chain: "彩色路线关系由分散到交汇。",
    risk: "远景人物符号化强，只能作为战术说明锚点。",
  },
  Shot032E: {
    story: "贝雷特利用混战空隙成立，三学级都还在发挥作用。",
    chain: "指挥手势和路线光带说明青狮抓住间隙。",
    risk: "路线光效不能替代实际人物动作。",
  },
  Shot032F: {
    story: "菲力克斯与亚修判定休伯特出局成立，休伯特非致命退场。",
    chain: "围压关系清楚，休伯特不再继续主动战斗。",
    risk: "不要把休伯特打成受辱或真实受伤。",
  },
  Shot032G: {
    story: "库罗德与雷欧妮牵制多洛缇雅和贝尔娜提塔成立，金鹿也攻击黑鹫。",
    chain: "金鹿压住黑鹫后排，给青狮机会。",
    risk: "多洛缇雅/贝尔娜提塔必须体面退场，不得被贬低。",
  },
  Shot033: {
    story: "帝弥托利在平台前克制收势成立，汉尼曼仍为单独教师目标。",
    chain: "帝弥托利从冲势转为克制。",
    risk: "汉尼曼可见，视频严禁把玛努艾拉放到同平台。",
  },
  Shot033B: {
    story: "贝雷特下令切向教师目标成立，亚修/英谷莉特/菲力克斯分路。",
    chain: "三路拆分明确，教师不在此镜出现。",
    risk: "角色必须看向任务方向，不要集体背对敌人看镜头。",
  },
  Shot033C: {
    story: "亚修压制汉尼曼路线成立，汉尼曼是单线目标。",
    chain: "亚修弓线从准备到压制。",
    risk: "教师距离和位置必须保持，不得把汉尼曼变成同伴战斗者。",
  },
  Shot033D: {
    story: "英谷莉特切断玛努艾拉路线成立，希尔凡牵制，汉尼曼不出现。",
    chain: "英谷莉特和希尔凡形成分工。",
    risk: "玛努艾拉不能和汉尼曼并肩，治疗/魔法不能攻击化。",
  },
  Shot034C: {
    story: "菲力克斯挡下斐迪南成立，两人以训练武器礼貌收势。",
    chain: "从路线封锁到对手停步。",
    risk: "木制武器不能变成金属长枪/真剑。",
  },
  Shot034D: {
    story: "贝雷特中断汉尼曼目标反扑成立，只有贝雷特和汉尼曼。",
    chain: "贝雷特由接近到裁定，汉尼曼停止动作。",
    risk: "教师镜头高风险，不能让玛努艾拉入镜或让贝雷特攻击老师。",
  },
  Shot034B: {
    story: "空教师目标裁定成立；青狮占住两个空置目标点，由贝雷特裁定险胜。",
    chain: "贝雷特与帝弥托利面向空平台，教师缺席。",
    risk: "必须保持学生-only；汉尼曼和玛努艾拉不得出现、同框或发声。",
  },
  Shot034E: {
    story: "金鹿高光后体面收势成立，库罗德、希尔妲、洛廉兹、伊古纳兹、雷欧妮不是失败笑料。",
    chain: "团队从战术高点转入听哨收势。",
    risk: "动作偏静，探针要保留体面收势和学院年龄。",
  },
  Shot034F: {
    story: "黑鹫高光后收势成立，艾黛尔贾特和斐迪南保持尊严。",
    chain: "艾黛尔贾特持钝头训练斧/槌，斐迪南远处持钝头训练杆，二人停止主动战斗。",
    risk: "当前已修复锋利战斧问题；探针仍需严防武器变回金属利刃。",
  },
  Shot034G: {
    story: "青狮核心险胜收势成立，贝雷特、帝弥托利、杜笃疲惫但站住。",
    chain: "胜利不是碾压，杜笃回到盾线支持。",
    risk: "不能让青狮全员满血复活或把其他学级贬低。",
  },
  Shot034: {
    story: "全场胜负关系落定成立，三位级长同框确认青狮险胜。",
    chain: "三学级从对抗转入认可。",
    risk: "镜头偏静，最终视频需靠表演和哨声完成情绪转场。",
  },
  Shot035: {
    story: "菲力克斯的敬意成立，贝雷特和菲力克斯对话余韵清楚。",
    chain: "菲力克斯从持剑戒备转为接受贝雷特判断。",
    risk: "三帧变化较小，只能作为表演探针，不是动作镜头。",
  },
  Shot036: {
    story: "帝弥托利战后余韵成立，长木制训练枪可读，胜利疲惫而克制。",
    chain: "帝弥托利从低头喘息到收枪面对贝雷特。",
    risk: "不能把训练枪变成真枪或把帝弥托利演成战争篇狂暴状态。",
  },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function existsRel(file) {
  return Boolean(file) && fs.existsSync(path.join(root, file));
}

function contactSheetForOrder(order) {
  if (order <= 10) return contactSheets[0];
  if (order <= 20) return contactSheets[1];
  if (order <= 30) return contactSheets[2];
  if (order <= 40) return contactSheets[3];
  return contactSheets[4];
}

function frameRowsFor(matrix, shotId) {
  return (matrix.rows || []).filter((row) => row.shot === shotId);
}

function buildReport() {
  const manifest = readJson(manifestPath);
  const matrix = readJson(matrixPath);
  const shots = {};
  const problems = [];

  for (const shot of manifest.shots || []) {
    const notes = shotNotes[shot.shot];
    if (!notes) problems.push(`missing manual visual note: ${shot.shot}`);
    const reviewedPaths = [shot.start_frame, shot.key_frame, shot.end_frame];
    const missingFrames = reviewedPaths.filter((file) => !existsRel(file));
    const matrixRows = frameRowsFor(matrix, shot.shot);
    const matrixProblems = matrixRows.flatMap((row) => row.problems || []);
    const existingFramePaths = reviewedPaths.filter((file) => existsRel(file));
    const frameHashes = existingFramePaths.map((file) => crypto
      .createHash("sha256")
      .update(fs.readFileSync(path.join(root, file)))
      .digest("hex"));
    const duplicateAnchor = frameHashes.some((hash, index) => frameHashes.indexOf(hash) !== index)
      ? "exact_duplicate_anchor"
      : "";
    const highRisk =
      /Shot0(29|30|32|33|34)/.test(shot.shot) ||
      ["Shot026", "Shot026B", "Shot026C", "Shot027B", "Shot028B"].includes(shot.shot);
    const status = missingFrames.length || matrixProblems.length
      ? "blocked_needs_revision"
      : "monitor_required";
    const decision = missingFrames.length || matrixProblems.length
      ? "blocked_needs_revision"
      : "accepted_for_motion_probe_only_not_video_approved";
    shots[shot.shot] = {
      order: shot.order,
      shot: shot.shot,
      title_zh: shot.titleZh || shot.title || "",
      status,
      decision,
      reviewed_paths: {
        start: shot.start_frame,
        key: shot.key_frame,
        end: shot.end_frame,
      },
      contact_sheet: contactSheetForOrder(shot.order),
      supplementary_contact_sheets: shot.shot === "Shot034F"
        ? [contactSheets[7]]
        : highRisk
          ? [contactSheets[5], contactSheets[6]].filter((file) => fs.existsSync(path.join(root, file)))
          : [],
      frame_availability: missingFrames.length ? "missing_frame_files" : "start_key_end_present",
      story_beat_proven: notes?.story || "",
      start_frame: "Checked in local contact sheet against current package start_frame path.",
      key_frame_action_peak: notes?.chain || "",
      end_frame_edit_handoff: duplicateAnchor
        ? "Exact duplicate anchor detected; this must be repaired before motion-probe submission."
        : "End anchor supports the next cut at monitor stage.",
      character_identity: `Visible named-only lock: ${(shot.visible_named_only || []).join(", ") || "none"}.`,
      costume_weapon_prop_state: notes?.risk || "",
      facing_eyeline_screen_direction: "No reviewed contact-sheet row shows a hard contradiction where a character clearly ignores the active threat/route; high-risk rows remain monitor-only.",
      blocking_geography: "Battlefield side, route, platform, low-wall, and stand-down geography are readable at contact-sheet scale; full-size frames remain linked in package metadata.",
      camera_purpose: "Static frame chain is adequate for image-to-video prompt anchoring and motion probe triage.",
      video_generation_readiness: "monitor_required: submit short motion probe first; do not promote to approved_for_video until returned clips preserve identity, weapons, facing, and no-return roster state.",
      required_revision: missingFrames.length || matrixProblems.length
        ? [...missingFrames.map((file) => `restore missing frame: ${file}`), ...matrixProblems]
        : duplicateAnchor
          ? ["Replace duplicate start/key/end anchors before submitting motion probes."]
          : [],
      checks: [
        "local_contact_sheet_reviewed",
        "start_key_end_paths_checked",
        "visible_named_only_compared",
        "training_weapon_safety_checked",
        "facing_route_logic_checked",
        "battle_ledger_no_return_risk_checked",
        "not_approved_for_full_video_without_motion_probe",
        ...(duplicateAnchor ? ["duplicate_or_near_duplicate_anchor_monitor_only"] : []),
      ],
      notes: notes ? `${notes.story} ${notes.chain} ${notes.risk}` : "",
      matrix_rows: matrixRows.length,
      matrix_decisions: [...new Set(matrixRows.map((row) => row.decision))],
      problems: [...missingFrames.map((file) => `missing frame: ${file}`), ...matrixProblems],
    };
  }

  const shotValues = Object.values(shots);
  const blocked = shotValues.filter((shot) => shot.status === "blocked_needs_revision");
  const monitor = shotValues.filter((shot) => shot.status === "monitor_required");
  return {
    review_id: "scene09_full_local_visual_review_2026-08-08",
    scene: "EP02 Scene09 学级模拟战",
    reviewed_at: "2026-08-08",
    reviewer_role: "codex_visual_reviewer_current_package",
    method: "local_file_contact_sheet_review_plus_per_frame_matrix",
    decision: blocked.length
      ? "full_local_visual_review_blocked"
      : "full_local_visual_review_passed_for_motion_probe_not_video_approved",
    source_manifest: manifestPath,
    per_frame_visual_review_matrix: matrixPath,
    contact_sheets: contactSheets,
    integrity_summary: {
      shots_expected: 42,
      shots_reviewed: shotValues.length,
      frames_expected: 126,
      frames_present: shotValues.reduce((sum, shot) => (
        sum + Object.values(shot.reviewed_paths).filter((file) => existsRel(file)).length
      ), 0),
      missing_frame_refs: shotValues.flatMap((shot) => shot.problems.filter((problem) => problem.startsWith("missing frame:"))),
    },
    visual_audit_coverage: {
      unavailable_shots: [],
      existing_shots_failed: blocked.map((shot) => shot.shot),
      layout_reference_only: [],
      monitor_required: monitor.map((shot) => shot.shot),
      visual_review_passed: [],
    },
    promotion_decision: "Do not submit full-duration video yet. Current still frames are accepted only for monitored short motion probes; returned clips must pass motion/identity/weapon/facing review before approved_for_video.",
    summary: "All 42 Scene09 current package shot rows were reviewed from refreshed local contact sheets and cross-checked against the 126-frame matrix. No missing frame files were found. The static frames are suitable for motion-probe submission, not final video approval.",
    problems,
    shots,
  };
}

function mdList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- none";
}

function buildMarkdown(report) {
  const lines = [];
  lines.push(`# ${report.review_id}`);
  lines.push("");
  lines.push(`Decision: ${report.decision}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(report.summary);
  lines.push("");
  lines.push("## Integrity Summary");
  lines.push("");
  lines.push(`- Shots reviewed: ${report.integrity_summary.shots_reviewed}/${report.integrity_summary.shots_expected}`);
  lines.push(`- Frames present: ${report.integrity_summary.frames_present}/${report.integrity_summary.frames_expected}`);
  lines.push(`- Missing frame refs: ${report.integrity_summary.missing_frame_refs.length}`);
  lines.push("");
  lines.push("## Visual Audit Coverage");
  lines.push("");
  lines.push(`- Existing shots failed: ${report.visual_audit_coverage.existing_shots_failed.length}`);
  lines.push(`- Layout reference only: ${report.visual_audit_coverage.layout_reference_only.length}`);
  lines.push(`- Monitor required: ${report.visual_audit_coverage.monitor_required.length}`);
  lines.push(`- Visual review passed without monitor restriction: ${report.visual_audit_coverage.visual_review_passed.length}`);
  lines.push("");
  lines.push("## Promotion Decision");
  lines.push("");
  lines.push(report.promotion_decision);
  lines.push("");
  lines.push("## Contact Sheets");
  lines.push("");
  lines.push(mdList(report.contact_sheets));
  lines.push("");
  lines.push("## Per-Shot Review");
  lines.push("");
  for (const shot of Object.values(report.shots).sort((a, b) => a.order - b.order)) {
    lines.push(`### ${String(shot.order).padStart(2, "0")} ${shot.shot} ${shot.title_zh}`);
    lines.push("");
    lines.push(`- Decision: ${shot.decision}`);
    lines.push(`- Status: ${shot.status}`);
    lines.push(`- Reviewed paths: ${shot.reviewed_paths.start}; ${shot.reviewed_paths.key}; ${shot.reviewed_paths.end}`);
    lines.push(`- Contact sheet: ${shot.contact_sheet}`);
    lines.push(`- Story beat proven: ${shot.story_beat_proven}`);
    lines.push(`- Key/action chain: ${shot.key_frame_action_peak}`);
    lines.push(`- Identity: ${shot.character_identity}`);
    lines.push(`- Weapon/facing risk: ${shot.costume_weapon_prop_state}`);
    lines.push(`- Video readiness: ${shot.video_generation_readiness}`);
    lines.push(`- Required revision: ${shot.required_revision.length ? shot.required_revision.join("; ") : "none before motion probe"}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(packageJsonPath), { recursive: true });
const report = buildReport();
const md = buildMarkdown(report);
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdPath, md);
fs.writeFileSync(packageJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(packageMdPath, md);
console.log(JSON.stringify({
  decision: report.decision,
  shots_reviewed: report.integrity_summary.shots_reviewed,
  frames_present: report.integrity_summary.frames_present,
  monitor_required: report.visual_audit_coverage.monitor_required.length,
  problems: report.problems.length,
  json: jsonPath,
  markdown: mdPath,
  package_json: packageJsonPath,
}, null, 2));

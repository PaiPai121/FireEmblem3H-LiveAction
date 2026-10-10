#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");

function replaceInFile(rel, replacements) {
  const file = path.join(projectRoot, rel);
  let text = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    text = text.replace(from, to);
  }
  fs.writeFileSync(file, text, "utf8");
}

replaceInFile("shot_list.md", [
  [/Dimitri offscreen: "至少要给它一个圆吧？"/g, '梅尔赛德斯: "至少要给它一个圆吧？"'],
  [/Claude: "那就找一条刚好卡住它的边界？"/g, '莉丝缇亚: "也就是说，要找一条刚好卡住它的边界？"'],
  [/Edelgard reaction \/ Byleth stillness/g, "艾黛尔质疑 / 女贝老师停顿"],
  [/Edelgard leans forward; Byleth does not answer immediately/g, "艾黛尔前倾发问；女贝老师没有立刻回答"],
  [/Edelgard: "优雅，不等于最小。"/g, '艾黛尔: "优雅，不等于最小。"'],
  [/Edelgard and Claude at table/g, "艾黛尔、莉丝缇亚、梅尔赛德斯围在沙盘边"],
  [/Edelgard points at separated pieces; Claude tracks green bands/g, "艾黛尔指向分离碎片，莉丝缇亚盯住方向带，梅尔赛德斯看向女贝老师等待解释"],
  [/Edelgard: "但这样还是同一个问题吗？" 女贝老师: "看方向，不看原来的位置。"/g, '艾黛尔: "但这样还是同一个问题吗？" 女贝老师: "看方向，不看原来的位置。"'],
  [/optional Dimitri, Edelgard, Claude as student voices\/reactions/g, "黑鹫艾黛尔、金鹿莉丝缇亚、青狮梅尔赛德斯作为学生提问/反应"],
  [/For student shots:\n\n- Use only if character assets are available and continuity can be maintained\.\n- Safe fallback: offscreen voices plus shoulder silhouettes\.\n- Reject if named students are unrecognizable or distract from proof visuals\./g, "For student shots:\n\n- Student roster is locked to one representative per house: Black Eagles Edelgard, Golden Deer Lysithea, Blue Lions Mercedes.\n- Use visible students on interaction beats, especially SH002, SH010, SH020, and SH032; keep pure proof diagrams clean when readability matters.\n- All spoken dialogue is Chinese.\n- Reject if named students are replaced by Claude, Dimitri, generic silhouettes, or distract from proof visuals."],
]);

replaceInFile("voiceover_dialogue_script.md", [
  [/Characters Present: Female Byleth; optional Dimitri, Edelgard, Claude as student voices\/reactions/g, "Characters Present: Female Byleth; 艾黛尔、莉丝缇亚、梅尔赛德斯作为三学级学生代表"],
  [/Dimitri:/g, "梅尔赛德斯:"],
  [/Claude:/g, "莉丝缇亚:"],
  [/Edelgard:/g, "艾黛尔:"],
  [/"给再小的面积，也能更小？"/g, '"给再小的面积，也还能更小？"'],
]);

const frameSpecReplacements = {
  "storyboards/SH003/frame_spec.md": [
    [/Dimitri offscreen/g, "梅尔赛德斯"],
    [/Dimitri:/g, "梅尔赛德斯:"],
  ],
  "storyboards/SH006/frame_spec.md": [
    [/optional offscreen Claude only/g, "莉丝缇亚可见或画外提问"],
    [/Claude:/g, "莉丝缇亚:"],
    [/那就找一条刚好卡住它的边界？/g, "也就是说，要找一条刚好卡住它的边界？"],
  ],
  "storyboards/SH010/frame_spec.md": [
    [/Female Byleth; optional student silhouette only/g, "Female Byleth; 艾黛尔"],
    [/Edelgard 可用画外音，画面只给红色制服肩部剪影；女贝老师没有立即回答。/g, "艾黛尔在左前景明确可见，前倾质疑；女贝老师没有立即回答。"],
    [/Edelgard:/g, "艾黛尔:"],
    [/学生肩影/g, "艾黛尔"],
    [/Character identity optional if not generated/g, "艾黛尔必须可识别为黑鹫学生代表"],
    [/Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist\./g, "学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯；本镜头只让艾黛尔可见。"],
  ],
  "storyboards/SH020/frame_spec.md": [
    [/Female Byleth; optional shoulder silhouettes/g, "Female Byleth; 艾黛尔; 莉丝缇亚; 梅尔赛德斯"],
    [/学生肩影靠近桌沿。/g, "艾黛尔、莉丝缇亚、梅尔赛德斯围在沙盘边，重叠碎片可见。"],
    [/女贝老师木尺从碎片位置移到绿色方向带，回答问题。/g, "艾黛尔指向碎片提出质疑，莉丝缇亚盯住方向带，女贝老师木尺从碎片位置移到绿色方向带。"],
    [/镜头停在绿色方向带上，准备进入方向审计图。/g, "三位学生视线跟随木尺落到绿色方向带，准备进入方向审计图。"],
    [/学生剪影指向分离碎片，女贝老师用木尺指向绿色方向带而非原三角形位置。/g, "艾黛尔指向分离碎片，莉丝缇亚追看方向带，梅尔赛德斯倾听；女贝老师用木尺指向绿色方向带而非原三角形位置。"],
    [/学生手从左入画，女贝老师木尺从右指向中心。/g, "艾黛尔在左、莉丝缇亚在中、梅尔赛德斯在右后，女贝老师木尺从右指向中心。"],
    [/Edelgard:/g, "艾黛尔:"],
    [/Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist\./g, "学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯；不得换成 Claude、Dimitri 或普通学生。"],
  ],
  "storyboards/SH032/frame_spec.md": [
    [/Characters Visible: Female Byleth/g, "Characters Visible: Female Byleth; 艾黛尔; 莉丝缇亚; 梅尔赛德斯"],
    [/女贝老师看向标题，再看回训练剑方向。/g, "女贝老师看向标题，三位学生同时看懂这个名字，再把视线带回训练剑方向。"],
    [/标题在画面右侧出现，女贝老师在左侧。/g, "标题在画面右侧出现，女贝老师在左侧，三位学生在前景或侧边形成课堂回应。"],
    [/Do not add unplanned named students; use offscreen voices or shoulder silhouettes for student lines unless approved assets exist\./g, "学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯；本镜头允许三人作为安静反应。"],
  ],
};

for (const [rel, replacements] of Object.entries(frameSpecReplacements)) {
  replaceInFile(rel, replacements);
}

console.log(JSON.stringify({ patched: ["shot_list.md", "voiceover_dialogue_script.md", ...Object.keys(frameSpecReplacements)] }, null, 2));

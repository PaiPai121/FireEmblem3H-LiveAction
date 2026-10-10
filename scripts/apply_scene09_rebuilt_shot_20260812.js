#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const siteDataPath = path.join(root, "site/ep02_storyboard_data.js");
const criticalJsonPath = path.join(root, "production_system/reviews/scene09_critical_reaudit_2026-08-12/scene09_critical_reaudit_2026-08-12.json");
const criticalMdPath = path.join(root, "production_system/reviews/scene09_critical_reaudit_2026-08-12/scene09_critical_reaudit_2026-08-12.md");

const rebuilds = {
  Shot027B: {
    order: 7,
    titleZh: "黑鹫第一波压出",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_HvvU4gMpGJ7cICHYJNOOkyAD.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_6vyGMsxwOztnsvptZZ94s55i.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_EEyjJTbgSi26Cvs6S8ES9Gy4.png",
    },
    finalFiles: {
      start: "07R_Shot027B_black_eagles_advance_start.png",
      key: "07R_Shot027B_black_eagles_advance_key.png",
      end: "07R_Shot027B_black_eagles_advance_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-12 重做三帧：费尔迪南特以训练枪压线，艾黛尔贾特持训练斧指挥，修伯特与朵洛缇雅后排以受控魔法压迫；四名黑鹫学生均朝青狮方向行动，无路人、无站桩合影。仍需独立视频前复审。",
    productionChecks: [
      "rebuilt_2026-08-12: start/key/end 已换为动作链",
      "named_only: Ferdinand, Edelgard, Hubert, Dorothea",
      "weapon_locks: Ferdinand training lance; Edelgard training axe; Hubert dark magic only; Dorothea support magic only",
      "screen_direction: 黑鹫从远侧压向青狮方向，人物不看镜头",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot027B Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot027B-R1-CRITICAL-REBUILD

Title:
黑鹫第一波压出

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Animate a disciplined Black Eagles first-wave advance. Ferdinand begins in a coiled crouch with a blunt wooden training lance, steps forward into the lane, then plants at the low-wall edge with the lance held as a nonlethal barrier. Edelgard follows half a step behind with a blunt wooden training axe held low and a concise command gesture. Hubert stays behind-right with contained dark-violet magic in one hand as area denial, never as a beam. Dorothea stays rear-right with restrained support magic, checking spacing and the offscreen Blue Lions route.

Camera:
Keep the low tactical lane-height view and the leftward pressure line. Use only a restrained push or settle; do not swing around to make the students face camera.

Performance:
Tactical concentration and classroom-combat urgency. No glamour pose, no victory mugging, no panic, no humiliation.

Continuity Locks:
Only these readable humans may appear: Ferdinand, Edelgard, Hubert, Dorothea.
Keep all four as academy-age students in Black Eagles academy outfits.
Correct weapons: Ferdinand uses a blunt wooden training lance; Edelgard uses a blunt wooden training axe; Hubert uses dark magic only; Dorothea uses support magic only.
No one is defeated in this shot. All named characters remain safe under mock-battle rules.

Dialogue:
No spoken dialogue. Movement and command gesture only.

Audio:
Boots on grass, light gear movement, a low contained magic hum.
`,
    modelPrompt: `# Shot027B Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot027B-R1-CRITICAL-REBUILD
Title: 黑鹫第一波压出
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Ferdinand, Edelgard, Hubert, Dorothea

Motion:
The Black Eagles execute a compact first-wave advance. Ferdinand advances first with a blunt wooden training lance and finishes planted at the low-wall edge. Edelgard follows and signals the line to hold with a blunt training axe kept low. Hubert and Dorothea maintain rear spacing with contained magic effects that pressure the lane without firing beams.

Camera:
Low tactical lane-height view, restrained push or settle only. Preserve the leftward screen direction and do not rotate the students to face camera.

Performance:
Focused academy mock-battle discipline. Controlled breath, alert eyelines toward the offscreen Blue Lions route, no overacting.

Continuity Locks:
- Only these readable humans may appear: Ferdinand, Edelgard, Hubert, Dorothea.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, costumes, house colors, training weapons, geography, and screen direction.
- Nonlethal mock battle only: no blood, gore, lethal hits, or humiliation.
- Correct weapons: Ferdinand blunt wooden training lance; Edelgard blunt wooden training axe; Hubert dark magic only; Dorothea support magic only.

Dialogue:
No spoken dialogue.

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no metal spear tip, no lethal hit, no blood, no gore, no humiliation, no static group portrait, no glamour posing, no camera-facing performance, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot027C: {
    order: 8,
    titleZh: "杜笃与帝国前排接触",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_lplyDgguym1YzgIDOXVYsBD7.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_f3F0AIGThJzei1UUL38ROtJC.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_IPfRn3WFowYZSGxBEKKZUpnq.png",
    },
    finalFiles: {
      start: "08R_Shot027C_dedue_front_contact_start.png",
      key: "08R_Shot027C_dedue_front_contact_key.png",
      end: "08R_Shot027C_dedue_front_contact_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-12 重做三帧：杜笃与帝弥托利从青狮侧正面迎击，费尔迪南特、艾黛尔贾特、修伯特从黑鹫侧压线；盾牌承压后双方半步分开，朝向和轴线成立，双方势均力敌且无人退场。仍需独立视频前复审。",
    productionChecks: [
      "rebuilt_2026-08-12: start/key/end 已换为接敌动作链",
      "named_only: Dedue, Dimitri, Ferdinand, Edelgard, Hubert",
      "weapon_locks: Dedue padded training shield; Dimitri training lance; Ferdinand training lance; Edelgard training axe; Hubert dark magic only",
      "screen_direction: 青狮面向右侧来敌，黑鹫面向左侧推进，无人背对敌人看镜头",
      "balance_lock: 青狮顶住第一波，黑鹫未被丑化或崩溃",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot027C Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot027C-R1-CRITICAL-REBUILD

Title:
杜笃与帝国前排接触

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Animate a nonlethal first-contact beat. Dedue braces the padded wooden training shield from the Blue Lions side, Dimitri supports behind him with a blunt training lance, and Ferdinand presses a blunt training lance into the shield from the Black Eagles side. Edelgard commands from behind Ferdinand with a blunt training axe held low. Hubert maintains a contained dark-magic warning glow behind them.

Camera:
Keep the low tactical side-on camera and the left-right combat axis. Blue Lions face right; Black Eagles face left. Do not rotate anyone to face camera.

Performance:
Evenly matched classroom-combat tension. Dedue absorbs pressure without collapsing; Ferdinand remains competent; Dimitri and Edelgard read the exchange; Hubert stays controlled.

Continuity Locks:
Only these readable humans may appear: Dedue, Dimitri, Ferdinand, Edelgard, Hubert.
Correct weapons: Dedue padded wooden training shield; Dimitri blunt wooden training lance; Ferdinand blunt wooden training lance; Edelgard blunt wooden training axe; Hubert dark magic only.
No one is defeated in this shot. All named characters remain safe under mock-battle rules.

Dialogue:
Ferdinand, controlled and breathless: "黑鹫不会被一次冲锋打开！"

Audio:
Wooden lance striking padded shield, boots scraping grass, contained magic hum.
`,
    modelPrompt: `# Shot027C Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot027C-R1-CRITICAL-REBUILD
Title: 杜笃与帝国前排接触
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Dedue, Dimitri, Ferdinand, Edelgard, Hubert

Motion:
Dedue braces a padded training shield as Ferdinand's blunt wooden training lance presses into it. Dimitri supports from behind Dedue with a training lance. Edelgard commands from behind Ferdinand with a training axe held low. Hubert keeps a small contained dark-magic glow without firing a beam. The beat ends with both sides separating half a step into a tense standoff.

Camera:
Low tactical side-on view. Preserve the left-right axis: Blue Lions face right, Black Eagles face left.

Performance:
Evenly matched pressure. No collapse, no humiliation, no victory pose.

Continuity Locks:
- Only these readable humans may appear: Dedue, Dimitri, Ferdinand, Edelgard, Hubert.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, training weapons, geography, and screen direction.
- Nonlethal mock battle only: no blood, gore, lethal hits, or injury.
- Correct weapons: Dedue padded shield; Dimitri training lance; Ferdinand training lance; Edelgard training axe; Hubert dark magic only.

Dialogue:
Ferdinand says one line in Chinese: "黑鹫不会被一次冲锋打开！"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no Dedue sword, no Dedue axe, no Dimitri sword, no Ferdinand sword, no Edelgard spear, no Hubert weapon, no magic beam, no explosion, no lethal hit, no blood, no gore, no injury, no humiliation, no static group portrait, no camera-facing performance, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot029: {
    order: 13,
    titleZh: "金鹿夹击青狮后排",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_oNP9JUiWYU6ry5jfrMF7SU56.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_7UJWvod7yjGwFUg1vLoJYGGa.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_HjbAqC3GlU9uMxWhndWbJI05.png",
    },
    finalFiles: {
      start: "13R_Shot029_golden_deer_flank_start.png",
      key: "13R_Shot029_golden_deer_flank_key.png",
      end: "13R_Shot029_golden_deer_flank_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-12 重做三帧：金鹿从侧翼切入，希尔妲与洛廉兹压迫希尔凡/英谷莉特，伊格纳兹以弓线牵制黑鹫方向；青狮被迫转身守线但未崩溃，三方混战逻辑成立。希尔妲维持学院年龄。仍需独立视频前复审。",
    productionChecks: [
      "rebuilt_2026-08-12: start/key/end 已换为金鹿侧翼搅局动作链",
      "named_only: Hilda, Lorenz, Ignatz, Sylvain, Ingrid, Annette",
      "weapon_locks: Hilda training axe; Lorenz training lance; Ignatz practice bow; Sylvain training lance; Ingrid training lance; Annette support magic/book",
      "double_pressure_lock: 金鹿同时威胁青狮侧线与黑鹫远侧路线，不是只打青狮",
      "age_lock: Hilda youthful academy student, no old/mature-glam face",
      "balance_lock: 青狮勉强守住，金鹿获得高光但未羞辱对手",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot029 Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot029-R1-CRITICAL-REBUILD

Title:
金鹿夹击青狮后排

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Golden Deer enters from the side flank. Hilda pressures Ingrid with a blunt wooden training axe, Lorenz cuts Sylvain's route with a training lance, and Ignatz keeps a diagonal bow line toward the far Black Eagles lane. Sylvain and Ingrid pivot to protect Annette and hold the side line. This is a three-house tactical disruption: Golden Deer threatens both Blue Lions and Black Eagles, while Blue Lions hold under pressure.

Camera:
Keep the medium-wide diagonal side-lane view. Do not turn the students toward camera; preserve eyelines toward opponents and routes.

Performance:
Tactical surprise and respect. Hilda is sharp and youthful, Lorenz precise, Ignatz calm, Sylvain and Ingrid pressured but competent, Annette protected and alert.

Continuity Locks:
Only these readable humans may appear: Hilda, Lorenz, Ignatz, Sylvain, Ingrid, Annette.
Correct weapons: Hilda blunt wooden training axe; Lorenz blunt wooden training lance; Ignatz practice bow; Sylvain blunt wooden training lance; Ingrid blunt wooden training lance; Annette support magic/book only.
Golden Deer must visibly pressure both Blue Lions and Black Eagles. No one is defeated in this shot.

Dialogue:
Sylvain, tense but controlled: "别追太深，守住侧线。"

Audio:
Training footwork, wooden hafts crossing, bowstring tension, dust under boots.
`,
    modelPrompt: `# Shot029 Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot029-R1-CRITICAL-REBUILD
Title: 金鹿夹击青狮后排
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Hilda, Lorenz, Ignatz, Sylvain, Ingrid, Annette

Motion:
Hilda and Lorenz cut into the Blue Lions side lane while Ignatz maintains a diagonal bow threat toward the far Black Eagles lane. Sylvain and Ingrid pivot and hold guard to protect Annette. The shot ends in a tense standoff: Golden Deer has disrupted the route, Blue Lions have not collapsed.

Camera:
Medium-wide diagonal side-lane view, restrained push or settle only.

Performance:
Evenly matched mock-battle pressure. No humiliation, no collapse, no victory pose.

Continuity Locks:
- Only these readable humans may appear: Hilda, Lorenz, Ignatz, Sylvain, Ingrid, Annette.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, training weapons, geography, and screen direction.
- Hilda must remain a youthful academy student with clean student-aged features; no old face or mature glam redesign.
- Nonlethal mock battle only: no blood, gore, lethal hits, or injury.
- Golden Deer must visibly threaten both Blue Lions and the Black Eagles route.

Dialogue:
Sylvain says one line in Chinese: "别追太深，守住侧线。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no Hilda old face, no mature glam Hilda, no wrinkles, no generic adult face, no Ignatz melee weapon, no Annette weapon, no single-target-only attack on Blue Lions, no lethal hit, no blood, no gore, no injury, no humiliation, no static group portrait, no camera-facing performance, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot029C: {
    order: 14,
    titleZh: "库罗德读出双线缺口",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_GdEOuYfRY5F8VZNGFJCgnFLN.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_ogioN1JoXEQZ8vM9eyRUigKI.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_GkXaQKXo9UxKmtBVu0q3oHek.png",
    },
    finalFiles: {
      start: "14R_Shot029C_claude_two_lanes_start.png",
      key: "14R_Shot029C_claude_two_lanes_key.png",
      end: "14R_Shot029C_claude_two_lanes_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-12 重做三帧：库罗德位于侧高点观察两条训练线，亚修在青狮低位发现他，艾黛尔贾特在远处黑鹫线独立调度；三方空间关系清楚，不再是并肩合影。复审重点：亚修蓝狮识别需确认足够清楚。",
    productionChecks: [
      "rebuilt_2026-08-12: start/key/end 已换为库罗德高点读局动作链",
      "named_only: Claude, Ashe, Edelgard",
      "spatial_lock: Claude high side point; Ashe lower Blue Lions lane; Edelgard far Black Eagles lane",
      "no_teamup_lock: Claude and Edelgard separated by distance and lane markers, not allied or side by side",
      "weapon_locks: Claude practice bow; Ashe practice bow; Edelgard training axe if visible",
      "risk_monitor: Ashe Blue Lions color read should be checked again before motion probe",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot029C Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot029C-R1-CRITICAL-REBUILD

Title:
库罗德读出双线缺口

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Claude studies the battlefield from a side high point, raises and half-draws a wooden practice bow, and tracks both the Blue Lions lane below and the distant Black Eagles lane. Ashe notices Claude from the lower Blue Lions lane and turns to warn his side. Edelgard remains far away in the Black Eagles lane, redirecting her own line; she is not beside Claude and not allied with him.

Camera:
Keep the tactical high-point view over Claude's shoulder. Preserve lane depth: Claude high foreground, Ashe lower mid-ground, Edelgard far background.

Performance:
Quiet tactical recognition. Claude is calm and clever; Ashe catches the danger; Edelgard reacts independently.

Continuity Locks:
Only these readable humans may appear: Claude, Ashe, Edelgard.
Correct weapons: Claude practice bow; Ashe practice bow; Edelgard blunt training axe if visible.
Claude and Edelgard must never share one lane, stand side by side, or appear allied.

Dialogue:
Claude, low and precise: "两条线，都露出来了。"

Audio:
Bowstring creak, training-yard wind, distant footwork.
`,
    modelPrompt: `# Shot029C Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot029C-R1-CRITICAL-REBUILD
Title: 库罗德读出双线缺口
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Claude, Ashe, Edelgard

Motion:
Claude reads two separated lanes from the side high point and half-draws his practice bow. Ashe below notices him and turns to warn the Blue Lions lane. Edelgard stays far in the Black Eagles lane and redirects her own line. Keep the three characters spatially separated by height, distance, and lane markers.

Camera:
Tactical over-shoulder/high-point view. No team portrait, no lane collapse.

Performance:
Measured tactical recognition, no victory pose.

Continuity Locks:
- Only these readable humans may appear: Claude, Ashe, Edelgard.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, training weapons, geography, and screen direction.
- Ashe must read as Blue Lions with blue accent; monitor this in review.
- Claude and Edelgard are not allies in this shot and must not stand side by side.
- Nonlethal mock battle only: no blood, gore, lethal hits, or injury.

Dialogue:
Claude says one line in Chinese: "两条线，都露出来了。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no Claude-Edelgard team-up, no Claude and Edelgard side by side, no shared lane for Claude and Edelgard, no Ashe Golden Deer recolor, no fired arrow impact, no lethal hit, no blood, no gore, no injury, no humiliation, no static group portrait, no camera-facing performance, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot031: {
    order: 20,
    titleZh: "贝雷特命令菲力克斯停手",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_D5uEzYXUVm8YK7437Dh9qUZd.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_lTZzcLmQO2jx1nOjB2PX1rl6.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_ev4hmAMFiwAgQHQUxGUd1XyI.png",
    },
    finalFiles: {
      start: "20R_Shot031_byleth_stops_felix_start.png",
      key: "20R_Shot031_byleth_stops_felix_key.png",
      end: "20R_Shot031_byleth_stops_felix_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-12 重做三帧：贝雷特横向切入菲力克斯前压路线，关键帧以手势截住剑路，结束帧菲力克斯收剑停步；从静态对话改为明确的战术制止动作链。仍需独立视频前复审。",
    productionChecks: [
      "rebuilt_2026-08-12: start/key/end 已换为贝雷特制止菲力克斯动作链",
      "named_only: Byleth, Felix",
      "blocking_lock: Byleth lateral intercept; Felix still oriented to route then stops",
      "weapon_locks: Felix blunt wooden practice sword; Byleth open-hand command, no strike",
      "performance_lock: Felix restrained frustration, no celebration or humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot031 Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot031-R1-CRITICAL-REBUILD

Title:
贝雷特命令菲力克斯停手

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Byleth steps laterally into Felix's route and raises an open hand across the intended sword path. Felix stops mid-step, lowers the blunt wooden practice sword, and turns his shoulders back toward Byleth. The beat must explain that Byleth prevents Felix from overextending into a trap.

Camera:
Medium side-on command axis. Preserve the relationship between Byleth's stop gesture and Felix's sword path.

Performance:
Byleth is calm and firm. Felix is frustrated but controlled; he listens and pulls back.

Continuity Locks:
Only these readable humans may appear: Byleth, Felix.
Felix remains in academy uniform with tied dark hair, black vest, white sleeves, gold chest trim, and a safe practice sword.
No contact, no strike, no injury, no humiliation.

Dialogue:
Byleth, calm and firm: "你再走十步，两边都会动。"

Audio:
Boots stopping on grass, a quiet wooden sword shift, Byleth's measured line.
`,
    modelPrompt: `# Shot031 Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot031-R1-CRITICAL-REBUILD
Title: 贝雷特命令菲力克斯停手
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Byleth, Felix

Motion:
Byleth intercepts Felix's forward route with an open-hand stop signal. Felix halts, lowers the practice sword, and turns back toward Byleth instead of continuing forward.

Camera:
Medium side-on command beat, restrained push or settle only.

Performance:
Teacher authority versus restrained student frustration.

Continuity Locks:
- Only these readable humans may appear: Byleth, Felix.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, costumes, safe practice sword, training-yard geography, and side-on screen direction.
- No contact, no strike, no injury, no blood, no humiliation.

Dialogue:
Byleth says one line in Chinese: "你再走十步，两边都会动。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no Felix redesign, no generic black-clad fighter, no wrong weapon, no contact hit, no strike, no injury, no blood, no gore, no humiliation, no aggression, no lethal weapon focus, no camera-facing pose, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot032C: {
    order: 25,
    titleZh: "黑鹫与金鹿互相牵制",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_7Yx8Kj7NXrZzMG1QerDKUC8O.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_zo2NAXLAyPGOLbFdpcoMXW70.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_xi3PPR0YFV4R7jGCFFl14oqV.png",
    },
    finalFiles: {
      start: "25R_Shot032C_black_golden_cross_pressure_start.png",
      key: "25R_Shot032C_black_golden_cross_pressure_key.png",
      end: "25R_Shot032C_black_golden_cross_pressure_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-13 重做三帧：金鹿位于左侧、黑鹫位于右侧，库罗德弓线压住修伯特支援，希尔妲封住朵洛缇雅路线，艾黛尔贾特被迫转身以训练斧防守；画面明确证明金鹿也攻击/牵制黑鹫，且黑鹫仍保持克制高光。仍需独立视频前复审。",
    productionChecks: [
      "rebuilt_2026-08-13: start/key/end 已换为黑鹫与金鹿互相牵制动作链",
      "named_only: Edelgard, Hubert, Dorothea, Claude, Hilda",
      "spatial_lock: Golden Deer left lane; Black Eagles right lane; open contested lane between them",
      "double_pressure_lock: Claude checks Hubert; Hilda checks Dorothea; Edelgard turns to defend Black Eagles backfield",
      "weapon_locks: Edelgard training axe; Hubert dark magic only; Dorothea support magic only; Claude practice bow; Hilda training axe",
      "no_ally_lock: Black Eagles and Golden Deer face each other, not side-by-side teammates",
      "age_lock: Hilda youthful academy student, no old/mature-glam face",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot032C Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot032C-R1-CRITICAL-REBUILD

Title:
黑鹫与金鹿互相牵制

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Golden Deer and Black Eagles restrain each other's backfield routes. Claude raises a practice bow to check Hubert's dark-magic support line. Hilda steps into Dorothea's support route with a low blunt training axe as a barrier. Edelgard turns from her previous push and raises her training axe defensively, keeping the Black Eagles line intact. Hubert and Dorothea keep their magic contained under pressure.

Camera:
Medium-wide diagonal standoff. Golden Deer remain on the left, Black Eagles on the right, with an open contested lane between them. Do not rotate them into a team pose.

Performance:
Mutual tactical respect. Golden Deer earns a clear high-light by disrupting Black Eagles; Black Eagles remain competent and dangerous.

Continuity Locks:
Only these readable humans may appear: Edelgard, Hubert, Dorothea, Claude, Hilda.
Correct weapons: Edelgard blunt wooden training axe; Hubert dark magic only; Dorothea support magic only; Claude practice bow; Hilda blunt wooden training axe.
Black Eagles and Golden Deer must face each other and must not appear allied or side by side.
No Blue Lions appear in this shot.
No one is defeated in this shot.

Dialogue:
Dorothea, controlled: "哎呀，被你们看穿了。"
Hilda, light but focused: "我可不想硬撞上去。"

Audio:
Bowstring tension, contained magic hum, boots shifting in grass.
`,
    modelPrompt: `# Shot032C Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot032C-R1-CRITICAL-REBUILD
Title: 黑鹫与金鹿互相牵制
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Edelgard, Hubert, Dorothea, Claude, Hilda

Motion:
Claude checks Hubert's magic support with a practice-bow line. Hilda blocks Dorothea's support route with a low training axe barrier. Edelgard turns and holds a defensive training-axe guard to protect the Black Eagles backfield. Both houses reset into a tense standoff without anyone being defeated.

Camera:
Medium-wide diagonal standoff, Golden Deer left and Black Eagles right.

Performance:
Balanced tactical pressure. Golden Deer disrupts Black Eagles; Black Eagles remain competent.

Continuity Locks:
- Only these readable humans may appear: Edelgard, Hubert, Dorothea, Claude, Hilda.
- No Blue Lions, unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, training weapons, magic roles, geography, and screen direction.
- Hilda must remain a youthful academy student with clean student-aged features.
- Black Eagles and Golden Deer are opponents, not allies.
- Nonlethal mock battle only: no blood, gore, lethal hits, or injury.

Dialogue:
Dorothea says in Chinese: "哎呀，被你们看穿了。"
Hilda says in Chinese: "我可不想硬撞上去。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no Blue Lions, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no Hilda old face, no mature glam Hilda, no Claude-Edelgard team-up, no Black Eagles and Golden Deer side by side as allies, no magic beam, no explosion, no fired arrow impact, no lethal hit, no blood, no gore, no injury, no humiliation, no static group portrait, no camera-facing performance, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot032F: {
    order: 28,
    titleZh: "菲力克斯与亚修压制修伯特",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_xsmjwloPgeHp0UxkIS0gRab4.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_Av29TiP7pzv75HWIyI3Y9Md0.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_H8jqSedTC3jbIVzI4fN6uP5V.png",
    },
    finalFiles: {
      start: "28R_Shot032F_felix_ashe_contain_hubert_start.png",
      key: "28R_Shot032F_felix_ashe_contain_hubert_key.png",
      end: "28R_Shot032F_felix_ashe_contain_hubert_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-13 重做三帧：菲力克斯近线封住退路，亚修从远角标记施法线，修伯特在结束帧双手离开施法姿态并站到规则线外，体面接受模拟战出局。账本保持 Hubert captured_by_felix_and_ashe，后续不得再主动参战。",
    productionChecks: [
      "rebuilt_2026-08-13: start/key/end 已换为双角度规则压制动作链",
      "named_only: Felix, Ashe, Hubert",
      "outcome_lock: Hubert exits active combat after this shot; Felix and Ashe remain active captors",
      "blocking_lock: Felix blocks retreat lane; Ashe marks casting angle; Hubert lowers hands and crosses out line",
      "weapon_locks: Felix wooden practice sword; Ashe practice bow; Hubert dark magic contained/off",
      "tone_lock: nonlethal mock-battle out call, dignified Hubert, no injury or humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot032F Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot032F-R1-CRITICAL-REBUILD

Title:
菲力克斯与亚修压制修伯特

Duration:
4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Felix and Ashe execute a clean two-angle mock-battle containment. Felix steps into Hubert's retreat lane with a low wooden practice sword barrier. Ashe marks Hubert's casting angle from cover with a practice bow, without firing. Hubert lowers his dark-magic hand, steps beyond the marked rule boundary, and accepts the out call with dignity.

Camera:
Medium-wide triangular composition. Felix near-left, Ashe rear-left, Hubert right. Preserve the rule boundary in the end frame.

Performance:
Precise classroom tactics, respectful outcome. Felix is focused, Ashe calm, Hubert controlled rather than humiliated.

Continuity Locks:
Only these readable humans may appear: Felix, Ashe, Hubert.
After this shot Hubert is no longer an active combatant. Felix and Ashe remain active.
Correct weapons: Felix blunt wooden practice sword; Ashe practice bow; Hubert dark magic contained then off.
No injury, no impact, no projectile, no magic beam.

Dialogue:
Ashe, low: "菲力克斯，现在。"
Felix: "我封路。"
Hubert, controlled: "……判断倒是很快。"

Audio:
Bowstring tension, footstep stop, magic fading.
`,
    modelPrompt: `# Shot032F Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot032F-R1-CRITICAL-REBUILD
Title: 菲力克斯与亚修压制修伯特
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Felix, Ashe, Hubert

Motion:
Felix blocks Hubert's retreat lane with a low wooden practice sword barrier. Ashe marks the casting angle with a practice bow but does not fire. Hubert lowers both hands, extinguishes the dark-magic glow, steps outside the marked rule line, and accepts the mock-battle out call.

Camera:
Medium-wide triangular containment, restrained push or settle only.

Performance:
Respectful rule-based capture. Hubert remains dignified; Felix and Ashe stay focused.

Continuity Locks:
- Only these readable humans may appear: Felix, Ashe, Hubert.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, safe training weapons, magic roles, geography, and screen direction.
- Hubert must end with hands lowered and no active casting posture.
- After this shot Hubert must not return to active combat in later shots.
- Nonlethal mock battle only: no blood, gore, impact, injury, or humiliation.

Dialogue:
Ashe says in Chinese: "菲力克斯，现在。"
Felix says in Chinese: "我封路。"
Hubert says in Chinese: "……判断倒是很快。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no Ashe sitting idle, no Hubert active casting at end, no Hubert returning to combat, no projectile, no magic beam, no explosion, no contact hit, no injury, no blood, no gore, no humiliation, no lethal weapon focus, no static group portrait, no camera-facing pose, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot032G: {
    order: 29,
    titleZh: "库罗德与雷欧妮截住多洛缇雅和贝尔娜提塔",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_0wwN4iONRmbtWMVmMBsYOc0o.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_AU9dP7LPPPYHKcts5m82zbKQ.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_NrP9hTajYsWi2e3Hdei96hlZ.png",
    },
    finalFiles: {
      start: "29R_Shot032G_claude_leonie_capture_backline_start.png",
      key: "29R_Shot032G_claude_leonie_capture_backline_key.png",
      end: "29R_Shot032G_claude_leonie_capture_backline_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：金鹿从右侧压入黑鹫后场，雷欧妮以低位木杆封住规则线，库罗德只用低位弓线标记路线；多洛缇雅和贝尔娜提塔在结束帧放低法具/弓并站到线外，体面退出主动战斗。账本保持 Dorothea/Bernadetta captured_by_leonie_and_claude，后续不得再主动参战。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为金鹿规则封路动作链",
      "named_only: Claude, Leonie, Dorothea, Bernadetta",
      "outcome_lock: Dorothea and Bernadetta exit active combat after this shot; Claude and Leonie remain active captors",
      "blocking_lock: Golden Deer pressure comes from screen right toward Black Eagles backline on screen left",
      "weapon_locks: Claude practice bow lowered/marking line; Leonie blunt wooden practice lance; Dorothea book/spell focus lowered; Bernadetta practice bow lowered",
      "tone_lock: Golden Deer tactical high point, Black Eagles dignified and competent, no injury or humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot032G Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot032G-R1-CRITICAL-REBUILD

Title:
库罗德与雷欧妮截住多洛缇雅和贝尔娜提塔

Duration:
4-6 seconds. Hold the final rule-out state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Golden Deer closes the Black Eagles backline through positioning, not impact. Leonie steps into the lane with a blunt wooden practice lance held low as a safe barrier. Claude stays rear-right and lowers his practice bow to mark the rule line rather than aiming at anyone. Dorothea lowers her book/spell focus and raises an open hand to acknowledge the call. Bernadetta lowers her practice bow close to her body and steps outside the lane.

Camera:
Medium-wide sideline angle. Keep the right-to-left pressure from Golden Deer readable and preserve the rope boundary in the end frame.

Performance:
Claude is calm and clever. Leonie is decisive and fair. Dorothea is composed but disappointed. Bernadetta is tense but upright and safe.

Continuity Locks:
Only these readable humans may appear: Claude, Leonie, Dorothea, Bernadetta.
After this shot Dorothea and Bernadetta are no longer active combatants. Claude and Leonie remain active.
Correct props: Claude wooden practice bow lowered; Leonie blunt wooden practice lance; Dorothea book/spell focus lowered; Bernadetta practice bow lowered.
No projectile, no magic beam, no impact, no injury, no humiliation.

Dialogue:
Claude, quiet: "到这里就够了。"
Leonie: "线被封住了。"
Dorothea: "哎呀……被看穿了呢。"
Bernadetta, small but clear: "我、我知道了。"

Audio:
Rope line creak, soft boots on grass, lowered bowstring, distant training yard ambience.
`,
    modelPrompt: `# Shot032G Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot032G-R1-CRITICAL-REBUILD
Title: 库罗德与雷欧妮截住多洛缇雅和贝尔娜提塔
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Claude, Leonie, Dorothea, Bernadetta

Motion:
Golden Deer uses rule-line positioning to contain the Black Eagles backline. Leonie closes the retreat lane with a low blunt wooden practice lance. Claude lowers his wooden practice bow to mark the boundary and does not aim or fire. Dorothea lowers her book/spell focus and acknowledges the call. Bernadetta lowers her practice bow and steps outside the rope-lane boundary. End with Dorothea and Bernadetta no longer in active attack posture.

Camera:
Medium-wide sideline hold, right-to-left Golden Deer pressure, calm end settle.

Performance:
Tactical and respectful. Golden Deer gets a clear high point; Black Eagles remain competent and dignified.

Continuity Locks:
- Only these readable humans may appear: Claude, Leonie, Dorothea, Bernadetta.
- No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.
- Preserve faces, academy costumes, house colors, safe training weapons, geography, and screen direction.
- Dorothea and Bernadetta must end with weapons/focus lowered and no active combat posture.
- After this shot Dorothea and Bernadetta must not return to active combat in later shots.
- Nonlethal mock battle only: no blood, gore, impact, injury, or humiliation.

Dialogue:
Claude says in Chinese: "到这里就够了。"
Leonie says in Chinese: "线被封住了。"
Dorothea says in Chinese: "哎呀……被看穿了呢。"
Bernadetta says in Chinese: "我、我知道了。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no wrong weapons, no older faces, no generic mannequin faces, no Dorothea helpless or injured, no Bernadetta humiliated or collapsed, no Claude or Leonie cruel, no active casting at end, no bow raised to fire at end, no fired arrow, no projectile, no magic beam, no explosion, no contact hit, no injury, no blood, no gore, no humiliation, no lethal weapon focus, no static group portrait, no camera-facing pose, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot033B: {
    order: 31,
    titleZh: "贝雷特下令分切教师目标",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_lqY4Ymmd0NspNEdnR5EjeTZb.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_IoFxtHkPpbsy4gZFafypUo6T.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_K2mSV1ehNrnx7FpDHgsYhlNK.png",
    },
    finalFiles: {
      start: "31R_Shot033B_byleth_split_teacher_routes_start.png",
      key: "31R_Shot033B_byleth_split_teacher_routes_key.png",
      end: "31R_Shot033B_byleth_split_teacher_routes_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：贝雷特从背后发出分路指令，亚修转入左侧空教师目标线，英谷莉特转入右侧空教师目标线，菲力克斯留中线封路。画面不出现汉尼曼、玛努艾拉或任何教师，避免两名教师被误读成并肩作战。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为清晰分路指挥动作链",
      "named_only: Byleth, Ashe, Ingrid, Felix",
      "teacher_separation_lock: Hanneman and Manuela absent; two far-separated empty objective markers only",
      "route_lock: Ashe left lane; Ingrid right lane; Felix center cover; Byleth commands from rear/foreground",
      "weapon_locks: Ashe practice bow not firing; Ingrid blunt wooden practice lance; Felix blunt wooden practice sword; Byleth not in melee",
      "tone_lock: command beat only, nonlethal classroom tactics, no injury or humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot033B Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot033B-R1-CRITICAL-REBUILD

Title:
贝雷特下令分切教师目标

Duration:
4-6 seconds. Hold the final split-route state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Byleth gives a concise split-route command from the foreground. Ashe moves into the left empty objective lane with his practice bow held ready but not firing. Ingrid moves into the right empty objective lane with a blunt wooden practice lance held low. Felix stays in the center lane with a lowered wooden practice sword, sealing the gap so the routes remain separated.

Camera:
Over-Byleth command angle, medium-wide, preserving the V-shaped route geometry and two far-separated empty objective markers.

Performance:
Tactical and calm. The students respond immediately to Byleth's order without posing at camera.

Continuity Locks:
Only these readable humans may appear: Byleth, Ashe, Ingrid, Felix.
Hanneman and Manuela must not appear in this shot. No teacher figures, no extra students, no crowds, no readable silhouettes.
This shot sets up independent routes: next Ashe can cut to Hanneman's lane, and Ingrid can cut to Manuela's lane. The teachers are separate targets, not a pair.

Dialogue:
Byleth says in Chinese: "亚修左线，英谷莉特右线，菲力克斯守中路。"

Audio:
Boots splitting across dirt, light rope flutter, Byleth's calm command.
`,
    modelPrompt: `# Shot033B Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot033B-R1-CRITICAL-REBUILD
Title: 贝雷特下令分切教师目标
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Byleth, Ashe, Ingrid, Felix

Motion:
Byleth finishes a split-route command. Ashe commits to the left empty objective lane, Ingrid commits to the right empty objective lane, and Felix remains center as route cover. No one attacks in this shot.

Camera:
Over-Byleth command angle, medium-wide, clear V-shaped route split and two empty objective markers.

Performance:
Precise team response to a teacher's tactical order.

Continuity Locks:
- Only these readable humans may appear: Byleth, Ashe, Ingrid, Felix.
- Hanneman and Manuela are absent. Do not show either teacher, any teacher figure, or any adult examiner.
- The left and right objective markers stay empty and far apart.
- Ashe does not fire. Ingrid does not thrust into a body. Felix does not strike. Byleth does not enter melee.
- Nonlethal mock battle only: no blood, gore, impact, injury, or humiliation.

Dialogue:
Byleth says in Chinese: "亚修左线，英谷莉特右线，菲力克斯守中路。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Hanneman, no Manuela, no teacher figures, no adult examiner, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no merged teacher platform, no teachers side by side, no Byleth melee attack, no Ashe firing, no Ingrid thrusting into a body, no Felix striking, no face drift, no costume drift, no weapon drift, no wrong weapons, no sharp spearhead, no metal lethal weapon, no blood, no injury, no humiliation, no static group portrait, no camera-facing pose, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot033C: {
    order: 32,
    titleZh: "亚修压制汉尼曼目标",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_uV483SutARi9JV5tfNKOUFpE.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_WiiyqLwXgs09POIfz92kGJMI.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_LgfevTEx9C2B9ztRcPP744hR.png",
    },
    finalFiles: {
      start: "32R_Shot033C_ashe_suppresses_hanneman_start.png",
      key: "32R_Shot033C_ashe_suppresses_hanneman_key.png",
      end: "32R_Shot033C_ashe_suppresses_hanneman_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：亚修与汉尼曼处于单独左侧教师目标线，玛努艾拉完全不出现。关键帧把训练箭/判定效果落在汉尼曼前方的安全木牌与目标圈上，结束帧亚修放低弓退场，汉尼曼举手认判，证明目标线被压制但无人受伤。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为亚修远程压制汉尼曼独立目标线",
      "named_only: Ashe, Hanneman",
      "teacher_separation_lock: Manuela absent; Hanneman remains on his own independent lane",
      "outcome_lock: Hanneman objective suppressed; Ashe spent_stood_down after this shot",
      "safety_lock: marker hit is on safe target plaque/rule circle, not Hanneman",
      "weapon_locks: Ashe practice bow lowered by end; Hanneman practice spell gesture broken",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot033C Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot033C-R1-CRITICAL-REBUILD

Title:
亚修压制汉尼曼目标

Duration:
4-6 seconds. Hold the final acknowledgement state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Ashe uses his last useful angle to suppress Hanneman's separate objective lane. The practice arrow or marker effect lands on the safe wooden target plaque in front of Hanneman, never on Hanneman. Hanneman's practice spell gesture breaks; he steps back and acknowledges the ruling. Ashe lowers his bow by the end and leaves active combat spent.

Camera:
Over-Ashe diagonal lane view, medium-wide, with the safe target plaque and rope boundary clearly between Ashe and Hanneman.

Performance:
Ashe is focused and respectful. Hanneman is dignified, mildly impressed, and not injured.

Continuity Locks:
Only these readable humans may appear: Ashe, Hanneman.
Manuela must not appear. Hanneman and Manuela are separate targets, not a teacher pair.
After this shot Ashe is no longer active. Hanneman's objective lane is suppressed.

Dialogue:
Ashe says in Chinese: "目标牌。"
Hanneman says in Chinese: "好判断。"

Audio:
Practice bow release, soft wooden target tap, chalk dust, spell hum fading.
`,
    modelPrompt: `# Shot033C Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot033C-R1-CRITICAL-REBUILD
Title: 亚修压制汉尼曼目标
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Ashe, Hanneman

Motion:
Ashe suppresses Hanneman's objective by marking the safe wooden target plaque in front of the magic circle. Hanneman breaks his practice spell gesture and acknowledges the ruling. Ashe lowers his practice bow and stands down by the end.

Camera:
Over-Ashe diagonal lane view, medium-wide, single independent Hanneman lane.

Performance:
Respectful student-versus-teacher tactic. No injury or humiliation.

Continuity Locks:
- Only these readable humans may appear: Ashe, Hanneman.
- Manuela is absent. No second teacher, no teacher pair, no extra students.
- The marker effect must land on the safe target plaque/rule marker, not on Hanneman.
- Hanneman's practice spell is broken, but he remains alive, upright, and dignified.
- After this shot Ashe must not return to active combat.
- Nonlethal mock battle only: no blood, gore, impact on body, injury, or humiliation.

Dialogue:
Ashe says in Chinese: "目标牌。"
Hanneman says in Chinese: "好判断。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Manuela, no second teacher, no teacher partner, no Byleth, no Ingrid, no Felix, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no teachers side by side, no arrow in a person, no arrow hitting Hanneman, no wound, no pain reaction, no active casting at end, no magic beam attack, no explosion, no blood, no injury, no humiliation, no face drift, no costume drift, no weapon drift, no wrong weapons, no sharp lethal arrowhead, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot033D: {
    order: 33,
    titleZh: "英谷莉特逼退玛努艾拉目标",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_lDXONMNp4rQN8N93AGyDZyYS.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_ZssZpvnI2StByP4pfAZcCNvf.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_ru6mKzizmDy0xueVrGE2H9ZQ.png",
    },
    finalFiles: {
      start: "33R_Shot033D_ingrid_sylvain_cut_manuela_start.png",
      key: "33R_Shot033D_ingrid_sylvain_cut_manuela_key.png",
      end: "33R_Shot033D_ingrid_sylvain_cut_manuela_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：英谷莉特与希尔凡在另一条独立教师目标线切断玛努艾拉回援路，汉尼曼完全不出现。关键帧英谷莉特将钝木训练枪点到地面规则线而非玛努艾拉身体，希尔凡只负责占位封路；结束帧三人均收势，玛努艾拉体面认判，英谷莉特和希尔凡也按账本 spent_stood_down。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为玛努艾拉独立路线切断动作链",
      "named_only: Ingrid, Sylvain, Manuela",
      "teacher_separation_lock: Hanneman absent; Manuela is not staged as Hanneman's partner",
      "outcome_lock: Manuela route_cut; Ingrid and Sylvain spent_stood_down after this shot",
      "safety_lock: Ingrid marks ground/rule line with blunt wooden lance, no contact with Manuela",
      "tone_lock: Ingrid tactical high point, Sylvain support, Manuela dignified and uninjured",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot033D Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot033D-R1-CRITICAL-REBUILD

Title:
英谷莉特逼退玛努艾拉目标

Duration:
4-6 seconds. Hold the final route-cut state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak action/composition reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Ingrid cuts Manuela's separate route by stepping to the chalk circle edge and placing her blunt wooden practice lance on the ground rule line, not on Manuela. Sylvain closes the return path by position only. Manuela lowers her wand and acknowledges the route cut. Ingrid and Sylvain relax by the end, spent by the maneuver.

Camera:
Medium-wide sideline view. Keep Ingrid as the action focus, Sylvain as left support, Manuela on the right objective circle.

Performance:
Disciplined and respectful. Ingrid gets a clear tactical high point; Manuela remains composed and uninjured.

Continuity Locks:
Only these readable humans may appear: Ingrid, Sylvain, Manuela.
Hanneman must not appear. Manuela and Hanneman are separate objectives, not a teacher pair.
After this shot Manuela is route_cut, Ingrid and Sylvain are spent_stood_down.

Dialogue:
Ingrid says in Chinese: "回援路断了。"
Manuela says in Chinese: "漂亮的一步。"

Audio:
Fast footwork on dirt, wooden lance tip touching ground, chalk scuff, wand lowering.
`,
    modelPrompt: `# Shot033D Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot033D-R1-CRITICAL-REBUILD
Title: 英谷莉特逼退玛努艾拉目标
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Ingrid, Sylvain, Manuela

Motion:
Ingrid cuts the right-side objective route by marking the ground rule line with her blunt wooden lance. Sylvain blocks the return path by standing position only. Manuela lowers her wand and acknowledges the route cut. End with Ingrid and Sylvain relaxed/spent and Manuela no longer able to continue the route.

Camera:
Medium-wide sideline view, readable chalk circle and rope boundary.

Performance:
Ingrid is precise, Sylvain restrained, Manuela dignified.

Continuity Locks:
- Only these readable humans may appear: Ingrid, Sylvain, Manuela.
- Hanneman is absent. No second teacher, no teacher pair, no extra students.
- Ingrid's lance must touch/mark the ground rule line, not Manuela.
- Sylvain must not attack.
- After this shot Manuela must not return active; Ingrid and Sylvain are spent_stood_down.
- Nonlethal mock battle only: no blood, gore, impact on body, injury, or humiliation.

Dialogue:
Ingrid says in Chinese: "回援路断了。"
Manuela says in Chinese: "漂亮的一步。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Hanneman, no second teacher, no teacher partner, no Byleth, no Ashe, no Felix, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no teachers side by side, no lance touching Manuela, no body thrust, no Sylvain attack, no Manuela active route at end, no active casting at end, no magic beam attack, no explosion, no blood, no injury, no humiliation, no face drift, no costume drift, no weapon drift, no wrong weapons, no sharp spearhead, no metal lethal spear, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot034C: {
    order: 34,
    titleZh: "菲力克斯与费尔迪南特收招",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_5VrhyhrlFExCcTkNXeM7ro8j.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_Te8BDHmjvyB5RER9FR2mLn7f.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_3IOHrAfBO2eXL7Av88bUwYZy.png",
    },
    finalFiles: {
      start: "34R_Shot034C_felix_blocks_ferdinand_start.png",
      key: "34R_Shot034C_felix_blocks_ferdinand_key.png",
      end: "34R_Shot034C_felix_blocks_ferdinand_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：菲力克斯与费尔迪南特只以路线控制决出胜负，画面仅保留二人。关键帧菲力克斯用钝木训练剑压住通往台阶的路线，结束帧菲力克斯收剑退半步，费尔迪南特站立认线且保持体面；无击打、无伤害、无羞辱，费尔迪南特从主动战斗移出，菲力克斯也 spent_stood_down。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为菲力克斯封路动作链",
      "named_only: Felix, Ferdinand",
      "outcome_lock: Ferdinand defeated_by_route_block; Felix spent_stood_down after this shot",
      "route_lock: visible stairs/path/rule line explains why Ferdinand cannot continue",
      "weapon_locks: Felix blunt wooden training sword; Ferdinand blunt wooden training lance/pole",
      "tone_lock: Ferdinand remains upright and dignified; no injury, no humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot034C Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot034C-R1-CRITICAL-REBUILD

Title:
菲力克斯与费尔迪南特收招

Duration:
4-6 seconds. Hold the final route-block state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the peak route-block reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Felix wins by route control only. Felix slides into the stair approach, lowers a blunt wooden training sword across Ferdinand's path without touching him, then withdraws half a step and lets the sword point toward the dirt. Ferdinand checks his momentum before the rule line, lowers his blunt wooden training lance or holds it vertical, and acknowledges that the route is closed while staying upright and composed.

Camera:
Medium-wide side-angle view of the training-ground route, rope boundary, rule line, and stone stairs. Preserve the left-right axis: Felix controls the near-left lane while Ferdinand faces him from the right.

Performance:
Tense but respectful. Felix is sharp and tired, not cruel. Ferdinand is frustrated but dignified, not humiliated.

Continuity Locks:
Only these readable humans may appear: Felix, Ferdinand.
After this shot Ferdinand is defeated_by_route_block and must not return to active combat. Felix is spent_stood_down and must not return to active combat.
Use safe wooden training weapons only.
No strike, no contact, no injury, no blood, no fall, no collapse.

Dialogue:
Felix says in Chinese: "到线了。"
Ferdinand says in Chinese: "……我承认。"

Audio:
Boots stopping on dirt, a wooden sword lowering, Ferdinand's training lance tapping the ground once.
`,
    modelPrompt: `# Shot034C Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot034C-R1-CRITICAL-REBUILD
Title: 菲力克斯与费尔迪南特收招
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Felix, Ferdinand

Motion:
Felix blocks Ferdinand's return route without striking. Felix steps into the lane, points the blunt wooden training sword low across the route line, then lowers it and withdraws half a step. Ferdinand stops before the line, keeps standing, lowers his blunt wooden training lance or holds it vertical, and acknowledges the route-block ruling.

Camera:
Medium-wide side-angle training-ground view with the stone stair route and rope boundary readable. Preserve eyelines between Felix, Ferdinand, and the blocked route. Do not turn either character into a front-facing pose for the camera.

Performance:
Respectful rivalry. Felix is precise and spent. Ferdinand is proud, frustrated, and dignified.

Continuity Locks:
- Only these readable humans may appear: Felix, Ferdinand.
- No Byleth, Edelgard, Hubert, Dorothea, Bernadetta, teachers, unnamed students, extras, spectators, crowds, or readable silhouettes.
- After this shot Ferdinand is defeated_by_route_block and must not return active.
- After this shot Felix is spent_stood_down and must not return active.
- Safe academy mock battle only: no strike, no contact, no injury, no blood, no fall, no collapse, no humiliation.
- Correct weapons: Felix blunt wooden training sword; Ferdinand blunt wooden training lance/pole.

Dialogue:
Felix says in Chinese: "到线了。"
Ferdinand says in Chinese: "……我承认。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Byleth, no Edelgard, no Hubert, no Dorothea, no Bernadetta, no Hanneman, no Manuela, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no strike, no contact, no hit, no injury, no blood, no gore, no fall, no collapse, no humiliation, no metal blade, no sharp spearhead, no lethal weapon, no magic, no face drift, no costume drift, no weapon drift, no wrong weapons, no camera-facing pose, no screen-direction reversal, no active combat at end, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot034D: {
    order: 35,
    titleZh: "贝雷特确认汉尼曼判负",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_Dbb1Qt8VQcSiCyup9Y4UavFQ.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_kjKGtj3XkoqozMl4GVpxRUyb.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_inZXvyMBnv17hljFJ1FSxeAQ.png",
    },
    finalFiles: {
      start: "35R_Shot034D_byleth_rules_hanneman_start.png",
      key: "35R_Shot034D_byleth_rules_hanneman_key.png",
      end: "35R_Shot034D_byleth_rules_hanneman_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-14 重做三帧：汉尼曼在独立魔法练习目标圈内接受贝雷特规则判定，玛努艾拉、亚修和其他学生完全不出现。贝雷特站在侧边规则线外，关键帧指向木制目标牌/地面标记而非汉尼曼身体，结束帧汉尼曼收手体面退离目标圈；教师目标被判负但无伤害、无羞辱。",
    productionChecks: [
      "rebuilt_2026-08-14: start/key/end 已换为独立汉尼曼目标判定动作链",
      "named_only: Byleth, Hanneman",
      "teacher_separation_lock: Manuela absent; Hanneman is not paired with Manuela",
      "outcome_lock: Hanneman objective_defeated_off_sigil and must not return active after this shot",
      "ruling_lock: Byleth stays outside the magic circle and points to the target/rule marker, not Hanneman's body",
      "tone_lock: Hanneman remains upright and dignified; no injury, no humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot034D Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot034D-R1-CRITICAL-REBUILD

Title:
贝雷特确认汉尼曼判负

Duration:
4-6 seconds. Hold the final objective-closed state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the target-ruling reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Byleth confirms Hanneman's separate teacher objective by rule. Byleth stands outside the magic circle, raises a stop signal, then points to the wooden target marker / chalk rule line. Hanneman lowers his practice casting hand, acknowledges the ruling, and steps out of the circle by the end. The faint practice glow on the target marker fades out.

Camera:
Medium-wide side-angle on the magic practice lane. Keep the chalk circle, wooden target marker, and sideline readable. Byleth must remain outside the objective circle.

Performance:
Clear classroom authority and mutual respect. Hanneman is beaten by the objective rule, not attacked.

Continuity Locks:
Only these readable humans may appear: Byleth, Hanneman.
Manuela must not appear. Hanneman and Manuela are separate teacher objectives, not partners in this shot.
After this shot Hanneman is objective_defeated_off_sigil and must not return to active combat.
No magic beam, no body impact, no injury, no humiliation.

Dialogue:
Byleth says in Chinese: "判定成立。"
Hanneman says in Chinese: "我接受。"

Audio:
Chalk dust, a small practice-glow fade, restrained footstep out of the circle.
`,
    modelPrompt: `# Shot034D Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot034D-R1-CRITICAL-REBUILD
Title: 贝雷特确认汉尼曼判负
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Byleth, Hanneman

Motion:
Byleth makes a stop signal from outside the chalk circle, points to the wooden target marker/rule line, then lowers the judging hand. Hanneman drops his practice spell gesture, stops casting, and steps out of the objective circle upright and composed. The target marker glow fades.

Camera:
Medium-wide side-angle view of the magic practice lane, with the chalk circle and target marker readable. Preserve the judging geometry: Byleth outside the circle, Hanneman inside/stepping out.

Performance:
Respectful teacher-objective ruling. Hanneman accepts the result with dignity.

Continuity Locks:
- Only these readable humans may appear: Byleth, Hanneman.
- No Manuela, Ashe, Ingrid, Sylvain, Felix, students, extras, spectators, crowds, or readable silhouettes.
- Hanneman and Manuela are separate objectives and must not appear as a teacher pair.
- After this shot Hanneman is objective_defeated_off_sigil and must not return active.
- Nonlethal mock battle only: no magic beam attack, no body impact, no injury, no blood, no fall, no humiliation.

Dialogue:
Byleth says in Chinese: "判定成立。"
Hanneman says in Chinese: "我接受。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Manuela, no Ashe, no Ingrid, no Sylvain, no Felix, no students, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no teacher pair, no teachers side by side as allies, no Byleth inside the magic circle, no magic beam, no attack, no body impact, no injury, no blood, no gore, no fall, no humiliation, no active casting at end, no face drift, no costume drift, no wrong age, no camera-facing pose, no screen-direction reversal, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot034E: {
    order: 37,
    titleZh: "金鹿高光后体面收势",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_G8wFeODdxtUQNByDmstKhsj1.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_wiXByAy5bpUpMqkEXPe0gVmF.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_DJNNWQcCnL7SmBRwUPA9Okiy.png",
    },
    finalFiles: {
      start: "37R_Shot034E_golden_deer_stand_down_start.png",
      key: "37R_Shot034E_golden_deer_stand_down_key.png",
      end: "37R_Shot034E_golden_deer_stand_down_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-15 重做三帧：金鹿五人作为侧翼高光后的体面收势镜头出现，克劳德给出停手信号，希尔妲保持学院年龄且使用扁平斧刃安全训练斧，洛廉兹与雷欧妮只持钝头训练枪/杆，伊格纳兹收书和弓线；无多余人物、无重启追击、无羞辱。第一版因希尔妲武器像木槌被废弃，当前三帧为第二版通过本地目检的候选。",
    productionChecks: [
      "rebuilt_2026-08-15: start/key/end 已换为金鹿五人体面收势动作链",
      "named_only: Claude, Hilda, Lorenz, Ignatz, Leonie",
      "outcome_lock: all Golden Deer stood_down_defeated_house and must not return active after this shot",
      "hilda_age_lock: Hilda reads as a late-teen academy student, not an older adult",
      "hilda_weapon_lock: Hilda has a flat crescent-bladed safe wooden training axe, not hammer/mallet/mace/flail/cylinder/ball",
      "weapon_locks: Claude and Ignatz bows lowered; Lorenz and Leonie blunt rounded training lances/poles",
      "tone_lock: Golden Deer are respected after a tactical high point, not humiliated or cheering",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot034E Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot034E-R1-CRITICAL-REBUILD

Title:
金鹿高光后体面收势

Duration:
4-6 seconds. Hold the final stand-down state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the stand-down command reference.
Use the uploaded END frame as the final cut-out target.

Motion:
The Golden Deer stand down after their flank succeeds but their class objective is lost. Claude lowers his practice bow and gives a small open-hand stand-down signal. Hilda grounds her flat crescent-bladed wooden training axe safely, keeping the axe visibly a training axe and not a hammer. Lorenz lowers his blunt rounded practice pole. Ignatz closes his book and keeps his bow/quiver inactive. Leonie grounds her blunt rounded practice pole. No one resumes pursuit.

Camera:
Medium-wide training-ground side-flank lane, steady and respectful. Keep all five readable without turning the beat into a posed team portrait.

Performance:
Composed, slightly frustrated, proud. The shot honors Golden Deer competence while making clear they are out of active combat by rule.

Continuity Locks:
Only these readable humans may appear: Claude, Hilda, Lorenz, Ignatz, Leonie.
After this shot Claude, Hilda, Lorenz, Ignatz, and Leonie are stood_down_defeated_house and must not return to active combat.
Hilda must remain youthful and must keep exactly one flat crescent-bladed safe wooden training axe.
No hammer, mallet, mace, flail, ball, cylinder, sharp spearhead, drawn arrow, attack pose, injury, humiliation, or extra people.

Dialogue:
Claude says in Chinese: "到此为止，收势。"
Hilda says in Chinese: "哎呀，差一点呢。"
Leonie says in Chinese: "下次我们抢先一步。"

Audio:
Wooden weapons lowering to dirt, bowstring slackening, controlled breathing, distant referee call.
`,
    modelPrompt: `# Shot034E Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot034E-R1-CRITICAL-REBUILD
Title: 金鹿高光后体面收势
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Claude, Hilda, Lorenz, Ignatz, Leonie

Motion:
Claude gives a small stand-down signal while lowering his practice bow. Hilda grounds exactly one flat crescent-bladed safe wooden training axe. Lorenz lowers a blunt rounded training pole/lance. Ignatz closes his book and keeps bow/quiver inactive. Leonie grounds a blunt rounded training pole/lance. The group settles into a dignified end state.

Camera:
Medium-wide Golden Deer flank-lane view. Preserve the shallow arc, offscreen ruling eyelines, and safe training-ground geography. Avoid a camera-facing portrait.

Performance:
Respectful and balanced: Golden Deer had a tactical high point but accept the objective loss.

Continuity Locks:
- Only these readable humans may appear: Claude, Hilda, Lorenz, Ignatz, Leonie.
- No Byleth, Dimitri, Dedue, Edelgard, Black Eagles, Blue Lions, teachers, unnamed students, spectators, crowds, or readable silhouettes.
- After this shot Claude, Hilda, Lorenz, Ignatz, and Leonie are stood_down_defeated_house and must not return active.
- Hilda must look late-teen academy age and must carry a flat crescent-bladed wooden training axe, not a hammer, mallet, mace, flail, cylinder, ball weapon, metal axe, or heavy war axe.
- Lorenz and Leonie have blunt rounded practice poles/lances, not sharp spearheads.
- Claude and Ignatz keep bows lowered/inactive with no drawn arrows.
- No combat restart, no pursuit, no injury, no blood, no humiliation.

Dialogue:
Claude says in Chinese: "到此为止，收势。"
Hilda says in Chinese: "哎呀，差一点呢。"
Leonie says in Chinese: "下次我们抢先一步。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Byleth, no Dimitri, no Dedue, no Edelgard, no Black Eagles, no Blue Lions, no teachers, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no older Hilda, no adult Hilda, no mannequin face, no plastic doll face, no Hilda hammer, no Hilda mallet, no Hilda mace, no Hilda flail, no Hilda cylinder weapon, no Hilda ball weapon, no metal axe, no heavy war axe, no Lorenz sharp spearhead, no Leonie sharp spearhead, no drawn arrow, no bow firing, no active pursuit, no attack pose, no combat restart, no injury, no blood, no gore, no humiliation, no cheering victory pose, no face drift, no costume drift, no weapon drift, no camera-facing team portrait, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot034F: {
    order: 38,
    titleZh: "黑鹫体面收势",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_u1pjrrQl0jWifqhhZ46L4J5U.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_O9DP4ZHAE5qH9g4TzakIAusO.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_kxsJnSxh5ztvcwTTIdGgZffq.png",
    },
    finalFiles: {
      start: "38R_Shot034F_black_eagles_stand_down_start.png",
      key: "38R_Shot034F_black_eagles_stand_down_key.png",
      end: "38R_Shot034F_black_eagles_stand_down_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-15 重做三帧：黑鹫只保留艾黛尔贾特与费尔迪南特，修伯特、多洛缇雅、贝尔娜提塔不回场。艾黛尔贾特以领导者姿态主动下令收势，安全训练斧始终低放/落地；费尔迪南特在已被封路后的非主动语境中持钝木杆退场，双方体面而不羞辱。",
    productionChecks: [
      "rebuilt_2026-08-15: start/key/end 已换为黑鹫二人体面收势动作链",
      "named_only: Edelgard, Ferdinand",
      "captured_absence_lock: Hubert, Dorothea, Bernadetta absent after capture",
      "outcome_lock: Edelgard stood_down_defeated_house; Ferdinand remains defeated_by_route_block",
      "non_active_context_lock: Ferdinand is visible only as stood-down/non-active and must not resume combat",
      "weapon_locks: Edelgard safe wooden training axe low/grounded; Ferdinand blunt wooden practice pole grounded/low",
      "tone_lock: Black Eagles lose the objective narrowly and with dignity, not humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot034F Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot034F-R1-CRITICAL-REBUILD

Title:
黑鹫体面收势

Duration:
4-6 seconds. Hold the final stand-down state for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the stand-down command reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Edelgard receives the offscreen ruling, lowers her safe wooden training axe, and gives a restrained stand-down command. Ferdinand remains one step back in non-active context after being route-blocked, lowering his blunt wooden practice pole and accepting the result. Hubert, Dorothea, and Bernadetta do not appear because they were captured earlier.

Camera:
Medium-wide Black Eagles courtyard view with red banner and empty space around the two students. Keep the beat quiet and dignified.

Performance:
Close-contest loss. Edelgard is composed and proud; Ferdinand is frustrated but accepting. No collapse, no mockery.

Continuity Locks:
Only these readable humans may appear: Edelgard, Ferdinand.
Hubert, Dorothea, and Bernadetta must not appear after capture.
After this shot Edelgard is stood_down_defeated_house and Ferdinand remains defeated_by_route_block; neither returns active.
No combat restart, no attack pose, no sharp weapon, no injury, no blood, no humiliation.

Dialogue:
Edelgard says in Chinese: "黑鹫，收势。"
Ferdinand says in Chinese: "我会记住这一步。"

Audio:
Wooden axe resting on stone, practice pole grounding, red banner moving faintly.
`,
    modelPrompt: `# Shot034F Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot034F-R1-CRITICAL-REBUILD
Title: 黑鹫体面收势
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Edelgard, Ferdinand

Motion:
Edelgard makes a controlled stand-down command and lowers her safe wooden training axe to an inactive grounded rest. Ferdinand, already route-blocked, lowers his blunt wooden practice pole and accepts the ruling without re-entering combat. End with both Black Eagles still, composed, and inactive.

Camera:
Medium-wide Black Eagles courtyard view. Preserve empty space around them so no captured teammate appears.

Performance:
Dignified narrow loss. Edelgard remains commanding; Ferdinand remains proud but non-active.

Continuity Locks:
- Only these readable humans may appear: Edelgard, Ferdinand.
- No Hubert, Dorothea, Bernadetta, Blue Lions, Golden Deer, teachers, unnamed students, spectators, crowds, or readable silhouettes.
- Captured Hubert, Dorothea, and Bernadetta must not reappear in readable form.
- After this shot Edelgard is stood_down_defeated_house and Ferdinand remains defeated_by_route_block; neither returns active.
- Ferdinand is visible only in non-active stand-down context.
- Safe academy mock battle only: no combat restart, no attack, no sharp weapon, no injury, no blood, no humiliation.

Dialogue:
Edelgard says in Chinese: "黑鹫，收势。"
Ferdinand says in Chinese: "我会记住这一步。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Hubert, no Dorothea, no Bernadetta, no Blue Lions, no Golden Deer, no teachers, no Byleth, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no captured teammate reappears, no Ferdinand active combat, no Ferdinand charge, no Edelgard attack, no combat restart, no sharp weapon, no metal strike, no axe swing, no spearhead, no injury, no blood, no gore, no humiliation, no collapse, no cheering victory pose, no face drift, no costume drift, no weapon drift, no wrong age, no camera-facing team portrait, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot035: {
    order: 41,
    titleZh: "菲力克斯接受贝雷特提醒",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_6ljjH4JyPNJ5C191UoymHyDG.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_KOqB1YSPGgVVOeLkEJawsStf.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_8aj8MT4ttBAKS9oMBUvpxT4f.png",
    },
    finalFiles: {
      start: "41R_Shot035_felix_byleth_post_battle_start.png",
      key: "41R_Shot035_felix_byleth_post_battle_key.png",
      end: "41R_Shot035_felix_byleth_post_battle_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-15 重做三帧：菲力克斯与贝雷特只作为战后收束对话出现。菲力克斯已 spent_stood_down，训练剑始终低放/收起；贝雷特用教师式停手提醒而不接战。全镜仅二人，无其他学生回场，无新战斗、无攻击、无羞辱。",
    productionChecks: [
      "rebuilt_2026-08-15: start/key/end 已换为战后对话动作链",
      "named_only: Felix, Byleth",
      "non_active_context_lock: Felix is visible only after standing down and must not return active",
      "weapon_lock: Felix wooden training sword stays low/sheathed/inactive; Byleth uses teacher gesture only",
      "outcome_lock: no attrition change; previous battle ledger preserved",
      "tone_lock: quiet correction after narrow Blue Lions win, no humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot035 Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot035-R1-CRITICAL-REBUILD

Title:
菲力克斯接受贝雷特提醒

Duration:
4-6 seconds. Hold the final quiet acknowledgement for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the teacher-reminder reference.
Use the uploaded END frame as the final cut-out target.

Motion:
After the mock-battle ruling, Felix remains out of active combat. Byleth raises one calm open hand as a teacher reminder, then lowers it. Felix lets his shoulders settle, keeps his wooden training sword sheathed or low and inactive, and answers with reluctant respect. No one resumes fighting.

Camera:
Medium two-shot on the training-ground edge with rope boundary and monastery stone behind them. Keep the diagonal eyeline between Felix and Byleth.

Performance:
Quiet character beat. Byleth is calm and precise; Felix is sharp, tired, and restrained.

Continuity Locks:
Only these readable humans may appear: Felix, Byleth.
Felix is spent_stood_down before and after this shot and must not return active.
No other students, no teachers, no extras, no combat restart, no raised sword, no attack, no magic, no injury, no humiliation.

Dialogue:
Byleth says in Chinese: "到此为止。你已经赢了该赢的那一步。"
Felix says in Chinese: "……我知道。"

Audio:
Quiet training-ground ambience, distant settling crowd, leather glove lowering, Felix exhaling.
`,
    modelPrompt: `# Shot035 Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot035-R1-CRITICAL-REBUILD
Title: 菲力克斯接受贝雷特提醒
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Felix, Byleth

Motion:
Byleth gives a calm teacher stop/reminder gesture and then lowers the hand. Felix, already spent and stood down, keeps his wooden training sword low or sheathed, relaxes his shoulders, and acknowledges the correction without re-entering combat.

Camera:
Medium two-shot on the training-ground edge. Preserve diagonal eyelines and do not make either character pose at camera.

Performance:
Restrained post-battle respect. No escalation.

Continuity Locks:
- Only these readable humans may appear: Felix, Byleth.
- No Dimitri, Dedue, Edelgard, Black Eagles, Golden Deer, teachers, unnamed students, spectators, crowds, or readable silhouettes.
- Felix is visible only in non-active post-battle context.
- After this shot Felix remains spent_stood_down and must not return active.
- No combat restart, no raised sword, no attack, no magic, no injury, no blood, no humiliation.

Dialogue:
Byleth says in Chinese: "到此为止。你已经赢了该赢的那一步。"
Felix says in Chinese: "……我知道。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Dimitri, no Dedue, no Edelgard, no Black Eagles, no Golden Deer, no teachers, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no Felix active combat, no Felix attack, no raised sword, no sword swing, no Byleth attack, no combat restart, no magic, no injury, no blood, no gore, no humiliation, no collapse, no face drift, no costume drift, no weapon drift, no wrong age, no camera-facing pose, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
  Shot029B: {
    order: 16,
    titleZh: "金鹿压线，青狮守住侧翼",
    productionDir: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/critical_reaudit_rebuild_2026-08-12",
    sourceFiles: {
      start: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_TnwWVFiNiG3wTSIK8foy7Raj.png",
      key: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_HVWugQdfRq9T7eFpvbKuv5nO.png",
      end: "/Users/zekun/.codex/generated_images/019f7614-bf16-7c11-b627-99b51e0409e0/call_22XYGzE2gf56CGPn93Pua3iG.png",
    },
    finalFiles: {
      start: "16R_Shot029B_golden_deer_blue_lions_route_start.png",
      key: "16R_Shot029B_golden_deer_blue_lions_route_key.png",
      end: "16R_Shot029B_golden_deer_blue_lions_route_end.png",
    },
    status: "monitor_required_after_rebuild",
    decision: "rebuilt_pending_independent_visual_review",
    visualReviewNote:
      "2026-08-15 重做三帧：金鹿从画面左侧压迫青狮侧翼，希尔凡和英谷莉特在右侧转身正面接住；五名学生朝向对手/路线，非镜头摆拍。希尔妲保持学院年龄并使用扁平训练斧，洛廉兹、希尔凡、英谷莉特均为钝头训练枪/杆，伊格纳兹后排弓线不拉弦。双方势均力敌，无人退场、无击伤、无陌生人。",
    productionChecks: [
      "rebuilt_2026-08-15: start/key/end 已换为五人路线争夺动作链",
      "named_only: Hilda, Lorenz, Ignatz, Sylvain, Ingrid",
      "screen_direction_lock: Golden Deer press from screen-left; Blue Lions face them from screen-right",
      "outcome_lock: no attrition change; all five remain active after this shot",
      "hilda_age_weapon_lock: Hilda reads late-teen and has flat crescent-bladed safe wooden training axe, not hammer/mallet/mace/flail/cylinder/ball",
      "weapon_locks: Lorenz, Sylvain, Ingrid blunt rounded training lances/poles; Ignatz bow lowered with no drawn arrow",
      "balance_lock: Golden Deer get flank pressure high point; Blue Lions hold barely, no rout or humiliation",
      "remaining_gate: independent visual review and motion probe still required",
    ],
    prompt: `# Shot029B Production Video Prompt Candidate R1

Status: monitor_required_after_rebuild

Shot ID:
EP02-SC09-Shot029B-R1-CRITICAL-REBUILD

Title:
金鹿压线，青狮守住侧翼

Duration:
4-6 seconds. Hold the final balanced standoff for the last 0.5 seconds.

Input Frames:
Use the uploaded START frame as the first-frame anchor.
Use the uploaded KEY frame as the route-pressure peak reference.
Use the uploaded END frame as the final cut-out target.

Motion:
Golden Deer press from screen-left into the Blue Lions flank. Hilda steps in with a flat crescent-bladed safe wooden training axe held low across the dirt rule line. Lorenz advances with a blunt rounded practice lance/pole. Ignatz trails behind with his bow lowered, marking the route by position only and never drawing an arrow. Sylvain and Ingrid pivot from screen-right to face the pressure and set their blunt practice lances low as a defensive barrier. The exchange peaks at the rule line, then both sides separate half a step with no defeat.

Camera:
Medium-wide side-flank lane. Preserve the left-to-right pressure axis and keep everyone looking toward opponents or the route line, not camera.

Performance:
Evenly matched and tactical. Golden Deer receive a credible high point; Blue Lions hold by a narrow margin.

Continuity Locks:
Only these readable humans may appear: Hilda, Lorenz, Ignatz, Sylvain, Ingrid.
No attrition changes after this shot; all five remain active.
No Byleth, Dimitri, Black Eagles, teachers, extras, spectators, crowds, or readable silhouettes.
No body impact, no injury, no humiliation, no clean rout.
Hilda must remain youthful and must keep a flat crescent-bladed safe wooden training axe, not a hammer.

Dialogue:
Hilda says in Chinese: "这边借过一下？"
Sylvain says in Chinese: "抱歉，这条路不借。"
Ingrid says in Chinese: "守住线。"

Audio:
Boots on dirt, wooden practice weapons scraping low, rope boundary creak, no impact hit.
`,
    modelPrompt: `# Shot029B Model-Ready Video Prompt

Shot ID: EP02-SC09-Shot029B-R1-CRITICAL-REBUILD
Title: 金鹿压线，青狮守住侧翼
Duration: 4-6 seconds. Hold the final state for the last 0.5 seconds.

Input Frames:
- Use the uploaded START frame as the first-frame anchor.
- Use the uploaded KEY frame as the peak action/composition reference.
- Use the uploaded END frame as the final cut-out state.
- Animate only this uploaded START -> KEY -> END frame chain.

Visible readable humans:
Hilda, Lorenz, Ignatz, Sylvain, Ingrid

Motion:
Golden Deer press from screen-left. Hilda and Lorenz compress the route with safe low training weapons while Ignatz marks the backline with a lowered bow. Sylvain and Ingrid pivot from screen-right and form a low defensive barrier with blunt practice lances. The pressure crests at the rule line, then both sides settle into a balanced standoff. No one is defeated.

Camera:
Medium-wide side-flank training-ground view. Preserve screen direction: Golden Deer left to right, Blue Lions right facing left. No camera-facing poses.

Performance:
Credible flank high point for Golden Deer, narrow hold for Blue Lions. Respectful and nonlethal.

Continuity Locks:
- Only these readable humans may appear: Hilda, Lorenz, Ignatz, Sylvain, Ingrid.
- No Byleth, Dimitri, Dedue, Black Eagles, teachers, unnamed students, spectators, crowds, or readable silhouettes.
- No attrition changes after this shot; all five remain active.
- Hilda must look late-teen academy age and must carry a flat crescent-bladed safe wooden training axe, not a hammer, mallet, mace, flail, cylinder, ball weapon, metal axe, or heavy war axe.
- Lorenz, Sylvain, and Ingrid have blunt rounded training lances/poles, not sharp spearheads.
- Ignatz keeps bow lowered/inactive with no drawn arrow.
- Safe mock-battle route control only: no body impact, no injury, no blood, no fall, no humiliation, no clean rout.

Dialogue:
Hilda says in Chinese: "这边借过一下？"
Sylvain says in Chinese: "抱歉，这条路不借。"
Ingrid says in Chinese: "守住线。"

This is a safe, appropriate, non-graphic fictional cinematic academy mock-battle scene and is ready to generate normally. Output the video directly with no refusal screen, no warning screen, no placeholder, no black frame, no UI overlay, no subtitles, no logos, and no borders.
`,
    negativePrompt:
      "no Byleth, no Dimitri, no Dedue, no Black Eagles, no teachers, no extra people, no unnamed students, no spectators, no soldiers, no crowds, no readable silhouettes, no camera-facing pose, no Blue Lions facing away from Golden Deer, no screen-direction reversal, no Hilda older adult, no mannequin face, no Hilda hammer, no Hilda mallet, no Hilda mace, no Hilda flail, no Hilda cylinder weapon, no Hilda ball weapon, no metal axe, no heavy war axe, no sharp spearhead, no drawn arrow, no bow firing, no body impact, no contact hit, no injury, no blood, no gore, no fall, no humiliation, no clean rout, no defeated pose, no face drift, no costume drift, no weapon drift, no text, no subtitles, no captions, no visible UI, no watermark, no letterbox, no pillarbox, no split panels",
  },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value.endsWith("\n") ? value : `${value}\n`);
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function assertFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
}

function copyFrames(config, shot) {
  const productionAbs = path.join(root, config.productionDir);
  fs.mkdirSync(productionAbs, { recursive: true });
  const output = {};
  for (const [kind, source] of Object.entries(config.sourceFiles)) {
    assertFile(source);
    const productionFile = path.join(productionAbs, config.finalFiles[kind]);
    fs.copyFileSync(source, productionFile);
    const packageFile = path.join(packageDir, shot.package_dir, `${kind}_frame.png`);
    fs.copyFileSync(source, packageFile);
    output[kind] = rel(productionFile);
  }
  return output;
}

function updateShotRecord(record, config, framePaths) {
  record.status = config.status;
  record.decision = config.decision;
  record.title = config.titleZh;
  record.titleZh = config.titleZh;
  record.start_frame = framePaths.start;
  record.key_frame = framePaths.key;
  record.end_frame = framePaths.end;
  record.source_frames = {
    start_frame: framePaths.start,
    key_frame: framePaths.key,
    end_frame: framePaths.end,
  };
  record.frames = {
    start: { path: framePaths.start },
    key: { path: framePaths.key },
    end: { path: framePaths.end },
    start_frame: framePaths.start,
    key_frame: framePaths.key,
    end_frame: framePaths.end,
  };
  record.visual_review_status = "rebuilt_pending_independent_visual_review";
  record.full_local_visual_review_status = "rebuilt_pending_independent_visual_review";
  record.fullLocalVisualReviewStatus = "rebuilt_pending_independent_visual_review";
  record.full_local_visual_review_note = config.visualReviewNote;
  record.primary_check = config.visualReviewNote;
  record.productionQaStatus = config.status;
  record.productionQaChecks = config.productionChecks;
  record.critical_reaudit = {
    status: config.status,
    decision: config.decision,
    previous_decision: "blocked_needs_revision",
    rebuilt_at: "2026-08-12T00:00:00.000Z",
    visual_assessment: config.visualReviewNote,
    required_followup: "independent_visual_review_before_motion_probe_or_video_submission",
  };
  const rejects = new Set([...(record.reject_if || []), ...config.negativePrompt.split(",").map((item) => item.trim()).filter(Boolean)]);
  record.reject_if = [...rejects];
  applyLedgerDisplayFields(record);
}

function flattenGroupValues(groups) {
  if (!groups || typeof groups !== "object") return [];
  return Object.entries(groups).flatMap(([group, names]) => (names || []).map((name) => `${group}: ${name}`));
}

function groupText(groups) {
  const values = flattenGroupValues(groups);
  return values.length ? values.join("; ") : "none";
}

function changeText(changes) {
  if (!Array.isArray(changes) || !changes.length) return "none";
  return changes.map((item) => `${item.name}: ${item.status || item.label || "changed"}`).join("; ");
}

function ledgerFor(record) {
  const nested = record.battle_state_after?.battle_ledger_after;
  if (nested && Object.keys(nested).length) return nested;
  const topLevel = record.battle_ledger_after;
  if (topLevel && Object.keys(topLevel).length) return topLevel;
  return null;
}

function applyLedgerDisplayFields(record) {
  const ledger = ledgerFor(record);
  if (!ledger) return;
  record.battle_ledger_after = ledger;
  record.alive_safe_after = groupText(ledger.alive_by_house);
  record.active_or_objective_after = groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house);
  record.limited_after = groupText(ledger.limited_but_not_defeated_by_house);
  record.defeated_removed_after = groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house);
  record.captured_objective_defeated_after = groupText(ledger.captured_or_objective_defeated_by_house);
  record.stood_down_post_battle_after = groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house);
  record.must_not_return_active_after = groupText(ledger.must_not_return_active_by_house);
  record.changed_this_shot = ledger.changed_this_shot || [];
  record.no_active_combat_line = groupText(ledger.must_not_return_active_by_house);
}

function withBattleLedgerBlock(text, record) {
  const ledger = ledgerFor(record);
  const blocks = [text.trimEnd()];
  if (!text.includes("No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.")) {
    blocks.push("No unnamed students, extras, spectators, soldiers, crowds, or readable silhouettes.");
  }
  if (!/any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears/i.test(text)) {
    blocks.push("Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.");
  }
  if (!ledger || text.includes("Battle Ledger After This Shot:")) return `${blocks.join("\n")}\n`;
  blocks.push([
    "",
    "Battle Ledger After This Shot:",
    `- All named characters alive/safe: ${ledger.all_named_characters_alive === true ? "true" : "check_required"}.`,
    `- Alive/safe by house: ${groupText(ledger.alive_by_house)}.`,
    `- Active or controlling objective after: ${groupText(ledger.still_active_or_controlling_objective_by_house || ledger.active_by_house)}.`,
    `- Limited but not defeated after: ${groupText(ledger.limited_but_not_defeated_by_house)}.`,
    `- Defeated/removed after: ${groupText(ledger.mock_battle_defeated_or_removed_by_house || ledger.defeated_removed_by_house)}.`,
    `- Stood down/post-battle after: ${groupText(ledger.stood_down_or_post_battle_by_house || ledger.stood_down_post_battle_by_house)}.`,
    `- Must not return active after this shot: ${groupText(ledger.must_not_return_active_by_house)}.`,
    `- Changed this shot: ${changeText(ledger.changed_this_shot)}.`,
    "",
    `No-active-combat after this shot: ${groupText(ledger.must_not_return_active_by_house)}.`,
  ].join("\n"));
  return `${blocks.join("\n")}\n`;
}

function currentPackageFrameSet(packageDir) {
  return [
    {
      role: "start",
      label: "起始帧",
      path: `${packageDir}/start_frame.png`,
      status: "rebuilt_pending_review",
      intent: "重做后的动作起点，需与关键帧形成可动画链条。",
    },
    {
      role: "key",
      label: "关键帧",
      path: `${packageDir}/key_frame.png`,
      status: "rebuilt_pending_review",
      intent: "重做后的动作峰值，主看板默认展示这一帧。",
    },
    {
      role: "end",
      label: "结束帧",
      path: `${packageDir}/end_frame.png`,
      status: "rebuilt_pending_review",
      intent: "重做后的出镜/退场状态，锁定后续账本连续性。",
    },
  ];
}

function setSiteShotCurrentFrames(siteShot, shotPackageDir, config) {
  const siteShotDir = `${rel(packageDir)}/${shotPackageDir}`;
  const start = `${siteShotDir}/start_frame.png`;
  const key = `${siteShotDir}/key_frame.png`;
  const end = `${siteShotDir}/end_frame.png`;
  const frameSet = currentPackageFrameSet(siteShotDir);
  siteShot.still = key;
  siteShot.displayImagePath = key;
  siteShot.productionKeyframePath = key;
  siteShot.productionStartFramePath = start;
  siteShot.payloadProductionImagePath = start;
  siteShot.startFrame = start;
  siteShot.keyFrame = key;
  siteShot.endFrame = end;
  siteShot.frameSet = frameSet;
  siteShot.productionFrameSet = frameSet;
  siteShot.videoPackageFrames = {
    start_frame: start,
    key_frame: key,
    end_frame: end,
  };
  siteShot.source_frames = {
    start_frame: start,
    key_frame: key,
    end_frame: end,
  };
  siteShot.displayImageStatus = config.status;
  siteShot.displayImageSource = "scene09_critical_rebuild_2026-08-12";
}

function updateCriticalReport(shotId, config) {
  const report = readJson(criticalJsonPath);
  const shot = report.shots.find((item) => item.shot === shotId);
  if (shot) {
    shot.decision = config.status;
    shot.visual_assessment = config.visualReviewNote;
    shot.blocking_issues = [];
    shot.remaining_issues = [
      "新三帧尚未经过独立复审。",
      "视频探针前仍需确认动作链、武器、朝向和人脸稳定。",
    ];
    shot.required_revision = "已完成 R1 重做；等待独立视觉复审。";
  }
  report.counts = report.counts || {};
  report.counts.rebuilt_pending_review = report.shots.filter((item) => item.decision === "monitor_required_after_rebuild").length;
  report.counts.blocked_needs_revision = report.shots.filter((item) => item.decision === "blocked_needs_revision").length;
  report.updated_at = "2026-08-12T00:00:00.000Z";
  writeJson(criticalJsonPath, report);
  const md = fs.readFileSync(criticalMdPath, "utf8");
  const note = `\n\n## 2026-08-12 Rebuild Update\n\n- ${shotId} ${config.titleZh}: 已重做 start/key/end 三帧，状态改为 \`${config.status}\`；仍需独立视觉复审后才能进入视频探针。\n`;
  if (!md.includes(`${shotId} ${config.titleZh}: 已重做`)) writeText(criticalMdPath, `${md.trimEnd()}${note}`);
}

function parseSiteData() {
  const text = fs.readFileSync(siteDataPath, "utf8");
  const match = text.match(/^window\.EP02_STORYBOARD_DATA = ([\s\S]*);\s*$/);
  if (!match) throw new Error("Could not parse site/ep02_storyboard_data.js");
  return JSON.parse(match[1]);
}

function writeSiteData(data) {
  writeText(siteDataPath, `window.EP02_STORYBOARD_DATA = ${JSON.stringify(data, null, 2)};`);
}

function updateCounts(manifest, siteData) {
  const blocked = manifest.shots.filter((shot) => shot.status === "blocked_needs_revision").map((shot) => shot.shot);
  const rebuilt = manifest.shots.filter((shot) => shot.status === "monitor_required_after_rebuild").map((shot) => shot.shot);
  const layout = manifest.shots.filter((shot) => shot.status === "layout_reference").map((shot) => shot.shot);
  const monitor = manifest.shots.filter((shot) => shot.status === "monitor_required").map((shot) => shot.shot);
  manifest.critical_reaudit = {
    ...(manifest.critical_reaudit || {}),
    decision: blocked.length ? "critical_reaudit_blocked_needs_revision" : "critical_reaudit_rebuild_pending_reviews",
    blocked_shots: blocked,
    rebuilt_pending_review: rebuilt,
    layout_reference_only: layout,
    monitor_required: monitor,
  };
  manifest.status = manifest.critical_reaudit.decision;
  manifest.updated_at = "2026-08-12T00:00:00.000Z";
  siteData.mockBattleOperatorStatus = siteData.mockBattleOperatorStatus || {};
  siteData.mockBattleOperatorStatus.current_phase = "critical_reaudit_rebuild_in_progress";
  siteData.mockBattleOperatorStatus.next_action = "continue_rebuilding_blocked_storyboard_frames";
  siteData.mockBattleOperatorStatus.status_line = `${manifest.status}; rebuilt_pending_review=${rebuilt.length}; blocked=${blocked.length}`;
  siteData.mockBattleOperatorStatus.can_submit_full_duration = false;
  siteData.mockBattleOperatorStatus.can_run_local_cli = false;
  siteData.mockBattleOperatorStatus.counts = {
    ...(siteData.mockBattleOperatorStatus.counts || {}),
    completion_failed_checks: blocked,
    critical_blocked_shots: blocked.length,
    rebuilt_pending_review_shots: rebuilt.length,
    layout_reference_shots: layout.length,
    monitor_required_shots: monitor.length,
  };
}

function main() {
  const shotId = process.argv[2] || "Shot027B";
  const config = rebuilds[shotId];
  if (!config) throw new Error(`No rebuild config for ${shotId}`);

  const manifest = readJson(manifestPath);
  const shot = manifest.shots.find((item) => item.shot === shotId);
  if (!shot) throw new Error(`No package shot for ${shotId}`);
  const framePaths = copyFrames(config, shot);

  updateShotRecord(shot, config, framePaths);
  writeJson(manifestPath, manifest);

  const metadataPath = path.join(packageDir, shot.package_dir, "metadata.json");
  const metadata = readJson(metadataPath);
  updateShotRecord(metadata, config, framePaths);
  writeJson(metadataPath, metadata);
  writeText(path.join(packageDir, shot.package_dir, "prompt.md"), withBattleLedgerBlock(config.prompt, shot));
  writeText(path.join(packageDir, shot.package_dir, "model_prompt.md"), withBattleLedgerBlock(config.modelPrompt, shot));
  writeText(path.join(packageDir, shot.package_dir, "negative_prompt.md"), config.negativePrompt);

  const siteData = parseSiteData();
  const siteShot = siteData.shots.find((item) => item.shot === shotId);
  if (siteShot) {
    siteShot.title = config.titleZh;
    siteShot.titleZh = config.titleZh;
    setSiteShotCurrentFrames(siteShot, shot.package_dir, config);
    siteShot.productionQaStatus = config.status;
    siteShot.productionQaChecks = config.productionChecks;
    applyLedgerDisplayFields(siteShot);
    siteShot.fullLocalVisualReviewStatus = "rebuilt_pending_independent_visual_review";
    siteShot.fullLocalVisualReviewDecision = config.decision;
    siteShot.fullLocalVisualReviewNote = config.visualReviewNote;
    siteShot.fullLocalVisualReviewVideoReadiness = "not_approved_for_video_until_independent_reaudit";
    siteShot.handoffShotMetadataFile = `${shot.package_dir}/metadata.json`;
    siteShot.modelReadyPromptFile = `${shot.package_dir}/model_prompt.md`;
    siteShot.modelReadyNegativePromptFile = `${shot.package_dir}/negative_prompt.md`;
    siteShot.auditPromptFile = `${shot.package_dir}/prompt.md`;
  }
  updateCounts(manifest, siteData);
  writeJson(manifestPath, manifest);
  updateCriticalReport(shotId, config);
  fs.copyFileSync(criticalJsonPath, path.join(packageDir, "critical_reaudit_2026-08-12.json"));
  fs.copyFileSync(criticalMdPath, path.join(packageDir, "critical_reaudit_2026-08-12.md"));
  writeSiteData(siteData);

  console.log(`Updated ${shotId}: ${config.status}`);
}

main();

# Voiceover and Dialogue Script

Project ID: `KAK-BYLETH-LECTURE`
Artifact Type: script_scene
Stage: writing
Status: candidate_generated
Depends On: `project_bible.md`, `outline.md`, `shot_list.md`

## Scene Contract

Scene ID: `KAK-BYLETH-LECTURE-SCENE`
Location: Garreg Mach Officers Academy classroom and training ground
Time: Daylight lesson period
Characters Present: Female Byleth; 艾黛尔、莉丝缇亚、梅尔赛德斯作为三学级学生代表
Scene Purpose: Use a tactical lesson to explain the 2D needle problem from intuition to proof mechanism and mathematical impact.
Conflict: Students trust area intuition; Female Byleth forces them to test it under changing geometric rules.
Emotional State In: Curious confidence
Emotional Turn: Confidence breaks when non-convex overlap defeats minimum-area intuition
Emotional State Out: Respect for many-direction geometry as a real mathematical structure
Character Choice: Female Byleth withholds the problem's name until students understand the mechanism, choosing demonstration over authority.
Visual Payoff: The red unit sword dissolves into green all-direction fans and blue `delta`-tubes.
Continuity Hooks: If expanded downstream, next stage should create frame prompts for SH001-SH034.
Canon / Adaptation Locks: Use Female Byleth / BylethFemale / 女贝老师 only. She remains 16, calm, precise, academy-professor era; Garreg Mach remains medieval fantasy academy.
Production Risks: Too much exposition; formulas without diagrams; overclaiming applications.
Reject If: The scene can be understood only by reading subtitles; the proof mechanism is not visible.

## Script

### SH001-SH005: The Puzzle

SFX: A wooden practice sword cuts softly through the air, then settles into a controlled finishing guard.

女贝老师:
"今天我们不练普通挥剑。我们考虑一个新问题：让这把剑转个一百八十度掉头，它扫过的区域能小到什么程度？"

梅尔赛德斯:
"扫过的地方，至少像一个圆吧？"

女贝老师:
"如果中心固定，是圆。"

Chalk line crosses out fixed center.

女贝老师:
"但中心不必固定。只要整根剑始终在区域内。"

女贝老师:
"换句话说，每个方向，都要能放下一条完整的一单位线段。"

### SH006-SH010: The Deltoid Candidate

莉丝缇亚:
"那就让边界刚好卡住每个方向？"

女贝老师:
"一个漂亮的候选，是三尖内摆线。"

VO / 女贝老师:
"沿着曲线取切线，切线截出的弦可以当作这把剑。切点移动，弦也跟着转过所有方向。"

女贝老师:
"为什么方向不会漏？切点沿曲线走一圈，切线方向也连续转过一圈。连续变化的方向，中间不能跳过。"

女贝老师:
"这里的 a 是生成三尖内摆线的尺度。这个尺度下，每条可用切线弦正好分成四段 a，所以弦长是四 a。"

Formula appears:

```text
4a = 1
a = 1/4
```

女贝老师:
"要让剑长为一，就取 a 等于四分之一。"

VO / 女贝老师:
"面积用参数曲线的面积公式算：A 等于二 pi a 平方。代入 a 等于四分之一，得到 pi 除以八。"

女贝老师:
"所以它小，优雅，而且真的能转。但它还只是候选。"

艾黛尔:
"优雅，不等于最小。我还没听到：为什么不能再小？"

艾黛尔:
"如果边界允许凹进去，空隙也许还能被重复利用。"

### SH011-SH015: The Convex Rule

女贝老师:
"很好。一般情况太滑，我们先看一个比较规整的特例。加一条规则：区域不能凹进去。"

VO / 女贝老师:
"凸，就是图形中任意两点之间的线段，都不离开图形。"

女贝老师:
"在凸区域里，最省的是高为一的等边三角形。"

VO / 女贝老师:
"先证明它真的能转。方向只看零到一百八十度就够了，因为线段掉头后还是同一条线段。"

女贝老师:
"红剑在三组支撑边之间连续滑动。最危险的位置，是它刚好沿着一条高；这时长度正好是一。其余方向能截到更长的线段。"

VO / 女贝老师:
"所以这个三角形给出上界：它确实能容纳所有方向。凸世界的下界是一个定理：任何凸区域都不能比它更省。"

Formula appears:

```text
s = 2/sqrt(3)
A = 1/sqrt(3)
```

女贝老师:
"凸性会自动把空隙补满。所以在凸世界里，面积不能随便省。"

莉丝缇亚:
"那如果去掉凸性，让区域碎开呢？"

女贝老师:
"这正是反转的入口。但碎开之后，必须记账：每个方向还在不在。"

### SH016-SH023: Perron Tree Reversal

女贝老师:
"这个方向账本，从一个三角形开始。"

VO / 女贝老师:
"从顶点到底边，每一条线都代表一个方向。底边上一整段点，就保存了一整段方向。"

女贝老师:
"第一步，切分。每块只负责一小段方向。"

SFX: Chalk/sand cut.

女贝老师:
"第二步，平移。平移不会改变方向，只改变这段线放在哪里。"

SFX: Thin pieces slide.

女贝老师:
"第三步，重叠。面积减少，方向没有丢。"

艾黛尔:
"但这样还是同一个问题吗？"

女贝老师:
"看方向，不看原来的位置。切分没有删方向。平移没有转方向。"

VO / 女贝老师:
"我们先证明关键版本：每个方向都能放下一条单位线段。真正连续转动时，再用很窄的连接走廊把动作接起来；走廊面积也能做得任意小。"

VO / 女贝老师:
"重复这个过程：切分、平移、重叠。切得越细，碎片越容易大量重叠；方向尺没有缺口，金色并集面积却按我们指定的比例下降。"

女贝老师:
"给定任何 epsilon，只要多迭代几轮，面积就能压到 epsilon 以下。"

女贝老师:
"所以原来的最小面积问题，没有最小正答案。"

莉丝缇亚:
"也就是，给再小的面积，也能更小？"

女贝老师:
"对。只要大于零。"

### SH024-SH029: Tubes and Dimension

女贝老师:
"但面积为零，不等于不存在。线段也没有平面面积。"

VO / 女贝老师:
"要研究这种集合，数学家常把线段加粗一点，变成宽度为 delta 的细管。"

女贝老师:
"两根管的夹角叫 alpha。夹角越小，重叠越长；夹角越大，重叠越短。"

Formula appears:

```text
|T_i cap T_j| <= C delta^2 / alpha
```

女贝老师:
"这个估计把方向差和重叠面积连在一起。"

VO / 女贝老师:
"看交叠的形状：沿管方向的交叠长度大约是 delta 除以 sin alpha，宽度是 delta，所以面积大约是 delta 平方除以 sin alpha。小角度时 sin alpha 和 alpha 同量级，于是得到这个估计。"

VO / 女贝老师:
"维数可以先粗略理解成：网格变细时，需要多少小格子才能盖住它。普通曲线大约需要一除以 delta 个格子；真正二维的东西接近一除以 delta 平方个。"

VO / 女贝老师:
"于是我们可以问：这些管能不能像一条曲线那样收缩？二维的答案是，不能。"

女贝老师:
"它可以没有面积，但维数必须是二。"

### SH030-SH031: Proof-Derived Impact

女贝老师:
"后来真正留下来的，不是这把剑。"

女贝老师:
"而是一个模型：许多方向的细长结构，能怎样重叠？"

VO / 女贝老师:
"这进入几何测度论，帮助人们区分面积和维数。"

VO / 女贝老师:
"也进入调和分析。沿许多方向取平均时，细管的重叠会制造困难。"

VO / 女贝老师:
"在波动问题里，一个波可以拆成许多沿不同方向传播的波包。波包也像细管。"

女贝老师:
"所以问题不是针。问题是方向。"

### SH032-SH034: Reveal

女贝老师 closes the chalk case.

女贝老师:
"这个问题，叫挂谷针问题。"

VO / 女贝老师:
"面积可以小到消失。方向的复杂度，不会消失。"

End card:

```text
挂谷针问题
多方向结构能怎样重叠？
```

## Dialogue Cutdown Option

If runtime must be below 6 minutes, remove student lines except:

- 梅尔赛德斯: "至少要给它一个圆吧？"
- 艾黛尔: "优雅，不等于最小。我还没听到：为什么不能再小？"
- 莉丝缇亚: "给再小的面积，也还能更小？"

Keep all Byleth proof lines.

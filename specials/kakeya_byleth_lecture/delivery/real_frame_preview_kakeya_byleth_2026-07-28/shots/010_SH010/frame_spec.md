# 分镜规格：SH010

镜头编号：SH010
阶段：真实帧锁定视频提示词包
状态：真实帧已生成，提示词已就绪
依赖：女贝老师二维挂谷分镜表
剧情节点：候选受到质疑
成片作用：艾黛尔提出数学质疑：还没证明三尖内摆线不能再小，并指出非凸空隙可能被重复利用。
时长目标：9 秒
地点：教室
可见角色：女贝老师; 艾黛尔 academy

身份锁：
- 女贝老师只使用女版教授形象，不使用男贝。
- 女贝老师参考：assets/characters/protagonist/BylethFemale/professor/selected.png。
- 需要全身姿态、手套或持剑动作时，使用：assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png。
- 可见学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯，不得替换成其他学生或普通学生。

资产引用：
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png

起始帧意图：
三尖内摆线 公式仍在黑板，前景出现可辨认的艾黛尔 academy 形象。

关键帧意图：
质疑声响起时女贝老师微微停笔，表情不变。

结束帧意图：
她转向另一块空板，准备改加凸性条件。

摄影机：
交替近景，先艾黛尔可辨认发问，再切女贝老师静止表情。

调度：
艾黛尔前倾，手指向 三尖内摆线 外侧剩余空间；女贝老师没有立即回答，黑板保留 A = pi/8 和“候选”。

画面方向：
艾黛尔在左前景，女贝老师转向右侧空板。

数学图形锁：
- 三尖内摆线必须是真正的三尖内摆线式区域；显示一单位弦尺度 a = 1/4 和面积 A = pi/8；不得用半径 1/3 作为一单位针的尺度。

动作峰值：
女贝老师没有反驳、只停顿的瞬间。

中文台词 / 音频锚点：
艾黛尔: 优雅，不等于最小。我还没听到：为什么不能再小？如果边界允许凹进去，空隙也许还能被重复利用。

剪入：
从 SH009 的“候选”标记切入。

剪出：
随她转身切到地面绳边界。

连续性要求：
- 上一镜头: SH009 （候选面积）.
- 下一镜头: SH011 （切换到凸区域）.
- 保持上方规定的画面方向和视觉主体交接。
- 艾黛尔 is visible and locked to assets/characters/black_eagles/艾黛尔/academy/selected.png; do not replace her with a generic red-cloak student.

运动风险：
- Current generated SH010 frames are blocked if visible 艾黛尔 does not match the academy selected asset.
- AI 视频可能过度装饰数学图形；必须保持几何关系、端点标记、δ/α 标签、并集/重叠关系清楚可读。
- 如果女贝老师可见，必须监看跨帧和相邻镜头中的身份漂移。

拒绝条件：
- visible 艾黛尔 does not match assets/characters/black_eagles/艾黛尔/academy/selected.png
- 起始帧、关键帧、结束帧没有形成规定动作链，则拒绝。
- 镜头运动遮住动作峰值，或反转既定画面方向，则拒绝。
- 女贝老师变成男贝、成年导师、普通魔女或普通学生，则拒绝。
- 三尖内摆线、一单位弦、a = 1/4 或 A = pi/8 缺失或尺度错误，则拒绝。

真实帧来源：
- 起始帧：real_frames/SH010/start.png
- 关键帧：real_frames/SH010/key.png
- 结束帧：real_frames/SH010/end.png

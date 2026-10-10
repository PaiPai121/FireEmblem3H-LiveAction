# 分镜规格：SH020

镜头编号：SH020
阶段：真实帧锁定视频提示词包
状态：真实帧已生成，提示词已就绪
依赖：女贝老师二维挂谷分镜表
剧情节点：学生质疑
成片作用：学生替观众追问“这算不算作弊”，女贝老师回答：看方向，不看原位置。
时长目标：10 秒
地点：教室沙盘
可见角色：女贝老师; 艾黛尔 academy; 莉丝缇亚 academy; 梅尔赛德斯 academy

身份锁：
- 女贝老师只使用女版教授形象，不使用男贝。
- 女贝老师参考：assets/characters/protagonist/BylethFemale/professor/selected.png。
- 需要全身姿态、手套或持剑动作时，使用：assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png。
- 可见学生阵容锁定为艾黛尔、莉丝缇亚、梅尔赛德斯，不得替换成其他学生或普通学生。

资产引用：
- assets/characters/protagonist/BylethFemale/professor/selected.png
- assets/characters/protagonist/BylethFemale/weapon_fullbody/selected.png
- assets/characters/black_eagles/Edelgard/academy/selected.png
- assets/characters/golden_deer/Lysithea/academy/selected.png
- assets/characters/blue_lions/Mercedes/academy/selected.png

起始帧意图：
沙盘上的重叠碎片可见，艾黛尔、莉丝缇亚、梅尔赛德斯靠近桌沿且身份可辨。

关键帧意图：
女贝老师木尺从碎片位置移到绿色方向带，回答问题。

结束帧意图：
镜头停在绿色方向带上，准备进入方向审计图。

摄影机：
中景过肩，沙盘仍在画面下半部。

调度：
艾黛尔指向分离碎片，莉丝缇亚盯住绿色方向带，梅尔赛德斯听讲；女贝老师用木尺指向绿色方向带而非原三角形位置。

画面方向：
学生手从左入画，女贝老师木尺从右指向中心；三位学生站位保持艾黛尔、莉丝缇亚、梅尔赛德斯顺序稳定。

数学图形锁：
- 佩龙树 证明必须保持方向覆盖可见：切分分配方向区间，平移不旋转，重叠缩小并集面积且不删除方向。

动作峰值：
木尺离开面积轮廓、指向方向带的一刻。

中文台词 / 音频锚点：
艾黛尔: 但这样还是同一个问题吗？ 女贝老师: 看方向，不看原来的位置。连续转动之后用很窄的走廊接起来。

剪入：
从 SH019 重叠图拉出到人物。

剪出：
沿木尺指向切到纯方向审计。

连续性要求：
- 上一镜头: SH019 （重叠步骤）.
- 下一镜头: SH021 （方向审计）.
- 保持上方规定的画面方向和视觉主体交接。
- Student roster is visible and locked: 艾黛尔, 莉丝缇亚, and 梅尔赛德斯 must match the listed selected.png assets, not generic students or shoulder silhouettes.

运动风险：
- 台词过长、挤压画面节奏，则拒绝。
- Current generated SH020 frames are blocked if any visible student fails to match 艾黛尔/莉丝缇亚/梅尔赛德斯 academy selected assets.
- AI 视频可能过度装饰数学图形；必须保持几何关系、端点标记、δ/α 标签、并集/重叠关系清楚可读。
- 如果女贝老师可见，必须监看跨帧和相邻镜头中的身份漂移。

拒绝条件：
- 台词过长、挤压画面节奏，则拒绝。
- 起始帧、关键帧、结束帧没有形成规定动作链，则拒绝。
- 镜头运动遮住动作峰值，或反转既定画面方向，则拒绝。
- 女贝老师变成男贝、成年导师、普通魔女或普通学生，则拒绝。
- 艾黛尔, 莉丝缇亚, or 梅尔赛德斯 becomes a generic house-color student, wrong costume, wrong hair/face, or is replaced by another student
- 佩龙树的切分、平移、重叠或方向保持逻辑被画错，则拒绝。

真实帧来源：
- 起始帧：real_frames/SH020/start.png
- 关键帧：real_frames/SH020/key.png
- 结束帧：real_frames/SH020/end.png

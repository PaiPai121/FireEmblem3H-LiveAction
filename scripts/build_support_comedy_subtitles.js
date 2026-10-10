#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve("specials/black_eagles_support_comedy");
const deliveryRoot = path.join(projectRoot, "delivery");
const outRoot = path.join(projectRoot, "subtitles", "zh-Hans");

const speakerNames = {
  Caspar: "卡斯帕",
  Linhardt: "林哈尔特",
  Ferdinand: "斐迪南",
  Dorothea: "多洛缇雅",
  Bernadetta: "贝尔娜提塔",
  Petra: "佩托拉",
};

const translations = {
  "くそっ！ 力の差はないはずなのに、どうしても自分より背の高い奴に勝てねえ！": "可恶！明明力量上没差多少，我就是赢不了比我高的家伙！",
  "なあ、リンハルト。何か勝つための策を考えてくれよ。": "喂，林哈尔特。帮我想个能赢的办法吧。",
  "……それは無駄なんじゃないかな？": "……那不是白费力气吗？",
  "たとえ策を教えたとしても、いつも君は策どおりに動かないじゃないか。": "就算我教你策略，你也总是不按计划行动吧。",
  "そっ、それは、策が難しすぎるからで……。今度はちゃんとやるからよ。な、頼む！": "那、那是因为策略太难了……这次我一定照做。拜托了！",
  "……仕方がないね。それなら、とっておきの秘策を授けよう。": "……真拿你没办法。那我就传授你一个压箱底的秘策吧。",
  "まず、君が得意な先制攻撃、そして連打、こういったものをすべて我慢しよう。": "首先，你擅长的先发制人和连续猛攻，全都忍住别用。",
  "ええー！？": "诶诶！？",
  "相手の攻撃を避け、受け流し、耐え続け……そして必殺の一撃で急所を突くんだ。": "避开对方攻击，卸力，持续防守……最后用必杀一击刺中要害。",
  "なるほど！ ……オレには向いてねえな。": "原来如此！……这不适合我啊。",
  "じゃあそのまま負け続けていなよ。これしかないし。": "那你就继续输下去吧。反正也只有这个办法。",
  "君が疎かにしがちな守りを、まずは鍛えなきゃね。": "你总是疏忽防守，首先得把这个练起来。",
  "そうか。じゃあ早速、付き合ってくれよ。": "这样啊。那马上陪我练吧。",
  "やれやれ……。はあ……適当なとこで逃げよ。": "真是的……唉……找个合适的机会溜走吧。",
  "さあ、もう一度だ、リンハルト！ 来い！": "来吧，再来一次，林哈尔特！放马过来！",
  "水、取ってくる……じゃあね……。": "我去拿水……再见……",
  "……しまった！ あいつ、逃げやがったな！？": "……糟了！那家伙逃跑了吧！？",

  "おお、ドロテア。やはり君がいると、食堂が華やぐね。": "哦，多洛缇雅。果然有你在，食堂都变得华丽了。",
  "あら、フェルくん。相変わらずお世辞がお上手ですこと。": "哎呀，菲尔君。你还是这么会说漂亮话呢。",
  "私のことを嫌悪しているのかね？ あるいは避けたい理由でもあると？": "你是在厌恶我吗？还是有什么理由想避开我？",
  "そのとおりですよ。貴方を嫌ってるわ、私。": "正是如此。我讨厌你。",
  "貴方が訳を当てられたら、正直に認めてあげようかしら。": "如果你能猜中原因，我倒是可以坦率承认。",
  "挑まれたからには当ててみせよう。": "既然受到挑战，我一定会猜中。",
  "貴方が蜜蜂のようだから、かしらねえ。": "大概是因为你像蜜蜂吧。",
  "後は自分で考えて。じゃあねえ、フェルくん。": "剩下的你自己想吧。再见啦，菲尔君。",
  "ううむ、蜜蜂か……。自分の役割を全うしている、ということか？": "唔，蜜蜂吗……意思是我尽忠职守？",
  "手作りの焼き菓子はいかがかね？": "要尝尝我亲手做的烤点心吗？",
  "フェルくん……？ 貴方、いつの間に菓子職人になったの？": "菲尔君……？你什么时候成点心师傅了？",
  "君は私を蜜蜂と言った。蜜蜂は巣を持ち、甲斐甲斐しく働く。": "你说我像蜜蜂。蜜蜂筑巢，也勤恳劳作。",
  "この焼き菓子……材料から何からすべてを、私はこの腕一本で揃えたのだ。": "这些烤点心……从材料到全部步骤，都是我亲手准备的。",
  "あら、貴方、手、怪我してるわ！": "哎呀，你的手受伤了！",
  "ほら、これで大丈夫ですよ、フェルくん。貴族様は体も大事にしないと。": "好了，这样就没事了，菲尔君。贵族大人也得爱惜身体才行。",
  "今回はいつものような棘がないな。": "这次不像平常那样带刺呢。",
  "ちょっとだけ見直しましたし。": "我只是稍微对你改观了一点。",
  "見直した！？ そうか、ようやくわかってくれたのだね！": "改观了！？这样啊，你终于理解我了！",
  "あのね、ちょっとだけだから。蜜蜂の意味も間違ってます。": "听好了，只是一点点。而且蜜蜂的意思你也理解错了。",
  "貴方は、今も蜜蜂に見えるわねえ。それじゃ。": "你现在看起来还是像蜜蜂呢。那么再见。",
  "くっ……いったい何だと言うのだ。ううむ……。": "唔……到底是什么意思啊。嗯……",

  "……えーと。この薬はこっち、と。": "……嗯，这瓶药放这边。",
  "……お？ ベルナデッタじゃねえか。何してんだ？": "……哦？这不是贝尔娜提塔吗。你在干什么？",
  "……て、敵襲ううううう！ 誰！ 何！ 助けてえええ！": "……敌、敌袭啊啊啊！谁！什么！救命啊啊啊！",
  "はあ？ 助けが欲しいのはオレなんだけど。": "哈？需要帮忙的是我才对吧。",
  "おい、ベルナデッタ。お前、喧嘩したことあるか？": "喂，贝尔娜提塔。你打过架吗？",
  "ひええっ！？ 喧嘩！？ あたし、喧嘩売られてるんですかああ！？": "咿呀！？打架！？我这是被人找茬了吗！？",
  "引き籠もってねえで外に出れば、すぐに友達なんかできるぜ！": "别老窝着，出去走走，很快就能交到朋友的！",
  "外に出れば、すぐに……！？ そんなわけないじゃないですか！": "出去走走，很快就……！？怎么可能嘛！",
  "一緒にすんげえ景色を見てたら仲良くなっちまったんだよなあ……。": "以前我和别人一起看了超厉害的景色，结果就变熟了……",
  "とりあえずその景色、見せてやる。よし！": "总之我先带你去看那个景色。好！",
  "えっ！ ちょ、ちょっと……！ どこ触って……ぎえええっ！？": "诶！等、等一下……！你碰哪里……咿呀啊啊！？",
  "何やってるんですかあああ！ あたし、う、浮いて、浮いて……！？": "你在做什么啊啊啊！我、我浮起来了，浮起来了……！？",
  "うっせーな、担いでるだけだろ。ほら、行くぜ！": "吵死了，我只是扛着你而已。走啦！",
  "よっしゃー！ 着いたな！ どうよ、この景色。": "好嘞！到了！怎么样，这景色。",
  "死んだ……あたし、死にました……。すごい勢いで天地を駆け抜けました……。": "死了……我已经死了……刚才以惊人的速度穿越了天地……",
  "ああ……お迎えが来てます……。魂が洗われるような夕焼けです……。": "啊啊……有人来接我了……这是能洗净灵魂的夕阳……",
  "おい！ 逝くな、ベルナデッタ！ あの夕焼けは本物だ！": "喂！别走啊，贝尔娜提塔！那夕阳是真的！",
  "あ、でも、すごく綺麗……。素敵な場所ですね、ここ！": "啊，不过真的好漂亮……这里是个很棒的地方呢！",

  "ペトラさんって、良いよなあ。怒鳴らないし、悪口も言わないし……": "佩托拉真好啊。不会大吼，也不会说坏话……",
  "あ、ペトラさんだ。ちょっと話しかけてみよっと。": "啊，是佩托拉。稍微去搭个话吧。",
  "……ベルナデッタ、ですか？ 何か、わたし、用事、ありますか？": "……是贝尔娜提塔吗？找我，有什么事吗？",
  "ひえっ！？ な、なぜベルだと！？ 背中に目でもあるんですかいな！": "咿！？你、你怎么知道是贝尔！？你背后也长眼睛了吗！",
  "目、顔の上、２つです。背中、ないです。背後、気配、感じます、あなた。": "眼睛，在脸上，两个。背后，没有。你在背后，我感觉到气息。",
  "あたしたち、仲良くなれるかもっていうか、その、ペトラさんが……": "我是觉得我们也许能变亲近，那个，佩托拉你……",
  "あたしのことどう思ってるかなって。友達というか何というか……。": "是怎么看我的呢。算朋友，还是别的什么……",
  "あなた、どう思う、ですか？ ……まるで、獲物のよう、です。": "我怎么看你，是吗？……就像猎物一样。",
  "え……獲物おおおおおおっ！？": "诶……猎物啊啊啊！？",
  "あなた、狩りの獲物、似ています。草陰の、兎のごとし、です。": "你很像狩猎的猎物。就像草丛里的兔子。",
  "いつも、敵、探し、察知する、逃げ出す、即座。逃げ足、速い、です。": "总是在寻找敌人，察觉到就立刻逃跑。逃跑，很快。",
  "わたし、弓矢、持つ時……、間違って、あなた、狩らない、注意しています。": "我拿弓箭的时候……会注意，不会误把你猎下。",
  "へ、へえええ……。注意してくれてるんだね。ふーん……。": "这、这样啊……原来你有在注意我啊。嗯……",
  "つまり……いつかはあたし、狩られちゃうってことおおお！？": "也就是说……总有一天我会被猎到吗啊啊！？",
  "いいえ、心配、無用です。矢、射る瞬間、わたし、外せます。": "不是，担心，没有必要。射箭的瞬间，我能射偏。",
  "あなた、動かなければ、矢、頬、かすめて、飛び去る、です。": "只要你不动，箭会擦过脸颊，飞过去。",
  "ほっぺかすめてる時点で問題でしょおおお！ なぜ！ なぜなの！": "擦到脸颊本身就是问题吧啊啊！为什么！为什么啊！",
  "ベルが何をしたって言うのおおおおお！ 許してえええええええ！": "贝尔到底做了什么啊啊啊！饶了我吧啊啊啊！",
  "何も、していません。しかし、許す、構いません。": "你什么也没做。不过，原谅你，可以。",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const z = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(z).padStart(3, "0")}`;
}

function vttTime(seconds) {
  return srtTime(seconds).replace(",", ".");
}

function assTime(seconds) {
  const cs = Math.round(seconds * 100);
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function subtitleText(entry) {
  const speaker = speakerNames[entry.speaker] || entry.speaker;
  return `${speaker}：${translations[entry.text] || `[待翻译] ${entry.text}`}`;
}

function cueTimings(lines, shotStart, shotDuration) {
  const gap = 0.18;
  const active = Math.max(0, shotDuration - gap * Math.max(0, lines.length - 1));
  const weights = lines.map((line) => Math.max(8, subtitleText(line).length));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = shotStart;
  return lines.map((line, index) => {
    const isLast = index === lines.length - 1;
    const duration = isLast ? shotStart + shotDuration - cursor : active * weights[index] / total;
    const start = cursor;
    const end = Math.min(shotStart + shotDuration, cursor + Math.max(1.15, duration));
    cursor = end + gap;
    return { start, end, line };
  });
}

function readEpisode(packageDir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(packageDir, "package_manifest.json"), "utf8"));
  const shots = manifest.shots.map((shot) => {
    const metadata = JSON.parse(fs.readFileSync(path.join(packageDir, shot.prompt_path.replace("prompt.md", "metadata.json")), "utf8"));
    return { manifest: shot, metadata };
  });
  return { manifest, shots };
}

function buildEpisode(packageDir) {
  const { manifest, shots } = readEpisode(packageDir);
  const cues = [];
  let shotStart = 0;
  for (const shot of shots) {
    const lines = shot.metadata.dialogue.filter((line) => line.kind === "source_line");
    for (const cue of cueTimings(lines, shotStart, shot.metadata.duration_seconds)) {
      cues.push({
        index: cues.length + 1,
        shot_id: shot.metadata.id,
        start_seconds: Number(cue.start.toFixed(3)),
        end_seconds: Number(cue.end.toFixed(3)),
        speaker: cue.line.speaker,
        speaker_zh: speakerNames[cue.line.speaker] || cue.line.speaker,
        ja: cue.line.text,
        zh_Hans: translations[cue.line.text] || `[待翻译] ${cue.line.text}`,
        translation_policy: "Chinese working subtitle translation; not claimed as official localization.",
      });
    }
    shotStart += shot.metadata.duration_seconds;
  }

  const subtitleDir = path.join(packageDir, "subtitles", "zh-Hans");
  ensureDir(subtitleDir);
  const base = manifest.episode_id.toLowerCase();

  const srt = cues.map((cue) => `${cue.index}\n${srtTime(cue.start_seconds)} --> ${srtTime(cue.end_seconds)}\n${cue.speaker_zh}：${cue.zh_Hans}\n`).join("\n");
  fs.writeFileSync(path.join(subtitleDir, `${base}.zh-Hans.srt`), srt);

  const vtt = `WEBVTT\n\n${cues.map((cue) => `${vttTime(cue.start_seconds)} --> ${vttTime(cue.end_seconds)}\n${cue.speaker_zh}：${cue.zh_Hans}\n`).join("\n")}`;
  fs.writeFileSync(path.join(subtitleDir, `${base}.zh-Hans.vtt`), vtt);

  const assHeader = `[Script Info]
Title: ${manifest.title} zh-Hans subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Noto Sans CJK SC,48,&H00FFFFFF,&H000000FF,&HAA000000,&H66000000,0,0,0,0,100,100,0,0,1,2,0,2,72,72,48,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
`;
  const ass = assHeader + cues.map((cue) => `Dialogue: 0,${assTime(cue.start_seconds)},${assTime(cue.end_seconds)},Default,${cue.speaker},0,0,0,,${cue.speaker_zh}：${cue.zh_Hans.replaceAll("\n", "\\N")}`).join("\n") + "\n";
  fs.writeFileSync(path.join(subtitleDir, `${base}.zh-Hans.ass`), ass);

  const csvRows = [
    "index,shot_id,start,end,speaker,speaker_zh,ja,zh_Hans,translation_policy",
    ...cues.map((cue) => [
      cue.index,
      cue.shot_id,
      srtTime(cue.start_seconds),
      srtTime(cue.end_seconds),
      cue.speaker,
      cue.speaker_zh,
      cue.ja,
      cue.zh_Hans,
      cue.translation_policy,
    ].map(csv).join(",")),
  ].join("\n") + "\n";
  fs.writeFileSync(path.join(subtitleDir, `${base}.zh-Hans.csv`), csvRows);

  fs.writeFileSync(path.join(subtitleDir, `${base}.zh-Hans.json`), JSON.stringify({
    episode_id: manifest.episode_id,
    title: manifest.title,
    support_pair: manifest.support_pair,
    support_rank: manifest.support_rank,
    source_language: manifest.language_used,
    subtitle_language: "zh-Hans",
    subtitle_policy: "Chinese working subtitle translation; no subtitles are burned into video prompts or frames.",
    total_duration_seconds: manifest.total_duration_seconds,
    cues,
  }, null, 2) + "\n");

  fs.writeFileSync(path.join(subtitleDir, "README.md"), `# ${manifest.title} - zh-Hans Subtitle Project

Subtitle language: zh-Hans
Source dialogue: ${manifest.language_used}
Translation policy: Chinese working subtitle translation; not claimed as official localization.
Video policy: subtitles are export-side assets only. Do not burn subtitles into Seedance video generation.

## Files

- \`${base}.zh-Hans.srt\`
- \`${base}.zh-Hans.vtt\`
- \`${base}.zh-Hans.ass\`
- \`${base}.zh-Hans.csv\`
- \`${base}.zh-Hans.json\`

## Export Notes

- Use SRT for standard video editors.
- Use VTT for web preview.
- Use ASS when font, size, margins, and outline need to be preserved.
- Keep the generated video clean; add subtitles only in the editing/export stage.
`);

  manifest.subtitle_tracks = {
    zh_Hans: {
      policy: "Chinese working subtitle translation; export-side only, not burned into video generation.",
      srt: `subtitles/zh-Hans/${base}.zh-Hans.srt`,
      vtt: `subtitles/zh-Hans/${base}.zh-Hans.vtt`,
      ass: `subtitles/zh-Hans/${base}.zh-Hans.ass`,
      csv: `subtitles/zh-Hans/${base}.zh-Hans.csv`,
      json: `subtitles/zh-Hans/${base}.zh-Hans.json`,
      readme: "subtitles/zh-Hans/README.md",
    },
  };
  fs.writeFileSync(path.join(packageDir, "package_manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  return {
    episode_id: manifest.episode_id,
    title: manifest.title,
    packageRoot: path.relative(path.dirname(outRoot), packageDir).replaceAll(path.sep, "/"),
    cue_count: cues.length,
    subtitles: {
      srt: path.relative(projectRoot, path.join(subtitleDir, `${base}.zh-Hans.srt`)).replaceAll(path.sep, "/"),
      vtt: path.relative(projectRoot, path.join(subtitleDir, `${base}.zh-Hans.vtt`)).replaceAll(path.sep, "/"),
      ass: path.relative(projectRoot, path.join(subtitleDir, `${base}.zh-Hans.ass`)).replaceAll(path.sep, "/"),
      csv: path.relative(projectRoot, path.join(subtitleDir, `${base}.zh-Hans.csv`)).replaceAll(path.sep, "/"),
      json: path.relative(projectRoot, path.join(subtitleDir, `${base}.zh-Hans.json`)).replaceAll(path.sep, "/"),
    },
  };
}

function main() {
  ensureDir(outRoot);
  const packages = fs.readdirSync(deliveryRoot)
    .filter((name) => name.startsWith("video_generation_package_2026-07-28_ep"))
    .map((name) => path.join(deliveryRoot, name))
    .sort();
  const episodes = packages.map(buildEpisode);
  const missing = [];
  for (const text of Object.keys(translations)) {
    let found = false;
    for (const pkg of packages) {
      if (fs.readFileSync(path.join(pkg, "package_manifest.json"), "utf8").includes(text)) {
        found = true;
        break;
      }
    }
    if (!found) missing.push(text);
  }
  const untranslated = [];
  for (const pkg of packages) {
    const { shots } = readEpisode(pkg);
    for (const shot of shots) {
      for (const line of shot.metadata.dialogue) {
        if (line.kind === "source_line" && !translations[line.text]) untranslated.push(line.text);
      }
    }
  }
  fs.writeFileSync(path.join(outRoot, "subtitle_project_manifest.json"), JSON.stringify({
    project: "black_eagles_support_comedy_zh-Hans_subtitles",
    language: "zh-Hans",
    policy: "Chinese working subtitle translation for editor/export use. Not burned into video generation. Not claimed as official localization.",
    episodes,
    untranslated,
    unused_translation_entries: missing,
  }, null, 2) + "\n");
  fs.writeFileSync(path.join(outRoot, "README.md"), `# Black Eagles Support Comedy - zh-Hans Subtitle Project

This project provides Chinese subtitle export assets for the four Black Eagles support comedy episodes.

Policy: Chinese working subtitle translation for editor/export use. It is not claimed as official localization, and subtitles must not be burned into Seedance video generation prompts or storyboard frames.

## Episode Tracks

${episodes.map((ep) => `- ${ep.episode_id}: ${ep.title} (${ep.cue_count} cues)`).join("\n")}

## Formats

- SRT: editor import
- VTT: web preview
- ASS: styled subtitle delivery
- CSV/JSON: review, timing adjustments, localization QA
`);
  console.log(JSON.stringify({ packages: packages.length, episodes, untranslated }, null, 2));
  process.exit(untranslated.length ? 1 : 0);
}

main();

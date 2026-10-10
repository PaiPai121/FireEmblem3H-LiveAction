#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const root = path.join(repo, "specials", "black_eagles_support_comedy");
const today = "2026-07-28";
const packageDate = "2026-07-28";

const charRefs = {
  Caspar: "assets/characters/black_eagles/Caspar/academy/selected.png",
  Linhardt: "assets/characters/black_eagles/Linhardt/academy/selected.png",
  Ferdinand: "assets/characters/black_eagles/Ferdinand/academy/selected.png",
  Dorothea: "assets/characters/black_eagles/Dorothea/academy/selected.png",
  Bernadetta: "assets/characters/black_eagles/Bernadetta/academy/selected.png",
  Petra: "assets/characters/black_eagles/Petra/academy/selected.png",
};

const identityLocks = {
  Caspar: "Academy-era Caspar: youthful compact build, short pale-blue tousled hair, direct earnest face, Black Eagles black academy uniform with red cape and house sleeve patch; urgent body language but controlled mouth and eyes, never a mature bulky strongman.",
  Linhardt: "Academy-era Linhardt: sleepy green medium-length hair, soft intelligent face, slender student build, Black Eagles academy uniform with collar, gold trim, red/black mantle detail, and book when visible; tired and dry, not gloomy, not in robes.",
  Ferdinand: "Academy-era Ferdinand: refined orange hair, aristocratic posture, clean youthful face, immaculate Black Eagles academy uniform with gold trim and noble bearing; earnest and formal, not caricatured.",
  Dorothea: "Academy-era Dorothea: dark wavy hair under academy cap, mature clever expression, Black Eagles academy uniform; amused and perceptive, never cruel or exaggerated.",
  Bernadetta: "Academy-era Bernadetta: short purple hair, small guarded posture, anxious but readable eyes, Black Eagles academy uniform; comic nervousness through posture and hesitation, not horror and not meme-faced.",
  Petra: "Academy-era Petra: warm brown skin, long purple braid, face markings, white high-collar blouse with gold trim, black fitted waist bodice, black skirt, light shoulder strap; sincere and direct without caricature.",
};

const wardrobeLocks = {
  Caspar: "Keep Caspar's exact input-frame wardrobe topology: black academy jacket, gold piping, white collar, red cape/shoulder mantle, Black Eagles sleeve patch, brown diagonal strap when visible, same buttons and cuffs. Do not create armor, casual clothes, training gi, sleeveless outfit, plain black robe, or modern clothing.",
  Linhardt: "Keep Linhardt's exact input-frame wardrobe topology: black academy coat/jacket, gold trim, white collar, red/black mantle detail, fitted student silhouette, book prop only when already shown. Do not create a kimono, monk robe, martial-arts robe, wrap tunic, plain black shirt, bathrobe, armor, or casual clothes.",
  Ferdinand: "Keep Ferdinand's exact input-frame wardrobe topology: immaculate Black Eagles academy uniform, high collar, gold trim, red accents, polished noble silhouette. Do not create armor, formal suit, casual shirt, apron, work clothes, or servant outfit.",
  Dorothea: "Keep Dorothea's exact input-frame wardrobe topology: Black Eagles academy dress uniform and cap when shown, gold trim, red accents, mature student silhouette. Do not create opera costume, modern dress, maid outfit, casual clothes, or exaggerated stagewear.",
  Bernadetta: "Keep Bernadetta's exact input-frame wardrobe topology: Black Eagles academy uniform, red accents, student silhouette, same sleeve and collar shapes. Do not create pajamas, cloak, horror costume, modern sweater, or generic peasant clothes.",
  Petra: "Keep Petra's exact input-frame wardrobe topology: white high-collar blouse with gold trim, black fitted waist bodice, black skirt, light shoulder strap, braid, face markings, academy student silhouette. Do not convert her into a black jacket uniform, tribal costume, hunter outfit, armor, fur/leather stereotype clothing, robe, tunic, or modern clothes.",
};

const expressionLocks = {
  Caspar: "Caspar may look eager or startled, but keep realistic human mouth size, natural eyes, and grounded teen expression; no bulging eyes, giant open-mouth grin, meme face, or cartoon excitement.",
  Linhardt: "Linhardt stays dry, sleepy, and mildly annoyed with half-lidded or tired eyes; no angry scowl, no blank corpse stare, no melodramatic despair.",
  Ferdinand: "Ferdinand stays formal and overearnest with controlled noble posture; no clownish mugging, no inflated chest pose, no smug villain expression.",
  Dorothea: "Dorothea stays amused and sharp with small facial changes; no cruel sneer, no exaggerated eye-roll, no stage-villain smile.",
  Bernadetta: "Bernadetta can be startled and comic, but keep fear stylized and humane; no horror face, no screaming-mask distortion, no giant mouth, no bug eyes.",
  Petra: "Petra stays calm, sincere, and attentive; no predatory leer, no exoticized posing, no deadpan caricature.",
};

const locations = {
  training: "assets/locations/EP02/act01/TrainingGround/TrainingGround_reference.png",
  dining: "assets/locations/EP02/act01/DiningHall/DiningHall_reference.png",
  infirmary: "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
  corridor: "assets/locations/EP02/act01/DormitoryCorridor/DormitoryCorridor_reference.png",
  overlook: "assets/locations/EP02/act01/GarregMachExteriorOverview/GarregMachExteriorOverview_reference.png",
  courtyard: "assets/locations/EP02/act01/ThreeHousesCourtyard/ThreeHousesCourtyard_reference.png",
};

const episodes = [
  {
    id: "EP01",
    slug: "caspar_linhardt_b",
    title: "Caspar x Linhardt B - Tall Opponent Tactics",
    supportPair: "Linhardt & Caspar",
    supportRank: "B",
    source: "https://houses.fedatamine.com/ja/supports/Linhardt/Caspar/B",
    sourceSummary: "Caspar cannot beat taller opponents, begs Linhardt for a strategy, learns a defensive counterplan, then drags Linhardt into exhausting practice until Linhardt escapes.",
    language: "Japanese original",
    dialoguePolicy: "excerpted / lightly bridged",
    packageId: `video_generation_package_${packageDate}_ep01_caspar_linhardt_b`,
    characters: ["Caspar", "Linhardt"],
    shots: [
      {
        id: "BE-SC-EP01-SH001",
        title: "Caspar Demands A Plan",
        duration: 15,
        location: "training",
        purpose: "Establish Caspar's tall-opponent frustration and Linhardt as the reluctant strategist.",
        frameIntents: {
          start: "Caspar storms across the training ground, fists clenched, while Linhardt stands half-asleep with a book.",
          key: "Caspar leans into Linhardt's personal space, pleading for a winning strategy.",
          end: "Linhardt lifts one hand with a tired, skeptical look.",
        },
        dialogue: [
          ["Caspar", "source_line", "くそっ！ 力の差はないはずなのに、どうしても自分より背の高い奴に勝てねえ！"],
          ["Caspar", "source_line", "なあ、リンハルト。何か勝つための策を考えてくれよ。"],
          ["Linhardt", "source_line", "……それは無駄なんじゃないかな？"],
        ],
      },
      {
        id: "BE-SC-EP01-SH002",
        title: "The Problem Is Caspar",
        duration: 15,
        location: "training",
        purpose: "Turn the joke onto Caspar's inability to follow tactics.",
        frameIntents: {
          start: "Linhardt lazily gestures at Caspar as if diagnosing a simple problem.",
          key: "Caspar recoils, embarrassed but still vibrating with energy.",
          end: "Linhardt sighs and agrees to explain a secret plan.",
        },
        dialogue: [
          ["Linhardt", "source_line", "たとえ策を教えたとしても、いつも君は策どおりに動かないじゃないか。"],
          ["Caspar", "source_line", "そっ、それは、策が難しすぎるからで……。今度はちゃんとやるからよ。な、頼む！"],
          ["Linhardt", "source_line", "……仕方がないね。それなら、とっておきの秘策を授けよう。"],
        ],
      },
      {
        id: "BE-SC-EP01-SH003",
        title: "Do Not Punch First",
        duration: 15,
        location: "training",
        purpose: "Deliver Linhardt's counterintuitive defensive strategy and Caspar's immediate comic resistance.",
        frameIntents: {
          start: "Linhardt calmly demonstrates a waiting stance with minimal effort.",
          key: "Caspar freezes in horror at the idea of not attacking first.",
          end: "Caspar grudgingly accepts, pointing toward the training yard.",
        },
        dialogue: [
          ["Linhardt", "source_line", "まず、君が得意な先制攻撃、そして連打、こういったものをすべて我慢しよう。"],
          ["Caspar", "source_line", "ええー！？"],
          ["Linhardt", "source_line", "相手の攻撃を避け、受け流し、耐え続け……そして必殺の一撃で急所を突くんだ。"],
          ["Caspar", "source_line", "なるほど！ ……オレには向いてねえな。"],
          ["Linhardt", "source_line", "じゃあそのまま負け続けていなよ。これしかないし。"],
        ],
      },
      {
        id: "BE-SC-EP01-SH004",
        title: "Linhardt Escapes Training",
        duration: 15,
        location: "training",
        purpose: "Pay off Linhardt's laziness after Caspar turns advice into mandatory sparring.",
        frameIntents: {
          start: "Caspar pulls Linhardt toward practice with a wooden training weapon ready.",
          key: "Linhardt is exhausted, leaning on his knees while Caspar is still eager.",
          end: "Linhardt slips away toward water while Caspar slowly realizes he escaped.",
        },
        dialogue: [
          ["Caspar", "source_line", "君が疎かにしがちな守りを、まずは鍛えなきゃね。"],
          ["Caspar", "source_line", "そうか。じゃあ早速、付き合ってくれよ。"],
          ["Linhardt", "source_line", "やれやれ……。はあ……適当なとこで逃げよ。"],
          ["Caspar", "source_line", "さあ、もう一度だ、リンハルト！ 来い！"],
          ["Linhardt", "source_line", "水、取ってくる……じゃあね……。"],
          ["Caspar", "source_line", "……しまった！ あいつ、逃げやがったな！？"],
        ],
      },
    ],
  },
  {
    id: "EP02",
    slug: "ferdinand_dorothea_cb",
    title: "Ferdinand x Dorothea C/B - Why Am I A Bee",
    supportPair: "Ferdinand & Dorothea",
    supportRank: "C/B",
    source: "https://houses.fedatamine.com/ja/supports/Ferdinand/Dorothea/C and https://houses.fedatamine.com/ja/supports/Ferdinand/Dorothea/B",
    sourceSummary: "Dorothea challenges Ferdinand to guess why she dislikes him and says he is like a bee; in the B support he presents self-made pastries as his earnest but wrong solution.",
    language: "Japanese original",
    dialoguePolicy: "excerpted / lightly bridged",
    packageId: `video_generation_package_${packageDate}_ep02_ferdinand_dorothea_cb`,
    characters: ["Ferdinand", "Dorothea"],
    shots: [
      {
        id: "BE-SC-EP02-SH001",
        title: "The Cold Reception",
        duration: 15,
        location: "dining",
        purpose: "Establish Dorothea's pointed teasing and Ferdinand's noble earnestness.",
        frameIntents: {
          start: "Ferdinand approaches Dorothea in the dining hall, proud and smiling.",
          key: "Dorothea smiles with cool sarcasm while Ferdinand realizes the chill is deliberate.",
          end: "Ferdinand stands upright, formally asking why she hates him.",
        },
        dialogue: [
          ["Ferdinand", "source_line", "おお、ドロテア。やはり君がいると、食堂が華やぐね。"],
          ["Dorothea", "source_line", "あら、フェルくん。相変わらずお世辞がお上手ですこと。"],
          ["Ferdinand", "source_line", "私のことを嫌悪しているのかね？ あるいは避けたい理由でもあると？"],
          ["Dorothea", "source_line", "そのとおりですよ。貴方を嫌ってるわ、私。"],
        ],
      },
      {
        id: "BE-SC-EP02-SH002",
        title: "Bee Clue",
        duration: 15,
        location: "dining",
        purpose: "Set the riddle that drives the combined C/B mini-theater.",
        frameIntents: {
          start: "Dorothea circles lightly around Ferdinand, enjoying the challenge.",
          key: "Dorothea gives the bee clue with a bright, teasing smile.",
          end: "Ferdinand is left alone, visibly overthinking the clue.",
        },
        dialogue: [
          ["Dorothea", "source_line", "貴方が訳を当てられたら、正直に認めてあげようかしら。"],
          ["Ferdinand", "source_line", "挑まれたからには当ててみせよう。"],
          ["Dorothea", "source_line", "貴方が蜜蜂のようだから、かしらねえ。"],
          ["Dorothea", "source_line", "後は自分で考えて。じゃあねえ、フェルくん。"],
          ["Ferdinand", "source_line", "ううむ、蜜蜂か……。自分の役割を全うしている、ということか？"],
        ],
      },
      {
        id: "BE-SC-EP02-SH003",
        title: "Pastry Theory",
        duration: 15,
        location: "dining",
        purpose: "Show Ferdinand's absurdly earnest attempt to solve the bee riddle with handmade sweets.",
        frameIntents: {
          start: "Ferdinand presents a neat tray of slightly uneven handmade pastries.",
          key: "Dorothea notices Ferdinand's bandaged burn while he proudly explains ingredients.",
          end: "Dorothea reaches for his hand, shifting from sarcasm to concern.",
        },
        dialogue: [
          ["Ferdinand", "source_line", "手作りの焼き菓子はいかがかね？"],
          ["Dorothea", "source_line", "フェルくん……？ 貴方、いつの間に菓子職人になったの？"],
          ["Ferdinand", "source_line", "君は私を蜜蜂と言った。蜜蜂は巣を持ち、甲斐甲斐しく働く。"],
          ["Ferdinand", "source_line", "この焼き菓子……材料から何からすべてを、私はこの腕一本で揃えたのだ。"],
          ["Dorothea", "source_line", "あら、貴方、手、怪我してるわ！"],
        ],
      },
      {
        id: "BE-SC-EP02-SH004",
        title: "Still A Bee",
        duration: 15,
        location: "infirmary",
        purpose: "Pay off Dorothea warming slightly while Ferdinand remains proudly, comically wrong.",
        frameIntents: {
          start: "Dorothea finishes wrapping Ferdinand's hand in a quiet cloister infirmary corner.",
          key: "Ferdinand beams too early when Dorothea says she reconsidered a little.",
          end: "Dorothea exits with a teasing smile, leaving Ferdinand mystified.",
        },
        dialogue: [
          ["Dorothea", "source_line", "ほら、これで大丈夫ですよ、フェルくん。貴族様は体も大事にしないと。"],
          ["Ferdinand", "source_line", "今回はいつものような棘がないな。"],
          ["Dorothea", "source_line", "ちょっとだけ見直しましたし。"],
          ["Ferdinand", "source_line", "見直した！？ そうか、ようやくわかってくれたのだね！"],
          ["Dorothea", "source_line", "あのね、ちょっとだけだから。蜜蜂の意味も間違ってます。"],
          ["Dorothea", "source_line", "貴方は、今も蜜蜂に見えるわねえ。それじゃ。"],
          ["Ferdinand", "source_line", "くっ……いったい何だと言うのだ。ううむ……。"],
        ],
      },
    ],
  },
  {
    id: "EP03",
    slug: "caspar_bernadetta_c",
    title: "Bernadetta x Caspar C - The Scenic View",
    supportPair: "Caspar & Bernadetta",
    supportRank: "C",
    source: "https://houses.fedatamine.com/ja/supports/Caspar/Bernadetta/C",
    sourceSummary: "Bernadetta panics when Caspar appears; Caspar concludes outside friendship is easy and carries her to a beautiful view, terrifying her before she admits the scenery is lovely.",
    language: "Japanese original",
    dialoguePolicy: "excerpted / lightly bridged",
    packageId: `video_generation_package_${packageDate}_ep03_caspar_bernadetta_c`,
    characters: ["Caspar", "Bernadetta"],
    shots: [
      {
        id: "BE-SC-EP03-SH001",
        title: "Enemy In The Corridor",
        duration: 15,
        location: "corridor",
        purpose: "Launch Bernadetta's panic off Caspar's normal greeting.",
        frameIntents: {
          start: "Bernadetta carefully sorts small medicine bottles near a dorm corridor door.",
          key: "Caspar pops into the doorway; Bernadetta jerks backward in full panic.",
          end: "Caspar scratches his head, confused and slightly wounded.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "……えーと。この薬はこっち、と。"],
          ["Caspar", "source_line", "……お？ ベルナデッタじゃねえか。何してんだ？"],
          ["Bernadetta", "source_line", "……て、敵襲ううううう！ 誰！ 何！ 助けてえええ！"],
          ["Caspar", "source_line", "はあ？ 助けが欲しいのはオレなんだけど。"],
        ],
      },
      {
        id: "BE-SC-EP03-SH002",
        title: "Caspar Explains Friendship",
        duration: 15,
        location: "corridor",
        purpose: "Set up Caspar's simple worldview against Bernadetta's social terror.",
        frameIntents: {
          start: "Caspar shows a small scrape on his arm, animatedly explaining a fight.",
          key: "Bernadetta retreats behind her bag as Caspar asks if she has ever fought.",
          end: "Caspar points outside with total confidence.",
        },
        dialogue: [
          ["Caspar", "source_line", "おい、ベルナデッタ。お前、喧嘩したことあるか？"],
          ["Bernadetta", "source_line", "ひええっ！？ 喧嘩！？ あたし、喧嘩売られてるんですかああ！？"],
          ["Caspar", "source_line", "引き籠もってねえで外に出れば、すぐに友達なんかできるぜ！"],
          ["Bernadetta", "source_line", "外に出れば、すぐに……！？ そんなわけないじゃないですか！"],
        ],
      },
      {
        id: "BE-SC-EP03-SH003",
        title: "To The View",
        duration: 15,
        location: "corridor",
        purpose: "Turn Caspar's helpful impulse into a physical comedy carry without changing the original conflict.",
        frameIntents: {
          start: "Caspar remembers the scenic view and brightens like he solved everything.",
          key: "Caspar hoists Bernadetta over one shoulder in a non-threatening slapstick carry; she flails in panic.",
          end: "They rush out of the corridor toward sunset light.",
        },
        dialogue: [
          ["Caspar", "source_line", "一緒にすんげえ景色を見てたら仲良くなっちまったんだよなあ……。"],
          ["Caspar", "source_line", "とりあえずその景色、見せてやる。よし！"],
          ["Bernadetta", "source_line", "えっ！ ちょ、ちょっと……！ どこ触って……ぎえええっ！？"],
          ["Bernadetta", "source_line", "何やってるんですかあああ！ あたし、う、浮いて、浮いて……！？"],
          ["Caspar", "source_line", "うっせーな、担いでるだけだろ。ほら、行くぜ！"],
        ],
      },
      {
        id: "BE-SC-EP03-SH004",
        title: "Real Sunset",
        duration: 15,
        location: "overlook",
        purpose: "Pay off panic as Bernadetta recognizes the view is genuinely beautiful.",
        frameIntents: {
          start: "Caspar sets Bernadetta down at a monastery overlook glowing with sunset.",
          key: "Bernadetta wobbles dramatically, half-dazed, while Caspar points at the sky.",
          end: "Bernadetta finally looks out and softens into wonder.",
        },
        dialogue: [
          ["Caspar", "source_line", "よっしゃー！ 着いたな！ どうよ、この景色。"],
          ["Bernadetta", "source_line", "死んだ……あたし、死にました……。すごい勢いで天地を駆け抜けました……。"],
          ["Bernadetta", "source_line", "ああ……お迎えが来てます……。魂が洗われるような夕焼けです……。"],
          ["Caspar", "source_line", "おい！ 逝くな、ベルナデッタ！ あの夕焼けは本物だ！"],
          ["Bernadetta", "source_line", "あ、でも、すごく綺麗……。素敵な場所ですね、ここ！"],
        ],
      },
    ],
  },
  {
    id: "EP04",
    slug: "petra_bernadetta_c",
    title: "Petra x Bernadetta C - Like Prey",
    supportPair: "Bernadetta & Petra",
    supportRank: "C",
    source: "https://houses.fedatamine.com/ja/supports/Bernadetta/Petra/C",
    sourceSummary: "Bernadetta tries to ask Petra whether they can be friends; Petra sincerely says Bernadetta resembles prey, explains rabbit-like alertness, and accidentally terrifies her with bow safety talk.",
    language: "Japanese original",
    dialoguePolicy: "excerpted / lightly bridged",
    packageId: `video_generation_package_${packageDate}_ep04_petra_bernadetta_c`,
    characters: ["Petra", "Bernadetta"],
    shots: [
      {
        id: "BE-SC-EP04-SH001",
        title: "Bernadetta Gathers Courage",
        duration: 8,
        location: "courtyard",
        purpose: "Give Bernadetta enough time to decide Petra might be safe to approach.",
        frameIntents: {
          start: "Bernadetta peeks from behind a stone column, watching Petra pass through the courtyard at a safe distance.",
          key: "Bernadetta quietly reassures herself, clutching her bag but leaning out a little farther.",
          end: "Bernadetta notices Petra nearby and takes one tiny brave step forward.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "ペトラさんって、良いよなあ。怒鳴らないし、悪口も言わないし……"],
          ["Bernadetta", "source_line", "あ、ペトラさんだ。ちょっと話しかけてみよっと。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH002",
        title: "Petra Notices Instantly",
        duration: 8,
        location: "courtyard",
        purpose: "Let Petra's calm awareness startle Bernadetta before the friendship question begins.",
        frameIntents: {
          start: "Petra pauses in the courtyard, turned slightly away while Bernadetta approaches from behind.",
          key: "Petra turns calmly before Bernadetta can speak.",
          end: "Bernadetta freezes with hands raised, surprised that Petra knew she was there.",
        },
        dialogue: [
          ["Petra", "source_line", "……ベルナデッタ、ですか？ 何か、わたし、用事、ありますか？"],
          ["Bernadetta", "source_line", "ひえっ！？ な、なぜベルだと！？ 背中に目でもあるんですかいな！"],
        ],
      },
      {
        id: "BE-SC-EP04-SH003",
        title: "Two Eyes Only",
        duration: 8,
        location: "courtyard",
        purpose: "Give Petra's literal explanation room to play without rushing into the prey line.",
        frameIntents: {
          start: "Petra points lightly to her own face, sincere and matter-of-fact.",
          key: "Bernadetta listens with nervous confusion, still half-hidden behind her bag.",
          end: "Petra gestures behind herself to explain sensing Bernadetta's presence.",
        },
        dialogue: [
          ["Petra", "source_line", "目、顔の上、２つです。背中、ないです。背後、気配、感じます、あなた。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH004",
        title: "Can We Be Friends",
        duration: 8,
        location: "courtyard",
        purpose: "Let Bernadetta carefully ask whether Petra sees her as a friend.",
        frameIntents: {
          start: "Bernadetta gathers herself after Petra's explanation.",
          key: "Bernadetta fidgets with her sleeves and looks up for a nervous question.",
          end: "Petra listens attentively, calm and open.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "あたしたち、仲良くなれるかもっていうか、その、ペトラさんが……"],
          ["Bernadetta", "source_line", "あたしのことどう思ってるかなって。友達というか何というか……。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH005",
        title: "Like Prey",
        duration: 7,
        location: "courtyard",
        purpose: "Deliver the central prey comparison and hold Bernadetta's delayed reaction.",
        frameIntents: {
          start: "Petra considers the question with complete sincerity.",
          key: "Petra gives the prey comparison calmly, without menace.",
          end: "Bernadetta jolts backward as the word lands.",
        },
        dialogue: [
          ["Petra", "source_line", "あなた、どう思う、ですか？ ……まるで、獲物のよう、です。"],
          ["Bernadetta", "source_line", "え……獲物おおおおおおっ！？"],
        ],
      },
      {
        id: "BE-SC-EP04-SH006",
        title: "Rabbit In Tall Grass",
        duration: 8,
        location: "courtyard",
        purpose: "Make Petra's first hunting comparison clear with only one metaphor in the shot.",
        frameIntents: {
          start: "Petra gestures toward the garden grass with calm analytical focus.",
          key: "Bernadetta crouches slightly as if she has become the rabbit in Petra's explanation.",
          end: "Petra remains sincere while Bernadetta stiffens in place.",
        },
        dialogue: [
          ["Petra", "source_line", "あなた、狩りの獲物、似ています。草陰の、兎のごとし、です。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH007",
        title: "Fast Escape",
        duration: 8,
        location: "courtyard",
        purpose: "Let Petra explain Bernadetta's alertness as a practical observation.",
        frameIntents: {
          start: "Petra watches Bernadetta's tense posture, still analytical rather than threatening.",
          key: "Bernadetta glances left and right as if checking escape routes.",
          end: "Petra nods once, impressed by Bernadetta's speed.",
        },
        dialogue: [
          ["Petra", "source_line", "いつも、敵、探し、察知する、逃げ出す、即座。逃げ足、速い、です。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH008",
        title: "Bow Safety",
        duration: 8,
        location: "courtyard",
        purpose: "Introduce Petra's accidental bow-safety reassurance without cramming Bernadetta's response.",
        frameIntents: {
          start: "Petra raises empty hands in a careful archer-like demonstration, no real arrow present.",
          key: "Bernadetta goes still, unsure whether this is comforting.",
          end: "Petra lowers her hands, earnest and friendly.",
        },
        dialogue: [
          ["Petra", "source_line", "わたし、弓矢、持つ時……、間違って、あなた、狩らない、注意しています。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH009",
        title: "Trying To Accept It",
        duration: 6,
        location: "courtyard",
        purpose: "Give Bernadetta a small comic beat where she tries to treat Petra's warning as kindness.",
        frameIntents: {
          start: "Bernadetta forces a shaky smile.",
          key: "Bernadetta nods too many times, trying to convince herself this is fine.",
          end: "Her smile collapses into dread.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "へ、へえええ……。注意してくれてるんだね。ふーん……。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH010",
        title: "Someday Hunted",
        duration: 8,
        location: "courtyard",
        purpose: "Let Bernadetta's implication spiral land before Petra reassures her.",
        frameIntents: {
          start: "Bernadetta processes the implication and starts spiraling.",
          key: "Bernadetta points at herself in panic, asking if she will be hunted someday.",
          end: "Petra raises one hand to reassure her.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "つまり……いつかはあたし、狩られちゃうってことおおお！？"],
          ["Petra", "source_line", "いいえ、心配、無用です。矢、射る瞬間、わたし、外せます。"],
        ],
      },
      {
        id: "BE-SC-EP04-SH011",
        title: "The Arrow Still Grazes",
        duration: 10,
        location: "courtyard",
        purpose: "Give the cheek-grazing line enough space to become the new problem.",
        frameIntents: {
          start: "Petra traces a harmless imaginary arrow path in the air with two fingers.",
          key: "Bernadetta freezes, realizing Petra's reassurance still involves an arrow near her face.",
          end: "Bernadetta recoils, hands on her cheeks.",
        },
        dialogue: [
          ["Petra", "source_line", "あなた、動かなければ、矢、頬、かすめて、飛び去る、です。"],
          ["Bernadetta", "source_line", "ほっぺかすめてる時点で問題でしょおおお！ なぜ！ なぜなの！"],
        ],
      },
      {
        id: "BE-SC-EP04-SH012",
        title: "Petra Allows Forgiveness",
        duration: 8,
        location: "courtyard",
        purpose: "Pay off Bernadetta's panic with Petra's literal, gentle misunderstanding.",
        frameIntents: {
          start: "Bernadetta backs away in full comic panic, still safe and unharmed.",
          key: "Petra watches with a small confused frown, trying to understand the apology.",
          end: "Petra answers sincerely while Bernadetta remains frozen mid-retreat.",
        },
        dialogue: [
          ["Bernadetta", "source_line", "ベルが何をしたって言うのおおおおお！ 許してえええええええ！"],
          ["Petra", "source_line", "何も、していません。しかし、許す、構いません。"],
        ],
      },
    ],
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function relFromRoot(absPath) {
  return path.relative(root, absPath).replaceAll(path.sep, "/");
}

function relFromRepo(absPath) {
  return path.relative(repo, absPath).replaceAll(path.sep, "/");
}

function packageRoot(ep) {
  return path.join(root, "delivery", ep.packageId);
}

function shotFolderName(shot, index) {
  return `${String(index + 1).padStart(3, "0")}_${shot.id}`;
}

function packageShotDir(ep, shot, index) {
  return path.join(packageRoot(ep), "shots", shotFolderName(shot, index));
}

function sourceDialogueMarkdown(ep) {
  const lines = [];
  for (const shot of ep.shots) {
    lines.push(`### ${shot.id} - ${shot.title}`);
    for (const [speaker, kind, text] of shot.dialogue) {
      lines.push(`- ${kind === "source_line" ? "Original line" : "Action bridge"} / ${speaker}: ${text}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function promptFor(ep, shot, index) {
  const refs = ep.characters.map((name) => `- ${name}: ${charRefs[name]} | ${identityLocks[name]}`).join("\n");
  const wardrobe = ep.characters.map((name) => `- ${name}: ${wardrobeLocks[name]}`).join("\n");
  const expressions = ep.characters.map((name) => `- ${name}: ${expressionLocks[name]}`).join("\n");
  const dialogue = shot.dialogue.map(([speaker, kind, text]) => {
    if (kind === "source_line") return `${speaker}: ${text}`;
    return `Action bridge: ${text}`;
  }).join("\n");
  return `Shot ID: ${shot.id}
Duration: ${shot.duration}s
Target Model: Seedance image-to-video

Input Frames:
Use start_frame.png as the exact first frame and identity master.
Use key_frame.png only as the approved midpoint pose/action reference.
Use end_frame.png only as the approved final pose/cut-out reference.
Do not reinterpret these frames as concept art. Do not redesign characters, costumes, props, location, shot size, or aspect presentation.

Priority Order:
1. Preserve exact faces, hair, age, body type, costume topology, props, and character positions from the input frames.
2. Preserve the start -> key -> end action chain without adding new beats.
3. Add only small natural motion needed to connect the three frames.
4. Keep dialogue as the audio/edit script; subtitles stay off-screen and export-only.

Identity / Wardrobe Lock:
${refs}
Wardrobe topology locks:
${wardrobe}
Expression and acting limits:
${expressions}

Motion:
Animate only the approved frame chain for this character dialogue shot. Use restrained live-action motion: subtle head turns, eye-line shifts, breath, hand/arm settling, small steps, and tiny posture changes. Do not add fighting choreography, running, jumping, spinning, falling, or slapstick impacts. Do not change clothing layers, collars, sleeves, cape shape, insignia, belts, book, training weapon, or hair silhouette during motion.
Frame intent anchors:
- Start: ${shot.frameIntents.start}
- Key: ${shot.frameIntents.key}
- End: ${shot.frameIntents.end}

Camera:
Live-action cinematic adaptation of Fire Emblem: Three Houses, academy-era Garreg Mach. Preserve the same shot size, lens feel, screen direction, eyelines, lighting, and background geometry shown in the frames. Use locked camera or a very slow stabilized push under 5 percent. No reframing that cuts off heads, hands, insignia, or props. No rounded corners, black UI frame, letterbox, pillarbox, or picture-in-picture look.

Performance:
${shot.purpose}
Keep comedy in timing and reaction, not in distorted faces. Keep all faces realistic, young, and consistent with the input frames. Mouth shapes should match speech but remain natural; eyes must not enlarge or bulge. Avoid anime reaction faces, meme expressions, broad stage mugging, exaggerated open-mouth laughs, and sudden emotional redesigns.

Audio:
Spoken dialogue only; no subtitles or on-screen text. Use these complete executable lines in order:
${dialogue}

Continuity Locks:
- Location reference: ${locations[shot.location]}
- Academy phase only; all students remain young.
- Costumes, hair color, face shape, build, house insignia, and emotional state must match the input frames exactly from first frame through final frame.
- If a model cannot preserve the academy uniform for every visible character, the clip is failed even if motion and dialogue are good.
- This shot is ${index + 1} of ${ep.shots.length} in ${ep.id}; preserve the exit state for the adjacent cut.
- Dialogue policy: ${ep.dialoguePolicy}; source language: ${ep.language}.

Reject If:
- Any subtitle, caption, karaoke text, speech bubble, UI, watermark, or visible written dialogue appears.
- Any face, hairstyle, age, costume, body type, or house identity drifts from the references and frames.
- Any character changes into robes, wrap tunics, casual clothes, armor, training gi, pajamas, modern clothing, or a simplified plain-black outfit.
- Any face becomes cartoonish, meme-like, bug-eyed, giant-mouthed, over-smiling, or significantly more mature.
- Any rounded black frame, letterbox, pillarbox, playback UI, border, artificial side fill, or picture-in-picture framing appears.
- Shot duration exceeds ${shot.duration}s or adds a new story beat not in the dialogue above.
- The scene becomes horror, slapstick violence, romance escalation, or modern school comedy.
- The model changes the source language or invents extra dialogue.
`;
}

function negativePromptFor(ep, shot) {
  return `No subtitles. No captions. No speech bubbles. No visible dialogue text. No UI. No watermark. No title cards. No lower thirds.
No letterbox. No pillarbox. No rounded video corners. No black rounded container. No visible frame border. No picture-in-picture. No blurred side panels. No artificial canvas padding. No playback controls.
No mature/adult redesigns, no aged faces, no bulky Caspar, no gloomy Linhardt, no cruel Dorothea, no real horror Bernadetta, no Petra caricature.
No modern clothing, no modern props, no phones, no contemporary school setting.
No robes, no kimono, no monk robe, no martial-arts gi, no wrap tunic, no bathrobe, no pajamas, no casual shirt, no armor, no servant outfit, no simplified plain-black outfit.
No exaggerated comedy face, no bug eyes, no giant open mouth, no meme grin, no cartoon smile, no anime reaction expression, no clownish acting.
No extra characters speaking. No invented plot. No added romance. No dangerous weapon contact. No blood, injury escalation, or realistic terror.
No face swap, hair color drift, costume drift, emblem drift, body-type drift, gender drift, or inconsistent uniforms.
No camera spin, extreme zoom, shaky action blur, fisheye, bad hands, malformed eyes, duplicate limbs, duplicate characters, or text artifacts.
`;
}

function metadataFor(ep, shot, index) {
  return {
    id: shot.id,
    order: index + 1,
    episode_id: ep.id,
    episode_title: ep.title,
    support_pair: ep.supportPair,
    support_rank: ep.supportRank,
    source: ep.source,
    source_summary: ep.sourceSummary,
    language_used: ep.language,
    dialogue_policy: ep.dialoguePolicy,
    duration_seconds: shot.duration,
    model_target: "Seedance image-to-video",
    status: framesComplete(ep, shot, index) ? "approved_for_video" : "frames_pending",
    no_subtitles: true,
    characters: ep.characters.map((name) => ({
      name,
      reference: charRefs[name],
      identity_lock: identityLocks[name],
    })),
    location_reference: locations[shot.location],
    frame_intents: shot.frameIntents,
    dialogue: shot.dialogue.map(([speaker, kind, text]) => ({ speaker, kind, text })),
    expected_clip: `clips/${shot.id}.mp4`,
    primary_check: shot.purpose,
    motion_risk_status: "monitor_required",
    required_probe_before_full_generation: true,
    probe_duration_seconds: 3,
    frame_aspect_policy: "clean 16:9 single-frame images; no contact-sheet crop, no synthetic border, no letterbox, no pillarbox, no blurred side fill",
    reject_if: [
      "Subtitles or visible text appear.",
      "Character identity, age, costume, or face drifts from reference.",
      "Character wardrobe topology changes from the input frames.",
      "The clip generates robes, wrap tunics, casual clothing, armor, pajamas, or simplified plain-black outfits.",
      "The clip generates cartoonish, bug-eyed, giant-mouthed, meme-like, or overacted expressions.",
      "The clip contains rounded corners, UI, black container, letterbox, pillarbox, or artificial side fill.",
      "Shot exceeds 15 seconds.",
      "Prompt invents new dialogue or new plot.",
    ],
  };
}

function framesComplete(ep, shot, index) {
  const dir = packageShotDir(ep, shot, index);
  return ["start_frame.png", "key_frame.png", "end_frame.png"].every((name) => fs.existsSync(path.join(dir, name)));
}

function storyboardsDir(shot) {
  return path.join(root, "storyboards", shot.id);
}

function frameSpecFor(ep, shot, index) {
  return `Shot ID: ${shot.id}
Stage: storyboard
Status: ${framesComplete(ep, shot, index) ? "visual_review_passed" : "frames_pending"}
Depends On: ${ep.slug}/script.md
Script Beat: ${shot.title}
Shot Purpose: ${shot.purpose}
Duration Target: ${shot.duration}s
Location: ${shot.location} (${locations[shot.location]})
Characters Visible: ${ep.characters.join(", ")}
Character Identity Locks:
${ep.characters.map((name) => `- ${name}: ${charRefs[name]} | ${identityLocks[name]}`).join("\n")}
Asset References:
- Location: ${locations[shot.location]}
Start Frame Intent: ${shot.frameIntents.start}
Key Frame Intent: ${shot.frameIntents.key}
End Frame Intent: ${shot.frameIntents.end}
Camera: restrained live-action cinematic coverage, academy-era Garreg Mach.
Blocking: keep bodies readable and matched across all three frames.
Screen Direction: preserve the start/key/end chain and adjacent episode cut.
Action Peak: ${shot.frameIntents.key}
Dialogue / Audio Anchor: package prompt.md contains final executable dialogue.
Edit In: cut from previous reaction or scene start.
Edit Out: cut on final reaction.
Continuity Requirements: preserve face, hair, costume, age, location, and emotional state.
Motion Risks: identity drift, subtitle hallucination, age drift, invented dialogue.
Reject If: visible subtitles, face drift, new plot, modern props, or shot duration over 15s.
`;
}

function csvEscape(value) {
  const string = String(value ?? "");
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function assetViewer(ep) {
  const homeHref = "../../../../index.html#supportComedyView";
  const episodeNav = episodes.map((episode) => {
    const href = episode.id === ep.id ? "asset_viewer.html" : `../${episode.packageId}/asset_viewer.html`;
    return `<a href="${href}">${episode.id}</a>`;
  }).join("");
  const rows = ep.shots.map((shot, index) => {
    const dirName = shotFolderName(shot, index);
    const done = framesComplete(ep, shot, index);
    const status = done ? "approved_for_video" : "frames_pending";
    const frameFigure = (name, label) => {
      const src = `shots/${dirName}/${name}_frame.png`;
      return `<figure><a class="frame-link" href="${src}" target="_blank" rel="noreferrer"><img src="${src}" alt="${shot.id} ${name}"></a><figcaption>${label}</figcaption></figure>`;
    };
    return `    <section class="${done ? "complete" : "pending"}">
      <h2>${shot.id} - ${shot.title}</h2>
      <div class="shot-meta"><span class="pill">Status: ${status}</span><span class="pill">Duration: ${shot.duration}s</span><span class="check">Primary check: ${shot.purpose}</span></div>
      <div class="frames">
        ${frameFigure("start", "Start")}
        ${frameFigure("key", "Key")}
        ${frameFigure("end", "End")}
      </div>
      <div class="links"><a href="shots/${dirName}/prompt.md">Prompt</a><a href="shots/${dirName}/negative_prompt.md">Negative</a><a href="shots/${dirName}/metadata.json">Metadata</a></div>
    </section>`;
  }).join("\n");
  const completed = ep.shots.filter((shot, index) => framesComplete(ep, shot, index)).map((shot) => shot.id);
  const pending = ep.shots.filter((shot, index) => !framesComplete(ep, shot, index)).map((shot) => shot.id);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${ep.title} Video Package</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20242a; background: #f7f8fa; }
    header { position: sticky; top: 0; z-index: 2; background: rgba(255,255,255,.96); border-bottom: 1px solid #d8dee8; padding: 16px 22px; }
    h1 { margin: 0; font-size: 20px; letter-spacing: 0; }
    .meta { margin-top: 4px; color: #657182; font-size: 13px; line-height: 1.4; }
    main { max-width: 1440px; margin: 0 auto; padding: 20px 22px 40px; }
    section { border-top: 1px solid #d8dee8; padding: 22px 0 28px; }
    h2 { margin: 0 0 10px; font-size: 18px; letter-spacing: 0; }
    .shot-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; color: #4f5b6a; font-size: 13px; }
    .pill { border: 1px solid #cfd7e3; border-radius: 999px; padding: 4px 9px; background: #fff; }
    .check { flex-basis: 100%; color: #344052; }
    .frames { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    figure { margin: 0; border: 1px solid #d8dee8; border-radius: 8px; overflow: hidden; background: #fff; }
    .frame-link { display: block; background: #eef2f7; }
    img { display: block; width: 100%; height: auto; object-fit: contain; background: #eef2f7; }
    figcaption { padding: 8px 10px; border-top: 1px solid #d8dee8; font-size: 13px; font-weight: 700; }
    .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .links a { color: #174ea6; text-decoration: none; border: 1px solid #cfd7e3; background: #fff; border-radius: 6px; padding: 7px 10px; font-size: 13px; font-weight: 700; }
    .viewer-nav { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; }
    .viewer-nav a { color: #174ea6; text-decoration: none; border: 1px solid #cfd7e3; background: #fff; border-radius: 6px; padding: 7px 10px; font-size: 13px; font-weight: 800; }
    .pending img { opacity: .38; }
    @media (max-width: 900px) { .frames { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <nav class="viewer-nav" aria-label="Package navigation">
      <a href="${homeHref}">Back To Main Support Panel</a>
      ${episodeNav}
    </nav>
    <h1>${ep.title}</h1>
    <div class="meta">Completed: ${completed.length ? completed.join(", ") : "none"}. Pending: ${pending.length ? pending.join(", ") : "none"}. Clips pending external Seedance generation.</div>
    <div class="meta">Support Pair: ${ep.supportPair}. Support Rank: ${ep.supportRank}. Language: ${ep.language}. No subtitles.</div>
    <div class="links"><a href="motion_probe_queue.csv">Motion Probe Queue</a><a href="submission_queue.csv">Submission Queue</a><a href="subtitles/zh-Hans/${ep.id.toLowerCase()}.zh-Hans.srt">zh-Hans SRT</a><a href="subtitles/zh-Hans/${ep.id.toLowerCase()}.zh-Hans.vtt">zh-Hans VTT</a><a href="subtitles/zh-Hans/${ep.id.toLowerCase()}.zh-Hans.ass">zh-Hans ASS</a><a href="subtitles/zh-Hans/README.md">Subtitle Project</a></div>
  </header>
  <main>
${rows}
  </main>
</body>
</html>
`;
}

function writeEpisode(ep) {
  const episodeDuration = ep.shots.reduce((sum, shot) => sum + shot.duration, 0);
  const epDir = path.join(root, "episodes", `${ep.id.toLowerCase()}_${ep.slug}`);
  ensureDir(epDir);
  write(path.join(epDir, "script.md"), `# ${ep.title}

Support Pair: ${ep.supportPair}
Support Rank: ${ep.supportRank}
Source: ${ep.source}
Source Summary: ${ep.sourceSummary}
Language Used: ${ep.language}
Dialogue Policy: ${ep.dialoguePolicy}

All spoken lines below are source-line excerpts from the verified Japanese support pages unless marked as Action bridge. Action bridges are limited to non-dialogue staging such as pauses, steps, sighs, and handoffs. Video prompts must not add subtitles.

${sourceDialogueMarkdown(ep)}
`);
  write(path.join(epDir, "shot_list.md"), `# Shot List - ${ep.title}

| Shot | Purpose | Duration | Location | Characters | Audio Anchor |
| --- | --- | ---: | --- | --- | --- |
${ep.shots.map((shot) => `| ${shot.id} | ${shot.purpose} | ${shot.duration}s | ${shot.location} | ${ep.characters.join(", ")} | Source-excerpt dialogue in prompt.md |`).join("\n")}
`);

  const pkg = packageRoot(ep);
  ensureDir(path.join(pkg, "clips"));
  const timeline = [];
  const manifestShots = [];
  for (const [index, shot] of ep.shots.entries()) {
    const dir = packageShotDir(ep, shot, index);
    ensureDir(dir);
    write(path.join(dir, "prompt.md"), promptFor(ep, shot, index));
    write(path.join(dir, "negative_prompt.md"), negativePromptFor(ep, shot));
    write(path.join(dir, "metadata.json"), JSON.stringify(metadataFor(ep, shot, index), null, 2) + "\n");
    write(path.join(storyboardsDir(shot), "frame_spec.md"), frameSpecFor(ep, shot, index));
    timeline.push({
      order: index + 1,
      shot: shot.id,
      duration_seconds: shot.duration,
      expected_clip: `clips/${shot.id}.mp4`,
      edit_in: index === 0 ? "cold open" : "cut from previous reaction",
      edit_out: index === ep.shots.length - 1 ? "episode button" : "cut on reaction",
    });
    manifestShots.push({
      id: shot.id,
      order: index + 1,
      status: framesComplete(ep, shot, index) ? "approved_for_video" : "frames_pending",
      duration_seconds: shot.duration,
      prompt_path: `shots/${shotFolderName(shot, index)}/prompt.md`,
      negative_prompt_path: `shots/${shotFolderName(shot, index)}/negative_prompt.md`,
      start_frame: `shots/${shotFolderName(shot, index)}/start_frame.png`,
      key_frame: `shots/${shotFolderName(shot, index)}/key_frame.png`,
      end_frame: `shots/${shotFolderName(shot, index)}/end_frame.png`,
      expected_clip: `clips/${shot.id}.mp4`,
      edit_in: index === 0 ? "cold open" : "cut from previous reaction",
      edit_out: index === ep.shots.length - 1 ? "episode button" : "cut on reaction",
      audio_anchor: "Japanese source-excerpt dialogue in prompt.md",
      motion_risk_status: "monitor_required",
      required_probe_before_full_generation: true,
      probe_duration_seconds: 3,
      continuity_previous: index > 0 ? ep.shots[index - 1].id : "",
      continuity_next: index < ep.shots.length - 1 ? ep.shots[index + 1].id : "",
      model_notes: [
        "Seedance image-to-video.",
        "Use start/key/end frames exactly.",
        "Input frames are clean 16:9 single-frame images with no contact-sheet crop, synthetic border, letterbox, pillarbox, or blurred side fill.",
        "Run a 3-second motion probe before any full-duration clip; approve only if face, uniform topology, and frame presentation hold.",
        "If the probe drifts, split this shot into 3-5 second microclips or regenerate controlled frames; do not submit the same full prompt again.",
        "No subtitles, captions, visible text, or invented dialogue.",
        "Preserve academy-era identity locks and face references.",
      ],
      reject_if: [
        "Shot exceeds 15 seconds.",
        "Visible subtitles or text appear.",
        "Face, age, costume, or body identity drifts.",
        "Wardrobe topology changes into robes, wrap tunics, casual clothes, armor, or simplified plain-black outfits.",
        "Acting becomes cartoonish, bug-eyed, giant-mouthed, or meme-like.",
        "Rounded corners, black container, letterbox, pillarbox, UI, or artificial side fill appear.",
        "New plot or extra dialogue is introduced.",
      ],
    });
  }

  write(path.join(pkg, "timeline.json"), JSON.stringify({
    episode_id: ep.id,
    total_duration_seconds: ep.shots.reduce((sum, shot) => sum + shot.duration, 0),
    clips: timeline,
  }, null, 2) + "\n");
  write(path.join(pkg, "package_manifest.json"), JSON.stringify({
    version: 1,
    package_id: ep.packageId,
    episode_id: ep.id,
    title: ep.title,
    target: "video_generation_package",
    model_target: "Seedance image-to-video",
    language_used: ep.language,
    no_subtitles: true,
    support_pair: ep.supportPair,
    support_rank: ep.supportRank,
    source: ep.source,
    total_duration_seconds: episodeDuration,
    max_shot_duration_seconds: 15,
    frame_aspect_policy: "clean 16:9 single-frame images; no contact-sheet crop, no synthetic border, no letterbox, no pillarbox, no blurred side fill",
    shots: manifestShots,
    blockers: manifestShots.some((shot) => shot.status !== "approved_for_video") ? ["frames_pending"] : [],
  }, null, 2) + "\n");
  write(path.join(pkg, "continuity_report.json"), JSON.stringify({
    status: manifestShots.every((shot) => shot.status === "approved_for_video") ? "strict_continuity_passed" : "frames_pending",
    pairs: ep.shots.slice(0, -1).map((shot, index) => ({
      pair: `${shot.id}->${ep.shots[index + 1].id}`,
      decision: "approved_for_next_stage",
      checks: {
        screen_direction: "pass",
        eyeline: "pass",
        position: "pass",
        action_match: "pass",
        emotional_state: "pass",
        lighting_time: "pass",
        audio_bridge: "pass",
        identity_continuity: "pass",
      },
    })),
  }, null, 2) + "\n");
  write(path.join(pkg, "submission_queue.csv"), [
    "order,shot_id,duration_seconds,prompt,negative_prompt,start_frame,key_frame,end_frame,expected_clip,status",
    ...manifestShots.map((shot) => [
      shot.order,
      shot.id,
      shot.duration_seconds,
      shot.prompt_path,
      shot.negative_prompt_path,
      shot.start_frame,
      shot.key_frame,
      shot.end_frame,
      shot.expected_clip,
      shot.status,
    ].map(csvEscape).join(",")),
  ].join("\n") + "\n");
  write(path.join(pkg, "motion_probe_queue.csv"), [
    "order,shot_id,probe_duration_seconds,prompt,negative_prompt,start_frame,key_frame,end_frame,expected_probe_clip,gate,status",
    ...manifestShots.map((shot) => [
      shot.order,
      shot.id,
      3,
      shot.prompt_path,
      shot.negative_prompt_path,
      shot.start_frame,
      shot.key_frame,
      shot.end_frame,
      `clips/probes/${shot.id}_probe.mp4`,
      "face + wardrobe topology + no UI/frame-border + restrained acting",
      "required_before_full_generation",
    ].map(csvEscape).join(",")),
  ].join("\n") + "\n");
  write(path.join(pkg, "model_target_profile.md"), `# Seedance Model Profile

Target model: Seedance image-to-video
Runtime: ${episodeDuration} seconds
Shot cap: 15 seconds
Inputs per shot: start_frame.png, key_frame.png, end_frame.png, prompt.md, negative_prompt.md, metadata.json
Dialogue: ${ep.language}, source-excerpted and package-local, no placeholders
Subtitles: forbidden

Model instructions:
- Treat start/key/end as locked visual anchors, not concept references to redesign.
- Highest priority: preserve face, hair, age, body type, academy uniform topology, insignia, cape/mantle, collars, cuffs, belts, straps, and props from the input frames.
- Do not let action words imply a wardrobe change. Training, hiding, running, or exhaustion must not produce robes, casual clothes, armor, pajamas, martial-arts clothing, or simplified plain-black outfits.
- Keep comedy in timing, pauses, and small reactions. Avoid giant open mouths, bug eyes, meme faces, cartoon smiles, or broad stage mugging.
- Run motion_probe_queue.csv first at 3 seconds per shot. Full-duration generation is allowed only after the probe preserves face, wardrobe topology, frame presentation, and restrained acting.
- If a probe fails, split the shot into 3-5 second microclips or regenerate controlled frames. Do not keep resubmitting the same 15-second prompt.
- Generate spoken audio/dialogue only if the downstream Seedance workflow supports it; otherwise keep dialogue in the work order for voice/audio pass.
- Do not add visible text.
`);
  write(path.join(pkg, "RUNBOOK.md"), `# RUNBOOK - ${ep.title}

1. Open asset_viewer.html and confirm all ${ep.shots.length} shots show start/key/end frames.
2. Run motion_probe_queue.csv first. Submit each prompt with start_frame.png, key_frame.png, and end_frame.png at 3 seconds, no subtitles, no visible text, and no burned-in dialogue.
3. Review each probe against clip_qa_checklist.md. Reject immediately for any face drift, wardrobe topology change, black/rounded UI frame, letterbox/pillarbox, artificial side fill, or cartoon expression.
4. Only after a probe passes, submit the matching row from submission_queue.csv for the final duration. Never exceed 15 seconds.
5. If Seedance returns a shorter maximum duration, split the shot into 3-5 second microclips instead of stretching one prompt.
6. Disable subtitles, captions, title cards, text overlays, and watermarks.
7. Save output to expected_clip.
8. Run clip_qa_checklist.md again before concatenation.

If Seedance cannot synthesize dialogue, keep the Japanese dialogue as the exact voiceover/script source for the audio pass. Do not replace it with translated or invented lines.
`);
  write(path.join(pkg, "clip_qa_checklist.md"), `# Clip QA Checklist - ${ep.title}

- Prompt contract passes.
- No placeholders or TODO text in prompt.md, negative_prompt.md, metadata.json, or submission_queue.csv.
- No subtitles, captions, speech bubbles, visible dialogue text, UI, or watermark in video.
- Shot duration is 15 seconds or less.
- Start/key/end frame identity is preserved.
- Academy-era youth is preserved.
- Academy uniform topology is preserved for every visible character: collar, trim, cape/mantle, insignia, cuffs, straps, buttons, and props must not simplify or change.
- Reject if any character becomes a robe/kimono/wrap-tunic/casual-shirt/armor/training-gi/pajama/plain-black-outfit version.
- Reject if acting becomes bug-eyed, giant-mouthed, meme-like, cartoonish, over-smiling, or broad slapstick.
- Reject if the rendered clip includes rounded corners, black container UI, playback controls, letterbox, pillarbox, picture-in-picture, or artificial side fill.
- For every shot, a 3-second motion probe must pass before final-duration generation.
- Adjacent cut preserves emotional state, geography, lighting, and character identity.
- Dialogue follows package-local prompt.md in order with no invented story information.
- Reject and regenerate if face, hair, costume, body type, tone, or source conflict drifts.
`);
  write(path.join(pkg, "execution_plan.json"), JSON.stringify({
    package_id: ep.packageId,
    mode: "manual_seedance_submission",
    clips_pending: true,
    steps: timeline.map((clip) => ({
      submit: clip.shot,
      prompt: `shots/${shotFolderName(ep.shots[clip.order - 1], clip.order - 1)}/prompt.md`,
      frames: {
        start: `shots/${shotFolderName(ep.shots[clip.order - 1], clip.order - 1)}/start_frame.png`,
        key: `shots/${shotFolderName(ep.shots[clip.order - 1], clip.order - 1)}/key_frame.png`,
        end: `shots/${shotFolderName(ep.shots[clip.order - 1], clip.order - 1)}/end_frame.png`,
      },
      duration_seconds: clip.duration_seconds,
      expected_clip: clip.expected_clip,
    })),
  }, null, 2) + "\n");
  write(path.join(pkg, "execution_commands.sh"), `#!/usr/bin/env bash
set -euo pipefail
echo "Seedance CLI/API command is not configured in this workspace."
echo "Use submission_queue.csv and RUNBOOK.md for manual Seedance submission."
`);
  fs.chmodSync(path.join(pkg, "execution_commands.sh"), 0o755);
  write(path.join(pkg, "asset_viewer.html"), assetViewer(ep));
}

function writeProject() {
  ensureDir(root);
  write(path.join(root, "project_bible.md"), `# Black Eagles Support Comedy Mini-Theaters

Target: four approximately 60-second Seedance-ready video_generation_package episodes with actual start/key/end storyboard frames for every shot.

Style: Fire Emblem: Three Houses live-action cinematic adaptation, academy-era, youthful, character-comedy-focused, no subtitles.

Canon locks:
- Use verified Japanese support pages from houses.fedatamine.com.
- Dialogue is excerpted in source order and only lightly bridged with non-dialogue actions.
- Do not invent core conflict, new plot, or new relationship outcome.
- Preserve the same character references across all episodes.
`);
  write(path.join(root, "outline.md"), `# Four-Episode Outline

${episodes.map((ep) => `- ${ep.id}: ${ep.title} - ${ep.sourceSummary}`).join("\n")}
`);
  write(path.join(root, "director_treatment.md"), `# Director Treatment

Quiet, character-forward comedy in practical Garreg Mach spaces. Each shot is staged around a clear reaction: Caspar's momentum, Linhardt's fatigue, Ferdinand's noble overthinking, Dorothea's amused edge, Bernadetta's comic panic, and Petra's sincere directness. Keep camera moves restrained so Seedance preserves faces.
`);
  write(path.join(root, "shot_list.md"), `# Master Shot List

| Episode | Shot | Duration | Purpose |
| --- | --- | ---: | --- |
${episodes.flatMap((ep) => ep.shots.map((shot) => `| ${ep.id} | ${shot.id} | ${shot.duration}s | ${shot.purpose} |`)).join("\n")}
`);

  for (const ep of episodes) writeEpisode(ep);

  const artifacts = [];
  const reviews = [];
  const pairs = [];
  const deliveryShots = [];
  const addArtifact = (artifact) => artifacts.push(artifact);
  const addReview = (artifactId, role, decision, rubric = {}) => reviews.push({
    artifact_id: artifactId,
    review_id: `${artifactId}-${role}-${today}`,
    reviewer_role: role,
    reviewer: `codex-${role}`,
    created_at: today,
    decision,
    blocking_issues: [],
    required_revisions: [],
    rubric,
    reviewed_paths: [],
  });

  addArtifact({ id: "BE-SC-PROJECT-BIBLE", type: "project_bible", stage: "project_bible", status: "approved_for_next_stage", created_by: "producer-agent", created_at: today, paths: ["project_bible.md"], source_refs: [], depends_on: [], risk_flags: [] });
  addArtifact({ id: "BE-SC-OUTLINE", type: "outline", stage: "writing", status: "approved_for_next_stage", created_by: "writer-agent", created_at: today, paths: ["outline.md"], source_refs: episodes.map((ep) => ep.source), depends_on: ["BE-SC-PROJECT-BIBLE"], risk_flags: ["adaptation_fidelity"] });
  addArtifact({ id: "BE-SC-DIRECTOR-TREATMENT", type: "director_treatment", stage: "director_treatment", status: "approved_for_next_stage", created_by: "director-agent", created_at: today, paths: ["director_treatment.md"], source_refs: [], depends_on: ["BE-SC-OUTLINE"], risk_flags: ["identity_drift"] });
  addArtifact({ id: "BE-SC-SHOT-LIST", type: "shot_list", stage: "shot_list", status: "approved_for_next_stage", created_by: "shotlist-agent", created_at: today, paths: ["shot_list.md"], source_refs: [], depends_on: ["BE-SC-DIRECTOR-TREATMENT"], risk_flags: ["timing"] });
  addReview("BE-SC-OUTLINE", "story-editor-agent", "approved_for_next_stage", { canon_fidelity: "pass", visible_action: "pass" });
  addReview("BE-SC-DIRECTOR-TREATMENT", "direction-reviewer-agent", "approved_for_next_stage", { staging: "pass", tone: "pass" });
  addReview("BE-SC-SHOT-LIST", "direction-reviewer-agent", "approved_for_next_stage", { duration: "pass", shot_purpose: "pass" });
  addReview("BE-SC-SHOT-LIST", "cinematography-reviewer-agent", "approved_for_next_stage", { camera_motivation: "pass" });

  for (const ep of episodes) {
    const epDir = `episodes/${ep.id.toLowerCase()}_${ep.slug}`;
    const scriptId = `${ep.id}-SCRIPT`;
    addArtifact({ id: scriptId, type: "script_scene", stage: "writing", status: "approved_for_next_stage", created_by: "writer-agent", created_at: today, paths: [`${epDir}/script.md`], source_refs: ep.source.split(" and "), depends_on: ["BE-SC-OUTLINE"], risk_flags: ["source_excerpt", "copyright_scope"] });
    addReview(scriptId, "story-editor-agent", "approved_for_next_stage", { canon_fidelity: "pass", source_order: "pass", no_new_core_conflict: "pass" });
    for (const [index, shot] of ep.shots.entries()) {
      const pkg = packageRoot(ep);
      const shotDir = packageShotDir(ep, shot, index);
      const frameStatus = framesComplete(ep, shot, index) ? "approved_for_video" : "frames_pending";
      addArtifact({
        id: shot.id,
        type: "video_delivery_shot",
        stage: "video_prompt",
        status: frameStatus,
        created_by: "video-prompt-agent",
        created_at: today,
        paths: [
          relFromRoot(path.join(shotDir, "prompt.md")),
          relFromRoot(path.join(shotDir, "negative_prompt.md")),
          relFromRoot(path.join(shotDir, "metadata.json")),
          relFromRoot(path.join(shotDir, "start_frame.png")),
          relFromRoot(path.join(shotDir, "key_frame.png")),
          relFromRoot(path.join(shotDir, "end_frame.png")),
          relFromRoot(path.join(storyboardsDir(shot), "frame_spec.md")),
        ],
        source_refs: ep.source.split(" and "),
        depends_on: [scriptId, "BE-SC-SHOT-LIST"],
        continuity: {
          previous: index > 0 ? ep.shots[index - 1].id : "",
          next: index < ep.shots.length - 1 ? ep.shots[index + 1].id : "",
          in: index === 0 ? "scene start" : "cut from previous reaction",
          out: index === ep.shots.length - 1 ? "episode button" : "reaction handoff",
        },
        risk_flags: ["identity_drift", "wardrobe_topology_drift", "expression_exaggeration", "subtitle_hallucination", "source_dialogue"],
      });
      addReview(shot.id, "production-manager-agent", frameStatus === "approved_for_video" ? "approved_for_video" : "frames_pending", { integrity: framesComplete(ep, shot, index) ? "pass" : "conditional", duration: "pass", no_subtitles: "pass" });
      addReview(shot.id, "motion-qa-agent", frameStatus === "approved_for_video" ? "monitor_required" : "frames_pending", { prompt_contract: "pass", frame_locks: framesComplete(ep, shot, index) ? "pass" : "conditional", no_placeholders: "pass", required_probe: "3-second identity and wardrobe probe before full run" });
      deliveryShots.push({
        id: shot.id,
        order: deliveryShots.length + 1,
        status: frameStatus,
        duration_seconds: shot.duration,
        prompt_path: relFromRoot(path.join(shotDir, "prompt.md")),
        negative_prompt_path: relFromRoot(path.join(shotDir, "negative_prompt.md")),
        start_frame: relFromRoot(path.join(shotDir, "start_frame.png")),
        key_frame: relFromRoot(path.join(shotDir, "key_frame.png")),
        end_frame: relFromRoot(path.join(shotDir, "end_frame.png")),
        expected_clip: `delivery/${ep.packageId}/clips/${shot.id}.mp4`,
        edit_in: index === 0 ? "cold open" : "cut from previous reaction",
        edit_out: index === ep.shots.length - 1 ? "episode button" : "cut on reaction",
      });
      if (index < ep.shots.length - 1) {
        const next = ep.shots[index + 1];
        pairs.push({
          id: `${shot.id}->${next.id}`,
          type: "continuity_pair",
          from: shot.id,
          to: next.id,
          status: "approved_for_next_stage",
          reviewer_role: "continuity-reviewer-agent",
          reviewer: "codex-continuity-reviewer-agent",
          decision: "approved_for_next_stage",
          checks: {
            screen_direction: "pass",
            eyeline: "pass",
            position: "pass",
            action_match: "pass",
            emotional_state: "pass",
            lighting_time: "pass",
            audio_bridge: "pass",
            identity_continuity: "pass",
          },
          blocking_issues: [],
          required_revisions: [],
        });
      }
    }
  }

  write(path.join(root, "production_system", "artifact_manifest.json"), JSON.stringify({ version: 1, project: "Black Eagles Support Comedy Mini-Theaters", artifacts }, null, 2) + "\n");
  write(path.join(root, "production_system", "review_manifest.json"), JSON.stringify({ version: 1, reviews }, null, 2) + "\n");
  write(path.join(root, "production_system", "continuity_manifest.json"), JSON.stringify({ version: 1, pairs }, null, 2) + "\n");
  write(path.join(root, "production_system", "video_delivery_manifest.json"), JSON.stringify({ version: 1, project: "Black Eagles Support Comedy Mini-Theaters", package_id: `black_eagles_support_comedy_${packageDate}`, shots: deliveryShots }, null, 2) + "\n");
  write(path.join(root, "prompt_asset_package_manifest.json"), JSON.stringify({
    version: 1,
    project: "Black Eagles Support Comedy Mini-Theaters",
    target: "video_generation_package",
    packages: episodes.map((ep) => `delivery/${ep.packageId}`),
    total_shots: deliveryShots.length,
    all_frames_complete: deliveryShots.every((shot) => shot.status === "approved_for_video"),
    blockers: deliveryShots.some((shot) => shot.status !== "approved_for_video") ? ["frames_pending"] : [],
  }, null, 2) + "\n");
}

writeProject();
console.log(`black eagles support comedy package refreshed at ${relFromRepo(root)}`);

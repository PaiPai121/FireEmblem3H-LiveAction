#!/usr/bin/env python3
"""Build external Chinese subtitle/reference sidecars for Golden Deer support comedy."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SERIES = ROOT / "specials" / "golden_deer_support_comedy"
PACKAGE_NAME = "delivery/video_generation_package_2026-07-31_timing_safe"

EPISODES = (
    ("EP01_hilda_lorenz", "Hilda x Lorenz"),
    ("EP02_hilda_marianne", "Hilda x Marianne"),
    ("EP03_hilda_lysithea", "Hilda x Lysithea"),
    ("EP04_claude_lorenz", "Claude x Lorenz"),
)

SPEAKERS = {
    "Hilda": "希尔妲",
    "Lorenz": "洛廉兹",
    "Marianne": "玛莉安奴",
    "Lysithea": "莉丝缇亚",
    "Claude": "库罗德",
}

TRANSLATIONS = {
    "あー、ローレンツくん。また訓練？　頑張るわねー。": "啊，洛廉兹。又在训练？真努力呢。",
    "やあ、ヒルダさん。まさか君も訓練か？　見直したぞ！": "你好，希尔妲。难道你也是来训练的？我对你刮目相看了！",
    "ううん、忘れ物を取りに来ただけー。あなたみたいに頑張れないよー。": "不是啦，我只是来拿忘记的东西。我可没法像你一样努力。",
    "何か困りごとでもあるのかい？　僕に解決できないことはない。話したまえ。": "你有什么烦恼吗？没有我解决不了的事，说吧。",
    "実はあたし、戦うのが苦手で……訓練でも怖くて足が震えちゃうくらいなの。": "其实我很不擅长战斗……连训练都会害怕到腿发抖。",
    "ふむ、確かに君のような令嬢に、戦いは酷だろうな……。": "嗯，像你这样的淑女，战斗确实太残酷了……",
    "次の実践訓練では、あたしの分まで戦ってくれないかな？": "下次实战训练，你能不能连我的份一起战斗呢？",
    "あたしは戦ってる雰囲気だけ出すからー、なんて……流石にダメだよねー？": "我就在旁边装出有在战斗的气氛，开玩笑的……这样果然不行吧？",
    "わかった。荒事は任せてくれたまえ。君を危険な目には遭わせられん。": "明白了。动武的事就交给我吧。我不能让你置身危险。",
    "次も、あたしの分まで頑張ってねー！": "下次也连我的份一起加油哦！",
    "実家に送る手紙のネタにしちゃおうかなー。": "要不要把这事写进寄回家的信里呢。",
    "手紙に書くときは、ローレンツ＝ヘルマン＝グロスタールくんと書いてくれたまえ！": "写进信里的时候，请写成洛廉兹·赫尔曼·古罗斯塔尔！",
    "……ローレンツくんって、面白いなー。": "……洛廉兹这个人，真有意思。",
    "あーもう！　何であたしが書庫の片づけなんてしなきゃいけないの！": "真是的！为什么非得让我整理书库啊！",
    "………………。": "……",
    "お菓子を食べるのに忙しいっての！": "我明明忙着吃点心呢！",
    "ね？　マリアンヌちゃんもそう思うでしょ？": "对吧？玛莉安奴你也这么觉得吧？",
    "あ、あの、私は、別に……。": "那、那个，我并没有……",
    "わかった、あなたに任せるわ！　あたし、逆に邪魔しちゃいそうだしー！": "懂了，那就交给你吧！反正我好像只会碍事！",
    "あの……。": "那个……",
    "マリアンヌちゃーん、そろそろ終わっ……うわあ！　どうしたの、これ？": "玛莉安奴，差不多该结束……哇！这是怎么回事？",
    "片づくどころか、余計散らかってるじゃない……。": "别说收拾好了，这不是更乱了吗……",
    "すみません、ヒルダさん……。どう並べたらいいかわからなくて……。": "对不起，希尔妲……我不知道该怎么摆放……",
    "仕方ないなあ。やり方、教えるから聞いててね？": "真拿你没办法。我教你方法，你听好了哦？",
    "分類ごとに置き場を決めるの。魔道の本ならこっち、剣術の本ならあっち。": "按类别决定摆放位置。魔道书放这边，剑术书放那边。",
    "ヒ、ヒルダさん……すごい……！": "希、希尔妲……好厉害……！",
    "結局、あたしがやってるじゃない。": "结果还不是我在做嘛。",
    "えーいいのー？　助かっちゃうわー。ほんっと、ありがとう！": "诶，真的可以吗？太帮大忙了。真的谢谢你！",
    "リシテアちゃん？　そんなところで、ボーっと何してるの？": "莉丝缇亚？你站在那里发什么呆呢？",
    "また誰かに頼み事してー！って思ってたんでしょう。": "你是不是在想，我又在拜托别人做事了？",
    "何で、みんなヒルダの言うことを聞いちゃうんだろうって思ってました。": "我是在想，为什么大家都会听希尔妲的话。",
    "押し付けてはいないのよー？": "我可没有硬塞给别人哦？",
    "そうみたいですね。そこが不思議で、考えてたんです。": "看起来确实是这样。所以我才觉得不可思议，在想这件事。",
    "こうして見る限り、あんたには隙が見当たりませんから。": "这样看来，你身上完全找不到破绽。",
    "髪型も服の着こなしも、絶妙な印象を受けます。": "发型和服装搭配也都给人一种恰到好处的印象。",
    "褒められてるの？　責められてるの？": "你这是在夸我？还是在责备我？",
    "それに、いい匂いがします……。これは、お花？": "而且，还有很好闻的味道……这是花香吗？",
    "これは夜にしか咲かないお花の精油よ。あなたにもつけてあげるねー。": "这是只在夜里开放的花做成的精油。我也给你抹一点吧。",
    "……うふふ。嬉しい。ヒルダと同じ匂いがします。": "……呵呵，好开心。和希尔妲是一样的味道。",
    "少し、大人になった気がします。ありがとう、ヒルダ。": "感觉自己稍微变成熟了一点。谢谢你，希尔妲。",
    "でも……あの笑顔、可愛いじゃないの……。": "不过……那个笑容，不是很可爱嘛……",
    "……おい、何をしている。": "……喂，你在做什么？",
    "おわっ！？　……って。何だ、ローレンツか。": "哇！？……什么啊，是洛廉兹啊。",
    "僕で悪かったな。相変わらず大修道院の中をブラブラしているのか、クロード。": "是我还真不好意思啊。你还是老样子，在大修道院里闲逛吗，库罗德？",
    "俺はこの、ガルグ＝マク大修道院が大好きなんだ。": "我可是很喜欢这座加尔古·玛库大修道院的。",
    "違うな。先ほどの驚きようは、何かやましいことをしていたに相違あるまい。": "不对。你刚才那副惊慌样，肯定是在做什么亏心事。",
    "おいおいおい、ローレンツくん。人聞きの悪いことを言わないでくれたまえ。": "喂喂喂，洛廉兹同学。别说这种难听的话嘛。",
    "この大修道院は千年の歴史が詰まっている。": "这座大修道院里可是凝聚了千年的历史。",
    "そこの柱も、壁も床も、すべてが千年もの間、そこにあるわけだ。": "那边的柱子、墙壁和地板，全都在那里存在了整整千年。",
    "そう思うと心ときめくだろう？": "这么一想，不觉得心潮澎湃吗？",
    "くすんだ壁を眺めて何が面白いのかね？": "盯着灰扑扑的墙看，到底有什么有趣的？",
    "そもそも……君はどうも胡散臭いのだよ。": "说到底……你这个人就是可疑得很。",
    "いつか君の尻尾を掴み、盟主の資格などないことを証明してやる。": "总有一天我会抓住你的狐狸尾巴，证明你根本没有当盟主的资格。",
    "ったく……面倒臭い奴だなあ……。": "真是的……麻烦的家伙啊……",
}

LINE_RE = re.compile(r'^- ([^:\n]+): "(.+)"$', re.M)


def fmt_time(seconds: float) -> str:
    millis = int(round((seconds - int(seconds)) * 1000))
    whole = int(seconds)
    h = whole // 3600
    m = (whole % 3600) // 60
    s = whole % 60
    return f"{h:02}:{m:02}:{s:02},{millis:03}"


def parse_dialogue(prompt: str) -> list[tuple[str, str]]:
    return LINE_RE.findall(prompt)


def shot_title(shot: Path) -> str:
    return shot.name


def write_shot_sidecar(shot: Path, episode_offset: int) -> list[dict]:
    prompt = (shot / "prompt.md").read_text(encoding="utf-8")
    lines = parse_dialogue(prompt)
    if not lines:
        raise RuntimeError(f"{shot}: no dialogue lines found")
    duration = 15.0
    segment = duration / len(lines)
    entries = []
    md = [
        f"# Chinese Subtitle Text - {shot.name}",
        "",
        "Usage: external Chinese subtitle/reference text only. Do not paste this into Seedance video prompts, and do not burn subtitles into the generated video.",
        "",
        "| Time In | Time Out | Speaker | Japanese Source Line | Chinese Subtitle Text |",
        "| --- | --- | --- | --- | --- |",
    ]
    for index, (speaker, japanese) in enumerate(lines):
        chinese = TRANSLATIONS.get(japanese)
        if chinese is None:
            raise RuntimeError(f"missing translation for {shot.name}: {japanese}")
        start = episode_offset + index * segment
        end = episode_offset + (index + 1) * segment
        entry = {
            "index": index + 1,
            "start": start,
            "end": end,
            "speaker": SPEAKERS.get(speaker, speaker),
            "speaker_en": speaker,
            "japanese": japanese,
            "chinese": chinese,
        }
        entries.append(entry)
        md.append(
            f"| {fmt_time(start)} | {fmt_time(end)} | {entry['speaker']} | {japanese} | {chinese} |"
        )
    md.append("")
    (shot / "zh_subtitle_text.md").write_text("\n".join(md), encoding="utf-8")
    return entries


def write_episode(ep_slug: str, pair: str) -> dict:
    package = SERIES / ep_slug / PACKAGE_NAME
    shots = sorted((package / "shots").iterdir())
    srt_blocks: list[str] = []
    md = [
        f"# Chinese Subtitle Sidecar - {pair}",
        "",
        "Usage: external Chinese subtitle/reference text only. The Seedance prompt contract remains no subtitles, no captions, no visible text.",
        "",
    ]
    srt_index = 1
    shot_count = 0
    line_count = 0
    for shot_index, shot in enumerate(shots):
        if not shot.is_dir():
            continue
        shot_count += 1
        entries = write_shot_sidecar(shot, shot_index * 15)
        md.extend([f"## {shot_title(shot)}", "", "| Time In | Time Out | Speaker | Chinese Subtitle Text |", "| --- | --- | --- | --- |"])
        for entry in entries:
            line_count += 1
            srt_blocks.append(
                "\n".join(
                    [
                        str(srt_index),
                        f"{fmt_time(entry['start'])} --> {fmt_time(entry['end'])}",
                        f"{entry['speaker']}：{entry['chinese']}",
                    ]
                )
            )
            srt_index += 1
            md.append(
                f"| {fmt_time(entry['start'])} | {fmt_time(entry['end'])} | {entry['speaker']} | {entry['chinese']} |"
            )
        md.append("")
    (package / "zh_subtitles.srt").write_text("\n\n".join(srt_blocks) + "\n", encoding="utf-8")
    (package / "zh_subtitles.md").write_text("\n".join(md), encoding="utf-8")
    return {
        "episode": ep_slug,
        "pair": pair,
        "shot_count": shot_count,
        "line_count": line_count,
        "srt": (package / "zh_subtitles.srt").relative_to(ROOT).as_posix(),
        "markdown": (package / "zh_subtitles.md").relative_to(ROOT).as_posix(),
    }


def main() -> int:
    results = [write_episode(*episode) for episode in EPISODES]
    index = [
        "# Golden Deer Support Comedy - Chinese Subtitle Sidecars",
        "",
        "These are external Chinese subtitle/reference files for editing and review only. They are not Seedance prompt text and must not be burned into generated video frames.",
        "",
        "| Episode | Pair | Lines | Markdown | SRT |",
        "| --- | --- | ---: | --- | --- |",
    ]
    for result in results:
        index.append(
            f"| {result['episode']} | {result['pair']} | {result['line_count']} | {result['markdown']} | {result['srt']} |"
        )
    index.append("")
    (SERIES / "zh_subtitle_index.md").write_text("\n".join(index), encoding="utf-8")
    print(f"built Chinese subtitle sidecars for {len(results)} episodes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

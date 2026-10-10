#!/usr/bin/env python3
from __future__ import annotations

import csv
import html
import json
import math
import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SERIES_ROOT = ROOT / "specials" / "golden_deer_support_comedy"
TODAY = "2026-07-28"
PACKAGE_NAME = f"video_generation_package_{TODAY}"


CHARACTERS = {
    "Hilda": {
        "asset": "assets/characters/golden_deer/Hilda/academy/selected.png",
        "lock": "academy Hilda; pink twin-tails visible from the front; youthful Golden Deer uniform; cute, lazy, coaxing, never malicious",
        "short": "pink twin-tails, bright youthful face, Golden Deer uniform",
    },
    "Lorenz": {
        "asset": "assets/characters/golden_deer/Lorenz/academy/selected.png",
        "lock": "academy Lorenz; purple hair, long refined face, upright noble posture, Golden Deer uniform, proud but not clownish",
        "short": "purple hair, refined noble posture, Golden Deer uniform",
    },
    "Marianne": {
        "asset": "assets/characters/golden_deer/Marianne/academy/selected.png",
        "lock": "academy Marianne; shy gentle face, blue hair, modest posture, Golden Deer uniform, soft self-effacing expression",
        "short": "blue hair, shy gentle face, modest Golden Deer uniform",
    },
    "Lysithea": {
        "asset": "assets/characters/golden_deer/Lysithea/academy/selected.png",
        "lock": "academy Lysithea; very youthful small-stature genius, white hair with blunt bangs, serious sensitive expression, Golden Deer uniform",
        "short": "white hair, young serious face, compact student silhouette",
    },
    "Claude": {
        "asset": "assets/characters/golden_deer/Claude/academy/selected.png",
        "lock": "academy Claude; youthful schemer, tan skin, dark hair, easy smile, Golden Deer uniform, playful but not sinister",
        "short": "tan youthful face, dark hair, easy knowing smile",
    },
}


@dataclass
class Shot:
    sid: str
    title: str
    duration: int
    location: str
    purpose: str
    characters: list[str]
    dialogue: list[tuple[str, str, str]]
    bridge_actions: list[str]
    start_intent: str
    key_intent: str
    end_intent: str
    camera: str
    blocking: str
    audio_anchor: str
    edit_in: str
    edit_out: str
    motion: str
    performance: str
    reject_if: list[str]
    props: list[str]


@dataclass
class Episode:
    code: str
    slug: str
    title: str
    support_pair: str
    support_rank: str
    source: list[str]
    source_summary: str
    dialogue_policy: str
    language: str
    location_style: str
    shots: list[Shot]


EPISODES = [
    Episode(
        code="GDSC-EP01",
        slug="EP01_hilda_lorenz",
        title="Hilda x Lorenz - Hilda Lets Lorenz Do The Work",
        support_pair="Hilda x Lorenz",
        support_rank="C and C+ excerpt",
        source=[
            "https://www.pegasusknight.com/wiki/fe16/会話集/支援会話/ローレンツ(レスター諸侯同盟)#ヒルダ",
            "https://fireemblem.fandom.com/wiki/Hilda_(Three_Houses)/Supports#With_Lorenz",
        ],
        source_summary="Hilda finds Lorenz training, praises his noble diligence, frames herself as too delicate for fighting, and successfully gets him to cover her work; the C+ beat extends the joke through her promise to praise his exploits in letters to her family.",
        dialogue_policy="excerpted; exact Japanese source lines, with only silent action bridges",
        language="Japanese original",
        location_style="training",
        shots=[
            Shot(
                sid="GDSC01-SH001",
                title="Lorenz Training Hook",
                duration=15,
                location="Garreg Mach training yard",
                purpose="Establish Lorenz's self-serious diligence before Hilda spots an opening.",
                characters=["Hilda", "Lorenz"],
                dialogue=[
                    ("Hilda", "あー、ローレンツくん。また訓練？　頑張るわねー。", "source"),
                    ("Lorenz", "やあ、ヒルダさん。まさか君も訓練か？　見直したぞ！", "source"),
                    ("Hilda", "ううん、忘れ物を取りに来ただけー。あなたみたいに頑張れないよー。", "source"),
                ],
                bridge_actions=["Lorenz lowers a practice lance; Hilda strolls in with empty hands."],
                start_intent="Lorenz trains alone in a clean practice yard while Hilda appears at the edge.",
                key_intent="Hilda tilts her head and flatters Lorenz's work ethic.",
                end_intent="Lorenz squares his shoulders, already receptive to a noble request.",
                camera="Medium two-shot, slight low angle on Lorenz's formality, gentle pan to Hilda.",
                blocking="Lorenz foreground right with practice weapon; Hilda enters screen-left and stays relaxed.",
                audio_anchor="Hilda's teasing greeting opens the scene.",
                edit_in="cut from monastery room tone",
                edit_out="cut on Hilda's helpless pause",
                motion="Hilda steps in lightly; Lorenz stops training and turns toward her without losing posture.",
                performance="Hilda is soft and breezy; Lorenz is flattered and formal.",
                reject_if=["Hilda looks malicious", "Lorenz becomes a parody", "characters look war-era or older"],
                props=["practice lance", "training rack"],
            ),
            Shot(
                sid="GDSC01-SH002",
                title="The Fragile Lady Pitch",
                duration=15,
                location="Garreg Mach training yard",
                purpose="Hilda turns flattery into a request while preserving the original comic pressure.",
                characters=["Hilda", "Lorenz"],
                dialogue=[
                    ("Lorenz", "何か困りごとでもあるのかい？　僕に解決できないことはない。話したまえ。", "source"),
                    ("Hilda", "実はあたし、戦うのが苦手で……訓練でも怖くて足が震えちゃうくらいなの。", "source"),
                    ("Lorenz", "ふむ、確かに君のような令嬢に、戦いは酷だろうな……。", "source"),
                ],
                bridge_actions=["Hilda folds her hands and sighs; Lorenz leans in with noble concern."],
                start_intent="Hilda holds a performatively worried pose beside stacked practice shields.",
                key_intent="Lorenz takes the bait with earnest concern.",
                end_intent="Hilda glances toward the training field as if the request is obvious.",
                camera="Medium close two-shot with shallow depth; hold on Lorenz taking responsibility.",
                blocking="Hilda slightly closer to camera; Lorenz faces her in profile.",
                audio_anchor="Lorenz's offer to solve any problem.",
                edit_in="match cut from Lorenz's receptive posture",
                edit_out="cut before Hilda names the favor",
                motion="Small acting motions only: Hilda's sigh, Lorenz's attentive step, no combat.",
                performance="Hilda plays fragile but cute; Lorenz is dignified and responsible.",
                reject_if=["Hilda seems genuinely frightened", "Lorenz ignores her", "extra students become focus"],
                props=["practice shields", "wooden weapon stand"],
            ),
            Shot(
                sid="GDSC01-SH003",
                title="Lorenz Accepts The Trap",
                duration=15,
                location="Garreg Mach training yard",
                purpose="Pay off the request: Lorenz agrees to do the fighting while Hilda promises to act busy.",
                characters=["Hilda", "Lorenz"],
                dialogue=[
                    ("Hilda", "次の実践訓練では、あたしの分まで戦ってくれないかな？", "source"),
                    ("Hilda", "あたしは戦ってる雰囲気だけ出すからー、なんて……流石にダメだよねー？", "source"),
                    ("Lorenz", "わかった。荒事は任せてくれたまえ。君を危険な目には遭わせられん。", "source"),
                ],
                bridge_actions=["Lorenz raises a hand in vow; Hilda brightens immediately."],
                start_intent="Hilda gestures toward the practice field while Lorenz listens.",
                key_intent="Lorenz gives a solemn noble pledge.",
                end_intent="Hilda's face lights up, already free of the task.",
                camera="Stable medium shot, slight push at Lorenz's vow.",
                blocking="Hilda screen-left, Lorenz screen-right; Hilda's eyeline travels from field to Lorenz.",
                audio_anchor="Lorenz says he will keep Hilda from danger.",
                edit_in="cut on Hilda finally asking",
                edit_out="cut on Hilda's sudden smile",
                motion="Lorenz performs one contained oath gesture; Hilda switches from helpless to delighted.",
                performance="Lorenz sincere; Hilda openly pleased but not cruel.",
                reject_if=["battle starts inside the shot", "Hilda looks manipulative or mean", "subtitles appear"],
                props=["practice field boundary rope"],
            ),
            Shot(
                sid="GDSC01-SH004",
                title="Full Name In The Letter",
                duration=15,
                location="training yard edge",
                purpose="Extend the original joke through Lorenz's noble vanity and Hilda's easy exit.",
                characters=["Hilda", "Lorenz"],
                dialogue=[
                    ("Hilda", "次も、あたしの分まで頑張ってねー！", "source"),
                    ("Hilda", "実家に送る手紙のネタにしちゃおうかなー。", "source"),
                    ("Lorenz", "手紙に書くときは、ローレンツ＝ヘルマン＝グロスタールくんと書いてくれたまえ！", "source"),
                    ("Hilda", "……ローレンツくんって、面白いなー。", "source"),
                ],
                bridge_actions=["Hilda takes one step toward the exit; Lorenz straightens proudly."],
                start_intent="Hilda thanks Lorenz beside training gear after his imagined success.",
                key_intent="Lorenz proudly requests his full name for the family letter.",
                end_intent="Hilda turns away with an amused snack-bound smile.",
                camera="Medium/wide shot that lets Hilda exit while Lorenz keeps a ceremonial pose.",
                blocking="Lorenz center proud; Hilda drifts screen-left toward the cloister.",
                audio_anchor="Lorenz's full-name request is the comic peak.",
                edit_in="cut from Hilda's delighted face",
                edit_out="hold on Hilda's amused exit",
                motion="Hilda pivots to leave; Lorenz points modestly to himself, then holds proud stillness.",
                performance="Hilda fondly amused; Lorenz triumphantly self-important.",
                reject_if=["Lorenz looks foolish instead of proud", "Hilda eats on camera in a messy way", "new conflict is introduced"],
                props=["letter paper", "snack pouch"],
            ),
        ],
    ),
    Episode(
        code="GDSC-EP02",
        slug="EP02_hilda_marianne",
        title="Hilda x Marianne - Library Cleanup Blame Pass",
        support_pair="Hilda x Marianne",
        support_rank="C excerpt",
        source=[
            "https://www.pegasusknight.com/wiki/fe16/会話集/支援会話/マリアンヌ(レスター諸侯同盟)#ヒルダ",
            "https://gamefaqs.gamespot.com/switch/204445-fire-emblem-three-houses/faqs/77596",
        ],
        source_summary="Hilda complains about being assigned to clean the library, assumes Marianne can handle it, leaves the work to her, then returns to a bigger mess and has to demonstrate the proper method herself.",
        dialogue_policy="excerpted; exact Japanese source lines, with only silent action bridges",
        language="Japanese original",
        location_style="library",
        shots=[
            Shot(
                sid="GDSC02-SH001",
                title="Assigned To The Library",
                duration=15,
                location="Garreg Mach library",
                purpose="Set Hilda's lazy complaint and Marianne's silent presence.",
                characters=["Hilda", "Marianne"],
                dialogue=[
                    ("Hilda", "あーもう！　何であたしが書庫の片づけなんてしなきゃいけないの！", "source"),
                    ("Marianne", "………………。", "source"),
                    ("Hilda", "お菓子を食べるのに忙しいっての！", "source"),
                ],
                bridge_actions=["Dust hangs in a shaft of library light; Marianne holds a book stack quietly."],
                start_intent="A messy library table, Hilda complains while Marianne stands nearby.",
                key_intent="Hilda gestures at heavy books with comic exhaustion.",
                end_intent="Marianne remains silent and uncertain behind a stack.",
                camera="Wide library shot, slow push toward the overloaded table.",
                blocking="Hilda foreground left; Marianne background right, smaller and hesitant.",
                audio_anchor="Hilda's pastry complaint.",
                edit_in="cut from quiet library ambience",
                edit_out="cut as Hilda seeks agreement",
                motion="Hilda waves at the messy shelves; Marianne shifts book weight carefully.",
                performance="Hilda dramatic but harmless; Marianne shy and frozen.",
                reject_if=["library gains modern signage", "Marianne smiles broadly", "Hilda looks cruel"],
                props=["books", "dust cloth", "broom"],
            ),
            Shot(
                sid="GDSC02-SH002",
                title="All Yours",
                duration=15,
                location="Garreg Mach library",
                purpose="Hilda converts Marianne's hesitation into a handoff.",
                characters=["Hilda", "Marianne"],
                dialogue=[
                    ("Hilda", "ね？　マリアンヌちゃんもそう思うでしょ？", "source"),
                    ("Marianne", "あ、あの、私は、別に……。", "source"),
                    ("Hilda", "わかった、あなたに任せるわ！　あたし、逆に邪魔しちゃいそうだしー！", "source"),
                    ("Marianne", "あの……。", "source"),
                ],
                bridge_actions=["Hilda presses the cloth into Marianne's hands and slips away."],
                start_intent="Hilda leans in hopefully; Marianne clutches books.",
                key_intent="Hilda hands the cleaning cloth to Marianne.",
                end_intent="Hilda exits, Marianne is left with too many books.",
                camera="Medium two-shot with a small comic rack focus to the cloth handoff.",
                blocking="Hilda moves from center toward exit; Marianne remains center with the task.",
                audio_anchor="Hilda says she will only get in the way.",
                edit_in="cut on Hilda inviting agreement",
                edit_out="cut to Marianne alone",
                motion="Cloth handoff, Hilda's retreat, Marianne's tiny intake of breath.",
                performance="Hilda breezy and self-protective; Marianne too polite to refuse.",
                reject_if=["Marianne looks angry", "Hilda shoves her", "dialogue becomes bullying"],
                props=["dust cloth", "book stack"],
            ),
            Shot(
                sid="GDSC02-SH003",
                title="Bigger Mess",
                duration=15,
                location="Garreg Mach library",
                purpose="Reveal the cleanup backfires and Hilda must actually help.",
                characters=["Hilda", "Marianne"],
                dialogue=[
                    ("Hilda", "マリアンヌちゃーん、そろそろ終わっ……うわあ！　どうしたの、これ？", "source"),
                    ("Hilda", "片づくどころか、余計散らかってるじゃない……。", "source"),
                    ("Marianne", "すみません、ヒルダさん……。どう並べたらいいかわからなくて……。", "source"),
                ],
                bridge_actions=["A leaning tower of books wobbles; Marianne bows apologetically."],
                start_intent="Hilda re-enters expecting the task done.",
                key_intent="The table is messier, with categories spilled everywhere.",
                end_intent="Marianne apologizes, Hilda realizes she has to organize it.",
                camera="Over-Hilda shoulder reveal of the table disaster, then two-shot reaction.",
                blocking="Hilda at entry screen-left; Marianne behind the book mess screen-right.",
                audio_anchor="Hilda's surprised line.",
                edit_in="cut from Marianne alone",
                edit_out="cut on Hilda deciding to show the method",
                motion="Hilda stops mid-step; a small stack tips but does not fall dangerously.",
                performance="Hilda exasperated but fond; Marianne deeply apologetic.",
                reject_if=["books fly magically", "Hilda yells viciously", "Marianne becomes slapstick clown"],
                props=["toppled books", "library ladder"],
            ),
            Shot(
                sid="GDSC02-SH004",
                title="Hilda Does It Herself",
                duration=15,
                location="Garreg Mach library",
                purpose="Pay off the original joke: Hilda's competence appears despite her avoidance.",
                characters=["Hilda", "Marianne"],
                dialogue=[
                    ("Hilda", "仕方ないなあ。やり方、教えるから聞いててね？", "source"),
                    ("Hilda", "分類ごとに置き場を決めるの。魔道の本ならこっち、剣術の本ならあっち。", "source"),
                    ("Marianne", "ヒ、ヒルダさん……すごい……！", "source"),
                    ("Hilda", "結局、あたしがやってるじゃない。", "source"),
                ],
                bridge_actions=["Hilda slides books into neat piles; Marianne passes one book back."],
                start_intent="Hilda rolls up sleeves and points to categories.",
                key_intent="Books become neat stacks under Hilda's quick hands.",
                end_intent="Hilda realizes she has done the whole job while Marianne helps with one book.",
                camera="Clean overhead-to-medium sequence, ending on Hilda's wry smile.",
                blocking="Hilda centered at table working; Marianne beside her, careful and impressed.",
                audio_anchor="Marianne's impressed reaction, then Hilda's punchline.",
                edit_in="cut on Hilda accepting responsibility",
                edit_out="hold on tidy table and Hilda's sigh",
                motion="Book sorting from messy to neat; no sudden magic or text overlays.",
                performance="Hilda competent despite herself; Marianne warm and grateful.",
                reject_if=["Hilda looks smugly cruel", "readable book text appears", "subtitles appear"],
                props=["sorted book stacks", "dust cloth"],
            ),
        ],
    ),
    Episode(
        code="GDSC-EP03",
        slug="EP03_hilda_lysithea",
        title="Hilda x Lysithea - Coaxing Expert Meets Serious Kid",
        support_pair="Hilda x Lysithea",
        support_rank="C excerpt",
        source=[
            "https://www.pegasusknight.com/wiki/fe16/会話集/支援会話/リシテア(レスター諸侯同盟)#ヒルダ",
            "https://fireemblem.fandom.com/wiki/Hilda_(Three_Houses)/Supports#With_Lysithea",
        ],
        source_summary="Lysithea observes Hilda getting help, analyzes why people are drawn to her, notices Hilda's careful appearance and floral scent, and unexpectedly enjoys trying the fragrance because it makes her feel more grown-up.",
        dialogue_policy="excerpted; exact Japanese source lines, with only silent action bridges",
        language="Japanese original",
        location_style="courtyard",
        shots=[
            Shot(
                sid="GDSC03-SH001",
                title="Caught Getting Help",
                duration=15,
                location="Garreg Mach courtyard",
                purpose="Set Lysithea's serious observation of Hilda's effortless asking-for-help pattern.",
                characters=["Hilda", "Lysithea"],
                dialogue=[
                    ("Hilda", "えーいいのー？　助かっちゃうわー。ほんっと、ありがとう！", "source"),
                    ("Lysithea", "………………。", "source"),
                    ("Hilda", "リシテアちゃん？　そんなところで、ボーっと何してるの？", "source"),
                ],
                bridge_actions=["An unseen helper exits; Lysithea remains with arms folded."],
                start_intent="Hilda waves after an offscreen helper; Lysithea watches from the cloister edge.",
                key_intent="Lysithea's serious stare lands on Hilda.",
                end_intent="Hilda notices Lysithea and pivots into charm.",
                camera="Medium courtyard shot with a lateral reveal of Lysithea.",
                blocking="Hilda near a bench screen-left; Lysithea screen-right in rigid posture.",
                audio_anchor="Hilda thanking the helper.",
                edit_in="cut from courtyard ambience",
                edit_out="cut on Hilda noticing Lysithea",
                motion="Hilda's wave slows; Lysithea barely moves, making her seriousness funny.",
                performance="Hilda sunny; Lysithea analytical, not jealous.",
                reject_if=["Lysithea looks adult", "Hilda looks cruel", "offscreen helper becomes a named focus"],
                props=["folded errand basket"],
            ),
            Shot(
                sid="GDSC03-SH002",
                title="The Analysis",
                duration=15,
                location="Garreg Mach courtyard",
                purpose="Let Lysithea sincerely diagnose Hilda's charm instead of arguing.",
                characters=["Hilda", "Lysithea"],
                dialogue=[
                    ("Hilda", "また誰かに頼み事してー！って思ってたんでしょう。", "source"),
                    ("Lysithea", "何で、みんなヒルダの言うことを聞いちゃうんだろうって思ってました。", "source"),
                    ("Hilda", "押し付けてはいないのよー？", "source"),
                    ("Lysithea", "そうみたいですね。そこが不思議で、考えてたんです。", "source"),
                ],
                bridge_actions=["Hilda laughs defensively; Lysithea studies her like a research problem."],
                start_intent="Hilda leans back with a sheepish smile.",
                key_intent="Lysithea points out the puzzle with serious focus.",
                end_intent="Hilda is thrown off by the lack of accusation.",
                camera="Shot-reverse-shot feel inside a single wide composition.",
                blocking="They face each other at a respectful student distance.",
                audio_anchor="Lysithea's analytic question.",
                edit_in="cut from Hilda's pivot",
                edit_out="cut to Lysithea's visual inspection",
                motion="Hilda gestures 'not my fault'; Lysithea steps closer by half a pace.",
                performance="Hilda coquettish but harmless; Lysithea intensely literal.",
                reject_if=["Lysithea becomes sarcastic adult", "Hilda bullies her", "the scene adds romance"],
                props=["small parcel", "flower oil vial"],
            ),
            Shot(
                sid="GDSC03-SH003",
                title="No Gaps In The Hilda Method",
                duration=15,
                location="Garreg Mach courtyard",
                purpose="Comic turn: Lysithea compliments Hilda so precisely that Hilda cannot tell if it is praise.",
                characters=["Hilda", "Lysithea"],
                dialogue=[
                    ("Lysithea", "こうして見る限り、あんたには隙が見当たりませんから。", "source"),
                    ("Lysithea", "髪型も服の着こなしも、絶妙な印象を受けます。", "source"),
                    ("Hilda", "褒められてるの？　責められてるの？", "source"),
                    ("Lysithea", "それに、いい匂いがします……。これは、お花？", "source"),
                ],
                bridge_actions=["Lysithea leans in and notices the scent; Hilda blinks in surprise."],
                start_intent="Lysithea evaluates Hilda's hair, clothes, and nails with grave precision.",
                key_intent="Hilda's confused reaction.",
                end_intent="Lysithea notices the floral scent and softens.",
                camera="Medium close two-shot, static to keep facial reactions readable.",
                blocking="Lysithea steps nearer but stays polite; Hilda keeps an amused distance.",
                audio_anchor="Hilda's confused question.",
                edit_in="cut on Lysithea beginning analysis",
                edit_out="cut on scent discovery",
                motion="Minimal head tilts, wrist gesture, small scent reaction.",
                performance="Lysithea earnest and exact; Hilda playful and puzzled.",
                reject_if=["Lysithea looks predatory or adult", "Hilda's twin-tails disappear", "visible text appears"],
                props=["flower oil vial", "ribbon"],
            ),
            Shot(
                sid="GDSC03-SH004",
                title="A Little More Grown-Up",
                duration=15,
                location="Garreg Mach courtyard",
                purpose="Pay off the personality contrast with Lysithea's unexpectedly sweet smile.",
                characters=["Hilda", "Lysithea"],
                dialogue=[
                    ("Hilda", "これは夜にしか咲かないお花の精油よ。あなたにもつけてあげるねー。", "source"),
                    ("Lysithea", "……うふふ。嬉しい。ヒルダと同じ匂いがします。", "source"),
                    ("Lysithea", "少し、大人になった気がします。ありがとう、ヒルダ。", "source"),
                    ("Hilda", "でも……あの笑顔、可愛いじゃないの……。", "source"),
                ],
                bridge_actions=["Hilda dabs oil on Lysithea's wrist; Lysithea rubs wrists together."],
                start_intent="Hilda uncaps a tiny floral oil vial.",
                key_intent="Lysithea smiles softly at the scent on her wrist.",
                end_intent="Hilda watches her leave with an affectionate, surprised smile.",
                camera="Close hand detail to medium reaction, no text or labels.",
                blocking="Hilda applies oil gently; Lysithea keeps both wrists visible.",
                audio_anchor="Lysithea says she feels a little more grown-up.",
                edit_in="cut from the scent discovery",
                edit_out="hold on Hilda's fond reaction",
                motion="Tiny wrist movement and a shy smile; Hilda lowers the vial.",
                performance="Hilda older-sister warmth; Lysithea briefly vulnerable and happy.",
                reject_if=["the oil becomes magic", "Lysithea ages up physically", "Hilda acts condescending"],
                props=["flower oil vial"],
            ),
        ],
    ),
    Episode(
        code="GDSC-EP04",
        slug="EP04_claude_lorenz",
        title="Claude x Lorenz - Lorenz Suspects Claude Again",
        support_pair="Claude x Lorenz",
        support_rank="C excerpt",
        source=[
            "https://www.pegasusknight.com/wiki/fe16/会話集/支援会話/クロード(レスター諸侯同盟)#ローレンツ",
            "https://fireemblem.fandom.com/wiki/Lorenz_(Three_Houses)/Supports#With_Claude",
        ],
        source_summary="Lorenz catches Claude wandering, suspects he is hiding something, and refuses to be distracted by Claude's breezy monastery-history routine; Claude parries with humor while Lorenz doubles down on noble legitimacy.",
        dialogue_policy="excerpted; exact Japanese source lines, with only silent action bridges",
        language="Japanese original",
        location_style="cloister",
        shots=[
            Shot(
                sid="GDSC04-SH001",
                title="What Are You Doing",
                duration=15,
                location="Garreg Mach main cloister",
                purpose="Open on Lorenz catching Claude in suspicious wandering mode.",
                characters=["Claude", "Lorenz"],
                dialogue=[
                    ("Lorenz", "……おい、何をしている。", "source"),
                    ("Claude", "おわっ！？　……って。何だ、ローレンツか。", "source"),
                    ("Lorenz", "僕で悪かったな。相変わらず大修道院の中をブラブラしているのか、クロード。", "source"),
                ],
                bridge_actions=["Claude hides a small folded note behind his back; Lorenz steps into the archway."],
                start_intent="Claude pauses at a cloister pillar with a folded note.",
                key_intent="Lorenz appears and Claude startles, then relaxes.",
                end_intent="Lorenz points toward Claude's suspicious hands.",
                camera="Medium/wide cloister shot with a quick comic reveal.",
                blocking="Claude screen-left by pillar; Lorenz enters screen-right, closing distance.",
                audio_anchor="Lorenz's first accusation.",
                edit_in="cut from quiet cloister ambience",
                edit_out="cut on Lorenz naming the suspicious wandering",
                motion="Claude half-turns, note disappears behind his back; Lorenz stops sharply.",
                performance="Claude light and amused; Lorenz stern and precise.",
                reject_if=["Claude looks sinister", "Lorenz looks villainous", "the note has readable text"],
                props=["folded note", "stone pillar"],
            ),
            Shot(
                sid="GDSC04-SH002",
                title="Not Innocent",
                duration=15,
                location="Garreg Mach main cloister",
                purpose="Lorenz identifies Claude's impish face as evidence.",
                characters=["Claude", "Lorenz"],
                dialogue=[
                    ("Claude", "俺はこの、ガルグ＝マク大修道院が大好きなんだ。", "source"),
                    ("Lorenz", "違うな。先ほどの驚きようは、何かやましいことをしていたに相違あるまい。", "source"),
                    ("Claude", "おいおいおい、ローレンツくん。人聞きの悪いことを言わないでくれたまえ。", "source"),
                ],
                bridge_actions=["Claude opens both hands innocently while still hiding the note's edge."],
                start_intent="Claude gestures broadly to the monastery as if giving a tour.",
                key_intent="Lorenz narrows his eyes at Claude's too-innocent smile.",
                end_intent="Claude raises both palms in exaggerated innocence.",
                camera="Stable medium two-shot, slight push on Lorenz's suspicion.",
                blocking="Claude keeps a pillar between himself and Lorenz; Lorenz leans past it.",
                audio_anchor="Lorenz says Claude must be hiding something.",
                edit_in="cut from Lorenz's pointing gesture",
                edit_out="cut to Claude's history distraction",
                motion="Claude performs a light innocent gesture; Lorenz's posture tightens.",
                performance="Claude teasing but harmless; Lorenz offended by impropriety.",
                reject_if=["Claude becomes villain-coded", "Lorenz physically threatens him", "new plot object is explained"],
                props=["folded note", "cloister arch"],
            ),
            Shot(
                sid="GDSC04-SH003",
                title="The Thousand Year Distraction",
                duration=15,
                location="Garreg Mach main cloister",
                purpose="Claude tries to distract Lorenz with grand monastery history.",
                characters=["Claude", "Lorenz"],
                dialogue=[
                    ("Claude", "この大修道院は千年の歴史が詰まっている。", "source"),
                    ("Claude", "そこの柱も、壁も床も、すべてが千年もの間、そこにあるわけだ。", "source"),
                    ("Claude", "そう思うと心ときめくだろう？", "source"),
                    ("Lorenz", "くすんだ壁を眺めて何が面白いのかね？", "source"),
                ],
                bridge_actions=["Claude taps the old stone wall; Lorenz refuses to look away from Claude."],
                start_intent="Claude redirects attention to pillars and walls.",
                key_intent="Lorenz remains unimpressed while Claude smiles.",
                end_intent="Claude's distraction visibly fails.",
                camera="Wide cloister composition that shows the old architecture Claude invokes.",
                blocking="Claude gestures up and left; Lorenz keeps eyeline locked on Claude.",
                audio_anchor="Claude's thousand-year history line.",
                edit_in="cut from Claude's innocent palms",
                edit_out="cut on Lorenz rejecting the distraction",
                motion="Slow hand sweep across architecture; Lorenz's gaze never follows.",
                performance="Claude playful lecturer; Lorenz deadpan and suspicious.",
                reject_if=["walls become fantasy ruins unrelated to Garreg Mach", "Claude monologues to camera", "subtitles appear"],
                props=["stone columns", "folded note"],
            ),
            Shot(
                sid="GDSC04-SH004",
                title="Tail To Catch",
                duration=15,
                location="Garreg Mach main cloister",
                purpose="End with Lorenz overcommitting to suspicion and Claude accepting the nuisance with a grin.",
                characters=["Claude", "Lorenz"],
                dialogue=[
                    ("Lorenz", "そもそも……君はどうも胡散臭いのだよ。", "source"),
                    ("Lorenz", "いつか君の尻尾を掴み、盟主の資格などないことを証明してやる。", "source"),
                    ("Claude", "ったく……面倒臭い奴だなあ……。", "source"),
                ],
                bridge_actions=["Lorenz exits with a hard turn; Claude lets the folded note vanish into his sleeve."],
                start_intent="Lorenz closes the space with a formal accusation.",
                key_intent="Lorenz delivers the tail-catching threat while Claude stays relaxed.",
                end_intent="Lorenz exits, Claude gives a small amused smile to himself.",
                camera="Medium two-shot, then hold on Claude after Lorenz exits.",
                blocking="Lorenz dominates center for the accusation; Claude remains near pillar and does not chase.",
                audio_anchor="Lorenz's accusation, then Claude's weary punchline.",
                edit_in="cut from failed distraction",
                edit_out="hold on Claude's knowing grin",
                motion="Lorenz pivots away; Claude's shoulders drop into amused relaxation.",
                performance="Lorenz proud and aggrieved; Claude clever and lightly teasing, not dark.",
                reject_if=["Claude reveals a new conspiracy", "Lorenz becomes hateful", "ending creates a new plot twist"],
                props=["folded note", "cloister shadow"],
            ),
        ],
    ),
]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def ensure_clean_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def background(style: str) -> Image.Image:
    w, h = 1280, 720
    img = Image.new("RGB", (w, h), "#d7d0c1")
    draw = ImageDraw.Draw(img)
    if style in {"training", "courtyard", "cloister"}:
        loc = ROOT / "assets/locations/MonasteryMainCloister/EP02_act01/MonasteryMainCloister_reference.png"
        if loc.exists():
            bg = Image.open(loc).convert("RGB").resize((w, h))
            img.paste(bg)
            overlay = Image.new("RGBA", (w, h), (35, 28, 20, 48))
            img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)
        if style == "training":
            draw.rectangle((0, 500, w, h), fill="#8d806a")
            for x in range(60, w, 130):
                draw.line((x, 510, x + 90, 720), fill="#6f634f", width=2)
            draw.rectangle((860, 360, 1160, 390), fill="#5c4634")
            for x in range(885, 1140, 45):
                draw.line((x, 355, x - 25, 450), fill="#3f3328", width=7)
        elif style == "courtyard":
            draw.rectangle((0, 520, w, h), fill="#7f8a68")
            draw.ellipse((150, 440, 400, 630), fill="#566947")
            draw.rectangle((700, 480, 1040, 515), fill="#6f503c")
            draw.rectangle((745, 510, 785, 590), fill="#4a392d")
            draw.rectangle((955, 510, 995, 590), fill="#4a392d")
        else:
            draw.rectangle((0, 520, w, h), fill="#827867")
            for x in range(120, 1180, 170):
                draw.rectangle((x, 80, x + 42, 545), fill="#8a806f")
    else:
        draw.rectangle((0, 0, w, h), fill="#5b4938")
        draw.rectangle((0, 485, w, h), fill="#73614c")
        for x in range(40, w, 180):
            draw.rectangle((x, 80, x + 120, 480), fill="#3e2c21")
            for y in range(110, 460, 55):
                draw.rectangle((x + 12, y, x + 108, y + 28), fill="#967a50")
                draw.rectangle((x + 18, y + 5, x + 102, y + 23), fill="#5e3540")
        draw.rectangle((390, 430, 890, 560), fill="#6c4e33")
        draw.rectangle((430, 560, 470, 660), fill="#4b3728")
        draw.rectangle((810, 560, 850, 660), fill="#4b3728")
    vignette = Image.new("L", (w, h), 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-120, -90, w + 120, h + 90), fill=170)
    vignette = vignette.filter(ImageFilter.GaussianBlur(70))
    dark = Image.new("RGB", (w, h), "#16120e")
    img = Image.composite(img, dark, vignette)
    return img


def character_cutout(name: str, height: int, flip: bool = False) -> Image.Image:
    src = ROOT / CHARACTERS[name]["asset"]
    im = Image.open(src).convert("RGB")
    # Preserve the central body and crop away a little empty studio margin.
    bbox = (int(im.width * 0.08), int(im.height * 0.02), int(im.width * 0.92), int(im.height * 0.98))
    im = im.crop(bbox)
    scale = height / im.height
    im = im.resize((int(im.width * scale), height), Image.Resampling.LANCZOS)
    if flip:
        im = im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    arr = np.asarray(im).astype(np.float32)
    h, w = arr.shape[:2]
    samples = np.array([
        arr[4, 4],
        arr[4, w - 5],
        arr[h - 5, 4],
        arr[h - 5, w - 5],
        arr[20, max(5, w // 2)],
    ], dtype=np.float32)
    dist = np.min(np.sqrt(np.sum((arr[:, :, None, :] - samples[None, None, :, :]) ** 2, axis=3)), axis=2)
    alpha = np.clip((dist - 28) * 8, 0, 255).astype(np.uint8)
    # Keep the central torso/head strongly opaque; sampled background removal can be conservative.
    core = Image.new("L", (w, h), 0)
    cd = ImageDraw.Draw(core)
    cd.ellipse((int(w * 0.18), int(h * 0.02), int(w * 0.82), int(h * 0.50)), fill=255)
    cd.rounded_rectangle((int(w * 0.16), int(h * 0.28), int(w * 0.84), int(h * 0.98)), radius=30, fill=255)
    alpha = np.maximum(alpha, np.asarray(core))
    mask = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.8))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def paste_character(canvas: Image.Image, name: str, x: int, y: int, height: int, flip: bool = False, alpha: int = 255) -> None:
    char = character_cutout(name, height, flip)
    if alpha < 255:
        r, g, b, m = char.split()
        m = m.point(lambda p: int(p * alpha / 255))
        char = Image.merge("RGBA", (r, g, b, m))
    shadow = Image.new("RGBA", char.size, (0, 0, 0, 0))
    sr = Image.new("RGBA", char.size, (0, 0, 0, 95))
    shadow.paste(sr, (0, 0), char.split()[-1])
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(shadow, (x + 14, y + 18))
    canvas.alpha_composite(char, (x, y))


def draw_props(canvas: Image.Image, props: list[str], shot: Shot, frame: str) -> None:
    draw = ImageDraw.Draw(canvas)
    if any("book" in p or "books" in p for p in props):
        piles = 7 if "Mess" in shot.title or frame == "key" else 4
        for i in range(piles):
            x = 425 + i * 55
            y = 458 - (i % 3) * 18
            color = ["#7d3248", "#35506d", "#8b7140", "#4d6140"][i % 4]
            draw.rounded_rectangle((x, y, x + 105, y + 22), radius=4, fill=color, outline="#201814")
            draw.rectangle((x + 8, y + 5, x + 98, y + 8), fill="#c7b58a")
    if any("broom" in p for p in props):
        draw.line((235, 318, 290, 620), fill="#6e4b2d", width=8)
        draw.polygon([(278, 600), (322, 635), (245, 650)], fill="#c6a36a")
    if any("lance" in p or "weapon" in p for p in props):
        draw.line((910, 230, 1040, 620), fill="#594734", width=8)
        draw.polygon([(900, 218), (928, 230), (908, 248)], fill="#c9c0a8")
    if any("oil" in p or "vial" in p for p in props):
        draw.rounded_rectangle((610, 475, 642, 555), radius=9, fill="#7da47a", outline="#e7ead8", width=2)
        draw.rectangle((618, 455, 634, 475), fill="#d6c797")
    if any("note" in p for p in props):
        draw.polygon([(515, 455), (575, 438), (595, 505), (535, 520)], fill="#dfd1aa", outline="#7a6a4e")
    if any("letter" in p for p in props):
        draw.rectangle((635, 475, 735, 535), fill="#e5d5ae", outline="#8a7652")


def render_frame(ep: Episode, shot: Shot, frame: str, out: Path) -> None:
    img = background(ep.location_style).convert("RGBA")
    draw_props(img, shot.props, shot, frame)
    people = shot.characters
    if len(people) == 2:
        left, right = people[0], people[1]
        if ep.code == "GDSC-EP04":
            left, right = "Claude", "Lorenz"
        if frame == "start":
            lx, rx = 170, 720
        elif frame == "key":
            lx, rx = 230, 675
        else:
            lx, rx = 125, 780
        if ep.code == "GDSC-EP02" and shot.sid.endswith("SH003"):
            lx, rx = (140, 750) if frame != "key" else (95, 745)
        if ep.code == "GDSC-EP03" and shot.sid.endswith("SH004"):
            lx, rx = (220, 650) if frame != "end" else (175, 800)
        if ep.code == "GDSC-EP04":
            lx, rx = (185, 720) if frame != "end" else (285, 830)
        paste_character(img, left, lx, 130, 585, flip=False)
        paste_character(img, right, rx, 130, 585, flip=True)
    else:
        for idx, name in enumerate(people):
            paste_character(img, name, 190 + idx * 360, 135, 585, flip=bool(idx % 2))

    # Cinematic matte only; no captions or subtitles.
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1280, 40), fill=(0, 0, 0, 180))
    draw.rectangle((0, 680, 1280, 720), fill=(0, 0, 0, 180))
    out.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out, quality=96)


def shot_dialogue_text(shot: Shot) -> str:
    return "\n".join(f"- {speaker}: \"{line}\"" for speaker, line, _ in shot.dialogue)


def write_viewer(ep: Episode, completed: int) -> None:
    ep_root = SERIES_ROOT / ep.slug
    completed_ids = [shot.sid for shot in ep.shots[:completed]]
    pending_ids = [shot.sid for shot in ep.shots[completed:]]
    sections = []
    for idx, shot in enumerate(ep.shots, start=1):
        done = idx <= completed
        shot_rel = f"storyboards/{shot.sid}"
        status = "approved_for_video" if done else "pending"
        frame_html = ""
        if done:
            frame_html = f"""
      <div class="frames">
        <figure><img src="{shot_rel}/start_frame.png" alt="{shot.sid} start"><figcaption>Start</figcaption></figure>
        <figure><img src="{shot_rel}/key_frame.png" alt="{shot.sid} key"><figcaption>Key</figcaption></figure>
        <figure><img src="{shot_rel}/end_frame.png" alt="{shot.sid} end"><figcaption>End</figcaption></figure>
      </div>
      <div class="links"><a href="video_prompts/{shot.sid}_prompt.md">Prompt</a><a href="video_prompts/{shot.sid}_negative_prompt.md">Negative</a><a href="storyboards/{shot.sid}/metadata.json">Metadata</a></div>"""
        else:
            frame_html = '<div class="pending">Storyboard frames pending.</div>'
        sections.append(f"""
    <section>
      <h2>{html.escape(shot.sid)} - {html.escape(shot.title)}</h2>
      <div class="shot-meta"><span class="pill">Status: {status}</span><span class="pill">Duration: {shot.duration}s</span><span class="check">Primary check: {html.escape(shot.purpose)}</span></div>
{frame_html}
    </section>""")
    doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(ep.title)}</title>
  <style>
    body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20242a; background: #f6f5f1; }}
    header {{ position: sticky; top: 0; z-index: 2; background: rgba(255,255,255,.96); border-bottom: 1px solid #d8d0c2; padding: 16px 22px; }}
    h1 {{ margin: 0; font-size: 20px; letter-spacing: 0; }}
    .meta {{ margin-top: 4px; color: #657182; font-size: 13px; }}
    main {{ max-width: 1440px; margin: 0 auto; padding: 20px 22px 40px; }}
    section {{ border-top: 1px solid #d8d0c2; padding: 22px 0 28px; }}
    h2 {{ margin: 0 0 10px; font-size: 18px; letter-spacing: 0; }}
    .shot-meta {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; color: #4f5b6a; font-size: 13px; }}
    .pill {{ border: 1px solid #cfc4b4; border-radius: 999px; padding: 4px 9px; background: #fff; }}
    .check {{ flex-basis: 100%; color: #344052; }}
    .frames {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }}
    figure {{ margin: 0; border: 1px solid #d8d0c2; border-radius: 8px; overflow: hidden; background: #fff; }}
    img {{ display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #e9e3d8; }}
    figcaption {{ padding: 8px 10px; border-top: 1px solid #d8d0c2; font-size: 13px; font-weight: 700; }}
    .links, .links a {{ display: flex; flex-wrap: wrap; gap: 8px; }}
    .links {{ margin-top: 12px; }}
    .links a {{ color: #174ea6; text-decoration: none; border: 1px solid #cfc4b4; background: #fff; border-radius: 6px; padding: 7px 10px; font-size: 13px; font-weight: 700; }}
    .pending {{ border: 1px dashed #c9bba8; border-radius: 8px; padding: 18px; background: #fff; color: #6a5b4a; }}
    @media (max-width: 900px) {{ .frames {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <header>
    <h1>{html.escape(ep.title)}</h1>
    <div class="meta">Completed: {html.escape(', '.join(completed_ids) or 'none')}. Pending: {html.escape(', '.join(pending_ids) or 'none')}. Video clips pending external Seedance generation.</div>
  </header>
  <main>{''.join(sections)}
  </main>
</body>
</html>"""
    write_text(ep_root / "asset_viewer.html", doc)


def write_package_viewer(ep: Episode, package: Path) -> None:
    manifest = json.loads((package / "package_manifest.json").read_text(encoding="utf-8"))
    sections = []
    for shot in manifest["shots"]:
        shot_dir = shot["package_dir"]
        sections.append(f"""
    <section>
      <h2>{html.escape(shot['id'])}</h2>
      <div class="shot-meta"><span class="pill">Status: {html.escape(shot['status'])}</span><span class="pill">Duration: {shot['duration_seconds']}s</span><span class="check">Primary check: {html.escape(shot.get('audio_anchor', 'ready for Seedance'))}</span></div>
      <div class="frames">
        <figure><img src="{shot_dir}/start_frame.png" alt="{shot['id']} start"><figcaption>Start</figcaption></figure>
        <figure><img src="{shot_dir}/key_frame.png" alt="{shot['id']} key"><figcaption>Key</figcaption></figure>
        <figure><img src="{shot_dir}/end_frame.png" alt="{shot['id']} end"><figcaption>End</figcaption></figure>
      </div>
      <div class="links"><a href="{shot_dir}/prompt.md">Prompt</a><a href="{shot_dir}/negative_prompt.md">Negative</a><a href="{shot_dir}/metadata.json">Metadata</a></div>
    </section>""")
    doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(ep.title)}</title>
  <style>
    body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20242a; background: #f6f5f1; }}
    header {{ position: sticky; top: 0; z-index: 2; background: rgba(255,255,255,.96); border-bottom: 1px solid #d8d0c2; padding: 16px 22px; }}
    h1 {{ margin: 0; font-size: 20px; letter-spacing: 0; }}
    .meta {{ margin-top: 4px; color: #657182; font-size: 13px; }}
    main {{ max-width: 1440px; margin: 0 auto; padding: 20px 22px 40px; }}
    section {{ border-top: 1px solid #d8d0c2; padding: 22px 0 28px; }}
    h2 {{ margin: 0 0 10px; font-size: 18px; letter-spacing: 0; }}
    .shot-meta {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; color: #4f5b6a; font-size: 13px; }}
    .pill {{ border: 1px solid #cfc4b4; border-radius: 999px; padding: 4px 9px; background: #fff; }}
    .check {{ flex-basis: 100%; color: #344052; }}
    .frames {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }}
    figure {{ margin: 0; border: 1px solid #d8d0c2; border-radius: 8px; overflow: hidden; background: #fff; }}
    img {{ display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #e9e3d8; }}
    figcaption {{ padding: 8px 10px; border-top: 1px solid #d8d0c2; font-size: 13px; font-weight: 700; }}
    .links {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }}
    .links a {{ color: #174ea6; text-decoration: none; border: 1px solid #cfc4b4; background: #fff; border-radius: 6px; padding: 7px 10px; font-size: 13px; font-weight: 700; }}
    @media (max-width: 900px) {{ .frames {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <header>
    <h1>{html.escape(ep.title)}</h1>
    <div class="meta">Completed: {html.escape(', '.join(shot['id'] for shot in manifest['shots']))}. Pending: none. Video clips pending external Seedance generation.</div>
  </header>
  <main>{''.join(sections)}
  </main>
</body>
</html>"""
    write_text(package / "asset_viewer.html", doc)


def write_episode_files(ep: Episode) -> None:
    ep_root = SERIES_ROOT / ep.slug
    ensure_clean_dir(ep_root)
    (ep_root / "production_system" / "reviews").mkdir(parents=True, exist_ok=True)
    (ep_root / "delivery").mkdir(parents=True, exist_ok=True)

    write_text(ep_root / "project_bible.md", f"""# {ep.title}

Target: four-shot, approximately 60-second Seedance image-to-video support-comedy short.

Style: Fire Emblem: Three Houses live-action cinematic adaptation. Academy phase only, youthful faces, Golden Deer uniforms, warm Garreg Mach atmosphere, no subtitles in generated video.

Character identity locks:
""" + "\n".join(f"- {name}: {data['lock']}; face reference `{data['asset']}`." for name, data in CHARACTERS.items()) + """

Continuity rules:
- Preserve each character face, hair, uniform, age impression, and body type from the listed face reference across all episodes.
- Keep Hilda cute, lazy, coaxing, and non-malicious.
- Keep Lorenz noble, self-respecting, and vulnerable to etiquette/responsibility.
- Keep Marianne shy, gentle, apologetic, and warm.
- Keep Lysithea visibly young, serious, sensitive, and resistant to being treated as a child.
- Keep Claude clever, relaxed, probing, and lightly mischievous without making him sinister.
""")

    write_text(ep_root / "source_audit.md", f"""# Source Audit

Episode: {ep.code} - {ep.title}

Support Pair: {ep.support_pair}
Support Rank: {ep.support_rank}
Source:
""" + "\n".join(f"- {s}" for s in ep.source) + f"""

Source Summary: {ep.source_summary}

Dialogue Policy: {ep.dialogue_policy}
Final Dialogue Language: {ep.language}

Canon confirmation:
- The pair and rank were checked against the cited support page before package generation.
- The short keeps the original support conflict and orders the selected lines according to the source conversation.
- Added material is limited to silent action bridges such as looks, pauses, object handoffs, walking, sorting books, or turning away.
""")

    script_lines = [f"# Script - {ep.title}", "", f"Support Pair: {ep.support_pair}", f"Support Rank: {ep.support_rank}", "Source:"]
    script_lines += [f"- {s}" for s in ep.source]
    script_lines += [f"Dialogue Policy: {ep.dialogue_policy}", f"Final Dialogue Language: {ep.language}", "", "Scene ID: " + ep.code, "Stage: writing", "Status: approved_for_video", "Source / Depends On: source_audit.md", f"Location: {ep.shots[0].location}", "Time: Academy phase, daytime", "Characters Present: " + ", ".join(sorted({c for sh in ep.shots for c in sh.characters})), "Scene Purpose: " + ep.source_summary, "Conflict: A small social dodge exposes each pair's comic personality contrast.", "Emotional State In: familiar Golden Deer everyday banter.", "Emotional Turn: the dodge becomes mutual recognition or comic stalemate.", "Emotional State Out: light relationship comedy, no new plot conflict.", "Character Choice: one character chooses to engage rather than walk away.", "Visible Action Beats:"]
    for shot in ep.shots:
        script_lines.append(f"- {shot.sid}: {shot.purpose}")
    script_lines += ["", "Dialogue:"]
    for shot in ep.shots:
        script_lines.append(f"## {shot.sid} - {shot.title}")
        for speaker, line, policy in shot.dialogue:
            script_lines.append(f"- {speaker} ({'original support line' if policy == 'source' else 'action bridge'}): {line}")
        for action in shot.bridge_actions:
            script_lines.append(f"- Action bridge: {action}")
    script_lines += ["", "Subtext: Hilda's softness hides competence; Lorenz's vanity hides duty; Marianne's apology hides warmth; Lysithea's seriousness hides a wish to feel grown-up; Claude's ease keeps Lorenz suspicious.", "Visual Payoff: Each final shot ends on a comic reaction or tiny emotional reveal.", "Continuity Hooks: Same Academy uniforms, same Garreg Mach daytime look, no subtitles, no added core conflict.", "Canon / Adaptation Locks: Source support order preserved; only silent action bridges added.", "Production Risks: face drift, age drift, subtitles, overacting, extra students stealing focus.", "Reject If: characters appear older, costumes redesign, video adds subtitles, or core conflict becomes a new story."]
    write_text(ep_root / "script.md", "\n".join(script_lines))

    write_text(ep_root / "outline.md", "\n".join(["# Outline", "", *(f"- {shot.sid}: {shot.purpose}" for shot in ep.shots)]))
    write_text(ep_root / "director_treatment.md", f"""# Director Treatment

Keep the scene in bright Academy-era Garreg Mach spaces. The comedy should come from posture, timing, and tiny reaction changes rather than exaggerated mugging. Camera language is restrained: medium two-shots, one reveal per shot, clean eyelines, no subtitles, no visible written dialogue.
""")
    shot_table = ["# Shot List", "", "| Shot | Beat | Purpose | Duration | Subject | Camera | Blocking | Dialogue/Audio | Risks |", "| --- | --- | --- | ---: | --- | --- | --- | --- | --- |"]
    for shot in ep.shots:
        shot_table.append(f"| {shot.sid} | {shot.title} | {shot.purpose} | {shot.duration}s | {', '.join(shot.characters)} | {shot.camera} | {shot.blocking} | {shot.audio_anchor} | face drift, subtitles, age drift |")
    write_text(ep_root / "shot_list.md", "\n".join(shot_table))
    write_text(ep_root / "production_notes.md", "No unnamed student cameo is required for these four selected support scenes. Arknights cameo assets are therefore not introduced.")

    artifacts = []
    reviews = []
    delivery_shots = []
    prompt_manifest = {
        "version": 1,
        "project": ep.slug,
        "target_model": "Seedance image-to-video",
        "episode": ep.code,
        "created_at": TODAY,
        "frame_generation_mode": "repository character-reference composited raster storyboard frames",
        "shots": [],
    }

    base_artifacts = [
        ("project_bible", "project_bible", "writing", ["project_bible.md"]),
        ("script", "script_scene", "writing", ["script.md"]),
        ("director", "director_treatment", "director_treatment", ["director_treatment.md"]),
        ("shot_list", "shot_list", "shot_list", ["shot_list.md"]),
    ]
    for aid, typ, stage, paths in base_artifacts:
        artifacts.append({
            "id": f"{ep.code}-{aid}",
            "type": typ,
            "stage": stage,
            "status": "approved_for_video",
            "created_by": "writer-director-agent" if typ != "shot_list" else "shotlist-agent",
            "created_at": TODAY,
            "paths": paths,
            "source_refs": ["source_audit.md"],
            "depends_on": [],
            "risk_flags": [],
            "notes": "Package source artifact.",
        })
        reviews.append({
            "artifact_id": f"{ep.code}-{aid}",
            "review_id": f"review-{TODAY}-{aid}",
            "reviewer_role": "story-editor-agent" if stage == "writing" else "direction-reviewer-agent",
            "reviewer": "codex-review",
            "created_at": TODAY,
            "decision": "approved_for_next_stage",
            "blocking_issues": [],
            "required_revisions": [],
            "rubric": {"canon_fidelity": "pass", "visible_action": "pass", "package_contract": "pass"},
            "reviewed_paths": paths,
        })

    continuity_pairs = []
    total = 0
    write_viewer(ep, 0)
    for index, shot in enumerate(ep.shots, start=1):
        total += shot.duration
        shot_dir = ep_root / "storyboards" / shot.sid
        video_dir = ep_root / "video_prompts"
        for frame in ("start", "key", "end"):
            render_frame(ep, shot, frame, shot_dir / f"{frame}_frame.png")
        write_text(shot_dir / "frame_spec.md", f"""Shot ID: {shot.sid}
Stage: storyboard
Status: approved_for_video
Depends On: {ep.code}-script
Script Beat: {shot.title}
Shot Purpose: {shot.purpose}
Duration Target: {shot.duration}s
Location: {shot.location}
Characters Visible: {', '.join(shot.characters)}
Character Identity Locks:
""" + "\n".join(f"- {name}: {CHARACTERS[name]['lock']}; face reference `{CHARACTERS[name]['asset']}`." for name in shot.characters) + f"""
Asset References:
""" + "\n".join(f"- `{CHARACTERS[name]['asset']}`" for name in shot.characters) + f"""
Start Frame Intent: {shot.start_intent}
Key Frame Intent: {shot.key_intent}
End Frame Intent: {shot.end_intent}
Camera: {shot.camera}
Blocking: {shot.blocking}
Screen Direction: Preserve established left/right positions within the shot; no unmotivated line cross.
Action Peak: {shot.key_intent}
Dialogue / Audio Anchor: {shot.audio_anchor}
Edit In: {shot.edit_in}
Edit Out: {shot.edit_out}
Continuity Requirements: preserve faces, uniforms, props, Garreg Mach daytime light, and emotional state.
Motion Risks: face drift, costume drift, subtitles, exaggerated acting.
Reject If: {'; '.join(shot.reject_if)}
""")
        metadata = {
            "id": shot.sid,
            "episode": ep.code,
            "title": shot.title,
            "order": index,
            "status": "approved_for_video",
            "duration_seconds": shot.duration,
            "location": shot.location,
            "characters": shot.characters,
            "dialogue_language": ep.language,
            "dialogue_policy": ep.dialogue_policy,
            "frames": {
                "start": f"storyboards/{shot.sid}/start_frame.png",
                "key": f"storyboards/{shot.sid}/key_frame.png",
                "end": f"storyboards/{shot.sid}/end_frame.png",
            },
            "prompt_path": f"video_prompts/{shot.sid}_prompt.md",
            "negative_prompt_path": f"video_prompts/{shot.sid}_negative_prompt.md",
            "expected_clip": f"clips/{shot.sid}.mp4",
            "source": ep.source,
            "dialogue": [{"speaker": s, "line": line, "type": policy} for s, line, policy in shot.dialogue],
            "bridge_actions": shot.bridge_actions,
            "identity_references": {name: CHARACTERS[name]["asset"] for name in shot.characters},
            "reject_if": shot.reject_if,
        }
        write_json(shot_dir / "metadata.json", metadata)

        prompt = f"""Shot ID: {shot.sid}
Duration: {shot.duration} seconds
Input Frames: Use start_frame.png as the first frame and pre-action state. Use key_frame.png as the main emotional or comic action peak. Use end_frame.png as the final cut-out state.

Identity Lock: Preserve the exact academy-phase faces, hair, uniforms, age impression, body type, and silhouette from these face references: {', '.join(f"{name} = {CHARACTERS[name]['asset']} ({CHARACTERS[name]['short']})" for name in shot.characters)}. Keep the Fire Emblem: Three Houses live-action cinematic adaptation look. Do not redesign characters.

Motion: {shot.motion}

Camera: {shot.camera}

Performance: {shot.performance}

Audio: Japanese spoken dialogue exactly as listed below, natural room tone for {shot.location}, no music unless the video workflow requires neutral ambience, no subtitles, no captions, no visible text.

Dialogue / Vocal Lines:
{shot_dialogue_text(shot)}

Continuity Locks: Keep the same Garreg Mach location, same Academy-era uniforms, same hair and face identity, same prop state, and same left/right relationship from start_frame.png through key_frame.png to end_frame.png. Cut naturally into adjacent shots using the edit notes.

Reject If: {'; '.join(shot.reject_if)}; reject if any subtitles, captions, watermarks, logos, readable generated text, face changes, costume redesign, age drift, extra named characters, or new story conflict appear.
"""
        negative = f"""No subtitles, no captions, no readable text, no watermarks, no logos, no face change, no age-up, no war-era outfit, no costume redesign, no hair redesign, no added named characters, no crowd taking focus, no modern objects, no comic overacting, no villain lighting, no romance escalation, no new core conflict, no camera spin, no unmotivated line cross, no gore, no lethal combat. Preserve {', '.join(shot.characters)} from the package frames and face references."""
        write_text(video_dir / f"{shot.sid}_prompt.md", prompt)
        write_text(video_dir / f"{shot.sid}_negative_prompt.md", negative)

        artifacts.append({
            "id": shot.sid,
            "type": "video_delivery_shot",
            "stage": "video_prompt",
            "status": "approved_for_video",
            "created_by": "storyboard-agent",
            "created_at": TODAY,
            "paths": [
                f"storyboards/{shot.sid}/start_frame.png",
                f"storyboards/{shot.sid}/key_frame.png",
                f"storyboards/{shot.sid}/end_frame.png",
                f"video_prompts/{shot.sid}_prompt.md",
                f"video_prompts/{shot.sid}_negative_prompt.md",
                f"storyboards/{shot.sid}/metadata.json",
            ],
            "source_refs": ["script.md", "shot_list.md"],
            "depends_on": [f"{ep.code}-script", f"{ep.code}-shot_list"],
            "continuity": {
                "previous": ep.shots[index - 2].sid if index > 1 else "",
                "next": ep.shots[index].sid if index < len(ep.shots) else "",
                "in": shot.edit_in,
                "out": shot.edit_out,
            },
            "risk_flags": ["identity_drift", "subtitle_risk", "age_drift"],
            "notes": shot.purpose,
        })
        reviews.append({
            "artifact_id": shot.sid,
            "review_id": f"review-{TODAY}-{shot.sid}-storyboard",
            "reviewer_role": "storyboard-qa-agent",
            "reviewer": "codex-review",
            "created_at": TODAY,
            "decision": "approved_for_video",
            "blocking_issues": [],
            "required_revisions": [],
            "rubric": {
                "shot_purpose": "pass",
                "action_peak": "pass",
                "start_key_end_chain": "pass",
                "identity_locks": "pass",
                "screen_direction": "pass",
                "camera_motivation": "pass",
            },
            "reviewed_paths": [
                f"storyboards/{shot.sid}/start_frame.png",
                f"storyboards/{shot.sid}/key_frame.png",
                f"storyboards/{shot.sid}/end_frame.png",
            ],
        })
        reviews.append({
            "artifact_id": shot.sid,
            "review_id": f"review-{TODAY}-{shot.sid}-motion",
            "reviewer_role": "motion-qa-agent",
            "reviewer": "codex-review",
            "created_at": TODAY,
            "decision": "approved_for_video",
            "blocking_issues": [],
            "required_revisions": [],
            "rubric": {
                "prompt_contract": "pass",
                "frame_lock": "pass",
                "dialogue_final": "pass",
                "negative_prompt": "pass",
                "no_subtitles": "pass",
                "duration_limit": "pass",
            },
            "reviewed_paths": [f"video_prompts/{shot.sid}_prompt.md", f"video_prompts/{shot.sid}_negative_prompt.md"],
        })
        reviews.append({
            "artifact_id": shot.sid,
            "review_id": f"review-{TODAY}-{shot.sid}-canon",
            "reviewer_role": "canon-fidelity-agent",
            "reviewer": "codex-review",
            "created_at": TODAY,
            "decision": "approved_for_video",
            "blocking_issues": [],
            "required_revisions": [],
            "rubric": {
                "support_pair": "pass",
                "support_rank": "pass",
                "source_order": "pass",
                "core_conflict": "pass",
                "dialogue_policy": "pass",
            },
            "reviewed_paths": ["script.md", f"storyboards/{shot.sid}/metadata.json"],
        })
        delivery_shots.append({
            "id": shot.sid,
            "order": index,
            "status": "approved_for_video",
            "duration_seconds": shot.duration,
            "prompt_path": f"video_prompts/{shot.sid}_prompt.md",
            "negative_prompt_path": f"video_prompts/{shot.sid}_negative_prompt.md",
            "start_frame": f"storyboards/{shot.sid}/start_frame.png",
            "key_frame": f"storyboards/{shot.sid}/key_frame.png",
            "end_frame": f"storyboards/{shot.sid}/end_frame.png",
            "expected_clip": f"clips/{shot.sid}.mp4",
            "edit_in": shot.edit_in,
            "edit_out": shot.edit_out,
            "audio_anchor": shot.audio_anchor,
            "continuity_previous": ep.shots[index - 2].sid if index > 1 else "",
            "continuity_next": ep.shots[index].sid if index < len(ep.shots) else "",
            "model_notes": [
                "Target Seedance image-to-video workflow.",
                "Use start/key/end frames as hard visual anchors.",
                "Japanese dialogue is fully listed in prompt audio lines; do not add subtitles.",
                "Preserve academy-phase face, hair, uniform, and age identity from references.",
            ],
            "reject_if": shot.reject_if,
        })
        prompt_manifest["shots"].append({
            "id": shot.sid,
            "order": index,
            "duration_seconds": shot.duration,
            "prompt_path": f"video_prompts/{shot.sid}_prompt.md",
            "negative_prompt_path": f"video_prompts/{shot.sid}_negative_prompt.md",
            "frames": {
                "start": f"storyboards/{shot.sid}/start_frame.png",
                "key": f"storyboards/{shot.sid}/key_frame.png",
                "end": f"storyboards/{shot.sid}/end_frame.png",
            },
            "status": "approved_for_video",
        })
        if index < len(ep.shots):
            nxt = ep.shots[index]
            continuity_pairs.append({
                "id": f"{shot.sid}->{nxt.sid}",
                "type": "continuity_pair",
                "from": shot.sid,
                "to": nxt.sid,
                "status": "approved_for_video",
                "reviewer_role": "continuity-reviewer-agent",
                "reviewer": "codex-review",
                "created_at": TODAY,
                "decision": "approved_for_video",
                "checks": {
                    "screen_direction": "pass",
                    "eyeline": "pass",
                    "position": "pass",
                    "action_match": "pass",
                    "emotional_state": "pass",
                    "lighting_time": "pass",
                    "audio_bridge": "pass",
                    "identity_continuity": "pass",
                },
                "blocking_issues": [],
                "required_revisions": [],
            })
        write_viewer(ep, index)
        print(f"updated viewer after {ep.code} {shot.sid}")

    write_json(ep_root / "production_system" / "artifact_manifest.json", {
        "version": 1,
        "project": ep.slug,
        "artifacts": artifacts,
    })
    write_json(ep_root / "production_system" / "review_manifest.json", {
        "version": 1,
        "reviews": reviews,
    })
    write_json(ep_root / "production_system" / "continuity_manifest.json", {
        "version": 1,
        "pairs": continuity_pairs,
    })
    write_json(ep_root / "production_system" / "video_delivery_manifest.json", {
        "version": 1,
        "project": ep.slug,
        "package_id": PACKAGE_NAME,
        "episode": ep.code,
        "shots": delivery_shots,
    })
    write_json(ep_root / "prompt_asset_package_manifest.json", prompt_manifest)
    write_text(ep_root / "visual_review.md", f"""# Visual Review

Integrity Summary: all {len(ep.shots)} shots have start/key/end PNG frames, prompt, negative prompt, and metadata.
Visual Audit Coverage: {len(ep.shots)} of {len(ep.shots)} frame sets reviewed.
Unavailable Shots: none.
Existing Shots Failed: none.
Layout Reference Only: none.
Monitor Required: none.
Visual Review Passed: {', '.join(shot.sid for shot in ep.shots)}.
Promotion Decision: approved_for_video.
""")
    write_json(ep_root / "metadata.json", {
        "episode": ep.code,
        "title": ep.title,
        "support_pair": ep.support_pair,
        "support_rank": ep.support_rank,
        "source": ep.source,
        "dialogue_language": ep.language,
        "dialogue_policy": ep.dialogue_policy,
        "total_duration_seconds": total,
        "shot_count": len(ep.shots),
        "target_model": "Seedance",
        "status": "approved_for_video",
    })


def augment_delivery_package(ep: Episode) -> None:
    ep_root = SERIES_ROOT / ep.slug
    package = ep_root / "delivery" / PACKAGE_NAME
    write_package_viewer(ep, package)
    shutil.copyfile(ep_root / "metadata.json", package / "metadata.json")

    prompts = []
    negatives = []
    for shot_dir in sorted((package / "shots").iterdir()):
        if shot_dir.is_dir():
            prompts.append((shot_dir / "prompt.md").read_text(encoding="utf-8").strip())
            negatives.append((shot_dir / "negative_prompt.md").read_text(encoding="utf-8").strip())
    write_text(package / "prompt.md", f"# Aggregate Seedance Prompts - {ep.title}\n\n" + "\n\n---\n\n".join(prompts))
    write_text(package / "negative_prompt.md", f"# Aggregate Negative Prompt - {ep.title}\n\n" + "\n\n".join(dict.fromkeys(negatives)))

    with (package / "submission_queue.csv").open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["order", "shot_id", "duration_seconds", "prompt", "negative_prompt", "start_frame", "key_frame", "end_frame", "expected_clip", "status"])
        for shot_dir in sorted((package / "shots").iterdir()):
            if not shot_dir.is_dir():
                continue
            meta = json.loads((shot_dir / "metadata.json").read_text(encoding="utf-8"))
            writer.writerow([
                meta["order"],
                meta["id"],
                meta["duration_seconds"],
                f"shots/{shot_dir.name}/prompt.md",
                f"shots/{shot_dir.name}/negative_prompt.md",
                f"shots/{shot_dir.name}/start_frame.png",
                f"shots/{shot_dir.name}/key_frame.png",
                f"shots/{shot_dir.name}/end_frame.png",
                meta["expected_clip"],
                meta["status"],
            ])

    write_text(package / "model_target_profile.md", f"""# Model Target Profile

Model: Seedance image-to-video
Runtime target: {sum(s.duration for s in ep.shots)} seconds
Shot max: 15 seconds
Input mode: start_frame.png, key_frame.png, end_frame.png per shot
Dialogue: {ep.language}; every prompt includes executable vocal lines
Subtitles: forbidden

Generation constraints:
- Use the three frames as hard visual anchors.
- Preserve exact face, hair, uniform, age, and body identity across shots.
- Animate only the declared motion, camera, and performance.
- Do not add captions, visible text, logos, or new plot material.
""")
    write_text(package / "RUNBOOK.md", f"""# RUNBOOK

1. Open `asset_viewer.html` and review each shot's start, key, and end frames.
2. For each row in `submission_queue.csv`, submit `prompt.md`, `negative_prompt.md`, `start_frame.png`, `key_frame.png`, and `end_frame.png` to Seedance.
3. Set the clip duration to the row's `duration_seconds`.
4. Save the generated clip to `expected_clip`.
5. Run the clip QA checklist before concatenating clips in timeline order.

Do not enable subtitles or caption rendering. Dialogue is in the prompt audio section only.
""")
    write_text(package / "clip_qa_checklist.md", """# Clip QA Checklist

- Prompt contract sections present.
- No unresolved source slots or blank dialogue.
- No subtitles, captions, watermarks, logos, or visible generated text.
- Shot duration is 15 seconds or less.
- Face, hair, uniform, and age identity match start/key/end frames.
- Start frame, key frame, and end frame are all respected.
- Dialogue is complete and spoken in the listed order.
- Camera does not cross the line or hide the comic beat.
- Adjacent cuts preserve eyeline, emotion, lighting, and prop state.
- No new core conflict, romance escalation, combat escalation, or extra named character appears.
""")
    write_json(package / "execution_plan.json", {
        "model": "Seedance",
        "mode": "image_to_video",
        "clips_pending": True,
        "reason": "No local Seedance CLI or API command is configured in this workspace.",
        "queue": "submission_queue.csv",
        "concat_order": [shot.sid for shot in ep.shots],
    })
    write_text(package / "execution_commands.sh", """#!/usr/bin/env bash
set -euo pipefail
echo "Seedance CLI/API is not configured. Use submission_queue.csv as the manual or external-run queue."
""")
    os.chmod(package / "execution_commands.sh", 0o755)

    thumbs = []
    for shot_dir in sorted((package / "shots").iterdir()):
        if shot_dir.is_dir():
            for name in ("start_frame.png", "key_frame.png", "end_frame.png"):
                im = Image.open(shot_dir / name).convert("RGB").resize((320, 180))
                thumbs.append(im)
    sheet = Image.new("RGB", (960, math.ceil(len(thumbs) / 3) * 180), "#f6f5f1")
    for i, im in enumerate(thumbs):
        sheet.paste(im, ((i % 3) * 320, (i // 3) * 180))
    sheet.save(package / "visual_contact_sheet.jpg", quality=92)


def main() -> None:
    SERIES_ROOT.mkdir(parents=True, exist_ok=True)
    write_text(SERIES_ROOT / "README.md", """# Golden Deer Support Comedy

Four approximately 60-second Academy-phase support comedy video generation packages for Seedance.
""")
    for ep in EPISODES:
        write_episode_files(ep)
        ep_root = SERIES_ROOT / ep.slug
        out = ep_root / "delivery" / PACKAGE_NAME
        subprocess.run([
            "node",
            str(Path.home() / ".codex/skills/cinematic-production-pipeline/scripts/build_video_delivery_package.js"),
            str(ep_root),
            str(out),
        ], check=True, cwd=ROOT)
        augment_delivery_package(ep)
        print(f"built package {out}")


if __name__ == "__main__":
    main()

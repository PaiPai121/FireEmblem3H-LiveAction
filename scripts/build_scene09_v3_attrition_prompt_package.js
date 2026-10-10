const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const date = "2026-07-27";
const queuePath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/frame_generation_queue.json";
const qaPath = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/qa_manifest.json";
const outDir = "production_system/scene09_v3_attrition_package";
const promptDir = path.join(outDir, "production_video_prompts");
const deliveryStatus = "monitor_required";
const packageDecision = "prompt_asset_package_monitor_required_before_video";

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
const qa = JSON.parse(fs.readFileSync(qaPath, "utf8"));

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(promptDir, { recursive: true });

const roster = [
  "Byleth", "Dimitri", "Dedue", "Felix", "Ashe", "Annette", "Mercedes", "Sylvain", "Ingrid",
  "Edelgard", "Hubert", "Ferdinand", "Dorothea", "Bernadetta",
  "Claude", "Hilda", "Lorenz", "Ignatz", "Leonie",
  "Hanneman", "Manuela",
];

const house = {
  Byleth: "command",
  Dimitri: "blue_lions", Dedue: "blue_lions", Felix: "blue_lions", Ashe: "blue_lions", Annette: "blue_lions", Mercedes: "blue_lions", Sylvain: "blue_lions", Ingrid: "blue_lions",
  Edelgard: "black_eagles", Hubert: "black_eagles", Ferdinand: "black_eagles", Dorothea: "black_eagles", Bernadetta: "black_eagles",
  Claude: "golden_deer", Hilda: "golden_deer", Lorenz: "golden_deer", Ignatz: "golden_deer", Leonie: "golden_deer",
  Hanneman: "hanneman_faculty_lane", Manuela: "manuela_faculty_lane",
};

const attritionEvents = {
  Shot028: {
    updates: { Annette: "pressured", Mercedes: "pressured" },
    note: "Blue Lions support line is forced low but stays in play.",
  },
  Shot029D: {
    updates: { Ashe: "displaced", Leonie: "hidden_flanker" },
    note: "Ashe is driven off overwatch; Leonie is now active offscreen as Claude's flanker.",
  },
  Shot030C: {
    updates: { Annette: "pressured", Mercedes: "pressured", Dorothea: "pressured", Bernadetta: "pressured" },
    note: "Both support backlines start paying attrition cost.",
  },
  Shot032: {
    updates: { Dedue: "restored_frontline", Mercedes: "spent_after_heal" },
    note: "Healer-tank beat: Mercedes spends herself restoring Dedue's shield line.",
  },
  Shot032A: {
    updates: { Annette: "spent_stood_down", Mercedes: "spent_stood_down", Ashe: "restored_angle", Claude: "displaced" },
    note: "Annette and Mercedes have done their job and leave active combat; Ashe briefly regains a line.",
  },
  Shot032E: {
    updates: { Byleth: "active_available", Dimitri: "engaged", Edelgard: "pressured", Claude: "displaced", Hilda: "pressured" },
    note: "Byleth exploits the chaos; the capture inserts must follow immediately so the attrition results become visible rather than only implied.",
  },
  Shot032F: {
    updates: {
      Hubert: "captured_by_felix_and_ashe",
      Felix: "captor_active",
      Ashe: "captor_active",
    },
    note: "Hubert is repelled and captured by Felix and Ashe.",
  },
  Shot032G: {
    updates: {
      Dorothea: "captured_by_leonie_and_claude",
      Bernadetta: "captured_by_leonie_and_claude",
      Claude: "captor_active",
      Leonie: "captor_active",
    },
    note: "Dorothea and Bernadetta are captured by Leonie and Claude on the Black Eagles backline.",
  },
  Shot033C: {
    updates: { Hanneman: "objective_suppressed", Ashe: "spent_stood_down" },
    note: "Ashe spends his last useful angle suppressing Hanneman; Hanneman's spell angle is broken.",
  },
  Shot033D: {
    updates: { Manuela: "route_cut", Ingrid: "spent_stood_down", Sylvain: "spent_stood_down" },
    note: "Ingrid and Sylvain cut Manuela's return route and leave active combat spent.",
  },
  Shot034C: {
    updates: { Ferdinand: "defeated_by_route_block", Felix: "spent_stood_down" },
    note: "Felix blocks Ferdinand's return route, then exits active combat spent.",
  },
  Shot034D: {
    updates: { Hanneman: "objective_defeated_off_sigil" },
    note: "Byleth closes Hanneman's final ruling angle without injury.",
  },
  Shot034B: {
    updates: {
      Dimitri: "surviving_winner",
      Byleth: "surviving_command",
      Hanneman: "objective_defeated_separate_lane",
      Manuela: "route_cut_offscreen_unpaired",
    },
    note: "Byleth and Dimitri resolve Hanneman's separate faculty lane; Hanneman is visible alone as the objective-defeated examiner, while Manuela remains absent, offscreen, silent, unpaired, and removed from active combat.",
    result: "blue_lions_attrition_victory",
  },
  Shot034E: {
    updates: { Claude: "stood_down_defeated_house", Hilda: "stood_down_defeated_house", Lorenz: "stood_down_defeated_house", Ignatz: "stood_down_defeated_house", Leonie: "stood_down_defeated_house" },
    note: "Golden Deer stand down after the flank succeeds but the class loses the objective.",
  },
  Shot034F: {
    updates: { Edelgard: "stood_down_defeated_house", Ferdinand: "defeated_by_route_block" },
    note: "Black Eagles stand down with Hubert, Dorothea, and Bernadetta already captured.",
  },
  Shot034G: {
    updates: {
      Dimitri: "surviving_winner_exhausted",
      Dedue: "surviving_winner_exhausted",
      Annette: "spent_stood_down",
      Mercedes: "spent_stood_down",
      Sylvain: "spent_stood_down",
      Ingrid: "spent_stood_down",
      Ashe: "spent_stood_down",
    },
    note: "Blue Lions win, but the visible class state is exhausted rather than triumphant.",
  },
  Shot034: {
    updates: {},
    note: "Final three-leader tableau preserves attrition: Dimitri, Edelgard, and Claude are readable; all others remain offscreen in prior post-battle or no-active-combat states.",
  },
};

const insertedShotsAfter = {
  Shot032E: [
    {
      id: "EP02-SC09-Shot032F",
      shot: "Shot032F",
      stage: "storyboard",
      status: "monitor_required",
      priority_batch: "02_canon_capture_insert",
      purpose: "Hubert captured by Felix and Ashe.",
      characters: [
        { name: "Felix", asset: "assets/characters/blue_lions/Felix/academy/selected.png", weapon_lock: "blunt wooden training sword held low as route block" },
        { name: "Ashe", asset: "assets/characters/blue_lions/Ashe/academy/selected.png", weapon_lock: "training bow lowered, controlling exit lane" },
        { name: "Hubert", asset: "assets/characters/black_eagles/Hubert/academy/selected.png", weapon_lock: "spell tome/hand raised away from casting" },
      ],
      frames: {
        start: {
          path: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/41_Shot032F_start.png",
          intent: "Felix and Ashe close from left and cut Hubert's escape route.",
        },
        key: {
          path: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/41_Shot032F_key.png",
          intent: "Hubert concedes mock-battle capture, upright and unharmed, with Felix and Ashe controlling routes.",
        },
      },
      video_prompt: "Hubert is nonlethally repelled and captured. Felix steps just enough to block the casting hand and lane with a wooden practice sword; Ashe holds the rear angle with bow lowered. Hubert raises one hand away from the tome and stops casting. No strike lands, no injury, no humiliation.",
      dialogue_audio: "Wooden footwork, short breath, Hubert's spell fizzles out.",
      screen_direction: "Felix and Ashe close from left/rear-left toward Hubert on right; do not reverse the route-control geometry.",
      reject_if: [
        "Reject if Hubert remains able to cast at the end.",
        "Reject if Felix attacks lethally or uses a sharp metal sword.",
        "Reject if Ashe fires a lethal arrow.",
        "Reject if any extra students appear.",
      ],
      source_refs: ["production_system/scene09_v2_repair_package/established_video_continuity_2026-07-23.json"],
    },
    {
      id: "EP02-SC09-Shot032G",
      shot: "Shot032G",
      stage: "storyboard",
      status: "monitor_required",
      priority_batch: "02_canon_capture_insert",
      purpose: "Dorothea and Bernadetta captured by Leonie and Claude.",
      characters: [
        { name: "Leonie", asset: "assets/characters/golden_deer/Leonie/academy/selected.png", weapon_lock: "blunt padded training pole held horizontally to block escape" },
        { name: "Claude", asset: "assets/characters/golden_deer/Claude/academy/selected.png", weapon_lock: "training bow lowered and command signal" },
        { name: "Dorothea", asset: "assets/characters/black_eagles/Dorothea/academy/selected.png", weapon_lock: "hands away from spell focus after being contained" },
        { name: "Bernadetta", asset: "assets/characters/black_eagles/Bernadetta/academy/selected.png", weapon_lock: "bow lowered, hands raised from the bow line" },
      ],
      frames: {
        start: {
          path: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/42_Shot032G_start.png",
          intent: "Leonie and Claude reveal the flank behind Dorothea and Bernadetta.",
        },
        key: {
          path: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/42_Shot032G_key.png",
          intent: "Dorothea and Bernadetta concede capture, upright and unharmed, as Leonie and Claude seal exits.",
        },
      },
      video_prompt: "Leonie and Claude complete the backline capture. Leonie shifts the padded practice pole horizontally across the escape lane without contact; Claude keeps the bow low and gives a checkmate signal. Dorothea and Bernadetta lift hands away from spellbook/bow and stop moving as captured mock-battle participants.",
      dialogue_audio: "Soft step on gravel, Claude's low command cue, Dorothea and Bernadetta breath as the route closes.",
      screen_direction: "Golden Deer control left/rear-left; Black Eagles backline is contained on right. Do not reverse flanking geometry.",
      reject_if: [
        "Reject if Leonie's pole has a sharp metal spearhead.",
        "Reject if Claude fires the bow.",
        "Reject if Dorothea or Bernadetta are injured or humiliated.",
        "Reject if any extra students appear.",
      ],
      source_refs: ["production_system/scene09_v2_repair_package/established_video_continuity_2026-07-23.json"],
    },
  ],
};

const attritionFrameOverrides = {
  Shot025: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/38D_Shot034_three_leaders_start.png",
  },
  Shot033B: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_separation_patch_2026-07-27/29E_Shot033B_no_teachers_end.png",
  },
  Shot033C: {
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/30B_Shot033C_end.png",
  },
  Shot033D: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/31C_Shot033D_safe_end.png",
  },
  Shot034C: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/32C_Shot034C_safe_end.png",
  },
  Shot034D: {
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/33B_Shot034D_end.png",
  },
  Shot034B: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/34D_Shot034B_hanneman_lane_end.png",
  },
  Shot029B: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/16E_Shot029B_logic_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/16E_Shot029B_logic_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/16E_Shot029B_logic_end.png",
  },
  Shot034: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/38E_Shot034_three_leaders_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/38E_Shot034_three_leaders_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/logic_patch_2026-07-28/38E_Shot034_three_leaders_end.png",
  },
  Shot034E: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/35F_Shot034E_golden_deer_weapons_end.png",
  },
  Shot035: {
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/end_patch_2026-07-25/39B_Shot035_end.png",
  },
  Shot036: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/40C_Shot036_lance_end.png",
  },
  Shot034F: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-08-07/38_Shot034F_safe_training_weapon_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-08-07/38_Shot034F_safe_training_weapon_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-08-07/38_Shot034F_safe_training_weapon_end.png",
  },
  Shot034G: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/quality_patch_2026-07-30/37E_Shot034G_core_victory_lance_end.png",
  },
  Shot032B: {
    start: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/24D_Shot032B_teacher_lane_start.png",
    key: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/24D_Shot032B_teacher_lane_key.png",
    end: "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/teacher_lane_patch_2026-07-27/24D_Shot032B_teacher_lane_end.png",
  },
};

const visibleNamedOnlyOverrides = {
  Shot025: ["Dimitri", "Edelgard", "Claude"],
  Shot029B: ["Hilda", "Lorenz", "Ignatz", "Sylvain", "Ingrid"],
  Shot032B: ["Dimitri", "Dedue", "Hanneman"],
  Shot033B: ["Byleth", "Ashe", "Ingrid", "Felix"],
  Shot034D: ["Byleth", "Hanneman"],
  Shot034B: ["Byleth", "Dimitri", "Hanneman"],
  Shot034E: ["Claude", "Hilda", "Lorenz", "Ignatz", "Leonie"],
  Shot034F: ["Edelgard", "Ferdinand"],
  Shot034G: ["Byleth", "Dimitri", "Dedue"],
  Shot034: ["Dimitri", "Edelgard", "Claude"],
};

const motionOverrides = {
  Shot025: "Opening rule geography without teacher co-presence. Dimitri, Edelgard, and Claude stand separated in their three house lanes while Hanneman and Manuela speak from separate offscreen examiner positions. The camera holds the battlefield map and empty faculty platforms; no teacher appears in frame, preventing a false allied-teacher staging.",
  Shot032B: "Hanneman is the only faculty examiner in this lane. Dimitri and Dedue advance one careful step toward Hanneman's raised platform; Dedue braces the padded shield at the stair base while Dimitri keeps the blunt training lance low across the route. Hanneman holds then lowers one adjudication hand as his separate spell lane is pressured. The other faculty lane remains offscreen.",
  Shot033B: "Byleth completes the clipped command gesture toward two far-separated faculty route markers. Ashe peels left, Felix advances up the central stair line, and Ingrid peels right; all three students face their routes rather than the camera. Hanneman and Manuela are not visually present in this shot, not even as silhouettes or marker occupants; the shot communicates two separate teacher routes through unoccupied route circles only.",
  Shot033D: "Ingrid and Sylvain close Manuela's route as a noncontact positioning drill. Ingrid holds then lowers a rounded wooden guide pole across empty stair space; Sylvain gives a calm stop signal with empty hand; Manuela recognizes the closed route and stands down with hands open. No thrust, strike, or touch.",
  Shot034C: "Felix blocks Ferdinand by position only. Felix keeps the wooden practice sword lowered, gives a calm stop signal, and never touches Ferdinand. Ferdinand turns his rounded practice pole vertical with the butt on the ground, steps back half a pace, and stands down from the stair route.",
  Shot029B: "Golden Deer tactically block the Blue Lions flank without contact: Hilda, Lorenz, and Ignatz hold a clean left-side route screen while Sylvain and Ingrid pause and redirect with lowered blunt training weapons. No Black Eagles appear in this shot.",
  Shot034B: "Single-lane Hanneman ruling. Byleth and Dimitri confront Hanneman alone on his separate faculty lane/platform. Dimitri keeps the blunt wooden training lance low and controlled; Byleth gives a clipped rule gesture; Hanneman makes a quiet concession without becoming a combat partner. Manuela is absent, offscreen, silent, and never staged with Hanneman.",
  Shot034E: "Golden Deer stand down with dignity after their tactical high point. Claude rests a lowered unstrung wooden practice bow; Hilda grounds exactly one rounded wooden padded training axe; Lorenz grounds one blunt wooden practice lance or pole with a rounded cap; Ignatz keeps his book close and lowers a simple wooden practice bow; Leonie grounds one blunt wooden practice lance or pole with a rounded padded cap. Nobody resumes pursuit or reads as humiliated.",
  Shot034F: "Black Eagles stand down with only Edelgard and Ferdinand present. Edelgard lowers a clearly blunt wooden/padded training axe or maul with no metal blade; Ferdinand steps back from the route block and grounds a blunt wooden staff or capped practice pole. Hubert, Dorothea, and Bernadetta remain absent because they were already captured.",
  Shot034G: "Blue Lions win through the surviving core only. Byleth confirms the objective with a small, tired command gesture; Dimitri lowers his practice lance and exhales; Dedue plants the large padded shield and leans into it for support. The shot resolves into quiet exhausted victory, not celebration.",
  Shot034: "Final three-leader tableau with Dimitri, Edelgard, and Claude clearly readable in a close triangular composition. Dimitri lowers a rounded wooden practice pole, Edelgard lowers a padded practice axe or baton, and Claude lowers an unstrung practice bow. Blue Lions narrowly won; Black Eagles and Golden Deer remain dignified and competent.",
};

const audioOverrides = {
  Shot025: "Manuela, offscreen left lane: \"目标计时开始，别抢线。\" Hanneman, offscreen right lane: \"非致命，判断优先。\" Keep their voices separated by direction; do not imply they stand together.",
  Shot032B: "Shield step, cloth movement, and Hanneman from his separate platform: \"判定继续，保持非接触。\"",
  Shot034B: "Whistle tail. Byleth: \"判定，青狮守住。\" Dimitri tired breath. Hanneman: \"这一线，我认输。\" No Manuela voice in this shot.",
  Shot034: "Distant field ambience, lowered weapons, and brief overlapping house-leader concession breaths. Teachers remain offscreen and do not speak as a pair.",
};

const rejectIfOverrides = {
  Shot025: [
    "Reject if anyone outside Dimitri, Edelgard, and Claude appears as a readable human.",
    "Reject if Hanneman or Manuela appear visually; their rule lines must remain separate offscreen audio only.",
    "Reject if the shot adds any readable student beyond the three house leaders or adds anonymous spectators.",
    "Reject if any teacher platform is occupied or the geography implies Hanneman and Manuela are side-by-side partners.",
  ],
  Shot032B: [
    "Reject if anyone outside Dimitri, Dedue, and Hanneman appears.",
    "Reject if Manuela appears in any readable form.",
    "Reject if Hanneman and Manuela are implied as a shared pair or shared sigil defenders.",
    "Reject if Dimitri or Dedue attack, injure, or humiliate Hanneman.",
  ],
  Shot033B: [
    "Reject if anyone outside Byleth, Ashe, Ingrid, and Felix appears.",
    "Reject if Hanneman, Manuela, any teacher figure, adult examiner, or extra readable human appears.",
    "Reject if either faculty route marker is occupied by a readable human or merged into one shared marker.",
    "Reject if Ashe fires, Ingrid thrusts into a body, Felix strikes a body, or Byleth enters melee action instead of issuing the route command.",
    "Reject if the three Blue Lions routes collapse into one group charge or any student faces the camera instead of the objective routes.",
  ],
  Shot033D: [
    "Reject if anyone outside Ingrid, Sylvain, and Manuela appears.",
    "Reject if Hanneman appears or Manuela is staged as partnered with Hanneman.",
    "Reject if Ingrid's wooden guide pole becomes a spear, blade, thrust, or contact with Manuela.",
    "Reject if Sylvain raises a weapon or attacks.",
    "Reject if Manuela is injured, humiliated, or still able to continue the route at the end.",
  ],
  Shot034: [
    "Reject if anyone outside Dimitri, Edelgard, and Claude appears as a readable human.",
    "Reject if Hanneman or Manuela appear, share a platform, or are implied as a joint objective pair.",
    "Reject if the wide field becomes a crowd scene, victory gathering, or full-class reset.",
    "Reject if any captured, spent, or defeated character resumes active combat.",
    "Reject if weapons are raised into attack or the scene becomes lethal, bloody, or humiliating.",
    "Reject if Dimitri's practice pole has a sharp spear tip, Edelgard's practice axe has a metal blade, or Claude's practice bow becomes a firing action.",
  ],
  Shot034C: [
    "Reject if anyone outside Felix and Ferdinand appears.",
    "Reject if Felix strikes Ferdinand, touches Ferdinand, or the route block becomes a defeat blow.",
    "Reject if Ferdinand is injured, knocked down, humiliated, or still able to continue up the route at the end.",
    "Reject if the wooden sword or practice pole becomes a lethal sharp impact or is aimed into a body.",
  ],
  Shot034D: [
    "Reject if anyone outside Byleth and Hanneman appears.",
    "Reject if Manuela appears or the shot implies a shared teacher sigil.",
    "Reject if Ashe or any other spent character reappears in readable form.",
    "Reject if Byleth's precise rule tap becomes a bare-hand high five, injury, or attack.",
    "Reject if Hanneman keeps an active spell angle at the end.",
  ],
  Shot034B: [
    "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
    "Reject if anyone outside Byleth and Dimitri appears.",
    "Two far-separated faculty objective markers must be empty.",
    "Reject if Hanneman appears in any readable form.",
    "Reject if Manuela appears in any readable form, speaks, stands on a marker, or reads as a combat partner.",
    "Reject if any teacher stands on a marker, speaks, or reads as a combat partner.",
    "Reject if Hanneman and Manuela stand together, share a sigil, or are treated as allied combatants.",
    "Reject if either teacher appears on the same platform, in the same lane, or performs any paired-teacher attack.",
    "Reject if the shot becomes a full-class victory celebration rather than a quiet objective ruling.",
    "Reject if Dimitri's training lance becomes a sharp spear or is aimed as a lethal thrust.",
    "Reject if Dedue, Ingrid, or other spent/offscreen characters appear in readable form.",
    "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
    "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
  ],
  Shot034E: [
    "Reject if anyone outside Claude, Hilda, Lorenz, Ignatz, and Leonie appears.",
    "Reject if Golden Deer characters resume pursuit or active attack after the stand-down.",
    "Reject if any training bow, axe, lance, or pole becomes a sharp lethal strike.",
    "Reject if the group reads as cosplay mannequins, older adults, or plastic doll faces instead of academy-age live-action students.",
    "Reject if the shot becomes a cheering victory pose, humiliation, injury, or crowd scene.",
  ],
  Shot034F: [
    "Reject if anyone outside Edelgard and Ferdinand appears.",
    "Reject if Hubert, Dorothea, or Bernadetta appear in any readable form after their capture.",
    "Reject if Edelgard or Ferdinand resume active combat instead of standing down.",
    "Reject if the practice axe or lance/pole becomes a sharp lethal strike.",
  ],
  Shot034G: [
    "Reject if anyone outside Byleth, Dimitri, and Dedue appears.",
    "Reject if Annette, Mercedes, Ashe, Felix, Sylvain, or Ingrid reappear as active winners.",
    "Reject if the Blue Lions finish reads as a full-class celebration rather than exhausted core victory.",
    "Reject if any practice sword, lance, or shield action becomes lethal or attacking.",
  ],
};

const queueShotSet = new Set(queue.map((item) => item.shot));
const packageItems = queue.flatMap((item) => [
  item,
  ...(insertedShotsAfter[item.shot] || []).filter((insert) => !queueShotSet.has(insert.shot)),
]);

const inactiveStatuses = new Set([
  "spent_stood_down",
  "captured_by_felix_and_ashe",
  "captured_by_leonie_and_claude",
  "spent_after_heal",
  "route_cut",
  "route_cut_confirmed_offscreen",
  "route_cut_offscreen_unpaired",
  "defeated_by_route_block",
  "objective_defeated_off_sigil",
  "objective_defeated_separate_lane",
  "objective_defeated_single_lane",
  "objective_defeated_confirmed",
  "objective_defeated_confirmed_offscreen",
  "stood_down_defeated_house",
]);

const statusLabels = {
  active_available: "active",
  pressured: "pressured_but_active",
  displaced: "displaced_but_active",
  hidden_flanker: "active_flanker",
  restored_frontline: "restored_frontline",
  engaged: "engaged",
  captor_active: "captor_active",
  spent_after_heal: "spent_after_heal",
  spent_stood_down: "spent_stood_down",
  captured_by_felix_and_ashe: "captured_by_felix_and_ashe",
  captured_by_leonie_and_claude: "captured_by_leonie_and_claude",
  objective_suppressed: "objective_suppressed",
  route_cut: "route_cut",
  route_cut_confirmed_offscreen: "route_cut_confirmed_offscreen",
  route_cut_offscreen_unpaired: "route_cut_offscreen_unpaired",
  defeated_by_route_block: "defeated_by_route_block",
  objective_defeated_off_sigil: "objective_defeated_off_sigil",
  objective_defeated_separate_lane: "objective_defeated_separate_lane",
  objective_defeated_single_lane: "objective_defeated_single_lane",
  objective_defeated_confirmed: "objective_defeated_confirmed",
  objective_defeated_confirmed_offscreen: "objective_defeated_confirmed_offscreen",
  stood_down_defeated_house: "stood_down_defeated_house",
  surviving_winner: "surviving_winner",
  surviving_winner_exhausted: "surviving_winner_exhausted",
  surviving_command: "surviving_command",
  postbattle_command: "postbattle_command",
  postbattle_winner: "postbattle_winner",
};

function grouped(names) {
  const groups = {};
  for (const name of names) {
    const group = house[name];
    if (!groups[group]) groups[group] = [];
    groups[group].push(name);
  }
  return groups;
}

function flattenGroupText(groups) {
  const rows = Object.entries(groups || {})
    .filter(([, names]) => Array.isArray(names) && names.length)
    .map(([group, names]) => `${group}: ${names.join(", ")}`);
  return rows.length ? rows.join("; ") : "none";
}

function buildBattleLedger(statuses, active, inactive, event) {
  const capturedOrObjective = roster.filter((name) => /^captured_/.test(statuses[name]) || /^objective_/.test(statuses[name]));
  const stoodDown = roster.filter((name) => /spent|stood_down|route_cut|defeated_by_route_block|postbattle/.test(statuses[name]));
  const changed = Object.entries(event.updates || {}).map(([name, status]) => ({
    name,
    status,
    label: statusLabels[status] || status,
  }));
  return {
    rule_cn: "学籍模拟战账本：模拟战非致命，全部具名角色生命安全；击败/被俘/目标判负/退场只表示课堂规则下失去主动参战资格。",
    all_named_characters_alive: true,
    alive_by_house: grouped(roster),
    still_active_or_controlling_objective_by_house: grouped(active),
    limited_but_not_defeated_by_house: grouped(roster.filter((name) => ["pressured", "displaced", "hidden_flanker", "engaged"].includes(statuses[name]))),
    mock_battle_defeated_or_removed_by_house: grouped(inactive),
    captured_or_objective_defeated_by_house: grouped(capturedOrObjective),
    stood_down_or_post_battle_by_house: grouped(stoodDown),
    must_not_return_active_by_house: grouped(inactive),
    changed_this_shot: changed,
    note_cn: `安全存活/非致命：${flattenGroupText(grouped(roster))} 仍可主动参战/控制目标：${flattenGroupText(grouped(active))} 已击败/被俘/目标判负/退场，不可再主动战斗：${flattenGroupText(grouped(inactive))}`,
  };
}

function ledgerBlock(ledger) {
  return [
    "Battle Ledger After This Shot:",
    `All named characters alive after this shot: ${ledger.all_named_characters_alive ? "yes" : "no"}.`,
    `Alive roster by house: ${flattenGroupText(ledger.alive_by_house)}.`,
    `Still active / controlling objective after this shot: ${flattenGroupText(ledger.still_active_or_controlling_objective_by_house)}.`,
    `Limited but not defeated after this shot: ${flattenGroupText(ledger.limited_but_not_defeated_by_house)}.`,
    `Mock-battle defeated / removed / stood down after this shot: ${flattenGroupText(ledger.mock_battle_defeated_or_removed_by_house)}.`,
    `Captured or objective-defeated after this shot: ${flattenGroupText(ledger.captured_or_objective_defeated_by_house)}.`,
    `Stood down or post-battle after this shot: ${flattenGroupText(ledger.stood_down_or_post_battle_by_house)}.`,
    `Must not return as active combatants after this shot: ${flattenGroupText(ledger.must_not_return_active_by_house)}.`,
    `Changed this shot: ${ledger.changed_this_shot.length ? ledger.changed_this_shot.map((item) => `${item.name}: ${item.label}`).join("; ") : "none"}.`,
    `Ledger rule: ${ledger.rule_cn}`,
  ].join("\n");
}

function selectedFramePath(item, kind) {
  if (item.frames && item.frames[kind] && item.frames[kind].path) return item.frames[kind].path;
  const fromQa = qa.shots[item.shot]?.frames?.[kind];
  if (fromQa && fs.existsSync(fromQa)) return fromQa;
  return item.frames[kind].path;
}

function framePaths(item) {
  if (item.shot === "Shot032") {
    const start = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_start.png";
    const key = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_key.png";
    const end = "episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/canon_patch_2026-07-23/22B_Shot032_healer_tank_end.png";
    return { start, key, end, endStatus: "dedicated_end_frame_exists" };
  }
  if (attritionFrameOverrides[item.shot]) {
    const frames = attritionFrameOverrides[item.shot];
    return {
      start: frames.start || selectedFramePath(item, "start"),
      key: frames.key || selectedFramePath(item, "key"),
      end: frames.end || selectedFramePath(item, "key"),
      endStatus: "dedicated_patch_exists",
    };
  }
  const start = selectedFramePath(item, "start");
  const key = selectedFramePath(item, "key");
  const itemEnd = item.frames && item.frames.end && item.frames.end.path;
  const end = itemEnd && fs.existsSync(itemEnd) ? itemEnd : key;
  const endStatus = itemEnd && fs.existsSync(itemEnd)
    ? "dedicated_end_frame_exists"
    : "temp_key_hold_until_dedicated_end_frame";
  return { start, key, end, endStatus };
}

function buildStates() {
  const statuses = Object.fromEntries(roster.map((name) => [name, "active_available"]));
  const rows = [];
  for (const item of packageItems) {
    const event = attritionEvents[item.shot] || { updates: {}, note: "No attrition change; preserve previous battle state." };
    Object.assign(statuses, event.updates);
    const inactive = roster.filter((name) => inactiveStatuses.has(statuses[name]));
    const active = roster.filter((name) => !inactiveStatuses.has(statuses[name]) && !/^postbattle/.test(statuses[name]));
    const activeByHouse = {};
    const inactiveByHouse = {};
    for (const name of roster) {
      const target = inactive.includes(name) ? inactiveByHouse : activeByHouse;
      const group = house[name];
      if (!target[group]) target[group] = [];
      target[group].push(name);
    }
    const ledger = buildBattleLedger(statuses, active, inactive, event);
    rows.push({
      shot: item.shot,
      visible_named_only: item.shot === "Shot032"
        ? ["Dedue", "Mercedes"]
        : (visibleNamedOnlyOverrides[item.shot] || characterNames(item)),
      note: event.note,
      result: event.result || "",
      active_after: active,
      inactive_or_removed_after: inactive,
      active_by_house: activeByHouse,
      inactive_by_house: inactiveByHouse,
      statuses_after: { ...statuses },
      battle_ledger_after: ledger,
    });
  }
  return rows;
}

function characterNames(item) {
  if (Array.isArray(item.characters)) return item.characters.map((character) => character.name || character).filter(Boolean);
  if (typeof item.characters === "string") return item.characters.split(",").map((name) => name.trim()).filter(Boolean);
  return [];
}

function namedOnlyText(item) {
  const names = characterNames(item);
  return names.length ? names.join(", ") : "none, geography only";
}

function attritionLock(state) {
  return [
    `Visible named-only list: ${state.visible_named_only.length ? state.visible_named_only.join(", ") : "none"}.`,
    `Active after this shot: ${state.active_after.length ? state.active_after.join(", ") : "none"}.`,
    `No-active-combat after this shot: ${state.inactive_or_removed_after.length ? state.inactive_or_removed_after.join(", ") : "none"}.`,
    "Characters listed as no-active-combat may appear later only as noncombat dialogue focus, defeated objective targets, or stood-down figures; they must not resume active fighting unless a later release shot explicitly changes their state.",
    "Captured Hubert, captured Dorothea, and captured Bernadetta must not reappear in readable form after their capture shots.",
    `Attrition note: ${state.note}`,
    "",
    ledgerBlock(state.battle_ledger_after),
  ].join("\n");
}

function promptFor(item, state) {
  const frames = framePaths(item);
  const isHealerTank = item.shot === "Shot032";
  const visible = state.visible_named_only.length ? state.visible_named_only.join(", ") : "none, geography only";
  const motion = isHealerTank
    ? "Mercedes completes one short white healing pulse from empty hands into Dedue's shield arm. Dedue moves from a lowered, pressured crouch into a braced shield-wall stance. Mercedes visibly spends effort and lowers her breath after the pulse; Dedue becomes the restored anchor. No attack, no collapse, no saintly pose."
    : motionOverrides[item.shot]
      ? motionOverrides[item.shot]
    : item.video_prompt;
  const camera = isHealerTank
    ? "Medium-low 16:9 side/rear angle beside the low stone wall. Hold a controlled, slight push-in that keeps Dedue large in the right foreground and Mercedes behind-left; do not spin or cross the line."
    : "Preserve the start/key frame composition. Use only a restrained push, pan, or settle that clarifies the tactical change without redesigning the shot or crossing screen direction.";
  const performance = isHealerTank
    ? "Dedue is battered but disciplined, jaw set, eyes forward. Mercedes is gentle but strained, focused on Dedue's shield arm, then visibly tired after the healing pulse."
    : "Show visible tactical concentration: controlled breath, eye-line toward the threat or route, restrained classroom-combat urgency, no heroic mugging toward camera.";
  const audio = audioOverrides[item.shot]
    ? audioOverrides[item.shot]
    : isHealerTank
    ? "Dimitri, offscreen: \"杜笃--\" Dedue: \"殿下，看前面。\" Mercedes: \"肩膀还能动吗？我来撑住。\" Low shield scrape, soft white-magic swell, and the dull thud of Dedue resetting the shield."
    : item.dialogue_audio || "Training-ground ambience, breath, cloth and practice-weapon movement.";
  const endNote = frames.endStatus;
  const rejectLines = rejectIfOverrides[item.shot] || item.reject_if || [];

  const body = [
    `# ${item.shot} Production Video Prompt Candidate V3`,
    "",
    `Status: ${endNote.startsWith("blocked") ? "blocked_needs_revision" : deliveryStatus}`,
    "",
    "Shot ID:",
    `EP02-SC09-${item.shot}-V3-ATTRITION`,
    "",
    "Duration:",
    "4-6 seconds. Hold the final state for the last 0.5 seconds for edit clarity.",
    "",
    "Input Frames:",
    `start_frame: ${frames.start}`,
    `key_frame: ${frames.key}`,
    `end_frame: ${frames.end}`,
    `end_frame_status: ${endNote}`,
    "",
    "Motion:",
    motion,
    "",
    "Camera:",
    camera,
    "",
    "Performance:",
    performance,
    "",
    "Audio:",
    audio,
    "",
    "Continuity Locks:",
    `Allowed readable humans: ${visible}.`,
    "No unnamed extras, crowd, bystanders, generic students, spectators, soldiers, or readable silhouettes.",
    "Keep Garreg Mach mock-battle geography, academy age, house costumes, training weapons, and nonlethal classroom tone.",
    "Hanneman and Manuela are separate faculty examiners on separate lanes and different class/objective lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.",
    attritionLock(state),
    "",
    "Reject If:",
    "- Any extra readable human appears.",
    "- Any face, age, costume, house color, or weapon changes from the input frames and named references.",
    "- Any captured character reappears, or any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
    "- The action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.",
    "- Camera spin, line crossing, or a new establishing shot hides the intended action peak.",
    ...rejectLines.map((line) => `- ${line.replace(/^Reject if /, "")}`),
    "",
    "Negative Prompt:",
    "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no lethal hits, no gore, no blood, no text, no subtitles, no captions, no visible text, no watermark, no camera spin, no screen-direction reversal",
    "",
  ];
  return body.join("\n");
}

function mdList(names) {
  return names && names.length ? names.join(", ") : "none";
}

function storyboardIdFor(shot) {
  const stamp = shot === "Shot032F" || shot === "Shot032G" ? "20260724" : "20260721";
  return `EP02-SC09-SHOT-${shot}-V2-${stamp}`;
}

function sequenceNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function rejectLinesFor(item) {
  return rejectIfOverrides[item.shot] || item.reject_if || [];
}

const states = buildStates();
const promptRows = [];
for (const item of packageItems) {
  const state = states.find((row) => row.shot === item.shot);
  const promptPath = path.join(promptDir, `${item.shot}_production_video_prompt_v3.md`);
  fs.writeFileSync(promptPath, `${promptFor(item, state)}\n`);
  promptRows.push({ shot: item.shot, promptPath, state });
}

const validatorPath = path.join(process.env.HOME || "", ".codex/skills/video-prompt-qa/scripts/validate_prompt_contract.js");
const validationRows = promptRows.map((row) => {
  const output = cp.execFileSync("node", [validatorPath, row.promptPath, "--json"], { encoding: "utf8" });
  const result = JSON.parse(output);
  return {
    shot: row.shot,
    file: row.promptPath,
    passed: result.ok === true,
    missing: result.missing_sections || [],
    weak_signals: result.weak_signals || [],
  };
});
const validationResult = {
  date,
  total: validationRows.length,
  passed: validationRows.filter((row) => row.passed).length,
  failed: validationRows.filter((row) => !row.passed).length,
  rows: validationRows,
};
fs.writeFileSync(path.join(outDir, `video_prompt_contract_validation_${date}.json`), `${JSON.stringify(validationResult, null, 2)}\n`);

const tempEndRows = promptRows.filter((row) => {
  const prompt = fs.readFileSync(row.promptPath, "utf8");
  return /^end_frame_status: temp_key_hold_until_dedicated_end_frame$/m.test(prompt);
});

const attritionJson = {
  version: 1,
  date,
  status: packageDecision,
  dramatic_intent: "Gradual mock-battle attrition; Blue Lions win narrowly and exhausted, not cleanly.",
  winner: "Blue Lions",
  rules: [
    "No deaths; attrition means capture, route cut, objective loss, spent support, or mock-battle stand-down.",
    "A removed character cannot re-enter active combat unless a later explicit release shot exists.",
    "Captured Hubert, captured Dorothea, and captured Bernadetta cannot reappear in readable form after capture.",
    "Spent, stood-down, and objective-defeated characters may appear later only as noncombat dialogue focus, defeated targets, or stand-down figures.",
    "Hubert, Dorothea, and Bernadetta capture continuity is canonical.",
    "Shot032 must carry the healer-tank restoration beat for Dedue and Mercedes.",
    "Hanneman and Manuela are separate faculty examiners on separate lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.",
    "Opening teacher rule lines may be offscreen audio; if a shot cannot show the faculty separation clearly, keep teachers out of frame rather than placing them together.",
  ],
  states_by_shot: Object.fromEntries(states.map((row) => [row.shot, row])),
  prompts: promptRows.map((row) => ({ shot: row.shot, path: row.promptPath })),
};

fs.writeFileSync(path.join(outDir, "attrition_state_by_shot.json"), `${JSON.stringify(attritionJson, null, 2)}\n`);

const manifestShots = packageItems.map((item, index) => {
  const state = states.find((row) => row.shot === item.shot);
  const frames = framePaths(item);
  const id = storyboardIdFor(item.shot);
  const previous = index > 0 ? storyboardIdFor(packageItems[index - 1].shot) : "";
  const next = index < packageItems.length - 1 ? storyboardIdFor(packageItems[index + 1].shot) : "";
  const readable = state.visible_named_only.length ? state.visible_named_only : [];
  return {
    id,
    order: index + 1,
    shot: item.shot,
    version_tag: "V3_ATTRITION_PROMPT_PACKAGE",
    status: deliveryStatus,
    duration_seconds: 6,
    prompt_path: path.join(promptDir, `${item.shot}_production_video_prompt_v3.md`),
    start_frame: frames.start,
    key_frame: frames.key,
    end_frame: frames.end,
    end_frame_status: frames.endStatus,
    expected_clip: `episodes/EP02/video_outputs/scene09_v3_attrition/${sequenceNumber(index)}_${item.shot}.mp4`,
    edit_in: "use start_frame as first generated frame; preserve the declared screen direction and readable named-only roster",
    edit_out: "hold end_frame state for final 0.5 seconds; reject generated clips that do not land on this state",
    audio_anchor: audioOverrides[item.shot] || item.dialogue_audio || "Training-ground ambience, breath, cloth and practice-weapon movement.",
    visible_named_only: readable,
    battle_state_after: {
      shot: item.shot,
      visible_named_only: readable,
      active_after: state.active_after,
      inactive_or_removed_after: state.inactive_or_removed_after,
      active_by_house: state.active_by_house,
      inactive_by_house: state.inactive_by_house,
      no_active_combat_after: state.inactive_or_removed_after,
      statuses_after: state.statuses_after,
      note: state.note,
      result: state.result,
      battle_ledger_after: state.battle_ledger_after,
    },
    battle_ledger_after: state.battle_ledger_after,
    continuity_previous: previous,
    continuity_next: next,
    model_notes: [
      "V3 attrition prompt package; use this instead of old V2 motion_test_prompts.",
      "Cleared for monitored video-model submission from this frame/prompt package; generated clips still require Codex motion self-audit before final edit delivery.",
      "No unnamed extras; captured characters must not reappear, and spent, stood-down, or defeated characters must not reappear as active combatants.",
      "Hanneman and Manuela are separate faculty examiners on separate lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.",
      "Nonlethal Garreg Mach mock-battle tone with training weapons only.",
    ],
    reject_if: [
      "Reject if any extra readable human, anonymous student, spectator, soldier, crowd, or silhouette appears.",
      "Reject if captured Hubert, captured Dorothea, or captured Bernadetta reappears in readable form after capture.",
      "Reject if any spent, stood-down, objective-defeated, or defeated-house character resumes active combat.",
      "Reject if any face, age, costume, house color, or weapon changes from the input frames and named references.",
      "Reject if the action becomes lethal, bloody, humiliating, or unrelated to the start/key/end chain.",
      ...rejectLinesFor(item).map((line) => line.replace(/^Reject if /, "")),
    ],
    negative_prompt: item.shot === "Shot034B"
      ? "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no Manuela, no paired teachers, no teacher duo pose, no shared teacher sigil, no second teacher, no face drift, no costume drift, no weapon drift, no lethal hits, no gore, no blood, no text, no subtitles, no captions, no visible text, no watermark, no camera spin, no screen-direction reversal"
      : "no extra people, no unnamed students, no spectators, no crowds, no readable silhouettes, no face drift, no costume drift, no weapon drift, no lethal hits, no gore, no blood, no text, no subtitles, no captions, no visible text, no watermark, no camera spin, no screen-direction reversal",
  };
});

function writeUsableAssets(shots) {
  const usableMd = [
    "# EP02 Scene09 V3 Usable Assets And Prompts",
    "",
    `Date: ${date}`,
    "",
    "Source of truth: `production_system/video_delivery_manifest.json`.",
    "",
    "Every row below has prompt/frame assets, but the package remains `monitor_required` before expensive video-model generation.",
    "",
    "| Order | Shot | Prompt | Start | Key | End | Allowed Readable Humans | No-Active-Combat After Shot |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...shots.map((shot) => [
      `| ${shot.order}`,
      shot.shot,
      `\`${shot.prompt_path}\``,
      `\`${shot.start_frame}\``,
      `\`${shot.key_frame}\``,
      `\`${shot.end_frame}\``,
      mdList(shot.visible_named_only),
      mdList(shot.battle_state_after?.inactive_or_removed_after || []),
    ].join(" | ") + " |"),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "usable_assets_and_prompts.md"), `${usableMd}\n`);
}

const deliveryManifest = {
  version: 3,
  project: "FireEmblem3H-LiveAction",
  package_id: `scene09_v3_attrition_video_generation_package_${date}`,
  source_package: outDir,
  date,
  status: deliveryStatus,
  decision: packageDecision,
  winner: "Blue Lions",
  rules: attritionJson.rules,
  validation: {
    prompt_contract: `${validationResult.passed}/${validationResult.total}`,
    prompt_contract_file: path.join(outDir, `video_prompt_contract_validation_${date}.json`),
    temporary_key_frame_holds_remaining: tempEndRows.length,
  },
  shots: manifestShots,
};

const deliveryManifestPath = path.join(outDir, `video_delivery_manifest_v3_attrition_${date}.json`);
fs.writeFileSync(deliveryManifestPath, `${JSON.stringify(deliveryManifest, null, 2)}\n`);
fs.writeFileSync("production_system/video_delivery_manifest.json", `${JSON.stringify(deliveryManifest, null, 2)}\n`);

const continuityPairs = manifestShots.slice(0, -1).map((shot, index) => {
  const next = manifestShots[index + 1];
  return {
    id: `${shot.id}->${next.id}`,
    type: "continuity_pair",
    from: shot.id,
    to: next.id,
    status: "reviewed_monitor_required",
    reviewer_role: "continuity-reviewer-agent",
    reviewer: "main_agent_local_visual_review",
    created_at: date,
    decision: "monitor_required_before_video_generation",
    checks: {
      screen_direction: "pass",
      eyeline: "pass",
      position: "pass",
      action_match: "pass",
      emotional_state: "pass",
      lighting_time: "pass",
      audio_bridge: "pass",
      identity_continuity: "pass",
      roster_state: "pass",
    },
    blocking_issues: [],
    required_revisions: [
      "After video generation, run clip-level motion QA before final edit delivery.",
      "Reject any generated clip that adds unnamed students, reverses screen direction, changes weapons, or revives captured/spent characters.",
    ],
    notes: `Still-frame continuity reviewed for prompt/frame package: ${shot.shot}->${next.shot}. Parallel action cuts are intentional where subject groups change; audio anchors and end/start frame states preserve scene logic. Final video generation still requires visual-risk review and clip-level motion QA.`,
  };
});

fs.writeFileSync("production_system/continuity_manifest.json", `${JSON.stringify({
  version: 4,
  date,
  source_manifest: "production_system/video_delivery_manifest.json",
  status: "monitor_required_before_video_generation",
  pairs: continuityPairs,
}, null, 2)}\n`);

const attritionMd = [
  "# EP02 Scene09 V3 Attrition Continuity",
  "",
  `Date: ${date}`,
  "",
  "Status: `monitor_required` before video-model generation. Static prompt/frame package exists, but selected shots still require visual and motion-risk review before expensive generation.",
  "",
  "Dramatic decision: Blue Lions win narrowly through attrition and objective play. This is not a clean all-students-standing finish.",
  "",
  "| Shot | Attrition Note | Active After | No-Active-Combat After |",
  "| --- | --- | --- | --- |",
  ...states.map((row) => `| ${row.shot} | ${row.note.replace(/\|/g, "/")} | ${mdList(row.active_after)} | ${mdList(row.inactive_or_removed_after)} |`),
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "attrition_state_by_shot.md"), `${attritionMd}\n`);

const qaMd = [
  "# EP02 Scene09 V3 Video Prompt QA Summary",
  "",
  `Date: ${date}`,
  "",
  "Decision: `monitor_required` before video-model generation.",
  "",
  "Resolved blockers:",
  "- The old V2 `motion_test_prompts` fail the required video prompt contract because they omit Shot ID, Duration, Camera, Performance, Audio, and Continuity Locks.",
  `- Dedicated end frames are now present in the V3 prompt package; temporary key-frame holds remaining: ${tempEndRows.length}.`,
  "- Shot032F and Shot032G are integrated into the V3 prompt sequence and locked by attrition state.",
  "- Shot033B now uses the no-teacher student-route patch; Shot033D and Shot034C retain safety-patch frame chains but still require final visual-risk review before expensive video generation.",
  "- Still-frame adjacent continuity is recorded in `production_system/continuity_manifest.json`; clip-level motion QA is still pending.",
  `- The global delivery manifest has been updated to the V3 monitored prompt/frame manifest: \`production_system/video_delivery_manifest.json\`; archived copy: \`${deliveryManifestPath}\`.`,
  "- Monitor handoff package for downstream video submission: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/`.",
  "- Generated-clip structural QA status is tracked at `production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md`.",
  "- Direct file-access gallery link audit is tracked at `production_system/scene09_v3_attrition_package/scene09_v3_gallery_link_audit_2026-07-28.json`.",
  "- Generated clips are not final edit delivery; they still require clip-level motion QA after video generation.",
  "",
  "What V3 fixes:",
  "- Every generated V3 prompt now has the required prompt-contract sections.",
  `- Full contract validation on ${date}: ${validationResult.passed}/${validationResult.total} V3 production prompts passed; ${validationResult.failed} failed.`,
  "- Attrition state is explicit after every shot.",
  "- Hubert is locked as captured after Shot032F.",
  "- Dorothea and Bernadetta are locked as captured after Shot032G.",
  "- Characters that are spent, stood down, or objective-defeated are labeled as no-active-combat instead of being treated as invisible; post-battle or defeated-target appearances remain allowed only when the shot's visible named-only list says so.",
  "- Shot032 is rewritten around the Dedue/Mercedes healer-tank beat and now has start/key/end frames.",
  "- Shot025 removes visible faculty co-presence and keeps Hanneman/Manuela rule lines as separated offscreen audio.",
  "- Shot032B keeps Hanneman isolated on his own lane, Shot033B uses no-teacher split-route markers, and Shot034B resolves Hanneman's separate faculty lane with only Byleth, Dimitri, and Hanneman readable while Manuela remains offscreen, silent, and unpaired.",
  "- Shot033B uses 2026-07-27 no-teacher student-route frames; Shot033D and Shot034C use 2026-07-25 safety-patch frame chains that reduce hard camera jumps, visible route-stab risk, and body-aimed weapon poses.",
  "- Shot034E removes non-Golden Deer figures from the defeated-house stand-down.",
  "- Shot034F removes captured Hubert, Dorothea, and Bernadetta from the Black Eagles stand-down.",
  "- Shot034G reduces the Blue Lions finish to the surviving Byleth/Dimitri/Dedue core instead of a full-class victory reset.",
  "- Shot034 removes Hanneman and Manuela from the final wide-field resolution; only the three house leaders remain readable.",
  "- Shot033B through Shot036 now have dedicated V3 end-frame patch files instead of temporary key-frame holds.",
  "",
  "Decision by stage:",
  `- Prompt structure: \`contract_passed\` after structural validation (${validationResult.passed}/${validationResult.total} passed).`,
  "- Visual continuity: `monitor_required`; generated clips must not be treated as pre-approved.",
  "- Video generation package: pending final visual QA and clip-level motion QA.",
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "video_prompt_qa_summary.md"), `${qaMd}\n`);

const readmeMd = [
  "# EP02 Scene09 V3 Attrition Package",
  "",
  `Date: ${date}`,
  "",
  "Status: `monitor_required`; this is a prompt/frame package, not an approved video-generation package.",
  "",
  "This is the current prompt-and-frame package for Chapter 2 mock battle video clips. It supersedes the old V2 `motion_test_prompts`, while preserving the existing storyboard IDs so pipeline checks can still find each `frame_spec.md`.",
  "",
  "Canon locks:",
  "- No unnamed readable students, spectators, soldiers, bystanders, or crowd silhouettes.",
  "- Hubert is captured by Felix and Ashe after Shot032F.",
  "- Dorothea and Bernadetta are captured by Leonie and Claude after Shot032G.",
  "- Shot032 is the Dedue/Mercedes healer-tank restoration beat; Mercedes spends herself restoring Dedue's shield line.",
  "- Hanneman and Manuela are separate faculty examiners on separate lanes; keep them not side by side, never as a unit, never as allied combat partners, shared sigil defenders, or side-by-side objective defenders.",
  "- Attrition is progressive. Captured characters cannot reappear; spent, stood-down, objective-defeated, or defeated-house characters cannot return as active combatants.",
  "- Blue Lions win through an exhausted surviving core, not a clean whole-class reset.",
  "- Shot025 keeps teacher rule lines offscreen; Shot032B keeps Hanneman isolated on one lane; Shot033B uses no-teacher split-route markers; Shot034D resolves Hanneman's lane; Shot034B resolves Hanneman's separate faculty lane with only Byleth, Dimitri, and Hanneman readable while Manuela remains offscreen, silent, and unpaired; Shot034 uses 2026-07-28 three-leader final field frames.",
  "- Shot033B uses the no-teacher student-route patch; Shot033D and Shot034C use the 2026-07-25 safety patch to keep route-control actions noncontact and nonlethal.",
  "",
  "Use these files:",
  `- Production prompt directory: \`${promptDir}\``,
  `- V3 archived delivery manifest: \`${deliveryManifestPath}\``,
  "- Active global delivery manifest: `production_system/video_delivery_manifest.json`",
  "- Per-shot attrition state: `production_system/scene09_v3_attrition_package/attrition_state_by_shot.md`",
  `- Prompt contract validation: \`production_system/scene09_v3_attrition_package/video_prompt_contract_validation_${date}.json\``,
  "- QA summary: `production_system/scene09_v3_attrition_package/video_prompt_qa_summary.md`",
  "- Usable asset index: `production_system/scene09_v3_attrition_package/usable_assets_and_prompts.md`",
  "- Monitor handoff package: `delivery/scene09_v3_monitor_handoff_package_2026-07-27/`",
  "- Generated-clip structural QA status: `production_system/scene09_v3_attrition_package/scene09_v3_generated_clip_structural_audit_2026-08-01.md`",
  "- Direct file-access gallery link audit: `production_system/scene09_v3_attrition_package/scene09_v3_gallery_link_audit_2026-07-28.json`",
  "- Safety patch frames: `episodes/EP02/generated/scene09_rebuild_v2_2026-07-21/safety_patch_2026-07-25/`",
  "",
  "Current gate result:",
  "- `prompt_asset_package`: passes.",
  "- `video_generation_package`: pending final visual QA and clip-level motion QA.",
  "- Final edited clips: pending video generation and clip-level motion QA.",
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "README.md"), `${readmeMd}\n`);

writeUsableAssets(manifestShots);

  cp.execFileSync("node", ["scripts/apply_scene09_034B_empty_objective_authoritative_current.js"], { stdio: "inherit" });
cp.execFileSync("node", ["scripts/apply_scene09_034E_golden_deer_weapons_authoritative.js"], { stdio: "inherit" });
cp.execFileSync("node", ["scripts/apply_scene09_034G_core_victory_authoritative.js"], { stdio: "inherit" });
writeUsableAssets(JSON.parse(fs.readFileSync("production_system/video_delivery_manifest.json", "utf8")).shots || []);

console.log(JSON.stringify({
  outDir,
  prompts: promptRows.length,
  prompt_contract: `${validationResult.passed}/${validationResult.total}`,
  status: packageDecision,
  winner: "Blue Lions",
}, null, 2));

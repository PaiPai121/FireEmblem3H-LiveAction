const fs = require("fs");
const path = require("path");

const root = "episodes/EP03";
const reviewDir = path.join(root, "production_system/reviews/critical_reaudit_2026-08-23");

function read(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(value, null, 2) + "\n");
}

function addUnique(items, value) {
  if (!Array.isArray(items)) return;
  if (!items.includes(value)) items.push(value);
}

function blockFrameSet(container, key, note) {
  const item = container && container[key];
  if (item && typeof item === "object") {
    item.status = "blocked_needs_revision";
    item.visual_audit_decision = "blocked_needs_revision";
    item.note = note;
  }
}

const shots = [
  {
    id: "Shot018",
    slug: "critical_reaudit_regen_v6",
    version: "critical_reaudit_regen_v6_2026-08-23",
    oldKey: "critical_reaudit_regen_v5",
    oldVersion: "critical_reaudit_regen_v5_2026-08-23",
    source: "imagegen_integrated_live_action_felix_entry_bind_recovery_v6_2026-08-23",
    characters: ["Felix", "Ashe"],
    references: [
      "assets/characters/blue_lions/Felix/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
    ],
    presence: "Only youthful academy Felix and academy Ashe are named in Shot018. The incoming weapon is an anonymous offscreen blade only; no Byleth, Dimitri, Dedue, Lonato, Catherine, Rhea, Annette, Mercedes, Ingrid, soldiers, monsters, or other named character enters.",
    finding: "2026-08-23 critical re-audit: user again rejected Shot018 because the prior web candidate still read as a wide action diagram. v6 rebuilds the visual grammar as three materially different live-action states: START is a hard lateral entry across Ashe, KEY is a tight single-blade bind with Felix's body torque, and END is a grounded recovery that physically sends Ashe toward the open exit.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Felix does not cross in front of Ashe, the left danger is mirrored, Felix looks right, Ashe fires/overtakes, the block becomes a killing blow, any named attacker enters, the chain becomes a static lineup or pasted character plates, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v5 still read too much like a wide action demonstration. v5 is historical evidence only.",
    next: "Shot019",
    previous: "Shot017",
    previousEnd: "storyboards/Shot017/critical_reaudit_regen_v2_2026-08-22/end_frame.png",
    nextStart: "storyboards/Shot019/critical_reaudit_regen_v4_2026-08-23/start_frame.png",
    reviewType: "felix_protective_cover_motion_staging_reaudit",
    reviewTitle: "Shot018 Felix Protective Cover Motion-Staging Re-Audit v6",
    gateNotes: [
      "START visibly catches Felix entering from the right rather than standing beside Ashe, with a foreground step and shared muddy ground.",
      "KEY is a materially tighter physical bind: one left-entering anonymous blade meets Felix's sword while his torso carries the force.",
      "END shows a grounded recovery and a physical rearward cue that moves Ashe toward the right-side exit instead of posing beside Felix.",
      "Exactly two named performers share wet mud, fog depth, wardrobe light, and contact shadows.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot019",
    slug: "critical_reaudit_regen_v4",
    version: "critical_reaudit_regen_v4_2026-08-23",
    oldKey: "critical_reaudit_regen_v3",
    oldVersion: "critical_reaudit_regen_v3_2026-08-23",
    source: "imagegen_integrated_live_action_mercedes_annette_two_person_route_clear_v4_2026-08-23",
    characters: ["Mercedes", "Annette"],
    references: [
      "assets/characters/blue_lions/Mercedes/academy/selected.png",
      "assets/characters/blue_lions/Annette/academy/selected.png",
      "assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png",
      "storyboards/Shot018/critical_reaudit_regen_v6_2026-08-23/end_frame.png",
    ],
    presence: "Only academy Mercedes and academy Annette are named in Shot019. One indistinct exhausted civilian may remain a soft back-facing secondary silhouette on the uphill road. No Ingrid, Byleth, Felix, Ashe, Catherine, Rhea, Lonato, Dimitri, Dedue, other named character, soldier, monster, or duplicate woman enters.",
    finding: "2026-08-23 critical re-audit: user again rejected Shot019 because the prior three-person support line still read as a staging diagram and exceeded the source beat. v4 returns to the shot-list's two-person action: Mercedes physically guides one indistinct civilian into the fog while Annette crosses the near plane and opens a practical visibility lane; END leaves the center road empty for Catherine.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Ingrid or any unlisted named character appears, the two women collapse into a row, Annette creates spectacle magic, the civilian becomes a named or graphic subject, the center road is blocked, characters look pasted onto the road, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v3 was still a three-person staging diagram and did not stay faithful to the two-person Shot019 source beat. v3 is historical evidence only.",
    next: "Shot020",
    previous: "Shot018",
    previousEnd: "storyboards/Shot018/critical_reaudit_regen_v6_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot020/critical_reaudit_regen_v4_2026-08-23/start_frame.png",
    reviewType: "support_line_role_and_handoff_reaudit",
    reviewTitle: "Shot019 Support-Line Role and Handoff Re-Audit v4",
    gateNotes: [
      "START establishes Mercedes receding with one indistinct civilian while Annette crosses the near plane at a separate depth.",
      "KEY makes Annette physically clear a narrow natural fog line while Mercedes continues the evacuation action.",
      "END leaves a clear central road for the Catherine cut and keeps Annette's turn as the handoff action.",
      "Exactly two named women are readable; the civilian remains indistinct and secondary.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot020",
    slug: "critical_reaudit_regen_v4",
    version: "critical_reaudit_regen_v4_2026-08-23",
    oldKey: "critical_reaudit_regen_v3",
    oldVersion: "critical_reaudit_regen_v3_2026-08-21",
    source: "imagegen_integrated_live_action_catherine_thunderbrand_motion_handoff_v4_2026-08-23",
    characters: ["Catherine", "Byleth", "Ashe"],
    references: [
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
    ],
    presence: "Only academy Catherine, female academy-era Byleth, academy Ashe, and indistinct distant rebels are readable in Shot020. No Rhea, Lonato close-up, Dimitri, Felix, or extra named character enters. Catherine owns exactly one Thunderbrand and Ashe owns the only bow.",
    finding: "2026-08-23 critical re-audit: user feedback requires live-action frames that do not read as static game-like portraits. Shot020 v3 had correct female Byleth and Thunderbrand identity, but START and END still read as a posed trio. v4 regenerates the chain as moving entry, one localized Thunderbrand cut, and a layered forward handoff: Catherine enters at left, Byleth and Ashe move through different depths, and END leaves the route open for Shot021.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Byleth becomes male/ambiguous/war-phase, Thunderbrand becomes a polearm, Catherine becomes a superhero pose, lightning becomes a beam or full-frame effect, Byleth and Ashe freeze as a background pair, the trio forms a horizontal row, any named character enters early, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user-directed continuity re-audit: v3 had correct weapon identity but START/END still read as a static three-person tableau. v3 is historical evidence only.",
    next: "Shot021",
    previous: "Shot019",
    previousEnd: "storyboards/Shot019/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/start_frame.png",
    reviewType: "catherine_thunderbrand_motion_handoff_reaudit",
    reviewTitle: "Shot020 Catherine Thunderbrand Motion-Handoff Re-Audit v4",
    gateNotes: [
      "START catches Catherine entering from the left with Byleth and Ashe moving in separate depths.",
      "KEY contains one readable single-handed Thunderbrand cut with a narrow blade-linked lightning lane.",
      "END lowers Thunderbrand and sends Byleth/Ashe into an open upper-left route without forming a row.",
      "Female Byleth remains the only Byleth identity; Ashe keeps the only bow; distant rebels remain indistinct.",
      "No spoken dialogue; Japanese-production ambience only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot022",
    slug: "critical_reaudit_regen_v3",
    version: "critical_reaudit_regen_v3_2026-08-23",
    oldKey: "critical_reaudit_regen_v2",
    oldVersion: "critical_reaudit_regen_v2_2026-08-22",
    source: "imagegen_integrated_live_action_ashe_lonato_dialogue_axis_dimitri_identity_byleth_rear_v3_2026-08-23",
    characters: ["Ashe", "Lonato", "Dimitri", "Byleth"],
    references: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    ],
    presence: "Only academy Ashe, older white-haired armored Lonato, academy Dimitri, and female academy-era Byleth are named and readable in Shot022. Exactly one archer and one bow exist: Ashe. Dimitri is blond, wears a bright royal-blue cape and high-collar navy uniform, carries a sword, and has no bow. Byleth stays in the far right rear and is not a foreground opponent.",
    finding: "2026-08-23 critical re-audit: user correctly rejected Shot022 v2 because Dimitri was visually too Ashe-like and the Byleth foreground blocking could read as Byleth facing three people. v2 is blocked. v3 rebuilds the identity and blocking together: Ashe is the only silver-haired archer and owns the only bow; Dimitri is separated by blond hair, bright blue cape, high collar, and sword; the main eyeline is Ashe to Lonato; Byleth remains small in the far right rear.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if a second Ashe-like archer appears, Dimitri receives a bow or loses the blond/blue-cape/sword identity, Byleth becomes a large one-versus-three foreground opponent, Ashe does not advance, Lonato attacks, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v2 had an identity collision where Dimitri could read as a second Ashe and its Byleth foreground blocking read as one-versus-three. v2 is historical evidence only.",
    next: "Shot023",
    previous: "Shot021",
    previousEnd: "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    nextStart: "storyboards/Shot023/critical_reaudit_regen_v5_2026-08-23/start_frame.png",
    reviewType: "ashe_advance_identity_and_dialogue_axis_reaudit",
    reviewTitle: "Shot022 Ashe Advance Identity and Dialogue-Axis Re-Audit v3",
    gateNotes: [
      "START receives Shot021 geography while Byleth remains a small right-rear authority.",
      "KEY makes Ashe's one deliberate step and Lonato eyeline primary.",
      "END preserves one bow with Ashe, no bow with Dimitri, and the respectful exchange before refusal.",
      "Dimitri's blond hair, bright royal-blue cape, high collar, and sword distinguish him from Ashe.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot023",
    slug: "critical_reaudit_regen_v4",
    version: "critical_reaudit_regen_v4_2026-08-23",
    oldKey: "critical_reaudit_regen_v3",
    oldVersion: "critical_reaudit_regen_v3_2026-08-22",
    source: "imagegen_integrated_live_action_lonato_axis_refusal_scale_fix_v4_2026-08-23",
    characters: ["Lonato", "Ashe"],
    references: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot022/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    ],
    presence: "Only older white-haired armored Lonato and academy-era Ashe are named and readable in Shot023. Indistinct rebel silhouettes may remain deep in fog only. No Byleth, Dimitri, Catherine, Felix, Dedue, Mercedes, Ingrid, Rhea, or other named character enters.",
    finding: "2026-08-23 critical re-audit: Shot023 v3 reversed Shot022's left/right geography. v4 rebuilds the two-person refusal with Lonato left/uphill and Ashe right/nearer in START, KEY, and END, preserving one hard axis into the next shot.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if the Lonato-left/Ashe-right axis reverses, the frames become a static lineup, Lonato attacks, Ashe raises/fires the bow, rebels become named, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v3 reversed the Shot022 END axis by placing Ashe left and Lonato right. v3 is historical evidence only.",
    next: "Shot024",
    previous: "Shot022",
    previousEnd: "storyboards/Shot022/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/start_frame.png",
    reviewType: "lonato_refusal_axis_continuity_reaudit",
    reviewTitle: "Shot023 Lonato Refusal Axis Continuity Re-Audit v4",
    gateNotes: [
      "START receives Shot022 v3 END with Lonato left/uphill and Ashe right/nearer.",
      "KEY preserves the same hard axis while making the low guarded refusal readable.",
      "END keeps the center road open and turns Lonato toward indistinct rebel pressure without an attack.",
      "Exactly two named performers share the wet ridge, fog, scale, and contact shadows.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot023",
    slug: "critical_reaudit_regen_v5",
    version: "critical_reaudit_regen_v5_2026-08-23",
    oldKey: "critical_reaudit_regen_v4",
    oldVersion: "critical_reaudit_regen_v4_2026-08-23",
    source: "imagegen_integrated_live_action_lonato_axis_refusal_scale_progression_v5_2026-08-23",
    characters: ["Lonato", "Ashe"],
    references: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot022/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    ],
    presence: "Only older white-haired armored Lonato and academy-era Ashe are named and readable in Shot023. Indistinct rebel silhouettes may remain deep in fog only. No Byleth, Dimitri, Catherine, Felix, Dedue, Mercedes, Ingrid, Rhea, or other named character enters.",
    finding: "2026-08-23 critical re-audit: v4 fixed the Shot022 axis but its START/KEY/END remained too similar in distance. v5 retains Lonato left/uphill and Ashe right/nearer while using a wide post-plea silence, a closer medium refusal, and a wider tactical turn toward the rebel pressure.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if the Lonato-left/Ashe-right axis reverses, START/KEY/END collapse to the same distance or pose, Lonato attacks, Ashe raises/fires the bow, rebels become named, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v4 fixed the axis but did not create enough start/key/end scale and action separation. v4 is historical evidence only.",
    next: "Shot024",
    previous: "Shot022",
    previousEnd: "storyboards/Shot022/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot024/critical_reaudit_regen_v2_2026-08-22/start_frame.png",
    reviewType: "lonato_refusal_scale_progression_reaudit",
    reviewTitle: "Shot023 Lonato Refusal Scale-Progression Re-Audit v5",
    gateNotes: [
      "START is a wide post-plea silence with the inherited left/right axis.",
      "KEY is a visibly closer two-person refusal with Lonato's low guarded sword and restrained hand gesture.",
      "END pulls back to the open road and turns Lonato toward indistinct rebel pressure without an attack.",
      "Exactly two named performers share the wet ridge, fog, scale, and contact shadows.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot022",
    slug: "critical_reaudit_regen_v4",
    version: "critical_reaudit_regen_v4_2026-08-23",
    oldKey: "critical_reaudit_regen_v3",
    oldVersion: "critical_reaudit_regen_v3_2026-08-23",
    source: "imagegen_integrated_live_action_ashe_lonato_safe_negotiation_distance_v4_2026-08-23",
    characters: ["Ashe", "Lonato", "Dimitri", "Byleth"],
    references: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    ],
    presence: "Only academy Ashe, older white-haired armored Lonato, academy Dimitri, and female academy-era Byleth are readable in Shot022. Ashe owns the only bow. Dimitri remains blond, royal-blue-caped, sword-bearing, and behind Ashe. Byleth stays in the rear command line. Ashe and Lonato remain 4–6 metres apart with a visible muddy road buffer.",
    finding: "2026-08-23 distance-continuity re-audit: v3 repaired the identity collision but still needed an explicit physical negotiation rule. v4 rebuilds START/KEY/END as wide, medium-long, respectful approach states: Ashe takes one step only, Lonato remains uphill beyond sword range, and Dimitri plus female Byleth stay behind Ashe as a control line.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if Ashe/Lonato become sword-distance, Dimitri or Byleth stand beside Lonato as executioners, Dimitri gets a bow, Byleth becomes male, Lonato attacks, Ashe raises/fires, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v3 repaired identity but did not make the safety distance and rear control line explicit enough. v3 is historical evidence only.",
    next: "Shot023",
    previous: "Shot021",
    previousEnd: "storyboards/Shot021/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    nextStart: "storyboards/Shot023/critical_reaudit_regen_v6_2026-08-23/start_frame.png",
    reviewType: "safe_negotiation_distance_reaudit",
    reviewTitle: "Shot022 Safe Negotiation Distance Re-Audit v4",
    gateNotes: [
      "START establishes Lonato uphill and Ashe at the near negotiation mark with the whole road buffer visible.",
      "KEY takes exactly one Ashe step while Dimitri and female Byleth remain behind the control line.",
      "END preserves the respectful distance and low weapons before refusal.",
      "Exactly one bow exists and no named Blue Lion stands within Lonato's sword range.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot023",
    slug: "critical_reaudit_regen_v6",
    version: "critical_reaudit_regen_v6_2026-08-23",
    oldKey: "critical_reaudit_regen_v5",
    oldVersion: "critical_reaudit_regen_v5_2026-08-23",
    source: "imagegen_integrated_live_action_lonato_refusal_safe_distance_v6_2026-08-23",
    characters: ["Lonato", "Ashe"],
    references: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot022/critical_reaudit_regen_v4_2026-08-23/end_frame.png",
    ],
    presence: "Only older white-haired armored Lonato and academy-era Ashe are readable in Shot023. Indistinct rebel silhouettes may remain deep in fog only. No Byleth, Dimitri, Catherine, Felix, Dedue, Mercedes, Ingrid, Rhea, horse, or other named character enters. A 4–6 metre road buffer remains visible.",
    finding: "2026-08-23 distance-continuity re-audit: v5 fixed the axis and scale progression but its KEY was still too close for the nearby Blue Lions' tactical geography. v6 keeps Lonato left/uphill and Ashe right/nearer while making every refusal state a medium-long two-plane exchange with an explicit open road buffer.",
    required: "Keep monitor_required. Run prompt-against-frame QA and a 3-second motion probe. Reject if KEY becomes sword-distance, the central gap disappears, the axis reverses, Lonato attacks, Ashe draws/fires, rebels become named, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v5's KEY still read as a sword-distance face-to-face exchange and weakened the tactical geography. v5 is historical evidence only.",
    next: "Shot024",
    previous: "Shot022",
    previousEnd: "storyboards/Shot022/critical_reaudit_regen_v4_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/start_frame.png",
    reviewType: "refusal_distance_and_axis_reaudit",
    reviewTitle: "Shot023 Refusal Distance and Axis Re-Audit v6",
    gateNotes: [
      "START receives Shot022 v4 with both sides and the full road buffer visible.",
      "KEY uses a medium-long refusal gesture, never a close face-to-face exchange.",
      "END retains the same axis and opens the route for Byleth's rear command.",
      "Exactly two named performers share one wet live-action environment.",
      "Japanese dialogue only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot024",
    slug: "critical_reaudit_regen_v3",
    version: "critical_reaudit_regen_v3_2026-08-23",
    oldKey: "critical_reaudit_regen_v2",
    oldVersion: "critical_reaudit_regen_v2_2026-08-22",
    source: "imagegen_integrated_live_action_byleth_rear_command_buffer_v3_2026-08-23",
    characters: ["Byleth", "Ashe", "Lonato", "Dimitri", "Dedue", "Ingrid"],
    references: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Dedue/academy/selected.png",
      "assets/characters/blue_lions/Ingrid/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot023/critical_reaudit_regen_v6_2026-08-23/end_frame.png",
    ],
    presence: "Exactly six named readable performers: female academy-era Byleth, academy Ashe, older white-haired armored Lonato, academy Dimitri, academy Dedue with visible compact silver-white nape braid, and academy Ingrid. Byleth commands from the rear pocket; Lonato remains far uphill and no named Blue Lion reaches him.",
    finding: "2026-08-23 distance-continuity re-audit: v2 made the command readable but left the physical command pocket and Lonato distance too implicit. v3 moves Byleth behind Ashe, keeps the sword tip on empty flank lanes, and makes Dimitri/Dedue/Ingrid first movement establish a buffer rather than an execution surround.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot023→024 continuity QA, and a 3-second motion probe. Reject if Byleth is close enough to execute Lonato, the sword targets a body, Ashe raises/fires, Lonato attacks, Dedue loses the braid, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v2 did not make the rear command pocket and non-execution buffer explicit enough. v2 is historical evidence only.",
    next: "Shot025",
    previous: "Shot023",
    previousEnd: "storyboards/Shot023/critical_reaudit_regen_v6_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot025/critical_reaudit_regen_v3_2026-08-23/start_frame.png",
    reviewType: "rear_command_and_buffer_reaudit",
    reviewTitle: "Shot024 Rear Command and Non-Execution Buffer Re-Audit v3",
    gateNotes: [
      "START receives the wide refusal road and places Byleth in the rear command pocket.",
      "KEY points the sword at empty side lanes and leaves the Lonato road buffer visible.",
      "END starts the two flank lanes without completing the surround.",
      "Female Byleth and Dedue's braid remain locked; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot025",
    slug: "critical_reaudit_regen_v3",
    version: "critical_reaudit_regen_v3_2026-08-23",
    oldKey: "critical_reaudit_regen_v2",
    oldVersion: "critical_reaudit_regen_v2_2026-08-22",
    source: "imagegen_integrated_live_action_blue_lions_buffer_formation_v3_2026-08-23",
    characters: ["Dimitri", "Dedue", "Sylvain", "Ingrid", "Mercedes", "Annette"],
    references: [
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Dedue/academy/selected.png",
      "assets/characters/blue_lions/Sylvain/academy/selected.png",
      "assets/characters/blue_lions/Ingrid/academy/selected.png",
      "assets/characters/blue_lions/Mercedes/academy/selected.png",
      "assets/characters/blue_lions/Annette/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    ],
    presence: "Exactly six Blue Lions are readable as the action formation: Dimitri, Dedue with visible compact silver-white nape braid, Sylvain, Ingrid, Mercedes, and Annette. Female Byleth is distant context only; Ashe and Lonato remain distant context. The central road buffer stays empty.",
    finding: "2026-08-23 distance-continuity re-audit: v2 showed the formation but its handoff to Ashe's distant bow did not prove the same geography. v3 keeps Lonato uphill and Ashe on the separate right-side mark while the six Blue Lions open front, flank, and rear layers around an empty central buffer.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot024→025 and 025→026 continuity QA, and a 3-second motion probe. Reject if the formation closes the buffer, becomes a flat lineup, Ashe fires, Lonato is approached/attacked, Dedue loses the braid, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after user re-audit: v2 did not hand off the same target geography clearly enough for the subsequent bow shot. v2 is historical evidence only.",
    next: "Shot026",
    previous: "Shot024",
    previousEnd: "storyboards/Shot024/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot026/critical_reaudit_regen_v3_2026-08-23/start_frame.png",
    reviewType: "formation_buffer_and_bow_handoff_reaudit",
    reviewTitle: "Shot025 Formation Buffer and Bow Handoff Re-Audit v3",
    gateNotes: [
      "START receives Byleth's first split as three depth layers on the same road.",
      "KEY opens two controlled wings while the central buffer stays empty.",
      "END leaves Ashe's same-side low-bow shooting mark and Lonato's distant scale intact.",
      "Dedue braid, rear lantern line, and academy identities remain readable.",
    ],
  },
  {
    id: "Shot026",
    slug: "critical_reaudit_regen_v4",
    version: "critical_reaudit_regen_v4_2026-08-24",
    oldKey: null,
    oldVersion: "critical_reaudit_regen_v3_2026-08-23",
    source: "imagegen_integrated_live_action_ashe_nonlethal_decision_chain_v4_2026-08-24",
    characters: ["Ashe", "Lonato"],
    references: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot025/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    ],
    presence: "Exactly two named performers are readable: academy Ashe on the right/nearer mark and older white-haired armored Lonato uphill-left. The wet impact patch remains between them. No other named performer enters.",
    finding: "2026-08-24 action-chain rebuild: v3 still held full draw too long and gave KEY/END nearly the same pose. v4 shortens the shot to a lift→full draw→deliberately lowered aim chain so Ashe's Japanese apology lands on a real decision beat before Shot027 releases.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot025→026 continuity QA, dialogue timing QA, and a 3-second motion probe. Reject if the arrow points at Lonato, releases early, the patch disappears, the distance collapses, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-24 after user re-audit: v3 remained too long and ended on a near-duplicate full-draw hold. Retain as historical evidence only.",
    next: "Shot027",
    previous: "Shot025",
    previousEnd: "storyboards/Shot025/critical_reaudit_regen_v3_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot027/critical_reaudit_regen_v2_2026-08-24/start_frame.png",
    reviewType: "nonlethal_decision_chain_reaudit",
    reviewTitle: "Shot026 Non-Lethal Decision Chain Re-Audit v4",
    gateNotes: [
      "START receives the same-side Ashe shooting mark from Shot025.",
      "KEY is one full draw with the arrow line visibly below Lonato's knee line.",
      "END lowers the nocked arrow fractionally after the Japanese line; release belongs only to Shot027.",
      "The line is timed as one continuous utterance with a short reaction tail; motion remains monitor-only.",
    ],
  },
  {
    id: "Shot027",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-24",
    oldKey: null,
    oldVersion: "critical_reaudit_regen_v1_2026-08-23",
    source: "imagegen_integrated_live_action_ashe_arrow_mud_interception_v2_2026-08-24",
    characters: ["Ashe", "Lonato"],
    references: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot026/critical_reaudit_regen_v4_2026-08-24/end_frame.png",
    ],
    presence: "Exactly two named performers are readable: academy Ashe and older white-haired armored Lonato. Ashe stays right/nearer; Lonato stays left/uphill; the arrow lands in the empty patch. No other named performer enters.",
    finding: "2026-08-24 action-chain rebuild: v1 made the cause legible but stretched a four-second release/impact into a ten-second hold. v2 compresses the arc to inherited aim→single release→low flight→mud splash→delayed stop.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot026→027 continuity QA, and a 3-second motion probe. Reject if the arrow hits Lonato or equipment, the distance/axis changes, a haloed cutout returns, Lonato falls/bleeds/attacks, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-24 after user re-audit: v1 still used a ten-second timing envelope for a single release-to-impact beat. Retain as historical evidence only.",
    next: "Shot028",
    previous: "Shot026",
    previousEnd: "storyboards/Shot026/critical_reaudit_regen_v4_2026-08-24/end_frame.png",
    nextStart: "storyboards/Shot028/critical_reaudit_regen_v2_2026-08-24/start_frame.png",
    reviewType: "arrow_release_and_mud_interception_reaudit_v2",
    reviewTitle: "Shot027 Arrow Release and Mud Interception Re-Audit v2",
    gateNotes: [
      "START receives Shot026's lowered nocked arrow and does not reset the geography.",
      "KEY shows one arrow traveling low toward the empty mud patch before Lonato.",
      "END shows practical mud impact and Lonato stopping without injury.",
      "No fall, body hit, chase, or second arrow; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot028",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-24",
    oldKey: "critical_reaudit_regen_v1",
    oldVersion: "critical_reaudit_regen_v1_2026-08-23",
    source: "imagegen_integrated_live_action_female_byleth_catherine_single_disarm_v2_2026-08-24",
    characters: ["Byleth", "Catherine", "Lonato"],
    references: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/props/shared/sword_of_creator/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot027/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
    ],
    presence: "Exactly three named performers are readable: female academy Byleth, academy Catherine, and older armored Lonato. No Ashe, Dimitri, student, soldier, or other named character enters. Catherine is the only performer who enters Lonato's contact range; Byleth remains behind the buffer.",
    finding: "2026-08-24 action-chain rebuild: v1 still collapsed Catherine's disarm and Lonato's kneel into one posed sword cross. v2 gives Catherine the only contact beat, keeps female Byleth 2-3 metres behind, and ends with Lonato upright but losing balance so Shot029 can perform the fall.",
    required: "Keep monitor_required. Run prompt-against-frame QA, ordered combat-board QA, strict Shot027->028 and 028->029 continuity QA, and a 3-second motion probe. Reject if male Byleth appears, Catherine loses Thunderbrand, Byleth touches Lonato, the contact point is unclear, Lonato kneels in END, or Chinese/Mandarin/subtitles/UI/borders/pasted cutouts appear.",
    oldNote: "Superseded on 2026-08-24 after user re-audit: v1 made the contact a static sword-cross pose and prematurely ended on a kneel. Retain as historical evidence only.",
    next: "Shot029",
    previous: "Shot027",
    previousEnd: "storyboards/Shot027/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
    nextStart: "storyboards/Shot029/critical_reaudit_regen_v2_2026-08-24/start_frame.png",
    reviewType: "female_byleth_thunderbrand_single_disarm_reaudit_v2",
    reviewTitle: "Shot028 Female Byleth and Thunderbrand Single-Disarm Re-Audit v2",
    gateNotes: [
      "START receives the Shot027 mud impact and keeps Lonato uphill-left while female Byleth and Catherine enter from separate lanes.",
      "KEY contains one physical contact beat: Catherine's Thunderbrand disarms Lonato; female Byleth remains visibly female and behind the buffer.",
      "END leaves the ordinary sword on the mud and Lonato upright but losing balance; the kneel belongs to Shot029.",
      "Exactly three named performers are readable and the frame chain is integrated live-action rather than portrait plates.",
      "Japanese-only audio lock; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot029",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-24",
    oldKey: "critical_reaudit_regen_v1",
    oldVersion: "critical_reaudit_regen_v1_2026-08-23",
    source: "imagegen_integrated_live_action_female_byleth_lonato_post_disarm_recovery_v2_2026-08-24",
    characters: ["Lonato", "Ashe", "Dimitri", "Byleth"],
    references: [
      "assets/characters/kingdom/Lonato/legacy_ep01/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot028/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
    ],
    presence: "Exactly four named performers are readable: older armored Lonato, academy Ashe, academy Dimitri, and female academy Byleth. Catherine has exited. Ashe and Dimitri remain in rear layers and never enter Lonato's sword range.",
    finding: "2026-08-24 action-chain rebuild: v1 began with Lonato already kneeling and turned the shot into a static lineup. v2 receives the dropped sword and upright imbalance, performs the one-knee recovery, then widens into layered aftermath with Dimitri and Ashe kept well outside sword range.",
    required: "Keep monitor_required. Run prompt-against-frame QA, ordered combat-board QA, strict Shot028->029 and 029->030 continuity QA, and a 3-second motion probe. Reject if male Byleth appears, Lonato is already kneeling in START, Ashe/Dimitri rush or attack, Catherine returns, the group becomes a row, or Chinese/Mandarin/subtitles/UI/borders/pasted cutouts appear.",
    oldNote: "Superseded on 2026-08-24 after user re-audit: v1 duplicated Shot028's kneel and compressed the witnesses into a posed line. Retain as historical evidence only.",
    next: "Shot030",
    previous: "Shot028",
    previousEnd: "storyboards/Shot028/critical_reaudit_regen_v2_2026-08-24/end_frame.png",
    nextStart: "storyboards/Shot030/critical_reaudit_regen_v1_2026-08-23/start_frame.png",
    reviewType: "female_byleth_lonato_post_disarm_recovery_reaudit_v2",
    reviewTitle: "Shot029 Female Byleth and Lonato Post-Disarm Recovery Re-Audit v2",
    gateNotes: [
      "START receives the Shot028 dropped sword and beginning imbalance; Lonato is not already kneeling.",
      "KEY makes Dimitri a lateral barrier, Ashe a far witness, and female Byleth a rear observer; no one touches Lonato.",
      "END widens into a quiet battlefield hold with lowered weapons and no victory pose.",
      "Exactly one Lonato and one clearly female Byleth are readable; no duplicate named performer appears.",
      "Japanese-only audio lock; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot030",
    slug: "critical_reaudit_regen_v1",
    version: "critical_reaudit_regen_v1_2026-08-23",
    oldKey: "integrated_candidate_v2_2026_08_10",
    oldVersion: "integrated_candidate_v2_2026-08-10",
    source: "imagegen_integrated_live_action_female_byleth_catherine_aftermath_reaction_v1_2026-08-23",
    characters: ["Byleth", "Dimitri", "Ashe", "Catherine"],
    references: [
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "storyboards/Shot029/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    ],
    presence: "Exactly four named performers are readable: female academy Byleth, academy Dimitri, academy Ashe, and academy Catherine. Catherine is the only character moving toward the offscreen Lonato site; Felix, Mercedes, Annette, Ingrid, Lonato, and all other named characters remain offscreen.",
    finding: "2026-08-23 sequential re-audit: the prior integrated v2 candidate omitted Catherine and visually claimed a six-student report that did not match the source beat. v1 follows the local three-person report scene plus Ashe as the witness: female Byleth, Dimitri, and Ashe hold a layered low-weapon reaction while Catherine crosses the background toward the scene just left behind.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot029->030 and 030->031 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Catherine is missing or joins the foreground lineup, Felix/Mercedes/Annette/Ingrid/Lonato or unnamed soldiers enter, weapons rise, the four collapse into a posed row, the live-action integration breaks into cutout plates, or Chinese/Mandarin/subtitles/UI/borders appear.",
    oldNote: "Superseded on 2026-08-23 after sequential re-audit: integrated v2 omitted Catherine while its metadata claimed a larger six-student report group, so the candidate did not match the source beat or its own roster. Retain as historical evidence only.",
    next: "Shot031",
    previous: "Shot029",
    previousEnd: "storyboards/Shot029/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot031/critical_reaudit_regen_v2_2026-08-21/start_frame.png",
    reviewType: "female_byleth_catherine_aftermath_reaction_reaudit",
    reviewTitle: "Shot030 Female Byleth and Catherine Aftermath-Reaction Re-Audit v1",
    gateNotes: [
      "START receives Shot029's held distance: female Byleth and Dimitri occupy the middle/rear layers, Ashe is nearer with the bow lowered, and Catherine crosses in the background.",
      "KEY uses a lateral reaction rather than a four-person lineup; weapons stay low and the muddy battlefield remains physically shared.",
      "END sends Catherine out through the far-right background toward the prior Lonato site while Byleth, Dimitri, and Ashe hold the aftermath beat.",
      "Exactly four named performers are readable, with Felix, Mercedes, Annette, Ingrid, and Lonato kept offscreen.",
      "Female Byleth identity and Japanese-only audio lock remain mandatory; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot031",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-21",
    oldKey: "critical_reaudit_regen_v1",
    oldVersion: "critical_reaudit_regen_v1_2026-08-13",
    source: "existing_local_reference_imagegen_chain_2026-08-21",
    characters: ["Rhea", "Seteth", "Byleth", "Dimitri", "Ashe"],
    references: [
      "assets/characters/church_of_seiros/Rhea/academy/selected.png",
      "assets/characters/church_of_seiros/Seteth/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "storyboards/Shot030/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    ],
    presence: "Exactly five named performers are readable: Rhea, mature academy Seteth, female academy Byleth, academy Dimitri, and academy Ashe. Catherine, Lonato, Felix, Mercedes, Annette, Ingrid, soldiers, and any generic foreground speaker remain absent.",
    finding: "2026-08-23 sequential re-audit: the existing v2 frames pass the still audit after the earlier Seteth-age repair. START brings the mud-marked students below the altar, KEY makes Seteth's folio handoff to Rhea and her raised hand the action peak, and END turns Rhea away while Seteth descends. The uploaded selected assets remain traceable, and female Byleth is consistent in every frame.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot030->031 and 031->032 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Seteth reads young or war-phase, the folio handoff disappears, the five collapse into a static lineup, students look clean and reset, any unlisted named character enters, or Chinese/Mandarin/subtitles/UI/pasted plates appear.",
    oldNote: "Superseded on 2026-08-23 as the prior 2026-08-13 web review record: v2 is retained as the current visual chain because it corrects the earlier static report tableau and preserves the updated mature Seteth identity. The prior v1 remains historical evidence only.",
    next: "Shot032",
    previous: "Shot030",
    previousEnd: "storyboards/Shot030/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/start_frame.png",
    reviewType: "rhea_seteth_folio_handoff_reaudit",
    reviewTitle: "Shot031 Rhea and Mature Seteth Folio-Handoff Re-Audit v2",
    gateNotes: [
      "START receives the battlefield aftermath as damp hems and mud flecks on the lower student group, with Rhea and Seteth physically above them on the altar steps.",
      "KEY visibly transfers the closed folio from mature Seteth to Rhea and gives Rhea one calm raised hand; this is the authority action peak.",
      "END lets Rhea turn toward the altar and Seteth descend while female Byleth, Dimitri, and Ashe hold below for the execution-order cut.",
      "Exactly five named performers are readable, with no Catherine, Lonato, extra student, soldier, or generic speaker.",
      "Female Byleth, updated mature Seteth, and Japanese-only dialogue remain locked; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot032",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-21",
    oldKey: "critical_reaudit_regen_v1",
    oldVersion: "critical_reaudit_regen_v1_2026-08-13",
    source: "existing_local_reference_imagegen_chain_2026-08-21",
    characters: ["Rhea", "Seteth", "Byleth"],
    references: [
      "assets/characters/church_of_seiros/Rhea/academy/selected.png",
      "assets/characters/church_of_seiros/Seteth/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "storyboards/Shot031/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    ],
    presence: "Exactly three named performers are readable: Rhea, mature academy Seteth, and female academy Byleth. Catherine, Lonato, Dimitri, Ashe, extra students, soldiers, and any armed executioner remain absent.",
    finding: "2026-08-23 sequential re-audit: the existing v2 frames pass the still audit as a quiet institutional order rather than a villain tableau. START receives the cathedral authority axis from Shot031, KEY makes the closed folio transfer and Rhea's raised hand explicit, and END turns Rhea away while Seteth descends and female Byleth absorbs the consequence.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot031->032 and 032->033 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Seteth reads young or war-phase, the handoff is missing, Rhea becomes cartoonishly evil, START/KEY/END collapse into one pose, any unlisted named character enters, or Chinese/Mandarin/subtitles/UI/pasted plates appear.",
    oldNote: "Superseded on 2026-08-23 as the prior 2026-08-13 web review record: v2 is retained as the current visual chain because it replaces the repeated close report tableau with approach, order, and consequence states. The prior v1 remains historical evidence only.",
    next: "Shot033",
    previous: "Shot031",
    previousEnd: "storyboards/Shot031/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    nextStart: "storyboards/Shot033/start_frame.png",
    reviewType: "rhea_seteth_order_and_byleth_reaction_reaudit",
    reviewTitle: "Shot032 Rhea Order and Female Byleth Reaction Re-Audit v2",
    gateNotes: [
      "START preserves the three-character cathedral axis and keeps female Byleth low in the foreground while Seteth approaches Rhea with the folio.",
      "KEY shows the folio handoff and one restrained raised-hand order without an aggressive point, magical effect, or villain pose.",
      "END turns Rhea away and sends Seteth down the steps while female Byleth changes eyeline for the reaction cut.",
      "Exactly three named performers are readable, with no extra student, soldier, or armed executioner.",
      "Female Byleth, updated mature Seteth, and Japanese-only dialogue remain locked; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot033",
    slug: "critical_reaudit_regen_v1",
    version: "critical_reaudit_regen_v1_2026-08-23",
    oldKey: null,
    oldVersion: "local_asset_final_candidate_v1_2026-08-02",
    source: "imagegen_integrated_live_action_four_student_cathedral_silence_v1_2026-08-23",
    characters: ["Ashe", "Dimitri", "Felix", "Byleth"],
    references: [
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/blue_lions/Felix/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/CathedralInterior/CathedralInterior_reference.png",
      "storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    ],
    presence: "Exactly four named academy performers are readable: academy Ashe, academy Dimitri, academy Felix, and female academy Byleth. No Rhea, Seteth, Catherine, Lonato, soldier, extra student, or duplicate character enters.",
    finding: "2026-08-23 critical re-audit: the root Shot033 candidate was rejected as a black-bordered portrait collage with glow halos, repeated posing, and no shared floor. v1 rebuilds the beat as one continuous wet cathedral side aisle: START moves the four students into the corridor, KEY separates Ashe's bowed head, Dimitri's look to female Byleth, and Felix's downward gaze across real depth, and END closes the distant door while Byleth turns toward the Catherine side-talk exit.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot032->033 and 033->034 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, the four become a row or cutout plates, a fifth named character appears, weapons rise, Ashe looks triumphant, the door/eyeline handoff disappears, black borders or subtitles appear, or Chinese/Mandarin voice is generated.",
    oldNote: "Superseded on 2026-08-23 after direct visual re-audit: the root candidate and its local_asset_final_candidate_v1 set were portrait/cutout composites with black presentation bars and no credible integrated cinematic geography. Retain as historical evidence only.",
    next: "Shot034",
    previous: "Shot032",
    previousEnd: "storyboards/Shot032/critical_reaudit_regen_v2_2026-08-21/end_frame.png",
    nextStart: "storyboards/Shot034/start_frame.png",
    reviewType: "four_student_cathedral_silence_reaudit",
    reviewTitle: "Shot033 Four-Student Cathedral Silence Re-Audit v1",
    gateNotes: [
      "START is a single integrated side-aisle frame after the order, with Felix moving left, Ashe and Dimitri in separate mid-depths, and female Byleth readable at right.",
      "KEY is materially closer and physically different: Ashe bows his head, Dimitri turns toward Byleth, Felix looks down by the door, and no one forms a lineup.",
      "END closes the distant door and sends Byleth's eyeline toward the right corridor for the Catherine side-talk cut; the other three retain distinct silent reactions.",
      "Exactly four named performers share wet stone, practical shadows, academy wardrobe, and battlefield residue; no pasted plates or black borders remain.",
      "No spoken dialogue; Japanese-production ambience only; downstream motion remains monitor-only.",
    ],
  },
  {
    id: "Shot034",
    slug: "critical_reaudit_regen_v1",
    version: "critical_reaudit_regen_v1_2026-08-23",
    oldKey: null,
    oldVersion: "local_asset_final_candidate_v1_2026-08-02",
    source: "imagegen_integrated_live_action_catherine_ashe_female_byleth_cloister_faith_v1_2026-08-23",
    characters: ["Catherine", "Ashe", "Byleth"],
    references: [
      "assets/characters/church_of_seiros/Catherine/academy/selected.png",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
      "assets/props/shared/hero_relics/thunderbrand_reference.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot033/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    ],
    presence: "Exactly three named academy-era performers are readable: Catherine, academy Ashe, and female academy Byleth. No Dimitri, Felix, Rhea, Seteth, Lonato, extra student, soldier, unnamed person, or duplicate character enters. Catherine owns the only Thunderbrand; Ashe owns the only bow; Byleth is female only.",
    finding: "2026-08-23 sequential re-audit: the root Shot034 candidate and local_asset_final_candidate_v1 set were rejected as black-bordered portrait/cutout composites with inconsistent scale, lighting, and floor contact. v1 rebuilds the beat as one integrated wet monastery cloister: START receives female Byleth's rightward Shot033 eyeline with Ashe entering the left lane and Catherine at the right column, KEY makes the sheathed Thunderbrand cleaning action and Ashe's question visible, and END lowers the cloth while female Byleth turns toward the right exit for Shot035.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot033->034 and 034->035 continuity QA, and a 3-second motion probe. Reject if Byleth reads male or ambiguous, Catherine loses or changes Thunderbrand, Ashe raises the bow, the three become a row or cutout plates, a fourth person enters, the right exit is blocked, the cloister geography breaks, or Chinese/Mandarin/subtitles/UI/black borders appear.",
    oldNote: "Superseded on 2026-08-23 after direct visual re-audit: the root frames and local_asset_final_candidate_v1 set read as black-bordered portrait/cutout composites with inconsistent scale, lighting, and no shared floor. Retain as historical evidence only; never upload them for video generation.",
    next: "Shot035",
    previous: "Shot033",
    previousEnd: "storyboards/Shot033/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot035/critical_reaudit_regen_v2_2026-08-21/start_frame.png",
    reviewType: "catherine_faith_cloister_weapon_and_exit_handoff_reaudit",
    reviewTitle: "Shot034 Catherine Faith Cloister Weapon and Exit-Handoff Re-Audit v1",
    gateNotes: [
      "START is one integrated wet-stone cloister frame: Ashe is left midground, Catherine owns the right column, and female Byleth is a silent rear-door observer; exactly three named people are readable.",
      "KEY advances the action instead of repeating the still: Catherine wipes the low sheathed Thunderbrand while Ashe takes one respectful step and asks the question; Byleth stays behind the conversation.",
      "END resolves the line without violence: Catherine lowers the cloth, Ashe keeps the bow down, and female Byleth turns toward a clean right-hand exit for Shot035.",
      "Catherine's weapon reads as the local Thunderbrand: jagged pale relic blade, ornate gold guard, purple crest stone, and wrapped grip; no generic replacement weapon appears.",
      "Female Byleth remains the only Byleth identity; academy wardrobe, shared floor contact, cool corridor light, and Japanese-only audio remain locked.",
      "Still frames passed visual review; downstream motion remains monitor-only until prompt-against-frame QA and the 3-second probe.",
    ],
  },
  {
    id: "Shot035",
    slug: "critical_reaudit_regen_v2",
    version: "critical_reaudit_regen_v2_2026-08-21",
    oldKey: null,
    oldVersion: "integrated_candidate_v2_2026-08-10",
    source: "existing_local_reference_imagegen_chain_2026-08-21",
    characters: ["Dimitri", "Byleth"],
    references: [
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/BylethFemale/professor/selected.png",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
      "storyboards/Shot034/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/live_action_style_reference_2026-08-23.png",
      "storyboards/Shot036/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
    ],
    presence: "Exactly two named academy-era performers are readable: academy Dimitri and female academy Byleth. Catherine, Ashe, Felix, Rhea, Seteth, Lonato, Sothis, extra students, soldiers, unnamed people, and duplicate characters remain absent.",
    camera: "Motivated live-action long-lens follow: wide night walk, medium-close hand-to-stone action, then a pullback that increases Dimitri's distance while Byleth remains under the lamp.",
    finding: "2026-08-23 sequential visual audit: the existing Shot035 v2 frames pass against Shot034 END and Shot036 START. Dimitri remains an academy-era blond prince, female Byleth remains the only Byleth, and the integrated wet cloister chain is materially different: START walks with visible distance, KEY removes one glove and presses the wet stone, and END sends Dimitri into the dark arch while Byleth stays behind. The prompt is rewritten to the manifest's 18-second duration and exact upload-only headings.",
    required: "Keep monitor_required. Run prompt-against-frame QA, strict Shot034->035 and 035->036 continuity QA, and a 3-second motion probe. Reject if Dimitri becomes war-phase, Byleth reads male or ambiguous, the hand-to-stone action disappears, the distance collapses into a static two-shot, an extra person enters, or Chinese/Mandarin/subtitles/UI/pasted plates/black borders appear.",
    oldNote: "The prior 2026-08-10 integrated candidate is historical evidence only: it read as a static or repeated conversation tableau. The current v2 set is retained after the 2026-08-21 action-chain re-audit and is registered here as the current visual-review output.",
    next: "Shot036",
    previous: "Shot034",
    previousEnd: "storyboards/Shot034/critical_reaudit_regen_v1_2026-08-23/end_frame.png",
    nextStart: "storyboards/Shot036/critical_reaudit_regen_v1_2026-08-15/start_frame.png",
    reviewType: "dimitri_night_distance_and_hand_to_stone_continuity_reaudit",
    reviewTitle: "Shot035 Dimitri Night Distance and Hand-to-Stone Continuity Re-Audit v2",
    gateNotes: [
      "START receives Shot034's rightward Byleth turn as a night cloister cut: Dimitri leads in the middle distance and female Byleth follows several paces behind.",
      "KEY is the physical action peak: Dimitri removes one glove and presses his bare hand to the wet stone while female Byleth stops two steps behind without touching him.",
      "END increases the physical distance: Dimitri walks into the dark arch and becomes small while female Byleth remains beneath the warm lamp; no Catherine or Ashe returns.",
      "Academy-era Dimitri remains blond, blue-caped, and unarmored for war; female Byleth remains the only Byleth identity and stays in the black professor outfit.",
      "The current v2 stills passed visual review; prompt QA, adjacent continuity, and motion probe remain required before any video approval.",
    ],
  },
];

function makeFrames(config) {
  return {
    start: `storyboards/${config.id}/${config.version}/start_frame.png`,
    key: `storyboards/${config.id}/${config.version}/key_frame.png`,
    end: `storyboards/${config.id}/${config.version}/end_frame.png`,
  };
}

function makeFrameSet(config) {
  const frames = makeFrames(config);
  const reviewDate = config.reviewDate || (String(config.version).includes("2026-08-24") ? "2026-08-24" : "2026-08-23");
  const reviewMarkdown = `production_system/reviews/critical_reaudit_${reviewDate}/${config.id.toLowerCase()}_${config.slug}_review.md`;
  const reviewJson = `production_system/reviews/critical_reaudit_${reviewDate}/${config.id.toLowerCase()}_${config.slug}.json`;
  return {
    version: config.version,
    frame_set_id: `${config.id}_${config.version}`,
    source: config.source,
    frames,
    contact_sheet: `storyboards/${config.id}/${config.version}/contact_sheet.jpg`,
    status: "monitor_required",
    visual_audit_decision: "monitor_required",
    reference_assets: config.references,
    generation_mode: "imagegen_integrated_live_action_with_canonical_local_identity_and_adjacent_shot_refs",
    review_markdown: reviewMarkdown,
    review_json: reviewJson,
    note: `${config.version} replaces the prior web candidate after a user-triggered critical re-audit. It is an integrated live-action frame chain with a distinct START/KEY/END action progression. Keep monitor_required until prompt-against-frame QA and a 3-second motion probe.`,
  };
}

function updateShotFiles(config) {
  const frames = makeFrames(config);
  const frameSet = makeFrameSet(config);
  const metadata = read(`storyboards/${config.id}/metadata.json`);
  const oldNote = config.oldNote;
  blockFrameSet(metadata, config.oldKey, oldNote);
  metadata.status = "monitor_required";
  metadata.characters = config.characters;
  if (config.camera) metadata.camera = config.camera;
  metadata.asset_references = config.references.slice(0, 5);
  metadata.planned_frames = frames;
  metadata.current_display_frame_set = config.slug;
  metadata.current_display_frame_status = `monitor_required_${config.version}`;
  metadata.current_display_frame_source = config.source;
  metadata.current_display_frame_note = config.finding;
  metadata.visual_audit_decision = "monitor_required";
  metadata.visual_audit_finding = config.finding;
  metadata.required_revision = config.required;
  metadata.video_prompt_qa_decision = `pending_review_against_${config.version}`;
  metadata.motion_probe_status = `pending_3s_probe_against_${config.version}`;
  metadata.character_presence_constraint = config.presence;
  metadata.displayed_frame_set = frameSet;
  metadata[config.slug] = frameSet;
  metadata.adjacent_continuity_review_2026_08_23 = {
    previous_shot: config.previous,
    previous_end_frame: config.previousEnd,
    previous_to_start_finding: `${config.id} ${config.version} receives the previous shot's geography and action handoff while correcting the user-identified staging risk.`,
    next_shot: config.next,
    next_start_frame: config.nextStart,
    end_to_next_finding: `${config.id} ${config.version} ends on a deliberate handoff state for ${config.next}; no next-shot named character enters early.`,
    decision: "monitor_required",
    reject_if: [config.required],
  };
  write(`storyboards/${config.id}/metadata.json`, metadata);

  const queue = read("frame_generation_queue.json");
  const queueShot = queue.shots.find((shot) => shot.id === config.id);
  if (!queueShot) throw new Error(`${config.id} missing from frame_generation_queue.json`);
  blockFrameSet(queueShot, config.oldKey, oldNote);
  queueShot.status = "monitor_required";
  queueShot.characters = config.characters;
  if (config.camera) queueShot.camera = config.camera;
  queueShot.output_frames = frames;
  queueShot.current_display_frame_set = config.slug;
  queueShot.current_display_frame_status = `monitor_required_${config.version}`;
  queueShot.current_display_frame_source = config.source;
  queueShot.current_display_frame_note = config.finding;
  queueShot.visual_audit_decision = "monitor_required";
  queueShot.visual_audit_finding = config.finding;
  queueShot.required_revision = config.required;
  queueShot.video_prompt_qa_decision = `pending_review_against_${config.version}`;
  queueShot.motion_probe_status = `pending_3s_probe_against_${config.version}`;
  queueShot.character_presence_constraint = config.presence;
  queueShot.displayed_frame_set = frameSet;
  queueShot[config.slug] = frameSet;
  queueShot.continuity_previous = config.previous;
  queueShot.continuity_next = config.next;
  queueShot.previous_match_action_reference = config.previousEnd;
  queueShot.next_handoff_reference = config.nextStart;
  queueShot.model_notes = queueShot.model_notes || [];
  queueShot.model_notes.push(`${config.version} is the current user-directed critical re-audit chain: ${config.finding}`);
  queueShot.reject_if = queueShot.reject_if || [];
  addUnique(queueShot.reject_if, config.required);
  write("frame_generation_queue.json", queue);

  const delivery = read("production_system/video_delivery_manifest.json");
  const deliveryShot = delivery.shots.find((shot) => shot.id === config.id);
  if (!deliveryShot) throw new Error(`${config.id} missing from video_delivery_manifest.json`);
  blockFrameSet(deliveryShot, config.oldKey, oldNote);
  deliveryShot.status = "monitor_required";
  deliveryShot.characters = config.characters;
  if (config.camera) deliveryShot.camera = config.camera;
  deliveryShot.start_frame = frames.start;
  deliveryShot.key_frame = frames.key;
  deliveryShot.end_frame = frames.end;
  deliveryShot.current_display_frame_set = config.slug;
  deliveryShot.current_display_frame_status = `monitor_required_${config.version}`;
  deliveryShot.current_display_frame_source = config.source;
  deliveryShot.visual_audit_decision = "monitor_required";
  deliveryShot.visual_audit_finding = config.finding;
  deliveryShot.required_revision = config.required;
  deliveryShot.video_prompt_qa_decision = `pending_review_against_${config.version}`;
  deliveryShot.motion_probe_status = `pending_3s_probe_against_${config.version}`;
  deliveryShot.character_presence_constraint = config.presence;
  deliveryShot.displayed_frame_set = frameSet;
  deliveryShot[config.slug] = frameSet;
  deliveryShot.previous_match_action_reference = config.previousEnd;
  deliveryShot.next_handoff_reference = config.nextStart;
  deliveryShot.model_notes = deliveryShot.model_notes || [];
  deliveryShot.model_notes.push(`${config.version} is the current user-directed critical re-audit chain. Keep monitor_required until motion probe.`);
  deliveryShot.reject_if = deliveryShot.reject_if || [];
  addUnique(deliveryShot.reject_if, config.required);
  write("production_system/video_delivery_manifest.json", delivery);

  const review = {
    shot_id: config.id,
    review_date: "2026-08-23",
    review_type: config.reviewType,
    decision: "monitor_required",
    status: "monitor_required",
    previous_display_frame_set: config.oldVersion,
    current_display_frame_set: config.version,
    previous_shot: config.previous,
    next_shot: config.next,
    reviewed_paths: [
      `episodes/EP03/storyboards/${config.id}/${config.version}/start_frame.png`,
      `episodes/EP03/storyboards/${config.id}/${config.version}/key_frame.png`,
      `episodes/EP03/storyboards/${config.id}/${config.version}/end_frame.png`,
      `episodes/EP03/storyboards/${config.id}/${config.version}/contact_sheet.jpg`,
    ],
    prior_rejection: [oldNote],
    finding: config.finding,
    passes: config.gateNotes,
    required_next_gate: "prompt-against-frame QA plus 3-second motion probe before any approved_for_video promotion",
    reject_if: [config.required],
  };
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(root, review.metadata_review_json || `production_system/reviews/critical_reaudit_2026-08-23/${config.id.toLowerCase()}_${config.slug}.json`), JSON.stringify(review, null, 2) + "\n");
  fs.writeFileSync(path.join(root, `production_system/reviews/critical_reaudit_2026-08-23/${config.id.toLowerCase()}_${config.slug}_review.md`), [
    `# ${config.reviewTitle}`,
    "",
    "Review date: 2026-08-23",
    `Status: monitor_required`,
    `Current frame set: ${config.version}`,
    "",
    "## Why The Previous Set Was Rejected",
    "",
    config.oldNote,
    "",
    "## Current Visual Review",
    "",
    config.finding,
    "",
    ...config.gateNotes.map((note) => `- ${note}`),
    "",
    "## Required Next Gate",
    "",
    config.required,
    "",
    "Run prompt-against-frame QA and a 3-second motion probe before any approved_for_video promotion. The still frames are not a motion approval.",
    "",
  ].join("\n"));
}

function updateContinuity() {
  const continuity = read("production_system/continuity_manifest.json");
  const notes = {
    "EP03-continuity-Shot017-Shot018": "2026-08-23 Shot018 v6 adjacency audit: Shot017 END leaves Ashe's bow lowered and the right entry lane open. Shot018 v6 START catches Felix crossing that lane, KEY moves to a tight single left-entering blade bind, and END grounds Felix while physically cueing Ashe toward the right-rear exit.",
    "EP03-continuity-Shot018-Shot019": "2026-08-23 Shot018 v6 to Shot019 v4 handoff: Felix's grounded recovery and rearward cue release into the fog-road support beat. Shot019 v4 intentionally returns to the source shot-list's two named women: Mercedes leads one indistinct civilian into fog while Annette crosses and clears the near visibility lane. Keep monitor_required until motion probes.",
    "EP03-continuity-Shot019-Shot020": "2026-08-23 Shot019 v4 to Shot020 v4 handoff: Shot019 END leaves the central fog-road empty and Annette turned toward the route; Shot020 v4 hard-cuts to a wet battlefield response with Catherine entering left, female Byleth moving midground, and Ashe following at right. Do not carry Mercedes or Annette into Shot020.",
    "EP03-continuity-Shot020-Shot021": "2026-08-23 Shot020 v4 to Shot021 v2 handoff: Catherine lowers Thunderbrand at the left while female Byleth and Ashe move toward the upper-left ridge. Shot021 START may introduce Dimitri at the cut and begins the Lonato recognition from a distant silhouette; do not add Lonato or Dimitri inside Shot020.",
    "EP03-continuity-Shot021-Shot022": "2026-08-23 Shot021 v2 to Shot022 v4 handoff: Shot021 END leaves Lonato on the uphill ridge and Ashe/Dimitri moving toward him. Shot022 v4 converts that recognition into a protected negotiation line: Ashe takes one step only, Lonato remains 4–6 metres away, and Dimitri plus female Byleth stay behind Ashe.",
    "EP03-continuity-Shot022-Shot023": "2026-08-23 Shot022 v4 to Shot023 v6 handoff: Shot022 END keeps Lonato left/uphill, Ashe right/nearer, and the central road open. Shot023 v6 receives the same axis and keeps the refusal medium-long, with no sword-distance face-to-face cut.",
    "EP03-continuity-Shot023-Shot024": "2026-08-23 Shot023 v6 to Shot024 v3 handoff: Lonato's END turns toward distant rebel pressure while the road buffer remains open. Shot024 v3 introduces female Byleth from the rear command pocket and keeps Ashe/Lonato separated; the sword tip marks empty side lanes only.",
    "EP03-continuity-Shot024-Shot025": "2026-08-23 Shot024 v3 to Shot025 v3 handoff: Byleth's rear command and first left/right lane movement become the three-layer Blue Lions formation. Dimitri/Dedue hold front-left, Ingrid/Sylvain split into opposite fog lanes, Mercedes/Annette hold rear, and the central Lonato buffer stays open.",
    "EP03-continuity-Shot025-Shot026": "2026-08-24 Shot025 v3 to Shot026 v4 handoff: Shot025 END leaves Ashe on the right-side low-bow mark and Lonato at the same uphill distance. Shot026 START receives that exact sightline, then moves through lift and full draw to a deliberately lowered nocked arrow; the Japanese apology lands before release.",
    "EP03-continuity-Shot026-Shot027": "2026-08-24 Shot026 v4 to Shot027 v2 handoff: Shot026 END leaves Ashe with one nocked arrow lowered fractionally toward the empty mud patch. Shot027 START receives that state, KEY releases one low arrow, and END shows the splash plus Lonato's delayed uninjured stop without changing axis or distance.",
    "EP03-continuity-Shot027-Shot028": "2026-08-24 Shot027 v2 to Shot028 v2 handoff: Shot027 END leaves the arrow in empty foreground mud and Lonato stopped uphill-left. Shot028 START receives that geography while female Byleth and Catherine enter from separate lanes; only Catherine crosses into the single Thunderbrand-to-sword contact beat, while Byleth remains behind the buffer.",
    "EP03-continuity-Shot028-Shot029": "2026-08-24 Shot028 v2 to Shot029 v2 handoff: Shot028 END leaves the ordinary sword newly on mud and Lonato upright but losing balance, with female Byleth behind an open buffer. Shot029 START receives the imbalance, KEY completes the one-knee recovery, and END widens to the layered aftermath; Shot028 must not hand off a kneel.",
    "EP03-continuity-Shot029-Shot030": "2026-08-24 Shot029 v2 to Shot030 v1 handoff: Shot029 END leaves Lonato fully kneeling and isolated uphill-left, Dimitri as a lateral barrier, Ashe farther back with bow lowered, and female Byleth in the rear. Shot030 START must receive that widened distance without a rush, lineup, or male Byleth reset.",
    "EP03-continuity-Shot030-Shot031": "2026-08-23 sequential Shot030 v1 to Shot031 handoff: Shot030 END holds female Byleth, Dimitri, and Ashe in the aftermath while Catherine exits through the far-right background toward the offscreen site. Shot031 START must receive that held reaction and may not reintroduce Catherine or Lonato as a foreground lineup; motion remains monitor-only.",
    "EP03-continuity-Shot031-Shot032": "2026-08-23 sequential Shot031 v2 to Shot032 v2 handoff: Shot031 END leaves Rhea turned toward the altar, mature Seteth descending with the closed folio, and the muddy student group below. Shot032 START narrows to the three named authority/reaction figures without resetting the damp residue or changing female Byleth identity; motion remains monitor-only.",
    "EP03-continuity-Shot032-Shot033": "2026-08-23 sequential Shot032 v2 to Shot033 handoff: Shot032 END leaves the quiet order carried down the steps and female Byleth in an unsettled profile. Shot033 START may cut to the students' separate reactions, but must not replay Rhea's handoff or reintroduce the cathedral authority figures as foreground speakers; motion remains monitor-only.",
    "EP03-continuity-Shot033-Shot034": "2026-08-23 sequential Shot033 v1 to Shot034 handoff: Shot033 END closes the deep side door and turns female Byleth's eyeline toward the open right corridor. Shot034 START may introduce Catherine and Ashe in the side talk, but must not carry Dimitri or Felix into the frame or turn the corridor into another student lineup; motion remains monitor-only.",
    "EP03-continuity-Shot034-Shot035": "2026-08-23 sequential Shot034 v1 to Shot035 handoff: Shot034 END leaves Catherine and Ashe settled in the wet cloister with Thunderbrand sheathed and Ashe's bow lowered, while female Byleth turns into the open right corridor. Shot035 START may cut to Dimitri and female Byleth's night reflection, but must not carry Catherine or Ashe into the frame; preserve female Byleth and academy-era Dimitri identity, then widen the distance rather than replaying the side talk; motion remains monitor-only.",
  };
  for (const pair of continuity.pairs || []) {
    if (notes[pair.id]) {
      pair.decision = "monitor_required";
      pair.notes = notes[pair.id];
    }
  }
  write("production_system/continuity_manifest.json", continuity);
}

function updateArtifactAndReviewManifests() {
  const artifactPath = "production_system/artifact_manifest.json";
  const reviewPath = "production_system/review_manifest.json";
  const artifacts = read(artifactPath);
  const reviews = read(reviewPath);
  for (const config of shots) {
    const frames = makeFrames(config);
    const artifact = {
      id: `EP03-${config.id.toUpperCase()}-${config.slug.toUpperCase()}-2026-08-23`,
      type: "storyboard_frame_set",
      stage: "storyboard",
      status: "monitor_required",
      created_by: "independent-critical-reaudit-imagegen-agent",
      created_at: "2026-08-23",
      paths: [frames.start, frames.key, frames.end, `storyboards/${config.id}/${config.version}/contact_sheet.jpg`],
      source_refs: config.references,
      risk_flags: ["prompt_against_frame_qa_required", "motion_probe_required", "not_approved_for_video"],
      notes: config.finding,
    };
    const artifactIndex = (artifacts.artifacts || []).findIndex((item) => item.id === artifact.id);
    if (artifactIndex === -1) artifacts.artifacts.push(artifact);
    else artifacts.artifacts[artifactIndex] = artifact;
    const review = {
      artifact_id: artifact.id,
      review_id: `review-2026-08-23-${config.id.toLowerCase()}-${config.slug}`,
      reviewer_role: "independent-critical-reaudit-visual-qa-agent",
      reviewer: "codex",
      created_at: "2026-08-23",
      decision: "monitor_required",
      blocking_issues: ["Motion probe and prompt-against-frame QA are still required."],
      required_revisions: [config.required],
      rubric: {
        story_beat: "pass_in_still_frames",
        start_key_end_chain: "pass_in_still_frames",
        character_identity_readability: "pass_in_still_frames_monitor_in_motion",
        local_asset_traceability: "pass",
        video_readiness: "monitor_required",
      },
      reviewed_paths: artifact.paths,
    };
    const reviewIndex = (reviews.reviews || []).findIndex((item) => item.review_id === review.review_id);
    if (reviewIndex === -1) reviews.reviews.push(review);
    else reviews.reviews[reviewIndex] = review;
  }
  write(artifactPath, artifacts);
  write(reviewPath, reviews);
}

for (const config of shots) updateShotFiles(config);
updateContinuity();
updateArtifactAndReviewManifests();
console.log(JSON.stringify({ updated: shots.map((config) => ({ shot: config.id, version: config.version })) }, null, 2));

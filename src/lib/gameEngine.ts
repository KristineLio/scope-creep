import { FEATURES, HIDDEN, PACKS, type Feature } from "../data/features";
import { EVENTS, type GameEvent } from "../data/events";
import { ACHIEVEMENTS } from "../data/achievements";
import { mutateName, nameStage } from "./projectNaming";

export type Notice =
  | { kind: "first" }
  | { kind: "rec"; f: Feature }
  | { kind: "event"; ev: GameEvent }
  | { kind: "onemore" }
  | { kind: "reality" }
  | { kind: "launchCheckpoint"; stage: "mvp" };

export type Modal =
  | { kind: "agentic" }
  | { kind: "dark" }
  | { kind: "checklist" }
  | { kind: "confidence"; featureId: string; before: number; after: number; step: number }
  | { kind: "withdraw"; phase: "k8s" | "finale" }
  | null;

export const CONFIDENCE_STEPS = [72, 86, 93, 97, 99.1, 99.7, 99.93];

const CONFIDENCE_PICKS = ["analytics", "ai", "entpack", "scalepack", "mobile", "growth", "edash"];

export type GameState = {
  screen: "landing" | "dash" | "end";
  idea: string;
  features: string[];
  deps: number;
  debt: number;
  days: number;
  cost: number;
  stakeholders: number;
  agents: number;
  dashboards: number;
  decisions: number;
  notice: Notice | null;
  modal: Modal;
  toast: { title: string; sub: string } | null;
  achievements: string[];
  agenticDone: boolean;
  enterpriseDone: boolean;
  scaleDone: boolean;
  ending: "sensible" | "creep" | null;
  cascade: string[];
  launchConfidence: number;
  shipInterventions: number;
  confidenceUnlocked: boolean;
  vibesHint: boolean;
  recruitToast: string | null;
  sawMvpCheck: boolean;
  sawAgenticCheck: boolean;
  sawEnterpriseCheck: boolean;
  sawFinalWithdraw: boolean;
};

export const initialState = (): GameState => ({
  screen: "landing",
  idea: "A simple timer",
  features: [],
  deps: 0,
  debt: 0,
  days: 0,
  cost: 0,
  stakeholders: 0,
  agents: 0,
  dashboards: 0,
  decisions: 0,
  notice: null,
  modal: null,
  toast: null,
  achievements: [],
  agenticDone: false,
  enterpriseDone: false,
  scaleDone: false,
  ending: null,
  cascade: [],
  launchConfidence: 72,
  shipInterventions: 0,
  confidenceUnlocked: false,
  vibesHint: false,
  recruitToast: null,
  sawMvpCheck: false,
  sawAgenticCheck: false,
  sawEnterpriseCheck: false,
  sawFinalWithdraw: false,
});

export function shipLabel(days: number): string {
  if (days <= 0) return "Today";
  if (days <= 4) return "Friday";
  if (days <= 10) return "Next week";
  if (days <= 20) return "Next quarter";
  if (days <= 40) return "FY27";
  return "NEVER";
}

export function statusFor(s: GameState): { t: string; c: string } {
  if (s.features.length <= 1) return { t: "Actually shippable", c: "" };
  if (s.features.length <= 8) return { t: "Still shippable", c: "warn" };
  if (s.features.length < 22) return { t: "Fundraiseable", c: "bad" };
  return { t: "Series A ready", c: "red" };
}

export function canFinale(s: GameState): boolean {
  return s.agenticDone && s.enterpriseDone && s.scaleDone;
}

export function scamArcComplete(s: GameState): boolean {
  return s.agenticDone && s.enterpriseDone && s.scaleDone && s.sawFinalWithdraw && s.launchConfidence >= 99.93;
}

export function unrealizedValue(n: number): number {
  if (n <= 4) return 0;
  if (n <= 8) return 12000;
  if (n <= 12) return 180000;
  if (n <= 17) return 1400000;
  if (n <= 22) return 4200000;
  if (n <= 27) return 7800000;
  if (n <= 33) return 12600000;
  return 18420000;
}

export function euro(n: number): string {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `€${Math.round(n / 1000)}K`;
  return `€${n}`;
}

export function fomoLabel(s: GameState): string {
  if (s.shipInterventions >= 4) return "FOUNDER MODE";
  if (s.shipInterventions >= 3) return "CRITICAL";
  if (s.shipInterventions >= 2) return "HIGH";
  if (s.shipInterventions >= 1) return "ELEVATED";
  return "LOW";
}

const PRIMARY_TOASTS = new Set(["worse", "downline", "numup"]);

function unlock(s: GameState, id: keyof typeof ACHIEVEMENTS): GameState {
  if (s.achievements.includes(id)) return s;
  const a = ACHIEVEMENTS[id];
  const toast = PRIMARY_TOASTS.has(id) ? { title: a.title, sub: a.sub } : s.toast;
  return { ...s, achievements: [...s.achievements, id], toast };
}

export function applyFeature(s: GameState, id: string, countDecision: boolean): GameState {
  if (id === "core" || s.features.includes(id)) {
    return countDecision ? { ...s, decisions: s.decisions + 1 } : s;
  }
  const f = FEATURES.find((x) => x.id === id);
  if (!f) return s;
  let n: GameState = {
    ...s,
    features: [...s.features, id],
    deps: s.deps + f.deps,
    debt: s.debt + f.debt,
    days: s.days + f.days,
    cost: Math.max(s.cost, f.cost),
    agents: s.agents + (f.agent ? 1 : 0),
    dashboards: s.dashboards + (f.dashboard ? 1 : 0),
    stakeholders: Math.min(100, s.stakeholders + (s.features.length + 1 > 5 ? 8 : 4)),
    decisions: s.decisions + (countDecision ? 1 : 0),
    modal: countDecision ? null : s.modal,
  };
  if (n.features.filter((x) => x !== "core").length === 1) n = unlock(n, "worse");
  if (id === "analytics" || id === "prod") n = unlock(n, "ddd");
  if (id === "mon" || id === "mon2") n = unlock(n, "aoa");
  if (n.cost > 0) n = unlock(n, "prev");
  if (mutateName(n.idea, nameStage(n.features.length)).includes("Ecosystem")) n = unlock(n, "found");
  if (shipLabel(n.days) === "NEVER") n = unlock(n, "never");
  if (n.features.length > 12) n = unlock(n, "castle");
  if (id === "vibe") n = unlock(n, "omb");
  if (unrealizedValue(n.features.length) >= 12000) n = unlock(n, "numup");
  if (n.deps >= 10) n = unlock(n, "downline");
  return n;
}

export function nextBeat(s: GameState): GameState {
  if (s.features.length <= 1) return { ...s, notice: { kind: "first" } };
  if (!s.sawMvpCheck && s.features.filter((id) => id !== "core").length >= 1 && !s.agenticDone) {
    return { ...s, sawMvpCheck: true, notice: { kind: "launchCheckpoint", stage: "mvp" } };
  }
  if (s.features.includes("analytics") && !s.agenticDone) {
    return { ...s, modal: { kind: "agentic" }, notice: null };
  }
  if (s.agenticDone) {
    return {
      ...s,
      notice: {
        kind: "onemore",
      },
    };
  }
  const next = FEATURES.find((f) => !s.features.includes(f.id) && !HIDDEN.has(f.id) && !f.pack);
  if (next) return { ...s, notice: { kind: "rec", f: next } };
  return { ...s, notice: { kind: "launchCheckpoint", stage: "mvp" } };
}

export function addUserChoice(s: GameState, id: string): GameState {
  let n = applyFeature(s, id, true);
  const extras = PACKS[id] ?? [];
  n = { ...n, cascade: extras, recruitToast: extras.length ? `${FEATURES.find(f=>f.id===id)?.title ?? "Feature"} recruited ${extras.length} new features.` : null };
  if (id === "entpack") n = { ...n, enterpriseDone: true };
  if (id === "scalepack") n = { ...n, scaleDone: true };
  return nextBeat(n);
}

export function applySilent(s: GameState, id: string): GameState {
  return applyFeature(s, id, false);
}

export function formatConfidence(n: number): string {
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}%`;
}

export function pickConfidenceFeature(s: GameState): string {
  const ordered = [...CONFIDENCE_PICKS, ...FEATURES.filter((f) => !HIDDEN.has(f.id)).map((f) => f.id)];
  return ordered.find((id) => !s.features.includes(id) && id !== "core") ?? "ai";
}

export function beginShip(s: GameState): GameState {
  if (s.features.length <= 3 && s.decisions <= 2 && !s.features.includes("analytics") && !s.agenticDone) {
    return { ...s, ending: "sensible", screen: "end" };
  }
  if (s.agenticDone) {
    return {
      ...s,
      confidenceUnlocked: true,
      launchConfidence: Math.max(s.launchConfidence, 86),
      modal: { kind: "withdraw", phase: "k8s" },
    };
  }
  if (s.features.includes("analytics") && !s.agenticDone) {
    return {
      ...s,
      confidenceUnlocked: true,
      launchConfidence: Math.max(s.launchConfidence, 86),
      modal: { kind: "agentic" },
    };
  }
  return {
    ...s,
    confidenceUnlocked: true,
    vibesHint: true,
    launchConfidence: 72,
    modal: { kind: "confidence", featureId: "analytics", before: 72, after: 86, step: 0 },
  };
}

export function acceptConfidence(s: GameState): GameState {
  if (!s.modal || s.modal.kind !== "confidence") return s;
  const { featureId, after } = s.modal;
  let n: GameState = {
    ...s,
    launchConfidence: Math.min(after, 99.93),
    shipInterventions: s.shipInterventions + 1,
    modal: null,
    vibesHint: false,
  };
  n = addUserChoice(n, featureId);
  return n;
}

export function declineConfidence(s: GameState): GameState {
  if (!s.modal) return s;
  if (s.modal.kind === "confidence") {
    return { ...s, shipInterventions: s.shipInterventions + 1, modal: null, vibesHint: false };
  }
  if (s.modal.kind === "withdraw" && s.modal.phase === "finale") {
    return { ...s, ending: "creep", screen: "end", launchConfidence: 99.93, sawFinalWithdraw: true, modal: null };
  }
  if (s.modal.kind === "withdraw") {
    return { ...s, ending: "creep", screen: "end", launchConfidence: 99.93, sawFinalWithdraw: true, modal: null };
  }
  return { ...s, modal: null };
}

export function acceptWithdraw(s: GameState): GameState {
  if (!s.modal || s.modal.kind !== "withdraw") return s;
  if (s.modal.phase === "finale") {
    return { ...s, ending: "creep", screen: "end", launchConfidence: 99.93, sawFinalWithdraw: true, modal: null };
  }
  let n: GameState = {
    ...s,
    shipInterventions: s.shipInterventions + 1,
    launchConfidence: 99.93,
    days: Math.max(s.days, 50),
    sawFinalWithdraw: true,
    modal: { kind: "withdraw", phase: "finale" },
  };
  const extras = PACKS.scalepack.filter((id) => !n.features.includes(id));
  n = { ...n, cascade: extras };
  return n;
}

export function receiptText(s: GameState): string {
  return `SCOPE CREEP™ EXIT STATEMENT

Initial investment: One innocent idea
Portfolio value: ${euro(unrealizedValue(s.features.length))}
Liquid value: €0
Features accumulated: ${s.features.length}
Downline dependencies: ${s.deps}
Paying users: 0
Launch Confidence: 99.93%
Withdrawal status: FROZEN
Ship date: NEVER

YOU WERE THE EXIT LIQUIDITY.`;
}

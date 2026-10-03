import { FEATURES, HIDDEN, PACKS, personalizedIds, type Feature } from "../data/features";
import { EVENTS, type GameEvent } from "../data/events";
import { ACHIEVEMENTS } from "../data/achievements";
import { mutateName, nameStage } from "./projectNaming";

export type Notice =
  | { kind: "first" }
  | { kind: "rec"; f: Feature }
  | { kind: "event"; ev: GameEvent }
  | { kind: "onemore" }
  | { kind: "reality" };

export type Modal = { kind: "agentic" } | { kind: "dark" } | { kind: "checklist" } | null;

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
  return s.decisions >= 10 && s.features.length >= 28 && s.enterpriseDone && s.scaleDone && s.agenticDone && s.cost >= 9000;
}

function unlock(s: GameState, id: keyof typeof ACHIEVEMENTS): GameState {
  if (s.achievements.includes(id)) return s;
  const a = ACHIEVEMENTS[id];
  return { ...s, achievements: [...s.achievements, id], toast: { title: `🏆 ${a.title}`, sub: a.sub } };
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
    modal: null,
  };
  if (n.features.filter((x) => x !== "core").length === 1) n = unlock(n, "worse");
  if (id === "analytics" || id === "prod") n = unlock(n, "ddd");
  if (id === "mon" || id === "mon2") n = unlock(n, "aoa");
  if (n.cost > 0) n = unlock(n, "prev");
  if (mutateName(n.idea, nameStage(n.features.length)).includes("Ecosystem")) n = unlock(n, "found");
  if (shipLabel(n.days) === "NEVER") n = unlock(n, "never");
  if (n.features.length > 12) n = unlock(n, "castle");
  if (id === "vibe") n = unlock(n, "omb");
  return n;
}

export function nextBeat(s: GameState): GameState {
  if (canFinale(s)) return { ...s, notice: { kind: "reality" } };
  if (s.features.length <= 1) return { ...s, notice: { kind: "first" } };
  if (s.decisions >= 5 && !s.agenticDone) return { ...s, modal: { kind: "agentic" }, notice: s.notice };
  if (s.agenticDone && s.features.includes("orch") && !s.features.includes("mon")) {
    return { ...s, notice: { kind: "rec", f: FEATURES.find((f) => f.id === "mon")! } };
  }
  if (s.features.includes("mon") && !s.features.includes("mon2")) {
    return { ...s, notice: { kind: "rec", f: FEATURES.find((f) => f.id === "mon2")! } };
  }
  if (s.agenticDone && !s.enterpriseDone) {
    return { ...s, notice: { kind: "rec", f: FEATURES.find((f) => f.id === "entpack")! } };
  }
  if (s.enterpriseDone && !s.scaleDone) {
    return { ...s, notice: { kind: "rec", f: FEATURES.find((f) => f.id === "scalepack")! } };
  }
  const personal = personalizedIds(s.idea).find((id) => !s.features.includes(id));
  if (personal) {
    const f = FEATURES.find((x) => x.id === personal)!;
    return { ...s, notice: { kind: "rec", f } };
  }
  if (Math.random() < 0.22) {
    const pool = EVENTS.filter((e) => !e.rare || Math.random() < 0.15);
    const ev = pool[Math.floor(Math.random() * pool.length)];
    return { ...s, notice: { kind: "event", ev } };
  }
  const next = FEATURES.find((f) => !s.features.includes(f.id) && !HIDDEN.has(f.id) && !f.pack);
  if (next) return { ...s, notice: { kind: "rec", f: next } };
  if (canFinale(s)) return { ...s, notice: { kind: "reality" } };
  return { ...s, notice: { kind: "onemore" } };
}

export function addUserChoice(s: GameState, id: string): GameState {
  let n = applyFeature(s, id, true);
  const extras = PACKS[id] ?? [];
  n = { ...n, cascade: extras };
  if (id === "entpack") n = { ...n, enterpriseDone: true };
  if (id === "scalepack") n = { ...n, scaleDone: true };
  return nextBeat(n);
}

export function applySilent(s: GameState, id: string): GameState {
  return applyFeature(s, id, false);
}

export function receiptText(s: GameState): string {
  return `SCOPE CREEP™
I started building: ${s.idea}
I ended up building: ${mutateName(s.idea, 4)}
Original features: 1
Final features: ${s.features.length}
Dependencies: ${s.deps}
AI agents: ${s.agents}
Dashboards: ${s.dashboards}
Technical debt: ${s.debt}%
Infrastructure: €${s.cost}/mo
Users interviewed: 0
Paying users: 0
Original ship date: Today
Current ship date: ${shipLabel(s.days)}
You successfully avoided shipping.`;
}

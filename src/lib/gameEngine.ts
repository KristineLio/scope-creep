import { FEATURES, HIDDEN, type Feature } from "../data/features";
import { EVENTS, type GameEvent } from "../data/events";
import { ACHIEVEMENTS } from "../data/achievements";
import { mutateName, nameStage } from "./projectNaming";

export type Notice =
  | { kind: "first" }
  | { kind: "infra" }
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
  ending: "sensible" | "creep" | null;
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
  ending: null,
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
  if (s.features.length <= 5) return { t: "Still shippable", c: "warn" };
  if (s.features.length < 18) return { t: "Fundraiseable", c: "bad" };
  return { t: "Series A ready", c: "red" };
}

export function arch(n: number): string {
  if (n < 2) return "User → App";
  if (n < 6) return "User → Auth → API → Database";
  if (n < 12) return "User → CDN → Auth → API → Workers → Database → Analytics → Billing";
  if (n < 20) return "User → Gateway → Auth → 5 Agents → Orchestrator → API mesh → Warehouse → Dashboards";
  return "User → SSO → Mesh → Agents → Agents of agents → Kubernetes → Regions → CRM → Nobody remembers why this exists.";
}

function unlock(s: GameState, id: keyof typeof ACHIEVEMENTS): GameState {
  if (s.achievements.includes(id)) return s;
  const a = ACHIEVEMENTS[id];
  return { ...s, achievements: [...s.achievements, id], toast: { title: `🏆 ${a.title}`, sub: a.sub } };
}

export function nextBeat(s: GameState): GameState {
  const n = s.features.length;
  if (n === 1) return { ...s, notice: { kind: "first" } };
  if (!s.features.includes("auth") && s.features.includes("accounts")) return { ...s, notice: { kind: "infra" } };
  if (n >= 12 && !s.agenticDone) return { ...s, modal: { kind: "agentic" } };
  if (s.decisions >= 12) return { ...s, notice: { kind: "reality" } };
  if (Math.random() < 0.28) {
    const pool = EVENTS.filter((e) => !e.rare || Math.random() < 0.2);
    const ev = pool[Math.floor(Math.random() * pool.length)];
    return { ...s, notice: { kind: "event", ev } };
  }
  const next = FEATURES.find((f) => !s.features.includes(f.id) && !HIDDEN.has(f.id));
  if (next) return { ...s, notice: { kind: "rec", f: next } };
  return { ...s, notice: { kind: "reality" } };
}

export function addFeature(s: GameState, id: string): GameState {
  const f = FEATURES.find((x) => x.id === id);
  if (!f || s.features.includes(id)) return s;
  let n: GameState = {
    ...s,
    features: [...s.features, id],
    deps: s.deps + f.deps,
    debt: s.debt + f.debt,
    days: s.days + f.days,
    cost: Math.max(s.cost, f.cost),
    agents: s.agents + (f.agent ? 1 : 0),
    dashboards: s.dashboards + (f.dashboard ? 1 : 0),
    stakeholders: Math.min(100, s.stakeholders + (s.features.length + 1 > 5 ? 12 : 4)),
    decisions: s.decisions + 1,
    modal: null,
  };
  if (n.features.length === 2) n = unlock(n, "worse");
  if (id === "analytics") n = unlock(n, "ddd");
  if (id === "mon" || id === "mon2") n = unlock(n, "aoa");
  if (n.cost > 0) n = unlock(n, "prev");
  if (mutateName(n.idea, nameStage(n.features.length)).includes("Ecosystem")) n = unlock(n, "found");
  if (shipLabel(n.days) === "NEVER") n = unlock(n, "never");
  if (n.features.length > 8) n = unlock(n, "castle");
  if (id === "vibe") n = unlock(n, "omb");
  return nextBeat(n);
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

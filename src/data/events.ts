export type GameEvent = {
  t: string;
  q: string;
  cta: string;
  add: string | null;
  rare?: boolean;
};

export const EVENTS: GameEvent[] = [
  { t: "Investor feedback", q: "Needs more AI.", cta: "Add AI", add: "ai" },
  { t: "Customer feedback", q: "No customers were available for comment.", cta: "Proceed anyway", add: null },
  { t: "Engineering", q: "We strongly recommend not doing this.", cta: "Ignore engineering", add: null },
  { t: "Product team insight", q: "Users love dashboards.", cta: "Add dashboard", add: "analytics" },
  { t: "Market research", q: "People interviewed: 0. Feature requests implemented: a lot.", cta: "Ship the requests", add: null },
  { t: "Strategy update", q: "Our biggest competitor does this.", cta: "Copy strategically", add: null },
  { t: "Founder insight", q: "The problem isn't clear enough.", cta: "Add blockchain", add: "chain", rare: true },
  { t: "Office hours", q: "Have you considered rebuilding it in VibeFlow?", cta: "One more build", add: "vibe", rare: true },
  { t: "Ask later", q: "Ask ChatGPT whether this feature is necessary.", cta: "Ask later", add: null, rare: true },
  { t: "Hackathon", q: "Just one more feature before #builds.", cta: "One more", add: null, rare: true },
];

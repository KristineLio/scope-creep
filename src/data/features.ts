export type Feature = {
  id: string;
  title: string;
  copy: string;
  deps: number;
  debt: number;
  days: number;
  cost: number;
  agent?: boolean;
  dashboard?: boolean;
};

export const FEATURES: Feature[] = [
  { id: "accounts", title: "Accounts", copy: "Users will probably expect accounts.", deps: 4, debt: 7, days: 4, cost: 0 },
  { id: "auth", title: "Authentication", copy: "Accounts require a few basics.", deps: 3, debt: 6, days: 3, cost: 0 },
  { id: "db", title: "Database", copy: "We should persist something, eventually.", deps: 2, debt: 5, days: 2, cost: 49 },
  { id: "email", title: "Email verification", copy: "In case they exist.", deps: 2, debt: 4, days: 2, cost: 0 },
  { id: "reset", title: "Password reset", copy: "They will forget. We already have.", deps: 1, debt: 3, days: 1, cost: 0 },
  { id: "dark", title: "Dark mode", copy: "Are you sure you want to launch without dark mode?", deps: 1, debt: 2, days: 1, cost: 0 },
  { id: "sync", title: "Cloud sync", copy: "The product should live in the cloud.", deps: 3, debt: 6, days: 3, cost: 49 },
  { id: "notif", title: "Notifications", copy: "Remind them they still haven't shipped.", deps: 2, debt: 5, days: 2, cost: 0 },
  { id: "analytics", title: "Analytics", copy: "Users love dashboards.", deps: 3, debt: 8, days: 3, cost: 0, dashboard: true },
  { id: "billing", title: "Subscription billing", copy: "Monetize the zero users.", deps: 5, debt: 10, days: 7, cost: 320 },
  { id: "referral", title: "Referral program", copy: "Growth before product.", deps: 2, debt: 4, days: 3, cost: 0 },
  { id: "teams", title: "Team workspaces", copy: "Collaboration for a one-person idea.", deps: 4, debt: 9, days: 6, cost: 0 },
  { id: "admin", title: "Admin dashboard", copy: "Someone should be in charge of this.", deps: 3, debt: 7, days: 4, cost: 0, dashboard: true },
  { id: "api", title: "Public API", copy: "Partners will come. Any day now.", deps: 4, debt: 8, days: 5, cost: 0 },
  { id: "mobile", title: "Mobile app", copy: "Native, obviously.", deps: 6, debt: 12, days: 14, cost: 0 },
  { id: "i18n", title: "Localization", copy: "Ship globally. Speak to nobody.", deps: 2, debt: 5, days: 6, cost: 0 },
  { id: "share", title: "Social sharing", copy: "Virality is a feature.", deps: 2, debt: 4, days: 2, cost: 0 },
  { id: "game", title: "Gamification", copy: "Points for not shipping.", deps: 3, debt: 6, days: 4, cost: 0 },
  { id: "growth", title: "Growth analytics", copy: "Measure the absence of traction.", deps: 2, debt: 5, days: 3, cost: 0, dashboard: true },
  { id: "ragents", title: "Research Agent", copy: "Make it agentic.", deps: 2, debt: 8, days: 3, cost: 0, agent: true },
  { id: "pagent", title: "Planning Agent", copy: "An agent to plan the agents.", deps: 2, debt: 8, days: 3, cost: 0, agent: true },
  { id: "pers", title: "Personalization Agent", copy: "Personalized for no one.", deps: 2, debt: 7, days: 3, cost: 0, agent: true },
  { id: "aagent", title: "Analytics Agent", copy: "An agent watching empty charts.", deps: 2, debt: 7, days: 3, cost: 0, agent: true },
  { id: "sagent", title: "Support Agent", copy: "Support for users we don't have.", deps: 2, debt: 7, days: 3, cost: 0, agent: true },
  { id: "orch", title: "Agent Orchestrator", copy: "Your agents require coordination.", deps: 4, debt: 12, days: 5, cost: 2700, agent: true },
  { id: "mon", title: "Agent Monitoring Agent", copy: "Watch the watchers.", deps: 2, debt: 10, days: 4, cost: 0, agent: true },
  { id: "mon2", title: "Agent Monitoring Agent Monitoring Agent", copy: "Obviously.", deps: 2, debt: 11, days: 4, cost: 0, agent: true },
  { id: "sso", title: "Enterprise SSO", copy: "Nobody logs in, but correctly.", deps: 4, debt: 9, days: 8, cost: 9400 },
  { id: "audit", title: "Audit logs", copy: "A paper trail of indecision.", deps: 2, debt: 6, days: 4, cost: 0 },
  { id: "soc2", title: "SOC 2 readiness", copy: "Ready to be audited for shipping nothing.", deps: 5, debt: 10, days: 20, cost: 18420 },
  { id: "rbac", title: "Role-based permissions", copy: "Roles for a team of one.", deps: 3, debt: 7, days: 5, cost: 0 },
  { id: "multi", title: "Multi-region deployment", copy: "Latency to nowhere, worldwide.", deps: 6, debt: 14, days: 12, cost: 18420 },
  { id: "wh", title: "Data warehouse", copy: "Warehouse the unused events.", deps: 4, debt: 9, days: 8, cost: 2700 },
  { id: "k8s", title: "Kubernetes", copy: "Orchestrate the emptiness.", deps: 8, debt: 18, days: 14, cost: 9400 },
  { id: "idp", title: "Internal developer platform", copy: "A platform for the platform.", deps: 6, debt: 15, days: 16, cost: 18420 },
  { id: "crm", title: "Sales CRM integration", copy: "Pipeline: empty.", deps: 3, debt: 6, days: 5, cost: 320 },
  { id: "edash", title: "Enterprise dashboard", copy: "Another dashboard. Users love dashboards.", deps: 3, debt: 8, days: 4, cost: 0, dashboard: true },
  { id: "ai", title: "AI", copy: "Needs more AI.", deps: 4, debt: 12, days: 6, cost: 320 },
  { id: "chain", title: "Blockchain", copy: "The problem isn't clear enough.", deps: 9, debt: 22, days: 30, cost: 2700 },
  { id: "vibe", title: "Rebuild in VibeFlow", copy: "Have you considered rebuilding it in VibeFlow?", deps: 1, debt: 3, days: 1, cost: 0 },
];

export const HIDDEN = new Set([
  "ragents", "pagent", "pers", "aagent", "sagent", "orch", "mon", "mon2", "chain", "vibe",
]);

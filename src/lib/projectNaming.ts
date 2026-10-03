export function mutateName(idea: string, stage: number): string {
  const i = idea.toLowerCase();
  const map: { k: string[]; n: string[] }[] = [
    { k: ["timer", "time"], n: ["A timer", "Smart Timer", "AI Timer Pro", "Autonomous Time Intelligence Platform", "AI-Native Autonomous Collaborative Time Intelligence Ecosystem™"] },
    { k: ["todo", "task"], n: ["A todo app", "Smart Tasks", "AI Tasks Pro", "Autonomous Task Intelligence Platform", "AI-Native Autonomous Task Intelligence Ecosystem™"] },
    { k: ["weather"], n: ["A weather app", "Smart Weather", "AI Climate Pro", "Predictive Climate Intelligence Infrastructure", "Predictive Climate Intelligence Infrastructure Platform™"] },
    { k: ["calc"], n: ["A calculator", "Smart Numbers", "AI Calc Pro", "Autonomous Numerical Decision Engine", "Autonomous Numerical Decision Engine™"] },
    { k: ["landing", "page"], n: ["A landing page", "Smart Landing", "AI Acquisition Pro", "Customer Acquisition Experience", "AI-Optimized Customer Acquisition Experience Platform™"] },
    { k: ["habit"], n: ["A habit tracker", "Smart Habits", "AI Habits Pro", "Behavioral Intelligence Platform", "AI-Native Autonomous Habit Intelligence Ecosystem™"] },
  ];
  for (const m of map) if (m.k.some((x) => i.includes(x))) return m.n[Math.min(stage, 4)];
  const base = idea.trim() || "A project";
  const names = [base, `Smart ${base}`, `AI ${base} Pro`, `Autonomous ${base} Platform`, `AI-Native Autonomous ${base} Ecosystem™`];
  return names[Math.min(stage, 4)];
}

export function nameStage(featureCount: number): number {
  if (featureCount < 3) return 0;
  if (featureCount < 8) return 1;
  if (featureCount < 14) return 2;
  if (featureCount < 22) return 3;
  return 4;
}

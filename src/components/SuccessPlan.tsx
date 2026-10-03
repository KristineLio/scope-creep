import type { GameState } from "../lib/gameEngine";

const PCT = [12, 24, 41, 58, 74, 89, 98];

const HEADLINES = [
  "Strong start. Monetization is practically inevitable.",
  "Strong start. Monetization is practically inevitable.",
  "Great work! You’re one step closer to your perfect app.",
  "Excellent momentum. Your feature network is growing.",
  "Amazing. You’re entering the automation economy.",
  "Enterprise potential detected.",
  "You’re 98% done. Do not ruin this by shipping early.",
];

export default function SuccessPlan({ s }: { s: GameState }) {
  const rows = [
    { done: s.features.includes("accounts"), label: "Create accounts", ok: "Great start. Real products have logins.", no: "Users may exist eventually.", critical: false },
    { done: s.features.includes("analytics"), label: "Add Analytics", ok: "Excellent. Data is basically revenue.", no: "How will you measure zero users?", critical: false },
    { done: s.deps >= 10, label: "Build your feature network", ok: "Organic growth detected.", no: "Your features need a downline.", critical: false },
    { done: s.agenticDone, label: "Add AI", ok: "Amazing. Valuation potential increased.", no: "Investors may ask where the AI is.", critical: false },
    { done: s.enterpriseDone, label: "Become enterprise-ready", ok: "B2B revenue is practically inevitable.", no: "Prepare for customers you do not have.", critical: false },
    { done: s.features.includes("k8s"), label: "Add Kubernetes", ok: "Professional infrastructure detected.", no: "Serious apps have clusters.", critical: false },
    { done: false, label: "Earn €1", ok: "", no: "Not yet.", critical: true },
    { done: false, label: "Ship the app", ok: "", no: "Not recommended yet.", critical: true },
  ];
  const tech = rows.slice(0, 6).filter((r) => r.done).length;
  const pct = PCT[tech];
  return (
    <div className="card success-plan">
      <div className="plan-head">
        <label>Your Success Plan™</label>
        <span className="plan-pct">{pct}% COMPLETE</span>
      </div>
      <p className="whisper plan-line">{HEADLINES[tech]}</p>
      <div className="conf-track plan-bar" aria-hidden="true">
        <div className="conf-fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="plan-list">
        {rows.map((r) => (
          <li key={r.label} className={`${r.done ? "done" : "open"} ${r.critical ? "critical" : ""}`}>
            <span className="mark" aria-hidden="true">{r.done ? "✓" : "○"}</span>
            <div>
              <strong>{r.label}</strong>
              <p className="whisper">{r.done ? r.ok : r.no}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

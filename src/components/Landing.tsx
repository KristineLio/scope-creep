import { useState } from "react";

const CHIPS = ["Todo app", "Weather app", "Landing page", "Habit tracker", "Calculator"];

export default function Landing({ idea, onStart }: { idea: string; onStart: (v: string) => void }) {
  const [v, setV] = useState(idea);
  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">SCOPE CREEP™</div>
        <div className="badge">Pre-revenue technology</div>
      </header>
      <section className="hero">
        <h1>
          Ship your idea.
          <br />
          <em>Eventually.</em>
        </h1>
        <p className="sub">
          Tell us what you're building. We'll recommend only what's <strong>absolutely essential</strong>.
        </p>
        <div className="input-row">
          <input aria-label="Project idea" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onStart(v.trim() || idea)} />
          <button className="cta" onClick={() => onStart(v.trim() || idea)}>
            Help me ship it →
          </button>
        </div>
        <div className="chips">
          {CHIPS.map((c) => (
            <button key={c} className="chip" onClick={() => setV(c)}>
              {c}
            </button>
          ))}
        </div>
        <p className="whisper">No unnecessary features. Probably.</p>
      </section>
    </div>
  );
}

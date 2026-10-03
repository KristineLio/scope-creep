import { mutateName } from "../lib/projectNaming";
import { shipLabel, type GameState } from "../lib/gameEngine";

export default function Receipt({ s, onRestart, onCopy }: { s: GameState; onRestart: () => void; onCopy: () => void }) {
  if (s.ending === "sensible") {
    return (
      <div className="wrap">
        <div className="receipt">
          <div className="tiny">SCOPE CREEP™</div>
          <h1>WAIT.</h1>
          <p>You actually shipped it?</p>
          <p className="whisper">This outcome was not included in our projections.</p>
          <div className="rgrid">
            <div>Features</div><div>{s.features.length}</div>
            <div>Users</div><div>potentially some someday</div>
            <div>Technical debt</div><div>manageable</div>
            <div>Ship date</div><div>today</div>
          </div>
          <p>🏆 UNEXPECTEDLY SENSIBLE</p>
          <div className="row-btns" style={{ marginTop: 16 }}>
            <button className="primary" onClick={onRestart}>Try again and make worse decisions</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="wrap">
      <div className="receipt">
        <div className="tiny">SCOPE CREEP™</div>
        <p className="whisper">I started building:</p>
        <h1>{s.idea}</h1>
        <p className="whisper" style={{ marginTop: 12 }}>I ended up building:</p>
        <h1>{mutateName(s.idea, 4)}</h1>
        <div className="rgrid">
          <div>Original features</div><div>1</div>
          <div>Final features</div><div>{s.features.length}</div>
          <div>Dependencies</div><div>{s.deps}</div>
          <div>AI agents</div><div>{s.agents}</div>
          <div>Dashboards</div><div>{s.dashboards}</div>
          <div>Technical debt</div><div>{s.debt}%</div>
          <div>Infrastructure</div><div>€{s.cost}/mo</div>
          <div>Users interviewed</div><div>0</div>
          <div>Paying users</div><div>0</div>
          <div>Original ship date</div><div>Today</div>
        </div>
        <p>Current ship date</p>
        <div className="never">{shipLabel(s.days)}</div>
        <p style={{ marginTop: 12 }}>You successfully avoided shipping.</p>
        <p className="whisper">scope creep achieved ✓</p>
        <div className="row-btns" style={{ marginTop: 16 }}>
          <button className="primary" onClick={onRestart}>Try another innocent idea</button>
          <button className="ghost" onClick={onCopy}>Copy my result</button>
        </div>
      </div>
    </div>
  );
}

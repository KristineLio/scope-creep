import { FEATURES } from "../data/features";
import { canFinale, type GameState } from "../lib/gameEngine";
import ArchMap from "./ArchMap";
import Metric from "./Metric";

type Props = {
  s: GameState;
  st: { t: string; c: string };
  extra: boolean;
  late: boolean;
  productName: string;
  shipDate: string;
  nextId: string;
  onAdd: (id: string) => void;
  onSkip: (id: string) => void;
  onShip: () => void;
  onYesAgent: () => void;
  onNoAgent: () => void;
  onIrresponsible: () => void;
  onReality: () => void;
  onEvent: () => void;
};

export default function Dashboard(p: Props) {
  const { s } = p;
  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">SCOPE CREEP™</div>
        <div className="badge">{p.productName}</div>
      </header>
      <p className="whisper">{s.features.length <= 1 ? "Your project is refreshingly simple." : "Your project is gaining momentum."}</p>
      <div className="status">
        <span className={`dot ${p.st.c}`} /> {p.st.t}
      </div>
      <div className="metrics">
        <Metric label="Features" value={s.features.length} />
        <Metric label="Dependencies" value={s.deps} />
        <Metric label="Technical debt" value={`${s.debt}%`} />
        <Metric label="Users interviewed" value={0} />
        <Metric label="Estimated ship date" value={p.shipDate} />
        {p.extra && (
          <>
            <Metric label="Stakeholder expectations" value={`${s.stakeholders}%`} />
            <Metric label="Paying users" value={0} />
          </>
        )}
        {p.late && (
          <>
            <Metric label="Monthly infrastructure" value={`€${s.cost}`} />
            <Metric label="AI agents" value={s.agents} />
            <Metric label="Meetings scheduled" value={Math.max(0, s.features.length * 2 - 4)} />
          </>
        )}
      </div>
      <div className="layout">
        <div>
          <Notice {...p} />
          <button className="ship" onClick={p.onShip}>
            {s.features.length > 10 ? "Ship after one more feature" : "Ship Now"}
          </button>
        </div>
        <div>
          <div className="card">
            <label>Roadmap</label>
            <ul className="feat-list">
              {s.features.map((id) => (
                <li key={id} className={s.cascade.includes(id) || id === s.features[s.features.length - 1] ? "pop" : ""}>
                  {id === "core" ? s.idea : FEATURES.find((f) => f.id === id)?.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ marginTop: 10 }}>
            <ArchMap count={s.features.length} />
          </div>
        </div>
      </div>
      {s.modal && <Modal {...p} />}
      {s.toast && (
        <div className="toast" role="status">
          <strong>{s.toast.title}</strong>
          <div className="whisper">{s.toast.sub}</div>
        </div>
      )}
    </div>
  );
}

function Notice(p: Props) {
  const n = p.s.notice;
  if (!n) return <div className="notice"><h3>Still technically possible.</h3><p className="quote">Add something essential, or pretend you will ship.</p></div>;
  if (n.kind === "first") return (
    <div className="notice">
      <h3>One tiny thing…</h3>
      <p className="quote">Users will probably expect accounts.</p>
      <div className="row-btns">
        <button className="primary" onClick={() => p.onAdd("accounts")}>+ Add accounts</button>
        <button className="ghost" onClick={() => p.onSkip("accounts")}>Ship without it</button>
      </div>
    </div>
  );
  if (n.kind === "rec") return (
    <div className="notice">
      <h3>{n.f.title}</h3>
      <p className="quote">{n.f.copy}</p>
      <div className="row-btns">
        <button className="primary" onClick={() => p.onAdd(n.f.id)}>Add {n.f.title}</button>
        <button className="ghost" onClick={() => p.onSkip(n.f.id)}>Maybe later</button>
      </div>
    </div>
  );
  if (n.kind === "event") return (
    <div className="notice">
      <h3>{n.ev.t}</h3>
      <p className="quote">{n.ev.q}</p>
      <div className="row-btns"><button className="primary" onClick={p.onEvent}>{n.ev.cta}</button></div>
    </div>
  );
  if (n.kind === "onemore") return (
    <div className="notice">
      <h3>Ship after one more feature</h3>
      <p className="quote">Just one more. Then we launch. We mean it.</p>
      <div className="row-btns"><button className="primary" onClick={() => p.onAdd(p.nextId)}>Add one more</button></div>
    </div>
  );
  return (
    <div className="notice">
      <h3>Accept reality</h3>
      <p className="quote">The planning horizon has left the building.</p>
      <div className="row-btns"><button className="primary" onClick={p.onReality} disabled={!canFinale(p.s)}>Accept reality</button></div>
    </div>
  );
}

function Modal(p: Props) {
  const m = p.s.modal;
  if (m?.kind === "agentic") return (
    <div className="overlay">
      <div className="modal-card">
        <p className="whisper">Your product is good.</p>
        <h2>But have you considered making it agentic?</h2>
        <div className="row-btns">
          <button className="primary" onClick={p.onYesAgent}>✨ MAKE IT AGENTIC</button>
          <button className="ghost" onClick={p.onNoAgent}>Absolutely not</button>
        </div>
      </div>
    </div>
  );
  if (m?.kind === "dark") return (
    <div className="overlay">
      <div className="modal-card">
        <h2>Are you sure you want to launch without dark mode?</h2>
        <div className="row-btns">
          <button className="primary" onClick={() => p.onAdd("dark")}>Add dark mode</button>
          <button className="ghost" onClick={p.onIrresponsible}>Ship irresponsibly</button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="overlay">
      <div className="modal-card">
        <h2>PRE-LAUNCH CHECKLIST</h2>
        <p className="quote">✅ Logo<br />✅ Analytics<br />✅ AI<br />✅ Enterprise auth<br />✅ Mobile roadmap<br />✅ Agent orchestration<br />✅ SOC 2 planning<br />❌ Talk to one user</p>
        <div className="row-btns">
          <button className="ghost" disabled>Talk to one user</button>
          <button className="primary" onClick={p.onReality} disabled={!canFinale(p.s)}>Accept reality</button>
        </div>
      </div>
    </div>
  );
}

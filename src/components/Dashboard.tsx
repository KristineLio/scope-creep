import { FEATURES } from "../data/features";
import { euro, formatConfidence, unrealizedValue, type GameState } from "../lib/gameEngine";
import ArchMap from "./ArchMap";
import Metric from "./Metric";
import SuccessPlan from "./SuccessPlan";

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
  onAcceptConfidence: () => void;
  onDeclineConfidence: () => void;
  onAcceptWithdraw: () => void;
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
        <Metric label="Launch Confidence" value={s.confidenceUnlocked ? formatConfidence(s.launchConfidence) : "—"} />
        <Metric label="Portfolio Value" value={euro(unrealizedValue(s.features.length))} />
        <Metric label="Realized Revenue" value="€0" />
        <Metric label="Ship Date" value={p.shipDate} />
      </div>
      <div className="layout">
        <div>
          <Notice {...p} />
          <button className="ship" onClick={p.onShip}>Ship Now</button>
        </div>
        <div>
          <SuccessPlan s={s} />
          <div className="card" style={{ marginTop: 10 }}>
            <ArchMap count={s.features.length} deps={s.deps} />
          </div>
        </div>
      </div>
      {s.modal && <Modal {...p} />}

      <div className="toast-stack">
        {s.recruitToast && (
          <div className="toast" role="status">
            <strong>Great work!</strong>
            <div className="whisper">{s.recruitToast}</div>
          </div>
        )}
        {s.toast && (
          <div className="toast" role="status">
            <strong>{s.toast.title}</strong>
            <div className="whisper">{s.toast.sub}</div>
          </div>
        )}
      </div>
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
        <button className="ghost" onClick={p.onShip}>Ship without it</button>
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
  if (n.kind === "launchCheckpoint") {
    return (
      <div className="notice">
        <h3>Your MVP is ready.</h3>
        <p className="quote">Against all odds, this still resembles a product.</p>
        <div className="row-btns"><button className="primary" onClick={p.onShip}>Ship Now</button></div>
        <p className="whisper">Recommended before anyone adds AI.</p>
      </div>
    );
  }
  if (n.kind === "onemore") return (
    <div className="notice">
      <h3>Everything is performing beautifully except the part where you actually ship.</h3>
      <p className="quote">Portfolio value {euro(unrealizedValue(p.s.features.length))}. Realized revenue: €0.</p>
      <div className="row-btns"><button className="primary" onClick={p.onShip}>Ship Now</button></div>
    </div>
  );
  return (
    <div className="notice">
      <h3>Accept reality</h3>
      <p className="quote">The planning horizon has left the building.</p>
      <div className="row-btns"><button className="primary" onClick={p.onReality}>Accept reality</button></div>
    </div>
  );
}

function Modal(p: Props) {
  const m = p.s.modal;
  if (m?.kind === "confidence") return <ConfidenceModal p={p} />;
  if (m?.kind === "withdraw") return <WithdrawModal p={p} />;
  if (m?.kind === "agentic") return (
    <div className="overlay">
      <div className="modal-card">
        <p className="whisper">Your product is good.</p>
        <h2>But have you considered making it agentic?</h2>
        <div className="row-btns">
          <button className="primary" onClick={p.onNoAgent}>No. Ship it.</button>
          <button className="ghost" onClick={p.onYesAgent}>✨ Fine, make it agentic</button>
        </div>
        <p className="whisper">*Your feedback is important to us and will be ignored where appropriate.</p>
      </div>
    </div>
  );
  return null;
}

function ConfidenceModal({ p }: { p: Props }) {
  const m = p.s.modal;
  if (!m || m.kind !== "confidence") return null;
  return (
    <div className="overlay">
      <div className="modal-card">
        <p className="whisper">Your launch is almost ready.</p>
        <h2>Launch Confidence 72%</h2>
        <p className="quote">Adding Analytics could improve projected launch confidence to:</p>
        <div className="v" style={{ fontSize: 32, marginBottom: 12 }}>86%</div>
        <div className="row-btns">
          <button className="primary" onClick={p.onDeclineConfidence}>Ship at 72% anyway</button>
          <button className="ghost" onClick={p.onAcceptConfidence}>Fine, add Analytics</button>
        </div>
        <p className="whisper">*No founders were interviewed.</p>
        <p className="whisper">*Shipping may expose projections to actual users.</p>
      </div>
    </div>
  );
}

function WithdrawModal({ p }: { p: Props }) {
  const m = p.s.modal;
  if (!m || m.kind !== "withdraw") return null;
  if (m.phase === "finale") {
    return (
      <div className="overlay">
        <div className="modal-card">
          <h2>Launch Confidence 99.93%</h2>
          <p className="quote">Everything is performing beautifully except the part where you actually ship.</p>
          <div className="row-btns">
            <button className="primary" onClick={p.onDeclineConfidence}>Withdraw anyway</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overlay">
      <div className="modal-card">
        <h2>Withdrawal temporarily restricted</h2>
        <p className="quote">Your project is ready to ship, but one final infrastructure verification is required.</p>
        <p className="quote">Required shipping gas fee:</p>
        <div className="v" style={{ fontSize: 28, marginBottom: 12 }}>1 Kubernetes cluster</div>
        <div className="row-btns">
          <button className="primary" onClick={p.onAcceptWithdraw}>Pay in infrastructure →</button>
          <button className="ghost" onClick={p.onDeclineConfidence}>Withdraw project anyway</button>
        </div>
        <p className="whisper">No actual currency is involved. Only your remaining free time.</p>
      </div>
    </div>
  );
}

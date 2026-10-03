import { FEATURES } from "../data/features";
import { euro, fomoLabel, formatConfidence, unrealizedValue, type GameState } from "../lib/gameEngine";
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
        {p.extra && (
          <div className="card">
            <label>Unrealized Product Value</label>
            <div className="v">{euro(unrealizedValue(s.features.length))}</div>
            <label>Realized Revenue</label>
            <div className="v">€0</div>
            <p className="whisper">Fundamentals remain optional.</p>
          </div>
        )}
        {p.late && (
          <div className="card">
            <label>ScopeCoin™ Market Cap</label>
            <div className="v">{euro(Math.max(unrealizedValue(s.features.length), 180000))}</div>
            <p className="whisper">Circulating product 0 · Shipping liquidity LOW</p>
            <p className="whisper">Backed by features. Mostly features.</p>
          </div>
        )}
        {s.confidenceUnlocked && (
          <div className="card">
            <label>Launch Confidence</label>
            <div className="v">{formatConfidence(s.launchConfidence)}</div>
            <div className="conf-track" aria-hidden="true">
              <div className="conf-fill" style={{ width: `${Math.min(s.launchConfidence, 99.93)}%` }} />
            </div>
            {s.vibesHint && <p className="whisper">Powered by proprietary vibes</p>}
            <p className="whisper">FOMO {fomoLabel(s)}</p>
          </div>
        )}
      </div>
      <div className="layout">
        <div>
          <Notice {...p} />
          <button className="ship" onClick={p.onShip}>Ship Now</button>
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
            <ArchMap count={s.features.length} deps={s.deps} />
          </div>
        </div>
      </div>
      {s.modal && <Modal {...p} />}
      {p.late && (
        <div className="card" style={{ marginTop: 12 }}>
          <p className="quote">“My project has never shipped, but the valuation speaks for itself.”</p>
          <p className="whisper">— Founder #1847 · Trending in Pre-Revenue</p>
          <p className="whisper">12,481 founders are currently not shipping. *Sample size unavailable.</p>
        </div>
      )}
      {s.recruitToast && (
        <div className="toast" role="status">
          <strong>Congratulations!</strong>
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
      <h3>Still technically possible.</h3>
      <p className="quote">The launch window remains open. Probably.</p>
      <div className="row-btns"><button className="primary" onClick={() => p.onAdd(p.nextId)}>Add {FEATURES.find(f=>f.id===p.nextId)?.title ?? "one more"}</button></div>
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
          <button className="primary" onClick={p.onReality}>Accept reality</button>
        </div>
      </div>
    </div>
  );
}

function ConfidenceModal({ p }: { p: Props }) {
  const m = p.s.modal;
  if (!m || m.kind !== "confidence") return null;
  const feat = FEATURES.find((f) => f.id === m.featureId);
  const name = feat?.title ?? "one more feature";
  const copy = copies[Math.min(m.step, copies.length - 1)];
  const late = m.before >= 99.7;
  return (
    <div className="overlay">
      <div className="modal-card">
        {late ? (
          <>
            <p className="whisper">Launch Confidence: {formatConfidence(m.before)}</p>
            <h2>You're statistically almost ready.</h2>
            <p className="quote">But are you really willing to risk everything over 0.07%?</p>
          </>
        ) : (
          <>
            <p className="whisper">{copy.headline}</p>
            <h2>Launch Confidence {formatConfidence(m.before)}</h2>
            <p className="quote">{copy.body.replace("FEATURE", name)} {formatConfidence(m.after)}</p>
          </>
        )}
        <div className="conf-track" aria-hidden="true">
          <div className="conf-fill" style={{ width: `${Math.min(m.before, 99.93)}%` }} />
        </div>
        <div className="row-btns" style={{ marginTop: 14 }}>
          <button className="primary" onClick={p.onAcceptConfidence}>{late ? "Add one final safeguard" : copy.primary}</button>
          <button className="ghost" onClick={p.onDeclineConfidence}>{late ? "Yes. Ship the damn thing." : `${copy.secondary} ${formatConfidence(m.before)}`}</button>
        </div>
        <p className="whisper">{copy.note}</p>
      </div>
    </div>
  );
}

function WithdrawModal({ p }: { p: Props }) {
  const m = p.s.modal;
  if (!m || m.kind !== "withdraw") return null;
  const name = FEATURES.find((f) => f.id === m.featureId)?.title ?? "one feature";
  const variants = [
    { h: "Withdrawal temporarily restricted", q: `Your project requires one final verification step. To unlock shipping: Add ${name}`, p: "Verify and continue →", s: "Proceed with limited protection", n: "Shipping eligibility may vary by scope." },
    { h: "Network congestion detected", q: "Your project is ready to ship, but current infrastructure conditions are suboptimal. Required shipping gas fee: 1 Kubernetes cluster", p: "Pay in infrastructure →", s: "Attempt low-fee shipping", n: "No actual currency is involved. Only your remaining free time." },
    { h: "Your account is 99.7% verified", q: `Deposit one final feature to unlock your launch. Recommended: ${name}`, p: "Complete verification →", s: "Withdraw project anyway", n: "Launch Confidence is not financial advice." },
    { h: "Shipping liquidity is temporarily unavailable", q: `Launch Confidence 99.93%. Unrealized value looks excellent. Realized revenue: €0. Everything is performing beautifully except the part where you actually ship.`, p: "Add one final safeguard", s: "Withdraw anyway", n: "Past feature additions do not guarantee future shipping." },
  ];
  const v = variants[m.variant];
  return (
    <div className="overlay">
      <div className="modal-card">
        <h2>{v.h}</h2>
        <p className="quote">{v.q}</p>
        <div className="row-btns">
          <button className="primary" onClick={p.onAcceptWithdraw}>{v.p}</button>
          <button className="ghost" onClick={p.onDeclineConfidence}>{v.s}</button>
        </div>
        <p className="whisper">{v.n}</p>
      </div>
    </div>
  );
}

const copies = [
  { headline: "Your launch is almost ready.", body: "Adding FEATURE could improve projected launch confidence to", primary: "Increase my odds →", secondary: "Ship at", note: "*No founders were interviewed." },
  { headline: "Strong momentum detected.", body: "Top-performing products usually add FEATURE before launch. Projected upside:", primary: "Protect my upside →", secondary: "Ship at", note: "Past feature additions do not guarantee future shipping." },
  { headline: "High-conviction feature detected.", body: "FEATURE could materially de-risk your launch. Elite launch readiness:", primary: "De-risk my launch →", secondary: "Accept unnecessary risk ·", note: "Your scope may go up as well as up." },
  { headline: "You're extremely close.", body: "FEATURE could move you into elite launch-readiness territory:", primary: "Increase launch confidence →", secondary: "Ship recklessly ·", note: "0 paying users were consulted." },
  { headline: "Why gamble with the remaining 0.9%?", body: "FEATURE is a high-conviction downside hedge. Projected confidence:", primary: "Protect the downside →", secondary: "I understand the risk ·", note: "Launch Confidence is not financial advice." },
  { headline: "Final optimization detected.", body: "FEATURE could be the difference between shipping and a cautionary LinkedIn post:", primary: "One final safeguard →", secondary: "Ship anyway ·", note: "Results based on proprietary vibes." },
];

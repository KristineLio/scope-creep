import { useEffect, useState } from "react";
import { FEATURES } from "./data/features";
import {
  addFeature,
  arch,
  initialState,
  nextBeat,
  receiptText,
  shipLabel,
  statusFor,
  type GameState,
} from "./lib/gameEngine";
import { mutateName, nameStage } from "./lib/projectNaming";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Receipt from "./components/Receipt";

export default function App() {
  const [s, setS] = useState<GameState>(initialState);

  useEffect(() => {
    if (!s.toast) return;
    const t = setTimeout(() => setS((x) => ({ ...x, toast: null })), 2800);
    return () => clearTimeout(t);
  }, [s.toast]);

  function start(idea: string) {
    setS({
      ...initialState(),
      idea,
      screen: "dash",
      features: ["core"],
      notice: { kind: "first" },
    });
  }

  function onAdd(id: string) {
    setS((x) => addFeature(x, id));
  }

  function skip(id: string) {
    setS((x) => {
      if (Math.random() < 0.45) {
        return { ...x, toast: { title: "Added to the roadmap anyway.", sub: "Great feedback." } };
      }
      return nextBeat(x);
    });
    setTimeout(() => {
      setS((x) => (x.toast?.title.includes("anyway") ? addFeature(x, id) : x));
    }, 600);
  }

  function infra() {
    setS((x) => {
      let n = x;
      for (const id of ["auth", "db", "email", "reset"]) n = addFeature(n, id);
      return n;
    });
  }

  function ship() {
    setS((x) => {
      const n = x.features.length;
      if (n <= 3) return { ...x, ending: "sensible", screen: "end" };
      if (n < 8) return { ...x, modal: { kind: "dark" } };
      if (n < 18) return { ...x, notice: { kind: "onemore" } };
      return { ...x, modal: { kind: "checklist" } };
    });
  }

  function yesAgent() {
    setS((x) => {
      let n: GameState = { ...x, agenticDone: true, modal: null };
      for (const id of ["ragents", "pagent", "pers", "aagent", "sagent"]) n = addFeature(n, id);
      n = { ...n, toast: { title: "Your agents require coordination.", sub: "" } };
      return n;
    });
    setTimeout(() => setS((x) => addFeature(x, "orch")), 500);
  }

  function noAgent() {
    setS((x) => ({ ...x, toast: { title: "Great feedback.", sub: "We've added it to the roadmap." } }));
    setTimeout(() => {
      setS((x) => {
        let n: GameState = { ...x, agenticDone: true, modal: null };
        for (const id of ["ragents", "pagent", "pers", "aagent", "sagent"]) n = addFeature(n, id);
        return n;
      });
    }, 700);
  }

  if (s.screen === "landing") return <Landing idea={s.idea} onStart={start} />;
  if (s.screen === "end") {
    return (
      <Receipt
        s={s}
        onRestart={() => setS(initialState())}
        onCopy={() => navigator.clipboard.writeText(receiptText(s)).catch(() => {})}
      />
    );
  }

  const st = statusFor(s);
  const extra = s.features.length > 5;
  const late = s.features.length > 12;
  const nextId = FEATURES.find((f) => !s.features.includes(f.id))?.id ?? "ai";

  return (
    <Dashboard
      s={s}
      st={st}
      extra={extra}
      late={late}
      productName={mutateName(s.idea, nameStage(s.features.length))}
      shipDate={shipLabel(s.days)}
      architecture={arch(s.features.length)}
      nextId={nextId}
      onAdd={onAdd}
      onSkip={skip}
      onInfra={infra}
      onShip={ship}
      onYesAgent={yesAgent}
      onNoAgent={noAgent}
      onIrresponsible={() => setS((x) => ({ ...x, modal: null, ending: "sensible", screen: "end" }))}
      onReality={() => setS((x) => ({ ...x, modal: null, ending: "creep", screen: "end" }))}
      onEvent={() => {
        const ev = s.notice && s.notice.kind === "event" ? s.notice.ev : null;
        if (ev?.add) onAdd(ev.add);
        else setS((x) => nextBeat(x));
      }}
    />
  );
}

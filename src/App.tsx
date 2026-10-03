import { useEffect, useState } from "react";
import { FEATURES, PACKS } from "./data/features";
import {
  addUserChoice,
  applySilent,
  canFinale,
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

  useEffect(() => {
    if (!s.cascade.length) return;
    const ids = [...s.cascade];
    setS((x) => ({ ...x, cascade: [] }));
    ids.forEach((id, i) => {
      setTimeout(() => setS((x) => applySilent(x, id)), 90 * (i + 1));
    });
  }, [s.cascade]);

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
    setS((x) => addUserChoice(x, id));
  }

  function skip(id: string) {
    setS((x) => {
      if (Math.random() < 0.4) {
        return { ...x, toast: { title: "Added to the roadmap anyway.", sub: "Great feedback." } };
      }
      return nextBeat({ ...x, decisions: x.decisions + 1 });
    });
    setTimeout(() => {
      setS((x) => (x.toast?.title.includes("anyway") ? addUserChoice(x, id) : x));
    }, 500);
  }

  function ship() {
    setS((x) => {
      const n = x.features.length;
      if (n <= 3 && x.decisions <= 2) return { ...x, ending: "sensible", screen: "end" };
      if (n < 10) return { ...x, modal: { kind: "dark" } };
      if (!canFinale(x)) return { ...x, notice: { kind: "onemore" } };
      return { ...x, modal: { kind: "checklist" } };
    });
  }

  function agentPack(force: boolean) {
    const run = (x: GameState) => {
      let n: GameState = { ...x, agenticDone: true, modal: null, decisions: x.decisions + 1 };
      const extras = PACKS.agentic;
      n = { ...n, cascade: extras, toast: { title: "Your agents require coordination.", sub: "" } };
      return n;
    };
    if (force) setS(run);
    else {
      setS((x) => ({ ...x, toast: { title: "Great feedback.", sub: "We've added it to the roadmap." } }));
      setTimeout(() => setS(run), 700);
    }
    setTimeout(() => setS((x) => applySilent(x, "orch")), 700);
  }

  if (s.screen === "landing") return <Landing idea={s.idea} onStart={start} />;
  if (s.screen === "end") {
    return <Receipt s={s} onRestart={() => setS(initialState())} />;
  }

  const st = statusFor(s);
  const extra = s.features.length > 5;
  const late = s.features.length > 12;
  const nextId = FEATURES.find((f) => !s.features.includes(f.id) && !f.pack)?.id ?? "ai";

  return (
    <Dashboard
      s={s}
      st={st}
      extra={extra}
      late={late}
      productName={mutateName(s.idea, nameStage(s.features.length))}
      shipDate={shipLabel(s.days)}
      nextId={nextId}
      onAdd={onAdd}
      onSkip={skip}
      onShip={ship}
      onYesAgent={() => agentPack(true)}
      onNoAgent={() => agentPack(false)}
      onIrresponsible={() => setS((x) => ({ ...x, modal: null, ending: "sensible", screen: "end" }))}
      onReality={() => canFinale(s) && setS((x) => ({ ...x, modal: null, ending: "creep", screen: "end" }))}
      onEvent={() => {
        const ev = s.notice && s.notice.kind === "event" ? s.notice.ev : null;
        if (ev?.add) onAdd(ev.add);
        else setS((x) => nextBeat({ ...x, decisions: x.decisions + 1 }));
      }}
    />
  );
}

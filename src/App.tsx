import { useEffect, useState } from "react";
import { FEATURES, PACKS, personalizedIds } from "./data/features";
import {
  acceptConfidence,
  acceptWithdraw,
  addUserChoice,
  resistWithdraw,
  applySilent,
  beginShip,
  declineConfidence,
  initialState,
  nextBeat,
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
  const [scopeBurst, setScopeBurst] = useState(false);

  useEffect(() => {
    if (!s.toast) return;
    const t = setTimeout(() => setS((x) => ({ ...x, toast: null })), 2800);
    return () => clearTimeout(t);
  }, [s.toast]);

  useEffect(() => {
    if (!s.recruitToast) return;
    const t = setTimeout(() => setS((x) => ({ ...x, recruitToast: null })), 2300);
    return () => clearTimeout(t);
  }, [s.recruitToast]);

  useEffect(() => {
    if (!s.cascade.length) return;
    const ids = [...s.cascade];
    setS((x) => ({ ...x, cascade: [] }));
    const step = Math.max(180, Math.min(450, Math.floor(2200 / ids.length)));
    ids.forEach((id, i) => {
      setTimeout(() => setS((x) => applySilent(x, id)), step * (i + 1));
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
    setS((x) => ({
      ...x,
      toast: {
        title: "FEEDBACK RECEIVED",
        sub: "“Maybe later” has been interpreted as “yes.”",
      },
    }));
    setTimeout(() => {
      setS((x) => ({
        ...addUserChoice(x, id),
        toast: {
          title: "ROADMAP UPDATED",
          sub: "Great feedback. We added it anyway.",
        },
      }));
    }, 350);
  }

  function ship() {
    setS((x) => beginShip(x));
  }

  function agentPack(resisted = false) {
    setScopeBurst(true);
    setTimeout(() => setScopeBurst(false), 1600);
    setS((x) => {
      const personalized = personalizedIds(x.idea).filter((id) => !x.features.includes(id));
      const extras = [
        ...personalized,
        ...PACKS.agentic,
        ...PACKS.entpack,
        ...PACKS.scalepack.filter((id) => id !== "k8s"),
      ].filter((id, index, arr) => !x.features.includes(id) && arr.indexOf(id) === index);
      return {
        ...x,
        agenticDone: true,
        enterpriseDone: true,
        scaleDone: true,
        modal: null,
        decisions: x.decisions + 1,
        cascade: extras,
        launchConfidence: Math.max(x.launchConfidence, 86),
        notice: { kind: "onemore" },
        ...(resisted
          ? {
              toast: {
                title: "GREAT FEEDBACK",
                sub: "Absolutely noted. We made it agentic anyway.",
              },
            }
          : {}),
      };
    });
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
      scopeBurst={scopeBurst}
      st={st}
      extra={extra}
      late={late}
      productName={mutateName(s.idea, nameStage(s.features.length))}
      shipDate={shipLabel(s.days)}
      nextId={nextId}
      onAdd={onAdd}
      onSkip={skip}
      onShip={ship}
      onAcceptConfidence={() => setS((x) => acceptConfidence(x))}
      onDeclineConfidence={() => setS((x) => declineConfidence(x))}
      onAcceptWithdraw={() => setS((x) => acceptWithdraw(x))}
      onResistWithdraw={() => setS((x) => resistWithdraw(x))}
      onYesAgent={() => agentPack(false)}
      onNoAgent={() => agentPack(true)}
      onIrresponsible={() => setS((x) => ({ ...x, modal: null, ending: "sensible", screen: "end" }))}
      onReality={() => setS((x) => ({ ...x, modal: null, ending: "creep", screen: "end", launchConfidence: 99.93 }))}
      onEvent={() => {
        const ev = s.notice && s.notice.kind === "event" ? s.notice.ev : null;
        if (ev?.add) onAdd(ev.add);
        else setS((x) => nextBeat({ ...x, decisions: x.decisions + 1 }));
      }}
    />
  );
}

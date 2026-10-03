import { useState } from "react";
import { ideaPunchline, mutateName } from "../lib/projectNaming";
import { euro, formatConfidence, receiptText, shipLabel, unrealizedValue, type GameState } from "../lib/gameEngine";

export default function Receipt({ s, onRestart, onReplaySame }: { s: GameState; onRestart: () => void; onReplaySame: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(receiptText(s));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  function download() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f6f3ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#6b665c";
    ctx.font = "22px sans-serif";
    ctx.fillText("SCOPE CREEP™ EXIT STATEMENT", 64, 80);
    ctx.fillText("ONE TINY THING LATER…", 64, 115);
    ctx.fillStyle = "#141414";
    ctx.font = "28px serif";
    ctx.fillText("You asked us to help ship:", 64, 150);
    ctx.font = "bold 48px serif";
    wrap(ctx, s.idea, 64, 210, 950, 56);
    ctx.font = "28px serif";
    ctx.fillText(`We added ${s.features.length} features instead. It became:`, 64, 340);
    ctx.font = "bold 40px serif";
    wrap(ctx, mutateName(s.idea, 4), 64, 400, 950, 48);
    const rows: [string, string][] = [
      ["Portfolio value", euro(unrealizedValue(s.features.length))],
      ["Liquid value", "€0"],
      ["Features", String(s.features.length)],
      ["Downline", String(s.deps)],
      ["AI exposure", `${s.agents} agents`],
      ["Launch Confidence", formatConfidence(s.launchConfidence)],
      ["Resistance attempts", `${s.resistanceAttempts} / 4`],
      ["Launch status", "PREVENTED"],
      ["Ship date", "NEVER"],
    ];
    ctx.font = "28px sans-serif";
    rows.forEach((r, i) => {
      const y = 620 + i * 44;
      ctx.fillStyle = "#6b665c";
      ctx.fillText(r[0], 64, y);
      ctx.fillStyle = "#141414";
      ctx.fillText(r[1], 700, y);
    });
    ctx.font = "bold 64px serif";
    ctx.font = "bold 36px serif";
    ctx.font = "24px serif";
    ctx.fillText(s.resistanceAttempts >= 4 ? "YOU SAID NO FOUR TIMES. OUTCOME UNCHANGED." : "Replay challenge: say NO to everything. It will not help.", 64, 990);
    ctx.fillText("MISSION ACCOMPLISHED: SHIPPING PREVENTED.", 64, 1030);
    wrap(ctx, ideaPunchline(s.idea, s.features.length), 64, 1080, 950, 32);
    ctx.font = "bold 36px serif";
    ctx.fillText("YOU WERE THE EXIT LIQUIDITY.", 64, 1160);
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#6b665c";
    ctx.fillText("scope creep complete", 64, 1220);
    const a = document.createElement("a");
    a.download = "scope-creep-exit.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

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
      <div className="receipt" id="receipt-card">
        <div className="tiny">SCOPE CREEP™ EXIT STATEMENT</div>
        <p className="whisper">ONE TINY THING LATER…</p>
        <p className="whisper" style={{ marginTop: 12 }}>You asked us to help ship:</p>
        <h1>{s.idea}</h1>
        <p className="whisper" style={{ marginTop: 12 }}>We added {s.features.length} features instead.</p>
        <p className="whisper" style={{ marginTop: 12 }}>{s.idea}</p>
        <p style={{ fontSize: 24, margin: "4px 0" }}>→</p>
        <h1>{mutateName(s.idea, 4)}</h1>
        <div className="rgrid">
          <div>Initial investment</div><div>One innocent idea</div>
          <div>Portfolio value</div><div>{euro(unrealizedValue(s.features.length))}</div>
          <div>Liquid value</div><div>€0</div>
          <div>Features accumulated</div><div>{s.features.length}</div>
          <div>Downline dependencies</div><div>{s.deps}</div>
          <div>Paying users</div><div>0</div>
          <div>Launch Confidence</div><div>99.93%</div>
          <div>Resistance attempts</div><div>{s.resistanceAttempts} / 4</div>
          <div>Launch status</div><div>PREVENTED</div>
          <div>Ship date</div><div>NEVER</div>
        </div>
        <p className="receipt-status">{s.resistanceAttempts >= 4 ? "YOU SAID NO FOUR TIMES. OUTCOME UNCHANGED." : "Replay challenge: say NO to everything. It will not help."}</p>
        <p className="receipt-punchline">MISSION ACCOMPLISHED: SHIPPING PREVENTED.</p>
        <p className="receipt-punchline">{ideaPunchline(s.idea, s.features.length)}</p>
        <h1 style={{ marginTop: 12 }}>YOU WERE THE EXIT LIQUIDITY.</h1>
        <p className="whisper">scope creep complete ✓</p>
        <div className="row-btns" style={{ marginTop: 16 }}>
          <button className="primary" onClick={onRestart}>Try another innocent idea</button>
          {s.resistanceAttempts < 4 && (
            <button className="primary" onClick={onReplaySame}>Replay this idea — resist everything</button>
          )}
          <button className="ghost" onClick={copy}>{copied ? "✓ Failure copied" : "Copy my failure"}</button>
          <button className="ghost" onClick={download}>Download exit statement</button>
        </div>
        <p className="whisper">Different ideas get different bad advice.</p>
      </div>
    </div>
  );
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > max) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, yy);
}

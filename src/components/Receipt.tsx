import { useState } from "react";
import { mutateName } from "../lib/projectNaming";
import { receiptText, shipLabel, type GameState } from "../lib/gameEngine";

export default function Receipt({ s, onRestart }: { s: GameState; onRestart: () => void }) {
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
    ctx.fillText("SCOPE CREEP™", 64, 80);
    ctx.fillStyle = "#141414";
    ctx.font = "28px serif";
    ctx.fillText("I started building:", 64, 150);
    ctx.font = "bold 48px serif";
    wrap(ctx, s.idea, 64, 210, 950, 56);
    ctx.font = "28px serif";
    ctx.fillText("I ended up building:", 64, 340);
    ctx.font = "bold 40px serif";
    wrap(ctx, mutateName(s.idea, 4), 64, 400, 950, 48);
    const rows: [string, string][] = [
      ["Original features", "1"],
      ["Final features", String(s.features.length)],
      ["Dependencies", String(s.deps)],
      ["AI agents", String(s.agents)],
      ["Technical debt", `${s.debt}%`],
      ["Infrastructure/month", `€${s.cost}`],
      ["Users interviewed", "0"],
      ["Paying users", "0"],
      ["Ship date", shipLabel(s.days)],
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
    ctx.fillText(shipLabel(s.days) === "NEVER" ? "NEVER" : shipLabel(s.days), 64, 1100);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#6b665c";
    ctx.fillText("You successfully avoided shipping.", 64, 1180);
    const a = document.createElement("a");
    a.download = "scope-creep-receipt.png";
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
          <div>Technical debt</div><div>{s.debt}%</div>
          <div>Infrastructure/month</div><div>€{s.cost}</div>
          <div>Users interviewed</div><div>0</div>
          <div>Paying users</div><div>0</div>
          <div>Ship date</div><div>{shipLabel(s.days)}</div>
        </div>
        <div className="never">{shipLabel(s.days)}</div>
        <p style={{ marginTop: 12 }}>You successfully avoided shipping.</p>
        <p className="whisper">scope creep achieved ✓</p>
        <div className="row-btns" style={{ marginTop: 16 }}>
          <button className="primary" onClick={onRestart}>Try another innocent idea</button>
          <button className="ghost" onClick={copy}>{copied ? "✓ Copied" : "Copy my result"}</button>
          <button className="ghost" onClick={download}>Download receipt</button>
        </div>
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

type Props = { count: number; deps: number };

export default function ArchMap({ count, deps }: Props) {
  const late = count >= 12;
  const rows =
    count < 2
      ? [["IDEA"]]
      : count < 8
        ? [["IDEA"], ["ACCOUNTS"]]
        : count < 16
          ? [["IDEA"], ["ANALYTICS"], ["DASH", "CRM", "TRACK"]]
          : count < 26
            ? [["IDEA"], ["ANALYTICS"], ["AI", "AGENTS", "ORCH"], ["SSO", "API", "WH"]]
            : [["IDEA"], ["ANALYTICS"], ["AI", "AGENTS"], ["SSO", "SOC2", "WH"], ["K8S", "IDP", "A**"]];
  return (
    <div>
      <label>{late ? "YOUR FEATURE NETWORK" : "Architecture"}</label>
      <div className="pyramid">
        {rows.map((row, i) => (
          <div key={i} className="py-row">
            {row.map((n) => (
              <span key={n} className="py-node">{n}</span>
            ))}
          </div>
        ))}
      </div>
      {late && (
        <>
          <p className="arch">Direct recruits {Math.min(8, Math.max(1, count - 4))} · Downline {deps} · Depth {rows.length} levels</p>
          <p className="whisper">Your network is growing organically.</p>
          <p className="whisper">*Organic growth includes automatically generated dependencies.</p>
        </>
      )}
      {count >= 26 && <p className="arch">Nobody remembers why this exists.</p>}
    </div>
  );
}

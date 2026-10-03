type Props = { count: number; deps: number };

export default function ArchMap({ count, deps }: Props) {
  const rows =
    count < 2
      ? [["ORIGINAL IDEA"]]
      : count < 6
        ? [["ORIGINAL IDEA"], ["ACCOUNTS"]]
        : count < 12
          ? [["ORIGINAL IDEA"], ["ANALYTICS"], ["DASHBOARD", "TRACKING", "AI"]]
          : [["ORIGINAL IDEA"], ["ANALYTICS"], ["DASHBOARD", "TRACKING", "AI"], ["SSO", "AGENTS"], ["KUBERNETES"]];
  return (
    <div>
      <label>Feature Network</label>
      <div className="pyramid">
        {rows.map((row, i) => (
          <div key={i} className="py-row">
            {row.map((n) => (
              <span key={n} className="py-node">{n}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="arch">Downline dependencies: {deps}</p>
      <p className="whisper">*Organic growth includes automatically generated dependencies.</p>
    </div>
  );
}

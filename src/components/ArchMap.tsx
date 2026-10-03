type Props = { count: number; deps: number; features: string[] };

export default function ArchMap({ count, deps, features }: Props) {
  const hasK8s = features.includes("k8s");
  const rows =
    count < 2
      ? [["ORIGINAL IDEA"]]
      : count < 6
        ? [["ORIGINAL IDEA"], ["ACCOUNTS"]]
        : count < 12
          ? [["ORIGINAL IDEA"], ["ANALYTICS"], ["DASHBOARD", "TRACKING", "AI"]]
          : hasK8s
            ? [["ORIGINAL IDEA"], ["ANALYTICS"], ["DASHBOARD", "TRACKING", "AI"], ["SSO", "AGENTS"], ["KUBERNETES"]]
            : [["ORIGINAL IDEA"], ["ANALYTICS"], ["DASHBOARD", "TRACKING", "AI"], ["SSO", "AGENTS"], ["WAREHOUSE", "PLATFORM"]];
  return (
    <div>
      <label>Feature Network</label>
      <div className="pyramid">
        {rows.map((row, i) => (
          <div key={i} className="py-row">
            {row.map((n, j) => (
              <span key={n} className="py-node" style={{ animationDelay: `${(i * 3 + j) * 45}ms` }}>{n}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="arch">Downline dependencies: {deps}</p>
      <p className="whisper">*Organic growth includes automatically generated dependencies.</p>
    </div>
  );
}

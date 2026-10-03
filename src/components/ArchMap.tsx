type Props = { count: number };

const STAGES = [
  [{ id: "user", x: 20, y: 40, label: "USER" }, { id: "app", x: 160, y: 40, label: "APP" }],
  [
    { id: "user", x: 16, y: 28, label: "USER" },
    { id: "auth", x: 120, y: 28, label: "AUTH" },
    { id: "api", x: 220, y: 28, label: "API" },
    { id: "db", x: 320, y: 28, label: "DB" },
  ],
  [
    { id: "user", x: 16, y: 18, label: "USER" },
    { id: "auth", x: 110, y: 18, label: "AUTH" },
    { id: "api", x: 210, y: 18, label: "API" },
    { id: "db", x: 310, y: 18, label: "DB" },
    { id: "work", x: 110, y: 78, label: "WORKERS" },
    { id: "an", x: 210, y: 78, label: "ANALYTICS" },
    { id: "bill", x: 320, y: 78, label: "BILLING" },
  ],
  [
    { id: "user", x: 10, y: 14, label: "USER" },
    { id: "gw", x: 90, y: 14, label: "GW" },
    { id: "a1", x: 170, y: 8, label: "A1" },
    { id: "a2", x: 230, y: 8, label: "A2" },
    { id: "a3", x: 290, y: 8, label: "A3" },
    { id: "orch", x: 200, y: 52, label: "ORCH" },
    { id: "mesh", x: 80, y: 88, label: "MESH" },
    { id: "wh", x: 180, y: 88, label: "WH" },
    { id: "dash", x: 290, y: 88, label: "DASH" },
  ],
  [
    { id: "user", x: 8, y: 10, label: "USER" },
    { id: "sso", x: 70, y: 10, label: "SSO" },
    { id: "mesh", x: 140, y: 10, label: "MESH" },
    { id: "a1", x: 210, y: 6, label: "A" },
    { id: "a2", x: 250, y: 6, label: "A*" },
    { id: "a3", x: 290, y: 6, label: "A**" },
    { id: "k8s", x: 70, y: 52, label: "K8S" },
    { id: "reg", x: 150, y: 52, label: "REGIONS" },
    { id: "crm", x: 240, y: 52, label: "CRM" },
    { id: "idp", x: 320, y: 52, label: "IDP" },
    { id: "soc", x: 110, y: 94, label: "SOC2" },
    { id: "void", x: 230, y: 94, label: "???" },
  ],
];

function stage(n: number) {
  if (n < 2) return 0;
  if (n < 8) return 1;
  if (n < 16) return 2;
  if (n < 26) return 3;
  return 4;
}

export default function ArchMap({ count }: Props) {
  const nodes = STAGES[stage(count)];
  const late = count >= 26;
  return (
    <div>
      <label>Architecture {late ? "complexity" : ""}</label>
      <svg viewBox="0 0 380 120" width="100%" height="120" role="img" aria-label="Architecture map">
        {nodes.map((a, i) =>
          nodes.slice(i + 1, i + 3).map((b) => (
            <line key={a.id + b.id} x1={a.x + 28} y1={a.y + 10} x2={b.x} y2={b.y + 10} stroke="#3a4154" strokeWidth="1" />
          ))
        )}
        {late && nodes.map((a, i) => (i % 2 === 0 && nodes[i + 3] ? (
          <line key={"x" + a.id} x1={a.x + 20} y1={a.y + 12} x2={nodes[i + 3].x + 10} y2={nodes[i + 3].y} stroke="#5b8cff55" strokeWidth="1" />
        ) : null))}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width="56" height="22" rx="5" fill="#1a1d26" stroke="#3a4154" />
            <text x={n.x + 28} y={n.y + 15} textAnchor="middle" fill="#c9cdd8" fontSize="8">{n.label}</text>
          </g>
        ))}
      </svg>
      {late && <p className="arch">Nobody remembers why this exists.</p>}
    </div>
  );
}

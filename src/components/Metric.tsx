import { useEffect, useState } from "react";

export default function Metric({ label, value }: { label: string; value: string | number }) {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 280);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className={`card ${flash ? "pulse" : ""}`}>
      <label>{label}</label>
      <div className="v">{value}</div>
    </div>
  );
}

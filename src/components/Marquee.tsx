export default function Marquee() {
  const w = ["XARASOFT", "LOOKS", "ZALMI", "X-ONE", "SKACHRS", "SNEAKERS", "LOAFERS", "FORMAL"];
  const l = [...w, ...w].map((t, i) => <span key={i}>{t} ✦</span>);
  return (
    <div className="marq">
      <div>{l}</div>
    </div>
  );
}

/** Server component: SVG progress ring, zero client JS. */
export default function PotRing({ pct, label }: { pct: number; label: string }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="ring" role="img" aria-label={`${pct}% collected. ${label}`}>
      <circle cx="60" cy="60" r={r} className="ring-bg" />
      <circle cx="60" cy="60" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 60 60)" />
      <text x="60" y="66" textAnchor="middle" className="ring-t">{pct}%</text>
    </svg>
  );
}

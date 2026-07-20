const LANTERNS = [0, 1, 2, 3, 4].map((i) => ({
  dur: `${2.8 + i * 0.5}s`,
  string: 10 + (i % 3) * 8,
  size: 16 + (i % 2) * 6,
}))

export default function Lanterns() {
  return (
    <div className="lanterns">
      {LANTERNS.map((l, i) => (
        <div key={i} className="lantern" style={{ animationDuration: l.dur }}>
          <div className="lantern-string" style={{ height: l.string }} />
          <div className="lantern-bulb" style={{ width: l.size, height: l.size }} />
        </div>
      ))}
    </div>
  )
}

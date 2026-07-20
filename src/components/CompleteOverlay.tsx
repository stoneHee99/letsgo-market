import { TOTAL } from '../lib/booths'
import { COMPLETE_VERSE, PUZZLE_IMAGE } from '../lib/config'

const SEED = [0.13, 0.42, 0.77, 0.29, 0.6, 0.91, 0.05, 0.5]
const COLORS = ['#ffb454', '#8ee3d8', '#ff6b8a', '#ffe9b8']

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 137) % 100}%`,
  size: 6 + (i % 3) * 4,
  color: COLORS[i % 4],
  radius: i % 2 ? '50%' : '2px',
  dur: `${2.6 + SEED[i % 8] * 2}s`,
  delay: `${SEED[(i + 3) % 8] * 2.4}s`,
}))

interface Props {
  team: string
  onClose: () => void
}

export default function CompleteOverlay({ team, onClose }: Props) {
  return (
    <div className="complete-overlay">
      {CONFETTI.map((f, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            background: f.color,
            borderRadius: f.radius,
            animation: `confettiFall ${f.dur} linear ${f.delay} infinite`,
          }}
        />
      ))}
      <div className="complete-label">PUZZLE COMPLETE</div>
      <div className="jua complete-title">퍼즐 완성! 🎉</div>
      <div className="complete-poster" style={{ backgroundImage: `url('${PUZZLE_IMAGE}')` }} />
      <div className="complete-desc">
        {team}, {TOTAL}개 부스를 모두 정복!
        <br />
        {COMPLETE_VERSE}
      </div>
      <button className="complete-close" onClick={onClose}>
        닫기
      </button>
    </div>
  )
}

import { BOOTHS } from '../lib/booths'

interface Props {
  boothIndex: number
  /** 이 부스에서 획득한 조각 인덱스 (미획득이면 undefined) */
  piece?: number
  onBack: () => void
  onGoScan: () => void
  onGoPuzzle: () => void
}

export default function BoothDetail({ boothIndex, piece, onBack, onGoScan, onGoPuzzle }: Props) {
  const booth = BOOTHS[boothIndex]
  const done = piece != null

  return (
    <div className="screen">
      <button className="detail-back" onClick={onBack}>
        ← 부스 목록
      </button>

      <div className="detail-head">
        <div className={`jua booth-badge detail-badge${done ? ' done' : ''}`}>{booth.num}</div>
        <div style={{ flex: 1 }}>
          <div className="jua detail-name">{booth.name}</div>
          <div className="detail-chips">
            <span className="chip-mint">{booth.zone}</span>
            <span className="chip-day">{booth.day}</span>
          </div>
        </div>
      </div>

      <div className="detail-desc">{booth.desc}</div>

      <div className={`detail-status${done ? ' done' : ''}`}>
        {done
          ? `획득 완료 — 이 부스에서 조각 ${String(piece + 1).padStart(2, '0')}번을 받았어요 🧩`
          : '아직 미참여 — 미션을 완수하고 QR을 받아요'}
      </div>

      <div className="jua detail-section">어떻게 참여하나요?</div>
      <ol className="steps">
        {booth.steps.map((step, i) => (
          <li key={i} className="step-item">
            <span className="jua step-no">{i + 1}</span>
            <span className="step-text">{step}</span>
          </li>
        ))}
      </ol>

      {booth.tip && <div className="tip-box">💡 {booth.tip}</div>}

      <div className="detail-cta-row">
        {done ? (
          <button className="btn-ghost" onClick={onGoPuzzle}>
            퍼즐판 보기 🧩
          </button>
        ) : (
          <button className="btn-amber" onClick={onGoScan}>
            QR 스캔하러 가기 📷
          </button>
        )}
      </div>
    </div>
  )
}

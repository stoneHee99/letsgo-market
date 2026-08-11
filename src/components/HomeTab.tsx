import { useState } from 'react'
import { BOOTHS, TOTAL } from '../lib/booths'
import { EVENT_EYEBROW, EVENT_TITLE } from '../lib/config'
import PuzzleGrid, { pieceStyle } from './PuzzleGrid'

const RING_CIRCUMFERENCE = 201

interface Props {
  team: string
  /** 획득 조각 인덱스 (퍼즐판 표시용) */
  pieces: number[]
  /** 최근 획득 내역: 부스 → 조각 (최신순) */
  recent: { booth: number; piece: number }[]
  onGoPuzzle: () => void
  onReset: () => void
}

export default function HomeTab({ team, pieces, recent, onGoPuzzle, onReset }: Props) {
  const [confirming, setConfirming] = useState(false)
  const count = pieces.length

  return (
    <div className="screen">
      <div className="home-head">
        <div className="eyebrow">{EVENT_EYEBROW}</div>
        <div className="jua home-title">{EVENT_TITLE}</div>
      </div>

      <div className="team-card">
        <div className="ring-wrap">
          <svg width={74} height={74} viewBox="0 0 74 74">
            <circle cx={37} cy={37} r={32} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={7} />
            <circle
              cx={37}
              cy={37}
              r={32}
              fill="none"
              stroke="#ffb454"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * count) / TOTAL}
              transform="rotate(-90 37 37)"
              style={{ transition: 'stroke-dashoffset .8s ease' }}
            />
          </svg>
          <div className="ring-center">
            <div className="jua ring-num">{count}</div>
            <div className="ring-denom">/ {TOTAL}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="team-row">
            <div className="jua team-name">{team}</div>
            <div className="chip-mint">팀 미션</div>
          </div>
          <div className="team-desc">
            부스에 참여하고 QR을 찍으면 퍼즐 조각을 얻어요. {TOTAL}조각을 모아 그림을 완성하세요!
          </div>
        </div>
      </div>

      <div className="section-row">
        <div className="jua section-title">우리 조 퍼즐</div>
        <button className="section-link" onClick={onGoPuzzle}>
          퍼즐판 보기 →
        </button>
      </div>
      <PuzzleGrid pieces={pieces} mini onClick={onGoPuzzle} />

      <div className="recent-card">
        <div className="recent-label">최근 획득</div>
        {recent.length > 0 ? (
          <div className="recent-list">
            {recent.map(({ booth, piece }) => (
              <div key={booth} className="recent-item">
                <div className="recent-thumb" style={pieceStyle(piece)} />
                <div className="recent-name">{BOOTHS[booth].name}</div>
                <div className="recent-no">조각 {String(piece + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="recent-empty">아직 획득한 조각이 없어요. 부스로 출발!</div>
        )}
      </div>

      <div className="reset-row">
        {confirming ? (
          <span className="reset-confirm">
            정말 처음부터 다시 할까요?
            <button className="reset-yes" onClick={onReset}>
              초기화
            </button>
            <button className="reset-no" onClick={() => setConfirming(false)}>
              취소
            </button>
          </span>
        ) : (
          <button className="reset-link" onClick={() => setConfirming(true)}>
            팀/기록 초기화
          </button>
        )}
      </div>
    </div>
  )
}

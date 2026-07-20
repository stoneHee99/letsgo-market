import type { CSSProperties } from 'react'
import { GRID_COLS, GRID_ROWS, TOTAL } from '../lib/booths'
import { PUZZLE_IMAGE } from '../lib/config'

export function pieceStyle(index: number): CSSProperties {
  const col = index % GRID_COLS
  const row = Math.floor(index / GRID_COLS)
  return {
    backgroundImage: `url('${PUZZLE_IMAGE}')`,
    backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
    backgroundPosition: `${(col * 100) / (GRID_COLS - 1)}% ${(row * 100) / (GRID_ROWS - 1)}%`,
  }
}

interface Props {
  collected: number[]
  mini?: boolean
  onClick?: () => void
}

export default function PuzzleGrid({ collected, mini, onClick }: Props) {
  const has = new Set(collected)
  return (
    <div className={mini ? 'puzzle-frame' : 'puzzle-frame big'} onClick={onClick}>
      <div className="pz-grid">
        {Array.from({ length: TOTAL }, (_, i) =>
          has.has(i) ? (
            <div key={i} className={mini ? 'pz-cell' : 'pz-cell reveal'} style={pieceStyle(i)} />
          ) : (
            <div key={i} className="pz-cell locked">
              {!mini && (
                <div className="pz-lock-inner">
                  <div className="pz-lock-emoji">🧩</div>
                  <div className="pz-lock-no">P{String(i + 1).padStart(2, '0')}</div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

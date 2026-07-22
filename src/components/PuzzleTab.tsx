import { TOTAL } from '../lib/booths'
import { POSTER_NAME } from '../lib/config'
import PuzzleGrid from './PuzzleGrid'

interface Props {
  pieces: number[]
  onShowComplete: () => void
}

export default function PuzzleTab({ pieces, onShowComplete }: Props) {
  const complete = pieces.length === TOTAL
  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="jua screen-title">퍼즐판</div>
        <div className="jua" style={{ fontSize: 15, color: '#8ee3d8' }}>
          {pieces.length} / {TOTAL}
        </div>
      </div>
      <PuzzleGrid pieces={pieces} />
      <div className="puzzle-caption">
        조각을 얻을 때마다 그림이 드러나요.
        <br />
        완성 그림: {POSTER_NAME}
      </div>
      {complete && (
        <div className="complete-again-row">
          <button className="btn-amber" onClick={onShowComplete}>
            완성 화면 보기 🎉
          </button>
        </div>
      )}
    </div>
  )
}

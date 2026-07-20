import { BOOTHS } from '../lib/booths'
import { pieceStyle } from './PuzzleGrid'

interface Props {
  boothIndex: number
  dup: boolean
  onClose: () => void
}

export default function EarnedModal({ boothIndex, dup, onClose }: Props) {
  const booth = BOOTHS[boothIndex]
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="earned-card" onClick={(e) => e.stopPropagation()}>
        <div className="earned-label">{dup ? 'ALREADY GET' : 'PIECE GET!'}</div>
        <div className="jua earned-name">{booth.name}</div>
        <div className="earned-piece" style={pieceStyle(boothIndex)} />
        <div className="earned-desc">
          {dup ? '이미 모은 조각이에요. 다른 부스로 가볼까요?' : `퍼즐 조각 ${booth.num}번을 획득했어요!`}
        </div>
        <button className="earned-btn" onClick={onClose}>
          {dup ? '퍼즐판 보기' : '퍼즐판에 붙이기'}
        </button>
      </div>
    </div>
  )
}

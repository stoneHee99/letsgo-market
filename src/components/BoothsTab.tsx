import { BOOTHS, TOTAL } from '../lib/booths'

interface Props {
  collected: number[]
}

export default function BoothsTab({ collected }: Props) {
  const has = new Set(collected)
  return (
    <div className="screen">
      <div className="jua screen-title">야시장 부스</div>
      <div className="screen-sub">
        {collected.length}개 미션 완료 · {TOTAL - collected.length}개 남음
      </div>
      <div className="booth-list">
        {BOOTHS.map((b, i) => {
          const done = has.has(i)
          return (
            <div key={b.code} className={`booth-item${done ? ' done' : ''}`}>
              <div className="jua booth-badge">{b.num}</div>
              <div style={{ flex: 1 }}>
                <div className="booth-name">{b.name}</div>
                <div className="booth-zone">{b.zone}</div>
              </div>
              <div className="booth-state">{done ? '획득 완료' : '미참여'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

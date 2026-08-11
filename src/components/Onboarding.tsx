import { useState } from 'react'
import { EVENT_EYEBROW, EVENT_TITLE, TEAM_COUNT } from '../lib/config'

interface Props {
  onDone: (team: string) => void
}

export default function Onboarding({ onDone }: Props) {
  const [teamNo, setTeamNo] = useState<number | null>(null)
  const [teamName, setTeamName] = useState('')

  const submit = () => {
    if (teamNo == null) return
    const name = teamName.trim()
    onDone(name ? `${teamNo}조 · ${name}` : `${teamNo}조`)
  }

  return (
    <div className="screen">
      <div className="home-head" style={{ marginTop: 40 }}>
        <div className="eyebrow">{EVENT_EYEBROW}</div>
        <div className="jua home-title">{EVENT_TITLE}</div>
      </div>

      <div className="onboard-card">
        <div className="onboard-label">우리 조를 선택해 주세요</div>
        <div className="team-grid">
          {Array.from({ length: TEAM_COUNT }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`team-chip${teamNo === n ? ' selected' : ''}`}
              onClick={() => setTeamNo(n)}
            >
              {n}조
            </button>
          ))}
        </div>
        <input
          className="onboard-input"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="팀 이름 (선택) 예: 여호수아팀"
          maxLength={12}
        />
      </div>

      <div className="onboard-cta-row">
        <button className="btn-amber" disabled={teamNo == null} onClick={submit}>
          야시장 입장하기 🏮
        </button>
      </div>
    </div>
  )
}

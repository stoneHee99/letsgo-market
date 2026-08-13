import { useState } from 'react'
import { EVENT_EYEBROW, EVENT_TITLE, REGULAR_TEAMS, TEAM_COUNT } from '../lib/config'

interface Props {
  /** 조 변경 모드: 현재 팀을 미리 선택해 보여주고, 기록 유지 안내를 띄움 */
  changing?: boolean
  initialTeam?: string | null
  onDone: (team: string) => void
  onCancel?: () => void
}

function parseTeam(team: string | null | undefined): { no: number | null; name: string } {
  if (!team) return { no: null, name: '' }
  const m = /^(\d+)조(?:\s*·\s*(.+))?$/.exec(team)
  if (!m) return { no: null, name: '' }
  return { no: parseInt(m[1], 10), name: m[2] ?? '' }
}

export default function Onboarding({ changing, initialTeam, onDone, onCancel }: Props) {
  const initial = parseTeam(initialTeam)
  const [teamNo, setTeamNo] = useState<number | null>(initial.no)
  const [teamName, setTeamName] = useState(initial.name)

  const submit = () => {
    if (teamNo == null) return
    const name = teamName.trim()
    onDone(name ? `${teamNo}조 · ${name}` : `${teamNo}조`)
  }

  const regular = Array.from({ length: REGULAR_TEAMS }, (_, i) => i + 1)
  const staff = Array.from({ length: TEAM_COUNT - REGULAR_TEAMS }, (_, i) => REGULAR_TEAMS + i + 1)

  const chip = (n: number) => (
    <button key={n} className={`team-chip${teamNo === n ? ' selected' : ''}`} onClick={() => setTeamNo(n)}>
      {n}조
    </button>
  )

  return (
    <div className="screen">
      {changing && onCancel && (
        <button className="detail-back" onClick={onCancel}>
          ← 돌아가기
        </button>
      )}
      <div className="home-head" style={{ marginTop: changing ? 10 : 40 }}>
        <div className="eyebrow">{EVENT_EYEBROW}</div>
        <div className="jua home-title">{EVENT_TITLE}</div>
      </div>

      {changing && (
        <div className="tip-box" style={{ marginTop: 16 }}>
          🧩 조를 바꿔도 지금까지 모은 조각과 기록은 그대로 유지돼요
        </div>
      )}

      <div className="onboard-card">
        <div className="onboard-label">{changing ? '조를 변경해 주세요' : '우리 조를 선택해 주세요'}</div>
        <div className="team-section-label">일반조 · 1~{REGULAR_TEAMS}조</div>
        <div className="team-grid">{regular.map(chip)}</div>
        <div className="team-section-label">스탭조 · {REGULAR_TEAMS + 1}~{TEAM_COUNT}조</div>
        <div className="team-grid">{staff.map(chip)}</div>
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
          {changing ? '이 조로 변경하기' : '야시장 입장하기 🏮'}
        </button>
      </div>
    </div>
  )
}

export type TabId = 'home' | 'booths' | 'scan' | 'puzzle'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home', icon: '🏮', label: '홈' },
  { id: 'booths', icon: '🎪', label: '부스' },
  { id: 'scan', icon: '📷', label: '스캔' },
  { id: 'puzzle', icon: '🧩', label: '퍼즐' },
]

interface Props {
  tab: TabId
  onTab: (tab: TabId) => void
}

export default function TabBar({ tab, onTab }: Props) {
  return (
    <div className="tabbar">
      {TABS.map((t) => (
        <button key={t.id} className={`tab-item${tab === t.id ? ' active' : ''}`} onClick={() => onTab(t.id)}>
          <div className="tab-icon">{t.icon}</div>
          <div className="tab-label">{t.label}</div>
        </button>
      ))}
    </div>
  )
}

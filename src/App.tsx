import { useEffect, useRef, useState } from 'react'
import { TOTAL } from './lib/booths'
import { extractBoothIndex } from './lib/codes'
import { awardPiece, markCompleteSeen, resetAll, setTeam, useGame } from './lib/store'
import Lanterns from './components/Lanterns'
import TabBar, { type TabId } from './components/TabBar'
import HomeTab from './components/HomeTab'
import BoothsTab from './components/BoothsTab'
import ScanTab from './components/ScanTab'
import PuzzleTab from './components/PuzzleTab'
import EarnedModal from './components/EarnedModal'
import CompleteOverlay from './components/CompleteOverlay'
import Onboarding from './components/Onboarding'
import AdminPage from './pages/AdminPage'

/** URL의 ?s= 스캔 페이로드를 읽음 (일반 카메라 앱으로 QR을 찍고 들어온 경우) */
function readScanParam(): string | null {
  return new URLSearchParams(window.location.search).get('s')
}

function useHashRoute(): string {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  if (hash.startsWith('#/admin')) return <AdminPage />
  return <ParticipantApp />
}

function ParticipantApp() {
  const { ready, state, refresh } = useGame()
  const [tab, setTab] = useState<TabId>('home')
  const [earned, setEarned] = useState<{ idx: number; dup: boolean } | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const pendingScan = useRef<string | null>(readScanParam())
  const demo = new URLSearchParams(window.location.search).has('demo')

  // 스캔 링크로 들어왔다면 URL은 바로 정리 (새로고침 시 중복 처리 방지)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('s')) return
    params.delete('s')
    const query = params.toString()
    history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash)
  }, [])

  // 팀 등록이 끝난 뒤 스캔 링크 처리
  useEffect(() => {
    if (!ready || !state.team || !pendingScan.current) return
    const payload = pendingScan.current
    pendingScan.current = null
    const idx = extractBoothIndex(payload)
    if (idx == null) {
      setToast('유효하지 않은 QR 링크예요')
      return
    }
    const result = awardPiece(idx)
    refresh()
    setEarned({ idx, dup: result === 'dup' })
  }, [ready, state.team, refresh])

  // 토스트 자동 닫기
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  // 16조각 완성 → 축하 화면 (한 번만 자동 표시)
  useEffect(() => {
    if (ready && !earned && state.collected.length === TOTAL && !state.completeSeen) {
      setShowComplete(true)
    }
  }, [ready, earned, state.collected.length, state.completeSeen])

  const handleAward = (idx: number): 'new' | 'dup' => {
    const result = awardPiece(idx)
    refresh()
    if (result === 'new') setEarned({ idx, dup: false })
    return result
  }

  const closeEarned = () => {
    setEarned(null)
    setTab('puzzle')
  }

  const closeComplete = () => {
    markCompleteSeen()
    refresh()
    setShowComplete(false)
  }

  const handleReset = () => {
    resetAll()
    refresh()
    setTab('home')
    setEarned(null)
    setShowComplete(false)
  }

  return (
    <div className="stage">
      <div className="phone">
        <Lanterns />
        {!ready ? null : !state.team ? (
          <Onboarding
            onDone={(team) => {
              setTeam(team)
              refresh()
            }}
          />
        ) : (
          <>
            {tab === 'home' && (
              <HomeTab
                team={state.team}
                collected={state.collected}
                recent={state.recent}
                onGoPuzzle={() => setTab('puzzle')}
                onReset={handleReset}
              />
            )}
            {tab === 'booths' && <BoothsTab collected={state.collected} />}
            {tab === 'scan' && (
              <ScanTab paused={earned != null} collected={state.collected} demo={demo} onAward={handleAward} />
            )}
            {tab === 'puzzle' && (
              <PuzzleTab collected={state.collected} onShowComplete={() => setShowComplete(true)} />
            )}
            <TabBar tab={tab} onTab={setTab} />
            {earned && <EarnedModal boothIndex={earned.idx} dup={earned.dup} onClose={closeEarned} />}
            {showComplete && state.team && <CompleteOverlay team={state.team} onClose={closeComplete} />}
            {toast && <div className="toast">{toast}</div>}
          </>
        )}
      </div>
    </div>
  )
}

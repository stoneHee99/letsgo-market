import { useCallback, useEffect, useState } from 'react'

export interface GameState {
  team: string | null
  collected: number[]
  recent: number[]
  completeSeen: boolean
}

const KEY = 'hamgge.v1'
const UPDATE_EVENT = 'hamgge:update'

const DEFAULT_STATE: GameState = {
  team: null,
  collected: [],
  recent: [],
  completeSeen: false,
}

export function loadState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<GameState>
    return {
      team: typeof parsed.team === 'string' ? parsed.team : null,
      collected: Array.isArray(parsed.collected) ? parsed.collected.filter((n) => Number.isInteger(n)) : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent.filter((n) => Number.isInteger(n)) : [],
      completeSeen: parsed.completeSeen === true,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: GameState) {
  localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function setTeam(team: string) {
  saveState({ ...loadState(), team })
}

/** 조각 지급. 이미 가진 조각이면 'dup'. */
export function awardPiece(boothIndex: number): 'new' | 'dup' {
  const state = loadState()
  if (state.collected.includes(boothIndex)) return 'dup'
  saveState({
    ...state,
    collected: [...state.collected, boothIndex],
    recent: [...state.recent, boothIndex],
  })
  return 'new'
}

export function markCompleteSeen() {
  saveState({ ...loadState(), completeSeen: true })
}

export function resetAll() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function useGame() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => setState(loadState())
    sync()
    setReady(true)
    window.addEventListener(UPDATE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const refresh = useCallback(() => setState(loadState()), [])

  return { ready, state, refresh }
}

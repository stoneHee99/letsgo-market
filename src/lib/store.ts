import { useCallback, useEffect, useState } from 'react'
import { TOTAL } from './booths'

export interface GameState {
  team: string | null
  /** 스캔 완료한 부스 인덱스 (스캔 순서대로) */
  collected: number[]
  /** 부스 인덱스 → 획득한 퍼즐 조각 인덱스. 스캔 시점에 남은 조각 중 랜덤 배정 */
  pieceMap: Record<string, number>
  completeSeen: boolean
}

const KEY = 'hamgge.v1'
const UPDATE_EVENT = 'hamgge:update'

const DEFAULT_STATE: GameState = {
  team: null,
  collected: [],
  pieceMap: {},
  completeSeen: false,
}

export function loadState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<GameState>
    const collected = Array.isArray(parsed.collected)
      ? parsed.collected.filter((n): n is number => Number.isInteger(n))
      : []

    const pieceMap: Record<string, number> = {}
    if (parsed.pieceMap && typeof parsed.pieceMap === 'object') {
      for (const [k, v] of Object.entries(parsed.pieceMap)) {
        if (Number.isInteger(v)) pieceMap[k] = v as number
      }
    }
    // 구버전(부스 번호 = 조각 번호 고정) 상태 마이그레이션: 매핑이 없는 부스는 겹치지 않는 조각으로 채움
    const used = new Set(Object.values(pieceMap))
    for (const b of collected) {
      if (pieceMap[String(b)] == null) {
        const piece = !used.has(b) ? b : Array.from({ length: TOTAL }, (_, i) => i).find((i) => !used.has(i))
        if (piece == null) continue
        pieceMap[String(b)] = piece
        used.add(piece)
      }
    }

    return {
      team: typeof parsed.team === 'string' ? parsed.team : null,
      collected,
      pieceMap,
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

/** 이 조가 지금까지 획득한 조각 인덱스 (스캔 순서대로) */
export function ownedPieces(state: GameState): number[] {
  return state.collected
    .map((b) => state.pieceMap[String(b)])
    .filter((p): p is number => p != null)
}

export function pieceForBooth(state: GameState, boothIndex: number): number | undefined {
  return state.pieceMap[String(boothIndex)]
}

/** 부스 스캔 처리. 처음 스캔이면 남은 조각 중 하나를 랜덤으로 지급, 이미 스캔했으면 'dup'. */
export function awardPiece(boothIndex: number): { result: 'new' | 'dup'; piece: number } {
  const state = loadState()
  const key = String(boothIndex)
  if (state.collected.includes(boothIndex)) {
    return { result: 'dup', piece: state.pieceMap[key] ?? boothIndex }
  }
  const used = new Set(Object.values(state.pieceMap))
  const remaining = Array.from({ length: TOTAL }, (_, i) => i).filter((p) => !used.has(p))
  const piece = remaining.length
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : boothIndex
  saveState({
    ...state,
    collected: [...state.collected, boothIndex],
    pieceMap: { ...state.pieceMap, [key]: piece },
  })
  return { result: 'new', piece }
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

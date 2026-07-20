import { BOOTHS } from './booths'

// QR 위조/추측 방지용 간단 토큰. SALT를 바꾸면 모든 QR 코드가 새로 발급됩니다.
const SALT = 'hamgge-2026-summer-letsgo'

// 0/O, 1/I/L 같은 헷갈리는 글자를 뺀 알파벳 (수동 입력용)
const ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

export function tokenFor(code: string): string {
  // FNV-1a 32bit
  let h = 0x811c9dc5
  const s = code.toUpperCase() + '|' + SALT
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  let out = ''
  for (let i = 0; i < 4; i++) {
    out += ALPHA[h % ALPHA.length]
    h = Math.floor(h / ALPHA.length)
  }
  return out
}

/** QR에 담기는 페이로드: "HAMGGE-01.K3TZ" */
export function scanPayload(boothIndex: number): string {
  const code = BOOTHS[boothIndex].code
  return `${code}.${tokenFor(code)}`
}

/** 앱이 서비스되는 디렉터리 URL (해시/쿼리 제외) */
export function appBaseUrl(): string {
  return new URL('.', window.location.href).href
}

/** 부스 QR에 담기는 전체 URL — 일반 카메라로 찍어도 앱이 열리며 조각이 지급됨 */
export function scanUrl(boothIndex: number): string {
  return `${appBaseUrl()}?s=${encodeURIComponent(scanPayload(boothIndex))}`
}

/**
 * QR 원문/스캔 링크에서 부스 인덱스 추출 + 토큰 검증.
 * "HAMGGE-01.K3TZ", "https://…/?s=HAMGGE-01.K3TZ" 모두 허용.
 * 토큰이 틀리면 null.
 */
export function extractBoothIndex(text: string): number | null {
  const m = /HAMGGE-?(\d{2})[.\-_ ]?([A-Z0-9]{4})/i.exec(text.trim())
  if (!m) return null
  const idx = parseInt(m[1], 10) - 1
  if (idx < 0 || idx >= BOOTHS.length) return null
  return m[2].toUpperCase() === tokenFor(BOOTHS[idx].code) ? idx : null
}

/** 수동 입력 파싱: "01-K3TZ" / "01K3TZ" / "HAMGGE-01.K3TZ" 허용 */
export function parseManualCode(input: string): number | null {
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const m = /^(?:HAMGGE)?(\d{2})([A-Z0-9]{4})$/.exec(cleaned)
  if (!m) return null
  const idx = parseInt(m[1], 10) - 1
  if (idx < 0 || idx >= BOOTHS.length) return null
  return m[2] === tokenFor(BOOTHS[idx].code) ? idx : null
}

/** 인쇄 카드에 표기하는 수동 입력 코드: "01-K3TZ" */
export function manualCodeFor(boothIndex: number): string {
  return `${BOOTHS[boothIndex].num}-${tokenFor(BOOTHS[boothIndex].code)}`
}

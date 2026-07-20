import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { extractBoothIndex, parseManualCode } from '../lib/codes'
import { TOTAL } from '../lib/booths'

type CamStatus = 'starting' | 'on' | 'denied' | 'unavailable' | 'insecure'

interface Props {
  paused: boolean
  collected: number[]
  demo: boolean
  /** 유효한 부스 QR 인식 시 호출. 반환값이 'dup'이면 이미 가진 조각. */
  onAward: (boothIndex: number) => 'new' | 'dup'
}

export default function ScanTab({ paused, collected, demo, onAward }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastHitRef = useRef<{ text: string; at: number }>({ text: '', at: 0 })
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const [status, setStatus] = useState<CamStatus>('starting')
  const [flash, setFlash] = useState<string | null>(null)
  const [manual, setManual] = useState('')
  const flashTimer = useRef<number | undefined>(undefined)

  const showFlash = (msg: string) => {
    setFlash(msg)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 2000)
  }

  const handleDecoded = (text: string) => {
    const now = Date.now()
    if (text === lastHitRef.current.text && now - lastHitRef.current.at < 2500) return
    lastHitRef.current = { text, at: now }

    const idx = extractBoothIndex(text)
    if (idx == null) {
      showFlash('유효하지 않은 QR 코드예요')
      return
    }
    navigator.vibrate?.(60)
    if (onAward(idx) === 'dup') showFlash('이미 획득한 부스예요 🧩')
  }

  useEffect(() => {
    let cancelled = false
    let interval: number | undefined
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus(window.isSecureContext ? 'unavailable' : 'insecure')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play().catch(() => {})
        setStatus('on')

        interval = window.setInterval(() => {
          if (pausedRef.current || !ctx) return
          const v = videoRef.current
          if (!v || v.readyState < 2 || !v.videoWidth) return
          const scale = 400 / v.videoWidth
          canvas.width = 400
          canvas.height = Math.round(v.videoHeight * scale)
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const hit = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
          if (hit?.data) handleDecoded(hit.data)
        }, 220)
      } catch (e) {
        if (cancelled) return
        setStatus(e instanceof DOMException && e.name === 'NotAllowedError' ? 'denied' : 'unavailable')
      }
    }

    start()
    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.clearTimeout(flashTimer.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitManual = () => {
    const idx = parseManualCode(manual)
    if (idx == null) {
      showFlash('코드를 다시 확인해 주세요')
      return
    }
    setManual('')
    navigator.vibrate?.(60)
    if (onAward(idx) === 'dup') showFlash('이미 획득한 부스예요 🧩')
  }

  const simulate = () => {
    const remain = Array.from({ length: TOTAL }, (_, i) => i).filter((i) => !collected.includes(i))
    if (!remain.length) return
    onAward(remain[Math.floor(Math.random() * remain.length)])
  }

  const camMessage =
    status === 'starting'
      ? '카메라 준비 중…'
      : status === 'denied'
        ? '카메라 권한이 꺼져 있어요.\n브라우저 설정에서 허용해 주세요'
        : status === 'insecure'
          ? 'HTTPS 접속에서만\n카메라를 쓸 수 있어요'
          : status === 'unavailable'
            ? '카메라를 열 수 없어요.\n아래 수동 입력을 이용하세요'
            : null

  return (
    <div className="screen scan-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="jua screen-title">QR 스캔</div>
        <div className="screen-sub">부스에서 받은 QR 코드를 비춰주세요</div>
      </div>

      <div className="scan-cam-wrap">
        <div className="scan-cam">
          <video ref={videoRef} className="scan-video" playsInline muted autoPlay />
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />
          {status === 'on' && <div className="scan-line" />}
          {camMessage && <div className="scan-idle-text" style={{ whiteSpace: 'pre-line' }}>{camMessage}</div>}
        </div>
      </div>

      <div className="scan-flash">{flash}</div>
      <div className="scan-hint">카메라가 안 되면 부스 카드의 수동 코드를 입력하세요</div>
      <div className="scan-manual">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitManual()}
          placeholder="예: 01-K3TZ"
          inputMode="text"
          autoCapitalize="characters"
        />
        <button className="btn-ghost" onClick={submitManual}>
          확인
        </button>
      </div>

      {demo && (
        <div className="demo-row">
          <button className="btn-amber" onClick={simulate}>
            스캔 시뮬레이션
          </button>
        </div>
      )}
    </div>
  )
}

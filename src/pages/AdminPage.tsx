import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { BOOTHS } from '../lib/booths'
import { appBaseUrl, manualCodeFor, scanUrl } from '../lib/codes'
import { EVENT_TITLE } from '../lib/config'

const QR_OPTS = { margin: 1, width: 512, color: { dark: '#1d1e2e', light: '#ffffff' } }

export default function AdminPage() {
  const [boothQrs, setBoothQrs] = useState<string[]>([])
  const [entryQr, setEntryQr] = useState<string | null>(null)

  useEffect(() => {
    Promise.all(BOOTHS.map((_, i) => QRCode.toDataURL(scanUrl(i), QR_OPTS))).then(setBoothQrs)
    QRCode.toDataURL(appBaseUrl(), QR_OPTS).then(setEntryQr)
  }, [])

  return (
    <div className="admin-stage">
      <div className="jua admin-eyebrow no-print">관리자 — 부스 QR 생성</div>
      <div className="admin-panel">
        <div className="admin-head">
          <div>
            <div className="jua admin-title">
              {EVENT_TITLE} · 부스 QR
            </div>
            <div className="admin-sub">
              각 카드를 인쇄해 부스에 부착하세요. QR은 현재 접속 주소(<code>{appBaseUrl()}</code>) 기준으로
              생성되므로, <b>실제 배포된 주소에서 열어 인쇄</b>해야 합니다.
            </div>
          </div>
          <button className="btn-mint no-print" onClick={() => window.print()}>
            전체 인쇄
          </button>
        </div>

        <div className="entry-card">
          {entryQr && (
            <div className="entry-qr">
              <img src={entryQr} alt="참가자 앱 접속 QR" />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="entry-title">참가자 앱 접속 QR</div>
            <div className="entry-desc">
              수련회 시작 때 각 조장이 이 QR을 찍어 앱에 접속합니다.
              <br />
              접속 후 조를 선택하면 바로 게임을 시작할 수 있어요.
            </div>
            <div className="entry-url">{appBaseUrl()}</div>
          </div>
        </div>

        <div className="admin-grid">
          {BOOTHS.map((b, i) => (
            <div key={b.code} className="qr-card">
              {boothQrs[i] ? <img src={boothQrs[i]} alt={`${b.name} QR`} /> : <div style={{ width: 110, height: 110, margin: '0 auto' }} />}
              <div className="qr-name">
                {b.num}. {b.name}
              </div>
              <div className="qr-code">{b.code}</div>
              <div className="qr-manual">수동코드 {manualCodeFor(i)}</div>
            </div>
          ))}
        </div>
      </div>
      <a className="admin-back no-print" href="./">
        ← 참가자 앱으로
      </a>
    </div>
  )
}

export interface Booth {
  name: string
  zone: string
  num: string
  code: string
}

// 부스 9 + 성전 나눔 1 + 버스킹 6 = 16조각 (4×4 퍼즐)
// 부스 1~9: 1일차 대운동장 · 나눔: 성전 건물 · 버스킹: 2일차 두 광장에서 공연 중 QR 노출
const DEFS: [name: string, zone: string][] = [
  ['야광봉 포토존', '대운동장'],
  ['기도제목 자판기', '대운동장'],
  ['컵 옮기기 게임', '대운동장'],
  ['공 빠뜨리기 게임', '대운동장'],
  ['낚시', '대운동장'],
  ['인생네컷', '대운동장'],
  ['풍선다트', '대운동장'],
  ['무지개를 찾아라', '대운동장'],
  ['사진 미션', '대운동장'],
  ['성전 나눔', '예루살렘·베들레헴 성전'],
  ['버스킹 1', '소운동장 앞 광장'],
  ['버스킹 2', '소운동장 앞 광장'],
  ['버스킹 3', '소운동장 앞 광장'],
  ['버스킹 4', '성전 앞 광장'],
  ['버스킹 5', '성전 앞 광장'],
  ['버스킹 6', '성전 앞 광장'],
]

export const BOOTHS: Booth[] = DEFS.map(([name, zone], i) => ({
  name,
  zone,
  num: String(i + 1).padStart(2, '0'),
  code: 'HAMGGE-' + String(i + 1).padStart(2, '0'),
}))

export const TOTAL = BOOTHS.length

export const GRID_COLS = 4
export const GRID_ROWS = 4

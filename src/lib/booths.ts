export interface Booth {
  name: string
  zone: string
  num: string
  code: string
}

const ZONES = ['먹거리 골목', '놀이 마당', '만들기 공방', '쉼터 거리']

const NAMES = [
  '달고나 챌린지',
  '솜사탕 가게',
  '수제 츄러스',
  '야시장 떡볶이',
  '인생네컷 부스',
  '제기차기 왕중왕',
  '링 던지기',
  '풍선 다트',
  '캘리그라피 공방',
  '팔찌 만들기',
  '석고 방향제',
  '페이스페인팅',
  '말씀 카드 뽑기',
  '중보기도 우체통',
  '타로 대신 성경퀴즈',
  '포토존 & 방명록',
]

export const BOOTHS: Booth[] = NAMES.map((name, i) => ({
  name,
  zone: ZONES[Math.floor(i / 4)],
  num: String(i + 1).padStart(2, '0'),
  code: 'HAMGGE-' + String(i + 1).padStart(2, '0'),
}))

export const TOTAL = BOOTHS.length

export const GRID_COLS = 4
export const GRID_ROWS = 4

// 퍼즐 완성 그림 = 실제 수련회 포스터 (public/poster.jpg, 1414×2000).
// 이미지를 바꾸면 styles.css의 --poster-aspect(가로/세로 비율)도 함께 맞춰주세요.
const base = import.meta.env.BASE_URL
export const PUZZLE_IMAGE = base + 'poster.jpg'

export const EVENT_EYEBROW = '2026 청년봉사선교회 여름수련회'
export const EVENT_TITLE = '함께걷장'
export const EVENT_SUBTITLE = '야시장 퍼즐 대작전'
export const COMPLETE_VERSE = '곧은 길로 행하라 — 여호수아 1:7'
export const POSTER_NAME = '수련회 포스터 「곧은 길로 행하라」'

/** 조 선택 화면에 표시할 조 개수 */
export const TEAM_COUNT = 12

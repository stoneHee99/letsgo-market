import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' — 어떤 정적 호스팅(하위 경로 포함)에 올려도 동작하도록 상대 경로 빌드
export default defineConfig({
  base: './',
  plugins: [react()],
})

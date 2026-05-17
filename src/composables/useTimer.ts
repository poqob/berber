import { ref, onUnmounted } from 'vue'

export function useTimer() {
  const elapsed = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  function start() {
    stop()
    elapsed.value = 0
    intervalId = setInterval(() => {
      elapsed.value++
    }, 1000)
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    elapsed.value = 0
  }

  function format(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
  }

  onUnmounted(stop)

  return { elapsed, start, stop, reset, format }
}

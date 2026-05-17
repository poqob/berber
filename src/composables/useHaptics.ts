export function useHaptics() {
  function trigger(intensity: 'light' | 'medium' = 'light') {
    if (navigator.vibrate) {
      navigator.vibrate(intensity === 'light' ? 15 : 30)
    }
  }

  return { trigger }
}

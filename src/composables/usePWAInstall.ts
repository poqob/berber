import { ref } from 'vue'

export function usePWAInstall() {
  const deferredPrompt = ref<Event | null>(null)
  const isInstallable = ref(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstallable.value = false
      deferredPrompt.value = null
    })
  }

  async function install() {
    if (!deferredPrompt.value) return
    ;(deferredPrompt.value as any).prompt()
    const result = await (deferredPrompt.value as any).userChoice
    if (result.outcome === 'accepted') {
      isInstallable.value = false
    }
    deferredPrompt.value = null
  }

  return { isInstallable, install }
}

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const PROFILE_KEY = 'kuaförüm:profile'

interface Profile {
  photo: string
  name: string
  shop: string
}

const profile = ref<Profile>({ photo: '', name: '', shop: '' })
const show = defineModel<boolean>('show', { required: true })

onMounted(() => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) profile.value = { photo: '', name: '', shop: '', ...JSON.parse(raw) }
  } catch { /* ignore */ }
})

watch(profile, (val) => {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(val)) } catch { /* ignore */ }
}, { deep: true })

function handlePhotoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    profile.value.photo = reader.result as string
  }
  reader.readAsDataURL(file)
}

function clearPhoto() {
  profile.value.photo = ''
}

const logo = computed(() =>
  document.documentElement.classList.contains('light')
    ? '/dagsolution-light-logo.png'
    : '/dagsolution-logo.png'
)

function openContact() {
  window.open('https://www.dagsolution.com', '_blank')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="show" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-overlay" @click="show = false" />

        <div class="relative w-80 max-w-[85vw] h-full bg-surface shadow-2xl overflow-y-auto">
          <div class="p-5">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-text-main">Ayarlar</h2>
              <button
                @click="show = false"
                class="touch-target w-9 h-9 flex items-center justify-center rounded-lg bg-bg text-text-muted text-lg"
              >✕</button>
            </div>

            <div class="flex flex-col items-center mb-6">
              <div class="relative w-24 h-24 rounded-full overflow-hidden bg-bg mb-3 ring-2 ring-primary/30">
                <img
                  v-if="profile.photo"
                  :src="profile.photo"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl text-text-muted">
                  👤
                </div>
              </div>
              <div class="flex gap-2">
                <label class="touch-target px-4 py-1.5 rounded-full bg-primary text-black text-sm font-semibold cursor-pointer">
                  Fotoğraf Seç
                  <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
                </label>
                <button
                  v-if="profile.photo"
                  @click="clearPhoto"
                  class="touch-target px-4 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-semibold"
                >Kaldır</button>
              </div>
            </div>

            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm text-text-muted mb-1">Ad Soyad</label>
                <input
                  v-model="profile.name"
                  type="text"
                  placeholder="Adınız"
                  class="w-full bg-bg text-text-main rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label class="block text-sm text-text-muted mb-1">Dükkan Adı</label>
                <input
                  v-model="profile.shop"
                  type="text"
                  placeholder="Dükkan adınız"
                  class="w-full bg-bg text-text-main rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div class="border-t border-border-color pt-5 space-y-4">
              <p class="text-sm font-semibold text-text-muted">Geliştirici</p>
              <button
                @click="openContact"
                class="w-full touch-target bg-bg rounded-xl p-4 flex items-center justify-center hover:ring-1 hover:ring-primary transition-all"
              >
                <img
                  :src="logo"
                  alt="dagsolution"
                  class="h-8 w-auto"
                />
              </button>

              <p class="text-xs text-text-muted text-center pt-2">Sürüm 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease;
}
.panel-enter-active > :last-child,
.panel-leave-active > :last-child {
  transition: transform 0.3s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
.panel-enter-from > :last-child,
.panel-leave-to > :last-child {
  transform: translateX(100%);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ActiveChairCard from './ActiveChairCard.vue'
import QueueList from './QueueList.vue'
import QuickAddBottomSheet from './QuickAddBottomSheet.vue'
import HistoryView from './HistoryView.vue'
import SettingsPanel from './SettingsPanel.vue'

const isLight = ref(false)
const activeTab = ref<'queue' | 'history'>('queue')
const showSettings = ref(false)
const profileName = ref('')

const PROFILE_KEY = 'kuaförüm:profile'
const THEME_KEY = 'berber:theme'

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      profileName.value = p.name ?? ''
    }
  } catch { /* ignore */ }
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  let msg: string
  if (hour < 12) msg = 'Günaydın'
  else if (hour < 18) msg = 'İyi günler'
  else msg = 'İyi akşamlar'
  return profileName.value ? `${msg}, ${profileName.value}` : 'Sıra Yönetimi'
})

onMounted(() => {
  loadProfile()
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light') {
      isLight.value = true
      document.documentElement.classList.add('light')
      updateThemeColor(true)
    }
  } catch { /* ignore */ }
})

function toggleTheme() {
  isLight.value = !isLight.value
  document.documentElement.classList.toggle('light')
  try {
    localStorage.setItem('berber:theme', isLight.value ? 'light' : 'dark')
  } catch { /* ignore */ }
  updateThemeColor(isLight.value)
}

function updateThemeColor(light: boolean) {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', light ? '#F5F5F5' : '#121212')
}
</script>

<template>
  <div class="min-h-dvh bg-bg p-4 pb-24 transition-colors">
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-primary">Kuaförüm</h1>
        <p class="text-sm text-text-muted">{{ greeting }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleTheme"
          class="touch-target w-10 h-10 flex items-center justify-center rounded-xl bg-surface text-text-muted hover:text-primary transition-colors text-lg"
          :title="isLight ? 'Koyu tema' : 'Aydınlık tema'"
        >
          {{ isLight ? '🌙' : '☀️' }}
        </button>
        <button
          @click="showSettings = true"
          class="touch-target w-10 h-10 flex items-center justify-center rounded-xl bg-surface text-text-muted hover:text-primary transition-colors text-lg"
          title="Ayarlar"
        >
          ⚙
        </button>
      </div>
    </header>

    <div class="flex gap-2 mb-6">
      <button
        @click="activeTab = 'queue'"
        class="flex-1 touch-target rounded-xl font-semibold transition-all py-3"
        :class="activeTab === 'queue'
          ? 'bg-primary text-black'
          : 'bg-surface text-text-muted'"
      >
        Sıra
      </button>
      <button
        @click="activeTab = 'history'"
        class="flex-1 touch-target rounded-xl font-semibold transition-all py-3"
        :class="activeTab === 'history'
          ? 'bg-primary text-black'
          : 'bg-surface text-text-muted'"
      >
        Geçmiş
      </button>
    </div>

    <template v-if="activeTab === 'queue'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div class="space-y-4">
          <ActiveChairCard />
          <div class="hidden lg:block">
            <QuickAddBottomSheet />
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-text-muted">Sırada Bekleyenler</h2>
          <QueueList />
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 p-4 pb-6 lg:hidden z-30">
        <QuickAddBottomSheet />
      </div>
    </template>

    <template v-else>
      <HistoryView />
    </template>

    <SettingsPanel v-model:show="showSettings" @close="loadProfile" />
  </div>
</template>

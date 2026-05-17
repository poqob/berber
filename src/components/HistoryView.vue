<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueueStore } from '../stores/queueStore'

const store = useQueueStore()

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dateFilter = ref<'today' | 'yesterday' | 'all' | 'custom'>('today')
const customDate = ref(getToday())

const filteredList = computed(() => {
  const all = store.completedCustomers
  if (dateFilter.value === 'all') return all

  const targetDate = dateFilter.value === 'yesterday' ? getYesterday() : customDate.value
  const start = new Date(targetDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start.getTime() + 86400000)

  return all.filter(c => {
    const t = c.completedAt ?? c.joinedAt
    return t >= start.getTime() && t < end.getTime()
  })
})

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

function calcDuration(c: { joinedAt: number; chairStartedAt: number | null; completedAt: number | null }): string {
  const start = c.chairStartedAt ?? c.joinedAt
  const end = c.completedAt ?? Date.now()
  const minutes = Math.floor((end - start) / 60000)
  if (minutes < 60) return `${minutes} dk`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}s ${m}dk`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <button
        @click="dateFilter = 'today'"
        class="touch-target rounded-full px-4 py-2 text-sm font-medium transition-all border-2"
        :class="dateFilter === 'today'
          ? 'bg-primary text-black border-primary'
          : 'bg-transparent text-text-muted border-chip-border'"
      >
        Bugün
      </button>
      <button
        @click="dateFilter = 'yesterday'"
        class="touch-target rounded-full px-4 py-2 text-sm font-medium transition-all border-2"
        :class="dateFilter === 'yesterday'
          ? 'bg-primary text-black border-primary'
          : 'bg-transparent text-text-muted border-chip-border'"
      >
        Dün
      </button>
      <button
        @click="dateFilter = 'all'"
        class="touch-target rounded-full px-4 py-2 text-sm font-medium transition-all border-2"
        :class="dateFilter === 'all'
          ? 'bg-primary text-black border-primary'
          : 'bg-transparent text-text-muted border-chip-border'"
      >
        Tümü
      </button>
      <label
        class="touch-target rounded-full px-4 py-2 text-sm font-medium transition-all border-2 cursor-pointer"
        :class="dateFilter === 'custom'
          ? 'bg-primary text-black border-primary'
          : 'bg-transparent text-text-muted border-chip-border'"
      >
        <input
          type="date"
          v-model="customDate"
          @change="dateFilter = 'custom'"
          class="opacity-0 absolute w-0 h-0"
        />
        {{ dateFilter === 'custom' ? customDate : 'Tarih Seç' }}
      </label>
    </div>

    <div v-if="filteredList.length === 0" class="text-center text-text-muted py-8">
      Bu tarihte tamamlanan müşteri yok
    </div>

    <div class="space-y-card-gap">
      <div
        v-for="customer in filteredList"
        :key="customer.id"
        class="card-surface"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="font-bold text-text-main truncate">{{ customer.name }}</p>
          <span
            class="shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
            :class="customer.status === 'completed'
              ? 'bg-success/20 text-success'
              : 'bg-destructive/20 text-destructive'"
          >
            {{ customer.status === 'completed' ? 'Tamamlandı' : 'İptal' }}
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-2">
          <span
            v-for="s in customer.services"
            :key="s"
            class="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary"
          >
            {{ s }}
          </span>
        </div>

        <div class="flex items-center gap-4 text-xs text-text-muted">
          <span>{{ formatDate(customer.joinedAt) }} {{ formatTime(customer.joinedAt) }}</span>
          <span v-if="customer.completedAt">{{ formatTime(customer.completedAt) }}</span>
          <span class="font-mono">{{ calcDuration(customer) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

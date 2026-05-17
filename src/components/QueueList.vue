<script setup lang="ts">
import { ref } from 'vue'
import { useQueueStore } from '../stores/queueStore'
import { useHaptics } from '../composables/useHaptics'
import QueueCard from './QueueCard.vue'
import type { Customer } from '../types/queue'

const store = useQueueStore()
const { trigger } = useHaptics()

const selectedIds = ref<Set<string>>(new Set())
const selecting = ref(false)

const infoCustomer = ref<Customer | null>(null)
const showInfo = ref(false)

function handleMoveToChair(id: string) {
  trigger('medium')
  store.moveToChair(id)
}

function handleSelect(id: string) {
  if (!selecting.value) {
    selecting.value = true
  }
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  if (next.size === 0) {
    selecting.value = false
  }
  selectedIds.value = next
}

function handleShowInfo(id: string) {
  const customer = store.waitingList.find(c => c.id === id)
  if (customer) {
    infoCustomer.value = customer
    showInfo.value = true
  }
}

function cancelSelection() {
  selecting.value = false
  selectedIds.value = new Set()
}

function removeSelected() {
  if (selectedIds.value.size === 0) return
  trigger('medium')
  store.cancelCustomers(Array.from(selectedIds.value))
  cancelSelection()
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div>
    <div v-if="selecting" class="flex items-center justify-between mb-3 px-1">
      <span class="text-sm text-text-muted">{{ selectedIds.size }} müşteri seçili</span>
    </div>

    <div v-if="!selecting && store.waitingList.length === 0" class="text-center text-text-muted py-8">
      Sırada bekleyen müşteri yok
    </div>

    <div class="space-y-card-gap">
      <QueueCard
        v-for="customer in store.waitingList"
        :key="customer.id"
        :customer="customer"
        :selected="selectedIds.has(customer.id)"
        :selecting="selecting"
        @move-to-chair="handleMoveToChair"
        @select="handleSelect"
        @show-info="handleShowInfo"
      />
    </div>

    <Transition name="bar">
      <div
        v-if="selecting && selectedIds.size > 0"
        class="fixed bottom-0 left-0 right-0 p-4 pb-6 z-40"
      >
        <div class="flex gap-3 max-w-lg mx-auto">
          <button
            @click="cancelSelection"
            class="flex-1 touch-target bg-surface text-text-main font-bold rounded-xl transition-transform active:scale-95 border border-border-color"
          >
            Vazgeç
          </button>
          <button
            @click="removeSelected"
            class="flex-1 touch-target bg-destructive text-white font-bold rounded-xl transition-transform active:scale-95"
          >
            {{ selectedIds.size }} Müşteriyi Çıkar
          </button>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="showInfo && infoCustomer"
          class="fixed inset-0 z-50 flex items-end justify-center"
        >
          <div
            class="absolute inset-0 bg-overlay"
            @click="showInfo = false"
          />

          <div class="relative w-full max-w-lg bg-surface rounded-t-2xl p-6 pb-8">
            <div class="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6" />

            <h2 class="text-xl font-bold mb-1 text-text-main">{{ infoCustomer.name }}</h2>

            <div class="space-y-4 mt-4">
              <div v-if="infoCustomer.phone" class="flex gap-2">
                <a
                  :href="`tel:${infoCustomer.phone}`"
                  class="flex-1 touch-target bg-primary/20 text-primary rounded-xl py-3 text-center font-semibold"
                >
                  Ara
                </a>
                <a
                  :href="`https://wa.me/${infoCustomer.phone.replace(/^0/, '90')}?text=${encodeURIComponent('Sıranız gelmek üzere, dükkana geçebilirsiniz.')}`"
                  target="_blank"
                  class="flex-1 touch-target bg-green-900/30 text-green-400 rounded-xl py-3 text-center font-semibold"
                >
                  WhatsApp
                </a>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="s in infoCustomer.services"
                  :key="s"
                  class="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary"
                >
                  {{ s }}
                </span>
              </div>

              <div class="text-sm text-text-muted space-y-1">
                <p>Sıraya giriş: {{ formatTime(infoCustomer.joinedAt) }}</p>
                <p>Sıra numarası: {{ infoCustomer.id.slice(0, 8) }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.bar-enter-active,
.bar-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

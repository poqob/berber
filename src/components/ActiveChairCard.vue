<script setup lang="ts">
import { watch } from 'vue'
import { useQueueStore } from '../stores/queueStore'
import { useTimer } from '../composables/useTimer'
import { useHaptics } from '../composables/useHaptics'

const store = useQueueStore()
const { elapsed, start, stop, reset, format } = useTimer()
const { trigger } = useHaptics()

watch(() => store.activeCustomer, (customer) => {
  if (customer) {
    start()
  } else {
    stop()
  }
}, { immediate: true })

function finishService() {
  if (!store.activeCustomer) return
  trigger('medium')
  store.finishService(store.activeCustomer.id)
  reset()
}
</script>

<template>
  <div class="card-surface">
    <template v-if="store.activeCustomer">
      <div class="flex items-center justify-between mb-3">
        <div class="min-w-0 flex-1">
          <p class="text-lg font-bold truncate">{{ store.activeCustomer.name }}</p>
          <p class="text-sm text-text-muted">{{ store.activeCustomer.services.join(', ') }}</p>
        </div>

        <div class="text-3xl font-bold text-primary tabular-nums ml-4 shrink-0">
          {{ format(elapsed) }}
        </div>
      </div>

      <button
        @click="finishService"
        class="btn-destructive w-full py-5 text-xl"
      >
        HİZMETİ BİTİR
      </button>
    </template>

    <template v-else>
      <div class="text-center text-text-muted py-8">
        <p class="text-lg mb-1">Koltuk Boş</p>
        <p class="text-sm">Sıradaki müşteriyi koltuğa alın</p>
      </div>
    </template>
  </div>
</template>

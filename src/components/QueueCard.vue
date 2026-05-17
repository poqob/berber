<script setup lang="ts">
import { ref } from 'vue'
import type { Customer } from '../types/queue'
import { useHaptics } from '../composables/useHaptics'

const props = defineProps<{
  customer: Customer
  selected: boolean
  selecting: boolean
}>()

const emit = defineEmits<{
  (e: 'move-to-chair', id: string): void
  (e: 'select', id: string): void
  (e: 'show-info', id: string): void
}>()

const { trigger } = useHaptics()

const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isLongPressed = ref(false)

function startLongPress() {
  cancelLongPress()
  longPressTimer.value = setTimeout(() => {
    isLongPressed.value = true
    trigger('medium')
    emit('select', props.customer.id)
  }, 500)
}

function cancelLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function handleCardClick() {
  if (isLongPressed.value) {
    isLongPressed.value = false
    return
  }
  if (props.selecting) {
    emit('select', props.customer.id)
  } else {
    emit('show-info', props.customer.id)
  }
}

function call() {
  trigger()
  window.location.href = `tel:${props.customer.phone}`
}

function sendWhatsApp() {
  trigger()
  const msg = encodeURIComponent('Sıranız gelmek üzere, dükkana geçebilirsiniz.')
  window.open(`https://wa.me/${props.customer.phone.replace(/^0/, '90')}?text=${msg}`, '_blank')
}

function moveToChair() {
  trigger('medium')
  emit('move-to-chair', props.customer.id)
}
</script>

<template>
  <div
    class="card-surface flex items-center gap-3 select-none transition-all"
    :class="[
      selected ? 'ring-2 ring-primary' : '',
      selecting ? 'cursor-pointer' : ''
    ]"
    @click="handleCardClick"
    @touchstart="startLongPress"
    @touchend="cancelLongPress"
    @touchmove="cancelLongPress"
  >
    <div v-if="selecting" class="shrink-0">
      <div
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        :class="selected ? 'bg-primary border-primary' : 'border-gray-500'"
      >
        <span v-if="selected" class="text-black text-sm font-bold leading-none">✓</span>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <p class="font-bold text-base truncate text-text-main">{{ customer.name }}</p>
      <p class="text-sm text-text-muted truncate">{{ customer.services.join(', ') }}</p>
    </div>

    <div class="flex items-center gap-2 shrink-0" @click.stop>
      <button
        v-if="customer.phone && !selecting"
        @click="call"
        class="touch-target flex items-center justify-center bg-primary/20 text-primary rounded-xl px-3 text-sm font-semibold"
        title="Ara"
      >
        Ara
      </button>

      <button
        v-if="customer.phone && !selecting"
        @click="sendWhatsApp"
        class="touch-target flex items-center justify-center bg-green-900/30 text-green-400 rounded-xl px-3 text-sm font-semibold"
        title="WhatsApp"
      >
        WP
      </button>

      <button
        v-if="!selecting"
        @click="moveToChair"
        class="touch-target flex items-center justify-center bg-success/20 text-success rounded-xl px-3 text-sm font-semibold"
        title="Koltuğa Al"
      >
        Al
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-surface {
  touch-action: manipulation;
}
</style>

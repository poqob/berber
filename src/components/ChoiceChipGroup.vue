<script setup lang="ts">
import type { ServiceType } from '../types/queue'
import { SERVICE_OPTIONS } from '../types/queue'

const model = defineModel<ServiceType[]>({ required: true })

function toggle(value: ServiceType) {
  if (model.value.includes(value)) {
    model.value = model.value.filter(v => v !== value)
  } else {
    model.value = [...model.value, value]
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in SERVICE_OPTIONS"
      :key="opt.value"
      @click="toggle(opt.value)"
      class="touch-target rounded-full px-4 py-2 text-sm font-medium transition-all border-2"
      :class="model.includes(opt.value)
        ? 'bg-primary text-black border-primary'
        : 'bg-transparent text-text-muted border-chip-border active:border-primary'"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

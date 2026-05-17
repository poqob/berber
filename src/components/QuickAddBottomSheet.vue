<script setup lang="ts">
import { ref } from 'vue'
import type { ServiceType } from '../types/queue'
import { useQueueStore } from '../stores/queueStore'
import { useHaptics } from '../composables/useHaptics'
import ChoiceChipGroup from './ChoiceChipGroup.vue'

const store = useQueueStore()
const { trigger } = useHaptics()

const name = ref('')
const phone = ref('')
const services = ref<ServiceType[]>(['Saç'])
const show = ref(false)

function submit() {
  const trimmedName = name.value.trim()
  if (!trimmedName || services.value.length === 0) return

  trigger('medium')
  store.addCustomer(trimmedName, phone.value.trim(), services.value)
  name.value = ''
  phone.value = ''
  services.value = ['Saç']
  show.value = false
}
</script>

<template>
  <div>
    <button
      @click="show = true"
      class="btn-primary flex items-center justify-center gap-2 w-full py-4 text-lg"
    >
      <span class="text-2xl leading-none">+</span>
      Müşteri Ekle
    </button>

    <Teleport to="body">
      <Transition name="sheet">
        <div
          v-if="show"
          class="fixed inset-0 z-50 flex items-end justify-center"
        >
          <div
            class="absolute inset-0 bg-overlay"
            @click="show = false"
          />

          <div class="relative w-full max-w-lg bg-surface rounded-t-2xl p-6 pb-8">
            <div class="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6" />

            <h2 class="text-xl font-bold mb-4 text-text-main">Müşteri Ekle</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm text-text-muted mb-1">Ad Soyad</label>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Müşteri adı"
                  class="w-full bg-bg text-text-main rounded-xl px-4 py-3 touch-target outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm text-text-muted mb-1">Telefon (opsiyonel)</label>
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  class="w-full bg-bg text-text-main rounded-xl px-4 py-3 touch-target outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-sm text-text-muted mb-1">Hizmetler</label>
                <ChoiceChipGroup v-model="services" />
              </div>

              <button
                @click="submit"
                :disabled="!name.trim() || services.length === 0"
                class="btn-primary w-full py-4 text-lg mt-2"
              >
                Sıraya Ekle
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
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

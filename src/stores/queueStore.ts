import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, ServiceType } from '../types/queue'

const STORAGE_KEY = 'berber:queue'

function loadFromStorage(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return data.map((c: any) => ({
      ...c,
      services: Array.isArray(c.services) ? c.services : (c.service ? [c.service] : []),
      completedAt: c.completedAt ?? null,
    }))
  } catch {
    return []
  }
}

function saveToStorage(customers: Customer[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
  } catch {
    /* storage full or unavailable */
  }
}

export const useQueueStore = defineStore('queue', () => {
  const customers = ref<Customer[]>(loadFromStorage())

  const activeCustomer = computed(() =>
    customers.value.find(c => c.status === 'active') ?? null
  )

  const waitingList = computed(() =>
    customers.value
      .filter(c => c.status === 'waiting')
      .sort((a, b) => a.joinedAt - b.joinedAt)
  )

  const completedCustomers = computed(() =>
    customers.value
      .filter(c => c.status === 'completed' || c.status === 'cancelled')
      .sort((a, b) => (b.completedAt ?? b.joinedAt) - (a.completedAt ?? a.joinedAt))
  )

  function generateId(): string {
    try { return crypto.randomUUID() } catch { return Date.now().toString(36) + Math.random().toString(36).slice(2, 9) }
  }

  function addCustomer(name: string, phone: string, services: ServiceType[]) {
    const customer: Customer = {
      id: generateId(),
      name,
      phone,
      services,
      joinedAt: Date.now(),
      status: 'waiting',
      chairStartedAt: null,
      completedAt: null,
    }
    customers.value.push(customer)
    saveToStorage(customers.value)
  }

  function moveToChair(id: string) {
    const customer = customers.value.find(c => c.id === id)
    if (customer) {
      customer.status = 'active'
      customer.chairStartedAt = Date.now()
      saveToStorage(customers.value)
    }
  }

  function finishService(id: string) {
    const customer = customers.value.find(c => c.id === id)
    if (customer) {
      customer.status = 'completed'
      customer.completedAt = Date.now()
      customer.chairStartedAt = null
      saveToStorage(customers.value)
    }
  }

  function cancelCustomer(id: string) {
    const customer = customers.value.find(c => c.id === id)
    if (customer) {
      customer.status = 'cancelled'
      customer.completedAt = Date.now()
      customer.chairStartedAt = null
      saveToStorage(customers.value)
    }
  }

  function cancelCustomers(ids: string[]) {
    const now = Date.now()
    for (const id of ids) {
      const customer = customers.value.find(c => c.id === id)
      if (customer && customer.status === 'waiting') {
        customer.status = 'cancelled'
        customer.completedAt = now
        customer.chairStartedAt = null
      }
    }
    saveToStorage(customers.value)
  }

  function removeCustomer(id: string) {
    customers.value = customers.value.filter(c => c.id !== id)
    saveToStorage(customers.value)
  }

  function getCustomersByDate(date: string): Customer[] {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start.getTime() + 86400000)
    return completedCustomers.value.filter(c => {
      const t = c.completedAt ?? c.joinedAt
      return t >= start.getTime() && t < end.getTime()
    })
  }

  return {
    customers,
    activeCustomer,
    waitingList,
    completedCustomers,
    addCustomer,
    moveToChair,
    finishService,
    cancelCustomer,
    cancelCustomers,
    removeCustomer,
    getCustomersByDate,
  }
})

export interface Customer {
  id: string
  name: string
  phone: string
  services: ServiceType[]
  joinedAt: number
  status: QueueStatus
  chairStartedAt: number | null
  completedAt: number | null
}

export type ServiceType = 'Saç' | 'Sakal' | 'Yıkama' | 'Bakım'

export type QueueStatus = 'waiting' | 'active' | 'completed' | 'cancelled'

export const SERVICE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: 'Saç', value: 'Saç' },
  { label: 'Sakal', value: 'Sakal' },
  { label: 'Yıkama', value: 'Yıkama' },
  { label: 'Bakım', value: 'Bakım' },
]

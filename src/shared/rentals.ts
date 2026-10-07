import type { HomeId, Iso, MemberId } from './ids.ts'

export interface RentalLease {
  homeId: HomeId
  ownerId: MemberId
  tenantUsername: string
  weeklyRent: number
  startedAt: Iso
  nextDueAt: Iso
  lastPaidAt: Iso | null
  active: boolean
}

import type { HomeId, Iso, MemberId } from './ids.ts'

export interface PropertySaleOffer {
  homeId: HomeId
  sellerId: MemberId
  buyerUsername: string
  price: number
  createdAt: Iso
  expiresAt: Iso
}

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

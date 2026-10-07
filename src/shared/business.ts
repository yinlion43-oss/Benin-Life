import type { Iso } from './ids.ts'

export const BUSINESS_TYPES = ['food-stall', 'provisions-shop', 'tailoring-workshop'] as const
export type BusinessType = (typeof BUSINESS_TYPES)[number]

export interface BusinessDay { at: Iso; supplies: number; sales: number; profit: number }
export interface BusinessEmployee {
  username: string
  salary: number
  hiredAt: Iso
  lastPaidAt: Iso | null
  active: boolean
}

export interface PlayerBusiness {
  name: string
  type: BusinessType
  daysOperated: number
  totalSales: number
  totalProfit: number
  recentDays: BusinessDay[]
  employees: BusinessEmployee[]
}

export const BUSINESS_TERMS = {
  setup: 100, supplies: 20, salesMin: 25, salesMax: 55,
  minimumSalary: 10, payrollIntervalDays: 7,
} as const

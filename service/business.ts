// A small, single-player business loop. Sales are explicitly simulated game activity.
import type { MemberId } from '../src/shared/ids.ts'
import { iso } from '../src/shared/ids.ts'
import { BUSINESS_TERMS, BUSINESS_TYPES } from '../src/shared/business.ts'
import type { BusinessDay, BusinessType, PlayerBusiness } from '../src/shared/business.ts'
import { WorldError } from '../src/shared/model.ts'
import type { World } from './kernel.ts'
import { beninLifeReady } from './members.ts'
import { empty, obj, oneOf, str } from './parse.ts'
import { addPoints, careerPoints, spendPoints } from './work.ts'

interface BusinessState { owners: Record<string, PlayerBusiness> }
const state = (world: World): BusinessState => world.slice<BusinessState>('business', () => ({ owners: {} }))
const owned = (world: World, memberId: MemberId): PlayerBusiness | null => state(world).owners[memberId] ?? null
function ready(world: World, memberId: MemberId): void {
  if (!beninLifeReady(world, memberId)) throw new WorldError('conflict', 'Finish your Benin Life character setup first.')
}
function view(world: World, memberId: MemberId): { business: PlayerBusiness | null; balance: number } {
  return { business: owned(world, memberId), balance: careerPoints(world, memberId) }
}

export function registerBusiness(world: World): void {
  world.register('business.get', empty, ctx => { ready(world, ctx.memberId); return view(world, ctx.memberId) })
  world.register('business.create', value => {
    const raw = obj(value)
    return { name: str(raw, 'name', { min: 2, max: 40 }), type: oneOf(raw, 'type', BUSINESS_TYPES) }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    if (owned(world, ctx.memberId)) throw new WorldError('conflict', 'You already run a business.')
    spendPoints(world, ctx.memberId, BUSINESS_TERMS.setup, { kind: 'business', text: 'Business setup' })
    state(world).owners[ctx.memberId] = { name: input.name, type: input.type, daysOperated: 0, totalSales: 0, totalProfit: 0, recentDays: [] }
    world.touch()
    return view(world, ctx.memberId)
  })
  world.register('business.operate', empty, ctx => {
    ready(world, ctx.memberId)
    const business = owned(world, ctx.memberId)
    if (!business) throw new WorldError('conflict', 'Start a business before opening for the day.')
    spendPoints(world, ctx.memberId, BUSINESS_TERMS.supplies, { kind: 'business', text: `${business.name}: supplies` })
    const sales = BUSINESS_TERMS.salesMin + Math.floor(Math.random() * (BUSINESS_TERMS.salesMax - BUSINESS_TERMS.salesMin + 1))
    addPoints(world, ctx.memberId, sales, { kind: 'business', text: `${business.name}: simulated sales` })
    const day: BusinessDay = { at: iso(ctx.now), supplies: BUSINESS_TERMS.supplies, sales, profit: sales - BUSINESS_TERMS.supplies }
    business.daysOperated++
    business.totalSales += sales
    business.totalProfit += day.profit
    business.recentDays.unshift(day)
    if (business.recentDays.length > 10) business.recentDays.length = 10
    world.touch()
    return { ...view(world, ctx.memberId), day }
  })
}

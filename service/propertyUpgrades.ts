import type { HomeId, MemberId } from '../src/shared/ids.ts'
import { WorldError } from '../src/shared/model.ts'
import { empty, obj, str } from './parse.ts'
import type { World } from './kernel.ts'
import { beninLifeReady, record } from './members.ts'
import { careerPoints, spendPoints } from './work.ts'

export const PROPERTY_UPGRADES = {
  furnishing: { label: 'Premium furnishings', price: 500, rentBonus: 50 },
  security: { label: 'Gated security + CCTV', price: 700, rentBonus: 75 },
  power: { label: 'Solar + generator backup', price: 900, rentBonus: 100 },
  smart: { label: 'Smart-home package', price: 650, rentBonus: 75 },
  parking: { label: 'Secure premium parking', price: 400, rentBonus: 40 },
  pool: { label: 'Swimming pool', price: 1200, rentBonus: 125 },
} as const
export type PropertyUpgradeId = keyof typeof PROPERTY_UPGRADES
interface UpgradeState { homes: Record<string, Partial<Record<PropertyUpgradeId, boolean>>> }
const state = (world: World): UpgradeState => world.slice<UpgradeState>('propertyUpgrades', () => ({ homes: {} }))
const valid = (id: string): id is PropertyUpgradeId => id in PROPERTY_UPGRADES

export function propertyRentBonus(world: World, homeId: HomeId): number {
  const upgrades = state(world).homes[String(homeId)] ?? {}
  return (Object.keys(upgrades) as PropertyUpgradeId[]).reduce((sum, id) => upgrades[id] ? sum + PROPERTY_UPGRADES[id].rentBonus : sum, 0)
}
export function registerPropertyUpgrades(world: World): void {
  world.register('property.upgrade', value => {
    const raw = obj(value)
    const homeId = str(raw, 'homeId', { min: 1, max: 80 }) as HomeId
    const upgrade = str(raw, 'upgrade', { min: 1, max: 30 })
    return { homeId, upgrade }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    const profile = record(world, ctx.memberId).profile
    if (!profile.ownedHomeIds?.includes(input.homeId) && profile.homeId !== input.homeId) throw new WorldError('forbidden', 'You do not own this property.')
    if (!valid(input.upgrade)) throw new WorldError('invalid', 'That property upgrade is not available.')
    const owned = state(world).homes[String(input.homeId)] ??= {}
    if (owned[input.upgrade]) throw new WorldError('conflict', 'This upgrade is already installed.')
    const item = PROPERTY_UPGRADES[input.upgrade]
    if (careerPoints(world, ctx.memberId) < item.price) throw new WorldError('conflict', 'Insufficient bank balance for this upgrade.')
    spendPoints(world, ctx.memberId, item.price)
    owned[input.upgrade] = true
    world.touch()
    return { homeId: input.homeId, upgrade: input.upgrade, installed: Object.keys(owned), balance: careerPoints(world, ctx.memberId) }
  })
  world.register('property.upgrades', value => ({ homeId: str(obj(value), 'homeId', { min: 1, max: 80 }) as HomeId }), (ctx, input) => {
    ready(world, ctx.memberId)
    return { homeId: input.homeId, upgrades: state(world).homes[String(input.homeId)] ?? {} }
  })
}
function ready(world: World, memberId: MemberId): void {
  if (!beninLifeReady(world, memberId)) throw new WorldError('conflict', 'Finish your Benin Life character setup first.')
}

import type { HomeId, MemberId } from '../src/shared/ids.ts'
import type { RentalLease } from '../src/shared/rentals.ts'
import type { World } from './kernel.ts'
import { WorldError } from '../src/shared/model.ts'
import { iso } from '../src/shared/ids.ts'
import { empty, num, obj, str } from './parse.ts'
import { careerPoints } from './work.ts'
import { memberByBeninUsername, beninLifeReady, record } from './members.ts'
import { transferCoinsByUsername } from './travel.ts'
import { currentHomeRoom } from './homes.ts'
import { propertyRentBonus } from './propertyUpgrades.ts'

interface RentalState { leases: Record<string, RentalLease> }
const state = (world: World): RentalState => world.slice<RentalState>('rentals', () => ({ leases: {} }))
const key = (homeId: HomeId) => String(homeId)
const normalize = (value: string): string | null => /^@?[A-Za-z0-9][A-Za-z0-9_]{2,19}$/.test(value.trim()) ? (value.trim().startsWith('@') ? value.trim() : '@' + value.trim()) : null
const week = 7 * 86_400_000
const effectiveRent = (world: World, lease: RentalLease): number => lease.weeklyRent + propertyRentBonus(world, lease.homeId)

export function cancelRentalForHome(world: World, homeId: HomeId): void { const lease = state(world).leases[key(homeId)]; if (lease?.active) { lease.active = false; world.touch() } }

export function registerRentals(world: World): void {
  world.onTick(now => {
    for (const lease of Object.values(state(world).leases)) {
      if (!lease.active || Date.parse(lease.nextDueAt) > now) continue
      try {
        const tenantId = memberByBeninUsername(world, lease.tenantUsername)
        if (!tenantId) { lease.active = false; continue }
        if (careerPoints(world, tenantId) < effectiveRent(world, lease)) continue
        transferCoinsByUsername(world, tenantId, record(world, lease.ownerId).profile.username!, effectiveRent(world, lease), `Rent · ${lease.homeId}`)
        lease.lastPaidAt = iso(now)
        lease.nextDueAt = iso(now + week)
        world.touch()
      } catch (error) {
        console.error('[rentals] automatic rent payment failed', error)
      }
    }
  })

  world.register('rental.list', value => {
    const raw = obj(value)
    return { weeklyRent: num(raw, 'weeklyRent', { integer: true, min: 1, max: 1_000_000 }) }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    const homeId = record(world, ctx.memberId).profile.homeId
    const existing = state(world).leases[key(homeId)]
    if (existing?.active) throw new WorldError('conflict', 'Your home is already rented.')
    const tenant = record(world, ctx.memberId).profile.username
    if (!tenant) throw new WorldError('conflict', 'Set up your unique @username before listing a property.')
    state(world).leases[key(homeId)] = {
      homeId, ownerId: ctx.memberId, tenantUsername: '', weeklyRent: input.weeklyRent,
      startedAt: iso(ctx.now), nextDueAt: iso(ctx.now), lastPaidAt: null, active: true,
    }
    // Listing is active but has no tenant until accepted by a player.
    world.touch()
    return { lease: state(world).leases[key(homeId)] }
  })

  world.register('rental.offer', value => {
    const raw = obj(value)
    return {
      homeId: str(raw, 'homeId', { min: 1, max: 80 }) as HomeId,
      tenantUsername: str(raw, 'tenantUsername', { min: 3, max: 21 }),
    }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    const lease = state(world).leases[key(input.homeId)]
    if (!lease?.active || lease.ownerId !== ctx.memberId) throw new WorldError('not_found', 'That property is not an active rental listing.')
    const username = normalize(input.tenantUsername)
    if (!username) throw new WorldError('invalid', 'Enter a valid @username.')
    if (!memberByBeninUsername(world, username)) throw new WorldError('not_found', 'No completed Benin Life character uses that @username.')
    if (username === record(world, ctx.memberId).profile.username) throw new WorldError('invalid', 'You cannot rent your property to yourself.')
    lease.tenantUsername = username
    lease.nextDueAt = iso(ctx.now + week)
    lease.startedAt = iso(ctx.now)
    lease.lastPaidAt = null
    world.touch()
    return { lease }
  })

  world.register('rental.accept', value => ({ homeId: str(obj(value), 'homeId', { min: 1, max: 80 }) as HomeId }), (ctx, input) => {
    ready(world, ctx.memberId)
    const lease = state(world).leases[key(input.homeId)]
    if (!lease?.active || !lease.tenantUsername) throw new WorldError('not_found', 'That rental is not available.')
    const username = record(world, ctx.memberId).profile.username
    if (!username || username.toLowerCase() !== lease.tenantUsername.toLowerCase()) throw new WorldError('forbidden', 'This rental was offered to another @username.')
    if (currentHomeRoom(world, ctx.memberId)) throw new WorldError('conflict', 'Leave your current home before accepting a rental.')
    world.touch()
    return { lease }
  })

  world.register('rental.pay', empty, ctx => {
    ready(world, ctx.memberId)
    const username = record(world, ctx.memberId).profile.username
    if (!username) throw new WorldError('conflict', 'Set up your unique @username first.')
    const lease = Object.values(state(world).leases).find(item => item.active && item.tenantUsername.toLowerCase() === username.toLowerCase())
    if (!lease) throw new WorldError('not_found', 'You have no active rental.')
    if (careerPoints(world, ctx.memberId) < effectiveRent(world, lease)) throw new WorldError('conflict', 'Insufficient bank balance for rent.')
    transferCoinsByUsername(world, ctx.memberId, record(world, lease.ownerId).profile.username!, effectiveRent(world, lease), `Rent · ${lease.homeId}`)
    lease.lastPaidAt = iso(ctx.now); lease.nextDueAt = iso(ctx.now + week)
    world.touch()
    return { lease, balance: careerPoints(world, ctx.memberId) }
  })

  world.register('rental.end', empty, ctx => {
    ready(world, ctx.memberId)
    const username = record(world, ctx.memberId).profile.username
    const lease = Object.values(state(world).leases).find(item => item.active && (item.ownerId === ctx.memberId || (!!username && item.tenantUsername.toLowerCase() === username.toLowerCase())))
    if (!lease) throw new WorldError('not_found', 'No active rental found.')
    lease.active = false
    world.touch()
    return { lease }
  })

  world.register('rental.mine', empty, ctx => {
    ready(world, ctx.memberId)
    const username = record(world, ctx.memberId).profile.username?.toLowerCase()
    return {
      owned: Object.values(state(world).leases).filter(item => item.ownerId === ctx.memberId),
      rented: username ? Object.values(state(world).leases).filter(item => item.active && item.tenantUsername.toLowerCase() === username) : [],
    }
  })
}

function ready(world: World, memberId: MemberId): void {
  if (!beninLifeReady(world, memberId)) throw new WorldError('conflict', 'Finish your Benin Life character setup first.')
}

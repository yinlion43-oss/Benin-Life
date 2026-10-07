import type { HomeId } from '../src/shared/ids.ts'
import { iso } from '../src/shared/ids.ts'
import { WorldError } from '../src/shared/model.ts'
import { empty, num, obj, str } from './parse.ts'
import type { World } from './kernel.ts'
import { beninLifeReady, memberByBeninUsername, record } from './members.ts'
import { careerPoints } from './work.ts'
import { transferCoinsByUsername } from './travel.ts'
import { transferHomeOwnership } from './homes.ts'
import { cancelRentalForHome } from './rentals.ts'

const state = (world: World) => world.slice<{ sales: Record<string, any> }>('propertySales', () => ({ sales: {} }))
const key = (homeId: HomeId) => String(homeId)
const normalize = (value: string): string | null => /^@?[A-Za-z0-9][A-Za-z0-9_]{2,19}$/.test(value.trim()) ? (value.trim().startsWith('@') ? value.trim() : '@' + value.trim()) : null
const saleWindow = 24 * 60 * 60 * 1000

export function registerProperties(world: World): void {
  world.onTick(now => {
    for (const [homeId, offer] of Object.entries(state(world).sales)) if (Date.parse(offer.expiresAt) <= now) delete state(world).sales[homeId]
  })

  world.register('property.sellOffer', value => {
    const raw = obj(value)
    return { homeId: str(raw, 'homeId', { min: 1, max: 80 }) as HomeId, buyerUsername: str(raw, 'buyerUsername', { min: 3, max: 21 }), price: num(raw, 'price', { integer: true, min: 1, max: 1_000_000_000 }) }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    const username = normalize(input.buyerUsername)
    if (!username) throw new WorldError('invalid', 'Enter a valid @username.')
    const buyerId = memberByBeninUsername(world, username)
    if (!buyerId) throw new WorldError('not_found', 'No completed Benin Life character uses that @username.')
    if (buyerId === ctx.memberId) throw new WorldError('invalid', 'You cannot sell to yourself.')
    if (record(world, ctx.memberId).profile.homeId !== input.homeId) throw new WorldError('forbidden', 'You can only sell your current home.')
    cancelRentalForHome(world, input.homeId)
    state(world).sales[key(input.homeId)] = { homeId: input.homeId, sellerId: ctx.memberId, buyerUsername: username, price: input.price, createdAt: iso(ctx.now), expiresAt: iso(ctx.now + saleWindow) }
    world.touch()
    return { offer: state(world).sales[key(input.homeId)] }
  })

  world.register('property.acceptSale', value => ({ homeId: str(obj(value), 'homeId', { min: 1, max: 80 }) as HomeId }), (ctx, input) => {
    ready(world, ctx.memberId)
    const offer = state(world).sales[key(input.homeId)]
    if (!offer || Date.parse(offer.expiresAt) <= ctx.now) throw new WorldError('not_found', 'That property sale offer has expired.')
    const username = record(world, ctx.memberId).profile.username
    if (!username || username.toLowerCase() !== offer.buyerUsername.toLowerCase()) throw new WorldError('forbidden', 'This property was offered to another @username.')
    if (careerPoints(world, ctx.memberId) < offer.price) throw new WorldError('conflict', 'Insufficient bank balance for this property.')
    transferCoinsByUsername(world, ctx.memberId, record(world, offer.sellerId).profile.username!, offer.price, `Property purchase · ${offer.homeId}`)
    transferHomeOwnership(world, offer.sellerId, ctx.memberId, offer.homeId)
    delete state(world).sales[key(input.homeId)]
    world.touch()
    return { homeId: input.homeId, price: offer.price, balance: careerPoints(world, ctx.memberId) }
  })

  world.register('property.cancelSale', value => ({ homeId: str(obj(value), 'homeId', { min: 1, max: 80 }) as HomeId }), (ctx, input) => {
    ready(world, ctx.memberId)
    const offer = state(world).sales[key(input.homeId)]
    if (!offer || offer.sellerId !== ctx.memberId) throw new WorldError('not_found', 'No active sale offer exists for that property.')
    delete state(world).sales[key(input.homeId)]
    world.touch()
    return { cancelled: true }
  })

  world.register('property.mine', empty, ctx => {
    ready(world, ctx.memberId)
    const username = record(world, ctx.memberId).profile.username?.toLowerCase() ?? ''
    return {
      selling: Object.values(state(world).sales).filter(item => item.sellerId === ctx.memberId),
      buying: Object.values(state(world).sales).filter(item => item.buyerUsername.toLowerCase() === username),
    }
  })
}

function ready(world: World, memberId: import('../src/shared/ids.ts').MemberId): void {
  if (!beninLifeReady(world, memberId)) throw new WorldError('conflict', 'Finish your Benin Life character setup first.')
}

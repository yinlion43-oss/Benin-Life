// A small, single-player business loop. Sales are explicitly simulated game activity.
import type { MemberId } from '../src/shared/ids.ts'
import { iso } from '../src/shared/ids.ts'
import { BUSINESS_TERMS, BUSINESS_TYPES } from '../src/shared/business.ts'
import type { BusinessDay, BusinessType, PlayerBusiness, BusinessEmployee } from '../src/shared/business.ts'
import { WorldError } from '../src/shared/model.ts'
import type { World } from './kernel.ts'
import { beninLifeReady, memberByBeninUsername, record } from './members.ts'
import { transferNairaByUsername } from './travel.ts'
import { empty, obj, oneOf, str } from './parse.ts'
import { addPoints, careerPoints, spendPoints } from './work.ts'

interface BusinessState { owners: Record<string, PlayerBusiness> }
const state = (world: World): BusinessState => world.slice<BusinessState>('business', () => ({ owners: {} }))
const normalizeEmployeeUsername = (value: string): string | null => /^@?[A-Za-z0-9][A-Za-z0-9_]{2,19}$/.test(value.trim()) ? (value.trim().startsWith('@') ? value.trim() : `@${value.trim()}`) : null
const owned = (world: World, memberId: MemberId): PlayerBusiness | null => { const business = state(world).owners[memberId] ?? null; if (business) business.employees ??= []; return business }
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
    state(world).owners[ctx.memberId] = { name: input.name, type: input.type, daysOperated: 0, totalSales: 0, totalProfit: 0, recentDays: [], employees: [] }
    world.touch()
    return view(world, ctx.memberId)
  })
  const runPayroll = (memberId: MemberId, now: number): Array<{ username: string; amount: number }> => {
    const business = owned(world, memberId)
    if (!business) return []
    const due = business.employees.filter(employee => employee.active && (!employee.lastPaidAt || now - Date.parse(employee.lastPaidAt) >= BUSINESS_TERMS.payrollIntervalDays * 86_400_000))
    const total = due.reduce((sum, employee) => sum + employee.salary, 0)
    if (!due.length || careerPoints(world, memberId) < total) return []
    const paid: Array<{ username: string; amount: number }> = []
    for (const employee of due) {
      transferNairaByUsername(world, memberId, employee.username, employee.salary, `Payroll · ${business.name}`)
      employee.lastPaidAt = iso(now)
      paid.push({ username: employee.username, amount: employee.salary })
    }
    if (paid.length) world.touch()
    return paid
  }

  world.onTick(now => {
    for (const memberId of Object.keys(state(world).owners)) {
      try { runPayroll(memberId as MemberId, now) } catch (error) { console.error(`[business] payroll failed for ${memberId}`, error) }
    }
  })

  world.register('business.hire', value => {
    const raw = obj(value)
    const username = str(raw, 'username', { min: 3, max: 21 })
    const salary = Number(raw.salary)
    if (!Number.isSafeInteger(salary) || salary < BUSINESS_TERMS.minimumSalary) throw new WorldError('invalid', `Salary must be at least ${BUSINESS_TERMS.minimumSalary} coins per payroll.`)
    return { username, salary }
  }, (ctx, input) => {
    ready(world, ctx.memberId)
    const business = owned(world, ctx.memberId)
    if (!business) throw new WorldError('conflict', 'Start a business before hiring staff.')
    const username = normalizeEmployeeUsername(input.username)
    if (!username) throw new WorldError('invalid', 'Enter a valid @username.')
    const employeeId = memberByBeninUsername(world, username)
    if (!employeeId) throw new WorldError('not_found', 'No completed Benin Life character uses that @username.')
    if (employeeId === ctx.memberId) throw new WorldError('invalid', 'You cannot hire yourself.')
    if (business.employees.some(employee => employee.active && employee.username.toLowerCase() === username.toLowerCase())) throw new WorldError('conflict', 'That player is already employed by this business.')
    const employee: BusinessEmployee = { username: record(world, employeeId).profile.username!, salary: input.salary, hiredAt: iso(ctx.now), lastPaidAt: null, active: true }
    business.employees.push(employee)
    world.touch()
    return view(world, ctx.memberId)
  })

  world.register('business.fire', value => ({ username: str(obj(value), 'username', { min: 3, max: 21 }) }), (ctx, input) => {
    ready(world, ctx.memberId)
    const business = owned(world, ctx.memberId)
    if (!business) throw new WorldError('conflict', 'Start a business before managing staff.')
    const username = normalizeEmployeeUsername(input.username)
    if (!username) throw new WorldError('invalid', 'Enter a valid @username.')
    const employee = business.employees.find(item => item.active && item.username.toLowerCase() === username.toLowerCase())
    if (!employee) throw new WorldError('not_found', 'That employee was not found.')
    employee.active = false
    world.touch()
    return view(world, ctx.memberId)
  })

  world.register('business.payroll', empty, ctx => {
    ready(world, ctx.memberId)
    const business = owned(world, ctx.memberId)
    if (!business) throw new WorldError('conflict', 'Start a business before running payroll.')
    return { ...view(world, ctx.memberId), paid: runPayroll(ctx.memberId, ctx.now) }
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

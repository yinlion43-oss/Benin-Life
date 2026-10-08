<script setup lang="ts">
import { computed, ref } from 'vue'
import { BUSINESS_TERMS } from '../../shared/business.ts'
import type { BusinessType } from '../../shared/business.ts'
import { api, attempt, refreshPoints } from '../../state/app.ts'
import PanelPage from '../../ui/PanelPage.vue'
import StateView from '../../ui/StateView.vue'
import { useLoad } from '../../ui/useLoad.ts'

const { data, state, error, reload } = useLoad(() => api('business.get', {}))
const name = ref('')
const type = ref<BusinessType>('food-stall')
const busy = ref(false)
const result = ref('')
const employeeUsername = ref('')
const salary = ref<string | number>(BUSINESS_TERMS.minimumSalary)
const types: { id: BusinessType; label: string; detail: string; icon: string }[] = [
  { id: 'food-stall', label: 'Food stall', detail: 'Serve a busy street crowd.', icon: '🍲' },
  { id: 'provisions-shop', label: 'Provisions shop', detail: 'Stock everyday essentials.', icon: '🛒' },
  { id: 'tailoring-workshop', label: 'Tailoring workshop', detail: 'Make and mend clothes.', icon: '🧵' },
]
const chosen = computed(() => types.find(item => item.id === data.value?.business?.type) ?? types[0]!)

async function create(): Promise<void> {
  if (busy.value || !name.value.trim()) return
  busy.value = true
  result.value = ''
  const made = await attempt('business.create', { name: name.value.trim(), type: type.value })
  if (made) { data.value = made; name.value = ''; void refreshPoints() }
  busy.value = false
}

async function hire(): Promise<void> {
  if (busy.value || !employeeUsername.value.trim()) return
  busy.value = true; result.value = ''
  const hired = await attempt('business.hire', { username: employeeUsername.value.trim(), salary: Number(salary.value) })
  if (hired) { data.value = hired; employeeUsername.value = ''; result.value = 'Employee hired.' }
  busy.value = false
}

async function payroll(): Promise<void> {
  if (busy.value) return
  busy.value = true; result.value = ''
  const paid = await attempt('business.payroll', {})
  if (paid) { data.value = { business: paid.business, balance: paid.balance }; result.value = paid.paid.length ? `Payroll paid to ${paid.paid.length} employee${paid.paid.length === 1 ? '' : 's'}.` : 'No payroll was due yet.'; void refreshPoints() }
  busy.value = false
}

async function fire(username: string): Promise<void> {
  if (busy.value) return
  busy.value = true
  const updated = await attempt('business.fire', { username })
  if (updated) data.value = updated
  busy.value = false
}

async function operate(): Promise<void> {
  if (busy.value) return
  busy.value = true
  result.value = ''
  const opened = await attempt('business.operate', {})
  if (opened) {
    data.value = { business: opened.business, balance: opened.balance }
    result.value = `Sales +${opened.day.sales} naira · supplies −${opened.day.supplies} · day profit +${opened.day.profit}`
    void refreshPoints()
  }
  busy.value = false
}
</script>

<template>
  <PanelPage title="Businesses" subtitle="Build a small business in Benin City" wide>
    <p class="notice sky">Virtual naira economy only. Sales are simulated, and naira are virtual naira with no cash value.</p>
    <StateView v-if="state !== 'ready' || !data" :state="state === 'ready' ? 'loading' : state" :message="error" @retry="reload" />
    <template v-else-if="data.business">
      <section class="card stack">
        <div class="row">
          <span class="art" aria-hidden="true">{{ chosen.icon }}</span>
          <div class="grow"><h2>{{ data.business.name }}</h2><p class="muted small">{{ chosen.label }} · Benin City</p></div>
        </div>
        <dl class="figures">
          <div><dt>Game wallet</dt><dd>₦ {{ data.balance.toLocaleString() }}</dd></div>
          <div><dt>Days open</dt><dd>{{ data.business.daysOperated }}</dd></div>
          <div><dt>Total sales</dt><dd>₦ {{ data.business.totalSales.toLocaleString() }}</dd></div>
          <div><dt>Game profit</dt><dd>₦ {{ data.business.totalProfit.toLocaleString() }}</dd></div>
        </dl>
        <p>Open for a service day. The service charges {{ BUSINESS_TERMS.supplies }} naira for supplies, then records simulated sales between {{ BUSINESS_TERMS.salesMin }} and {{ BUSINESS_TERMS.salesMax }} naira.</p>
        <div class="row wrap">
          <button class="btn primary" type="button" :disabled="busy" @click="operate">{{ busy ? 'Working…' : 'Open for the day' }}</button>
          <button class="btn" type="button" :disabled="busy" @click="payroll">Run payroll</button>
        </div>
        <p v-if="result" class="notice leaf" role="status">{{ result }}</p>
      </section>
      <section class="card stack">
        <h2>Player staff</h2>
        <p class="small muted">Hire completed players by their unique @username. Salaries are paid from your bank balance every 7 days when payroll is due.</p>
        <form class="row wrap" @submit.prevent="hire">
          <input v-model="employeeUsername" maxlength="21" placeholder="@username" aria-label="Employee username" required>
          <input v-model="salary" type="number" :min="BUSINESS_TERMS.minimumSalary" step="1" aria-label="Salary per payroll" required>
          <button class="btn" type="submit" :disabled="busy">Hire</button>
        </form>
        <ul v-if="data.business.employees.length" class="days"><li v-for="employee in data.business.employees" :key="employee.username"><span>{{ employee.username }} · ₦ {{ employee.salary }}/7d · {{ employee.active ? 'Active' : 'Former staff' }}</span><button v-if="employee.active" class="btn" type="button" :disabled="busy" @click="fire(employee.username)">End contract</button></li></ul>
        <p v-else class="small muted">No player staff yet.</p>
      </section>
      <section v-if="data.business.recentDays.length" class="card stack">
        <h2>Recent days</h2>
        <ul class="days"><li v-for="(day, index) in data.business.recentDays" :key="day.at + index"><span>Day {{ data.business.daysOperated - index }}</span><span>Sales +{{ day.sales }} · supplies −{{ day.supplies }} · profit +{{ day.profit }}</span></li></ul>
      </section>
    </template>
    <form v-else class="card stack" @submit.prevent="create">
      <h2>Start your first business</h2>
      <p>Choose a business and name it. Setup costs {{ BUSINESS_TERMS.setup }} game naira.</p>
      <label class="stack tight">Business name<input v-model="name" maxlength="40" minlength="2" required autocomplete="organization" placeholder="For example, Uselu Fresh Bites"></label>
      <fieldset class="types"><legend>Choose a business</legend><label v-for="item in types" :key="item.id" class="type-option"><input v-model="type" type="radio" name="business-type" :value="item.id"><span aria-hidden="true">{{ item.icon }}</span><span><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span></label></fieldset>
      <p class="tiny muted">Virtual naira only. Your current balance is ₦ {{ data.balance.toLocaleString() }}.</p>
      <button class="btn primary" type="submit" :disabled="busy || name.trim().length < 2">{{ busy ? 'Setting up…' : `Start business · ₦ ${BUSINESS_TERMS.setup}` }}</button>
    </form>
    <p class="tiny muted">This starter business is a solo simulation. Staff contracts, player-to-player hiring, premises and supply markets are the next economy layers.</p>
  </PanelPage>
</template>

<style scoped>
.art { font-size: 2rem; }
.figures { display: grid; grid-template-columns: repeat(auto-fit,minmax(120px,1fr)); gap: 8px; margin: 0; }
.figures > div { padding: 10px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.figures dt { color: var(--muted); font-size: .76rem; font-weight: 650; }
.figures dd { margin: 0; font-size: 1.05rem; font-weight: 750; }
.types { display: grid; gap: 8px; border: 0; padding: 0; margin: 0; }
.types legend { font-weight: 700; margin-bottom: 6px; }
.type-option { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 12px; padding: 10px; cursor: pointer; }
.type-option > span:first-of-type { font-size: 1.4rem; }
.type-option small { display: block; color: var(--muted); }
.wrap { flex-wrap: wrap; }
.days { list-style: none; padding: 0; margin: 0; }
.days li { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 8px 0; border-top: 1px solid var(--line); font-size: .86rem; }
input:not([type=radio]) { min-width: 120px; flex: 1; width: 100%; min-height: 42px; border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; font: inherit; }
</style>

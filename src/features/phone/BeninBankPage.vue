<script setup lang="ts">
import { computed, ref } from 'vue'
import { normalizeBeninUsername } from '../../shared/beninLife.ts'
import { WorldError } from '../../shared/model.ts'
import { api, app, messageOf, toast } from '../../state/app.ts'
import { loadTravel, travel } from '../../state/travel.ts'
import PanelPage from '../../ui/PanelPage.vue'
import StateView from '../../ui/StateView.vue'
import { useLoad } from '../../ui/useLoad.ts'

const read = useLoad(() => loadTravel(), [() => app.me?.id])
const history = useLoad(() => app.guest ? Promise.resolve({ transfers: [] }) : api('beninBank.history', {}), [() => app.me?.id, () => travel.state?.balance])
const username = ref('')
const amount = ref<string | number>('')
const busy = ref(false)
const issue = ref('')
const pendingClientId = ref('')
const sent = ref('')
const normalized = computed(() => normalizeBeninUsername(username.value))
const balance = computed(() => travel.state?.balance ?? app.points ?? 0)
const entries = computed(() => history.data.value?.transfers ?? [])
const parsedAmount = computed(() => Number(amount.value))
const amountValid = computed(() => Number.isSafeInteger(parsedAmount.value) && parsedAmount.value > 0)
const fieldsLocked = computed(() => busy.value || Boolean(pendingClientId.value))

async function send(): Promise<void> {
  if (busy.value || app.guest || !normalized.value || !amountValid.value) return
  busy.value = true
  issue.value = ''
  sent.value = ''
  const clientId = pendingClientId.value || crypto.randomUUID()
  pendingClientId.value = clientId
  try {
    const result = await api('beninBank.transfer', { username: normalized.value, amount: parsedAmount.value, clientId })
    sent.value = `Sent ₦${result.amount.toLocaleString()} to ${result.username}.`
    toast(sent.value, 'good')
    username.value = ''; amount.value = ''; pendingClientId.value = ''
    await Promise.all([loadTravel(), history.reload()])
  } catch (error) {
    issue.value = messageOf(error)
    // A definite service refusal made no transfer. An interrupted request keeps its reference
    // and locks the details, so Retry safely asks about that same transfer instead of sending twice.
    if (error instanceof WorldError && ['invalid', 'not_found', 'conflict', 'forbidden', 'rate_limited', 'unauthorized'].includes(error.code)) pendingClientId.value = ''
  } finally { busy.value = false }
}

const signedNaira = (value: number): string => `${value < 0 ? '−' : '+'}₦${Math.abs(value).toLocaleString()}`
const when = (value: string): string => new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
async function refresh(): Promise<void> { await Promise.all([loadTravel(), history.reload()]) }
</script>

<template>
  <PanelPage title="BeninBank" subtitle="Virtual naira only" :back="'/phone'" wide>
    <StateView v-if="read.state.value === 'loading' && !travel.loaded" state="loading" title="Opening BeninBank" />
    <StateView v-else-if="read.state.value === 'error' && !travel.loaded" state="error" :message="read.error.value" @retry="read.reload()" />
    <template v-else>
      <section class="card balance tint-amber" aria-label="Your virtual naira balance">
        <div class="tiny muted">AVAILABLE BALANCE</div>
        <strong class="amount num">₦{{ balance.toLocaleString() }}</strong>
        <p class="small muted">Earned by playing. This virtual naira is not real money and cannot be exchanged for cash.</p>
      </section>

      <section class="card transfer stack" aria-labelledby="transfer-heading">
        <div>
          <h2 id="transfer-heading">Send naira</h2>
          <p class="small muted">Send directly to another completed Benin Life character by their unique @username. Transfers are final.</p>
        </div>
        <div v-if="app.guest" class="notice amber" role="status">Save your character to an account before using BeninBank.</div>
        <form v-else class="stack" @submit.prevent="send">
          <label class="field"><span>Recipient @username</span><input v-model="username" class="input" type="text" maxlength="21" autocomplete="off" autocapitalize="none" spellcheck="false" :disabled="fieldsLocked" placeholder="@username" /></label>
          <label class="field"><span>Amount in naira</span><input v-model="amount" class="input num" type="number" min="1" step="1" inputmode="numeric" :disabled="fieldsLocked" placeholder="Whole number of naira" /></label>
          <p v-if="pendingClientId" class="notice sky" role="status">The previous reply was interrupted. Retry sends the same transfer safely. Keep the recipient and amount as shown.</p>
          <p v-if="issue" class="notice coral" role="alert">{{ issue }}</p>
          <p v-if="sent" class="notice leaf" role="status">{{ sent }}</p>
          <button class="btn primary" type="submit" :disabled="busy || !normalized || !amountValid || balance < parsedAmount">{{ busy ? 'Sending…' : pendingClientId ? 'Retry same transfer' : 'Send naira' }}</button>
        </form>
        <p class="tiny muted">BeninBank only sends naira. There is no Request Money feature.</p>
      </section>

      <section class="stack" aria-labelledby="history-heading">
        <div class="row between"><h2 id="history-heading">Transfer history</h2><button class="btn sm" type="button" :disabled="busy" @click="refresh">Refresh</button></div>
        <StateView v-if="history.state.value !== 'ready'" :state="history.state.value" :message="history.error.value" @retry="history.reload()" />
        <p v-else-if="!entries.length" class="notice">No BeninBank transfers yet.</p>
        <ol v-else class="history">
          <li v-for="entry in entries" :key="entry.id" class="history-row">
            <span class="transfer-mark" :class="entry.direction === 'in' ? 'in' : 'out'" aria-hidden="true">{{ entry.direction === 'in' ? '↓' : '↑' }}</span>
            <span class="grow"><strong>{{ entry.direction === 'in' ? 'From' : 'To' }} {{ entry.counterpartyUsername }}</strong><small class="muted">{{ when(entry.at) }} · Ref {{ entry.id }}</small></span>
            <strong class="num" :class="entry.direction === 'in' ? 'incoming' : 'outgoing'">{{ signedNaira(entry.direction === 'in' ? entry.amount : -entry.amount) }}</strong>
          </li>
        </ol>
      </section>
    </template>
  </PanelPage>
</template>

<style scoped>
.balance { padding: 16px; }
.amount { display: block; margin-top: 4px; font-size: clamp(1.7rem, 7vw, 2.4rem); line-height: 1.15; }
.amount span { font-size: 0.9rem; }
.balance p { margin-bottom: 0; }
.transfer { margin: 16px 0; }
.transfer h2, #history-heading { margin: 0; }
.transfer p { margin-top: 5px; }
.history { list-style: none; margin: 0; padding: 0; }
.history-row { display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 8px 0; border-bottom: 1px solid var(--line); }
.history-row > span.grow { min-width: 0; display: grid; gap: 3px; }
.history-row small { font-size: 0.72rem; overflow-wrap: anywhere; }
.history-row > strong:last-child { white-space: nowrap; font-size: 0.82rem; }
.transfer-mark { display: grid; place-items: center; width: 34px; height: 34px; flex: none; border-radius: 50%; font-size: 1.2rem; font-weight: 700; }
.transfer-mark.in { background: var(--leaf-soft); color: #1f7447; }
.transfer-mark.out { background: var(--accent-soft); color: var(--accent-text); }
.incoming { color: var(--leaf-ink); }
.outgoing { color: var(--ink-2); }
.linklike { border: 0; background: none; text-decoration: underline; color: var(--accent-text); }
</style>

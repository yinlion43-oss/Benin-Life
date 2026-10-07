<script setup lang="ts">
// The home tab: its name, who may visit, where it is said to be, other homes to visit, and the
// receipts of what was bought. None of it changes the rooms or costs anything.
import type { HomeId } from '../../shared/ids.ts'
import { ref } from 'vue'
import type { VisitPolicy } from '../../shared/social.ts'
import { api, app, attempt } from '../../state/app.ts'
import { world } from '../../state/world.ts'
import MemberBadge from '../../ui/MemberBadge.vue'
import StateView from '../../ui/StateView.vue'
import { useLoad } from '../../ui/useLoad.ts'
import HomePlacement from './HomePlacement.vue'
import type { Studio } from './homeStudio.ts'

const props = defineProps<{ studio: Studio }>()
const emit = defineEmits<{ visit: [homeId: HomeId] }>()
const { state, dirty } = props.studio

const POLICY: Record<VisitPolicy, { label: string; about: string }> = {
  private: { label: 'Only me', about: 'Nobody else can come in. Anyone inside is shown out.' },
  friends: { label: 'Friends', about: 'People you have accepted as friends.' },
  public: { label: 'Everyone', about: 'Anyone can visit while you allow it.' },
}
const POLICIES = Object.keys(POLICY) as VisitPolicy[]
const visitable = useLoad(() => api('home.visitable', {}), [() => app.changed.homes, () => app.changed.friends])

async function setPolicy(policy: VisitPolicy): Promise<void> {
  const result = await attempt('home.setPolicy', { policy }, policy === 'private' ? 'Your home is private. Visitors inside were shown out.' : policy === 'friends' ? 'Friends can visit your home.' : 'Anyone can visit your home.')
  if (result) {
    state.home = result.home
    // The scene's own copy is replaced only when it is this very home: from a visit or the street it is somebody else's, or nobody's.
    if (world.kind === 'home' && world.home?.id === result.home.id) world.home = result.home
  }
}
const property = useLoad(() => api('property.mine', {}), [() => app.changed.homes, () => app.changed.notifications])
const upgradeOptions = [
  { id: 'furnishing', label: 'Premium furnishings', price: 500, bonus: 50 },
  { id: 'security', label: 'Gated security + CCTV', price: 700, bonus: 75 },
  { id: 'power', label: 'Solar + generator backup', price: 900, bonus: 100 },
  { id: 'smart', label: 'Smart-home package', price: 650, bonus: 75 },
  { id: 'parking', label: 'Secure premium parking', price: 400, bonus: 40 },
  { id: 'pool', label: 'Swimming pool', price: 1200, bonus: 125 },
] as const
const homeUpgrades = ref<Record<string, boolean>>({})
async function loadUpgrades(): Promise<void> {
  if (!state.home) return
  const result = await api('property.upgrades', { homeId: state.home.id })
  if (result) homeUpgrades.value = result.upgrades
}
async function installUpgrade(id: string): Promise<void> {
  if (!state.home) return
  const result = await attempt('property.upgrade', { homeId: state.home.id, upgrade: id }, 'Property upgrade installed.')
  if (result) homeUpgrades.value = Object.fromEntries(result.installed.map(item => [item, true]))
}
void loadUpgrades()

const portfolio = useLoad(() => api('property.portfolio', {}), [() => app.changed.homes, () => app.changed.notifications])
const rent = useLoad(() => api('rental.mine', {}), [() => app.changed.homes, () => app.changed.notifications])
const weeklyRent = ref<string | number>(100)
const tenantUsername = ref('')
const saleBuyerUsername = ref('')
const salePrice = ref<string | number>(100000)

async function sellProperty(): Promise<void> {
  if (!saleBuyerUsername.value.trim()) return
  const result = await attempt('property.sellOffer', { homeId: state.home.id, buyerUsername: saleBuyerUsername.value.trim(), price: Number(salePrice.value) }, 'Sale offer sent.')
  if (result) { saleBuyerUsername.value = ''; await property.reload() }
}
async function acceptPropertySale(homeId: HomeId): Promise<void> {
  const result = await attempt('property.acceptSale', { homeId }, 'Property purchased and bank payment completed.')
  if (result) { await property.reload(); await rent.reload() }
}
async function cancelPropertySale(homeId: HomeId): Promise<void> {
  const result = await attempt('property.cancelSale', { homeId }, 'Sale offer cancelled.')
  if (result) await property.reload()
}

async function listRental(): Promise<void> {
  const result = await attempt('rental.list', { weeklyRent: Number(weeklyRent.value) }, 'Property listed for rent.')
  if (result) await rent.reload()
}
async function offerRental(homeId: HomeId): Promise<void> {
  if (!tenantUsername.value.trim()) return
  const result = await attempt('rental.offer', { homeId, tenantUsername: tenantUsername.value.trim() }, 'Rental offered to that @username.')
  if (result) { tenantUsername.value = ''; await rent.reload() }
}
async function payRent(): Promise<void> {
  const result = await attempt('rental.pay', {}, 'Rent paid from your bank balance.')
  if (result) await rent.reload()
}
async function endRental(): Promise<void> {
  const result = await attempt('rental.end', {}, 'Rental ended.')
  if (result) await rent.reload()
}
const when = (iso: string): string => new Date(iso).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div v-if="state.home" class="stack">
    <label class="field">
      <span>Home name</span>
      <input v-model="state.name" class="input" maxlength="48" />
    </label>
    <div v-if="dirty" class="row">
      <span class="grow small muted">Not saved yet</span>
      <button class="btn sm" type="button" :disabled="state.saving" @click="studio.discard()">Discard</button>
      <button class="btn primary sm" type="button" :disabled="state.saving" @click="studio.save()">{{ state.saving ? 'Saving…' : 'Save home' }}</button>
    </div>
    <p v-if="state.saveError" class="notice coral" role="alert">{{ state.saveError }}</p>

    <fieldset class="policy">
      <legend class="label">Who can visit</legend>
      <label v-for="policy in POLICIES" :key="policy" class="card choice" :class="{ on: state.home.policy === policy }">
        <input type="radio" class="sr-only" name="policy" :checked="state.home.policy === policy" @change="setPolicy(policy)" />
        <span class="grow"><strong>{{ POLICY[policy].label }}</strong><span class="muted small">{{ POLICY[policy].about }}</span></span>
      </label>
    </fieldset>

    <HomePlacement :studio="studio" />

    <section class="card stack">
      <div class="row">
        <span class="grow"><strong>Property upgrades</strong><span class="muted small">Improve the home with security, power and luxury amenities. Installed upgrades increase its in-game rental value.</span></span>
      </div>
      <div class="days">
        <div v-for="item in upgradeOptions" :key="item.id" class="list-row">
          <span class="grow"><strong>{{ item.label }}</strong><span class="muted tiny">₦ {{ item.price }} · +₦{{ item.bonus }}/week rental value</span></span>
          <button class="btn sm" type="button" :disabled="!!homeUpgrades[item.id] || state.saving" @click="installUpgrade(item.id)">{{ homeUpgrades[item.id] ? 'Installed' : 'Install' }}</button>
        </div>
      </div>
    </section>

    <section class="card stack">
      <div class="row">
        <span class="grow"><strong>My property portfolio</strong><span class="muted small">You can own up to 5 properties. Your primary home remains your everyday home.</span></span>
        <strong>{{ portfolio.data.value?.homes.length ?? 0 }}/5</strong>
      </div>
      <StateView v-if="portfolio.state.value !== 'ready'" :state="portfolio.state.value" :message="portfolio.error.value" @retry="portfolio.reload" />
      <ul v-else class="days"><li v-for="home in portfolio.data.value?.homes ?? []" :key="home.homeId"><span>{{ home.primary ? '🏠 Primary home' : '🏡 Investment property' }} · {{ home.homeId }}</span></li></ul>
    </section>

    <section class="card stack">
      <div class="row">
        <span class="grow"><strong>Buy / sell property</strong><span class="muted small">Sell your current home to another player, or accept a sale offered to your @username.</span></span>
      </div>
      <StateView v-if="property.state.value !== 'ready'" :state="property.state.value" :message="property.error.value" @retry="property.reload" />
      <template v-else>
        <form class="row wrap" @submit.prevent="sellProperty">
          <input v-model="saleBuyerUsername" class="input" maxlength="21" placeholder="@buyer_username" aria-label="Buyer username" required />
          <input v-model="salePrice" class="input" type="number" min="1" step="1" aria-label="Sale price" required />
          <button class="btn sm" type="submit">Offer property</button>
        </form>
        <div v-for="offer in property.data.value?.selling ?? []" :key="offer.homeId" class="list-row">
          <span class="grow"><strong>Sale offer to {{ offer.buyerUsername }}</strong><span class="muted tiny">₦ {{ offer.price }}</span></span>
          <button class="btn sm" type="button" @click="cancelPropertySale(offer.homeId)">Cancel</button>
        </div>
        <div v-for="offer in property.data.value?.buying ?? []" :key="offer.homeId" class="list-row">
          <span class="grow"><strong>Property offered to you</strong><span class="muted tiny">₦ {{ offer.price }} · seller sale</span></span>
          <button class="btn sm" type="button" @click="acceptPropertySale(offer.homeId)">Buy property</button>
        </div>
      </template>
    </section>

    <section class="card stack">
      <div class="row">
        <span class="grow"><strong>Player property rentals</strong><span class="muted small">Rent your home to another player using their unique @username.</span></span>
      </div>
      <StateView v-if="rent.state.value !== 'ready'" :state="rent.state.value" :message="rent.error.value" @retry="rent.reload" />
      <template v-else>
        <div class="row wrap">
          <input v-model="weeklyRent" class="input" type="number" min="1" step="1" aria-label="Weekly rent" />
          <button class="btn sm" type="button" @click="listRental">List for rent</button>
        </div>
        <form class="row wrap" @submit.prevent="offerRental(state.home.id)">
          <input v-model="tenantUsername" class="input" maxlength="21" placeholder="@username" aria-label="Tenant username" required />
          <button class="btn sm" type="submit">Offer to player</button>
        </form>
        <div v-for="lease in rent.data.value?.owned ?? []" :key="lease.homeId" class="list-row">
          <span class="grow"><strong>{{ lease.tenantUsername || 'Unassigned listing' }}</strong><span class="muted tiny">₦ {{ lease.weeklyRent }}/week · {{ lease.active ? 'Active' : 'Ended' }}</span></span>
          <button v-if="lease.active" class="btn sm" type="button" @click="endRental">End rental</button>
        </div>
        <div v-for="lease in rent.data.value?.rented ?? []" :key="lease.homeId" class="list-row">
          <span class="grow"><strong>Rental home</strong><span class="muted tiny">₦ {{ lease.weeklyRent }}/week · next due {{ when(lease.nextDueAt) }}</span></span>
          <div class="row wrap">
            <button class="btn sm" type="button" @click="payRent">Pay rent</button>
            <button class="btn sm" type="button" @click="endRental">Leave rental</button>
          </div>
        </div>
      </template>
    </section>

    <details v-if="state.estate?.receipts.length" class="disclosure">
      <summary>Recent purchases <span class="chip num">{{ state.estate.receipts.length }}</span></summary>
      <ul class="receipts">
        <li v-for="receipt in state.estate.receipts" :key="receipt.id" class="list-row">
          <span class="grow"><strong class="small" style="display: block">{{ receipt.summary }}</strong><span class="muted tiny">{{ when(receipt.at) }}</span></span>
          <span class="num small">{{ receipt.total }} naira</span>
        </li>
      </ul>
    </details>

    <details class="disclosure">
      <summary>Visit other homes <span v-if="visitable.data.value?.homes.length" class="chip num">{{ visitable.data.value.homes.length }}</span></summary>
      <StateView v-if="visitable.state.value !== 'ready'" :state="visitable.state.value" :message="visitable.error.value" @retry="visitable.reload" />
      <p v-else-if="!visitable.data.value?.homes.length" class="muted small">No open doors yet. Homes of friends, and homes their owners opened to everyone, appear here. <RouterLink to="/people">Find people</RouterLink></p>
      <ul v-else class="receipts">
        <li v-for="home in visitable.data.value.homes" :key="home.homeId" class="list-row">
          <MemberBadge :member-id="home.owner.id" :look="home.owner.look" :size="40" :online="home.owner.online" />
          <span class="grow"><strong class="truncate" style="display: block">{{ home.name }}</strong><span class="muted tiny">{{ home.owner.displayName }} · {{ home.districtLabel }} · {{ home.policy === 'public' ? 'open to everyone' : 'friends' }}</span></span>
          <button class="btn sm" type="button" @click="emit('visit', home.homeId)">Visit</button>
        </li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.wrap { flex-wrap: wrap; }
.receipts { list-style: none; margin: 0; padding: 0; }
.receipts .list-row + .list-row { border-top: 1px solid var(--line); }
.policy { border: 0; margin: 0; padding: 0; display: grid; gap: 8px; }
.policy legend { margin-bottom: 6px; }
.choice { display: flex; cursor: pointer; border-width: 2px; }
.choice .grow { display: flex; flex-direction: column; }
.choice.on { border-color: var(--accent-strong); background: var(--accent-soft); }
</style>

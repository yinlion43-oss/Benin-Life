<script setup lang="ts">
import { computed } from 'vue'
import { world } from '../../state/world.ts'
import PanelPage from '../../ui/PanelPage.vue'

const currentPlace = computed(() => {
  if (world.state === 'loading' || world.state === 'idle') return 'Your world is getting ready'
  if (world.state === 'error') return 'Your current place needs attention'
  return [world.areaLabel, world.street].filter(Boolean).join(' · ') || world.title || 'Your city'
})
const sceneLabel = computed(() => {
  if (world.state !== 'ready') return 'Not currently in the world'
  if (world.kind === 'home') return 'At home'
  if (world.kind === 'venue') return `Inside ${world.title || 'a venue'}`
  if (world.kind === 'table') return 'Spending time at a table'
  return 'Out in the city'
})

const destinations = [
  { icon: '🗺️', title: 'Explore the city', detail: 'Find mapped places, set a destination and walk through real street geometry.', to: '/map', action: 'Open map', tone: 'map' },
  { icon: '💼', title: 'Earn through play', detail: 'Travel to a workplace, play a shift and build your in-game career.', to: '/work', action: 'Find a shift', tone: 'work' },
  { icon: '📋', title: 'Jobs and tasks', detail: 'Browse player-posted opportunities and manage your applications.', to: '/jobs', action: 'Browse jobs', tone: 'jobs' },
  { icon: '🏠', title: 'Make a home', detail: 'Visit your home, arrange rooms and choose furniture you can afford.', to: '/home', action: 'Go home', tone: 'home' },
  { icon: '🍲', title: 'Food and daily needs', detail: 'Return to the world to eat at a venue, rest at home and keep your needs in shape.', to: '/', action: 'Back to the world', tone: 'food' },
  { icon: '🛺', title: 'Get around', detail: 'Choose local destinations on the map or plan a longer trip between cities.', to: '/travel', action: 'Plan a trip', tone: 'travel' },
  { icon: '🤝', title: 'Build your circle', detail: 'Meet people, grow friendships and find community hangouts.', to: '/people', action: 'Meet people', tone: 'people' },
  { icon: '🏪', title: 'Run a business', detail: 'Start a small game business, hire player staff and operate it for the day.', to: '/phone/businesses', action: 'Open business app', tone: 'business' },
  { icon: '🎮', title: 'Take a break', detail: 'Visit the game hall for the games that are currently playable.', to: '/arena', action: 'Open game hall', tone: 'games' },
  { icon: '📱', title: 'Open your phone', detail: 'Reach messages, contacts, BeninBank, jobs, property and settings.', to: '/phone', action: 'Open phone', tone: 'phone' },
] as const
</script>

<template>
  <PanelPage title="City Life" subtitle="Your city. Your choices. Your story." wide>
    <section class="life-hero">
      <div class="hero-copy">
        <p class="eyebrow">BENIN LIFE · OPEN-CITY SIMULATION</p>
        <h2>Make a life on these streets.</h2>
        <p class="hero-intro">Earn game money, find your own place, eat well, meet people and explore a city that changes as you move through it.</p>
        <RouterLink class="btn primary" to="/">Return to the city <span aria-hidden="true">↗</span></RouterLink>
      </div>
      <div class="location-card" aria-live="polite">
        <span class="location-icon" aria-hidden="true">📍</span>
        <div>
          <span class="location-label">YOUR CURRENT WORLD</span>
          <strong>{{ currentPlace }}</strong>
          <span class="location-status">{{ sceneLabel }}</span>
        </div>
      </div>
    </section>

    <section class="section-heading">
      <div>
        <p class="eyebrow">MAKE YOUR NEXT MOVE</p>
        <h2>Everyday life, all in one place</h2>
      </div>
      <span class="section-note">Choose a path</span>
    </section>

    <nav class="destination-grid" aria-label="City life activities">
      <RouterLink v-for="item in destinations" :key="item.to + item.title" class="destination-card" :class="`tone-${item.tone}`" :to="item.to">
        <span class="destination-icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="destination-title">{{ item.title }}</span>
        <span class="destination-detail">{{ item.detail }}</span>
        <span class="destination-action">{{ item.action }} <span aria-hidden="true">→</span></span>
      </RouterLink>
    </nav>

    <section class="street-life">
      <div class="street-life-copy">
        <p class="eyebrow">A NIGERIAN STREET FEEL</p>
        <h2>More than a map</h2>
        <p>Move from home to the shops, food spots, workplaces and public hangouts. Nigerian street dressing can include kiosks, market stalls, POS stands, generators and roadside repairs; traffic may include danfo buses, kekes and okadas where the region assets are available.</p>
        <p class="fine-print">Mapped venues and real online players come from the game’s data and service. Decorative pedestrians and illustrative shop signs are scenery, not real businesses or live members.</p>
      </div>
      <div class="street-tags" aria-label="Street life themes">
        <span>🚌 Danfo</span><span>🛺 Keke</span><span>🏍️ Okada</span><span>🍛 Food spots</span><span>🛍️ Markets</span><span>🎉 Hangouts</span>
      </div>
    </section>
  </PanelPage>
</template>

<style scoped>
.life-hero { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(230px, .7fr); gap: 18px; align-items: stretch; padding: clamp(18px, 3vw, 30px); border: 1px solid #244f42; border-radius: 22px; color: #fff8e9; background: radial-gradient(circle at 95% 0%, #2f6653 0, transparent 40%), linear-gradient(130deg, #173e34, #1f5141 65%, #2d624d); box-shadow: 0 12px 28px #193e301a; }
.hero-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.eyebrow { font-size: .69rem; line-height: 1.35; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); }
.life-hero .eyebrow { color: #e7c777; }
.hero-copy h2 { max-width: 500px; font-size: clamp(1.65rem, 3.5vw, 2.5rem); line-height: 1.02; letter-spacing: -.04em; }
.hero-intro { max-width: 580px; color: #e3eadd; line-height: 1.6; }
.location-card { display: flex; align-items: flex-start; gap: 12px; align-self: end; min-width: 0; padding: 16px; border: 1px solid #ffffff30; border-radius: 16px; background: #102c25a8; }
.location-icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 13px; background: #ffffff18; font-size: 21px; }
.location-card > div { display: grid; gap: 5px; min-width: 0; }
.location-label { color: #e7c777; font-size: .65rem; font-weight: 800; letter-spacing: .1em; }
.location-card strong { overflow-wrap: anywhere; font-size: 1rem; }
.location-status { color: #d6e3d8; font-size: .8rem; }
.section-heading { display: flex; justify-content: space-between; align-items: end; gap: 14px; margin-top: 8px; }
.section-heading h2 { margin-top: 4px; font-size: 1.2rem; }
.section-note { color: var(--muted); font-size: .8rem; }
.destination-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 11px; }
.destination-card { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-height: 176px; padding: 16px; border: 1px solid var(--line); border-radius: 17px; background: var(--surface); color: var(--ink); text-decoration: none; transition: border-color .16s ease, transform .16s ease, box-shadow .16s ease; }
.destination-card:hover { transform: translateY(-2px); border-color: var(--accent-strong); box-shadow: var(--shadow-sm); }
.destination-card:focus-visible { outline: 3px solid var(--accent-strong); outline-offset: 2px; }
.destination-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 13px; background: var(--surface-2); font-size: 22px; }
.destination-title { font-weight: 800; line-height: 1.25; }
.destination-detail { color: var(--muted); font-size: .82rem; line-height: 1.5; }
.destination-action { display: flex; justify-content: space-between; align-items: center; gap: 8px; width: 100%; margin-top: auto; padding-top: 5px; color: var(--accent-text); font-size: .78rem; font-weight: 800; }
.tone-map .destination-icon { background: #dceee3; }.tone-work .destination-icon { background: #fff0d3; }.tone-jobs .destination-icon { background: #e6e8ff; }.tone-home .destination-icon { background: #f5e6d9; }.tone-food .destination-icon { background: #fce8d5; }.tone-travel .destination-icon { background: #dcecf5; }.tone-people .destination-icon { background: #f5e0e9; }.tone-business .destination-icon { background: #e5ead2; }.tone-games .destination-icon { background: #e6e2f5; }.tone-phone .destination-icon { background: #e0e8ed; }
.street-life { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: center; padding: 20px; border: 1px solid var(--line); border-radius: 19px; background: linear-gradient(120deg, var(--surface), var(--surface-2)); }
.street-life-copy { display: grid; gap: 9px; max-width: 720px; }
.street-life-copy h2 { font-size: 1.15rem; }
.street-life-copy > p:not(.eyebrow) { color: var(--ink-2); line-height: 1.55; font-size: .88rem; }
.street-life-copy .fine-print { font-size: .75rem; }
.street-tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; max-width: 300px; }
.street-tags span { padding: 8px 11px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); font-size: .8rem; white-space: nowrap; }
@media (max-width: 760px) {
  .life-hero { grid-template-columns: 1fr; gap: 18px; }
  .location-card { align-self: stretch; }
  .destination-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .destination-card { min-height: 172px; padding: 12px; }
  .street-life { grid-template-columns: 1fr; padding: 16px; }
  .street-tags { justify-content: flex-start; max-width: none; }
}
@media (max-width: 380px) {
  .destination-grid { grid-template-columns: 1fr; }
  .destination-card { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .destination-card { transition: none; }
  .destination-card:hover { transform: none; }
}
</style>

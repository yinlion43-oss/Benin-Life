<script setup lang="ts">
import PanelPage from '../../ui/PanelPage.vue'

interface PhoneApp { name: string; icon: string; description: string; route?: string }

const apps: PhoneApp[] = [
  { name: 'BeninBank', icon: '🏦', description: 'Send and review game-coin transfers.', route: '/phone/bank' },
  { name: 'Messages', icon: '💬', description: 'Open your conversations.', route: '/messages' },
  { name: 'Contacts', icon: '👥', description: 'Find people and manage connections.', route: '/people' },
  { name: 'Jobs', icon: '💼', description: 'Browse available jobs and tasks.', route: '/jobs' },
  { name: 'Businesses', icon: '🏪', description: 'Start and run a small game business.', route: '/phone/businesses' },
  { name: 'Property', icon: '🏠', description: 'Visit and arrange your home.', route: '/home' },
  { name: 'Football', icon: '⚽', description: 'Crescent Sports Center and clubs are in development.' },
  { name: 'Map', icon: '🗺️', description: 'Open the city map.', route: '/map' },
  { name: 'Social', icon: '🎉', description: 'Open communities and meetups.', route: '/communities' },
  { name: 'Activities', icon: '🎭', description: 'Benin City daily activities are in development.' },
  { name: 'Advertising', icon: '📣', description: 'Billboard campaigns are in development.' },
  { name: 'Settings', icon: '⚙️', description: 'Manage your character and preferences.', route: '/settings' },
]
</script>

<template>
  <PanelPage title="Phone" subtitle="Your Benin Life apps" wide>
    <p class="notice sky"><span aria-hidden="true">ℹ️</span><span>BeninBank will use game currency only. It will not connect to a real bank or handle real money.</span></p>
    <nav class="phone-apps" aria-label="Phone apps">
      <template v-for="app in apps" :key="app.name">
        <RouterLink v-if="app.route" class="phone-app" :to="app.route">
          <span class="phone-icon" aria-hidden="true">{{ app.icon }}</span>
          <strong>{{ app.name }}</strong>
          <span class="phone-description">{{ app.description }}</span>
          <span class="phone-state">Open</span>
        </RouterLink>
        <article v-else class="phone-app planned" :aria-label="`${app.name}, in development`">
          <span class="phone-icon" aria-hidden="true">{{ app.icon }}</span>
          <strong>{{ app.name }}</strong>
          <span class="phone-description">{{ app.description }}</span>
          <span class="phone-state">In development</span>
        </article>
      </template>
    </nav>
  </PanelPage>
</template>

<style scoped>
.phone-apps { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; }
.phone-app { display: grid; align-content: start; justify-items: start; gap: 6px; min-height: 150px; padding: 12px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); color: var(--ink); text-decoration: none; }
.phone-app[href]:hover { border-color: var(--accent-strong); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.phone-app:focus-visible { outline: 3px solid var(--accent-strong); outline-offset: 2px; }
.phone-app.planned { background: var(--surface-2); color: var(--ink-2); }
.phone-icon { font-size: 1.8rem; line-height: 1; }
.phone-description { font-size: 0.78rem; line-height: 1.35; }
.phone-state { align-self: end; margin-top: auto; color: var(--accent-text); font-size: 0.72rem; font-weight: 700; }
.planned .phone-state { color: var(--muted); }
</style>

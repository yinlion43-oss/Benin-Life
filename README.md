# Benin Life

**Your Life Creates Your Story.**

Benin Life is a shared life simulation built on an inherited Vue 3, TypeScript and Three.js
world architecture. Benin City is the primary starting city. The existing world, map, avatar,
home, life-needs, work, social, travel, vehicle and persistence systems remain the technical
foundation; Benin Life rules and content are defined in [`docs/BENIN-LIFE-SYSTEMS.md`](docs/BENIN-LIFE-SYSTEMS.md).

The first-run experience is intended to lead from account and unique `@username` setup into the
Benin City map, with Map, Phone, Me and Activities as the main destinations. The game does not
use age or life stages. Everyone begins without player relationships and builds them through
play. The inherited Apache-2.0 license and third-party notices remain in [`LICENSE`](LICENSE) and
[`NOTICE`](NOTICE).

## Current adaptation state

- Benin Life name, tagline, title and page metadata are in place; upstream favicon artwork has
  been removed from the page until Benin Life artwork is supplied.
- Benin City is the first suggested start location, with Nigeria/NGN and `Africa/Lagos` defaults.
- First-run onboarding now checks a unique `@username` through the service, then saves appearance,
  two traits and a Big Dream. The service assigns life status, starting skills and a randomized
  perk; incomplete profiles are excluded from public-member operations.
- The Character settings screen now shows that saved Benin Life story and its starting skill levels.
- The Phone menu now opens a Benin Life app hub. Existing message, contact, job, home, map, social
  and settings areas are linked. BeninBank sends game coins between completed characters by
  `@username`, stores paired transaction history, and safely recognizes retries; there is no
  request-money feature. Scheduled payments, businesses, football, daily activities and advertising
  are still in development.
- The authored character options, city places, phone app list, transport options and advertising
  inventory are centralized in [`src/shared/beninLife.ts`](src/shared/beninLife.ts). Several of
  those are design data and are not yet connected to playable interfaces.
- The full agreed product scope and its implementation map are in
  [`docs/BENIN-LIFE-SYSTEMS.md`](docs/BENIN-LIFE-SYSTEMS.md). BeninBank transfers, branded phone
  apps, business and property ledgers, football clubs, legal play, paid advertising and city
  activity simulation remain future service-owned work.
- Upstream contributor, architecture and operations documents are retained as source history.
  Their original Allworld-specific deployment guidance does not configure or describe a Benin Life
  production service.
- The inherited verification scripts still contain Allworld-era onboarding assumptions; reconcile
  those probes with the required Benin Life character setup before relying on the full CI `check`
  workflow. They have not been run for this adaptation.
- The inherited manual Cloudflare release workflows are guarded to run only in
  `kromate/allworld`; they are not Benin Life deployment workflows. Set up and review dedicated
  Benin Life hosting before adding any release path.

## Build and run locally

Use Node 22.18 or newer and the pinned npm version in `package.json`.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`docs/CONTRIBUTOR-MAP.md`](docs/CONTRIBUTOR-MAP.md) before changing a subsystem. The service
must own shared outcomes such as balances, jobs, property, relationships, matches and campaigns.

```sh
npm run typecheck
npm run typecheck:worker
npm run check:structure
npm run check:assets
npm run verify
npm run build
```

No Benin Life production world, payment provider, live credentials or deployment configuration is
included. The browser's local development actors are not public accounts. Map data and media keep
their original sources and license terms; do not remove `NOTICE` or the asset records.

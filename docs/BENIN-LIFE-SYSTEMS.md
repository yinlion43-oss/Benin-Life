# Benin Life — agreed game systems

This document carries the decisions recorded in the Benin Life planning chats into the codebase.
It separates agreed product rules from systems already supplied by Allworld and from integrations
that still need service-owned code. A mock button or local-only value is not an implemented system.

## Product and world

- Name: **Benin Life**. Tagline: **Your Life Creates Your Story.**
- Primary start: **Benin City, Edo State, Nigeria**. Currency: NGN/₦. Shared city timezone:
  `Africa/Lagos` (WAT, UTC+1).
- The map is the main screen after login. Main destinations: **Map / Phone / Me / Activities**.
- The planned 15 Benin City districts are playable navigation zones, not claims about official
  administrative wards. The current authored labels are in `src/shared/beninLife.ts`. The map
  should use mapped roads and real public landmarks, and show a location card with current
  activities, opening state when known, fees when configured, nearby players, jobs and directions.
- Ten of those authored areas now have OpenStreetMap-backed public feature anchors available as
  optional first-start choices: Ugbowo, Uselu, Ekosodin, Etete, Ugbor, Aduwawa, Ramat Park,
  Igun Street, Sapele Road and Airport Road. These are point anchors, not neighborhood boundaries;
  road and feature centroids are navigation conveniences. The five remaining labels without a
  sufficiently clear mapped match are Ring Road, Ogbe, New Benin, Ekenwan and Ikpoba Hill. The
  source OSM object IDs and coordinate precision are recorded alongside the anchors in
  `src/shared/beninLife.ts`. Attribution: © OpenStreetMap contributors, ODbL.
- Recorded landmark anchors: Benin City Airport, Edo Line, Ramat Park, Lily Hospital, Oba Market,
  Samuel Ogbemudia Stadium, Benin City National Museum, Benin Moat, Oba Palace, Igun Street and
  Edo State Sport Council. The project must resolve locations from licensed map/gazetteer data;
  this list does not invent coordinates or assert live opening hours.
- Real local time drives shared day/night, street lights and time-aware activities. Day/night must
  be derived from the city clock, not accelerated independently on each client.
- City categories: healthcare, education, police, justice, transport, sports, nightlife, markets,
  food, culture, homes and businesses.

## Account and character

- Each player has one persistent account and one unique, case-insensitive `@username`. The handle
  is the only public player identity: profiles, map/name tags, messages, contacts, money transfers,
  work, business and property ownership, football, relationships, posts, achievements and ads.
- Username setup checks availability on the server; clients cannot claim a handle or alter it by
  editing local state. A registered handle is stable; any future rename policy must be explicit.
- Character setup offers appearance and clothes, **two traits**, a **Big Dream**, and a randomly
  assigned life status. There is **no age or life-stage system**.
- Traits: Hustler, Foodie, Owambe Spirit, Gym Rat, Smooth Talker, Lazy Bone, Clean Pikin,
  Night Crawler, Tech Bro or Sis, Musical.
- Big Dreams: Benin Big Boy/girl, Benin Landlord/Landlady, Benin Music Star, Everybody's Padi,
  Benin Tech Pioneer, Benin Football Star.
- Life status: Ajabutter, Ajapaco or Paco. Status changes starting circumstances and opportunities;
  it must never cap eventual success or be used as a judgement of a real player.
- On arrival the new character receives a home, starter job/activity, starting money, phone,
  clothes and transport options. They begin with **no player relationships**. Exact balances,
  starter job, home/rent and status modifiers still need approved game-balance values; do not guess
  real-world wages or imply a real benefit.
- Initial skills: Cooking 10, Charisma 4, Fitness 5, Coding 10, Music 2, Hustle 7, Dance 3,
  Comedy 0, Photography 0. Skills improve through relevant play.
- Known randomized perks: Iron Belle (Belle drops 25% slower), Steel Bladder (Bladder drops 30%
  slower), Early Bird (Energy drops 25% slower), Never Dull (Enjoyment drops 25% slower), Sweet
  Mouth (+15% social success), Hustle Juice (+25% work-performance gain). The complete original
  perk and feelings catalogue must be recovered from the design history before it is called final.
- Feelings and events respond to food, hygiene, fitness, work, entertainment, parties, travel,
  relationships, football and legal outcomes. They should reflect game events and needs rather
  than prescribe a player's real mental or medical state.

## Daily life and phone

- Phone apps: BeninBank, Messages, Contacts, Jobs, Businesses, Property, Football, Map, Social,
  Activities, Advertising and Settings.
- Activities are context-aware: cooking at home; buying local food, bukas or restaurant meals;
  ordering food; bathing, grooming, barber/salon, clothes and laundry; gym, sports centre, pitch
  and park activities; music, concerts, dancing, clubs, lounges, parties and matches.
- Food affects Belle and Enjoyment. Personal care affects Hygiene, Appearance and Mood. Fitness
  improves Fitness and can support football progression. Entertainment affects Enjoyment and may
  trigger feelings/events. Traits/perks modify these systems through shared rules.
- Player-created public/private parties have a host, place, start time and guest list; guests can
  arrive, socialise, dance, eat, take photos, listen to music and meet players.
- Existing Allworld needs, meals, homes, work, messaging, map, travel and multiplayer rooms are
  reusable foundations. Benin Life should add local food, event and city activity data without
  presenting fabricated members, opening hours or live attendance.
- Food menus resolve by country and first-level region. Edo State now has its own service-backed
  cuisine set for Bini Owo soup, Omoebe/black soup, Omi Ukpoka corn soup, Ogbono, cassava starch
  with Owo, and Omisagwe groundnut soup. The menu is game data: it does not assert that a mapped
  venue serves any particular dish. Cultural labels were checked against the [National Institute
  for Cultural Orientation's cuisine list](https://nico.gov.ng/cuisines-in-nigeria/), an [Edo
  indigenous-dishes study repository record](https://repository.mouau.edu.ng/works/chemical-composition-and-amino-acid-profile-of-some-selected-indigenous-dishes-in-edo-state-7-2), and reporting on [Omi Ukpoka](https://guardian.ng/life/omi-ukpoka-corn-soup-of-edo-people/) and [Omisagwe](https://guardian.ng/life/omisagwe-soup-of-edo-people/).

## BeninBank and economy

- BeninBank supports username-to-username transfers and auditable transaction history.
- No **Request Money** feature.
- Scheduled/automatic payments cover agreed employment payroll, business expenses, property rent
  and football/team payments. Every movement records payer, recipient, amount, reason, idempotency
  key and time; a retry must not charge twice.
- Cash, bank balances, payments and rewards are play currency. No real payment provider is
  connected. The server validates sufficient funds and owns every balance change.
- Player businesses have an owner, employees, salaries/contracts, customers, revenue, expenses and
  ownership history. Work can progress from student/entry-level activity to professional work,
  business ownership and government careers; no age gate or real employment claim is implied.
- Property supports renting and ownership, landlord/landlady and tenant relationships, recurring
  rent, maintenance and progression. Existing homes/plots are the scene and persistence base;
  Benin listings, terms and price balance remain game data to add.

## Multiplayer, social and transport

- The map and location cards show only real online members returned by the service. No fabricated
  member lists/counts or seeded chats. NPCs must be visibly identified as computer characters.
- Relationship progression is interaction-based: Stranger → Acquaintance → Friend → Close Friend
  → Best Friend. Romantic relationships use a separate path: Stranger → Interest → Dating →
  Partner. Players start without these links; blocking, consent and reporting remain available.
- Activities that may build relationships include conversation, shared food, parties, football,
  music, shopping, home visits, work, travel, dating, celebrations and support for a player's
  club/business.
- Messages can include actionable invitations from players, NPCs, employers, employees,
  businesses and clubs. Actions remain subject to service validation, privacy and moderation.
- Danfo, Keke and Okada are the starter transport options. Existing transport/driver systems can
  support hiring a personal driver, shared rides and travel; fares, seats, routes and vehicle
  movement remain server-authoritative.

## Football and legal play

- Crescent Sports Center is the football foundation and a named sports venue. Plan 5-a-side,
  7-a-side and small-sided activities, player-created clubs/teams, schedules, invitations,
  player roles and BeninBank-supported club payments.
- Police, EFCC, courts and Oko Prison form a fictional consequence-driven legal gameplay loop.
  Arrest, evidence, hearings, fines, custody and release must be game events, not assertions about
  real people or legal advice.
- Optional underground/illegal choices may exist only as fictional gameplay with meaningful
  consequences, counterplay and moderation. They cannot teach real crimes or expose players to
  real-world targeting.

## Advertising and city simulation

- The architecture reserves **18 standard billboards and 4 Mega Billboards**. Every slot is tied
  to a reviewed in-world map anchor. Do not fabricate real-road coordinates, advertiser identity,
  campaign content or audience counts.
- Campaign records need advertiser/owner, campaign creative, slot and type, start/end time, active
  state, payment and moderation status. Expiry and billing are service-owned. The renderer reads
  approved active campaigns; it cannot activate a paid campaign by itself.
- The simulated city reflects commerce, transport, government/administration, education,
  manufacturing, markets, restaurants, small business, healthcare, nightlife, sports and culture.
  NPC activity is separate from member counts and does not impersonate real people.

## Security, persistence and launch

- The world service is the authority for account identity, position/room membership, time, money,
  businesses, property, jobs, relationships, inventory, NPC state, legal events, football and ads.
- Persist accounts and progression on the service. The browser is presentation/input, never the
  authority for balances, ownership, payroll, rewards or match results. Keep auditable ledgers,
  idempotent mutations, rate limits, validation, privacy controls, moderation, report/block flows
  and anti-cheat detection.
- Multiplayer acceptance must cover two or more independent accounts, persistence after logout,
  transfer replay, permissions, conflicting writes, service restart, proximity privacy, and
  mobile/keyboard usability. A local single-browser preview is not multiplayer or production
  evidence.

## Current implementation state and next integration order

Implemented in this adaptation: Benin Life browser identity, Benin City as the first suggested
place, Nigeria preferences, the five-step first-run flow, server-checked case-insensitive unique
`@username`, username-backed public identity, two-trait and Big Dream selection, service-assigned
Ajabutter/Ajapaco/Paco status, authored starter skills and a random known perk. Public-member
surfaces require the Benin Life character setup to be complete. The Character settings screen
shows the saved choices and initial skill levels. Ten OSM-backed Benin City public map anchors are
optional first-start choices; they are points, not neighborhood boundaries. Edo State characters
receive an Edo-specific food menu, chosen from the saved area region by the service. The Phone menu links to existing messages,
contacts, jobs, home, map, social and settings pages. BeninBank sends game coins by username,
stores paired server-side transaction history and handles same-reference retries; it has no
Request Money operation. Player-owned businesses can hire completed players by unique @username;
weekly payroll is service-scheduled and paid from the owner's game-bank balance, with insufficient
funds leaving payroll due rather than partially paying staff. Feedback no longer routes to the
upstream Allworld board, and inherited creator copy no longer names an individual.

The five-step flow does not yet supply an integrated Benin City street dataset, the complete
perks/feelings catalog, approved starter money/home/job balance, scheduled BeninBank payments beyond the business payroll layer, property rent transactions,
football clubs, legal gameplay, campaigns, or the other systems listed below. Product constants and a written design are not counted as playable features.

## Current inherited systems and next integration order

| Order | Work | Existing foundation | Benin Life-specific work still required |
| --- | --- | --- | --- |
| 1 | City/map and real clock | map/geo, districts, street renderer, local-hour lighting | finish mapping the 15 Benin navigation zones (10 public feature anchors are integrated; 5 remain unresolved), add verified boundary geometry where available, wire landmarks, use shared `Africa/Lagos` clock |
| 2 | Username and onboarding | account/session, appearance editor, five-step onboarding, unique handle registry, traits/dream/status/skills/perk initialization | starter loadout/balance, migration policy, and full onboarding acceptance |
| 3 | Needs/skills/perks/feelings | service-owned life needs and activities, initial Benin skill and perk records, Edo-specific service-resolved food menu | trait/perk effects, complete event catalogue and persistence |
| 4 | Phone and BeninBank | app hub, username transfer, paired transaction history, retry-safe server operation | scheduled payment operations, reconciliation and broader wallet-ledger integration; no request-money UI/op |
| 5 | Work, businesses, property | jobs/work shifts, seller and homes/plots, player business | careers, employee contracts and username-based weekly payroll are wired; rent/ownership transactions and full premises/supply markets remain |
| 6 | Social, transport, city life | rooms, people, messages, events, travel, vehicles | interaction progression, dating consent, NPC/job/party/event schedules, Danfo/Keke/Okada tuning |
| 7 | Football | sports/game hall primitives | Crescent venue, clubs, 5/7/small-sided scheduling, team payments |
| 8 | Legal and advertising | reports/blocks, street rendering, service ledger primitives | fictional case loop, Oko Prison, campaign moderation, 18+4 anchored slots, campaign billing |
| 9 | Save/security/acceptance | service persistence, limits, typed operations, existing verification scripts | end-to-end Benin scenarios, anti-cheat review, multiple-account and launch acceptance |

Many constants in `src/shared/beninLife.ts` are configuration only. The table above tracks
implementation truth; don't mark a row complete until both its interface and authoritative service
behavior exist.

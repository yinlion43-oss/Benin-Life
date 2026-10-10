// Benin Life's authored game configuration. Keep these as definitions, not live player state:
// money, relationships, ownership, campaigns and match outcomes belong to the world service.
import type { LatLon } from './geo.ts'

export const BENIN_LIFE = {
  name: 'Benin Life',
  tagline: 'Your Life Creates Your Story.',
  city: 'Benin City',
  state: 'Edo State',
  country: 'Nigeria',
  countryCode: 'NG',
  currency: 'NGN',
  currencySymbol: '₦',
  timeZone: 'Africa/Lagos',
  cityAnchor: { lat: 6.335, lon: 5.6037 } satisfies LatLon,
  language: 'en-NG',
} as const

/** Playable neighbourhood zones for game navigation; these are not administrative wards. */
export const BENIN_CITY_DISTRICTS = [
  'Ring Road', 'GRA / Etete', 'Ogbe', 'New Benin', 'Ugbowo',
  'Uselu', 'Ekosodin', 'Ekenwan', 'Sapele Road', 'Airport Road',
  'Ugbor', 'Ikpoba Hill', 'Aduwawa', 'Ramat Park', 'Igun Street',
] as const

export type BeninDistrict = (typeof BENIN_CITY_DISTRICTS)[number]

/**
 * Map-backed starting anchors for the named Benin Life navigation zones. These are public OSM
 * feature points (or OSM feature centroids), not neighborhood boundaries. The OSM object IDs make
 * every anchor traceable; zones without a clear mapped match stay out of this list.
 */
export const BENIN_CITY_ZONE_ANCHORS = [
  { label: 'Ugbowo', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.400298, lon: 5.610094 }, osmType: 'node', osmId: 501419789, precision: 'mapped-place-node' },
  { label: 'Uselu', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.383390, lon: 5.610721 }, osmType: 'node', osmId: 501454024, precision: 'mapped-place-node' },
  { label: 'Ekosodin', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.416679, lon: 5.616652 }, osmType: 'node', osmId: 501444144, precision: 'mapped-place-node' },
  { label: 'Etete', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.293130, lon: 5.632538 }, osmType: 'node', osmId: 501477760, precision: 'mapped-place-node' },
  { label: 'Ugbor', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.266673, lon: 5.616660 }, osmType: 'node', osmId: 501516692, precision: 'mapped-place-node' },
  { label: 'Aduwawa', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.363160, lon: 5.679028 }, osmType: 'node', osmId: 501518918, precision: 'mapped-place-node' },
  { label: 'Ramat Park', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.350766, lon: 5.661317 }, osmType: 'way', osmId: 460743740, precision: 'mapped-feature-centroid' },
  { label: 'Igun Street', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.337055, lon: 5.630049 }, osmType: 'way', osmId: 41203715, precision: 'mapped-feature-centroid' },
  { label: 'Sapele Road', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.323627, lon: 5.626520 }, osmType: 'way', osmId: 233030540, precision: 'mapped-road-anchor' },
  { label: 'Airport Road', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.318053, lon: 5.607262 }, osmType: 'way', osmId: 518326590, precision: 'mapped-road-anchor' },
  { label: 'Ring Road', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.335, lon: 5.6037 }, osmType: 'node', osmId: 0, precision: 'approximation' },
  { label: 'Ogbe', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.330, lon: 5.610 }, osmType: 'node', osmId: 0, precision: 'approximation' },
  { label: 'New Benin', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.329, lon: 5.626 }, osmType: 'node', osmId: 0, precision: 'approximation' },
  { label: 'Ekenwan', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.30, lon: 5.58 }, osmType: 'node', osmId: 0, precision: 'approximation' },
  { label: 'Ikpoba Hill', countryCode: 'NG', region: 'Edo', anchor: { lat: 6.315, lon: 5.59 }, osmType: 'node', osmId: 0, precision: 'approximation' },
] as const

/** Real place anchors named in the Benin Life planning conversation; map positions resolve from gazetteer data. */
export const BENIN_CITY_LANDMARKS = [
  { name: 'Benin City Airport', category: 'transport' },
  { name: 'Edo Line', category: 'transport' },
  { name: 'Ramat Park', category: 'transport' },
  { name: 'Lily Hospital', category: 'healthcare' },
  { name: 'Oba Market', category: 'market' },
  { name: 'Samuel Ogbemudia Stadium', category: 'sports' },
  { name: 'Benin City National Museum', category: 'culture' },
  { name: 'Benin Moat', category: 'heritage' },
  { name: 'Oba Palace', category: 'heritage' },
  { name: 'Igun Street', category: 'culture' },
  { name: 'Edo State Sport Council', category: 'sports' },
] as const

export const BENIN_CITY_CATEGORIES = [
  'healthcare', 'education', 'police', 'justice', 'transport', 'sports',
  'nightlife', 'markets', 'food', 'culture', 'homes', 'businesses',
] as const

export const PLAYER_TRAITS = [
  { id: 'hustler', label: 'Hustler' },
  { id: 'foodie', label: 'Foodie' },
  { id: 'owambe-spirit', label: 'Owambe Spirit' },
  { id: 'gym-rat', label: 'Gym Rat' },
  { id: 'smooth-talker', label: 'Smooth Talker' },
  { id: 'lazy-bone', label: 'Lazy Bone' },
  { id: 'clean-pikin', label: 'Clean Pikin' },
  { id: 'night-crawler', label: 'Night Crawler' },
  { id: 'tech-bro-or-sis', label: 'Tech Bro or Sis' },
  { id: 'musical', label: 'Musical' },
] as const

export const BIG_DREAMS = [
  'Benin Big Boy/girl', 'Benin Landlord/Landlady', 'Benin Music Star',
  "Everybody's Padi", 'Benin Tech Pioneer', 'Benin Football Star',
] as const

export const LIFE_STATUSES = ['Ajabutter', 'Ajapaco', 'Paco'] as const
export type LifeStatus = (typeof LIFE_STATUSES)[number]

export const STARTING_SKILLS = {
  Cooking: 10,
  Charisma: 4,
  Fitness: 5,
  Coding: 10,
  Music: 2,
  Hustle: 7,
  Dance: 3,
  Comedy: 0,
  Photography: 0,
} as const

export const PERKS = [
  { id: 'iron-belle', label: 'Iron Belle', effect: 'Belle drops 25% slower.' },
  { id: 'steel-bladder', label: 'Steel Bladder', effect: 'Bladder drops 30% slower.' },
  { id: 'early-bird', label: 'Early Bird', effect: 'Energy drops 25% slower.' },
  { id: 'never-dull', label: 'Never Dull', effect: 'Enjoyment drops 25% slower.' },
  { id: 'sweet-mouth', label: 'Sweet Mouth', effect: '+15% social success.' },
  { id: 'hustle-juice', label: 'Hustle Juice', effect: '+25% work-performance gain.' },
] as const

export const PERK_IDS = ['iron-belle', 'steel-bladder', 'early-bird', 'never-dull', 'sweet-mouth', 'hustle-juice'] as const

export type PlayerTraitId = (typeof PLAYER_TRAITS)[number]['id']
export type BigDream = (typeof BIG_DREAMS)[number]
export type BeninSkill = keyof typeof STARTING_SKILLS
export type PerkId = (typeof PERK_IDS)[number]

export interface BeninCharacter {
  traits: [PlayerTraitId, PlayerTraitId]
  dream: BigDream
  lifeStatus: LifeStatus
  skills: Record<BeninSkill, number>
  perks: PerkId[]
}

/** Accept a plain handle or an @-prefixed handle, preserve chosen case, and return its public form. */
export function normalizeBeninUsername(value: string): string | null {
  const handle = value.trim().replace(/^@/, '')
  return /^[A-Za-z0-9][A-Za-z0-9_]{2,19}$/.test(handle) ? `@${handle}` : null
}

export const PHONE_APPS = [
  'BeninBank', 'Messages', 'Contacts', 'Jobs', 'Businesses', 'Property',
  'Football', 'Map', 'Social', 'Activities', 'Advertising', 'Settings',
] as const

export const ADVERTISING_INVENTORY = {
  standardBillboards: 18,
  megaBillboards: 4,
} as const

export const STARTING_TRANSPORT = ['walk', 'danfo', 'keke', 'okada'] as const

export const NO_AGE_OR_LIFE_STAGE_SYSTEM = true
export const NO_REQUEST_MONEY_FEATURE = true

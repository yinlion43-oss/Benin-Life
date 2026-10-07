// Region configuration. Countries, units, currencies and starter places are data, so supporting
// another country never needs a code change. Nothing here assigns a member's language, look or
// identity: these are only defaults a member can override in Settings.
import type { LatLon } from './geo.ts'

export interface CountryDefaults { units: 'metric' | 'imperial'; currency: string }

const IMPERIAL = new Set(['US', 'LR', 'MM'])
const CURRENCY: Record<string, string> = {
  NG: 'NGN', KE: 'KES', GH: 'GHS', ZA: 'ZAR', UG: 'UGX', TZ: 'TZS', RW: 'RWF', ET: 'ETB', EG: 'EGP', MA: 'MAD', SN: 'XOF', CI: 'XOF',
  GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', PT: 'EUR', SE: 'SEK', PL: 'PLN',
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CO: 'COP', IN: 'INR', PK: 'PKR', BD: 'BDT', ID: 'IDR', PH: 'PHP',
  JP: 'JPY', KR: 'KRW', CN: 'CNY', AU: 'AUD', NZ: 'NZD', AE: 'AED', SA: 'SAR', TR: 'TRY',
}

export function countryDefaults(countryCode: string): CountryDefaults {
  const code = countryCode.toUpperCase()
  return { units: IMPERIAL.has(code) ? 'imperial' : 'metric', currency: CURRENCY[code] ?? 'USD' }
}

export interface StarterPlace { label: string; countryCode: string; anchor: LatLon; /** First-level administrative area: the state, county, nation or prefecture. */ region: string }

/**
 * Well-known public places offered as quick starts. They are gazetteer points, not anyone's
 * location, and the list is only a convenience: any place the geocoder knows can be chosen.
 */
export const STARTER_PLACES: StarterPlace[] = [
  { label: 'Benin City', countryCode: 'NG', anchor: { lat: 6.335, lon: 5.6037 }, region: 'Edo' },
]

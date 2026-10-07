// Shared player-facing identity. Keep the manifest and browser title aligned with this name.
export const brand = {
  name: 'Benin Life',
  shortName: 'Benin Life',
  provisional: false,
  tagline: 'Your Life Creates Your Story.',
  slug: 'benin-life',
  version: '0.1.0',
  /** Matches the amber mark in src/ui/BrandMark.vue. */
  accent: '#ffb020',
  accentInk: '#241a05',
  supportUrl: '',
} as const

export const brandTitle = (page?: string): string => (page ? `${page} · ${brand.name}` : brand.name)

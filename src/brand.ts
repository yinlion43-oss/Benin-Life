// Benin Life player-facing identity.
export const brand = {
  name: 'Benin Life',
  shortName: 'Benin Life',
  provisional: false,
  tagline: 'Your Life Creates Your Story.',
  slug: 'benin-life',
  version: '0.1.0',
  accent: '#ffb020',
  accentInk: '#241a05',
  supportUrl: 'https://goalmatic.io/support',
} as const

export const brandTitle = (page?: string): string => (page ? `${page} · ${brand.name}` : brand.name)

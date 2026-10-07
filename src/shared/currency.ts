// Benin-Life's only in-game currency is the Nigerian naira (NGN).
// These values are game money only; they are not real-money balances or cash-out funds.
export const GAME_CURRENCY = {
  code: 'NGN',
  symbol: '₦',
  name: 'Naira',
} as const

export function formatGameMoney(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: GAME_CURRENCY.code, maximumFractionDigits: 0 }).format(Math.round(amount))
}

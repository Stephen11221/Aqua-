// Currency formatting utilities with Kenyan Shillings (KES / KSh) as primary standard

export type CurrencyCode = 'KES' | 'USD';

// Standard exchange rate: 1 USD ≈ 130 KES
export const USD_TO_KES_RATE = 130;

/**
 * Format an amount in Kenyan Shillings (KSh)
 * e.g., 1500 => "KSh 1,500"
 */
export function formatKES(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
}

/**
 * Format an amount in US Dollars ($)
 * e.g., 25 => "$25"
 */
export function formatUSD(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Universal currency formatter with dual-display support
 */
export function formatPrice(
  amountInKES: number, 
  currency: CurrencyCode = 'KES',
  showEquivalent: boolean = true
): string {
  if (currency === 'KES') {
    const kesStr = `KSh ${Math.round(amountInKES).toLocaleString('en-KE')}`;
    if (showEquivalent) {
      const usdApprox = Math.round(amountInKES / USD_TO_KES_RATE);
      return `${kesStr} (~$${usdApprox})`;
    }
    return kesStr;
  } else {
    const usdAmount = Math.round(amountInKES / USD_TO_KES_RATE);
    return `$${usdAmount.toLocaleString('en-US')}`;
  }
}

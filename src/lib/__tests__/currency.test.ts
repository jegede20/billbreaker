import { describe, expect, it } from 'vitest';
import {
  formatMoney,
  getCurrencySymbol,
  getQuickTokenAmounts,
} from '@/lib/currency';

describe('BillBreaker Currency Formatting', () => {
  it('formats zero-decimal currencies like NGN cleanly', () => {
    const formatted = formatMoney(48000, 'NGN');
    expect(formatted).toContain('48,000');
  });

  it('formats decimal tariff rates properly for USD, GBP, EUR, and ZAR', () => {
    expect(formatMoney(0.17, 'USD', { forRate: true })).toContain('0.17');
    expect(formatMoney(0.25, 'GBP', { forRate: true })).toContain('0.25');
    expect(formatMoney(3.45, 'ZAR', { forRate: true })).toMatch(/3[.,]45/);
  });

  it('returns appropriate quick token chips per currency', () => {
    expect(getQuickTokenAmounts('NGN', 48000)).toEqual([
      5000, 10000, 20000, 50000,
    ]);
    expect(getQuickTokenAmounts('KES', 5000)).toEqual([
      1000, 2500, 5000, 10000,
    ]);
    expect(getQuickTokenAmounts('ZAR', 1200)).toEqual([200, 500, 1000, 2000]);
  });

  it('extracts narrow currency symbols via Intl.NumberFormat', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('GBP')).toBe('£');
    expect(getCurrencySymbol('EUR')).toBe('€');
  });
});

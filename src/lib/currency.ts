const ZERO_DECIMAL_CURRENCIES = new Set([
  'NGN',
  'UGX',
  'TZS',
  'RWF',
  'KES',
  'INR',
  'ETB',
]);

const LOCALE_BY_CURRENCY: Record<string, string> = {
  NGN: 'en-NG',
  GHS: 'en-GH',
  KES: 'en-KE',
  ZAR: 'en-ZA',
  UGX: 'en-UG',
  TZS: 'en-TZ',
  RWF: 'en-RW',
  EGP: 'en-EG',
  ETB: 'en-ET',
  ZMW: 'en-ZM',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
  INR: 'en-IN',
  CAD: 'en-CA',
  AUD: 'en-AU',
  BRL: 'pt-BR',
};

export interface FormatMoneyOptions {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  forRate?: boolean;
}

export function formatMoney(
  amount: number,
  currencyCode: string = 'NGN',
  options?: FormatMoneyOptions
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const code = (currencyCode || 'NGN').toUpperCase();
  const locale = LOCALE_BY_CURRENCY[code] || 'en-US';

  const isZeroDec = ZERO_DECIMAL_CURRENCIES.has(code);
  let maxFrac = options?.maximumFractionDigits;
  let minFrac = options?.minimumFractionDigits;

  if (options?.forRate) {
    if (Math.abs(safeAmount) < 10 && safeAmount % 1 !== 0) {
      maxFrac = maxFrac ?? 2;
      minFrac = minFrac ?? 2;
    } else if (safeAmount % 1 !== 0) {
      maxFrac = maxFrac ?? 2;
      minFrac = minFrac ?? 0;
    } else {
      maxFrac = maxFrac ?? 0;
      minFrac = minFrac ?? 0;
    }
  } else {
    if (maxFrac === undefined) {
      maxFrac = isZeroDec || Math.abs(safeAmount) >= 100 ? 0 : 2;
    }
    if (minFrac === undefined) {
      minFrac = 0;
    }
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: maxFrac,
      minimumFractionDigits: minFrac,
    }).format(safeAmount);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: maxFrac,
      minimumFractionDigits: minFrac,
    }).format(safeAmount);
  }
}

export function getCurrencySymbol(currencyCode: string = 'NGN'): string {
  const code = (currencyCode || 'NGN').toUpperCase();
  const locale = LOCALE_BY_CURRENCY[code] || 'en-US';
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    const symbolPart = parts.find((p) => p.type === 'currency');
    return symbolPart ? symbolPart.value : code;
  } catch {
    return code;
  }
}

export function getQuickTokenAmounts(currencyCode: string, monthlyBill: number): number[] {
  const code = (currencyCode || 'NGN').toUpperCase();
  const presets: Record<string, number[]> = {
    NGN: [5000, 10000, 20000, 50000],
    GHS: [50, 100, 200, 500],
    KES: [1000, 2500, 5000, 10000],
    ZAR: [200, 500, 1000, 2000],
    UGX: [20000, 50000, 100000, 200000],
    TZS: [10000, 25000, 50000, 100000],
    RWF: [5000, 10000, 25000, 50000],
    INR: [500, 1000, 2000, 5000],
    USD: [20, 50, 100, 200],
    GBP: [20, 50, 100, 150],
    EUR: [20, 50, 100, 200],
  };

  if (presets[code]) {
    return presets[code];
  }

  if (monthlyBill > 0) {
    const quarter = Math.max(10, Math.round(monthlyBill * 0.25));
    const half = Math.max(20, Math.round(monthlyBill * 0.5));
    const full = Math.max(40, Math.round(monthlyBill));
    const double = Math.max(80, Math.round(monthlyBill * 1.5));
    return [quarter, half, full, double];
  }

  return [20, 50, 100, 200];
}

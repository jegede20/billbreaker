# BillBreaker

**Find out which appliance is consuming your light bill.**

BillBreaker is a free, installable PWA that breaks a household's monthly electricity bill down by appliance, ranks the biggest energy drains, and calculates how much money (and how many extra prepaid token days) practical daily habit changes will save.

---

## Features (V1)

- **Appliance Cost & Share Ranking**: Add presets from 20+ household appliances or custom items. Adjust wattage, quantity, compressor duty cycle, power source (`Grid`, `Generator`, `Inverter/Solar`), and daily runtime.
- **Signature "Bill Breaker" Visual**: Stacked horizontal share bar and ranked breakdown bars built with pure CSS and inline SVG.
- **Grid Outage & Backup Power Aware**: Set daily grid supply hours (`0–24h`). Extra appliance runtime automatically spills over to your configured backup power source (fuel generator or solar/inverter) or alerts you to unpowered hours.
- **Bill Calibration**: Enter your last real monthly electricity bill (and optional kWh) to scale all appliance estimates to match your actual meter.
- **Data-Driven Savings What-Ifs**: Toggle practical changes (cut AC by 1 hr/day, raise AC thermostat by 2°C, switch bulbs to LED, unplug standby devices, or reduce top appliances by 1 hr/day) and see monthly, yearly, and percentage savings live.
- **Prepaid Token Calculator**: Enter any token/top-up amount to see how many days it lasts, your projected top-up date, and how many extra days you gain with savings applied.
- **100% On-Device & Offline PWA**: Zero accounts, zero cloud database. All data persists locally in `localStorage` via a versioned, corruption-safe typed helper (`src/lib/storage.ts`), and works offline via `/public/sw.js`.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (`#FFFBF2` warm cream light-mode palette, Plus Jakarta Sans via `next/font`)
- **Formatting**: Native `Intl.NumberFormat` (`src/lib/currency.ts`)
- **Testing**: Vitest (`src/lib/__tests__/`)
- **Hosting**: Vercel Free Tier (`vercel.json`)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server on http://localhost:3000
npm run dev

# 3. Run unit tests
npm test

# 4. Run TypeScript typecheck & production build
npm run typecheck
npm run build
```

---

## Deploying to Vercel (Free Tier)

### Option A: Deploy via GitHub (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep all default settings (`Framework Preset: Next.js`, no environment variables required) and click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
npx vercel --prod
```

If you deploy to a custom domain, update `metadataBase` in `src/app/layout.tsx`, `src/app/robots.ts`, and `src/app/sitemap.ts` to match your production URL.

'use client';

import React, { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ApplianceIcon,
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  MenuIcon,
} from '@/components/Icons';
import { APPLIANCE_TEMPLATES } from '@/lib/costEngine';
import { formatMoney } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';

interface LandingPageProps {
  onStartApp: (initialCurrencyCode?: string) => void;
}

const CURRENCY_CHIPS = [
  { code: 'NGN', label: 'NGN ₦', rate: 200, countryCode: 'NG' },
  { code: 'ZAR', label: 'ZAR R', rate: 3.45, countryCode: 'ZA' },
  { code: 'USD', label: 'USD $', rate: 0.17, countryCode: 'US' },
  { code: 'GBP', label: 'GBP £', rate: 0.25, countryCode: 'GB' },
  { code: 'EUR', label: 'EUR €', rate: 0.28, countryCode: 'EU' },
  { code: 'INR', label: 'INR ₹', rate: 7.5, countryCode: 'IN' },
];

const HERO_SAMPLE_BARS = [
  {
    name: 'Air conditioner',
    cost: 19200,
    percent: 40,
    color: '#EF4444',
    textColor: '#DC2626',
    iconKey: 'ac',
  },
  {
    name: 'Deep freezer',
    cost: 9600,
    percent: 20,
    color: '#F59E0B',
    textColor: '#B45309',
    iconKey: 'freezer',
  },
  {
    name: 'Standing fans',
    cost: 7200,
    percent: 15,
    color: '#1F2937',
    textColor: '#1F2937',
    iconKey: 'fan',
  },
  {
    name: 'TV and decoder',
    cost: 4800,
    percent: 10,
    color: '#FBBF24',
    textColor: '#92400E',
    iconKey: 'tv',
  },
  {
    name: 'Lighting',
    cost: 3360,
    percent: 7,
    color: '#16A34A',
    textColor: '#15803D',
    iconKey: 'bulb',
  },
  {
    name: 'Others',
    cost: 3840,
    percent: 8,
    color: '#6B7280',
    textColor: '#4B5563',
    iconKey: 'phone',
  },
];

const SAVINGS_EXAMPLE_CARDS = [
  {
    title: 'Cut AC by 1 hour a day',
    detail: 'Run AC for 2 hours instead of 3 and switch to a standing fan.',
    savedMonthly: 6400,
    tag: 'Biggest win',
  },
  {
    title: 'Raise AC temperature 2°',
    detail: 'Set thermostat to 24°C–25°C to reduce compressor load.',
    savedMonthly: 3200,
    tag: 'Zero effort',
  },
  {
    title: 'Switch to LED bulbs',
    detail: 'Replace older higher-wattage bulbs across 8 light points.',
    savedMonthly: 2100,
    tag: 'One-time swap',
  },
  {
    title: 'Unplug standby devices',
    detail: 'Turn off TV, decoder, and entertainment sockets overnight.',
    savedMonthly: 1200,
    tag: 'Daily habit',
  },
];

export function LandingPage({ onStartApp }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_CHIPS[0]);
  const [miniApplianceId, setMiniApplianceId] = useState('air-conditioner');
  const [miniHours, setMiniHours] = useState(4);

  const selectedTemplate =
    APPLIANCE_TEMPLATES.find((a) => a.id === miniApplianceId) ||
    APPLIANCE_TEMPLATES[0];

  const miniDailyKwh =
    ((selectedTemplate.defaultWatts * miniHours) / 1000) *
    selectedTemplate.defaultDutyCycle;
  const miniMonthlyKwh = miniDailyKwh * 30;
  const miniMonthlyCost = miniMonthlyKwh * selectedCurrency.rate;

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#1F2937] pb-24 md:pb-0">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-[#FFFBF2]/95 border-b border-[#F0E7D3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1F2937]">
            <a
              href="#how-it-works"
              className="hover:text-[#6B7280] transition-colors py-2"
            >
              {STRINGS.nav.howItWorks}
            </a>
            <a
              href="#features"
              className="hover:text-[#6B7280] transition-colors py-2"
            >
              {STRINGS.nav.features}
            </a>
            <a
              href="#faq"
              className="hover:text-[#6B7280] transition-colors py-2"
            >
              {STRINGS.nav.faq}
            </a>
          </nav>

          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => onStartApp(selectedCurrency.countryCode)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm transition-colors inline-flex items-center gap-2 border border-[#1F2937]/10"
            >
              <span>{STRINGS.nav.breakMyBill}</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-[#F0E7D3] bg-white text-[#1F2937]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={22} />}
          </button>
        </div>

        {/* Mobile Collapsed Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#F0E7D3] px-4 py-4 space-y-2">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-xl font-bold text-[#1F2937] hover:bg-[#FFFBF2]"
            >
              {STRINGS.nav.howItWorks}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-xl font-bold text-[#1F2937] hover:bg-[#FFFBF2]"
            >
              {STRINGS.nav.features}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-xl font-bold text-[#1F2937] hover:bg-[#FFFBF2]"
            >
              {STRINGS.nav.faq}
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartApp(selectedCurrency.countryCode);
              }}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#F59E0B] text-[#1F2937] font-extrabold text-base inline-flex items-center justify-center gap-2"
            >
              <span>{STRINGS.nav.breakMyBill}</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F0E7D3] text-xs sm:text-sm font-bold text-[#1F2937]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>{STRINGS.landing.eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F2937] leading-[1.12]">
              {STRINGS.landing.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl">
              {STRINGS.landing.subtext}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onStartApp(selectedCurrency.countryCode)}
                className="min-h-[52px] px-7 py-3.5 rounded-2xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-base transition-colors inline-flex items-center justify-center gap-2.5 border border-[#1F2937]/10"
              >
                <span>{STRINGS.landing.primaryCta}</span>
                <ArrowRightIcon size={18} />
              </button>

              <a
                href="#how-it-works"
                className="min-h-[52px] px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FFFBF2] text-[#1F2937] font-bold text-base border border-[#F0E7D3] transition-colors inline-flex items-center justify-center"
              >
                {STRINGS.landing.secondaryCta}
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#6B7280]">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={15} className="text-[#15803D]" />
                Works for prepaid &amp; postpaid meters
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={15} className="text-[#15803D]" />
                Grid, generator &amp; solar aware
              </span>
            </div>
          </div>

          {/* Right Column: Sample Monthly Bill Visual (₦48,000) */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-[#F0E7D3] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F0E7D3]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    {STRINGS.landing.sampleCardTitle}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-1">
                    {formatMoney(48000, 'NGN')}
                    <span className="text-sm font-medium text-[#6B7280] ml-1.5">
                      / month
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#1F2937]">
                  240 kWh
                </span>
              </div>

              {/* Signature Stacked Bill-Breaker Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] mb-1.5">
                  <span>Bill broken into appliance slices</span>
                  <span>100% accounted</span>
                </div>
                <div className="h-7 w-full rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] p-1 flex items-stretch gap-1">
                  {HERO_SAMPLE_BARS.map((bar) => (
                    <div
                      key={bar.name}
                      style={{
                        width: `${bar.percent}%`,
                        backgroundColor: bar.color,
                      }}
                      className="h-full first:rounded-l-md last:rounded-r-md"
                      title={`${bar.name}: ${formatMoney(bar.cost, 'NGN')} (${bar.percent}%)`}
                    />
                  ))}
                </div>
              </div>

              {/* Ranked Bars */}
              <div className="mt-4 space-y-2.5">
                {HERO_SAMPLE_BARS.map((bar) => (
                  <div
                    key={bar.name}
                    className="p-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3]"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#1F2937]">
                        <ApplianceIcon iconKey={bar.iconKey} size={16} />
                        <span>{bar.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1F2937]">
                          {formatMoney(bar.cost, 'NGN')}
                        </span>
                        <span
                          className="text-xs font-bold min-w-[34px] text-right"
                          style={{ color: bar.textColor }}
                        >
                          {bar.percent}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white border border-[#F0E7D3] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.percent}%`,
                          backgroundColor: bar.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Win Preview Banner inside Hero Card */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#15803D]">
                    Quick win spotted
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#1F2937]">
                    Cut AC by 1 hr/day to save {formatMoney(6400, 'NGN')}/month
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartApp(selectedCurrency.countryCode)}
                  className="shrink-0 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#15803D] text-white text-xs font-extrabold hover: opacity-95"
                >
                  Try yours
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Strip */}
      <section className="border-y border-[#F0E7D3] bg-white py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-[#1F2937]">
            {STRINGS.landing.currencyStripLabel}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CURRENCY_CHIPS.map((chip) => {
              const isSelected = selectedCurrency.code === chip.code;
              return (
                <button
                  key={chip.code}
                  type="button"
                  onClick={() => setSelectedCurrency(chip)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-colors ${
                    isSelected
                      ? 'bg-[#F59E0B] text-[#1F2937] border-[#1F2937]'
                      : 'bg-[#FFFBF2] text-[#1F2937] border-[#F0E7D3] hover:border-[#1F2937]/40'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Mini-Calculator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-8">
          <div className="max-w-2xl mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#1F2937] mb-2">
              Interactive preview · {selectedCurrency.label}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              {STRINGS.landing.miniCalc.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-1">
              {STRINGS.landing.miniCalc.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label
                  htmlFor="mini-calc-appliance"
                  className="block text-sm font-bold text-[#1F2937] mb-2"
                >
                  {STRINGS.landing.miniCalc.applianceLabel}
                </label>
                <select
                  id="mini-calc-appliance"
                  value={miniApplianceId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setMiniApplianceId(nextId);
                    const tpl = APPLIANCE_TEMPLATES.find(
                      (a) => a.id === nextId
                    );
                    if (tpl) setMiniHours(tpl.defaultHoursPerDay);
                  }}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-bold text-sm sm:text-base focus:outline-none focus:border-[#1F2937]"
                >
                  {APPLIANCE_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} (~{tpl.defaultWatts}W typical)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="mini-calc-hours"
                    className="text-sm font-bold text-[#1F2937]"
                  >
                    {STRINGS.landing.miniCalc.hoursLabel}
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-[#F59E0B] text-[#1F2937] font-extrabold text-sm">
                    {miniHours} {miniHours === 1 ? 'hour' : 'hours'} / day
                  </span>
                </div>
                <input
                  id="mini-calc-hours"
                  type="range"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={miniHours}
                  onChange={(e) => setMiniHours(parseFloat(e.target.value))}
                  className="w-full h-3 rounded-lg accent-[#F59E0B] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-medium text-[#6B7280] mt-1">
                  <span>0.5 hr</span>
                  <span>6 hrs</span>
                  <span>12 hrs</span>
                  <span>18 hrs</span>
                  <span>24 hrs</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    {STRINGS.landing.miniCalc.monthlyCostLabel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#F0E7D3] text-xs font-bold text-[#6B7280]">
                    {STRINGS.brand.estimateBadge}
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                  {formatMoney(miniMonthlyCost, selectedCurrency.code)}
                  <span className="text-sm font-medium text-[#6B7280] ml-1.5">
                    / month
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F0E7D3] text-xs">
                  <div>
                    <span className="text-[#6B7280] block">
                      {STRINGS.landing.miniCalc.monthlyKwhLabel}
                    </span>
                    <span className="font-extrabold text-sm text-[#1F2937]">
                      {miniMonthlyKwh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Default rate used</span>
                    <span className="font-extrabold text-sm text-[#1F2937]">
                      {formatMoney(selectedCurrency.rate, selectedCurrency.code, {
                        forRate: true,
                      })}
                      /kWh
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280]">
                  {STRINGS.landing.miniCalc.disclaimer}
                </p>

                <button
                  type="button"
                  onClick={() => onStartApp(selectedCurrency.countryCode)}
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Build my full household bill</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16"
      >
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
            {STRINGS.landing.howItWorks.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mt-1">
            {STRINGS.landing.howItWorks.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STRINGS.landing.howItWorks.steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-3xl border border-[#F0E7D3] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#F59E0B] text-[#1F2937] font-extrabold text-base flex items-center justify-center mb-5">
                  {step.number}
                </div>
                <h3 className="text-xl font-extrabold text-[#1F2937] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16"
      >
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
            {STRINGS.landing.features.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mt-1">
            {STRINGS.landing.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {STRINGS.landing.features.items.map((feat, idx) => (
            <div
              key={feat.title}
              className="bg-white rounded-3xl border border-[#F0E7D3] p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-center shrink-0 font-extrabold text-[#1F2937]">
                0{idx + 1}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1F2937] mb-1">
                  {feat.title}
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Examples + Token Example */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
              {STRINGS.landing.savingsExamples.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
              {STRINGS.landing.savingsExamples.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] mt-2">
              {STRINGS.landing.savingsExamples.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAVINGS_EXAMPLE_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-[#F0E7D3] text-xs font-bold text-[#1F2937] mb-3">
                    {card.tag}
                  </span>
                  <h3 className="text-base font-extrabold text-[#1F2937]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                    {card.detail}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F0E7D3]">
                  <span className="text-xs font-bold text-[#6B7280] block">
                    Saves per month
                  </span>
                  <span className="text-xl font-extrabold text-[#15803D]">
                    {formatMoney(card.savedMonthly, 'NGN')} / month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Combined Savings + Token Stretch Callout */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Total combined savings (27% of bill)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] mt-1">
                  {formatMoney(12900, 'NGN')} / month
                </div>
                <p className="text-xs font-bold text-[#1F2937] mt-1">
                  That is {formatMoney(154800, 'NGN')} saved every year
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold shrink-0">
                -27% bill
              </span>
            </div>

            <div className="rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Prepaid token stretch ({formatMoney(20000, 'NGN')} top-up)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
                  12 days{' '}
                  <span className="text-[#15803D]">→ 17 days</span>
                </div>
                <p className="text-xs font-bold text-[#6B7280] mt-1">
                  At {formatMoney(1600, 'NGN')}/day now vs +5 extra days with savings applied
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#F59E0B] text-[#1F2937] text-xs font-extrabold shrink-0">
                +5 days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16"
      >
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
            {STRINGS.landing.faq.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mt-1">
            {STRINGS.landing.faq.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STRINGS.landing.faq.items.map((faq) => (
            <div
              key={faq.question}
              className="bg-white rounded-3xl border border-[#F0E7D3] p-6"
            >
              <h3 className="text-lg font-extrabold text-[#1F2937] mb-2">
                {faq.question}
              </h3>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Band in Amber */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="rounded-3xl bg-[#F59E0B] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937]">
              {STRINGS.landing.finalCta.title}
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#1F2937]/80 mt-1">
              {STRINGS.landing.finalCta.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartApp(selectedCurrency.countryCode)}
            className="min-h-[52px] px-8 py-4 rounded-2xl bg-[#1F2937] hover:bg-[#1F2937]/90 text-white font-extrabold text-base transition-colors inline-flex items-center gap-2.5 shrink-0"
          >
            <span>{STRINGS.landing.finalCta.button}</span>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F0E7D3] py-8 mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <p className="text-xs sm:text-sm font-medium text-[#6B7280] text-center sm:text-right">
            {STRINGS.brand.footerDisclaimer}
          </p>
        </div>
      </footer>

      {/* Sticky Bottom "Break my bill" Button on Mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#FFFBF2]/95 border-t border-[#F0E7D3]">
        <button
          type="button"
          onClick={() => onStartApp(selectedCurrency.countryCode)}
          className="w-full min-h-[50px] py-3 px-6 rounded-2xl bg-[#F59E0B] text-[#1F2937] font-extrabold text-base inline-flex items-center justify-center gap-2 border border-[#1F2937]/15"
        >
          <span>{STRINGS.landing.primaryCta}</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowRightIcon, CheckIcon } from '@/components/Icons';
import { getTariffPreset, TARIFF_PRESETS } from '@/lib/costEngine';
import { getQuickTokenAmounts } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import {
  MeterType,
  PowerSourceOption,
  UserSettings,
} from '@/types/billbreaker';

const CUSTOM_CURRENCIES = [
  { code: 'USD', label: 'USD ($)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'NGN', label: 'NGN (₦)' },
  { code: 'GHS', label: 'GHS (GH₵)' },
  { code: 'KES', label: 'KES (KSh)' },
  { code: 'ZAR', label: 'ZAR (R)' },
  { code: 'UGX', label: 'UGX (USh)' },
  { code: 'TZS', label: 'TZS (TSh)' },
  { code: 'RWF', label: 'RWF (RF)' },
  { code: 'EGP', label: 'EGP (E£)' },
  { code: 'ETB', label: 'ETB (Br)' },
  { code: 'ZMW', label: 'ZMW (ZK)' },
  { code: 'INR', label: 'INR (₹)' },
  { code: 'CAD', label: 'CAD (CA$)' },
  { code: 'AUD', label: 'AUD (A$)' },
  { code: 'BRL', label: 'BRL (R$)' },
];

interface SetupWizardProps {
  initialSettings: UserSettings;
  onComplete: (newSettings: UserSettings, useStarterPack: boolean) => void;
  onSkip: () => void;
}

export function SetupWizard({
  initialSettings,
  onComplete,
  onSkip,
}: SetupWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [countryCode, setCountryCode] = useState(initialSettings.countryCode);
  const [currencyCode, setCurrencyCode] = useState(initialSettings.currencyCode);
  const [meterType, setMeterType] = useState<MeterType>(
    initialSettings.meterType
  );
  const [rateInput, setRateInput] = useState<string>(
    String(initialSettings.ratePerKwh)
  );
  const [powerSources, setPowerSources] = useState<PowerSourceOption[]>(
    initialSettings.powerSources.length > 0
      ? initialSettings.powerSources
      : ['grid']
  );
  const [gridHoursInput, setGridHoursInput] = useState<string>(
    String(initialSettings.gridSupplyHours ?? 24)
  );
  const [fuelPriceInput, setFuelPriceInput] = useState<string>(
    String(initialSettings.generatorFuelPricePerLiter)
  );
  const [litersPerHourInput, setLitersPerHourInput] = useState<string>(
    String(initialSettings.generatorLitersPerHour)
  );
  const [inverterRateInput, setInverterRateInput] = useState<string>(
    String(initialSettings.inverterCostPerKwh)
  );
  const [useStarterPack, setUseStarterPack] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCountryCode(initialSettings.countryCode);
    setCurrencyCode(initialSettings.currencyCode);
    setMeterType(initialSettings.meterType);
    setRateInput(
      initialSettings.ratePerKwh > 0 ? String(initialSettings.ratePerKwh) : ''
    );
    setPowerSources(
      initialSettings.powerSources.length > 0
        ? initialSettings.powerSources
        : ['grid']
    );
    setGridHoursInput(String(initialSettings.gridSupplyHours ?? 24));
    setFuelPriceInput(String(initialSettings.generatorFuelPricePerLiter));
    setLitersPerHourInput(String(initialSettings.generatorLitersPerHour));
    setInverterRateInput(String(initialSettings.inverterCostPerKwh));
  }, [initialSettings]);

  const selectedPreset = getTariffPreset(countryCode);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    const preset = getTariffPreset(newCode);
    setCurrencyCode(preset.currencyCode);
    if (preset.defaultRatePerKwh !== null) {
      setRateInput(String(preset.defaultRatePerKwh));
    } else {
      setRateInput('');
    }
    setFuelPriceInput(String(preset.defaultFuelPricePerLiter));
    setLitersPerHourInput(String(preset.defaultGeneratorLitersPerHour));
    setError(null);
  };

  const togglePowerSource = (src: PowerSourceOption) => {
    setPowerSources((prev) => {
      if (prev.includes(src)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((item) => item !== src);
      }
      return [...prev, src];
    });
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      const parsedRate = parseFloat(rateInput);
      if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
        setError(STRINGS.validation.ratePositive);
        return;
      }
      setStep(3);
      return;
    }
  };

  const handleFinish = () => {
    setError(null);
    const parsedRate = parseFloat(rateInput);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      setError(STRINGS.validation.ratePositive);
      return;
    }

    const parsedGridHours = parseFloat(gridHoursInput);
    if (
      !Number.isFinite(parsedGridHours) ||
      parsedGridHours < 0 ||
      parsedGridHours > 24
    ) {
      setError(STRINGS.validation.gridHoursRange);
      return;
    }

    const parsedFuelPrice = parseFloat(fuelPriceInput);
    if (!Number.isFinite(parsedFuelPrice) || parsedFuelPrice < 0) {
      setError(STRINGS.validation.fuelPriceNonNegative);
      return;
    }

    const parsedLiters = parseFloat(litersPerHourInput);
    if (!Number.isFinite(parsedLiters) || parsedLiters <= 0) {
      setError(STRINGS.validation.litersPerHourPositive);
      return;
    }

    const parsedInverterRate = Math.max(0, parseFloat(inverterRateInput) || 0);
    const quickTokens = getQuickTokenAmounts(currencyCode, 0);

    onComplete(
      {
        ...initialSettings,
        setupCompleted: true,
        countryCode,
        countryName: selectedPreset.countryName,
        currencyCode,
        ratePerKwh: parsedRate,
        meterType,
        powerSources,
        gridSupplyHours: parsedGridHours,
        generatorFuelPricePerLiter: parsedFuelPrice,
        generatorLitersPerHour: parsedLiters,
        inverterCostPerKwh: parsedInverterRate,
        lastTokenAmount: quickTokens[2] || 20000,
      },
      useStarterPack
    );
  };

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#1F2937] flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between">
        <BrandLogo size="sm" />
        <button
          type="button"
          onClick={onSkip}
          className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#6B7280] hover:text-[#1F2937] hover:bg-white border border-transparent hover:border-[#F0E7D3] transition-colors"
        >
          {STRINGS.setup.skip}
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-xl w-full mx-auto my-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-8">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#6B7280] mb-2">
            <span>{STRINGS.setup.title}</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#FFFBF2] border border-[#F0E7D3] overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] transition-all duration-200 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 1: Country & Currency */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937]">
                {STRINGS.setup.step1Title}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {STRINGS.setup.step1Subtitle}
              </p>
            </div>

            <div>
              <label
                htmlFor="setup-country"
                className="block text-sm font-bold text-[#1F2937] mb-2"
              >
                Country or Region
              </label>
              <select
                id="setup-country"
                value={countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-bold text-base focus:outline-none focus:border-[#1F2937]"
              >
                {TARIFF_PRESETS.map((preset) => (
                  <option key={preset.countryCode} value={preset.countryCode}>
                    {preset.countryName} ({preset.currencyCode}{' '}
                    {preset.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="setup-currency"
                className="block text-sm font-bold text-[#1F2937] mb-2"
              >
                Currency
              </label>
              <select
                id="setup-currency"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-bold text-base focus:outline-none focus:border-[#1F2937]"
              >
                {CUSTOM_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs text-[#6B7280] leading-relaxed">
              <strong className="text-[#1F2937]">Privacy first:</strong> Your
              selection is stored only in this browser. No account or internet
              connection is needed after loading.
            </div>
          </div>
        )}

        {/* Step 2: Meter Type & Rate per kWh */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937]">
                {STRINGS.setup.step2Title}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {STRINGS.setup.step2Subtitle}
              </p>
            </div>

            <div>
              <span className="block text-sm font-bold text-[#1F2937] mb-2">
                Meter type
              </span>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      id: 'prepaid',
                      title: 'Prepaid (Tokens)',
                      desc: 'Buy units or tokens upfront',
                    },
                    {
                      id: 'postpaid',
                      title: 'Postpaid (Monthly)',
                      desc: 'Pay a monthly utility bill',
                    },
                  ] as const
                ).map((option) => {
                  const active = meterType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMeterType(option.id)}
                      className={`p-4 rounded-2xl border text-left transition-colors min-h-[72px] ${
                        active
                          ? 'bg-[#FFFBF2] border-[#1F2937] ring-1 ring-[#1F2937]'
                          : 'bg-white border-[#F0E7D3] hover:bg-[#FFFBF2]'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-[#1F2937]">
                        {option.title}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        {option.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="setup-rate"
                  className="text-sm font-bold text-[#1F2937]"
                >
                  Electricity rate per kWh ({currencyCode})
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#6B7280]">
                  {STRINGS.brand.estimateBadge}
                </span>
              </div>
              <input
                id="setup-rate"
                type="number"
                step="any"
                min="0.001"
                placeholder="Enter your tariff per kWh"
                value={rateInput}
                onChange={(e) => {
                  setRateInput(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-extrabold text-lg focus:outline-none focus:border-[#1F2937]"
              />
              <p className="text-xs text-[#6B7280] mt-2">
                {selectedPreset.rateNote}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Power Sources & Grid Supply Hours */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937]">
                {STRINGS.setup.step3Title}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {STRINGS.setup.step3Subtitle}
              </p>
            </div>

            <div>
              <span className="block text-sm font-bold text-[#1F2937] mb-2">
                Power sources used at home
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'grid', label: 'National Grid' },
                    { id: 'generator', label: 'Fuel Generator' },
                    { id: 'inverter', label: 'Battery Inverter' },
                    { id: 'solar', label: 'Solar System' },
                  ] as const
                ).map((src) => {
                  const active = powerSources.includes(src.id);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => togglePowerSource(src.id)}
                      className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left font-bold text-sm flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-[#FFFBF2] border-[#1F2937] text-[#1F2937]'
                          : 'bg-white border-[#F0E7D3] text-[#6B7280]'
                      }`}
                    >
                      <span>{src.label}</span>
                      {active && (
                        <span className="w-5 h-5 rounded-md bg-[#F59E0B] text-[#1F2937] flex items-center justify-center">
                          <CheckIcon size={13} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="setup-grid-hours"
                  className="text-sm font-bold text-[#1F2937]"
                >
                  Average hours of grid power per day
                </label>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937]">
                  {gridHoursInput || 0} hrs / 24 hrs
                </span>
              </div>
              <input
                id="setup-grid-hours"
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={gridHoursInput}
                onChange={(e) => {
                  setGridHoursInput(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-extrabold text-base focus:outline-none focus:border-[#1F2937]"
              />
              <p className="text-xs text-[#6B7280] mt-1.5">
                Default is 24 hours. If your area has power outages, lower this
                number — extra hours will roll over to your backup source if set.
              </p>
            </div>

            {powerSources.includes('generator') && (
              <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="setup-fuel-price"
                    className="block text-xs font-bold text-[#1F2937] mb-1"
                  >
                    Fuel price per liter ({currencyCode})
                  </label>
                  <input
                    id="setup-fuel-price"
                    type="number"
                    min={0}
                    step="any"
                    value={fuelPriceInput}
                    onChange={(e) => setFuelPriceInput(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-[#F0E7D3] font-bold text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="setup-liters-hr"
                    className="block text-xs font-bold text-[#1F2937] mb-1"
                  >
                    Generator fuel burn (Liters / hr)
                  </label>
                  <input
                    id="setup-liters-hr"
                    type="number"
                    min={0.1}
                    step="any"
                    value={litersPerHourInput}
                    onChange={(e) => setLitersPerHourInput(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-[#F0E7D3] font-bold text-sm"
                  />
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] cursor-pointer">
              <input
                type="checkbox"
                checked={useStarterPack}
                onChange={(e) => setUseStarterPack(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#F59E0B]"
              />
              <span className="text-xs sm:text-sm font-bold text-[#1F2937]">
                {STRINGS.setup.starterPackLabel}
              </span>
            </label>
          </div>
        )}

        {/* Inline Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-xl bg-[#FFFBF2] border border-[#EF4444] text-xs sm:text-sm font-bold text-[#DC2626]"
          >
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-7 pt-5 border-t border-[#F0E7D3] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((prev) => (prev === 3 ? 2 : 1));
              }}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
            >
              {STRINGS.setup.back}
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm inline-flex items-center gap-2"
            >
              <span>{STRINGS.setup.next}</span>
              <ArrowRightIcon size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm inline-flex items-center gap-2"
            >
              <span>{STRINGS.setup.finish}</span>
              <ArrowRightIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="max-w-xl w-full mx-auto text-center text-xs text-[#6B7280]">
        {STRINGS.brand.footerDisclaimer}
      </div>
    </div>
  );
}

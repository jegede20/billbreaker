'use client';

import React, { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { CheckIcon, TrashIcon } from '@/components/Icons';
import { getTariffPreset, TARIFF_PRESETS } from '@/lib/costEngine';
import { formatMoney, getQuickTokenAmounts } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import {
  HouseholdCostSummary,
  MeterType,
  PowerSourceOption,
  UserSettings,
} from '@/types/billbreaker';

const CUSTOM_CURRENCIES = [
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
  { code: 'USD', label: 'USD ($)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'INR', label: 'INR (₹)' },
  { code: 'CAD', label: 'CAD (CA$)' },
  { code: 'AUD', label: 'AUD (A$)' },
  { code: 'BRL', label: 'BRL (R$)' },
];

interface SettingsViewProps {
  settings: UserSettings;
  summary: HouseholdCostSummary;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetAllData: () => void;
  onLoadSampleHousehold: () => void;
  onOpenSetupWizard?: () => void;
}

export function SettingsView({
  settings,
  summary,
  onUpdateSettings,
  onResetAllData,
  onLoadSampleHousehold,
  onOpenSetupWizard,
}: SettingsViewProps) {
  const [rateInput, setRateInput] = useState(String(settings.ratePerKwh));
  const [gridHoursInput, setGridHoursInput] = useState(
    String(settings.gridSupplyHours)
  );
  const [fuelPriceInput, setFuelPriceInput] = useState(
    String(settings.generatorFuelPricePerLiter)
  );
  const [litersInput, setLitersInput] = useState(
    String(settings.generatorLitersPerHour)
  );
  const [inverterRateInput, setInverterRateInput] = useState(
    String(settings.inverterCostPerKwh)
  );

  // Calibration inputs
  const [calAmountInput, setCalAmountInput] = useState(
    settings.calibration.realBillAmount
      ? String(settings.calibration.realBillAmount)
      : ''
  );
  const [calKwhInput, setCalKwhInput] = useState(
    settings.calibration.realBillKwh
      ? String(settings.calibration.realBillKwh)
      : ''
  );

  const [rateError, setRateError] = useState<string | null>(null);
  const [gridError, setGridError] = useState<string | null>(null);
  const [fuelError, setFuelError] = useState<string | null>(null);
  const [calError, setCalError] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    setRateInput(String(settings.ratePerKwh));
    setGridHoursInput(String(settings.gridSupplyHours));
    setFuelPriceInput(String(settings.generatorFuelPricePerLiter));
    setLitersInput(String(settings.generatorLitersPerHour));
    setInverterRateInput(String(settings.inverterCostPerKwh));
    setCalAmountInput(
      settings.calibration.realBillAmount
        ? String(settings.calibration.realBillAmount)
        : ''
    );
    setCalKwhInput(
      settings.calibration.realBillKwh
        ? String(settings.calibration.realBillKwh)
        : ''
    );
  }, [settings]);

  const showSavedFeedback = (msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 2500);
  };

  const preset = getTariffPreset(settings.countryCode);

  const handleCountrySelect = (countryCode: string) => {
    const nextPreset = getTariffPreset(countryCode);
    const nextRate = nextPreset.defaultRatePerKwh ?? settings.ratePerKwh;
    const quickTokens = getQuickTokenAmounts(nextPreset.currencyCode, 0);
    setRateInput(String(nextRate));
    setFuelPriceInput(String(nextPreset.defaultFuelPricePerLiter));
    setLitersInput(String(nextPreset.defaultGeneratorLitersPerHour));
    setRateError(null);

    onUpdateSettings({
      ...settings,
      countryCode: nextPreset.countryCode,
      countryName: nextPreset.countryName,
      currencyCode: nextPreset.currencyCode,
      ratePerKwh: nextRate,
      generatorFuelPricePerLiter: nextPreset.defaultFuelPricePerLiter,
      generatorLitersPerHour: nextPreset.defaultGeneratorLitersPerHour,
      lastTokenAmount: quickTokens[2] || 20000,
    });
    showSavedFeedback(`Switched to ${nextPreset.countryName} (${nextPreset.currencyCode}).`);
  };

  const handleCurrencySelect = (currencyCode: string) => {
    const quickTokens = getQuickTokenAmounts(currencyCode, 0);
    onUpdateSettings({
      ...settings,
      currencyCode,
      lastTokenAmount: quickTokens[2] || settings.lastTokenAmount,
    });
    showSavedFeedback(`Currency updated to ${currencyCode}.`);
  };

  const handleMeterTypeSelect = (meterType: MeterType) => {
    onUpdateSettings({
      ...settings,
      meterType,
    });
  };

  const handleRateChange = (val: string) => {
    setRateInput(val);
    const parsed = parseFloat(val);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setRateError(STRINGS.validation.ratePositive);
      return;
    }
    setRateError(null);
    onUpdateSettings({
      ...settings,
      ratePerKwh: parsed,
    });
  };

  const handleGridHoursChange = (val: string) => {
    setGridHoursInput(val);
    const parsed = parseFloat(val);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 24) {
      setGridError(STRINGS.validation.gridHoursRange);
      return;
    }
    setGridError(null);
    onUpdateSettings({
      ...settings,
      gridSupplyHours: parsed,
    });
  };

  const handleTogglePowerSource = (src: PowerSourceOption) => {
    const exists = settings.powerSources.includes(src);
    if (exists && settings.powerSources.length === 1) return;
    const next = exists
      ? settings.powerSources.filter((s) => s !== src)
      : [...settings.powerSources, src];
    onUpdateSettings({
      ...settings,
      powerSources: next,
    });
  };

  const handleFuelSettingsChange = (
    nextFuelPriceStr: string,
    nextLitersStr: string,
    nextInverterStr: string
  ) => {
    setFuelPriceInput(nextFuelPriceStr);
    setLitersInput(nextLitersStr);
    setInverterRateInput(nextInverterStr);

    const fp = parseFloat(nextFuelPriceStr);
    const lph = parseFloat(nextLitersStr);
    const inv = Math.max(0, parseFloat(nextInverterStr) || 0);

    if (!Number.isFinite(fp) || fp < 0) {
      setFuelError(STRINGS.validation.fuelPriceNonNegative);
      return;
    }
    if (!Number.isFinite(lph) || lph <= 0) {
      setFuelError(STRINGS.validation.litersPerHourPositive);
      return;
    }
    setFuelError(null);
    onUpdateSettings({
      ...settings,
      generatorFuelPricePerLiter: fp,
      generatorLitersPerHour: lph,
      inverterCostPerKwh: inv,
    });
  };

  const handleApplyCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    const realAmt = parseFloat(calAmountInput);
    const realKwh = calKwhInput.trim() ? parseFloat(calKwhInput) : null;

    if (!Number.isFinite(realAmt) || realAmt <= 0) {
      setCalError(STRINGS.validation.realBillPositive);
      return;
    }
    if (realKwh !== null && (!Number.isFinite(realKwh) || realKwh <= 0)) {
      setCalError('Actual kWh must be greater than 0 if entered.');
      return;
    }
    setCalError(null);
    onUpdateSettings({
      ...settings,
      calibration: {
        enabled: true,
        realBillAmount: realAmt,
        realBillKwh: realKwh,
      },
    });
    showSavedFeedback('Bill calibration activated.');
  };

  const handleDisableCalibration = () => {
    setCalError(null);
    onUpdateSettings({
      ...settings,
      calibration: {
        ...settings.calibration,
        enabled: false,
      },
    });
    showSavedFeedback('Bill calibration turned off.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <h1 className="text-2xl font-extrabold text-[#1F2937]">
          {STRINGS.settings.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          {STRINGS.settings.subtitle}
        </p>
      </div>

      {savedBanner && (
        <div
          role="status"
          className="rounded-2xl bg-white border border-[#16A34A] px-4 py-3 text-sm font-extrabold text-[#15803D]"
        >
          {savedBanner}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Country, Currency & Tariff Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 space-y-5">
          <h2 className="text-lg font-extrabold text-[#1F2937]">
            {STRINGS.settings.countryCurrencyTitle} &amp;{' '}
            {STRINGS.settings.tariffTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="settings-country"
                className="block text-xs font-bold text-[#1F2937] mb-1.5"
              >
                Country / Preset
              </label>
              <select
                id="settings-country"
                value={settings.countryCode}
                onChange={(e) => handleCountrySelect(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-sm text-[#1F2937]"
              >
                {TARIFF_PRESETS.map((p) => (
                  <option key={p.countryCode} value={p.countryCode}>
                    {p.countryName} ({p.currencyCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="settings-currency"
                className="block text-xs font-bold text-[#1F2937] mb-1.5"
              >
                Currency
              </label>
              <select
                id="settings-currency"
                value={settings.currencyCode}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-sm text-[#1F2937]"
              >
                {CUSTOM_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Meter Type */}
          <div>
            <span className="block text-xs font-bold text-[#1F2937] mb-1.5">
              Meter Type
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(['prepaid', 'postpaid'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMeterTypeSelect(m)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-extrabold capitalize transition-colors ${
                    settings.meterType === m
                      ? 'bg-[#F59E0B] text-[#1F2937] border-[#1F2937]'
                      : 'bg-[#FFFBF2] text-[#1F2937] border-[#F0E7D3]'
                  }`}
                >
                  {m} meter
                </button>
              ))}
            </div>
          </div>

          {/* Rate Override */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="settings-rate"
                className="text-xs font-bold text-[#1F2937]"
              >
                Electricity Rate per kWh ({settings.currencyCode})
              </label>
              <span className="text-xs font-bold text-[#6B7280]">
                {STRINGS.brand.estimateBadge}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="settings-rate"
                type="number"
                step="any"
                min="0.001"
                value={rateInput}
                onChange={(e) => handleRateChange(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-base text-[#1F2937]"
              />
              {preset.defaultRatePerKwh !== null &&
                settings.ratePerKwh !== preset.defaultRatePerKwh && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRateChange(String(preset.defaultRatePerKwh))
                    }
                    className="shrink-0 min-h-[46px] px-3 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#1F2937]"
                  >
                    Reset ({preset.defaultRatePerKwh})
                  </button>
                )}
            </div>
            {rateError && (
              <p role="alert" className="text-xs font-bold text-[#DC2626] mt-1.5">
                {rateError}
              </p>
            )}
            <p className="text-xs text-[#6B7280] mt-1.5">{preset.rateNote}</p>
          </div>
        </div>

        {/* Grid Supply Hours & Backup Power Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 space-y-5">
          <h2 className="text-lg font-extrabold text-[#1F2937]">
            {STRINGS.settings.powerSupplyTitle}
          </h2>

          <div>
            <span className="block text-xs font-bold text-[#1F2937] mb-1.5">
              Active Power Sources
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'grid', label: 'Grid' },
                  { id: 'generator', label: 'Generator' },
                  { id: 'inverter', label: 'Inverter' },
                  { id: 'solar', label: 'Solar' },
                ] as const
              ).map((src) => {
                const active = settings.powerSources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => handleTogglePowerSource(src.id)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center justify-between transition-colors ${
                      active
                        ? 'bg-[#FFFBF2] border-[#1F2937] text-[#1F2937]'
                        : 'bg-white border-[#F0E7D3] text-[#6B7280]'
                    }`}
                  >
                    <span>{src.label}</span>
                    {active && <CheckIcon size={14} className="text-[#15803D]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="settings-grid-hours"
                className="text-xs font-bold text-[#1F2937]"
              >
                Average Grid Supply Hours per Day (0 - 24)
              </label>
              <span className="text-xs font-extrabold text-[#1F2937]">
                {settings.gridSupplyHours} hrs/day
              </span>
            </div>
            <input
              id="settings-grid-hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={gridHoursInput}
              onChange={(e) => handleGridHoursChange(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-base text-[#1F2937]"
            />
            {gridError && (
              <p role="alert" className="text-xs font-bold text-[#DC2626] mt-1.5">
                {gridError}
              </p>
            )}
            <p className="text-xs text-[#6B7280] mt-1">
              Appliances on the grid cap at these hours. Extra hours spill over
              to your backup source if one is enabled above.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F0E7D3]">
            <div>
              <label
                htmlFor="settings-fuel-price"
                className="block text-xs font-bold text-[#1F2937] mb-1"
              >
                Fuel Price / Liter ({settings.currencyCode})
              </label>
              <input
                id="settings-fuel-price"
                type="number"
                min="0"
                step="any"
                value={fuelPriceInput}
                onChange={(e) =>
                  handleFuelSettingsChange(
                    e.target.value,
                    litersInput,
                    inverterRateInput
                  )
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
              />
            </div>

            <div>
              <label
                htmlFor="settings-liters-hr"
                className="block text-xs font-bold text-[#1F2937] mb-1"
              >
                Gen Burn (Liters/hr)
              </label>
              <input
                id="settings-liters-hr"
                type="number"
                min="0.1"
                step="any"
                value={litersInput}
                onChange={(e) =>
                  handleFuelSettingsChange(
                    fuelPriceInput,
                    e.target.value,
                    inverterRateInput
                  )
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
              />
            </div>

            <div>
              <label
                htmlFor="settings-inverter-rate"
                className="block text-xs font-bold text-[#1F2937] mb-1"
              >
                Solar/Inv Rate (/kWh)
              </label>
              <input
                id="settings-inverter-rate"
                type="number"
                min="0"
                step="any"
                value={inverterRateInput}
                onChange={(e) =>
                  handleFuelSettingsChange(
                    fuelPriceInput,
                    litersInput,
                    e.target.value
                  )
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
              />
            </div>
          </div>
          {fuelError && (
            <p role="alert" className="text-xs font-bold text-[#DC2626]">
              {fuelError}
            </p>
          )}
        </div>
      </div>

      {/* Bill Calibration Section */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F2937]">
              {STRINGS.settings.calibrationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              {STRINGS.settings.calibrationDescription}
            </p>
          </div>

          {summary.calibrationActive ? (
            <span className="px-3 py-1 rounded-full bg-[#FFFBF2] border border-[#16A34A] text-xs font-extrabold text-[#15803D]">
              Active · Scale factor {summary.calibrationScaleFactor.toFixed(2)}x
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#6B7280]">
              Not calibrated (using raw wattage estimates)
            </span>
          )}
        </div>

        <form
          noValidate
          onSubmit={handleApplyCalibration}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-4">
            <label
              htmlFor="cal-bill-amount"
              className="block text-xs font-bold text-[#1F2937] mb-1.5"
            >
              Last real monthly bill ({settings.currencyCode})
            </label>
            <input
              id="cal-bill-amount"
              type="number"
              min="1"
              step="any"
              placeholder={`e.g. ${Math.round(summary.rawTotalMonthlyCost || 48000)}`}
              value={calAmountInput}
              onChange={(e) => {
                setCalAmountInput(e.target.value);
                setCalError(null);
              }}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
            />
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="cal-bill-kwh"
              className="block text-xs font-bold text-[#1F2937] mb-1.5"
            >
              Last monthly kWh (optional, if known)
            </label>
            <input
              id="cal-bill-kwh"
              type="number"
              min="1"
              step="any"
              placeholder={`e.g. ${Math.round(summary.rawTotalMonthlyKwh || 240)}`}
              value={calKwhInput}
              onChange={(e) => {
                setCalKwhInput(e.target.value);
                setCalError(null);
              }}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
            />
          </div>

          <div className="md:col-span-4 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm"
            >
              {summary.calibrationActive
                ? 'Update calibration'
                : 'Calibrate to bill'}
            </button>
            {settings.calibration.enabled && (
              <button
                type="button"
                onClick={handleDisableCalibration}
                className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#1F2937]"
              >
                Turn off
              </button>
            )}
          </div>
        </form>

        {calError && (
          <p role="alert" className="text-xs font-bold text-[#DC2626] mt-2">
            {calError}
          </p>
        )}

        {summary.rawTotalMonthlyCost > 0 && (
          <div className="mt-4 pt-3 border-t border-[#F0E7D3] flex flex-wrap gap-6 text-xs text-[#6B7280]">
            <span>
              Raw uncalibrated estimate:{' '}
              <strong className="text-[#1F2937]">
                {formatMoney(summary.rawTotalMonthlyCost, settings.currencyCode)}
              </strong>{' '}
              ({Math.round(summary.rawTotalMonthlyKwh)} kWh)
            </span>
            {summary.calibrationActive && (
              <span>
                Calibrated bill total:{' '}
                <strong className="text-[#15803D]">
                  {formatMoney(summary.totalMonthlyCost, settings.currencyCode)}
                </strong>{' '}
                (Scale factor: {summary.calibrationScaleFactor.toFixed(2)}x)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Data Management & About Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Data & Reset */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F2937]">
              {STRINGS.settings.dataSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Load our sample household (₦48,000 Lagos apartment preset) to
              explore all features, or clear all data saved in this browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onLoadSampleHousehold();
                showSavedFeedback('Sample household loaded.');
              }}
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
            >
              {STRINGS.dashboard.loadSampleBtn}
            </button>

            {onOpenSetupWizard && (
              <button
                type="button"
                onClick={onOpenSetupWizard}
                className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
              >
                Re-run setup wizard
              </button>
            )}

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#EF4444]/10 border border-[#EF4444] text-[#DC2626] font-extrabold text-sm inline-flex items-center gap-2"
            >
              <TrashIcon size={16} />
              <span>{STRINGS.settings.resetBtn}</span>
            </button>
          </div>

          {confirmResetOpen && (
            <div
              role="alertdialog"
              aria-labelledby="reset-confirm-title"
              className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#EF4444] space-y-3"
            >
              <h3
                id="reset-confirm-title"
                className="text-sm font-extrabold text-[#DC2626]"
              >
                {STRINGS.settings.resetConfirmTitle}
              </h3>
              <p className="text-xs text-[#1F2937]">
                {STRINGS.settings.resetConfirmText}
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmResetOpen(false);
                    onResetAllData();
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#EF4444] text-white font-extrabold text-xs"
                >
                  Yes, erase everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#F0E7D3] text-[#1F2937] font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About BillBreaker */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <BrandLogo size="sm" />
            <h2 className="text-lg font-extrabold text-[#1F2937]">
              {STRINGS.settings.aboutTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              {STRINGS.settings.aboutDescription}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs text-[#6B7280]">
            <strong className="text-[#1F2937]">Honest estimates:</strong>{' '}
            {STRINGS.brand.footerDisclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { calculateTokenDuration } from '@/lib/costEngine';
import { formatMoney, getQuickTokenAmounts } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import { HouseholdCostSummary, UserSettings } from '@/types/billbreaker';

interface TokensViewProps {
  settings: UserSettings;
  summary: HouseholdCostSummary;
  onUpdateTokenAmount: (amount: number) => void;
  onApplyAllTips: () => void;
}

export function TokensView({
  settings,
  summary,
  onUpdateTokenAmount,
  onApplyAllTips,
}: TokensViewProps) {
  const { currencyCode } = settings;
  const [tokenInput, setTokenInput] = useState<string>(
    String(settings.lastTokenAmount || 20000)
  );
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = Math.max(0, parseFloat(tokenInput) || 0);
  const quickChips = getQuickTokenAmounts(
    currencyCode,
    summary.totalMonthlyCost
  );

  const tokenResult = calculateTokenDuration(parsedAmount, summary);

  const handleAmountChange = (val: string) => {
    setTokenInput(val);
    const num = parseFloat(val);
    if (!Number.isFinite(num) || num <= 0) {
      setError('Enter a token or top-up amount greater than 0.');
    } else {
      setError(null);
      onUpdateTokenAmount(num);
    }
  };

  const handleSelectChip = (chipVal: number) => {
    setTokenInput(String(chipVal));
    setError(null);
    onUpdateTokenAmount(chipVal);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    try {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return date.toDateString();
    }
  };

  const roundedCurrentDays = Math.max(0, Math.floor(tokenResult.daysCurrent));
  const roundedSavingsDays = Math.max(
    roundedCurrentDays,
    Math.round(tokenResult.daysWithAllSavings)
  );
  const extraDays = Math.max(0, roundedSavingsDays - roundedCurrentDays);

  const maxBarDays = Math.max(roundedSavingsDays, roundedCurrentDays, 1);
  const currentBarPct = Math.min(
    100,
    Math.max(8, (roundedCurrentDays / maxBarDays) * 100)
  );
  const savingsBarPct = Math.min(
    100,
    Math.max(currentBarPct, (roundedSavingsDays / maxBarDays) * 100)
  );

  const estKwhPurchased =
    settings.ratePerKwh > 0 ? parsedAmount / settings.ratePerKwh : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <h1 className="text-2xl font-extrabold text-[#1F2937]">
          {STRINGS.tokens.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          {STRINGS.tokens.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input + Quick Chips */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 space-y-5">
          <div>
            <label
              htmlFor="token-amount-input"
              className="block text-sm font-bold text-[#1F2937] mb-2"
            >
              {STRINGS.tokens.amountLabel} ({currencyCode})
            </label>
            <input
              id="token-amount-input"
              type="number"
              min="1"
              step="any"
              value={tokenInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-extrabold text-2xl focus:outline-none focus:border-[#1F2937]"
            />
            {error && (
              <p
                role="alert"
                className="text-xs font-bold text-[#DC2626] mt-2"
              >
                {error}
              </p>
            )}
          </div>

          {/* Quick Chips */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              Quick top-up amounts
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickChips.map((chip) => {
                const isSelected = Math.round(parsedAmount) === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSelectChip(chip)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-extrabold transition-colors ${
                      isSelected
                        ? 'bg-[#F59E0B] text-[#1F2937] border-[#1F2937]'
                        : 'bg-[#FFFBF2] text-[#1F2937] border-[#F0E7D3] hover:border-[#1F2937]/40'
                    }`}
                  >
                    {formatMoney(chip, currencyCode)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Token Units Breakdown */}
          <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-[#6B7280] block text-xs">
                Estimated units bought
              </span>
              <span className="font-extrabold text-base text-[#1F2937]">
                {estKwhPurchased.toFixed(1)} kWh
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-xs">
                Current daily burn
              </span>
              <span className="font-extrabold text-base text-[#1F2937]">
                {formatMoney(tokenResult.dailyCostCurrent, currencyCode)} / day
              </span>
            </div>
          </div>
        </div>

        {/* Right: Days & Top-Up Date Result */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between">
          {summary.totalMonthlyCost <= 0 ? (
            <div className="my-auto text-center py-8">
              <h2 className="text-lg font-extrabold text-[#1F2937]">
                Add appliances to calculate token duration
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Once your household daily consumption is set, we will show how
                many days your prepaid credit lasts.
              </p>
            </div>
          ) : (
            <>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                  {STRINGS.tokens.daysLastsTitle}
                </span>

                <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#1F2937]">
                    {roundedCurrentDays}{' '}
                    {roundedCurrentDays === 1 ? 'day' : 'days'}
                  </span>
                  {extraDays > 0 && (
                    <span className="px-3 py-1 rounded-xl bg-[#FFFBF2] border border-[#16A34A] text-xs sm:text-sm font-extrabold text-[#15803D]">
                      Up to {roundedSavingsDays} days (+{extraDays} days) with
                      savings
                    </span>
                  )}
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] block">
                      {STRINGS.tokens.topUpAroundLabel}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-[#1F2937]">
                      {formatDate(tokenResult.topUpDateCurrent)}
                    </span>
                  </div>

                  {extraDays > 0 && tokenResult.topUpDateWithAllSavings && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#15803D] block">
                        With all savings
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#15803D]">
                        {formatDate(tokenResult.topUpDateWithAllSavings)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Bar: Now vs With All Savings Applied */}
              <div className="mt-6 pt-5 border-t border-[#F0E7D3] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1F2937]">
                    {STRINGS.tokens.comparisonTitle}
                  </h3>
                  {extraDays > 0 && (
                    <button
                      type="button"
                      onClick={onApplyAllTips}
                      className="text-xs font-extrabold text-[#15803D] underline"
                    >
                      Apply all savings tips
                    </button>
                  )}
                </div>

                {/* Current Usage Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#1F2937]">
                      {STRINGS.tokens.currentUsageLabel} (
                      {formatMoney(tokenResult.dailyCostCurrent, currencyCode)}
                      /day)
                    </span>
                    <span className="font-extrabold text-[#1F2937]">
                      {roundedCurrentDays} days
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#FFFBF2] border border-[#F0E7D3] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1F2937] transition-all duration-200"
                      style={{ width: `${currentBarPct}%` }}
                    />
                  </div>
                </div>

                {/* With All Savings Applied Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#15803D]">
                      {STRINGS.tokens.withSavingsLabel} (
                      {formatMoney(
                        tokenResult.dailyCostWithAllSavings,
                        currencyCode
                      )}
                      /day)
                    </span>
                    <span className="font-extrabold text-[#15803D]">
                      {roundedSavingsDays} days{' '}
                      {extraDays > 0 ? `(+${extraDays} days)` : ''}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#FFFBF2] border border-[#F0E7D3] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A] transition-all duration-200"
                      style={{ width: `${savingsBarPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

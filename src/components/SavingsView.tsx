'use client';

import React from 'react';
import { CheckIcon, PlusIcon } from '@/components/Icons';
import { formatMoney } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import { HouseholdCostSummary, UserSettings } from '@/types/billbreaker';

interface SavingsViewProps {
  settings: UserSettings;
  summary: HouseholdCostSummary;
  onToggleTip: (tipId: string) => void;
  onApplyAllTips: () => void;
  onClearAllTips: () => void;
  onNavigateAppliances: () => void;
}

export function SavingsView({
  settings,
  summary,
  onToggleTip,
  onApplyAllTips,
  onClearAllTips,
  onNavigateAppliances,
}: SavingsViewProps) {
  const { currencyCode } = settings;
  const allApplied =
    summary.tips.length > 0 && summary.tips.every((t) => t.applied);
  const anyApplied = summary.tips.some((t) => t.applied);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <h1 className="text-2xl font-extrabold text-[#1F2937]">
          {STRINGS.savings.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          {STRINGS.savings.subtitle}
        </p>
      </div>

      {summary.tips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F0E7D3] p-8 sm:p-12 text-center">
          <h2 className="text-xl font-extrabold text-[#1F2937]">
            {STRINGS.savings.noTipsTitle}
          </h2>
          <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto">
            {STRINGS.savings.noTipsDescription}
          </p>
          <button
            type="button"
            onClick={onNavigateAppliances}
            className="mt-6 min-h-[48px] px-6 py-3 rounded-2xl bg-[#F59E0B] text-[#1F2937] font-extrabold text-sm inline-flex items-center gap-2"
          >
            <PlusIcon size={18} />
            <span>Add appliances</span>
          </button>
        </div>
      ) : (
        <>
          {/* Summary Card: "Apply everything and save [Currency]X / month" + Running Total */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Total Potential Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                    Maximum Savings Potential
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#16A34A] text-xs font-extrabold text-[#15803D]">
                    -{Math.round(summary.potentialPercentSaved)}% of bill
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                  {STRINGS.savings.summaryTitle}{' '}
                  <span className="text-[#15803D]">
                    {formatMoney(summary.potentialMonthlySavings, currencyCode)}
                  </span>{' '}
                  / month
                </h2>

                <p className="text-xs sm:text-sm font-bold text-[#6B7280] mt-2">
                  Saves{' '}
                  <strong className="text-[#1F2937]">
                    {formatMoney(summary.potentialYearlySavings, currencyCode)}
                  </strong>{' '}
                  per year ({Math.round(summary.potentialPercentSaved)}% off your{' '}
                  {formatMoney(summary.totalMonthlyCost, currencyCode)} bill)
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0E7D3] flex flex-wrap items-center gap-3">
                {!allApplied ? (
                  <button
                    type="button"
                    onClick={onApplyAllTips}
                    className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm"
                  >
                    {STRINGS.savings.applyAllBtn} ({summary.tips.length})
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-extrabold">
                    <CheckIcon size={15} />
                    All savings applied
                  </span>
                )}

                {anyApplied && (
                  <button
                    type="button"
                    onClick={onClearAllTips}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-xs sm:text-sm"
                  >
                    {STRINGS.savings.clearAllBtn}
                  </button>
                )}
              </div>
            </div>

            {/* Running Applied Total Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                  {STRINGS.savings.currentlyAppliedLabel}
                </span>

                <div className="text-3xl sm:text-4xl font-extrabold text-[#15803D] mt-2">
                  {formatMoney(summary.appliedMonthlySavings, currencyCode)}
                  <span className="text-sm font-bold text-[#6B7280] ml-1.5">
                    / month
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Yearly savings:</span>
                    <span className="font-extrabold text-[#1F2937]">
                      {formatMoney(summary.appliedYearlySavings, currencyCode)}/yr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Bill reduction:</span>
                    <span className="font-extrabold text-[#15803D]">
                      {Math.round(summary.appliedPercentSaved)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F0E7D3] flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B7280]">
                  New monthly bill:
                </span>
                <span className="text-xl font-extrabold text-[#1F2937]">
                  {formatMoney(summary.netMonthlyCostAfterSavings, currencyCode)}
                </span>
              </div>
            </div>
          </div>

          {/* Sorted Tip Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.tips.map((tip, index) => (
              <div
                key={tip.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-colors ${
                  tip.applied
                    ? 'bg-white border-[#16A34A] ring-1 ring-[#16A34A]'
                    : 'bg-white border-[#F0E7D3]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-extrabold text-[#1F2937]">
                      #{index + 1} · {tip.badge}
                    </span>
                    <span className="text-xs font-extrabold text-[#15803D]">
                      Saves {Math.round(tip.percentOfBill)}% of bill
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#1F2937]">
                    {tip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                    {tip.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0E7D3] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-extrabold text-[#15803D]">
                      {formatMoney(tip.monthlySavings, currencyCode)}
                      <span className="text-xs font-bold text-[#6B7280] ml-1">
                        /mo
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#6B7280]">
                      {formatMoney(tip.yearlySavings, currencyCode)}/year ·{' '}
                      {Math.round(tip.monthlyKwhSaved)} kWh/mo
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleTip(tip.id)}
                    aria-pressed={tip.applied}
                    className={`min-h-[46px] px-5 py-2.5 rounded-xl font-extrabold text-sm transition-colors inline-flex items-center gap-2 ${
                      tip.applied
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937]'
                    }`}
                  >
                    {tip.applied && <CheckIcon size={16} />}
                    <span>
                      {tip.applied
                        ? STRINGS.savings.appliedBtn
                        : STRINGS.savings.applyBtn}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

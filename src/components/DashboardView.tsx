'use client';

import React from 'react';
import { BillBreakerBar, getSliceColor } from '@/components/BillBreakerBar';
import {
  ApplianceIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
} from '@/components/Icons';
import { formatMoney } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import { HouseholdCostSummary, UserSettings } from '@/types/billbreaker';

interface DashboardViewProps {
  settings: UserSettings;
  summary: HouseholdCostSummary;
  onToggleTip: (tipId: string) => void;
  onNavigateTab: (
    tab: 'home' | 'appliances' | 'savings' | 'tokens' | 'settings'
  ) => void;
  onLoadSampleHousehold: () => void;
}

export function DashboardView({
  settings,
  summary,
  onToggleTip,
  onNavigateTab,
  onLoadSampleHousehold,
}: DashboardViewProps) {
  const { currencyCode } = settings;

  if (summary.items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-center mx-auto mb-4">
          <ApplianceIcon iconKey="ac" size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1F2937]">
          {STRINGS.dashboard.emptyTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#6B7280] mt-2 max-w-md mx-auto">
          {STRINGS.dashboard.emptyDescription}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('appliances')}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm inline-flex items-center justify-center gap-2"
          >
            <PlusIcon size={18} />
            <span>{STRINGS.dashboard.addFirstApplianceBtn}</span>
          </button>
          <button
            type="button"
            onClick={onLoadSampleHousehold}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
          >
            {STRINGS.dashboard.loadSampleBtn}
          </button>
        </div>
      </div>
    );
  }

  const top3Culprits = summary.items.slice(0, 3);
  const quickWinTip =
    summary.tips.find((t) => !t.applied) || summary.tips[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Hero Estimate + Quick Win Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Big Monthly Estimate Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                {STRINGS.dashboard.monthlyEstimateLabel}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {summary.calibrationActive && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('settings')}
                    className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#16A34A] text-xs font-extrabold text-[#15803D]"
                  >
                    {STRINGS.dashboard.calibratedBadge} (
                    {summary.calibrationScaleFactor.toFixed(2)}x)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigateTab('settings')}
                  className="px-3 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-extrabold text-[#1F2937] hover:border-[#1F2937]/40 transition-colors"
                  title="Edit currency or tariff rate"
                >
                  {settings.countryName} · {currencyCode} (
                  {formatMoney(settings.ratePerKwh, currencyCode, {
                    forRate: true,
                  })}
                  /kWh)
                </button>
              </div>
            </div>

            {summary.appliedMonthlySavings > 0 ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] tracking-tight">
                    {formatMoney(summary.netMonthlyCostAfterSavings, currencyCode)}
                  </span>
                  <span className="text-lg font-bold text-[#6B7280] line-through">
                    {formatMoney(summary.totalMonthlyCost, currencyCode)}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#15803D]">
                  <CheckIcon size={15} />
                  <span>
                    Saving {formatMoney(summary.appliedMonthlySavings, currencyCode)}
                    /month ({Math.round(summary.appliedPercentSaved)}%) with
                    applied what-ifs
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] tracking-tight">
                  {formatMoney(summary.totalMonthlyCost, currencyCode)}
                  <span className="text-base font-medium text-[#6B7280] ml-2">
                    / month
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0E7D3] grid grid-cols-3 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-[#6B7280] block text-xs">Daily spend</span>
              <span className="font-extrabold text-[#1F2937]">
                {formatMoney(summary.netDailyCostAfterSavings, currencyCode)}/day
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-xs">Monthly use</span>
              <span className="font-extrabold text-[#1F2937]">
                {Math.round(summary.totalMonthlyKwh)} kWh
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-xs">Appliances</span>
              <span className="font-extrabold text-[#1F2937]">
                {summary.items.length} tracked
              </span>
            </div>
          </div>

          {/* Multi-source breakdown pills if generator or inverter/solar are active */}
          {(summary.generatorMonthlyCost > 0 ||
            summary.inverterMonthlyCost > 0) && (
            <div className="mt-4 pt-3 border-t border-[#F0E7D3] flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-[#1F2937]">
                Grid: {formatMoney(summary.gridMonthlyCost, currencyCode)}
              </span>
              {summary.generatorMonthlyCost > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-[#DC2626]">
                  Generator:{' '}
                  {formatMoney(summary.generatorMonthlyCost, currencyCode)}
                </span>
              )}
              {summary.inverterMonthlyCost > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-[#15803D]">
                  Inverter/Solar:{' '}
                  {formatMoney(summary.inverterMonthlyCost, currencyCode)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Win Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col justify-between">
          {quickWinTip ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-extrabold text-[#15803D]">
                    {STRINGS.dashboard.quickWinTitle} · {quickWinTip.badge}
                  </span>
                  <span className="text-xs font-bold text-[#6B7280]">
                    -{Math.round(quickWinTip.percentOfBill)}% of bill
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-[#1F2937]">
                  {quickWinTip.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 leading-relaxed">
                  {quickWinTip.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F0E7D3] flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#6B7280] block">
                    Monthly saving
                  </span>
                  <span className="text-2xl font-extrabold text-[#15803D]">
                    {formatMoney(quickWinTip.monthlySavings, currencyCode)}
                    <span className="text-xs font-bold text-[#6B7280] ml-1">
                      /mo
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleTip(quickWinTip.id)}
                  className={`min-h-[46px] px-5 py-2.5 rounded-xl font-extrabold text-sm transition-colors inline-flex items-center gap-2 ${
                    quickWinTip.applied
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937]'
                  }`}
                >
                  {quickWinTip.applied && <CheckIcon size={16} />}
                  <span>
                    {quickWinTip.applied
                      ? STRINGS.dashboard.quickWinAppliedBadge
                      : STRINGS.dashboard.quickWinApplyBtn}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="my-auto text-center py-4">
              <h2 className="text-lg font-extrabold text-[#1F2937]">
                {STRINGS.dashboard.quickWinTitle}
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Add appliances with at least 1–2 hours of daily runtime to unlock
                custom savings tips.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gentle Notice if Grid Supply Hours < Appliance Hours with No Backup */}
      {summary.unpoweredApplianceCount > 0 && (
        <div className="rounded-2xl bg-white border border-[#F0E7D3] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
              {STRINGS.dashboard.unpoweredWarningTitle} ({settings.gridSupplyHours}{' '}
              hrs/day grid power)
            </span>
            <p className="text-xs sm:text-sm text-[#1F2937] mt-0.5">
              {summary.unpoweredApplianceCount}{' '}
              {summary.unpoweredApplianceCount === 1
                ? 'appliance wants'
                : 'appliances want'}{' '}
              to run longer than your {settings.gridSupplyHours} daily grid hours.
              Because no backup power source is enabled, those extra{' '}
              {summary.totalUnpoweredHoursPerDay} hrs/day are not powered.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('settings')}
            className="shrink-0 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-bold text-[#1F2937] hover:border-[#1F2937]"
          >
            Configure backup
          </button>
        </div>
      )}

      {/* Top 3 Culprits Section */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937]">
              {STRINGS.dashboard.topCulpritsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              {STRINGS.dashboard.topCulpritsSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('appliances')}
            className="self-start sm:self-auto min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-extrabold text-[#1F2937] inline-flex items-center gap-1.5 hover:border-[#1F2937]"
          >
            <span>Manage appliances</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3Culprits.map((item, idx) => {
            const sliceColor = getSliceColor(idx);
            const poweredHours =
              item.gridHoursPerDay + item.backupHoursPerDay;
            return (
              <div
                key={item.appliance.id}
                className="rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-extrabold text-white"
                      style={{ backgroundColor: sliceColor.bg }}
                    >
                      #{idx + 1} Culprit
                    </span>
                    <span
                      className="text-xs font-extrabold"
                      style={{ color: sliceColor.text }}
                    >
                      {Math.round(item.sharePercent)}% of bill
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#F0E7D3] flex items-center justify-center shrink-0">
                      <ApplianceIcon
                        iconKey={item.appliance.iconKey}
                        size={20}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base text-[#1F2937] truncate">
                        {item.appliance.name}
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {item.appliance.quantity}x · {item.appliance.watts}W ·{' '}
                        {poweredHours}h/day
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F0E7D3] flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#1F2937]">
                    {formatMoney(item.calibratedMonthlyCost, currencyCode)}
                  </span>
                  <span className="text-xs font-bold text-[#6B7280]">
                    {Math.round(item.calibratedMonthlyKwh)} kWh/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Bill Breaker Bar + Full Ranked List */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-[#1F2937]">
            {STRINGS.dashboard.billBreakerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {STRINGS.dashboard.billBreakerSubtitle}
          </p>
        </div>

        <BillBreakerBar
          items={summary.items}
          currencyCode={currencyCode}
          showDetailedList={true}
        />
      </div>
    </div>
  );
}

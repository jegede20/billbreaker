import React from 'react';
import { ApplianceIcon } from '@/components/Icons';
import { formatMoney } from '@/lib/currency';
import { ApplianceCostBreakdown } from '@/types/billbreaker';

const SLICE_COLORS = [
  { bg: '#EF4444', text: '#DC2626', label: 'Top drain' },
  { bg: '#F59E0B', text: '#B45309', label: '#2 drain' },
  { bg: '#1F2937', text: '#1F2937', label: '#3 drain' },
  { bg: '#FBBF24', text: '#92400E', label: '#4' },
  { bg: '#16A34A', text: '#15803D', label: '#5' },
  { bg: '#6B7280', text: '#4B5563', label: 'Other' },
];

export function getSliceColor(index: number) {
  return SLICE_COLORS[Math.min(index, SLICE_COLORS.length - 1)];
}

interface BillBreakerBarProps {
  items: ApplianceCostBreakdown[];
  currencyCode: string;
  showDetailedList?: boolean;
}

export function BillBreakerBar({
  items,
  currencyCode,
  showDetailedList = true,
}: BillBreakerBarProps) {
  if (items.length === 0) {
    return null;
  }

  // Group top 5 + "Other appliances" if more than 6 items
  const displaySlices =
    items.length <= 6
      ? items.map((item, idx) => ({
          id: item.appliance.id,
          name: item.appliance.name,
          cost: item.calibratedMonthlyCost,
          kwh: item.calibratedMonthlyKwh,
          sharePercent: item.sharePercent,
          iconKey: item.appliance.iconKey,
          hoursPerDay: item.gridHoursPerDay + item.backupHoursPerDay,
          powerSource: item.appliance.powerSource,
          color: getSliceColor(idx).bg,
        }))
      : [
          ...items.slice(0, 5).map((item, idx) => ({
            id: item.appliance.id,
            name: item.appliance.name,
            cost: item.calibratedMonthlyCost,
            kwh: item.calibratedMonthlyKwh,
            sharePercent: item.sharePercent,
            iconKey: item.appliance.iconKey,
            hoursPerDay: item.gridHoursPerDay + item.backupHoursPerDay,
            powerSource: item.appliance.powerSource,
            color: getSliceColor(idx).bg,
          })),
          {
            id: 'others-combined',
            name: `Other appliances (${items.length - 5})`,
            cost: items
              .slice(5)
              .reduce((sum, i) => sum + i.calibratedMonthlyCost, 0),
            kwh: items
              .slice(5)
              .reduce((sum, i) => sum + i.calibratedMonthlyKwh, 0),
            sharePercent: items
              .slice(5)
              .reduce((sum, i) => sum + i.sharePercent, 0),
            iconKey: 'custom',
            hoursPerDay: 0,
            powerSource: 'grid' as const,
            color: getSliceColor(5).bg,
          },
        ];

  return (
    <div className="space-y-5">
      {/* Stacked "Bill Breaker" Bar */}
      <div>
        <div
          className="h-9 w-full rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] p-1 flex items-stretch gap-1 overflow-hidden"
          role="img"
          aria-label="Stacked bar showing each appliance share of your monthly electricity bill"
        >
          {displaySlices.map((slice) => {
            const widthPct = Math.max(slice.sharePercent, 2);
            return (
              <div
                key={slice.id}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: slice.color,
                }}
                className="h-full first:rounded-l-lg last:rounded-r-lg transition-all duration-200 relative group"
                title={`${slice.name}: ${formatMoney(slice.cost, currencyCode)} (${Math.round(slice.sharePercent)}%)`}
              />
            );
          })}
        </div>

        {/* Compact Legend Pills */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {displaySlices.map((slice) => (
            <div
              key={slice.id}
              className="inline-flex items-center gap-1.5 text-xs text-[#1F2937]"
            >
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="font-medium truncate max-w-[150px]">
                {slice.name}
              </span>
              <span className="font-bold">
                {Math.round(slice.sharePercent)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Horizontal Bars */}
      {showDetailedList && (
        <div className="space-y-3 pt-2 border-t border-[#F0E7D3]">
          {items.map((item, idx) => {
            const color = getSliceColor(idx);
            const poweredHours =
              item.gridHoursPerDay + item.backupHoursPerDay;
            return (
              <div
                key={item.appliance.id}
                className="p-3 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3]"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-white border border-[#F0E7D3] flex items-center justify-center shrink-0">
                      <ApplianceIcon
                        iconKey={item.appliance.iconKey}
                        size={18}
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1F2937] truncate">
                          {item.appliance.name}
                        </span>
                        {item.appliance.quantity > 1 && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white border border-[#F0E7D3] text-[#1F2937]">
                            x{item.appliance.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {item.appliance.watts}W · {poweredHours}h/day ·{' '}
                        {Math.round(item.calibratedMonthlyKwh)} kWh/mo
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-sm sm:text-base text-[#1F2937]">
                      {formatMoney(item.calibratedMonthlyCost, currencyCode)}
                    </div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: color.text }}
                    >
                      {Math.round(item.sharePercent)}% of bill
                    </div>
                  </div>
                </div>

                {/* Individual Share Bar */}
                <div className="h-2 w-full rounded-full bg-white border border-[#F0E7D3] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(item.sharePercent, 2))}%`,
                      backgroundColor: color.bg,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

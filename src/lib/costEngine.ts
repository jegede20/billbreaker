import appliancesData from '@/data/appliances.json';
import tariffsData from '@/data/tariffs.json';
import tipsData from '@/data/tips.json';
import {
  ApplianceCostBreakdown,
  ApplianceTemplate,
  ComputedSavingsTip,
  HouseholdCostSummary,
  SavingsTipDefinition,
  TariffPreset,
  TokenEstimateResult,
  UserAppliance,
  UserSettings,
} from '@/types/billbreaker';

export const APPLIANCE_TEMPLATES: ApplianceTemplate[] =
  appliancesData as ApplianceTemplate[];

export const TARIFF_PRESETS: TariffPreset[] = tariffsData as TariffPreset[];

export const SAVINGS_TIP_DEFINITIONS: SavingsTipDefinition[] =
  tipsData as SavingsTipDefinition[];

export function clampNumber(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

export function getTariffPreset(countryCode: string): TariffPreset {
  return (
    TARIFF_PRESETS.find((t) => t.countryCode === countryCode) ||
    TARIFF_PRESETS[0]
  );
}

export function createSampleHouseholdAppliances(): UserAppliance[] {
  // Produces exact sample numbers at NGN 200/kWh:
  // AC: ₦19,200 (40%), Deep freezer: ₦9,600 (20%), Standing fans: ₦7,200 (15%),
  // TV and decoder: ₦4,800 (10%), Lighting: ₦3,360 (7%), Others: ₦3,840 (8%) -> Total ₦48,000
  return [
    {
      id: 'sample-ac',
      templateId: 'air-conditioner',
      name: 'Air Conditioner',
      category: 'cooling',
      watts: 1200,
      quantity: 1,
      hoursPerDay: 3,
      dutyCycle: 0.8888889,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'ac',
    },
    {
      id: 'sample-freezer',
      templateId: 'deep-freezer',
      name: 'Deep Freezer',
      category: 'refrigeration',
      watts: 200,
      quantity: 1,
      hoursPerDay: 16,
      dutyCycle: 0.5,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'freezer',
    },
    {
      id: 'sample-fans',
      templateId: 'standing-fan',
      name: 'Standing Fans',
      category: 'cooling',
      watts: 75,
      quantity: 2,
      hoursPerDay: 8,
      dutyCycle: 1.0,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'fan',
    },
    {
      id: 'sample-tv-decoder',
      templateId: 'tv',
      name: 'TV and Decoder',
      category: 'entertainment',
      watts: 160,
      quantity: 1,
      hoursPerDay: 5,
      dutyCycle: 1.0,
      powerSource: 'grid',
      hasStandby: true,
      standbyWatts: 8,
      iconKey: 'tv',
    },
    {
      id: 'sample-lighting',
      templateId: 'led-bulb',
      name: 'Lighting (Bulbs)',
      category: 'lighting',
      watts: 14,
      quantity: 8,
      hoursPerDay: 5,
      dutyCycle: 1.0,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'bulb',
    },
    {
      id: 'sample-others',
      templateId: 'phone-charger',
      name: 'Other Devices (Chargers, Router, Iron)',
      category: 'electronics',
      watts: 80,
      quantity: 1,
      hoursPerDay: 8,
      dutyCycle: 1.0,
      powerSource: 'grid',
      hasStandby: true,
      standbyWatts: 3,
      iconKey: 'phone',
    },
  ];
}

export function createDefaultSettings(): UserSettings {
  const ngPreset = getTariffPreset('NG');
  return {
    setupCompleted: false,
    countryCode: ngPreset.countryCode,
    countryName: ngPreset.countryName,
    currencyCode: ngPreset.currencyCode,
    ratePerKwh: ngPreset.defaultRatePerKwh ?? 200,
    meterType: 'prepaid',
    powerSources: ['grid'],
    gridSupplyHours: 24,
    generatorFuelPricePerLiter: ngPreset.defaultFuelPricePerLiter,
    generatorLitersPerHour: ngPreset.defaultGeneratorLitersPerHour,
    inverterCostPerKwh: 0,
    calibration: {
      enabled: false,
      realBillAmount: null,
      realBillKwh: null,
    },
    lastTokenAmount: 20000,
  };
}

export function resolveBackupSource(
  powerSources: UserSettings['powerSources']
): 'generator' | 'inverter' | 'solar' | null {
  if (powerSources.includes('generator')) return 'generator';
  if (powerSources.includes('inverter')) return 'inverter';
  if (powerSources.includes('solar')) return 'solar';
  return null;
}

export function calculateApplianceRawBreakdown(
  appliance: UserAppliance,
  settings: UserSettings
): Omit<
  ApplianceCostBreakdown,
  'calibratedMonthlyCost' | 'calibratedMonthlyKwh' | 'sharePercent'
> {
  const watts = Math.max(0, Number(appliance.watts) || 0);
  const quantity = Math.max(1, Math.round(Number(appliance.quantity) || 1));
  const hoursPerDay = clampNumber(Number(appliance.hoursPerDay) || 0, 0, 24);
  const dutyCycle = clampNumber(Number(appliance.dutyCycle) || 1, 0.05, 1);
  const gridSupplyHours = clampNumber(
    Number(settings.gridSupplyHours ?? 24),
    0,
    24
  );
  const ratePerKwh = Math.max(0, Number(settings.ratePerKwh) || 0);
  const fuelPrice = Math.max(
    0,
    Number(settings.generatorFuelPricePerLiter) || 0
  );
  const litersPerHour = Math.max(
    0,
    Number(settings.generatorLitersPerHour) || 0
  );
  const inverterRate = Math.max(0, Number(settings.inverterCostPerKwh) || 0);

  let gridHoursPerDay = 0;
  let backupHoursPerDay = 0;
  let unpoweredHoursPerDay = 0;
  let backupSourceUsed: 'generator' | 'inverter' | 'solar' | null = null;

  if (appliance.powerSource === 'grid') {
    gridHoursPerDay = Math.min(hoursPerDay, gridSupplyHours);
    const overflowHours = Math.max(0, hoursPerDay - gridHoursPerDay);
    if (overflowHours > 0) {
      const backup = resolveBackupSource(settings.powerSources);
      if (backup) {
        backupSourceUsed = backup;
        backupHoursPerDay = overflowHours;
      } else {
        unpoweredHoursPerDay = overflowHours;
      }
    }
  } else if (appliance.powerSource === 'generator') {
    backupSourceUsed = 'generator';
    backupHoursPerDay = hoursPerDay;
  } else {
    backupSourceUsed =
      settings.powerSources.includes('solar') &&
      !settings.powerSources.includes('inverter')
        ? 'solar'
        : 'inverter';
    backupHoursPerDay = hoursPerDay;
  }

  const poweredHoursPerDay = gridHoursPerDay + backupHoursPerDay;
  const dailyKwh = ((watts * quantity * poweredHoursPerDay) / 1000) * dutyCycle;
  const monthlyKwh = dailyKwh * 30;

  const gridDailyKwh =
    ((watts * quantity * gridHoursPerDay) / 1000) * dutyCycle;
  const rawGridMonthlyCost = gridDailyKwh * 30 * ratePerKwh;

  let rawBackupMonthlyCost = 0;
  if (backupHoursPerDay > 0) {
    if (backupSourceUsed === 'generator') {
      rawBackupMonthlyCost =
        backupHoursPerDay * 30 * litersPerHour * fuelPrice;
    } else if (
      backupSourceUsed === 'inverter' ||
      backupSourceUsed === 'solar'
    ) {
      const backupDailyKwh =
        ((watts * quantity * backupHoursPerDay) / 1000) * dutyCycle;
      rawBackupMonthlyCost = backupDailyKwh * 30 * inverterRate;
    }
  }

  const rawMonthlyCost = rawGridMonthlyCost + rawBackupMonthlyCost;

  return {
    appliance,
    dailyKwh,
    monthlyKwh,
    gridHoursPerDay,
    backupHoursPerDay,
    unpoweredHoursPerDay,
    backupSourceUsed,
    rawGridMonthlyCost,
    rawBackupMonthlyCost,
    rawMonthlyCost,
  };
}

function isAcAppliance(a: UserAppliance): boolean {
  return (
    a.templateId === 'air-conditioner' ||
    a.iconKey === 'ac' ||
    /\b(air conditioner|ac)\b/i.test(a.name)
  );
}

function isLightingAppliance(a: UserAppliance): boolean {
  return (
    a.category === 'lighting' ||
    a.templateId === 'led-bulb' ||
    a.templateId === 'security-light' ||
    a.iconKey === 'bulb' ||
    a.iconKey === 'security-light'
  );
}

export function computeSavingsTips(
  items: ApplianceCostBreakdown[],
  settings: UserSettings,
  totalMonthlyCost: number,
  calibrationScaleFactor: number,
  appliedTipIds: string[]
): ComputedSavingsTip[] {
  if (items.length === 0 || totalMonthlyCost <= 0) {
    return [];
  }

  const appliedSet = new Set(appliedTipIds);
  const results: ComputedSavingsTip[] = [];
  const ratePerKwh = Math.max(0, Number(settings.ratePerKwh) || 0);

  for (const def of SAVINGS_TIP_DEFINITIONS) {
    if (def.formulaType === 'cut_ac_hours') {
      const hoursToCut = def.hoursReduced ?? 1;
      const acItems = items.filter(
        (it) =>
          isAcAppliance(it.appliance) &&
          it.gridHoursPerDay + it.backupHoursPerDay >= hoursToCut
      );
      if (acItems.length > 0) {
        let monthlySavings = 0;
        let monthlyKwhSaved = 0;
        for (const it of acItems) {
          const poweredHours = it.gridHoursPerDay + it.backupHoursPerDay;
          if (poweredHours > 0) {
            const cutRatio = Math.min(1, hoursToCut / poweredHours);
            monthlySavings += it.calibratedMonthlyCost * cutRatio;
            monthlyKwhSaved += it.calibratedMonthlyKwh * cutRatio;
          }
        }
        if (monthlySavings > 0) {
          results.push({
            id: def.id,
            title: def.title || 'Cut AC by 1 hour a day',
            description: def.description || '',
            badge: def.badge,
            monthlySavings,
            yearlySavings: monthlySavings * 12,
            monthlyKwhSaved,
            percentOfBill: (monthlySavings / totalMonthlyCost) * 100,
            applied: appliedSet.has(def.id),
            relatedApplianceIds: acItems.map((i) => i.appliance.id),
          });
        }
      }
    } else if (def.formulaType === 'percent_of_target') {
      const acItems = items.filter(
        (it) => isAcAppliance(it.appliance) && it.calibratedMonthlyCost > 0
      );
      if (acItems.length > 0) {
        const pct = def.percentReduction ?? 0.08;
        const acTotalCost = acItems.reduce(
          (sum, it) => sum + it.calibratedMonthlyCost,
          0
        );
        const acTotalKwh = acItems.reduce(
          (sum, it) => sum + it.calibratedMonthlyKwh,
          0
        );
        const monthlySavings = acTotalCost * pct;
        const monthlyKwhSaved = acTotalKwh * pct;
        if (monthlySavings > 0) {
          results.push({
            id: def.id,
            title: def.title || 'Raise AC temperature by 2°C',
            description: def.description || '',
            badge: def.badge,
            monthlySavings,
            yearlySavings: monthlySavings * 12,
            monthlyKwhSaved,
            percentOfBill: (monthlySavings / totalMonthlyCost) * 100,
            applied: appliedSet.has(def.id),
            relatedApplianceIds: acItems.map((i) => i.appliance.id),
          });
        }
      }
    } else if (def.formulaType === 'lighting_led_upgrade') {
      const lightingItems = items.filter(
        (it) =>
          isLightingAppliance(it.appliance) && it.calibratedMonthlyCost > 0
      );
      if (lightingItems.length > 0) {
        const pct = def.percentReduction ?? 0.625;
        const lightCost = lightingItems.reduce(
          (sum, it) => sum + it.calibratedMonthlyCost,
          0
        );
        const lightKwh = lightingItems.reduce(
          (sum, it) => sum + it.calibratedMonthlyKwh,
          0
        );
        const monthlySavings = lightCost * pct;
        const monthlyKwhSaved = lightKwh * pct;
        if (monthlySavings > 0) {
          results.push({
            id: def.id,
            title: def.title || 'Switch bulbs to LED',
            description: def.description || '',
            badge: def.badge,
            monthlySavings,
            yearlySavings: monthlySavings * 12,
            monthlyKwhSaved,
            percentOfBill: (monthlySavings / totalMonthlyCost) * 100,
            applied: appliedSet.has(def.id),
            relatedApplianceIds: lightingItems.map((i) => i.appliance.id),
          });
        }
      }
    } else if (def.formulaType === 'standby_unplug') {
      const standbyItems = items.filter(
        (it) =>
          it.appliance.hasStandby ||
          (it.appliance.standbyWatts && it.appliance.standbyWatts > 0)
      );
      if (standbyItems.length > 0 && ratePerKwh > 0) {
        let totalDailyStandbyKwh = 0;
        for (const it of standbyItems) {
          const sbWatts =
            it.appliance.standbyWatts && it.appliance.standbyWatts > 0
              ? it.appliance.standbyWatts
              : def.standbyWattsPerDevice ?? 6;
          const activeHours = clampNumber(it.appliance.hoursPerDay, 0, 24);
          const idleHours = Math.max(0, 24 - activeHours);
          totalDailyStandbyKwh +=
            (sbWatts * it.appliance.quantity * idleHours) / 1000;
        }
        const monthlyKwhSaved = totalDailyStandbyKwh * 30;
        const monthlySavings =
          monthlyKwhSaved * ratePerKwh * calibrationScaleFactor;
        if (monthlySavings > 0) {
          results.push({
            id: def.id,
            title: def.title || 'Unplug standby devices',
            description: def.description || '',
            badge: def.badge,
            monthlySavings,
            yearlySavings: monthlySavings * 12,
            monthlyKwhSaved,
            percentOfBill: (monthlySavings / totalMonthlyCost) * 100,
            applied: appliedSet.has(def.id),
            relatedApplianceIds: standbyItems.map((i) => i.appliance.id),
          });
        }
      }
    } else if (def.formulaType === 'generic_top_appliance_1h') {
      const excluded = new Set(def.excludeTemplateIds ?? []);
      const minHours = def.minHoursPerDay ?? 2;
      const maxTips = def.maxGeneratedTips ?? 3;
      const hoursReduced = def.hoursReduced ?? 1;

      const candidates = items.filter((it) => {
        if (isAcAppliance(it.appliance)) return false;
        if (excluded.has(it.appliance.templateId)) return false;
        const poweredHours = it.gridHoursPerDay + it.backupHoursPerDay;
        return poweredHours >= minHours && it.calibratedMonthlyCost > 0;
      });

      const topCandidates = candidates.slice(0, maxTips);
      for (const candidate of topCandidates) {
        const poweredHours =
          candidate.gridHoursPerDay + candidate.backupHoursPerDay;
        const cutRatio = Math.min(1, hoursReduced / poweredHours);
        const monthlySavings = candidate.calibratedMonthlyCost * cutRatio;
        const monthlyKwhSaved = candidate.calibratedMonthlyKwh * cutRatio;
        const tipId = `generic-1h-${candidate.appliance.id}`;
        const title = (
          def.titleTemplate || 'Use {applianceName} 1 hour less a day'
        ).replace('{applianceName}', candidate.appliance.name);
        const description = (
          def.descriptionTemplate ||
          'Reducing {applianceName} runtime by 1 hour per day trims daily kWh consumption.'
        ).replace('{applianceName}', candidate.appliance.name);

        if (monthlySavings > 0) {
          results.push({
            id: tipId,
            title,
            description,
            badge: def.badge,
            monthlySavings,
            yearlySavings: monthlySavings * 12,
            monthlyKwhSaved,
            percentOfBill: (monthlySavings / totalMonthlyCost) * 100,
            applied: appliedSet.has(tipId),
            relatedApplianceIds: [candidate.appliance.id],
          });
        }
      }
    }
  }

  results.sort((a, b) => b.monthlySavings - a.monthlySavings);
  return results;
}

export function calculateHouseholdCostSummary(
  appliances: UserAppliance[],
  settings: UserSettings,
  appliedTipIds: string[] = []
): HouseholdCostSummary {
  const rawBreakdowns = appliances.map((app) =>
    calculateApplianceRawBreakdown(app, settings)
  );

  const rawTotalMonthlyCost = rawBreakdowns.reduce(
    (sum, item) => sum + item.rawMonthlyCost,
    0
  );
  const rawTotalMonthlyKwh = rawBreakdowns.reduce(
    (sum, item) => sum + item.monthlyKwh,
    0
  );

  const hasValidCalibration =
    Boolean(settings.calibration?.enabled) &&
    typeof settings.calibration?.realBillAmount === 'number' &&
    settings.calibration.realBillAmount > 0 &&
    rawTotalMonthlyCost > 0;

  const calibrationScaleFactor = hasValidCalibration
    ? (settings.calibration.realBillAmount as number) / rawTotalMonthlyCost
    : 1;

  const kwhScaleFactor =
    hasValidCalibration &&
    typeof settings.calibration?.realBillKwh === 'number' &&
    settings.calibration.realBillKwh > 0 &&
    rawTotalMonthlyKwh > 0
      ? settings.calibration.realBillKwh / rawTotalMonthlyKwh
      : calibrationScaleFactor;

  const totalMonthlyCost = rawTotalMonthlyCost * calibrationScaleFactor;
  const totalMonthlyKwh = rawTotalMonthlyKwh * kwhScaleFactor;

  const items: ApplianceCostBreakdown[] = rawBreakdowns
    .map((raw) => {
      const calibratedMonthlyCost =
        raw.rawMonthlyCost * calibrationScaleFactor;
      const calibratedMonthlyKwh = raw.monthlyKwh * kwhScaleFactor;
      const sharePercent =
        totalMonthlyCost > 0
          ? (calibratedMonthlyCost / totalMonthlyCost) * 100
          : 0;
      return {
        ...raw,
        calibratedMonthlyCost,
        calibratedMonthlyKwh,
        sharePercent,
      };
    })
    .sort((a, b) => b.calibratedMonthlyCost - a.calibratedMonthlyCost);

  let gridMonthlyCost = 0;
  let generatorMonthlyCost = 0;
  let inverterMonthlyCost = 0;
  let totalUnpoweredHoursPerDay = 0;
  let unpoweredApplianceCount = 0;

  for (const item of items) {
    gridMonthlyCost += item.rawGridMonthlyCost * calibrationScaleFactor;
    if (item.backupSourceUsed === 'generator') {
      generatorMonthlyCost +=
        item.rawBackupMonthlyCost * calibrationScaleFactor;
    } else if (
      item.backupSourceUsed === 'inverter' ||
      item.backupSourceUsed === 'solar'
    ) {
      inverterMonthlyCost +=
        item.rawBackupMonthlyCost * calibrationScaleFactor;
    }
    if (item.unpoweredHoursPerDay > 0) {
      totalUnpoweredHoursPerDay += item.unpoweredHoursPerDay;
      unpoweredApplianceCount += 1;
    }
  }

  const tips = computeSavingsTips(
    items,
    settings,
    totalMonthlyCost,
    calibrationScaleFactor,
    appliedTipIds
  );

  const rawAppliedMonthlySavings = tips
    .filter((t) => t.applied)
    .reduce((sum, t) => sum + t.monthlySavings, 0);

  // Cap savings so net bill never goes negative
  const appliedMonthlySavings = Math.min(
    totalMonthlyCost,
    rawAppliedMonthlySavings
  );
  const appliedYearlySavings = appliedMonthlySavings * 12;
  const appliedPercentSaved =
    totalMonthlyCost > 0
      ? (appliedMonthlySavings / totalMonthlyCost) * 100
      : 0;

  const rawPotentialMonthlySavings = tips.reduce(
    (sum, t) => sum + t.monthlySavings,
    0
  );
  const potentialMonthlySavings = Math.min(
    totalMonthlyCost,
    rawPotentialMonthlySavings
  );
  const potentialYearlySavings = potentialMonthlySavings * 12;
  const potentialPercentSaved =
    totalMonthlyCost > 0
      ? (potentialMonthlySavings / totalMonthlyCost) * 100
      : 0;

  const netMonthlyCostAfterSavings = Math.max(
    0,
    totalMonthlyCost - appliedMonthlySavings
  );
  const dailyCost = totalMonthlyCost / 30;
  const netDailyCostAfterSavings = netMonthlyCostAfterSavings / 30;

  return {
    items,
    rawTotalMonthlyCost,
    rawTotalMonthlyKwh,
    calibrationActive: hasValidCalibration,
    calibrationScaleFactor,
    kwhScaleFactor,
    totalMonthlyCost,
    totalMonthlyKwh,
    dailyCost,
    gridMonthlyCost,
    generatorMonthlyCost,
    inverterMonthlyCost,
    totalUnpoweredHoursPerDay,
    unpoweredApplianceCount,
    tips,
    appliedMonthlySavings,
    appliedYearlySavings,
    appliedPercentSaved,
    potentialMonthlySavings,
    potentialYearlySavings,
    potentialPercentSaved,
    netMonthlyCostAfterSavings,
    netDailyCostAfterSavings,
  };
}

export function calculateTokenDuration(
  tokenAmount: number,
  summary: HouseholdCostSummary,
  referenceDate: Date = new Date()
): TokenEstimateResult {
  const safeToken = Math.max(0, Number(tokenAmount) || 0);
  const dailyCostCurrent = summary.dailyCost;
  const dailyCostWithAllSavings = Math.max(
    0,
    (summary.totalMonthlyCost - summary.potentialMonthlySavings) / 30
  );
  const dailyCostWithAppliedSavings = summary.netDailyCostAfterSavings;

  const daysCurrent =
    dailyCostCurrent > 0 ? safeToken / dailyCostCurrent : 0;
  const daysWithAllSavings =
    dailyCostWithAllSavings > 0
      ? safeToken / dailyCostWithAllSavings
      : daysCurrent;
  const daysWithAppliedSavings =
    dailyCostWithAppliedSavings > 0
      ? safeToken / dailyCostWithAppliedSavings
      : daysCurrent;

  const extraDaysWithAllSavings = Math.max(
    0,
    daysWithAllSavings - daysCurrent
  );
  const extraDaysWithAppliedSavings = Math.max(
    0,
    daysWithAppliedSavings - daysCurrent
  );

  let topUpDateCurrent: Date | null = null;
  let topUpDateWithAllSavings: Date | null = null;

  if (daysCurrent > 0 && Number.isFinite(daysCurrent)) {
    topUpDateCurrent = new Date(
      referenceDate.getTime() + Math.round(daysCurrent) * 86400000
    );
  }
  if (daysWithAllSavings > 0 && Number.isFinite(daysWithAllSavings)) {
    topUpDateWithAllSavings = new Date(
      referenceDate.getTime() + Math.round(daysWithAllSavings) * 86400000
    );
  }

  return {
    tokenAmount: safeToken,
    dailyCostCurrent,
    dailyCostWithAllSavings,
    dailyCostWithAppliedSavings,
    daysCurrent,
    daysWithAllSavings,
    daysWithAppliedSavings,
    extraDaysWithAllSavings,
    extraDaysWithAppliedSavings,
    topUpDateCurrent,
    topUpDateWithAllSavings,
  };
}

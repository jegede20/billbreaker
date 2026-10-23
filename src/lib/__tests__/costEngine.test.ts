import { describe, expect, it } from 'vitest';
import {
  calculateApplianceRawBreakdown,
  calculateHouseholdCostSummary,
  calculateTokenDuration,
  createDefaultSettings,
  createSampleHouseholdAppliances,
} from '@/lib/costEngine';
import { UserAppliance } from '@/types/billbreaker';

describe('BillBreaker Cost Engine', () => {
  it('computes sample household costs and shares accurately', () => {
    const settings = createDefaultSettings();
    const appliances = createSampleHouseholdAppliances();

    const summary = calculateHouseholdCostSummary(appliances, settings, []);

    expect(Math.round(summary.totalMonthlyCost)).toBe(48000);
    expect(Math.round(summary.dailyCost)).toBe(1600);

    const byId = Object.fromEntries(
      summary.items.map((item) => [item.appliance.id, item])
    );

    expect(Math.round(byId['sample-ac'].calibratedMonthlyCost)).toBe(19200);
    expect(Math.round(byId['sample-ac'].sharePercent)).toBe(40);

    expect(Math.round(byId['sample-freezer'].calibratedMonthlyCost)).toBe(9600);
    expect(Math.round(byId['sample-freezer'].sharePercent)).toBe(20);

    expect(Math.round(byId['sample-fans'].calibratedMonthlyCost)).toBe(7200);
    expect(Math.round(byId['sample-fans'].sharePercent)).toBe(15);

    expect(Math.round(byId['sample-tv-decoder'].calibratedMonthlyCost)).toBe(4800);
    expect(Math.round(byId['sample-tv-decoder'].sharePercent)).toBe(10);

    expect(Math.round(byId['sample-lighting'].calibratedMonthlyCost)).toBe(3360);
    expect(Math.round(byId['sample-lighting'].sharePercent)).toBe(7);

    expect(Math.round(byId['sample-others'].calibratedMonthlyCost)).toBe(3840);
    expect(Math.round(byId['sample-others'].sharePercent)).toBe(8);
  });

  it('caps grid hours at gridSupplyHours and marks extra hours unpowered when no backup exists', () => {
    const settings = {
      ...createDefaultSettings(),
      gridSupplyHours: 6,
      powerSources: ['grid'] as ('grid' | 'generator' | 'inverter' | 'solar')[],
      ratePerKwh: 200,
    };

    const fan: UserAppliance = {
      id: 'fan-1',
      templateId: 'standing-fan',
      name: 'Standing Fan',
      category: 'cooling',
      watts: 100,
      quantity: 1,
      hoursPerDay: 10,
      dutyCycle: 1,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'fan',
    };

    const raw = calculateApplianceRawBreakdown(fan, settings);
    expect(raw.gridHoursPerDay).toBe(6);
    expect(raw.backupHoursPerDay).toBe(0);
    expect(raw.unpoweredHoursPerDay).toBe(4);
    expect(raw.monthlyKwh).toBeCloseTo(18);
    expect(raw.rawMonthlyCost).toBeCloseTo(3600);
  });

  it('spills extra hours onto generator when generator backup is enabled', () => {
    const settings = {
      ...createDefaultSettings(),
      gridSupplyHours: 6,
      powerSources: ['grid', 'generator'] as (
        | 'grid'
        | 'generator'
        | 'inverter'
        | 'solar'
      )[],
      ratePerKwh: 200,
      generatorLitersPerHour: 1.5,
      generatorFuelPricePerLiter: 1000,
    };

    const ac: UserAppliance = {
      id: 'ac-1',
      templateId: 'air-conditioner',
      name: 'Air Conditioner',
      category: 'cooling',
      watts: 1000,
      quantity: 1,
      hoursPerDay: 8,
      dutyCycle: 1,
      powerSource: 'grid',
      hasStandby: false,
      standbyWatts: 0,
      iconKey: 'ac',
    };

    const raw = calculateApplianceRawBreakdown(ac, settings);
    expect(raw.gridHoursPerDay).toBe(6);
    expect(raw.backupHoursPerDay).toBe(2);
    expect(raw.unpoweredHoursPerDay).toBe(0);
    expect(raw.backupSourceUsed).toBe('generator');
    expect(raw.rawGridMonthlyCost).toBeCloseTo(36000);
    expect(raw.rawBackupMonthlyCost).toBeCloseTo(90000);
    expect(raw.rawMonthlyCost).toBeCloseTo(126000);
  });

  it('scales appliance costs and savings when bill calibration is active', () => {
    const settings = {
      ...createDefaultSettings(),
      calibration: {
        enabled: true,
        realBillAmount: 60000,
        realBillKwh: 300,
      },
    };
    const appliances = createSampleHouseholdAppliances();
    const summary = calculateHouseholdCostSummary(appliances, settings, []);

    expect(summary.calibrationActive).toBe(true);
    expect(summary.calibrationScaleFactor).toBeCloseTo(60000 / 48000);
    expect(Math.round(summary.totalMonthlyCost)).toBe(60000);
    expect(Math.round(summary.totalMonthlyKwh)).toBe(300);
  });

  it('computes sample savings tips to exact spec numbers (₦12,900/mo, 27%, ₦154,800/yr)', () => {
    const settings = createDefaultSettings();
    const appliances = createSampleHouseholdAppliances();
    const summary = calculateHouseholdCostSummary(appliances, settings, [
      'cut-ac-1h',
      'raise-ac-temp-2c',
      'switch-bulbs-to-led',
      'unplug-standby-devices',
    ]);

    const tipsById = Object.fromEntries(summary.tips.map((t) => [t.id, t]));

    expect(Math.round(tipsById['cut-ac-1h'].monthlySavings)).toBe(6400);
    expect(Math.round(tipsById['raise-ac-temp-2c'].monthlySavings)).toBe(3200);
    expect(Math.round(tipsById['switch-bulbs-to-led'].monthlySavings)).toBe(2100);
    expect(Math.round(tipsById['unplug-standby-devices'].monthlySavings)).toBe(1200);

    expect(Math.round(summary.potentialMonthlySavings)).toBe(12900);
    expect(Math.round(summary.potentialYearlySavings)).toBe(154800);
    expect(Math.round(summary.potentialPercentSaved)).toBe(27);

    expect(Math.round(summary.appliedMonthlySavings)).toBe(12900);
    expect(Math.round(summary.netMonthlyCostAfterSavings)).toBe(48000 - 12900);
  });

  it('generates generic 1-hour reduction tips for user-added top appliances', () => {
    const settings = createDefaultSettings();
    const userAppliances: UserAppliance[] = [
      {
        id: 'user-heater-1',
        templateId: 'water-heater',
        name: 'Electric Water Heater',
        category: 'heating',
        watts: 2000,
        quantity: 1,
        hoursPerDay: 3,
        dutyCycle: 1,
        powerSource: 'grid',
        hasStandby: false,
        standbyWatts: 0,
        iconKey: 'water-heater',
      },
    ];
    const summary = calculateHouseholdCostSummary(userAppliances, settings, []);
    expect(summary.tips.some((t) => t.id === 'generic-1h-user-heater-1')).toBe(
      true
    );
    const genericTip = summary.tips.find(
      (t) => t.id === 'generic-1h-user-heater-1'
    )!;
    // 2000W * 1h * 30 / 1000 * 200 = 12,000
    expect(Math.round(genericTip.monthlySavings)).toBe(12000);
  });

  it('calculates prepaid token duration (12 days now vs 17 days with all savings)', () => {
    const settings = createDefaultSettings();
    const appliances = createSampleHouseholdAppliances();
    const summary = calculateHouseholdCostSummary(appliances, settings, []);

    const tokenRes = calculateTokenDuration(
      20000,
      summary,
      new Date('2026-10-21T00:00:00Z')
    );

    // 20,000 / 1,600 = 12.5 -> floor is 12 days
    expect(Math.floor(tokenRes.daysCurrent)).toBe(12);
    // 20,000 / ((48,000 - 12,900) / 30 = 1,170) = 17.09 -> round is 17 days
    expect(Math.round(tokenRes.daysWithAllSavings)).toBe(17);
  });
});

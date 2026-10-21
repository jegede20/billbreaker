export type MeterType = 'prepaid' | 'postpaid';

export type PowerSourceOption = 'grid' | 'generator' | 'inverter' | 'solar';

export type AppliancePowerSource = 'grid' | 'generator' | 'inverter';

export interface TariffPreset {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  defaultRatePerKwh: number | null;
  defaultFuelPricePerLiter: number;
  defaultGeneratorLitersPerHour: number;
  voltageRegion: '230V' | '110V';
  rateNote: string;
}

export interface ApplianceTemplate {
  id: string;
  name: string;
  category: string;
  defaultWatts: number;
  watts230V: number;
  watts110V: number;
  defaultHoursPerDay: number;
  defaultQuantity: number;
  defaultDutyCycle: number;
  hasStandby: boolean;
  standbyWatts: number;
  iconKey: string;
}

export interface UserAppliance {
  id: string;
  templateId: string;
  name: string;
  category: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
  dutyCycle: number;
  powerSource: AppliancePowerSource;
  hasStandby: boolean;
  standbyWatts: number;
  iconKey: string;
}

export interface BillCalibration {
  enabled: boolean;
  realBillAmount: number | null;
  realBillKwh: number | null;
}

export interface UserSettings {
  setupCompleted: boolean;
  countryCode: string;
  countryName: string;
  currencyCode: string;
  ratePerKwh: number;
  meterType: MeterType;
  powerSources: PowerSourceOption[];
  gridSupplyHours: number;
  generatorFuelPricePerLiter: number;
  generatorLitersPerHour: number;
  inverterCostPerKwh: number;
  calibration: BillCalibration;
  lastTokenAmount: number;
}

export interface PersistedState {
  version: number;
  settings: UserSettings;
  appliances: UserAppliance[];
  appliedTipIds: string[];
}

export interface ApplianceCostBreakdown {
  appliance: UserAppliance;
  dailyKwh: number;
  monthlyKwh: number;
  gridHoursPerDay: number;
  backupHoursPerDay: number;
  unpoweredHoursPerDay: number;
  backupSourceUsed: 'generator' | 'inverter' | 'solar' | null;
  rawGridMonthlyCost: number;
  rawBackupMonthlyCost: number;
  rawMonthlyCost: number;
  calibratedMonthlyCost: number;
  calibratedMonthlyKwh: number;
  sharePercent: number;
}

export interface SavingsTipDefinition {
  id: string;
  formulaType:
    | 'cut_ac_hours'
    | 'percent_of_target'
    | 'lighting_led_upgrade'
    | 'standby_unplug'
    | 'generic_top_appliance_1h';
  targetCategory?: string;
  targetTemplateIds?: string[];
  hoursReduced?: number;
  percentReduction?: number;
  standbyWattsPerDevice?: number;
  defaultIdleHours?: number;
  maxGeneratedTips?: number;
  minHoursPerDay?: number;
  excludeTemplateIds?: string[];
  title?: string;
  description?: string;
  titleTemplate?: string;
  descriptionTemplate?: string;
  badge: string;
}

export interface ComputedSavingsTip {
  id: string;
  title: string;
  description: string;
  badge: string;
  monthlySavings: number;
  yearlySavings: number;
  monthlyKwhSaved: number;
  percentOfBill: number;
  applied: boolean;
  relatedApplianceIds: string[];
}

export interface HouseholdCostSummary {
  items: ApplianceCostBreakdown[];
  rawTotalMonthlyCost: number;
  rawTotalMonthlyKwh: number;
  calibrationActive: boolean;
  calibrationScaleFactor: number;
  kwhScaleFactor: number;
  totalMonthlyCost: number;
  totalMonthlyKwh: number;
  dailyCost: number;
  gridMonthlyCost: number;
  generatorMonthlyCost: number;
  inverterMonthlyCost: number;
  totalUnpoweredHoursPerDay: number;
  unpoweredApplianceCount: number;
  tips: ComputedSavingsTip[];
  appliedMonthlySavings: number;
  appliedYearlySavings: number;
  appliedPercentSaved: number;
  potentialMonthlySavings: number;
  potentialYearlySavings: number;
  potentialPercentSaved: number;
  netMonthlyCostAfterSavings: number;
  netDailyCostAfterSavings: number;
}

export interface TokenEstimateResult {
  tokenAmount: number;
  dailyCostCurrent: number;
  dailyCostWithAllSavings: number;
  dailyCostWithAppliedSavings: number;
  daysCurrent: number;
  daysWithAllSavings: number;
  daysWithAppliedSavings: number;
  extraDaysWithAllSavings: number;
  extraDaysWithAppliedSavings: number;
  topUpDateCurrent: Date | null;
  topUpDateWithAllSavings: Date | null;
}

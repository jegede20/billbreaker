import {
  createDefaultSettings,
  createSampleHouseholdAppliances,
} from '@/lib/costEngine';
import {
  PersistedState,
  UserAppliance,
  UserSettings,
} from '@/types/billbreaker';

export const STORAGE_KEY = 'billbreaker_state_v1';
export const STORAGE_VERSION = 1;

export interface LoadStateResult {
  state: PersistedState;
  wasCorrupted: boolean;
  recoveryMessage: string | null;
}

export function createInitialPersistedState(
  withSampleAppliances = true
): PersistedState {
  return {
    version: STORAGE_VERSION,
    settings: createDefaultSettings(),
    appliances: withSampleAppliances ? createSampleHouseholdAppliances() : [],
    appliedTipIds: [],
  };
}

function isValidSettings(obj: unknown): obj is UserSettings {
  if (!obj || typeof obj !== 'object') return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.countryCode === 'string' &&
    typeof s.currencyCode === 'string' &&
    typeof s.ratePerKwh === 'number' &&
    Number.isFinite(s.ratePerKwh) &&
    Array.isArray(s.powerSources) &&
    typeof s.gridSupplyHours === 'number' &&
    Number.isFinite(s.gridSupplyHours)
  );
}

function isValidAppliance(obj: unknown): obj is UserAppliance {
  if (!obj || typeof obj !== 'object') return false;
  const a = obj as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.watts === 'number' &&
    Number.isFinite(a.watts) &&
    typeof a.quantity === 'number' &&
    Number.isFinite(a.quantity) &&
    typeof a.hoursPerDay === 'number' &&
    Number.isFinite(a.hoursPerDay)
  );
}

export function loadPersistedState(): LoadStateResult {
  if (typeof window === 'undefined') {
    return {
      state: createInitialPersistedState(true),
      wasCorrupted: false,
      recoveryMessage: null,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        state: createInitialPersistedState(true),
        wasCorrupted: false,
        recoveryMessage: null,
      };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== STORAGE_VERSION ||
      !isValidSettings(parsed.settings) ||
      !Array.isArray(parsed.appliances) ||
      !parsed.appliances.every(isValidAppliance) ||
      !Array.isArray(parsed.appliedTipIds)
    ) {
      const fallback = createInitialPersistedState(true);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return {
        state: fallback,
        wasCorrupted: true,
        recoveryMessage:
          'Saved data on this device was corrupted or from an incompatible version and was safely reset.',
      };
    }

    return {
      state: {
        version: STORAGE_VERSION,
        settings: {
          ...createDefaultSettings(),
          ...parsed.settings,
          calibration: {
            enabled: Boolean(parsed.settings.calibration?.enabled),
            realBillAmount: parsed.settings.calibration?.realBillAmount ?? null,
            realBillKwh: parsed.settings.calibration?.realBillKwh ?? null,
          },
        },
        appliances: parsed.appliances,
        appliedTipIds: parsed.appliedTipIds.filter(
          (id): id is string => typeof id === 'string'
        ),
      },
      wasCorrupted: false,
      recoveryMessage: null,
    };
  } catch {
    const fallback = createInitialPersistedState(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    } catch {
      // Ignore storage quota errors
    }
    return {
      state: fallback,
      wasCorrupted: true,
      recoveryMessage:
        'Saved data on this device could not be read and was safely reset to default settings.',
    };
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistedState = {
      version: STORAGE_VERSION,
      settings: state.settings,
      appliances: state.appliances,
      appliedTipIds: state.appliedTipIds,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Fail safely on storage quota errors
  }
}

export function clearPersistedState(): PersistedState {
  const fresh = createInitialPersistedState(false);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }
  return fresh;
}

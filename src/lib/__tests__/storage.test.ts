import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearPersistedState,
  createInitialPersistedState,
  loadPersistedState,
  savePersistedState,
  STORAGE_KEY,
} from '@/lib/storage';

class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

describe('BillBreaker Typed Storage Helper', () => {
  beforeEach(() => {
    const mockStorage = new MockLocalStorage();
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: mockStorage },
      writable: true,
      configurable: true,
    });
  });

  it('loads default state when localStorage is empty', () => {
    const result = loadPersistedState();
    expect(result.wasCorrupted).toBe(false);
    expect(result.state.version).toBe(1);
    expect(result.state.settings.countryCode).toBe('NG');
    expect(result.state.appliances.length).toBeGreaterThan(0);
  });

  it('saves and reloads user state accurately', () => {
    const initial = createInitialPersistedState(true);
    initial.settings.countryCode = 'KE';
    initial.settings.currencyCode = 'KES';
    initial.settings.ratePerKwh = 28;
    initial.appliedTipIds = ['cut-ac-1h'];

    savePersistedState(initial);

    const loaded = loadPersistedState();
    expect(loaded.wasCorrupted).toBe(false);
    expect(loaded.state.settings.countryCode).toBe('KE');
    expect(loaded.state.settings.currencyCode).toBe('KES');
    expect(loaded.state.settings.ratePerKwh).toBe(28);
    expect(loaded.state.appliedTipIds).toEqual(['cut-ac-1h']);
  });

  it('recovers safely without crashing when stored JSON is corrupted', () => {
    window.localStorage.setItem(STORAGE_KEY, '{corrupted_json: true');

    const loaded = loadPersistedState();
    expect(loaded.wasCorrupted).toBe(true);
    expect(loaded.recoveryMessage).toBeTruthy();
    expect(loaded.state.version).toBe(1);
    expect(loaded.state.settings.ratePerKwh).toBeGreaterThan(0);
  });

  it('recovers safely when stored schema version mismatches', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 999, settings: {}, appliances: 'invalid' })
    );

    const loaded = loadPersistedState();
    expect(loaded.wasCorrupted).toBe(true);
    expect(loaded.state.version).toBe(1);
  });

  it('clears persisted state on reset', () => {
    const initial = createInitialPersistedState(true);
    savePersistedState(initial);
    const cleared = clearPersistedState();
    expect(cleared.appliances).toEqual([]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

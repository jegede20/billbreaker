'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppliancesView } from '@/components/AppliancesView';
import { BrandLogo } from '@/components/BrandLogo';
import { DashboardView } from '@/components/DashboardView';
import {
  NavAppliancesIcon,
  NavHomeIcon,
  NavSavingsIcon,
  NavSettingsIcon,
  NavTokensIcon,
} from '@/components/Icons';
import { LandingPage } from '@/components/LandingPage';
import { SavingsView } from '@/components/SavingsView';
import { SettingsView } from '@/components/SettingsView';
import { SetupWizard } from '@/components/SetupWizard';
import { TokensView } from '@/components/TokensView';
import {
  calculateHouseholdCostSummary,
  createDefaultSettings,
  createSampleHouseholdAppliances,
  getTariffPreset,
} from '@/lib/costEngine';
import { formatMoney, getQuickTokenAmounts } from '@/lib/currency';
import {
  clearPersistedState,
  createInitialPersistedState,
  loadPersistedState,
  savePersistedState,
} from '@/lib/storage';
import { STRINGS } from '@/lib/strings';
import {
  PersistedState,
  UserAppliance,
  UserSettings,
} from '@/types/billbreaker';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type AppTab = 'home' | 'appliances' | 'savings' | 'tokens' | 'settings';
type ViewMode = 'landing' | 'setup' | 'app';

export function BillBreakerApp() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<PersistedState>(() =>
    createInitialPersistedState(true)
  );
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const loaded = loadPersistedState();
    setState(loaded.state);
    if (loaded.wasCorrupted && loaded.recoveryMessage) {
      setRecoveryNotice(loaded.recoveryMessage);
    }
    setHydrated(true);

    // Register offline service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore registration errors in restricted frames
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  };

  useEffect(() => {
    if (!hydrated) return;
    savePersistedState(state);
  }, [state, hydrated]);

  const summary = useMemo(
    () =>
      calculateHouseholdCostSummary(
        state.appliances,
        state.settings,
        state.appliedTipIds
      ),
    [state.appliances, state.settings, state.appliedTipIds]
  );

  const handleStartFromLanding = (countryCode?: string) => {
    if (state.settings.setupCompleted) {
      setViewMode('app');
      return;
    }

    if (countryCode) {
      const preset = getTariffPreset(countryCode);
      const quickTokens = getQuickTokenAmounts(preset.currencyCode, 0);
      setState((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          countryCode: preset.countryCode,
          countryName: preset.countryName,
          currencyCode: preset.currencyCode,
          ratePerKwh: preset.defaultRatePerKwh ?? prev.settings.ratePerKwh,
          generatorFuelPricePerLiter: preset.defaultFuelPricePerLiter,
          generatorLitersPerHour: preset.defaultGeneratorLitersPerHour,
          lastTokenAmount: quickTokens[2] || 20000,
        },
      }));
    }
    setViewMode('setup');
  };

  const handleCompleteSetup = (
    newSettings: UserSettings,
    useStarterPack: boolean
  ) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...newSettings,
        setupCompleted: true,
      },
      appliances:
        useStarterPack && prev.appliances.length === 0
          ? createSampleHouseholdAppliances()
          : useStarterPack
          ? prev.appliances
          : [],
    }));
    setActiveTab('home');
    setViewMode('app');
  };

  const handleSkipSetup = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        setupCompleted: true,
      },
      appliances:
        prev.appliances.length > 0
          ? prev.appliances
          : createSampleHouseholdAppliances(),
    }));
    setActiveTab('home');
    setViewMode('app');
  };

  const handleAddAppliance = (appliance: UserAppliance) => {
    setState((prev) => ({
      ...prev,
      appliances: [...prev.appliances, appliance],
    }));
  };

  const handleUpdateAppliance = (updated: UserAppliance) => {
    setState((prev) => ({
      ...prev,
      appliances: prev.appliances.map((item) =>
        item.id === updated.id ? updated : item
      ),
    }));
  };

  const handleDeleteAppliance = (id: string) => {
    setState((prev) => ({
      ...prev,
      appliances: prev.appliances.filter((item) => item.id !== id),
      appliedTipIds: prev.appliedTipIds.filter(
        (tipId) => tipId !== `generic-1h-${id}`
      ),
    }));
  };

  const handleToggleTip = (tipId: string) => {
    setState((prev) => {
      const exists = prev.appliedTipIds.includes(tipId);
      return {
        ...prev,
        appliedTipIds: exists
          ? prev.appliedTipIds.filter((id) => id !== tipId)
          : [...prev.appliedTipIds, tipId],
      };
    });
  };

  const handleApplyAllTips = () => {
    const allIds = summary.tips.map((t) => t.id);
    setState((prev) => ({
      ...prev,
      appliedTipIds: allIds,
    }));
  };

  const handleClearAllTips = () => {
    setState((prev) => ({
      ...prev,
      appliedTipIds: [],
    }));
  };

  const handleUpdateTokenAmount = (amount: number) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        lastTokenAmount: amount,
      },
    }));
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setState((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  const handleLoadSampleHousehold = () => {
    const defaultSettings = createDefaultSettings();
    setState({
      version: 1,
      settings: {
        ...defaultSettings,
        setupCompleted: true,
      },
      appliances: createSampleHouseholdAppliances(),
      appliedTipIds: [],
    });
  };

  const handleResetAllData = () => {
    const fresh = clearPersistedState();
    setState(fresh);
    setActiveTab('home');
    setViewMode('setup');
  };

  if (viewMode === 'landing') {
    return <LandingPage onStartApp={handleStartFromLanding} />;
  }

  if (viewMode === 'setup') {
    return (
      <SetupWizard
        initialSettings={state.settings}
        onComplete={handleCompleteSetup}
        onSkip={handleSkipSetup}
      />
    );
  }

  const navItems: Array<{
    id: AppTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'home',
      label: STRINGS.nav.home,
      icon: <NavHomeIcon size={20} />,
    },
    {
      id: 'appliances',
      label: STRINGS.nav.appliances,
      icon: <NavAppliancesIcon size={20} />,
      badge:
        state.appliances.length > 0
          ? String(state.appliances.length)
          : undefined,
    },
    {
      id: 'savings',
      label: STRINGS.nav.savings,
      icon: <NavSavingsIcon size={20} />,
      badge:
        summary.appliedMonthlySavings > 0
          ? `-${Math.round(summary.appliedPercentSaved)}%`
          : undefined,
    },
    {
      id: 'tokens',
      label: STRINGS.nav.tokens,
      icon: <NavTokensIcon size={20} />,
    },
    {
      id: 'settings',
      label: STRINGS.nav.settings,
      icon: <NavSettingsIcon size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#1F2937] flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 bg-white border-r border-[#F0E7D3] flex-col justify-between p-5 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <BrandLogo size="md" onClick={() => setActiveTab('home')} />
          </div>

          <nav className="space-y-1.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full min-h-[48px] px-4 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-[#F59E0B] text-[#1F2937]'
                      : 'text-[#1F2937] hover:bg-[#FFFBF2]'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-extrabold ${
                        active
                          ? 'bg-white text-[#1F2937]'
                          : 'bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Monthly Bill Mini Summary + Back to Landing */}
        <div className="space-y-3 pt-4 border-t border-[#F0E7D3]">
          <div className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3]">
            <span className="text-xs font-bold text-[#6B7280] block">
              Monthly estimate ({state.settings.currencyCode})
            </span>
            <div className="text-xl font-extrabold text-[#1F2937] mt-0.5">
              {formatMoney(
                summary.netMonthlyCostAfterSavings,
                state.settings.currencyCode
              )}
            </div>
            {summary.appliedMonthlySavings > 0 && (
              <span className="text-xs font-extrabold text-[#15803D] block mt-0.5">
                Saving{' '}
                {formatMoney(
                  summary.appliedMonthlySavings,
                  state.settings.currencyCode
                )}
                /mo
              </span>
            )}
          </div>

          {installPromptEvent && (
            <button
              type="button"
              onClick={handleInstallPwa}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#F59E0B] text-[#1F2937] text-xs font-extrabold text-center transition-colors"
            >
              Install BillBreaker App
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode('landing')}
            className="w-full min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFFBF2] text-left transition-colors"
          >
            ← {STRINGS.nav.backToLanding}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-[#FFFBF2]/95 border-b border-[#F0E7D3] px-4 h-16 flex items-center justify-between">
        <BrandLogo size="sm" onClick={() => setActiveTab('home')} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#F0E7D3] text-xs font-extrabold text-[#1F2937]"
          >
            {state.settings.currencyCode} ·{' '}
            {formatMoney(
              summary.netMonthlyCostAfterSavings,
              state.settings.currencyCode
            )}
            /mo
          </button>
          <button
            type="button"
            onClick={() => setViewMode('landing')}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-white border border-[#F0E7D3] text-xs font-bold text-[#6B7280]"
          >
            Info
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {recoveryNotice && (
            <div
              role="alert"
              className="rounded-2xl bg-white border border-[#F59E0B] p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#1F2937]"
            >
              <span>{recoveryNotice}</span>
              <button
                type="button"
                onClick={() => setRecoveryNotice(null)}
                className="px-3 py-1.5 rounded-lg bg-[#FFFBF2] border border-[#F0E7D3] text-xs font-extrabold shrink-0"
              >
                OK
              </button>
            </div>
          )}

          {activeTab === 'home' && (
            <DashboardView
              settings={state.settings}
              summary={summary}
              onToggleTip={handleToggleTip}
              onNavigateTab={setActiveTab}
              onLoadSampleHousehold={handleLoadSampleHousehold}
            />
          )}

          {activeTab === 'appliances' && (
            <AppliancesView
              settings={state.settings}
              summary={summary}
              onAddAppliance={handleAddAppliance}
              onUpdateAppliance={handleUpdateAppliance}
              onDeleteAppliance={handleDeleteAppliance}
              onLoadSampleHousehold={handleLoadSampleHousehold}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsView
              settings={state.settings}
              summary={summary}
              onToggleTip={handleToggleTip}
              onApplyAllTips={handleApplyAllTips}
              onClearAllTips={handleClearAllTips}
              onNavigateAppliances={() => setActiveTab('appliances')}
            />
          )}

          {activeTab === 'tokens' && (
            <TokensView
              settings={state.settings}
              summary={summary}
              onUpdateTokenAmount={handleUpdateTokenAmount}
              onApplyAllTips={handleApplyAllTips}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={state.settings}
              summary={summary}
              onUpdateSettings={handleUpdateSettings}
              onResetAllData={handleResetAllData}
              onLoadSampleHousehold={handleLoadSampleHousehold}
              onOpenSetupWizard={() => setViewMode('setup')}
            />
          )}

          {/* Honest Estimate Footer */}
          <footer className="pt-6 border-t border-[#F0E7D3] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
            <span>{STRINGS.brand.footerDisclaimer}</span>
            <span>100% on-device storage · Works offline</span>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#F0E7D3] px-2 py-1.5 grid grid-cols-5 gap-1"
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? 'bg-[#F59E0B] text-[#1F2937] font-extrabold'
                  : 'text-[#6B7280] font-bold hover:text-[#1F2937]'
              }`}
            >
              {item.icon}
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  ApplianceIcon,
  CloseIcon,
  EditIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@/components/Icons';
import { APPLIANCE_TEMPLATES, getTariffPreset } from '@/lib/costEngine';
import { formatMoney } from '@/lib/currency';
import { STRINGS } from '@/lib/strings';
import {
  AppliancePowerSource,
  ApplianceTemplate,
  HouseholdCostSummary,
  UserAppliance,
  UserSettings,
} from '@/types/billbreaker';

interface AppliancesViewProps {
  settings: UserSettings;
  summary: HouseholdCostSummary;
  onAddAppliance: (appliance: UserAppliance) => void;
  onUpdateAppliance: (updated: UserAppliance) => void;
  onDeleteAppliance: (id: string) => void;
  onLoadSampleHousehold: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cooling', label: 'Cooling' },
  { id: 'refrigeration', label: 'Fridge & Freezer' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'entertainment', label: 'TV & Media' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'heating', label: 'Heating' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'utility', label: 'Pump & Utility' },
];

export function AppliancesView({
  settings,
  summary,
  onAddAppliance,
  onUpdateAppliance,
  onDeleteAppliance,
  onLoadSampleHousehold,
}: AppliancesViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Custom / Edit Modal State
  const [editingAppliance, setEditingAppliance] =
    useState<UserAppliance | null>(null);
  const [isCustomNew, setIsCustomNew] = useState(false);

  const [formName, setFormName] = useState('');
  const [formWatts, setFormWatts] = useState('');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formHours, setFormHours] = useState('4');
  const [formDutyCycle, setFormDutyCycle] = useState('1');
  const [formPowerSource, setFormPowerSource] =
    useState<AppliancePowerSource>('grid');
  const [formIconKey, setFormIconKey] = useState('custom');
  const [formError, setFormError] = useState<string | null>(null);
  const [justAddedName, setJustAddedName] = useState<string | null>(null);

  const presetCountry = getTariffPreset(settings.countryCode);
  const is110V = presetCountry.voltageRegion === '110V';

  const filteredTemplates = APPLIANCE_TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAddFromTemplate = (tpl: ApplianceTemplate) => {
    const defaultWatts = is110V ? tpl.watts110V : tpl.watts230V;
    const newApp: UserAppliance = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      templateId: tpl.id,
      name: tpl.name,
      category: tpl.category,
      watts: defaultWatts,
      quantity: tpl.defaultQuantity,
      hoursPerDay: tpl.defaultHoursPerDay,
      dutyCycle: tpl.defaultDutyCycle,
      powerSource: 'grid',
      hasStandby: tpl.hasStandby,
      standbyWatts: tpl.standbyWatts,
      iconKey: tpl.iconKey,
    };
    onAddAppliance(newApp);
    setJustAddedName(tpl.name);
    setTimeout(() => setJustAddedName(null), 2500);
  };

  const openCustomApplianceForm = () => {
    setIsCustomNew(true);
    setEditingAppliance(null);
    setFormName('');
    setFormWatts('200');
    setFormQuantity('1');
    setFormHours('4');
    setFormDutyCycle('1');
    setFormPowerSource('grid');
    setFormIconKey('custom');
    setFormError(null);
  };

  const openEditApplianceForm = (app: UserAppliance) => {
    setIsCustomNew(false);
    setEditingAppliance(app);
    setFormName(app.name);
    setFormWatts(String(app.watts));
    setFormQuantity(String(app.quantity));
    setFormHours(String(app.hoursPerDay));
    setFormDutyCycle(String(Number(app.dutyCycle.toFixed(2))));
    setFormPowerSource(app.powerSource);
    setFormIconKey(app.iconKey);
    setFormError(null);
  };

  const closeFormModal = () => {
    setIsCustomNew(false);
    setEditingAppliance(null);
    setFormError(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim() || 'Custom Appliance';
    const watts = parseFloat(formWatts);
    const quantity = Math.round(parseFloat(formQuantity));
    const hoursPerDay = parseFloat(formHours);
    const dutyCycle = parseFloat(formDutyCycle);

    if (!Number.isFinite(watts) || watts <= 0) {
      setFormError(STRINGS.validation.wattagePositive);
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      setFormError(STRINGS.validation.quantityMin);
      return;
    }
    if (
      !Number.isFinite(hoursPerDay) ||
      hoursPerDay < 0 ||
      hoursPerDay > 24
    ) {
      setFormError(STRINGS.validation.hoursRange);
      return;
    }
    if (
      !Number.isFinite(dutyCycle) ||
      dutyCycle < 0.05 ||
      dutyCycle > 1.0
    ) {
      setFormError(STRINGS.validation.dutyCycleRange);
      return;
    }

    if (isCustomNew) {
      const newApp: UserAppliance = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        templateId: 'custom',
        name: trimmedName,
        category: 'custom',
        watts,
        quantity,
        hoursPerDay,
        dutyCycle,
        powerSource: formPowerSource,
        hasStandby: false,
        standbyWatts: 0,
        iconKey: formIconKey,
      };
      onAddAppliance(newApp);
    } else if (editingAppliance) {
      onUpdateAppliance({
        ...editingAppliance,
        name: trimmedName,
        watts,
        quantity,
        hoursPerDay,
        dutyCycle,
        powerSource: formPowerSource,
        iconKey: formIconKey,
      });
    }

    closeFormModal();
  };

  const handleStepHours = (app: UserAppliance, delta: number) => {
    const step = app.hoursPerDay < 2 && delta < 0 ? 0.5 : 1;
    const actualDelta = delta < 0 ? -step : app.hoursPerDay < 1 ? 0.5 : 1;
    const nextHours = Math.max(
      0,
      Math.min(24, Number((app.hoursPerDay + actualDelta).toFixed(1)))
    );
    onUpdateAppliance({
      ...app,
      hoursPerDay: nextHours,
    });
  };

  const handleCyclePowerSource = (app: UserAppliance) => {
    const order: AppliancePowerSource[] = ['grid', 'generator', 'inverter'];
    const nextIndex = (order.indexOf(app.powerSource) + 1) % order.length;
    onUpdateAppliance({
      ...app,
      powerSource: order[nextIndex],
    });
  };

  const powerSourceLabel = (src: AppliancePowerSource) => {
    if (src === 'grid') return 'Grid';
    if (src === 'generator') return 'Generator';
    return settings.powerSources.includes('solar') &&
      !settings.powerSources.includes('inverter')
      ? 'Solar'
      : 'Inverter';
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">
            {STRINGS.appliances.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {STRINGS.appliances.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPickerOpen((prev) => !prev)}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm inline-flex items-center gap-2"
          >
            <PlusIcon size={18} />
            <span>
              {pickerOpen ? 'Hide appliance library' : STRINGS.appliances.addApplianceBtn}
            </span>
          </button>

          <button
            type="button"
            onClick={openCustomApplianceForm}
            className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/50 border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
          >
            + Custom item
          </button>
        </div>
      </div>

      {/* Feedback toast when item added */}
      {justAddedName && (
        <div
          role="status"
          className="rounded-2xl bg-white border border-[#16A34A] px-4 py-3 text-sm font-extrabold text-[#15803D] flex items-center justify-between"
        >
          <span>Added &ldquo;{justAddedName}&rdquo; to your household bill.</span>
          <button
            type="button"
            onClick={() => setJustAddedName(null)}
            className="text-xs underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Searchable Appliance Library Picker */}
      {pickerOpen && (
        <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2937]">
                Appliance Library ({APPLIANCE_TEMPLATES.length} common presets)
              </h2>
              <p className="text-xs text-[#6B7280]">
                Typical wattages shown as estimates ({presetCountry.voltageRegion}{' '}
                standard). You can edit any wattage after adding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="min-h-[40px] min-w-[40px] rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-center text-[#1F2937]"
              aria-label="Close appliance picker"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <SearchIcon
              size={18}
              className="text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={STRINGS.appliances.searchPlaceholder}
              aria-label={STRINGS.appliances.searchPlaceholder}
              className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-sm sm:text-base font-medium text-[#1F2937] focus:outline-none focus:border-[#1F2937]"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
                    active
                      ? 'bg-[#1F2937] text-white border-[#1F2937]'
                      : 'bg-[#FFFBF2] text-[#1F2937] border-[#F0E7D3] hover:border-[#1F2937]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid of Library Appliances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredTemplates.map((tpl) => {
              const watts = is110V ? tpl.watts110V : tpl.watts230V;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleQuickAddFromTemplate(tpl)}
                  className="p-3.5 rounded-2xl bg-[#FFFBF2] hover:bg-[#F59E0B]/15 border border-[#F0E7D3] hover:border-[#F59E0B] text-left flex items-center justify-between gap-3 transition-colors min-h-[68px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-white border border-[#F0E7D3] flex items-center justify-center shrink-0">
                      <ApplianceIcon iconKey={tpl.iconKey} size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-[#1F2937] truncate">
                        {tpl.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        ~{watts}W · {tpl.defaultHoursPerDay}h/day
                      </div>
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-[#F59E0B] text-[#1F2937] flex items-center justify-center shrink-0">
                    <PlusIcon size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom / Edit Appliance Modal */}
      {(isCustomNew || editingAppliance) && (
        <div
          className="fixed inset-0 z-50 bg-[#1F2937]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appliance-modal-title"
        >
          <div className="bg-white rounded-3xl border border-[#F0E7D3] p-6 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="appliance-modal-title"
                className="text-xl font-extrabold text-[#1F2937]"
              >
                {isCustomNew ? 'Add Custom Appliance' : 'Edit Appliance'}
              </h2>
              <button
                type="button"
                onClick={closeFormModal}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-center text-[#1F2937]"
                aria-label="Close modal"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label
                  htmlFor="app-form-name"
                  className="block text-xs font-bold text-[#1F2937] mb-1.5"
                >
                  Appliance name
                </label>
                <input
                  id="app-form-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Living Room AC, Chest Freezer, Hair Dryer"
                  className="w-full min-h-[46px] px-4 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-sm text-[#1F2937]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="app-form-watts"
                    className="block text-xs font-bold text-[#1F2937] mb-1.5"
                  >
                    {STRINGS.appliances.wattsLabel}
                  </label>
                  <input
                    id="app-form-watts"
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={formWatts}
                    onChange={(e) => setFormWatts(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="app-form-qty"
                    className="block text-xs font-bold text-[#1F2937] mb-1.5"
                  >
                    {STRINGS.appliances.quantityLabel}
                  </label>
                  <input
                    id="app-form-qty"
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="app-form-hours"
                    className="block text-xs font-bold text-[#1F2937] mb-1.5"
                  >
                    {STRINGS.appliances.hoursPerDay} (0 - 24)
                  </label>
                  <input
                    id="app-form-hours"
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    required
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="app-form-duty"
                    className="block text-xs font-bold text-[#1F2937] mb-1.5"
                  >
                    {STRINGS.appliances.dutyCycleLabel}
                  </label>
                  <input
                    id="app-form-duty"
                    type="number"
                    step="0.05"
                    min="0.05"
                    max="1"
                    required
                    value={formDutyCycle}
                    onChange={(e) => setFormDutyCycle(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-extrabold text-sm text-[#1F2937]"
                  />
                </div>
              </div>
              <p className="text-xs text-[#6B7280]">
                Duty cycle is 1.0 for most devices, and 0.4–0.5 for compressor
                appliances like fridges and freezers that cycle on and off.
              </p>

              <div>
                <span className="block text-xs font-bold text-[#1F2937] mb-1.5">
                  {STRINGS.appliances.powerSourceLabel}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'grid', label: 'Grid' },
                      { id: 'generator', label: 'Generator' },
                      { id: 'inverter', label: 'Inverter / Solar' },
                    ] as const
                  ).map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setFormPowerSource(src.id)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-extrabold transition-colors ${
                        formPowerSource === src.id
                          ? 'bg-[#F59E0B] text-[#1F2937] border-[#1F2937]'
                          : 'bg-[#FFFBF2] text-[#1F2937] border-[#F0E7D3]'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-[#FFFBF2] border border-[#EF4444] text-xs font-bold text-[#DC2626]"
                >
                  {formError}
                </div>
              )}

              <div className="pt-4 border-t border-[#F0E7D3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] font-bold text-sm text-[#1F2937]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1F2937] font-extrabold text-sm"
                >
                  {isCustomNew ? 'Add appliance' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Appliances List */}
      {summary.items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F0E7D3] p-8 sm:p-12 text-center">
          <h2 className="text-xl font-extrabold text-[#1F2937]">
            {STRINGS.dashboard.emptyTitle}
          </h2>
          <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto">
            {STRINGS.dashboard.emptyDescription}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#F59E0B] text-[#1F2937] font-extrabold text-sm inline-flex items-center justify-center gap-2"
            >
              <PlusIcon size={18} />
              <span>Browse appliance library</span>
            </button>
            <button
              type="button"
              onClick={onLoadSampleHousehold}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] text-[#1F2937] font-bold text-sm"
            >
              {STRINGS.dashboard.loadSampleBtn}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.items.map((item, idx) => {
            const { appliance } = item;
            return (
              <div
                key={appliance.id}
                className="bg-white rounded-3xl border border-[#F0E7D3] p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon, Name, Monthly Cost */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#FFFBF2] border border-[#F0E7D3] flex items-center justify-center shrink-0">
                        <ApplianceIcon iconKey={appliance.iconKey} size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#FFFBF2] border border-[#F0E7D3] text-[#6B7280]">
                            #{idx + 1}
                          </span>
                          <h3 className="font-extrabold text-base text-[#1F2937] truncate">
                            {appliance.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Qty: <strong className="text-[#1F2937]">{appliance.quantity}</strong> ·{' '}
                          <strong className="text-[#1F2937]">{appliance.watts}W</strong> est.
                          {appliance.dutyCycle < 0.99 &&
                            ` · ${Math.round(appliance.dutyCycle * 100)}% cycle`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-extrabold text-[#1F2937]">
                        {formatMoney(
                          item.calibratedMonthlyCost,
                          settings.currencyCode
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#6B7280]">
                        {Math.round(item.sharePercent)}% ·{' '}
                        {Math.round(item.calibratedMonthlyKwh)} kWh/mo
                      </div>
                    </div>
                  </div>

                  {/* Outage / Backup Split Notice if applicable */}
                  {item.appliance.powerSource === 'grid' &&
                    (item.backupHoursPerDay > 0 ||
                      item.unpoweredHoursPerDay > 0) && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] text-xs text-[#1F2937]">
                        {item.backupHoursPerDay > 0 ? (
                          <span>
                            Grid: <strong>{item.gridHoursPerDay}h/day</strong> ·{' '}
                            {item.backupSourceUsed === 'generator'
                              ? 'Generator'
                              : 'Backup'}
                            : <strong>{item.backupHoursPerDay}h/day</strong>
                          </span>
                        ) : (
                          <span className="text-[#B45309] font-medium">
                            Capped at {item.gridHoursPerDay}h/day grid supply (
                            {item.unpoweredHoursPerDay}h unpowered)
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Bottom Controls Row: Power Source Chip, Hours Stepper, Edit/Delete */}
                <div className="mt-5 pt-4 border-t border-[#F0E7D3] flex flex-wrap items-center justify-between gap-2">
                  {/* Power Source Chip */}
                  <button
                    type="button"
                    onClick={() => handleCyclePowerSource(appliance)}
                    title="Click to switch power source (Grid, Generator, Inverter)"
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-colors ${
                      appliance.powerSource === 'grid'
                        ? 'bg-[#FFFBF2] border-[#F0E7D3] text-[#1F2937]'
                        : appliance.powerSource === 'generator'
                        ? 'bg-[#FFFBF2] border-[#EF4444] text-[#DC2626]'
                        : 'bg-[#FFFBF2] border-[#16A34A] text-[#15803D]'
                    }`}
                  >
                    Source: {powerSourceLabel(appliance.powerSource)}
                  </button>

                  {/* Hours Stepper */}
                  <div className="inline-flex items-center rounded-xl bg-[#FFFBF2] border border-[#F0E7D3] p-0.5">
                    <button
                      type="button"
                      onClick={() => handleStepHours(appliance, -1)}
                      disabled={appliance.hoursPerDay <= 0}
                      aria-label={`Decrease daily hours for ${appliance.name}`}
                      className="min-h-[42px] min-w-[42px] rounded-lg flex items-center justify-center text-[#1F2937] hover:bg-white disabled:opacity-40"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-2.5 text-xs sm:text-sm font-extrabold text-[#1F2937] min-w-[68px] text-center">
                      {appliance.hoursPerDay}h / day
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStepHours(appliance, 1)}
                      disabled={appliance.hoursPerDay >= 24}
                      aria-label={`Increase daily hours for ${appliance.name}`}
                      className="min-h-[42px] min-w-[42px] rounded-lg flex items-center justify-center text-[#1F2937] hover:bg-white disabled:opacity-40"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditApplianceForm(appliance)}
                      aria-label={`Edit ${appliance.name}`}
                      className="min-h-[44px] min-w-[44px] rounded-xl bg-[#FFFBF2] hover:bg-[#F0E7D3]/60 border border-[#F0E7D3] flex items-center justify-center text-[#1F2937]"
                    >
                      <EditIcon size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAppliance(appliance.id)}
                      aria-label={`Delete ${appliance.name}`}
                      className="min-h-[44px] min-w-[44px] rounded-xl bg-[#FFFBF2] hover:bg-[#EF4444]/10 border border-[#F0E7D3] flex items-center justify-center text-[#DC2626]"
                    >
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

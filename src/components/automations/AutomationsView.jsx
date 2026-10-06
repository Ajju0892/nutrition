import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';
import FlowCard from './FlowCard.jsx';


export default function AutomationsView() {
  const {
    automations,
    activeAutomationFilter,
    setActiveAutomationFilter,
    telemetry,
    settings,
    setActiveModal
  } = useEcoSync();

  const flows = automations.filter((flow) => {
    if (activeAutomationFilter === 'all') return true;
    return flow.category === activeAutomationFilter || flow.type === activeAutomationFilter;
  });

  const activeFlowCount = automations.filter((a) => a.enabled).length;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Header Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-label text-xs font-bold mb-4">
              OPTIMIZED ENGINE
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
              Automations
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
              The Luminous Engine is currently orchestrating{' '}
              <span className="font-bold text-primary">{activeFlowCount} active flows</span> to
              minimize utility expense and grid carbon intensity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons */}
            <div className="flex p-1 rounded-xl bg-surface-container-high text-xs font-semibold">
              {['all', 'energy', 'water', 'ev', 'climate'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveAutomationFilter(f)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    activeAutomationFilter === f
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal('new_flow')}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary-container/25 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Flow</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Controls Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <span className="material-symbols-outlined text-primary text-lg">science</span>
            <span>Simulate Grid Telemetry Event:</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => useEcoSync().simulatePeakEvent()}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold text-xs flex items-center gap-1.5 transition-all border border-amber-500/20"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Peak Tariff Surge</span>
            </button>
            <button
              onClick={() => useEcoSync().simulateSolarSurge()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1.5 transition-all border border-emerald-500/20"
            >
              <span className="material-symbols-outlined text-sm">solar_power</span>
              <span>Solar Surplus Surge</span>
            </button>
            <button
              onClick={() => useEcoSync().simulateRainRadar()}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 font-bold text-xs flex items-center gap-1.5 transition-all border border-sky-500/20"
            >
              <span className="material-symbols-outlined text-sm">cloud</span>
              <span>Precipitation Alert</span>
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid for Automations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {flows.length === 0 ? (
          <div className="md:col-span-12 p-12 rounded-2xl bg-surface-container-low text-center text-outline border border-outline-variant/10">
            <span className="material-symbols-outlined text-5xl mb-2">filter_alt_off</span>
            <p className="font-headline font-bold text-lg text-on-surface">
              No automations found in this category
            </p>
            <p className="text-xs text-outline mt-1">Create a new flow or adjust the filter above.</p>
          </div>
        ) : (
          flows.map((flow) => <FlowCard key={flow.id} flow={flow} />)
        )}

        {/* Realtime Grid Metrics */}
        <div className="md:col-span-12 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">
                Daily Savings
              </p>
              <p className="font-headline text-3xl font-bold text-on-surface">
                ${telemetry.dailySavings.toFixed(2)}
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">
                Carbon Offset
              </p>
              <p className="font-headline text-3xl font-bold text-on-surface">
                {telemetry.carbonOffsetKg} kg
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">
                Efficiency Score
              </p>
              <p className="font-headline text-3xl font-bold text-primary">
                {telemetry.efficiencyScore}/100
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">
                Grid Health
              </p>
              <p className="font-headline text-3xl font-bold text-on-surface">
                {telemetry.gridStatus.split(' ')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Compliance Note */}
      <section className="mt-12 flex flex-col items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-6" />
        <p className="font-label text-xs text-outline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">verified</span>
          <span>System algorithms dynamically synchronized with {settings.gridStandard}</span>
        </p>
      </section>
    </div>
  );
}

import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';
import UsagePulseChart from './UsagePulseChart.jsx';


export default function UsageView() {
  const { activeTimeframe, setActiveTimeframe, usageDatasets, showToast, telemetry } = useEcoSync();

  const currentDataset = usageDatasets[activeTimeframe] || usageDatasets['7d'];
  const maxEnergy = Math.max(...currentDataset.energy, 1);
  const maxWater = Math.max(...currentDataset.water, 1);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentDataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ecosync_telemetry_${activeTimeframe}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Data Exported', `Telemetry dataset for ${activeTimeframe.toUpperCase()} downloaded.`, 'download');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section: Dynamic Summary */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 p-8 rounded-2xl bg-surface-container-low flex flex-col justify-between relative overflow-hidden border border-outline-variant/10">
          <div className="relative z-10">
            <span className="font-label text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed/40 px-3 py-1 rounded-full">
              Weekly Insight
            </span>
            <h2 className="font-headline text-3xl md:text-4xl mt-4 font-bold leading-tight text-on-surface">
              Your efficiency rose by <span className="text-primary font-bold">12%</span> since last cycle.
            </h2>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 relative z-10">
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-outline">Avg. Daily Energy</p>
              <p className="font-headline text-2xl font-bold text-on-surface mt-0.5">{currentDataset.avgEnergy}</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-outline">Avg. Daily Water</p>
              <p className="font-headline text-2xl font-bold text-on-surface mt-0.5">{currentDataset.avgWater}</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-outline">Efficiency Score</p>
              <p className="font-headline text-2xl font-bold text-primary mt-0.5">{currentDataset.efficiency}</p>
            </div>
          </div>
          {/* Ambient Gradient Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-container/20 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        </div>

        <div className="md:col-span-4 p-8 rounded-2xl bg-primary text-on-primary flex flex-col justify-between shadow-xl shadow-primary/15 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <button
              onClick={handleExportData}
              title="Export Telemetry JSON"
              className="p-2 rounded-xl bg-on-primary/10 hover:bg-on-primary/20 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export</span>
            </button>
          </div>
          <div className="mt-8">
            <p className="font-headline text-4xl font-bold">-$42.00</p>
            <p className="font-label text-sm opacity-90 mt-1">Estimated Savings this month</p>
          </div>
        </div>
      </section>

      {/* Usage Trends: The "Pulse" Chart Area */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Usage Trends</h3>
            <p className="font-label text-xs text-outline mt-0.5">Resource consumption and comparative telemetry</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timeframe selector pills */}
            <div className="flex p-1 rounded-xl bg-surface-container-high text-xs font-semibold">
              {['24h', '7d', '30d', '1y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTimeframe === tf
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="hidden md:flex gap-4 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-on-surface-variant">Energy (kWh)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs font-medium text-on-surface-variant">Water (L)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm min-h-[340px] flex flex-col justify-between relative">
          <UsagePulseChart dataset={currentDataset} maxEnergy={maxEnergy} maxWater={maxWater} />
        </div>
      </section>

      {/* Top Consumers: Bento Grid Style */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-2xl font-bold text-on-surface">Top Consumers</h3>
          <span className="text-xs font-medium text-outline">Sorted by cumulative load</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Appliance 1: HVAC */}
          <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">ac_unit</span>
              </div>
              <span className="text-xs font-bold text-error bg-error-container/40 px-2 py-0.5 rounded-full">
                +4% vs LW
              </span>
            </div>
            <div className="mt-8">
              <h4 className="font-headline text-lg font-bold text-on-surface">HVAC System</h4>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline text-3xl font-bold text-on-surface">84.2</span>
                <span className="text-xs font-label text-outline uppercase font-semibold">kWh</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[75%]" />
              </div>
            </div>
          </div>

          {/* Appliance 2: Dishwasher */}
          <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">local_laundry_service</span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                -12% vs LW
              </span>
            </div>
            <div className="mt-8">
              <h4 className="font-headline text-lg font-bold text-on-surface">Eco Dishwasher</h4>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline text-3xl font-bold text-on-surface">156</span>
                <span className="text-xs font-label text-outline uppercase font-semibold">Liters</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-[45%]" />
              </div>
            </div>
          </div>

          {/* Appliance 3: EV Charger */}
          <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">ev_station</span>
              </div>
              <span className="text-xs font-bold text-outline bg-surface-container-highest px-2 py-0.5 rounded-full">
                Stable
              </span>
            </div>
            <div className="mt-8">
              <h4 className="font-headline text-lg font-bold text-on-surface">EV Fast Charger</h4>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-headline text-3xl font-bold text-on-surface">52.0</span>
                <span className="text-xs font-label text-outline uppercase font-semibold">kWh</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[50%]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * EcoSync — Usage History View Component
 * Renders weekly summary insights, interactive multi-period pulse chart (24H, 7D, 30D, 1Y),
 * top consumer breakdown cards, and smart tariff recommendations.
 */

import { store, usageDatasets } from '../../context/store.js';
import { showToast } from '../common/modals.js';

export function renderUsage() {
  const container = document.getElementById('view-usage');
  if (!container) return;

  const currentDataset = usageDatasets[store.activeTimeframe] || usageDatasets['7d'];
  const maxEnergy = Math.max(...currentDataset.energy, 1);
  const maxWater = Math.max(...currentDataset.water, 1);

  container.innerHTML = `
    <!-- Hero Section: Dynamic Summary -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-8 p-8 rounded-2xl bg-surface-container-low flex flex-col justify-between relative overflow-hidden">
        <div class="relative z-10">
          <span class="font-label text-xs font-bold tracking-widest text-primary uppercase bg-primary-fixed/40 px-3 py-1 rounded-full">Weekly Insight</span>
          <h2 class="font-headline text-3xl md:text-4xl mt-4 font-bold leading-tight text-on-surface">
            Your efficiency rose by <span class="text-primary font-bold">12%</span> since last cycle.
          </h2>
        </div>
        <div class="mt-8 flex gap-8 relative z-10">
          <div>
            <p class="font-label text-xs uppercase tracking-wider text-outline">Avg. Daily Energy</p>
            <p class="font-headline text-2xl font-bold text-on-surface mt-0.5">${currentDataset.avgEnergy}</p>
          </div>
          <div>
            <p class="font-label text-xs uppercase tracking-wider text-outline">Avg. Daily Water</p>
            <p class="font-headline text-2xl font-bold text-on-surface mt-0.5">${currentDataset.avgWater}</p>
          </div>
          <div>
            <p class="font-label text-xs uppercase tracking-wider text-outline">Efficiency Score</p>
            <p class="font-headline text-2xl font-bold text-primary mt-0.5">${currentDataset.efficiency}</p>
          </div>
        </div>
        <!-- Ambient Gradient Decor -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-container/20 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
      </div>

      <div class="md:col-span-4 p-8 rounded-2xl bg-primary text-on-primary flex flex-col justify-between shadow-xl shadow-primary/15 relative overflow-hidden group">
        <div class="flex justify-between items-start">
          <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">bolt</span>
          <span class="material-symbols-outlined opacity-60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
        </div>
        <div>
          <p class="font-headline text-4xl font-bold">-$42.00</p>
          <p class="font-label text-sm opacity-90 mt-1">Estimated Savings this month</p>
        </div>
      </div>
    </section>

    <!-- Usage Trends: The "Pulse" Chart Area -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 class="font-headline text-2xl font-bold text-on-surface">Usage Trends</h3>
          <p class="font-label text-xs text-outline mt-0.5">Resource consumption and comparative telemetry</p>
        </div>

        <div class="flex items-center gap-4">
          <!-- Timeframe selector pills -->
          <div class="flex p-1 rounded-xl bg-surface-container-high text-xs font-semibold">
            ${['24h', '7d', '30d', '1y']
              .map(
                (tf) => `
              <button class="timeframe-btn px-3 py-1.5 rounded-lg transition-all ${
                store.activeTimeframe === tf
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-outline hover:text-on-surface'
              }" data-timeframe="${tf}">${tf.toUpperCase()}</button>
            `
              )
              .join('')}
          </div>

          <!-- Legend -->
          <div class="hidden md:flex gap-4 items-center">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-full bg-primary"></div>
              <span class="text-xs font-medium text-on-surface-variant">Energy</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-full bg-secondary"></div>
              <span class="text-xs font-medium text-on-surface-variant">Water</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Container -->
      <div class="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm min-h-[340px] flex flex-col justify-between relative">
        <!-- Interactive Tooltip Banner -->
        <div id="chart-hover-info" class="flex items-center justify-between pb-4 border-b border-outline-variant/10 text-xs text-outline">
          <span class="font-medium">Hover over any bar to inspect granular metrics</span>
          <span class="font-headline font-bold text-on-surface">Total Period Cost: ${currentDataset.totalCost}</span>
        </div>

        <!-- Bars Visualizer -->
        <div class="flex-1 flex items-end gap-2 sm:gap-4 md:gap-6 pt-8 pb-2 px-2">
          ${renderChartBars(currentDataset, maxEnergy, maxWater)}
        </div>
      </div>
    </section>

    <!-- Top Consumers: Bento Grid Style -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="font-headline text-2xl font-bold text-on-surface">Top Consumers</h3>
        <span class="text-xs font-medium text-outline">Sorted by 7-day cumulative load</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Appliance 1: HVAC -->
        <div class="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">ac_unit</span>
            </div>
            <span class="text-xs font-bold text-error bg-error-container/40 px-2 py-0.5 rounded-full">+4% vs LW</span>
          </div>
          <div class="mt-8">
            <h4 class="font-headline text-lg font-bold text-on-surface">HVAC System</h4>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="font-headline text-3xl font-bold text-on-surface">84.2</span>
              <span class="text-xs font-label text-outline uppercase font-semibold">kWh</span>
            </div>
            <div class="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
              <div class="bg-primary h-full rounded-full w-[75%]"></div>
            </div>
          </div>
        </div>

        <!-- Appliance 2: Dishwasher -->
        <div class="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
              <span class="material-symbols-outlined text-secondary">local_laundry_service</span>
            </div>
            <span class="text-xs font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">-12% vs LW</span>
          </div>
          <div class="mt-8">
            <h4 class="font-headline text-lg font-bold text-on-surface">Dishwasher</h4>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="font-headline text-3xl font-bold text-on-surface">156</span>
              <span class="text-xs font-label text-outline uppercase font-semibold">Liters</span>
            </div>
            <div class="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
              <div class="bg-secondary h-full rounded-full w-[45%]"></div>
            </div>
          </div>
        </div>

        <!-- Appliance 3: EV Charger -->
        <div class="bg-surface-container p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container-high transition-all shadow-sm">
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">ev_station</span>
            </div>
            <span class="text-xs font-bold text-outline bg-surface-container-highest px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <div class="mt-8">
            <h4 class="font-headline text-lg font-bold text-on-surface">EV Charger</h4>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="font-headline text-3xl font-bold text-on-surface">52.0</span>
              <span class="text-xs font-label text-outline uppercase font-semibold">kWh</span>
            </div>
            <div class="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
              <div class="bg-primary h-full rounded-full w-[60%]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart Optimization Tip -->
    <section class="bg-secondary-fixed text-on-secondary-fixed p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center shadow-lg shadow-secondary/10">
      <div class="flex-shrink-0 w-14 h-14 bg-on-secondary-fixed/10 rounded-2xl flex items-center justify-center">
        <span class="material-symbols-outlined text-3xl text-secondary" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
      </div>
      <div class="flex-1">
        <h4 class="font-headline text-xl font-bold">Smart Optimization Tip</h4>
        <p class="mt-1 text-sm opacity-90 leading-relaxed">
          Your water heater and dishwasher draw peak power between 7:00 AM and 8:30 AM. Shifting heavy wash cycles to 11:00 PM off-peak tariff will save up to <span class="font-bold">$14.50/month</span>.
        </p>
      </div>
      <button id="automate-tip-btn" class="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-secondary/20 transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">auto_mode</span>
        <span>Automate Now</span>
      </button>
    </section>
  `;

  attachUsageListeners();
}

function renderChartBars(dataset, maxEnergy, maxWater) {
  return dataset.labels
    .map((label, index) => {
      const eVal = dataset.energy[index];
      const wVal = dataset.water[index];
      const eHeight = Math.max(12, Math.round((eVal / maxEnergy) * 100));
      const wHeight = Math.max(12, Math.round((wVal / maxWater) * 100));

      return `
      <div class="flex-1 flex flex-col items-center gap-3 h-64 justify-end group cursor-pointer chart-col" data-index="${index}" data-label="${label}" data-energy="${eVal}" data-water="${wVal}">
        <div class="w-full flex justify-center items-end gap-1.5 h-full">
          <!-- Energy Bar -->
          <div class="w-2.5 sm:w-4 md:w-5 bg-primary/25 rounded-t-full group-hover:bg-primary transition-all duration-300 chart-bar-energy" style="height: ${eHeight}%"></div>
          <!-- Water Bar -->
          <div class="w-2.5 sm:w-4 md:w-5 bg-secondary/25 rounded-t-full group-hover:bg-secondary transition-all duration-300 chart-bar-water" style="height: ${wHeight}%"></div>
        </div>
        <span class="text-[11px] font-bold text-outline group-hover:text-on-surface font-headline transition-colors">${label}</span>
      </div>
    `;
    })
    .join('');
}

function attachUsageListeners() {
  // Timeframe switch buttons
  document.querySelectorAll('.timeframe-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tf = e.target.getAttribute('data-timeframe');
      store.setTimeframe(tf);
    });
  });

  // Chart bar inspection
  const hoverInfo = document.getElementById('chart-hover-info');
  document.querySelectorAll('.chart-col').forEach((col) => {
    col.addEventListener('mouseenter', () => {
      const label = col.getAttribute('data-label');
      const energy = col.getAttribute('data-energy');
      const water = col.getAttribute('data-water');
      if (hoverInfo) {
        hoverInfo.innerHTML = `
          <div class="flex items-center gap-4">
            <span class="font-headline font-bold text-sm text-on-surface">${label}</span>
            <span class="inline-flex items-center gap-1 text-primary font-bold"><span class="w-2 h-2 rounded-full bg-primary"></span>${energy} kWh</span>
            <span class="inline-flex items-center gap-1 text-secondary font-bold"><span class="w-2 h-2 rounded-full bg-secondary"></span>${water} L</span>
          </div>
          <span class="text-outline font-medium text-xs">Hovering point</span>
        `;
      }
    });

    col.addEventListener('mouseleave', () => {
      const currentDataset = usageDatasets[store.activeTimeframe] || usageDatasets['7d'];
      if (hoverInfo) {
        hoverInfo.innerHTML = `
          <span class="font-medium">Hover over any bar to inspect granular metrics</span>
          <span class="font-headline font-bold text-on-surface">Total Period Cost: ${currentDataset.totalCost}</span>
        `;
      }
    });
  });

  // Automate Now button on tip
  const tipBtn = document.getElementById('automate-tip-btn');
  if (tipBtn) {
    tipBtn.addEventListener('click', () => {
      store.addAutomation({
        title: 'Dishwasher Off-Peak Delay',
        category: 'energy',
        type: 'energy',
        description: 'Delays dishwasher heating cycle until 11:00 PM off-peak tariff window.',
        trigger: 'Time == 11:00 PM',
        action: 'Start Dishwasher Eco Cycle',
        impact: '-$14.50/mo',
        devicesAffected: 1,
        icon: 'local_laundry_service'
      });
      showToast('Optimization Activated', 'Dishwasher Off-Peak Delay added to your active flows.', 'auto_mode');
    });
  }
}

/**
 * EcoSync — Dashboard View Component
 * Renders the Luminous Engine centerpiece dial, real-time appliance carousel,
 * peak saving bento insight, and water security card.
 */

import { store } from '../../context/store.js';
import { openModal, renderApplianceManagerModal, showToast } from '../common/modals.js';

export function renderDashboard() {
  const container = document.getElementById('view-dashboard');
  if (!container) return;

  const t = store.telemetry;
  const appliances = store.appliances;

  // Concentric dial calculation
  const maxEnergyKwh = 20.0;
  const maxWaterL = 400;
  const energyRatio = Math.min(1, Math.max(0.05, t.todayEnergyKwh / maxEnergyKwh));
  const waterRatio = Math.min(1, Math.max(0.05, t.todayWaterL / maxWaterL));
  
  // Circumference of r=45 is 2 * PI * 45 = 282.74
  const circumference = 282.74;
  const energyOffset = +(circumference * (1 - energyRatio)).toFixed(1);
  const waterOffset = +(circumference * (1 - waterRatio)).toFixed(1);

  const activeApplianceCount = appliances.filter((a) => a.enabled && (a.powerKw > 0 || a.waterFlowLpm > 0)).length;

  container.innerHTML = `
    <!-- Centerpiece: Luminous Engine Dial -->
    <section class="flex flex-col items-center">
      <div class="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        <!-- Ambient Shadow Glow -->
        <div class="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse-subtle"></div>
        <div class="absolute inset-4 rounded-full bg-secondary/10 blur-2xl animate-pulse-subtle" style="animation-delay: 2s;"></div>

        <!-- Outer Ring: Energy (primary) -->
        <svg class="absolute w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle class="text-surface-container transition-all" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" stroke-width="6"></circle>
          <circle id="energy-dial-ring" class="text-primary-container dial-ring" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${energyOffset}" stroke-linecap="round" stroke-width="6"></circle>
        </svg>

        <!-- Inner Ring: Water (secondary) -->
        <svg class="absolute w-3/4 h-3/4 -rotate-90 transform" viewBox="0 0 100 100">
          <circle class="text-surface-container-high transition-all" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" stroke-width="7"></circle>
          <circle id="water-dial-ring" class="text-secondary dial-ring" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${waterOffset}" stroke-linecap="round" stroke-width="7"></circle>
        </svg>

        <!-- Central Telemetry Content -->
        <div class="z-10 text-center select-none">
          <div class="flex items-center justify-center gap-1">
            <span id="dashboard-kwh-display" class="font-headline text-5xl md:text-6xl font-bold text-on-surface tracking-tight">${t.todayEnergyKwh.toFixed(1)}</span>
          </div>
          <div class="text-[11px] font-bold text-outline uppercase tracking-widest mt-1">kWh Today</div>
          <div class="mt-3 flex items-center justify-center gap-1.5 text-secondary font-semibold">
            <span class="material-symbols-outlined text-base">water_drop</span>
            <span id="dashboard-water-display" class="font-headline text-xl">${t.todayWaterL}L</span>
          </div>
          <div class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] text-on-surface-variant font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span>Live ${t.currentPowerKw} kW</span>
          </div>
        </div>
      </div>

      <!-- Stats Metadata Asymmetry -->
      <div class="grid grid-cols-2 gap-8 mt-10 w-full max-w-md">
        <div class="space-y-1">
          <span class="text-xs font-bold uppercase tracking-tight text-outline">Energy Efficiency</span>
          <div class="flex items-baseline gap-1">
            <span id="dashboard-efficiency-score" class="font-headline text-2xl font-bold text-primary">${t.energyEfficiencyPct}%</span>
            <span class="material-symbols-outlined text-primary text-sm">trending_up</span>
          </div>
        </div>
        <div class="space-y-1 text-right">
          <span class="text-xs font-bold uppercase tracking-tight text-outline">Resource Health</span>
          <div class="flex items-baseline justify-end gap-1">
            <span class="font-headline text-2xl font-bold text-on-surface">${t.resourceHealth}</span>
            <span class="material-symbols-outlined text-primary text-sm">verified</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Active Appliances Section -->
    <section class="space-y-6">
      <div class="flex items-end justify-between px-2">
        <div>
          <h2 class="font-headline text-2xl font-bold tracking-tight text-on-surface">Active Appliances</h2>
          <p class="text-xs text-outline">${activeApplianceCount} systems drawing power</p>
        </div>
        <button id="view-all-appliances-btn" class="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
          <span>View All</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <!-- Horizontal Scroll Cards -->
      <div class="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x">
        ${renderApplianceCards(appliances)}
      </div>
    </section>

    <!-- Bento Grid Insights -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Peak Saving Window -->
      <div class="md:col-span-2 p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm relative overflow-hidden group">
        <div class="relative z-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed text-xs font-bold mb-3">
            <span class="material-symbols-outlined text-sm">bolt</span>
            <span>OPPORTUNITY</span>
          </div>
          <h4 class="font-headline text-2xl font-bold text-on-surface">Peak Saving Window</h4>
          <p class="text-sm text-outline mt-2 max-w-sm leading-relaxed">Lower tariff rates available between 11:00 PM and 5:00 AM. Schedule your EV charge and heavy cycles now.</p>
          <button id="open-ev-scheduler-btn" class="mt-6 px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">schedule</span>
            <span>Schedule Now</span>
          </button>
        </div>
        <div class="absolute right-0 bottom-0 opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500 pointer-events-none">
          <span class="material-symbols-outlined text-[180px] translate-x-12 translate-y-12 text-primary">bolt</span>
        </div>
      </div>

      <!-- Water Leak Alert Card -->
      <div id="leak-alert-card" class="p-8 rounded-2xl bg-secondary text-on-secondary flex flex-col justify-between shadow-xl shadow-secondary/15 relative overflow-hidden cursor-pointer">
        <div>
          <div class="flex items-center justify-between">
            <span class="material-symbols-outlined text-3xl">water_drop</span>
            <span class="px-2.5 py-0.5 rounded-full bg-on-secondary/20 text-[10px] font-bold uppercase tracking-widest">Active</span>
          </div>
          <h4 class="font-headline text-xl font-bold mt-4">Water Leak Defense</h4>
          <p class="text-sm opacity-90 mt-2">Zero abnormal flow detected across 6 monitored home zones today.</p>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <div class="font-headline text-2xl font-bold">Secure</div>
          <button id="run-leak-scan-btn" class="text-xs underline font-medium hover:opacity-100 opacity-80">Scan Now</button>
        </div>
      </div>
    </section>
  `;

  attachDashboardListeners();
}

function renderApplianceCards(appliances) {
  return appliances
    .slice(0, 5)
    .map((app) => {
      const isWater = app.type === 'water';
      const drawLabel = isWater ? 'Water Flow' : 'Current Draw';
      const drawValue = isWater ? `${app.waterFlowLpm} L/m` : `${app.powerKw > 0 ? '+' : ''}${app.powerKw} kW`;
      const fillPct = isWater ? Math.min(100, (app.waterFlowLpm / 20) * 100) : Math.min(100, (Math.abs(app.powerKw) / 8.0) * 100);

      return `
      <div class="snap-start flex-shrink-0 w-64 p-6 rounded-xl bg-surface-container-low shadow-sm transition-all hover:bg-surface-container-high flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 rounded-lg ${isWater ? 'bg-secondary-container/15 text-secondary' : 'bg-primary-container/20 text-primary'}">
              <span class="material-symbols-outlined">${app.icon}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" ${app.enabled ? 'checked' : ''} class="sr-only peer dashboard-app-toggle" data-id="${app.id}">
              <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isWater ? 'peer-checked:bg-secondary' : 'peer-checked:bg-primary'}"></div>
            </label>
          </div>
          <h3 class="font-headline text-lg font-bold text-on-surface">${app.name}</h3>
        </div>
        <div class="mt-4 space-y-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-outline font-medium">${drawLabel}</span>
            <span class="font-headline font-bold text-on-surface">${drawValue}</span>
          </div>
          <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div class="${isWater ? 'bg-secondary' : 'bg-primary'} h-full transition-all duration-500" style="width: ${fillPct}%"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

function attachDashboardListeners() {
  // Appliance toggle switches
  document.querySelectorAll('.dashboard-app-toggle').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      store.toggleAppliance(id);
      const app = store.appliances.find((a) => a.id === id);
      if (app) {
        showToast(
          `${app.name} ${app.enabled ? 'Enabled' : 'Disabled'}`,
          `Live household draw updated to ${store.telemetry.currentPowerKw} kW.`,
          app.icon,
          app.type === 'water' ? 'secondary' : 'primary'
        );
      }
    });
  });

  // View All appliances button
  const viewAllBtn = document.getElementById('view-all-appliances-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      renderApplianceManagerModal();
      openModal('appliances-modal');
    });
  }

  // Open EV Scheduler modal button
  const scheduleBtn = document.getElementById('open-ev-scheduler-btn');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
      openModal('ev-schedule-modal');
    });
  }

  // Leak scan simulation
  const scanBtn = document.getElementById('run-leak-scan-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Acoustic Scan In Progress', 'Scanning whole-home water pressure transients...', 'water_drop', 'secondary');
      setTimeout(() => {
        showToast('Scan Verified: 100% Secure', 'No acoustic leaks detected. Main valve nominal.', 'verified', 'secondary');
      }, 1500);
    });
  }
}

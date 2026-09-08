/**
 * EcoSync — Automations View Component
 * Renders Luminous Engine active flows, category filters, interactive flow cards,
 * grid performance metrics, and trigger builders.
 */

import { store } from '../../context/store.js';
import { openModal, showToast } from '../common/modals.js';

export function renderAutomations() {
  const container = document.getElementById('view-automations');
  if (!container) return;

  const filter = store.activeAutomationFilter || 'all';
  const flows = store.automations.filter((flow) => {
    if (filter === 'all') return true;
    return flow.category === filter || flow.type === filter;
  });

  const activeFlowCount = store.automations.filter((a) => a.enabled).length;
  const t = store.telemetry;

  container.innerHTML = `
    <!-- Editorial Header Section -->
    <section class="mb-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="max-w-xl">
          <span class="inline-block px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-label text-xs font-bold mb-4">
            OPTIMIZED ENGINE
          </span>
          <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">Automations</h2>
          <p class="text-on-surface-variant text-base md:text-lg leading-relaxed">
            The Luminous Engine is currently orchestrating <span class="font-bold text-primary">${activeFlowCount} active flows</span> to minimize utility expense and grid carbon intensity.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter buttons -->
          <div class="flex p-1 rounded-xl bg-surface-container-high text-xs font-semibold">
            ${['all', 'energy', 'water', 'ev', 'climate']
              .map(
                (f) => `
              <button class="flow-filter-btn px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-outline hover:text-on-surface'
              }" data-filter="${f}">${f}</button>
            `
              )
              .join('')}
          </div>

          <button id="trigger-new-flow-btn" class="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary-container/25 transition-all">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>New Flow</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Asymmetric Bento Grid for Automations -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      ${renderFlowCards(flows)}

      <!-- Full Width Content / Realtime Grid Metrics -->
      <div class="md:col-span-12 py-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-6 bg-surface-container-low rounded-2xl">
            <p class="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">Daily Savings</p>
            <p class="font-headline text-3xl font-bold text-on-surface">$${t.dailySavings.toFixed(2)}</p>
          </div>
          <div class="p-6 bg-surface-container-low rounded-2xl">
            <p class="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">Carbon Offset</p>
            <p class="font-headline text-3xl font-bold text-on-surface">${t.carbonOffsetKg} kg</p>
          </div>
          <div class="p-6 bg-surface-container-low rounded-2xl">
            <p class="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">Efficiency Score</p>
            <p class="font-headline text-3xl font-bold text-primary">${t.efficiencyScore}/100</p>
          </div>
          <div class="p-6 bg-surface-container-low rounded-2xl">
            <p class="font-label text-xs uppercase tracking-wider text-outline mb-1.5 font-semibold">Grid Health</p>
            <p class="font-headline text-3xl font-bold text-on-surface">${t.gridStatus.split(' ')[0]}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Visual Compliance Note -->
    <section class="mt-12 flex flex-col items-center">
      <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-6"></div>
      <p class="font-label text-xs text-outline flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-base">verified</span>
        <span>System algorithms dynamically synchronized with ${store.settings.gridStandard}</span>
      </p>
    </section>
  `;

  attachAutomationListeners();
}

function renderFlowCards(flows) {
  if (flows.length === 0) {
    return `
      <div class="md:col-span-12 p-12 rounded-2xl bg-surface-container-low text-center text-outline">
        <span class="material-symbols-outlined text-5xl mb-2">filter_alt_off</span>
        <p class="font-headline font-bold text-lg text-on-surface">No automations found in this category</p>
        <p class="text-xs text-outline mt-1">Create a new flow or adjust the filter above.</p>
      </div>
    `;
  }

  return flows
    .map((flow) => {
      const isWater = flow.category === 'water' || flow.type === 'water';
      const isEv = flow.category === 'ev' || flow.type === 'ev';
      const isFeatured = flow.featured;
      const colSpan = isFeatured ? 'md:col-span-8' : isEv ? 'md:col-span-12' : 'md:col-span-4';

      if (isEv) {
        return `
        <div class="md:col-span-12 bg-inverse-surface rounded-2xl p-8 editorial-shadow relative overflow-hidden text-inverse-on-surface">
          <div class="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-on-primary text-3xl">ev_station</span>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="font-headline text-2xl font-bold tracking-tight">${flow.title}</h3>
                  <span class="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container text-[11px] font-bold uppercase">${flow.impact}</span>
                </div>
                <p class="text-surface-variant text-sm max-w-xl mt-1 leading-relaxed">${flow.description}</p>
              </div>
            </div>

            <div class="flex items-center justify-between w-full md:w-auto gap-8 pt-4 md:pt-0 border-t md:border-0 border-outline-variant/20">
              <div class="text-left md:text-right">
                <p class="text-surface-variant text-[10px] uppercase tracking-widest">Target Departure</p>
                <p class="font-headline text-lg font-bold">${store.settings.evDepartureTime} (${store.settings.evTargetSoc}%)</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${flow.enabled ? 'checked' : ''} class="sr-only peer flow-toggle-switch" data-id="${flow.id}">
                <div class="w-14 h-8 bg-surface-variant/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </div>
        </div>
      `;
      }

      return `
      <div class="${colSpan} bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col justify-between min-h-[290px] relative overflow-hidden group border border-outline-variant/10">
        <div class="relative z-10 flex justify-between items-start">
          <div>
            <div class="w-12 h-12 rounded-xl ${isWater ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} flex items-center justify-center mb-4">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">${flow.icon}</span>
            </div>
            <h3 class="font-headline ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold tracking-tight text-on-surface">${flow.title}</h3>
            <p class="text-on-surface-variant text-sm mt-2 leading-relaxed max-w-md">${flow.description}</p>
          </div>

          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" ${flow.enabled ? 'checked' : ''} class="sr-only peer flow-toggle-switch" data-id="${flow.id}">
            <div class="w-14 h-8 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${isWater ? 'peer-checked:bg-secondary' : 'peer-checked:bg-primary'}"></div>
          </label>
        </div>

        <div class="relative z-10 mt-8 pt-4 border-t border-outline-variant/10 flex items-center justify-between text-xs text-outline">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">tune</span>
            <span class="font-medium">${flow.trigger}</span>
          </div>
          <span class="font-headline font-bold text-sm ${isWater ? 'text-secondary' : 'text-primary'}">${flow.impact}</span>
        </div>
      </div>
    `;
    })
    .join('');
}

function attachAutomationListeners() {
  // Category filter pills
  document.querySelectorAll('.flow-filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const f = e.target.getAttribute('data-filter');
      store.setAutomationFilter(f);
    });
  });

  // Flow toggle switches
  document.querySelectorAll('.flow-toggle-switch').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      store.toggleAutomation(id);
      const flow = store.automations.find((a) => a.id === id);
      if (flow) {
        showToast(
          `${flow.title} ${flow.enabled ? 'Armed' : 'Disarmed'}`,
          `Luminous Engine re-calculated active load profiles.`,
          flow.icon,
          flow.type === 'water' ? 'secondary' : 'primary'
        );
      }
    });
  });

  // New flow trigger button
  const newFlowBtn = document.getElementById('trigger-new-flow-btn');
  if (newFlowBtn) {
    newFlowBtn.addEventListener('click', () => {
      openModal('new-flow-modal');
    });
  }
}

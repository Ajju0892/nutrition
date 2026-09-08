/**
 * EcoSync — Settings & Hardware Gateway View Component
 * Provides comprehensive configuration for grid tariffs, connected sensors,
 * AI optimization sensitivity, and system preferences.
 */

import { store } from '../../context/store.js';
import { showToast } from '../common/modals.js';

export function renderSettings() {
  const container = document.getElementById('view-settings');
  if (!container) return;

  const s = store.settings;

  container.innerHTML = `
    <!-- Editorial Header Section -->
    <section class="mb-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label text-xs font-bold mb-4">
            SYSTEM ARCHITECTURE
          </span>
          <h2 class="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">Settings & Gateways</h2>
          <p class="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-xl">
            Configure utility pricing tariffs, monitor connected hardware gateways, and fine-tune the Luminous AI optimization parameters.
          </p>
        </div>

        <button id="save-settings-btn" class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary-container/20 transition-all self-start md:self-auto">
          <span class="material-symbols-outlined text-sm">save</span>
          <span>Save Changes</span>
        </button>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- Section 1: Utility Pricing & Grid Standards -->
      <div class="md:col-span-7 space-y-6">
        <div class="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 class="font-headline text-xl font-bold text-on-surface">Utility & Tariff Profile</h3>
              <p class="text-xs text-outline">Dynamic time-of-use energy rates</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-2">Regional Grid Standard</label>
              <select id="grid-standard-select" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary">
                <option value="Northern European (Nordic Power Pool)" ${s.gridStandard.includes('Nordic') ? 'selected' : ''}>Northern European (Nordic Power Pool - ENTSO-E)</option>
                <option value="North American (CAISO / ERCOT / PJM)" ${s.gridStandard.includes('CAISO') ? 'selected' : ''}>North American (CAISO / ERCOT / PJM Intertie)</option>
                <option value="UK National Grid (Half-Hourly)" ${s.gridStandard.includes('UK') ? 'selected' : ''}>UK National Grid (Half-Hourly Settlement)</option>
                <option value="Custom Time-of-Use Rate" ${s.gridStandard.includes('Custom') ? 'selected' : ''}>Custom Time-of-Use Rate</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-2">Peak Rate ($/kWh)</label>
                <input id="peak-rate-input" type="number" step="0.01" value="${s.peakRate}" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-outline mb-2">Off-Peak Rate ($/kWh)</label>
                <input id="offpeak-rate-input" type="number" step="0.01" value="${s.offPeakRate}" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: AI Sensitivity & Autonomous Actions -->
        <div class="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <h3 class="font-headline text-xl font-bold text-on-surface">Luminous AI Engine Parameters</h3>
              <p class="text-xs text-outline">Autonomous load-shedding and resource balancing</p>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-outline mb-2">
                <span>Optimization Sensitivity</span>
                <span id="ai-sensitivity-label" class="text-primary font-bold">${s.aiSensitivity}</span>
              </div>
              <input id="ai-sensitivity-range" type="range" min="1" max="3" value="2" class="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary">
              <div class="flex justify-between text-[11px] text-outline mt-2">
                <span>Eco (Max Savings)</span>
                <span>Optimal (Balanced)</span>
                <span>Comfort First</span>
              </div>
            </div>

            <div class="pt-4 border-t border-outline-variant/10 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-headline font-bold text-sm text-on-surface">Acoustic Leak Auto-Shutoff</h4>
                  <p class="text-xs text-outline mt-0.5">Closes motorized main line if continuous flow exceeds 45 mins.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="leak-shutoff-toggle" type="checkbox" ${s.autoLeakShutoff ? 'checked' : ''} class="sr-only peer">
                  <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-headline font-bold text-sm text-on-surface">Push Alerts for Grid Surges</h4>
                  <p class="text-xs text-outline mt-0.5">Receive immediate notifications when regional carbon intensity spikes.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="push-notif-toggle" type="checkbox" ${s.pushNotifications ? 'checked' : ''} class="sr-only peer">
                  <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Connected Gateways & Sensor Telemetry -->
      <div class="md:col-span-5 space-y-6">
        <div class="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center">
                <span class="material-symbols-outlined">router</span>
              </div>
              <div>
                <h3 class="font-headline text-xl font-bold text-on-surface">Hardware Gateways</h3>
                <p class="text-xs text-outline">4 Active local sensors</p>
              </div>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
          </div>

          <div class="space-y-3">
            ${s.gateways
              .map(
                (g) => `
              <div class="p-4 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all">
                <div>
                  <h4 class="font-headline font-bold text-sm text-on-surface">${g.name}</h4>
                  <p class="text-[11px] text-outline font-label mt-0.5">${g.ip || g.sampleRate || g.generation || g.battery + ' Battery'}</p>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold uppercase tracking-wider">${g.status}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Section 4: Data Export & Reset -->
        <div class="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm space-y-4">
          <h3 class="font-headline text-lg font-bold text-on-surface">Data Management</h3>
          <p class="text-xs text-outline leading-relaxed">
            Download your high-resolution telemetry time-series dataset or restore factory baseline presets.
          </p>
          <div class="flex flex-col gap-2.5 pt-2">
            <button id="export-json-btn" class="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs flex items-center justify-center gap-2 transition-all">
              <span class="material-symbols-outlined text-sm">download</span>
              <span>Export Telemetry (JSON)</span>
            </button>
            <button id="reset-defaults-btn" class="w-full py-2.5 px-4 rounded-xl text-error bg-error-container/30 hover:bg-error-container/60 font-semibold text-xs flex items-center justify-center gap-2 transition-all">
              <span class="material-symbols-outlined text-sm">restart_alt</span>
              <span>Reset Simulation Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  attachSettingsListeners();
}

function attachSettingsListeners() {
  // AI sensitivity range
  const rangeInput = document.getElementById('ai-sensitivity-range');
  const label = document.getElementById('ai-sensitivity-label');
  if (rangeInput && label) {
    const labels = {
      '1': 'Eco (Max Savings)',
      '2': 'Optimal (Balanced)',
      '3': 'Comfort First'
    };
    rangeInput.addEventListener('input', (e) => {
      label.textContent = labels[e.target.value] || 'Optimal (Balanced)';
    });
  }

  // Save Settings button
  const saveBtn = document.getElementById('save-settings-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const gridStandard = document.getElementById('grid-standard-select').value;
      const peakRate = parseFloat(document.getElementById('peak-rate-input').value) || 0.38;
      const offPeakRate = parseFloat(document.getElementById('offpeak-rate-input').value) || 0.14;
      const autoLeak = document.getElementById('leak-shutoff-toggle').checked;
      const pushNotif = document.getElementById('push-notif-toggle').checked;
      const sensitivity = label ? label.textContent : 'Optimal (Balanced)';

      store.updateSettings({
        gridStandard,
        peakRate,
        offPeakRate,
        autoLeakShutoff: autoLeak,
        pushNotifications: pushNotif,
        aiSensitivity: sensitivity
      });

      showToast('Settings Saved', 'Grid parameters and AI sensitivity updated.', 'check_circle');
    });
  }

  // Export JSON
  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ecosync_telemetry_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Telemetry Exported', 'Dataset downloaded successfully.', 'file_download');
    });
  }

  // Reset defaults
  const resetBtn = document.getElementById('reset-defaults-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all simulation parameters and custom flows to factory defaults?')) {
        localStorage.removeItem('ecosync_state_v1');
        location.reload();
      }
    });
  }
}

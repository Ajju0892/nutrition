import React, { useState } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function SettingsView() {
  const { settings, updateSettings, showToast } = useEcoSync();

  const [formState, setFormState] = useState({
    gridStandard: settings.gridStandard,
    peakRate: settings.peakRate,
    offPeakRate: settings.offPeakRate,
    aiSensitivity: settings.aiSensitivity,
    autoLeakShutoff: settings.autoLeakShutoff,
    pushNotifications: settings.pushNotifications,
    evTargetSoc: settings.evTargetSoc || 85,
    evDepartureTime: settings.evDepartureTime || '07:00',
    evChargingMode: settings.evChargingMode || 'Off-Peak Smart Charge'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...formState,
      peakRate: parseFloat(formState.peakRate),
      offPeakRate: parseFloat(formState.offPeakRate),
      evTargetSoc: parseInt(formState.evTargetSoc, 10)
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all grid tariffs and engine settings to factory defaults?')) {
      updateSettings({
        gridStandard: 'Northern European (Nordic Power Pool)',
        peakRate: 0.38,
        offPeakRate: 0.14,
        aiSensitivity: 'Optimal (Balanced)',
        autoLeakShutoff: true,
        pushNotifications: true,
        evTargetSoc: 85,
        evDepartureTime: '07:00',
        evChargingMode: 'Off-Peak Smart Charge'
      });
      setFormState({
        gridStandard: 'Northern European (Nordic Power Pool)',
        peakRate: 0.38,
        offPeakRate: 0.14,
        aiSensitivity: 'Optimal (Balanced)',
        autoLeakShutoff: true,
        pushNotifications: true,
        evTargetSoc: 85,
        evDepartureTime: '07:00',
        evChargingMode: 'Off-Peak Smart Charge'
      });
      showToast('Settings Reset', 'Configuration reverted to factory defaults.', 'restart_alt');
    }
  };

  const getSensitivityValue = (label) => {
    if (label.includes('Eco')) return 1;
    if (label.includes('Comfort')) return 3;
    return 2;
  };

  const getSensitivityLabel = (val) => {
    if (+val === 1) return 'Eco (Max Savings)';
    if (+val === 3) return 'Comfort First';
    return 'Optimal (Balanced)';
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label text-xs font-bold mb-4">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
              Settings & Gateways
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-xl">
              Configure utility pricing tariffs, monitor connected hardware gateways, and fine-tune
              the Luminous AI optimization parameters.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-3 rounded-xl border border-outline-variant/30 text-outline hover:text-on-surface hover:bg-surface-container font-semibold text-sm transition-all"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary-container/20 transition-all"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Section 1: Utility Pricing & Grid Standards */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Utility & Tariff Profile
                </h3>
                <p className="text-xs text-outline">Dynamic time-of-use energy rates</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                  Regional Grid Standard
                </label>
                <select
                  value={formState.gridStandard}
                  onChange={(e) => setFormState({ ...formState, gridStandard: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Northern European (Nordic Power Pool)">
                    Northern European (Nordic Power Pool - ENTSO-E)
                  </option>
                  <option value="North American (CAISO / ERCOT / PJM)">
                    North American (CAISO / ERCOT / PJM Intertie)
                  </option>
                  <option value="UK National Grid (Half-Hourly)">
                    UK National Grid (Half-Hourly Settlement)
                  </option>
                  <option value="Custom Time-of-Use Rate">Custom Time-of-Use Rate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                    Peak Rate ($/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.peakRate}
                    onChange={(e) => setFormState({ ...formState, peakRate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                    Off-Peak Rate ($/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.offPeakRate}
                    onChange={(e) => setFormState({ ...formState, offPeakRate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Sensitivity & Autonomous Actions */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Luminous AI Engine Parameters
                </h3>
                <p className="text-xs text-outline">Autonomous load-shedding and resource balancing</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-outline mb-2">
                  <span>Optimization Sensitivity</span>
                  <span className="text-primary font-bold">{formState.aiSensitivity}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={getSensitivityValue(formState.aiSensitivity)}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      aiSensitivity: getSensitivityLabel(e.target.value)
                    })
                  }
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-outline mt-2 font-medium">
                  <span>Eco (Max Savings)</span>
                  <span>Optimal (Balanced)</span>
                  <span>Comfort First</span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface">
                      Acoustic Leak Auto-Shutoff
                    </h4>
                    <p className="text-xs text-outline mt-0.5">
                      Closes motorized main line if continuous flow exceeds 45 mins.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.autoLeakShutoff}
                      onChange={(e) =>
                        setFormState({ ...formState, autoLeakShutoff: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface">
                      Push Alerts for Grid Surges
                    </h4>
                    <p className="text-xs text-outline mt-0.5">
                      Receive immediate notifications when regional carbon intensity spikes.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.pushNotifications}
                      onChange={(e) =>
                        setFormState({ ...formState, pushNotifications: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: EV Smart Charging & Departure Setup */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined">ev_station</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  EV Smart Charging & Departure Setup
                </h3>
                <p className="text-xs text-outline">Target SoC, departure time & off-peak tariff dispatch</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-outline mb-2">
                  <span>Target Battery State of Charge (SoC)</span>
                  <span className="text-primary font-headline text-base font-bold">{formState.evTargetSoc}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={formState.evTargetSoc}
                  onChange={(e) => setFormState({ ...formState, evTargetSoc: e.target.value })}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-outline mt-1.5 font-medium">
                  <span>50% (Daily)</span>
                  <span>80% (Health Optimal)</span>
                  <span>100% (Long Distance)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                    Ready by Departure Time
                  </label>
                  <input
                    type="time"
                    value={formState.evDepartureTime}
                    onChange={(e) => setFormState({ ...formState, evDepartureTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">
                    Dispatch Strategy
                  </label>
                  <select
                    value={formState.evChargingMode}
                    onChange={(e) => setFormState({ ...formState, evChargingMode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Off-Peak Smart Charge">Off-Peak Tariff Priority ($0.14/kWh)</option>
                    <option value="Solar Surplus Only">100% Rooftop Solar Surplus</option>
                    <option value="Immediate Fast Charge">Immediate Grid Fast Charge (Max Power)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Connected Gateways & Sensor Telemetry */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">router</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Hardware Gateways</h3>
                  <p className="text-xs text-outline">4 Active local sensors</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            </div>

            <div className="space-y-3">
              {settings.gateways.map((g) => (
                <div
                  key={g.name}
                  className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all"
                >
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface">{g.name}</h4>
                    <p className="text-[11px] text-outline font-label mt-0.5">
                      {g.ip || g.sampleRate || g.generation || (g.battery ? g.battery + ' Battery' : 'Connected')}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Diagnostics Box */}
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
            <h4 className="font-headline font-bold text-lg text-on-surface mb-2">Engine Health</h4>
            <p className="text-xs text-outline leading-relaxed mb-4">
              Continuous self-test active. Memory consumption: 14MB, WebSocket latency: 12ms.
            </p>
            <div className="p-3 rounded-xl bg-primary-fixed/20 text-on-primary-fixed text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
              <span>All 6 sub-meters reporting normal parameters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

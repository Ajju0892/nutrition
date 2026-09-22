import React, { useState } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function ApplianceManagerModal() {
  const { activeModal, setActiveModal, appliances, toggleAppliance, setAppliancePower } = useEcoSync();
  const [filter, setFilter] = useState('all');

  const isOpen = activeModal === 'appliance_manager';
  if (!isOpen) return null;

  const filtered = appliances.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'energy') return a.type === 'energy';
    if (filter === 'water') return a.type === 'water';
    if (filter === 'active') return a.enabled;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 glass-modal-bg flex items-center justify-center p-4"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl border border-outline-variant/20 flex flex-col justify-between animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">devices</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Whole-Home Appliance Manager
                </h3>
                <p className="text-xs text-outline">Direct power relays & circuit breakers</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex p-1 rounded-xl bg-surface-container-high text-xs font-semibold w-fit mb-4">
            {['all', 'energy', 'water', 'active'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filter === f
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List of Appliances */}
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            {filtered.map((app) => {
              const isWater = app.type === 'water';
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-outline-variant/10 hover:bg-surface-container transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${
                        isWater ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      } flex items-center justify-center shrink-0`}
                    >
                      <span className="material-symbols-outlined">{app.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">{app.name}</h4>
                      <p className="text-xs text-outline">{app.room}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="font-headline font-bold text-sm text-on-surface">
                        {isWater
                          ? `${app.waterFlowLpm} L/min`
                          : `${app.powerKw > 0 ? '+' : ''}${app.powerKw} kW`}
                      </p>
                      <p className="text-[10px] text-outline uppercase font-semibold">
                        {app.changeVsLw} vs last wk
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={app.enabled}
                        onChange={() => toggleAppliance(app.id)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          isWater ? 'peer-checked:bg-secondary' : 'peer-checked:bg-primary'
                        }`}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15 mt-4">
          <span className="text-xs text-outline">{appliances.length} smart devices online</span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-container/20 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

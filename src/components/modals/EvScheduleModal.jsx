import React, { useState } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function EvScheduleModal() {
  const { activeModal, setActiveModal, settings, updateSettings, showToast } = useEcoSync();

  const [targetSoc, setTargetSoc] = useState(settings.evTargetSoc || 85);
  const [departureTime, setDepartureTime] = useState(settings.evDepartureTime || '07:00');

  const isOpen = activeModal === 'ev_schedule';
  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      evTargetSoc: +targetSoc,
      evDepartureTime: departureTime
    });
    setActiveModal(null);
    showToast(
      'EV Schedule Locked',
      `Target ${targetSoc}% by ${departureTime}. Off-peak tariff active.`,
      'ev_station',
      'secondary'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 glass-modal-bg flex items-center justify-center p-4"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl border border-outline-variant/20 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">ev_station</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">EV Smart Charging</h3>
              <p className="text-xs text-outline">Off-peak tariff scheduler</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Target Battery Level */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wider text-outline">
              <span>Target Battery SoC</span>
              <span className="text-primary font-headline text-lg font-bold">{targetSoc}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={targetSoc}
              onChange={(e) => setTargetSoc(e.target.value)}
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-outline mt-1 font-medium">
              <span>50% (Commute)</span>
              <span>80% (Battery Health)</span>
              <span>100% (Trip)</span>
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Ready by Departure Time
            </label>
            <input
              type="time"
              required
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low text-base font-headline font-bold text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Rate Window Summary */}
          <div className="p-4 rounded-xl bg-surface-container-low text-xs space-y-1.5 border border-outline-variant/10">
            <div className="flex justify-between">
              <span className="text-outline">Optimized Charging Window:</span>
              <span className="font-bold text-primary">12:30 AM – 4:45 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Off-Peak Rate:</span>
              <span className="font-bold text-on-surface">${settings.offPeakRate}/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Est. Cost Savings:</span>
              <span className="font-bold text-primary">-$18.40 / session</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-outline hover:text-on-surface text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-container/20 transition-all"
            >
              Lock Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

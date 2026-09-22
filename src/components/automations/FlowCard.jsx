import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function FlowCard({ flow }) {
  const { toggleAutomation, deleteAutomation, settings } = useEcoSync();

  const isWater = flow.category === 'water' || flow.type === 'water';
  const isEv = flow.category === 'ev' || flow.type === 'ev';
  const isFeatured = flow.featured;
  const colSpan = isFeatured ? 'md:col-span-8' : isEv ? 'md:col-span-12' : 'md:col-span-4';

  if (isEv) {
    return (
      <div className="md:col-span-12 bg-inverse-surface rounded-2xl p-8 editorial-shadow relative overflow-hidden text-inverse-on-surface">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-3xl">ev_station</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-headline text-2xl font-bold tracking-tight">{flow.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container text-[11px] font-bold uppercase">
                  {flow.impact}
                </span>
              </div>
              <p className="text-surface-variant text-sm max-w-xl mt-1 leading-relaxed">
                {flow.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-8 pt-4 md:pt-0 border-t md:border-0 border-outline-variant/20">
            <div className="text-left md:text-right">
              <p className="text-surface-variant text-[10px] uppercase tracking-widest">
                Target Departure
              </p>
              <p className="font-headline text-lg font-bold">
                {settings.evDepartureTime} ({settings.evTargetSoc}%)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={flow.enabled}
                onChange={() => toggleAutomation(flow.id)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-surface-variant/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${colSpan} bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col justify-between min-h-[290px] relative overflow-hidden group border border-outline-variant/10`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div
            className={`w-12 h-12 rounded-xl ${
              isWater ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
            } flex items-center justify-center mb-4`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {flow.icon}
            </span>
          </div>
          <h3
            className={`font-headline ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
            } font-bold tracking-tight text-on-surface`}
          >
            {flow.title}
          </h3>
          <p className="text-on-surface-variant text-sm mt-2 leading-relaxed max-w-md">
            {flow.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!flow.featured && (
            <button
              onClick={() => deleteAutomation(flow.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-all"
              title="Delete Automation"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          )}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={flow.enabled}
              onChange={() => toggleAutomation(flow.id)}
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

      <div className="relative z-10 mt-6 pt-6 border-t border-outline-variant/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-outline font-medium">Est. Impact:</span>
          <span className={`font-bold ${isWater ? 'text-secondary' : 'text-primary'}`}>
            {flow.impact}
          </span>
        </div>
        <div className="flex items-center gap-1 text-outline">
          <span className="material-symbols-outlined text-sm">devices</span>
          <span>{flow.devicesAffected} Devices</span>
        </div>
      </div>
    </div>
  );
}

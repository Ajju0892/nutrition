import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function FlowCard({ flow }) {
  const { toggleAutomation, triggerAutomationNow, deleteAutomation, settings } = useEcoSync();

  const isWater = flow.category === 'water' || flow.type === 'water';
  const isEv = flow.category === 'ev' || flow.type === 'ev';
  const isFeatured = flow.featured;
  const colSpan = isFeatured ? 'md:col-span-8' : isEv ? 'md:col-span-12' : 'md:col-span-4';

  if (isEv) {
    return (
      <div className="md:col-span-12 bg-inverse-surface rounded-2xl p-8 editorial-shadow relative overflow-hidden text-inverse-on-surface">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary text-3xl">ev_station</span>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-headline text-2xl font-bold tracking-tight">{flow.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container text-[11px] font-bold uppercase">
                  {flow.impact}
                </span>
                {flow.lastTriggered && (
                  <span className="text-[11px] text-surface-variant/70 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {flow.lastTriggered}
                  </span>
                )}
              </div>
              <p className="text-surface-variant text-sm max-w-xl mt-1 leading-relaxed">
                {flow.description}
              </p>
              {flow.trigger && (
                <div className="mt-3 flex items-center gap-2 text-xs text-primary-container bg-primary-container/10 px-3 py-1.5 rounded-xl border border-primary-container/20 w-fit">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span><strong>Trigger:</strong> {flow.trigger}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-6 pt-4 md:pt-0 border-t md:border-0 border-outline-variant/20">
            <div className="text-left md:text-right">
              <p className="text-surface-variant text-[10px] uppercase tracking-widest font-semibold">
                Target Departure
              </p>
              <p className="font-headline text-lg font-bold">
                {settings.evDepartureTime} ({settings.evTargetSoc}%)
              </p>
            </div>
            <button
              onClick={() => triggerAutomationNow(flow.id)}
              className="px-3.5 py-2 bg-primary-container/20 hover:bg-primary-container/30 text-primary-container rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Test trigger condition immediately"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              <span>Test Rule</span>
            </button>
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
      className={`${colSpan} bg-surface-container-lowest rounded-2xl p-7 editorial-shadow flex flex-col justify-between min-h-[300px] relative overflow-hidden group border border-outline-variant/10 hover:border-outline-variant/30 transition-all`}
    >
      <div className="relative z-10 flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl ${
                isWater ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
              } flex items-center justify-center`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {flow.icon}
              </span>
            </div>
            {flow.lastTriggered && (
              <span className="text-[11px] text-outline font-medium flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-xs">history</span>
                {flow.lastTriggered}
              </span>
            )}
          </div>

          <h3
            className={`font-headline ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
            } font-bold tracking-tight text-on-surface`}
          >
            {flow.title}
          </h3>
          <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed max-w-md">
            {flow.description}
          </p>

          {/* Trigger Rule Banner */}
          {flow.trigger && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1 border border-outline-variant/10">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-sm text-primary">sensors</span>
                <span className="font-bold text-on-surface">If:</span>
                <span className="truncate">{flow.trigger}</span>
              </div>
              {flow.action && (
                <div className="flex items-center gap-1.5 text-outline">
                  <span className="material-symbols-outlined text-sm text-secondary">tune</span>
                  <span className="font-bold text-on-surface">Then:</span>
                  <span className="truncate">{flow.action}</span>
                </div>
              )}
            </div>
          )}
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

      <div className="relative z-10 mt-5 pt-4 border-t border-outline-variant/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-outline font-medium">Est. Impact:</span>
          <span className={`font-bold ${isWater ? 'text-secondary' : 'text-primary'}`}>
            {flow.impact}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerAutomationNow(flow.id)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-semibold flex items-center gap-1 transition-all"
            title="Manually trigger test of this rule"
          >
            <span className="material-symbols-outlined text-xs">play_arrow</span>
            <span>Test</span>
          </button>

          <div className="flex items-center gap-1 text-outline">
            <span className="material-symbols-outlined text-sm">devices</span>
            <span>{flow.devicesAffected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


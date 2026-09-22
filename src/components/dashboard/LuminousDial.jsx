import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function LuminousDial() {
  const { telemetry } = useEcoSync();

  const maxEnergyKwh = 20.0;
  const maxWaterL = 400;

  const energyRatio = Math.min(1, Math.max(0.05, telemetry.todayEnergyKwh / maxEnergyKwh));
  const waterRatio = Math.min(1, Math.max(0.05, telemetry.todayWaterL / maxWaterL));

  const circumference = 282.74; // 2 * PI * 45
  const energyOffset = +(circumference * (1 - energyRatio)).toFixed(1);
  const waterOffset = +(circumference * (1 - waterRatio)).toFixed(1);

  return (
    <section className="flex flex-col items-center">
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse-subtle pointer-events-none" />
        <div
          className="absolute inset-4 rounded-full bg-secondary/10 blur-2xl animate-pulse-subtle pointer-events-none"
          style={{ animationDelay: '2s' }}
        />

        {/* Outer Ring: Energy (primary) */}
        <svg className="absolute w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="text-surface-container transition-all"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
          />
          <circle
            id="energy-dial-ring"
            className="text-primary-container dial-ring"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={energyOffset}
            strokeLinecap="round"
            strokeWidth="6"
          />
        </svg>

        {/* Inner Ring: Water (secondary) */}
        <svg className="absolute w-3/4 h-3/4 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="text-surface-container-high transition-all"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeWidth="7"
          />
          <circle
            id="water-dial-ring"
            className="text-secondary dial-ring"
            cx="50"
            cy="50"
            fill="transparent"
            r="45"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={waterOffset}
            strokeLinecap="round"
            strokeWidth="7"
          />
        </svg>

        {/* Central Telemetry Content */}
        <div className="z-10 text-center select-none">
          <div className="flex items-center justify-center gap-1">
            <span className="font-headline text-5xl md:text-6xl font-bold text-on-surface tracking-tight">
              {telemetry.todayEnergyKwh.toFixed(1)}
            </span>
          </div>
          <div className="text-[11px] font-bold text-outline uppercase tracking-widest mt-1">
            kWh Today
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-secondary font-semibold">
            <span className="material-symbols-outlined text-base">water_drop</span>
            <span className="font-headline text-xl">{telemetry.todayWaterL}L</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] text-on-surface-variant font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span>Live {telemetry.currentPowerKw} kW</span>
          </div>
        </div>
      </div>

      {/* Stats Metadata Asymmetry */}
      <div className="grid grid-cols-2 gap-8 mt-10 w-full max-w-md">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-tight text-outline">
            Energy Efficiency
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl font-bold text-primary">
              {telemetry.energyEfficiencyPct}%
            </span>
            <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <span className="text-xs font-bold uppercase tracking-tight text-outline">
            Resource Health
          </span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="font-headline text-2xl font-bold text-on-surface">
              {telemetry.resourceHealth}
            </span>
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

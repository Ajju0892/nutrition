import React, { useState } from 'react';

export default function UsagePulseChart({ dataset, maxEnergy, maxWater }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const activeLabel = hoveredIdx !== null ? dataset.labels[hoveredIdx] : null;
  const activeEnergy = hoveredIdx !== null ? dataset.energy[hoveredIdx] : null;
  const activeWater = hoveredIdx !== null ? dataset.water[hoveredIdx] : null;

  return (
    <div className="space-y-4">
      {/* Interactive Tooltip Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10 text-xs text-outline min-h-[36px]">
        {hoveredIdx !== null ? (
          <div className="flex items-center gap-4 text-on-surface animate-fade-in">
            <span className="font-bold font-headline uppercase bg-surface-container px-2 py-0.5 rounded">
              {activeLabel}
            </span>
            <span className="text-primary font-semibold">⚡ {activeEnergy} kWh</span>
            <span className="text-secondary font-semibold">💧 {activeWater} L</span>
          </div>
        ) : (
          <span className="font-medium">Hover over any bar to inspect granular telemetry</span>
        )}
        <span className="font-headline font-bold text-on-surface">
          Total Period Cost: {dataset.totalCost}
        </span>
      </div>

      {/* Bars Visualizer */}
      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 md:gap-6 pt-8 pb-2 px-2 min-h-[220px]">
        {dataset.labels.map((label, idx) => {
          const energyVal = dataset.energy[idx];
          const waterVal = dataset.water[idx];

          const energyHeightPct = Math.max(10, Math.round((energyVal / maxEnergy) * 160));
          const waterHeightPct = Math.max(10, Math.round((waterVal / maxWater) * 160));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={label + idx}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44 relative">
                {/* Energy Bar */}
                <div
                  className={`w-full max-w-[18px] bg-primary rounded-t-lg transition-all duration-300 ${
                    isHovered ? 'brightness-125 shadow-lg shadow-primary/30 scale-x-110' : 'opacity-90'
                  }`}
                  style={{ height: `${energyHeightPct}px` }}
                />

                {/* Water Bar */}
                <div
                  className={`w-full max-w-[18px] bg-secondary rounded-t-lg transition-all duration-300 ${
                    isHovered ? 'brightness-125 shadow-lg shadow-secondary/30 scale-x-110' : 'opacity-85'
                  }`}
                  style={{ height: `${waterHeightPct}px` }}
                />
              </div>

              {/* X Axis Label */}
              <span
                className={`font-label text-[11px] font-bold transition-colors ${
                  isHovered ? 'text-primary' : 'text-outline'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

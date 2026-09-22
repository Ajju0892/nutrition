import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function ApplianceCard({ appliance }) {
  const { toggleAppliance } = useEcoSync();

  const isWater = appliance.type === 'water';
  const drawLabel = isWater ? 'Water Flow' : 'Current Draw';
  const drawValue = isWater
    ? `${appliance.waterFlowLpm} L/m`
    : `${appliance.powerKw > 0 ? '+' : ''}${appliance.powerKw} kW`;

  const fillPct = isWater
    ? Math.min(100, (appliance.waterFlowLpm / 20) * 100)
    : Math.min(100, (Math.abs(appliance.powerKw) / 8.0) * 100);

  return (
    <div className="snap-start flex-shrink-0 w-64 p-6 rounded-xl bg-surface-container-low shadow-sm transition-all hover:bg-surface-container-high flex flex-col justify-between border border-outline-variant/10">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div
            className={`p-3 rounded-lg ${
              isWater
                ? 'bg-secondary-container/15 text-secondary'
                : 'bg-primary-container/20 text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{appliance.icon}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appliance.enabled}
              onChange={() => toggleAppliance(appliance.id)}
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                isWater ? 'peer-checked:bg-secondary' : 'peer-checked:bg-primary'
              }`}
            />
          </label>
        </div>
        <h3 className="font-headline text-lg font-bold text-on-surface">{appliance.name}</h3>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-outline font-medium">{drawLabel}</span>
          <span className="font-headline font-bold text-on-surface">{drawValue}</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div
            className={`${isWater ? 'bg-secondary' : 'bg-primary'} h-full transition-all duration-500`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

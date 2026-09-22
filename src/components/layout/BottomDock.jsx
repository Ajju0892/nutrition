import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function BottomDock() {
  const { activeTab, navigateTo } = useEcoSync();

  const dockItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'usage', label: 'Usage', icon: 'analytics' },
    { id: 'automations', label: 'Automations', icon: 'auto_mode' },
    { id: 'settings', label: 'Settings', icon: 'tune' }
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card px-4 py-2 rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 flex items-center gap-2 max-w-[95vw]">
      {dockItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20 scale-[1.02]'
                : 'text-outline hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-xs font-label hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

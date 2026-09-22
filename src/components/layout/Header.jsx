import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function Header() {
  const {
    activeTab,
    navigateTo,
    telemetry,
    unreadNotificationCount,
    setActiveModal,
    simulatePeakEvent,
    simulateSolarSurge,
    simulateRainRadar
  } = useEcoSync();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'usage', label: 'Usage History' },
    { id: 'automations', label: 'Automations' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-outline-variant/15 px-4 md:px-6 py-3.5 flex items-center justify-between transition-all">
      {/* Brand Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <span
              className="material-symbols-outlined text-on-primary text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-xl tracking-tight text-on-surface">
                EcoSync
              </h1>
              <span
                className="inline-block w-2 h-2 rounded-full bg-primary-container live-beacon"
                title="Live Engine Telemetry Active"
              />
            </div>
            <span className="text-[10px] text-outline font-label uppercase tracking-widest block -mt-1">
              Luminous Engine
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 ml-6 pl-6 border-l border-outline-variant/20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-surface-container text-primary font-bold shadow-sm'
                  : 'text-outline hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Header Actions & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Live Power Draw Chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface shadow-sm">
          <span className="material-symbols-outlined text-primary text-sm">bolt</span>
          <span>{telemetry.currentPowerKw} kW</span>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
          <button
            onClick={simulatePeakEvent}
            title="Simulate Peak Tariff Event"
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-error transition-all"
          >
            <span className="material-symbols-outlined text-base">warning</span>
          </button>
          <button
            onClick={simulateSolarSurge}
            title="Simulate Solar Surge"
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-base">solar_power</span>
          </button>
          <button
            onClick={simulateRainRadar}
            title="Simulate Rain Radar"
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-secondary transition-all"
          >
            <span className="material-symbols-outlined text-base">cloud</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveModal('notification_drawer')}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container transition-all"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-xl">
            notifications
          </span>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar */}
        <div
          className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
          title="Alex Lindqvist (Homeowner)"
          onClick={() => navigateTo('settings')}
        >
          <img
            alt="User Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjxMOnCACfRz2yL9-MeupUG2jc3soaE1lMMF0X1j54ZanW6JW8cLcHhOkSV5VKMrKgIN89XvBG1mbIAVyEHKl5Wzc1lZeXPWa9ddm3Chlk7EjZk176UR8AMqBqeS47TWRODGtA3rKIKL8j0_lCIS7I3pZb19a0A74fZ19qfRdj6nfY3Ho04BaPY7xxMz1SQzqqhgfPhIEPYn_UKl20kCOGv5iOOoJ11OpRmYeJHywfmWBO8lsRpo1XoVE9dM6S8E3BIsH520HkDOmH"
          />
        </div>
      </div>
    </header>
  );
}

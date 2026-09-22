import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';
import LuminousDial from './LuminousDial.jsx';
import ApplianceCard from './ApplianceCard.jsx';


export default function DashboardView() {
  const { appliances, setActiveModal } = useEcoSync();

  const activeApplianceCount = appliances.filter(
    (a) => a.enabled && (a.powerKw > 0 || a.waterFlowLpm > 0)
  ).length;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Centerpiece: Luminous Engine Dial */}
      <LuminousDial />

      {/* Active Appliances Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Active Appliances
            </h2>
            <p className="text-xs text-outline">{activeApplianceCount} systems drawing power</p>
          </div>
          <button
            onClick={() => setActiveModal('appliance_manager')}
            className="text-primary font-semibold text-sm hover:underline flex items-center gap-1 focus:outline-none"
          >
            <span>View All ({appliances.length})</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x">
          {appliances.slice(0, 6).map((app) => (
            <ApplianceCard key={app.id} appliance={app} />
          ))}
        </div>
      </section>

      {/* Bento Grid Insights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peak Saving Window */}
        <div className="md:col-span-2 p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>OPPORTUNITY</span>
            </div>
            <h4 className="font-headline text-2xl font-bold text-on-surface">
              Peak Saving Window
            </h4>
            <p className="text-sm text-outline mt-2 max-w-sm leading-relaxed">
              Lower tariff rates available between 11:00 PM and 5:00 AM. Schedule your EV charge and
              heavy cycles now.
            </p>
            <button
              onClick={() => setActiveModal('ev_schedule')}
              className="mt-6 px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Schedule Now</span>
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <span className="material-symbols-outlined text-[180px] translate-x-12 translate-y-12 text-primary">
              bolt
            </span>
          </div>
        </div>

        {/* Water Leak Alert Card */}
        <div
          onClick={() => setActiveModal('leak_scan')}
          className="p-8 rounded-2xl bg-secondary text-on-secondary flex flex-col justify-between shadow-xl shadow-secondary/15 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-3xl">water_drop</span>
              <span className="px-2.5 py-0.5 rounded-full bg-on-secondary/20 text-[10px] font-bold uppercase tracking-widest">
                Active
              </span>
            </div>
            <h4 className="font-headline text-xl font-bold mt-4">Water Leak Defense</h4>
            <p className="text-sm opacity-90 mt-2">
              Zero abnormal flow detected across 6 monitored home zones today.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="font-headline text-2xl font-bold">Secure</div>
            <button className="text-xs underline font-medium hover:opacity-100 opacity-80">
              Scan Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

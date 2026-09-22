import React, { useEffect } from 'react';
import { useEcoSync } from './context/EcoSyncContext.jsx';
import Header from './components/layout/Header.jsx';
import BottomDock from './components/layout/BottomDock.jsx';
import DashboardView from './components/dashboard/DashboardView.jsx';
import UsageView from './components/usage/UsageView.jsx';
import AutomationsView from './components/automations/AutomationsView.jsx';
import SettingsView from './components/settings/SettingsView.jsx';
import NotificationDrawer from './components/modals/NotificationDrawer.jsx';
import NewFlowModal from './components/modals/NewFlowModal.jsx';
import EvScheduleModal from './components/modals/EvScheduleModal.jsx';
import ApplianceManagerModal from './components/modals/ApplianceManagerModal.jsx';
import LeakScanModal from './components/modals/LeakScanModal.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';


export default function App() {
  const { activeTab, showToast } = useEcoSync();

  useEffect(() => {
    // Welcome Toast on load
    const timer = setTimeout(() => {
      showToast(
        'EcoSync Active',
        'Luminous Engine synchronized with live grid telemetry.',
        'bolt',
        'primary'
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased pb-28">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'usage' && <UsageView />}
        {activeTab === 'automations' && <AutomationsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Bottom Floating Navigation Dock */}
      <BottomDock />

      {/* Interactive Modals & Drawers */}
      <NotificationDrawer />
      <NewFlowModal />
      <EvScheduleModal />
      <ApplianceManagerModal />
      <LeakScanModal />

      {/* Toast Stack */}
      <ToastContainer />
    </div>
  );
}

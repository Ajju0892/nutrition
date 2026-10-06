import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/api.js';
import {
  DEFAULT_APPLIANCES,
  DEFAULT_AUTOMATIONS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SETTINGS,
  USAGE_DATASETS
} from './defaultData.js';

export { DEFAULT_APPLIANCES, DEFAULT_AUTOMATIONS, DEFAULT_NOTIFICATIONS, DEFAULT_SETTINGS, USAGE_DATASETS };

const STORAGE_KEY = 'ecosync_react_state_v1';

const EcoSyncContext = createContext(null);

export function EcoSyncProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const valid = ['dashboard', 'usage', 'automations', 'settings'];
    return valid.includes(hash) ? hash : 'dashboard';
  });

  // Main Persistent Data
  const [appliances, setAppliances] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.appliances) return parsed.appliances;
      }
    } catch (e) {
      console.warn('Failed to load appliances from storage:', e);
    }
    return DEFAULT_APPLIANCES;
  });

  const [automations, setAutomations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.automations) return parsed.automations;
      }
    } catch (e) {
      console.warn('Failed to load automations from storage:', e);
    }
    return DEFAULT_AUTOMATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.notifications) return parsed.notifications;
      }
    } catch (e) {
      console.warn('Failed to load notifications from storage:', e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) return { ...DEFAULT_SETTINGS, ...parsed.settings };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Transient Filter & Timeframe states
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [activeAutomationFilter, setActiveAutomationFilter] = useState('all');

  // Modals & Drawers state
  const [activeModal, setActiveModal] = useState(null); // 'notification_drawer', 'new_flow', 'ev_schedule', 'appliance_manager', 'leak_scan'

  // Toast Stack
  const [toasts, setToasts] = useState([]);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    todayEnergyKwh: 12.4,
    todayWaterL: 240,
    currentPowerKw: 8.6,
    currentWaterFlowLpm: 0,
    energyEfficiencyPct: 88,
    resourceHealth: 'Optimal',
    dailySavings: 4.20,
    carbonOffsetKg: 12.4,
    efficiencyScore: 94,
    gridStatus: 'Stable (Off-Peak)'
  });

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const valid = ['dashboard', 'usage', 'automations', 'settings'];
      if (valid.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = useCallback((tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch initial state from Express backend API
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [remoteApps, remoteFlows, remoteNotifs, remoteSettings] = await Promise.all([
          apiService.getAppliances().catch(() => null),
          apiService.getAutomations().catch(() => null),
          apiService.getNotifications().catch(() => null),
          apiService.getSettings().catch(() => null)
        ]);

        if (isMounted) {
          if (remoteApps && Array.isArray(remoteApps) && remoteApps.length > 0) {
            setAppliances(remoteApps);
          }
          if (remoteFlows && Array.isArray(remoteFlows) && remoteFlows.length > 0) {
            setAutomations(remoteFlows);
          }
          if (remoteNotifs && Array.isArray(remoteNotifs) && remoteNotifs.length > 0) {
            setNotifications(remoteNotifs);
          }
          if (remoteSettings && typeof remoteSettings === 'object') {
            setSettings((prev) => ({ ...prev, ...remoteSettings }));
          }
        }
      } catch (err) {
        console.log('[EcoSync API] Backend server offline or starting up, using local state.');
      }
    };
    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          appliances,
          automations,
          notifications,
          settings
        })
      );
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [appliances, automations, notifications, settings]);

  // Toast Trigger Helper
  const showToast = useCallback((title, message, icon = 'check_circle', type = 'primary') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, icon, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Recalculate Live Telemetry
  const recalculateTelemetry = useCallback((currentAppliances, currentAutomations) => {
    let totalKw = 0;
    let totalWaterFlow = 0;

    currentAppliances.forEach((app) => {
      if (app.enabled) {
        totalKw += (app.powerKw || 0);
        totalWaterFlow += (app.waterFlowLpm || 0);
      }
    });

    const baseIdleKw = 0.35;
    const activeEcoCount = currentAutomations.filter((a) => a.enabled).length;
    const efficiencyBoost = Math.min(15, activeEcoCount * 2.5);

    setTelemetry((prev) => ({
      ...prev,
      currentPowerKw: Math.max(0, +(totalKw + baseIdleKw).toFixed(2)),
      currentWaterFlowLpm: Math.max(0, +totalWaterFlow.toFixed(1)),
      energyEfficiencyPct: Math.min(99, Math.round(78 + efficiencyBoost)),
      efficiencyScore: Math.min(98, Math.round(82 + efficiencyBoost * 1.5))
    }));
  }, []);

  // Toggle Appliance
  const toggleAppliance = useCallback((id) => {
    setAppliances((prev) => {
      const updated = prev.map((app) => {
        if (app.id === id) {
          const nextEnabled = !app.enabled;
          let nextPower = 0;
          let nextWater = 0;
          if (nextEnabled) {
            if (app.type === 'water') {
              nextWater = app.baseWaterFlowLpm || 14.0;
              nextPower = app.basePowerKw || 0.1;
            } else {
              nextPower = app.basePowerKw || 1.0;
            }
          }
          return {
            ...app,
            enabled: nextEnabled,
            powerKw: nextPower,
            waterFlowLpm: nextWater
          };
        }
        return app;
      });

      const changedApp = updated.find((a) => a.id === id);
      if (changedApp) {
        showToast(
          `${changedApp.name} ${changedApp.enabled ? 'Enabled' : 'Disabled'}`,
          `Live telemetry updated.`,
          changedApp.icon,
          changedApp.type === 'water' ? 'secondary' : 'primary'
        );
      }

      recalculateTelemetry(updated, automations);
      return updated;
    });
  }, [automations, recalculateTelemetry, showToast]);

  // Set Appliance Power / Flow Slider
  const setAppliancePower = useCallback((id, powerKw) => {
    setAppliances((prev) => {
      const updated = prev.map((app) => {
        if (app.id === id) {
          const val = parseFloat(powerKw);
          return {
            ...app,
            powerKw: val,
            basePowerKw: val,
            enabled: val !== 0
          };
        }
        return app;
      });
      recalculateTelemetry(updated, automations);
      return updated;
    });
  }, [automations, recalculateTelemetry]);

  // Toggle Automation
  const toggleAutomation = useCallback((id) => {
    setAutomations((prev) => {
      const updated = prev.map((flow) => {
        if (flow.id === id) {
          return { ...flow, enabled: !flow.enabled };
        }
        return flow;
      });
      const toggled = updated.find((f) => f.id === id);
      if (toggled) {
        showToast(
          `${toggled.title} ${toggled.enabled ? 'Activated' : 'Paused'}`,
          toggled.enabled ? 'Automation rule now active.' : 'Automation rule suspended.',
          toggled.icon,
          toggled.type === 'water' ? 'secondary' : 'primary'
        );
      }
      recalculateTelemetry(appliances, updated);
      return updated;
    });
  }, [appliances, recalculateTelemetry, showToast]);

  // Add Custom Automation
  const addAutomation = useCallback((newFlow) => {
    const id = 'flow_' + Date.now();
    const flow = {
      id,
      title: newFlow.title || 'Custom Energy Flow',
      description: newFlow.description || 'Custom defined automation rule.',
      type: newFlow.type || 'energy',
      category: newFlow.category || 'energy',
      icon: newFlow.icon || (newFlow.category === 'water' ? 'water_drop' : 'bolt'),
      enabled: true,
      featured: false,
      devicesAffected: newFlow.devicesAffected || 2,
      impact: newFlow.impact || '-10% kWh',
      trigger: newFlow.trigger || 'Custom Schedule',
      action: newFlow.action || 'Optimize device setpoint',
      lastTriggered: 'Just now'
    };

    setAutomations((prev) => [flow, ...prev]);
    showToast('Flow Created', `"${flow.title}" is now active in Luminous Engine.`, 'auto_mode');
    return flow;
  }, [showToast]);

  // Trigger Automation Test / Manual Execution
  const triggerAutomationNow = useCallback((id) => {
    const flow = automations.find((a) => a.id === id);
    if (!flow) return;

    // Update lastTriggered timestamp
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastTriggered: `Today, ${nowStr}`, enabled: true } : a))
    );

    // Apply Telemetry & Appliance modifications based on category
    if (flow.category === 'climate' || flow.id === 'peak_hours_eco') {
      setAppliances((prev) =>
        prev.map((app) => (app.id === 'hvac' ? { ...app, powerKw: 0.8, enabled: true } : app))
      );
    } else if (flow.category === 'water' || flow.id === 'smart_sprinkler_rain') {
      setAppliances((prev) =>
        prev.map((app) => (app.id === 'smart_sprinkler' ? { ...app, enabled: false, waterFlowLpm: 0 } : app))
      );
    } else if (flow.category === 'ev' || flow.id === 'ev_scheduled_charging') {
      setAppliances((prev) =>
        prev.map((app) => (app.id === 'ev_charger' ? { ...app, powerKw: 7.4, enabled: true } : app))
      );
    } else if (flow.id === 'solar_surplus_divert') {
      setAppliances((prev) =>
        prev.map((app) => (app.id === 'heat_pump' ? { ...app, powerKw: 1.2, enabled: true } : app))
      );
    }

    addNotification({
      title: `Flow Executed: ${flow.title}`,
      message: `Trigger criteria met ("${flow.trigger}"). Action dispatched: ${flow.action}`,
      category: flow.category || 'grid',
      severity: 'info',
      icon: flow.icon || 'play_arrow'
    });

    showToast(
      `Flow Executed!`,
      `"${flow.title}" dispatched live actions.`,
      flow.icon || 'play_arrow',
      flow.category === 'water' ? 'secondary' : 'primary'
    );
  }, [automations, addNotification, showToast]);

  // Delete Automation
  const deleteAutomation = useCallback((id) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    showToast('Flow Deleted', 'Automation rule removed from system.', 'delete', 'error');
  }, [showToast]);

  // Update Settings
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'Grid tariffs and AI engine parameters updated.', 'save', 'primary');
  }, [showToast]);

  // Notifications
  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'done_all');
  }, [showToast]);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      title: notif.title,
      message: notif.message,
      category: notif.category || 'grid',
      severity: notif.severity || 'info',
      timestamp: 'Just now',
      unread: true,
      icon: notif.icon || 'notifications'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Quick Simulation Triggers
  const simulatePeakEvent = useCallback(() => {
    addNotification({
      title: 'Simulated Peak Grid Event',
      message: 'Grid demand surge detected (+40% tariff). Automations responding.',
      category: 'grid',
      severity: 'warning',
      icon: 'bolt'
    });
    showToast('Grid Event Simulated', 'Peak hours tariff spike initiated.', 'bolt', 'error');
  }, [addNotification, showToast]);

  const simulateSolarSurge = useCallback(() => {
    setAppliances((prev) => {
      const updated = prev.map((a) => {
        if (a.id === 'solar_inverter') {
          return { ...a, powerKw: -5.4, enabled: true };
        }
        return a;
      });
      recalculateTelemetry(updated, automations);
      return updated;
    });
    showToast('Solar Surge!', 'Rooftop generation spiked to 5.4 kW. Surplus diverter armed.', 'solar_power', 'primary');
  }, [automations, recalculateTelemetry, showToast]);

  const simulateRainRadar = useCallback(() => {
    addNotification({
      title: 'Heavy Rain Detected',
      message: 'Precipitation 90%. Sprinklers paused for next 48 hours.',
      category: 'water',
      severity: 'info',
      icon: 'cloud'
    });
    showToast('Weather Event', 'Sprinkler cycle skipped to conserve water.', 'cloud', 'secondary');
  }, [addNotification, showToast]);

  // Telemetry micro-jitter background simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        let activeDraw = 0;
        appliances.forEach((a) => {
          if (a.enabled && a.powerKw > 0) {
            const jitter = (Math.random() - 0.5) * 0.04 * a.powerKw;
            activeDraw += Math.max(0.05, a.powerKw + jitter);
          } else if (a.enabled && a.powerKw < 0) {
            const sunJitter = (Math.random() - 0.5) * 0.08 * Math.abs(a.powerKw);
            activeDraw += (a.powerKw + sunJitter);
          }
        });

        const baseIdleKw = 0.35 + (Math.random() - 0.5) * 0.03;
        const currentPower = Math.max(0, +(activeDraw + baseIdleKw).toFixed(2));

        let waterDraw = 0;
        appliances.forEach((a) => {
          if (a.enabled && a.waterFlowLpm > 0) {
            const wJitter = (Math.random() - 0.5) * 0.4;
            waterDraw += Math.max(0, a.waterFlowLpm + wJitter);
          }
        });
        const currentWater = +waterDraw.toFixed(1);

        const newEnergyToday = +(prev.todayEnergyKwh + (currentPower * (2 / 3600))).toFixed(3);
        const newWaterToday = currentWater > 0
          ? Math.round(prev.todayWaterL + (currentWater * (2 / 60)))
          : prev.todayWaterL;

        return {
          ...prev,
          currentPowerKw: currentPower,
          currentWaterFlowLpm: currentWater,
          todayEnergyKwh: newEnergyToday,
          todayWaterL: newWaterToday
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [appliances]);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const value = {
    activeTab,
    navigateTo,
    appliances,
    automations,
    notifications,
    settings,
    telemetry,
    activeTimeframe,
    setActiveTimeframe,
    activeAutomationFilter,
    setActiveAutomationFilter,
    activeModal,
    setActiveModal,
    toasts,
    showToast,
    removeToast,
    toggleAppliance,
    setAppliancePower,
    toggleAutomation,
    addAutomation,
    triggerAutomationNow,
    deleteAutomation,
    updateSettings,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    simulatePeakEvent,
    simulateSolarSurge,
    simulateRainRadar,
    unreadNotificationCount,
    usageDatasets: USAGE_DATASETS
  };

  return <EcoSyncContext.Provider value={value}>{children}</EcoSyncContext.Provider>;
}

export function useEcoSync() {
  const context = useContext(EcoSyncContext);
  if (!context) {
    throw new Error('useEcoSync must be used within an EcoSyncProvider');
  }
  return context;
}

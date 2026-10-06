import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'ecosync_react_state_v1';

export const DEFAULT_APPLIANCES = [
  {
    id: 'hvac',
    name: 'HVAC System',
    type: 'energy',
    category: 'climate',
    icon: 'ac_unit',
    room: 'Whole House',
    powerKw: 1.2,
    basePowerKw: 1.2,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: 84.2,
    changeVsLw: '+4%',
    changeType: 'negative'
  },
  {
    id: 'ev_charger',
    name: 'EV Charger',
    type: 'energy',
    category: 'ev',
    icon: 'ev_station',
    room: 'Garage',
    powerKw: 7.4,
    basePowerKw: 7.4,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: 52.0,
    changeVsLw: 'Stable',
    changeType: 'neutral'
  },
  {
    id: 'smart_sprinkler',
    name: 'Smart Sprinkler',
    type: 'water',
    category: 'water',
    icon: 'sprinkler',
    room: 'Garden & Lawn',
    powerKw: 0.1,
    basePowerKw: 0.1,
    waterFlowLpm: 0,
    baseWaterFlowLpm: 18.5,
    enabled: false,
    dailyWaterL: 95,
    changeVsLw: '-28%',
    changeType: 'positive'
  },
  {
    id: 'dishwasher',
    name: 'Eco Dishwasher',
    type: 'water',
    category: 'water',
    icon: 'local_laundry_service',
    room: 'Kitchen',
    powerKw: 0.0,
    basePowerKw: 1.8,
    waterFlowLpm: 0,
    baseWaterFlowLpm: 12.0,
    enabled: false,
    dailyKwh: 6.4,
    dailyWaterL: 156,
    changeVsLw: '-12%',
    changeType: 'positive'
  },
  {
    id: 'heat_pump',
    name: 'Heat Pump Water Heater',
    type: 'energy',
    category: 'climate',
    icon: 'mode_heat',
    room: 'Utility Room',
    powerKw: 0.65,
    basePowerKw: 0.65,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: 18.5,
    changeVsLw: '-6%',
    changeType: 'positive'
  },
  {
    id: 'solar_inverter',
    name: 'Solar Inverter (Generation)',
    type: 'energy',
    category: 'energy',
    icon: 'solar_power',
    room: 'Rooftop',
    powerKw: -3.8,
    basePowerKw: -3.8,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: -24.6,
    changeVsLw: '+18%',
    changeType: 'positive'
  },
  {
    id: 'refrigerator',
    name: 'Smart Refrigerator',
    type: 'energy',
    category: 'energy',
    icon: 'kitchen',
    room: 'Kitchen',
    powerKw: 0.18,
    basePowerKw: 0.18,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: 4.2,
    changeVsLw: 'Stable',
    changeType: 'neutral'
  },
  {
    id: 'smart_lighting',
    name: 'Circadian LED Array',
    type: 'energy',
    category: 'energy',
    icon: 'lightbulb',
    room: 'All Living Zones',
    powerKw: 0.24,
    basePowerKw: 0.24,
    waterFlowLpm: 0,
    enabled: true,
    dailyKwh: 3.1,
    changeVsLw: '-15%',
    changeType: 'positive'
  }
];

export const DEFAULT_AUTOMATIONS = [
  {
    id: 'peak_hours_eco',
    title: 'Peak Hours Eco Mode',
    description: 'Automatically dims lights and adjusts HVAC when energy demand is highest on the regional grid.',
    type: 'energy',
    icon: 'eco',
    category: 'energy',
    enabled: true,
    featured: true,
    devicesAffected: 12,
    impact: '-15% kWh',
    trigger: 'Grid Peak Tariff (4 PM - 9 PM)',
    action: 'Throttle HVAC setpoint +2°C, dim lighting 30%'
  },
  {
    id: 'smart_sprinkler_rain',
    title: 'Smart Sprinkler Rain Defense',
    description: 'Based on hyper-local radar forecast. Skips cycles when precipitation is predicted above 60%.',
    type: 'water',
    icon: 'water_drop',
    category: 'water',
    enabled: true,
    featured: false,
    devicesAffected: 4,
    impact: 'Saved 320L this wk',
    trigger: 'Precipitation > 60% in next 12h',
    action: 'Suppress scheduled watering cycles'
  },
  {
    id: 'ev_scheduled_charging',
    title: 'EV Off-Peak Tariff Fast Charge',
    description: 'Charges vehicle during lowest tariff rates between 12:00 AM and 5:00 AM to minimize utility cost.',
    type: 'ev',
    icon: 'ev_station',
    category: 'ev',
    enabled: true,
    featured: false,
    devicesAffected: 1,
    impact: '-$18.40/mo',
    nextCycle: 'Tonight, 11:45 PM',
    trigger: 'Time == 11:45 PM & EV Plugged In',
    action: 'Deliver 11.5 kW until 85% SoC target'
  },
  {
    id: 'solar_surplus_divert',
    title: 'Solar Surplus Thermal Diverter',
    description: 'Directs excess photovoltaic generation directly into the heat pump water storage tank.',
    type: 'energy',
    icon: 'solar_power',
    category: 'energy',
    enabled: true,
    featured: false,
    devicesAffected: 2,
    impact: '+2.4 kWh stored',
    nextCycle: 'Auto (Solar > 3.0 kW)',
    trigger: 'Solar generation exceeds household load by 1.5 kW',
    action: 'Boost water heater temperature target to 60°C'
  },
  {
    id: 'leak_defense_cutoff',
    title: 'Acoustic Leak Auto-Shutoff',
    description: 'Detects continuous micro-flow patterns exceeding 45 minutes and triggers emergency main line shutoff.',
    type: 'water',
    icon: 'gss_alert',
    category: 'water',
    enabled: true,
    featured: false,
    devicesAffected: 1,
    impact: 'Active Guardian',
    trigger: 'Continuous flow > 1.2 L/min for 45m without occupant tag',
    action: 'Trigger motorized valve shut-off & broadcast push alert'
  },
  {
    id: 'pre_cooling_comfort',
    title: 'Dynamic Pre-Cooling Buffer',
    description: 'Pre-cools the home 1 hour prior to peak afternoon pricing utilizing cheap green solar power.',
    type: 'climate',
    icon: 'thermostat',
    category: 'climate',
    enabled: false,
    featured: false,
    devicesAffected: 3,
    impact: '-$8.20/mo',
    nextCycle: 'Tomorrow, 2:00 PM',
    trigger: 'Time == 2:00 PM on days with T > 26°C',
    action: 'Cool interior to 21°C before peak pricing starts at 3:00 PM'
  }
];

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Peak Pricing Window Starting',
    message: 'Grid rates shifting to $0.34/kWh in 15 minutes. Eco Mode is armed.',
    category: 'grid',
    severity: 'warning',
    timestamp: '5 min ago',
    unread: true,
    icon: 'bolt'
  },
  {
    id: 'notif_2',
    title: 'Rain Detected: Sprinklers Paused',
    message: 'Local radar reported 80% precipitation. 240L of water saved.',
    category: 'water',
    severity: 'info',
    timestamp: '2 hours ago',
    unread: true,
    icon: 'cloud'
  },
  {
    id: 'notif_3',
    title: 'EV Scheduled Charge Finished',
    message: 'Vehicle charged to 85% during off-peak window. Total cost: $2.14.',
    category: 'ev',
    severity: 'success',
    timestamp: '6:15 AM',
    unread: false,
    icon: 'check_circle'
  },
  {
    id: 'notif_4',
    title: 'Water Line Pressure Optimal',
    message: 'Acoustic resonance scan completed. Zero abnormal micro-vibrations.',
    category: 'water',
    severity: 'success',
    timestamp: 'Yesterday',
    unread: false,
    icon: 'verified'
  }
];

export const DEFAULT_SETTINGS = {
  gridStandard: 'Northern European (Nordic Power Pool)',
  peakRate: 0.38,
  offPeakRate: 0.14,
  currencySymbol: '$',
  energyUnit: 'kWh',
  waterUnit: 'Liters',
  aiSensitivity: 'Optimal (Balanced)',
  autoLeakShutoff: true,
  pushNotifications: true,
  themeMode: 'light',
  evTargetSoc: 85,
  evDepartureTime: '07:00',
  evChargingMode: 'Off-Peak Smart Charge',
  gateways: [
    { name: 'EcoSync Hub Gateway', status: 'Online', ip: '192.168.1.140', ping: '12ms' },
    { name: 'Ultrasonic Water Meter V2', status: 'Connected', battery: '96%', signal: 'Strong' },
    { name: 'Bidirectional Smart Energy CT', status: 'Active', sampleRate: '100Hz', accuracy: '99.8%' },
    { name: 'Enphase Solar Inverter API', status: 'Online', generation: '3.8 kW', cloudSync: 'Realtime' }
  ]
};

export const USAGE_DATASETS = {
  '24h': {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    energy: [0.8, 0.4, 1.2, 2.8, 1.5, 3.2, 4.1, 1.9],
    water: [0, 0, 45, 120, 60, 35, 180, 50],
    avgEnergy: '12.4 kWh',
    avgWater: '240 L',
    efficiency: '88%',
    totalCost: '$3.45'
  },
  '7d': {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    energy: [14.2, 12.8, 15.6, 16.2, 11.9, 9.8, 12.4],
    water: [380, 410, 490, 240, 360, 290, 240],
    avgEnergy: '14.2 kWh/d',
    avgWater: '420 L/d',
    efficiency: '94%',
    totalCost: '$24.80'
  },
  '30d': {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    energy: [98.4, 91.2, 84.6, 88.0],
    water: [2840, 2650, 2400, 2520],
    avgEnergy: '13.1 kWh/d',
    avgWater: '370 L/d',
    efficiency: '91%',
    totalCost: '$98.50'
  },
  '1y': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    energy: [420, 390, 350, 280, 220, 195, 210, 230, 270, 310, 380, 440],
    water: [11200, 10800, 11500, 12400, 14200, 16500, 17800, 16900, 13800, 12100, 11000, 11400],
    avgEnergy: '310 kWh/mo',
    avgWater: '13,300 L/mo',
    efficiency: '92%',
    totalCost: '$1,140.00'
  }
};

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

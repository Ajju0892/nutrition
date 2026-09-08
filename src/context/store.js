/**
 * EcoSync Central Reactive State Store & Telemetry Simulator
 * Handles appliance status, active automations, live consumption calculations,
 * historical usage datasets, alerts, and settings persistence.
 */

const STORAGE_KEY = 'ecosync_state_v1';

const DEFAULT_APPLIANCES = [
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

const DEFAULT_AUTOMATIONS = [
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

const DEFAULT_NOTIFICATIONS = [
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

const DEFAULT_SETTINGS = {
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
  gateways: [
    { name: 'EcoSync Hub Gateway', status: 'Online', ip: '192.168.1.140', ping: '12ms' },
    { name: 'Ultrasonic Water Meter V2', status: 'Connected', battery: '96%', signal: 'Strong' },
    { name: 'Bidirectional Smart Energy CT', status: 'Active', sampleRate: '100Hz', accuracy: '99.8%' },
    { name: 'Enphase Solar Inverter API', status: 'Online', generation: '3.8 kW', cloudSync: 'Realtime' }
  ]
};

const USAGE_DATASETS = {
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

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.appliances = [...DEFAULT_APPLIANCES];
    this.automations = [...DEFAULT_AUTOMATIONS];
    this.notifications = [...DEFAULT_NOTIFICATIONS];
    this.settings = { ...DEFAULT_SETTINGS };
    this.activeTimeframe = '7d';
    this.activeAutomationFilter = 'all';
    this.activeView = 'dashboard';

    this.telemetry = {
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
    };

    this.loadFromStorage();
    this.recalculateTelemetry();
    this.startSimulation();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.appliances) this.appliances = parsed.appliances;
        if (parsed.automations) this.automations = parsed.automations;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.settings) this.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          appliances: this.appliances,
          automations: this.automations,
          notifications: this.notifications,
          settings: this.settings
        })
      );
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event = 'state_changed') {
    this.saveToStorage();
    this.listeners.forEach((callback) => {
      try {
        callback(event, this);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  recalculateTelemetry() {
    let totalKw = 0;
    let totalWaterFlow = 0;

    this.appliances.forEach((app) => {
      if (app.enabled) {
        totalKw += (app.powerKw || 0);
        totalWaterFlow += (app.waterFlowLpm || 0);
      }
    });

    // Baseline household draw (idle smart gadgets, background standby)
    const baseIdleKw = 0.35;
    this.telemetry.currentPowerKw = Math.max(0, +(totalKw + baseIdleKw).toFixed(2));
    this.telemetry.currentWaterFlowLpm = Math.max(0, +totalWaterFlow.toFixed(1));

    // Dynamic efficiency calculation
    const activeEcoCount = this.automations.filter((a) => a.enabled).length;
    const efficiencyBoost = Math.min(15, activeEcoCount * 2.5);
    this.telemetry.energyEfficiencyPct = Math.min(99, Math.round(78 + efficiencyBoost));
    this.telemetry.efficiencyScore = Math.min(98, Math.round(82 + efficiencyBoost * 1.5));
  }

  toggleAppliance(id) {
    const appliance = this.appliances.find((a) => a.id === id);
    if (!appliance) return;

    appliance.enabled = !appliance.enabled;
    if (appliance.enabled) {
      if (appliance.type === 'water') {
        appliance.waterFlowLpm = appliance.baseWaterFlowLpm || 14.0;
        appliance.powerKw = appliance.basePowerKw || 0.1;
      } else {
        appliance.powerKw = appliance.basePowerKw || 1.0;
      }
    } else {
      appliance.powerKw = 0;
      appliance.waterFlowLpm = 0;
    }

    this.recalculateTelemetry();
    this.notify('appliance_toggled');
  }

  setAppliancePower(id, powerKw) {
    const appliance = this.appliances.find((a) => a.id === id);
    if (!appliance) return;
    appliance.powerKw = parseFloat(powerKw);
    appliance.basePowerKw = parseFloat(powerKw);
    if (appliance.powerKw > 0) appliance.enabled = true;
    this.recalculateTelemetry();
    this.notify('appliance_updated');
  }

  toggleAutomation(id) {
    const automation = this.automations.find((a) => a.id === id);
    if (!automation) return;

    automation.enabled = !automation.enabled;
    this.recalculateTelemetry();
    this.notify('automation_toggled');
  }

  addAutomation(newFlow) {
    const id = 'flow_' + Date.now();
    const flow = {
      id,
      title: newFlow.title || 'Custom Energy Flow',
      description: newFlow.description || 'Custom defined automation rule.',
      type: newFlow.type || 'energy',
      category: newFlow.category || 'energy',
      icon: newFlow.icon || (newFlow.type === 'water' ? 'water_drop' : 'bolt'),
      enabled: true,
      featured: false,
      devicesAffected: newFlow.devicesAffected || 1,
      impact: newFlow.impact || '-5% kWh',
      trigger: newFlow.trigger || 'Custom Schedule',
      action: newFlow.action || 'Adjust load profile'
    };

    this.automations.unshift(flow);
    this.notify('automation_added');
    return flow;
  }

  deleteAutomation(id) {
    this.automations = this.automations.filter((a) => a.id !== id);
    this.notify('automation_deleted');
  }

  setTimeframe(timeframe) {
    if (USAGE_DATASETS[timeframe]) {
      this.activeTimeframe = timeframe;
      this.notify('timeframe_changed');
    }
  }

  setAutomationFilter(filter) {
    this.activeAutomationFilter = filter;
    this.notify('filter_changed');
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.unread = false;
      this.notify('notifications_updated');
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.unread = false));
    this.notify('notifications_updated');
  }

  addNotification(notif) {
    this.notifications.unshift({
      id: 'notif_' + Date.now(),
      title: notif.title,
      message: notif.message,
      category: notif.category || 'grid',
      severity: notif.severity || 'info',
      timestamp: 'Just now',
      unread: true,
      icon: notif.icon || 'notifications'
    });
    this.notify('notifications_updated');
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.notify('settings_updated');
  }

  startSimulation() {
    // Subtle realistic live telemetry micro-variations
    if (this.simInterval) clearInterval(this.simInterval);

    this.simInterval = setInterval(() => {
      // Natural minor fluctuations (+- 1-3%)
      let activeDraw = 0;
      this.appliances.forEach((a) => {
        if (a.enabled && a.powerKw > 0) {
          const jitter = (Math.random() - 0.5) * 0.04 * a.powerKw;
          activeDraw += Math.max(0.05, a.powerKw + jitter);
        } else if (a.enabled && a.powerKw < 0) {
          // Solar generation variation
          const sunJitter = (Math.random() - 0.5) * 0.08 * Math.abs(a.powerKw);
          activeDraw += (a.powerKw + sunJitter);
        }
      });

      const baseIdleKw = 0.35 + (Math.random() - 0.5) * 0.03;
      this.telemetry.currentPowerKw = Math.max(0, +(activeDraw + baseIdleKw).toFixed(2));

      // Water flow fluctuation if sprinklers or dishwasher are active
      let waterDraw = 0;
      this.appliances.forEach((a) => {
        if (a.enabled && a.waterFlowLpm > 0) {
          const wJitter = (Math.random() - 0.5) * 0.4;
          waterDraw += Math.max(0, a.waterFlowLpm + wJitter);
        }
      });
      this.telemetry.currentWaterFlowLpm = +waterDraw.toFixed(1);

      // Accumulate slow daily totals
      this.telemetry.todayEnergyKwh = +(this.telemetry.todayEnergyKwh + (this.telemetry.currentPowerKw * (2 / 3600))).toFixed(3);
      if (this.telemetry.currentWaterFlowLpm > 0) {
        this.telemetry.todayWaterL = Math.round(this.telemetry.todayWaterL + (this.telemetry.currentWaterFlowLpm * (2 / 60)));
      }

      this.notify('telemetry_tick');
    }, 2500);
  }

  getUnreadNotificationCount() {
    return this.notifications.filter((n) => n.unread).length;
  }
}

// Export singleton
export const store = new StateStore();
export const usageDatasets = USAGE_DATASETS;

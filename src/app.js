/**
 * EcoSync — Main Application Coordinator & Router
 * Manages tab switching, hash routing, state subscriptions,
 * modal triggers, and responsive UI updates.
 */

import { store } from './context/store.js';
import { renderDashboard } from './components/dashboard/dashboard.js';
import { renderUsage } from './components/usage/usage.js';
import { renderAutomations } from './components/automations/automations.js';
import { renderSettings } from './components/settings/settings.js';
import { setupModalListeners, showToast } from './components/common/modals.js';

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    // Setup common modals
    setupModalListeners();

    // Setup navigation tabs
    this.setupNavigation();

    // Setup quick simulation controls
    this.setupSimulationBar();

    // Listen to hash changes for deep linking
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Subscribe to state store changes
    store.subscribe((event) => this.handleStateChange(event));

    // Initial render
    this.handleHashChange();
    this.updateHeaderBadges();

    // Welcome Toast
    setTimeout(() => {
      showToast('EcoSync Active', 'Luminous Engine synchronized with live grid telemetry.', 'bolt');
    }, 800);
  }

  setupNavigation() {
    // Top Bar Brand click -> Dashboard
    const brandLogo = document.getElementById('brand-logo-btn');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('dashboard');
      });
    }

    // Bottom dock and header navigation links
    document.querySelectorAll('[data-nav-target]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav-target');
        this.switchView(target);
      });
    });
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validViews = ['dashboard', 'usage', 'automations', 'settings'];
    if (validViews.includes(hash)) {
      this.switchView(hash, false);
    } else {
      this.switchView('dashboard', true);
    }
  }

  switchView(viewName, updateHash = true) {
    this.currentView = viewName;
    store.activeView = viewName;

    if (updateHash) {
      window.location.hash = viewName;
    }

    // Update view panels visibility
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`view-${viewName}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Update bottom dock active states
    document.querySelectorAll('[data-nav-target]').forEach((link) => {
      const target = link.getAttribute('data-nav-target');
      const icon = link.querySelector('.material-symbols-outlined');
      const label = link.querySelector('span:not(.material-symbols-outlined)');

      if (target === viewName) {
        link.classList.remove('text-outline', 'text-on-surface-variant');
        link.classList.add('text-primary', 'font-bold');
        if (icon) icon.style.fontVariationSettings = "'FILL' 1";
      } else {
        link.classList.remove('text-primary', 'font-bold');
        link.classList.add('text-outline');
        if (icon) icon.style.fontVariationSettings = "'FILL' 0";
      }
    });

    // Render corresponding view content
    switch (viewName) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'usage':
        renderUsage();
        break;
      case 'automations':
        renderAutomations();
        break;
      case 'settings':
        renderSettings();
        break;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleStateChange(event) {
    this.updateHeaderBadges();

    // Partial updates or view re-renders depending on event
    if (this.currentView === 'dashboard') {
      if (event === 'telemetry_tick') {
        // Smoothly update live display numbers without redrawing the entire DOM
        const kwhEl = document.getElementById('dashboard-kwh-display');
        const waterEl = document.getElementById('dashboard-water-display');
        const effEl = document.getElementById('dashboard-efficiency-score');
        const energyRing = document.getElementById('energy-dial-ring');
        const waterRing = document.getElementById('water-dial-ring');

        if (kwhEl) kwhEl.textContent = store.telemetry.todayEnergyKwh.toFixed(1);
        if (waterEl) waterEl.textContent = `${store.telemetry.todayWaterL}L`;
        if (effEl) effEl.textContent = `${store.telemetry.energyEfficiencyPct}%`;

        // Update concentric rings
        if (energyRing && waterRing) {
          const circumference = 282.74;
          const energyRatio = Math.min(1, Math.max(0.05, store.telemetry.todayEnergyKwh / 20.0));
          const waterRatio = Math.min(1, Math.max(0.05, store.telemetry.todayWaterL / 400));
          energyRing.style.strokeDashoffset = +(circumference * (1 - energyRatio)).toFixed(1);
          waterRing.style.strokeDashoffset = +(circumference * (1 - waterRatio)).toFixed(1);
        }
      } else {
        renderDashboard();
      }
    } else if (this.currentView === 'usage' && (event === 'timeframe_changed' || event === 'state_changed')) {
      renderUsage();
    } else if (this.currentView === 'automations' && (event === 'filter_changed' || event === 'automation_toggled' || event === 'automation_added')) {
      renderAutomations();
    }
  }

  updateHeaderBadges() {
    // Unread notifications badge
    const badge = document.getElementById('notif-unread-badge');
    const count = store.getUnreadNotificationCount();
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    // Top bar live power telemetry chip
    const powerChip = document.getElementById('header-live-power');
    if (powerChip) {
      powerChip.textContent = `${store.telemetry.currentPowerKw} kW`;
    }
  }

  setupSimulationBar() {
    // Optional developer / interactive demo quick tools
    const peakBtn = document.getElementById('sim-trigger-peak');
    const solarBtn = document.getElementById('sim-trigger-solar');
    const rainBtn = document.getElementById('sim-trigger-rain');

    if (peakBtn) {
      peakBtn.addEventListener('click', () => {
        store.addNotification({
          title: 'Simulated Peak Grid Event',
          message: 'Grid demand surge detected (+40% tariff). Automations responding.',
          category: 'grid',
          severity: 'warning',
          icon: 'bolt'
        });
        showToast('Grid Event Simulated', 'Peak hours tariff spike initiated.', 'bolt', 'error');
      });
    }

    if (solarBtn) {
      solarBtn.addEventListener('click', () => {
        const solar = store.appliances.find((a) => a.id === 'solar_inverter');
        if (solar) {
          solar.powerKw = -5.4;
          store.recalculateTelemetry();
          showToast('Solar Surge!', 'Rooftop generation spiked to 5.4 kW. Surplus diverter armed.', 'solar_power', 'primary');
        }
      });
    }

    if (rainBtn) {
      rainBtn.addEventListener('click', () => {
        store.addNotification({
          title: 'Heavy Rain Detected',
          message: 'Precipitation 90%. Sprinklers paused for next 48 hours.',
          category: 'water',
          severity: 'info',
          icon: 'cloud'
        });
        showToast('Weather Event', 'Sprinkler cycle skipped to conserve water.', 'cloud', 'secondary');
      });
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.ecoSyncApp = new App();
});

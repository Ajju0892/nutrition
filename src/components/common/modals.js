/**
 * EcoSync Interactive Modals & Common UI Overlays
 * Includes: Notification Slide-Over, New Flow Builder, EV Schedule Configurator,
 * Appliance Manager Drawer, and Live Toast Engine.
 */

import { store } from '../../context/store.js';

export function showToast(title, message, icon = 'check_circle', type = 'primary') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastId = 'toast_' + Date.now();
  const iconColor = type === 'secondary' ? 'text-secondary' : type === 'error' ? 'text-error' : 'text-primary';
  const bgColor = 'bg-surface-container-lowest border-outline-variant/20 shadow-xl';

  const toastEl = document.createElement('div');
  toastEl.id = toastId;
  toastEl.className = `flex items-center gap-3 p-4 rounded-xl ${bgColor} border text-on-surface transform transition-all duration-300 translate-y-3 opacity-0 min-w-[280px] max-w-sm`;
  toastEl.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-lg ${iconColor}">${icon}</span>
    </div>
    <div class="flex-1 pr-2">
      <p class="font-headline font-bold text-sm leading-snug">${title}</p>
      <p class="text-xs text-on-surface-variant line-clamp-1">${message}</p>
    </div>
    <button class="text-outline hover:text-on-surface transition-colors close-toast-btn">
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  `;

  container.appendChild(toastEl);

  // Trigger animation
  requestAnimationFrame(() => {
    toastEl.classList.remove('translate-y-3', 'opacity-0');
  });

  const removeToast = () => {
    toastEl.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toastEl.remove(), 300);
  };

  toastEl.querySelector('.close-toast-btn').addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function setupModalListeners() {
  // Backdrop clicks and close buttons
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Close when clicking modal backdrop outside content
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Notification Drawer Trigger & Mark All Read
  const notifBtn = document.getElementById('notif-bell-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      renderNotificationDrawer();
      openModal('notif-drawer-modal');
    });
  }

  const markAllReadBtn = document.getElementById('mark-all-read-btn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      store.markAllNotificationsAsRead();
      renderNotificationDrawer();
      showToast('Notifications Cleared', 'All alerts marked as read.', 'done_all');
    });
  }

  // New Flow Modal Form Submit
  const newFlowForm = document.getElementById('new-flow-form');
  if (newFlowForm) {
    newFlowForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('flow-title-input').value.trim();
      const category = document.getElementById('flow-category-input').value;
      const description = document.getElementById('flow-desc-input').value.trim();
      const trigger = document.getElementById('flow-trigger-input').value.trim();
      const action = document.getElementById('flow-action-input').value.trim();
      const impact = document.getElementById('flow-impact-input').value.trim() || '-10% kWh';

      if (!title) return;

      store.addAutomation({
        title,
        category,
        type: category,
        description: description || 'Automated smart resource optimization rule.',
        trigger: trigger || 'Schedule rule',
        action: action || 'Optimize device setpoint',
        impact,
        devicesAffected: 2,
        icon: category === 'water' ? 'water_drop' : category === 'ev' ? 'ev_station' : category === 'climate' ? 'thermostat' : 'eco'
      });

      closeModal('new-flow-modal');
      newFlowForm.reset();
      showToast('Flow Created', `"${title}" is now active in Luminous Engine.`, 'auto_mode');
    });
  }

  // EV Schedule Modal Confirm
  const evScheduleForm = document.getElementById('ev-schedule-form');
  if (evScheduleForm) {
    evScheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetSoc = document.getElementById('ev-soc-range').value;
      const departure = document.getElementById('ev-departure-input').value;
      store.updateSettings({ evTargetSoc: +targetSoc, evDepartureTime: departure });
      
      closeModal('ev-schedule-modal');
      showToast('EV Schedule Locked', `Target ${targetSoc}% by ${departure}. Off-peak tariff active.`, 'ev_station', 'secondary');
    });
  }
}

export function renderNotificationDrawer() {
  const container = document.getElementById('notif-list-container');
  if (!container) return;

  const notifications = store.notifications;
  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-outline">
        <span class="material-symbols-outlined text-4xl mb-2">notifications_off</span>
        <p class="font-medium text-sm">No new notifications</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notifications
    .map((n) => {
      const iconColor = n.category === 'water' ? 'text-secondary' : n.severity === 'warning' ? 'text-error' : 'text-primary';
      const bgOpacity = n.unread ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-80';
      const unreadDot = n.unread ? '<div class="w-2 h-2 rounded-full bg-primary shrink-0"></div>' : '';

      return `
      <div class="p-4 rounded-xl ${bgOpacity} transition-all flex items-start gap-3 hover:bg-surface-container">
        <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined ${iconColor}">${n.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h5 class="font-headline font-bold text-sm truncate text-on-surface">${n.title}</h5>
            ${unreadDot}
          </div>
          <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">${n.message}</p>
          <span class="text-[10px] text-outline font-label mt-2 block">${n.timestamp}</span>
        </div>
      </div>
    `;
    })
    .join('');
}

export function renderApplianceManagerModal() {
  const container = document.getElementById('appliances-manager-grid');
  if (!container) return;

  container.innerHTML = store.appliances
    .map((app) => {
      const isWater = app.type === 'water';
      const metricValue = isWater ? `${app.waterFlowLpm} L/m` : `${app.powerKw > 0 ? '+' : ''}${app.powerKw} kW`;
      const metricColor = isWater ? 'text-secondary' : app.powerKw < 0 ? 'text-primary-container' : 'text-on-surface';

      return `
      <div class="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg ${isWater ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} flex items-center justify-center">
              <span class="material-symbols-outlined">${app.icon}</span>
            </div>
            <div>
              <h4 class="font-headline font-bold text-sm text-on-surface">${app.name}</h4>
              <p class="text-[11px] text-outline">${app.room}</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" ${app.enabled ? 'checked' : ''} class="sr-only peer appliance-manager-toggle" data-id="${app.id}">
            <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isWater ? 'peer-checked:bg-secondary' : 'peer-checked:bg-primary'}"></div>
          </label>
        </div>
        <div class="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
          <span class="text-xs text-outline font-medium">Live Draw</span>
          <span class="font-headline font-bold text-sm ${metricColor}">${metricValue}</span>
        </div>
      </div>
    `;
    })
    .join('');

  // Attach toggle listeners
  container.querySelectorAll('.appliance-manager-toggle').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      store.toggleAppliance(id);
    });
  });
}

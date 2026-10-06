const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const apiService = {
  // Appliances
  getAppliances: async () => {
    return await fetchWithTimeout(`${API_BASE_URL}/appliances`);
  },
  updateAppliance: async (id, appData) => {
    return await fetchWithTimeout(`${API_BASE_URL}/appliances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
  },

  // Automations
  getAutomations: async () => {
    return await fetchWithTimeout(`${API_BASE_URL}/automations`);
  },
  createAutomation: async (flowData) => {
    return await fetchWithTimeout(`${API_BASE_URL}/automations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flowData)
    });
  },
  updateAutomation: async (id, flowData) => {
    return await fetchWithTimeout(`${API_BASE_URL}/automations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flowData)
    });
  },
  deleteAutomation: async (id) => {
    return await fetchWithTimeout(`${API_BASE_URL}/automations/${id}`, {
      method: 'DELETE'
    });
  },
  triggerAutomation: async (id) => {
    return await fetchWithTimeout(`${API_BASE_URL}/automations/${id}/trigger`, {
      method: 'POST'
    });
  },

  // Notifications
  getNotifications: async () => {
    return await fetchWithTimeout(`${API_BASE_URL}/notifications`);
  },
  markAllNotificationsRead: async () => {
    return await fetchWithTimeout(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT'
    });
  },
  markNotificationRead: async (id) => {
    return await fetchWithTimeout(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  // Settings
  getSettings: async () => {
    return await fetchWithTimeout(`${API_BASE_URL}/settings`);
  },
  updateSettings: async (settingsData) => {
    return await fetchWithTimeout(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
  }
};

import express from 'express';
import Appliance from '../models/Appliance.js';
import Automation from '../models/Automation.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// Fallback initial data in case MongoDB is connecting for the first time
import {
  DEFAULT_APPLIANCES,
  DEFAULT_AUTOMATIONS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SETTINGS
} from '../../src/context/defaultData.js';

// Initialize DB defaults if empty
const seedInitialDataIfNeeded = async () => {
  try {
    const appCount = await Appliance.countDocuments();
    if (appCount === 0) {
      await Appliance.insertMany(DEFAULT_APPLIANCES);
    }
    const autoCount = await Automation.countDocuments();
    if (autoCount === 0) {
      await Automation.insertMany(DEFAULT_AUTOMATIONS);
    }
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany(DEFAULT_NOTIFICATIONS);
    }
    const setDoc = await Settings.findOne({ key: 'global_settings' });
    if (!setDoc) {
      await Settings.create({ key: 'global_settings', ...DEFAULT_SETTINGS });
    }
  } catch (e) {
    console.warn('[MongoDB Seed] Skipped auto-seed:', e.message);
  }
};

// 1. Appliances Endpoints
router.get('/appliances', async (req, res) => {
  try {
    await seedInitialDataIfNeeded();
    const appliances = await Appliance.find();
    res.json(appliances.length > 0 ? appliances : DEFAULT_APPLIANCES);
  } catch (e) {
    res.json(DEFAULT_APPLIANCES);
  }
});

router.put('/appliances/:id', async (req, res) => {
  try {
    const updated = await Appliance.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Automations Endpoints
router.get('/automations', async (req, res) => {
  try {
    await seedInitialDataIfNeeded();
    const automations = await Automation.find().sort({ createdAt: -1 });
    res.json(automations.length > 0 ? automations : DEFAULT_AUTOMATIONS);
  } catch (e) {
    res.json(DEFAULT_AUTOMATIONS);
  }
});

router.post('/automations', async (req, res) => {
  try {
    const newFlow = new Automation({
      id: req.body.id || 'flow_' + Date.now(),
      ...req.body
    });
    const saved = await newFlow.save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/automations/:id', async (req, res) => {
  try {
    const updated = await Automation.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/automations/:id', async (req, res) => {
  try {
    await Automation.deleteOne({ id: req.params.id });
    res.json({ success: true, id: req.params.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/automations/:id/trigger', async (req, res) => {
  try {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = await Automation.findOneAndUpdate(
      { id: req.params.id },
      { lastTriggered: `Today, ${nowStr}`, enabled: true },
      { new: true }
    );
    res.json({ success: true, flow: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Notifications Endpoints
router.get('/notifications', async (req, res) => {
  try {
    await seedInitialDataIfNeeded();
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications.length > 0 ? notifications : DEFAULT_NOTIFICATIONS);
  } catch (e) {
    res.json(DEFAULT_NOTIFICATIONS);
  }
});

router.put('/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { unread: false });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate({ id: req.params.id }, { unread: false }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Settings Endpoints
router.get('/settings', async (req, res) => {
  try {
    await seedInitialDataIfNeeded();
    const settings = await Settings.findOne({ key: 'global_settings' });
    res.json(settings ? settings.toObject() : DEFAULT_SETTINGS);
  } catch (e) {
    res.json(DEFAULT_SETTINGS);
  }
});

router.put('/settings', async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { key: 'global_settings' },
      { ...req.body, key: 'global_settings' },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. System Telemetry & Health Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'EcoSync Luminous Engine Node.js Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;

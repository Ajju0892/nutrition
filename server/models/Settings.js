import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_settings', unique: true },
    gridStandard: { type: String, default: 'Northern European (Nordic Power Pool)' },
    peakRate: { type: Number, default: 0.38 },
    offPeakRate: { type: Number, default: 0.14 },
    currencySymbol: { type: String, default: '$' },
    energyUnit: { type: String, default: 'kWh' },
    waterUnit: { type: String, default: 'Liters' },
    aiSensitivity: { type: String, default: 'Optimal (Balanced)' },
    autoLeakShutoff: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    themeMode: { type: String, default: 'light' },
    evTargetSoc: { type: Number, default: 85 },
    evDepartureTime: { type: String, default: '07:00' },
    evChargingMode: { type: String, default: 'Off-Peak Smart Charge' },
    gateways: { type: Array, default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

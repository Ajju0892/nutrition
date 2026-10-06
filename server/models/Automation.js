import mongoose from 'mongoose';

const AutomationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'energy' },
    category: { type: String, default: 'energy' },
    icon: { type: String, default: 'auto_mode' },
    enabled: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    devicesAffected: { type: Number, default: 1 },
    impact: { type: String, default: '-10% kWh' },
    nextCycle: { type: String },
    trigger: { type: String, default: 'Schedule rule' },
    action: { type: String, default: 'Optimize setpoint' },
    lastTriggered: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Automation || mongoose.model('Automation', AutomationSchema);

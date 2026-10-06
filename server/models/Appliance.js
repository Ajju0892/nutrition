import mongoose from 'mongoose';

const ApplianceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // 'energy' or 'water'
    category: { type: String, required: true },
    icon: { type: String, required: true },
    room: { type: String, default: 'Living Zone' },
    powerKw: { type: Number, default: 0 },
    basePowerKw: { type: Number, default: 1.0 },
    waterFlowLpm: { type: Number, default: 0 },
    baseWaterFlowLpm: { type: Number, default: 0 },
    enabled: { type: Boolean, default: false },
    dailyKwh: { type: Number, default: 0 },
    dailyWaterL: { type: Number, default: 0 },
    changeVsLw: { type: String, default: 'Stable' },
    changeType: { type: String, default: 'neutral' }
  },
  { timestamps: true }
);

export default mongoose.models.Appliance || mongoose.model('Appliance', ApplianceSchema);

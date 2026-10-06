import React, { useState } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';

const PRESET_TEMPLATES = [
  {
    title: 'Smart Pool Pump Solar Sync',
    category: 'energy',
    icon: 'pool',
    description: 'Diverts solar surplus to run pool filtration pumps when rooftop solar exceeds 3.0 kW.',
    trigger: 'Rooftop solar generation > 3.0 kW',
    action: 'Run primary pool filtration pump at full capacity',
    impact: '-$14.50/mo'
  },
  {
    title: 'Sub-Zero Pipe Protection',
    category: 'water',
    icon: 'ac_unit',
    description: 'Triggers pulse micro-recirculation when outdoor temperature drops below 0°C.',
    trigger: 'Outdoor Temp < 0°C & zero fixture flow for 2h',
    action: 'Pulse recirculating pump 45s every 30 mins',
    impact: 'Zero freeze risk'
  },
  {
    title: 'Off-Peak Washing Machine Delay',
    category: 'water',
    icon: 'local_laundry_service',
    description: 'Holds washing machine start until utility tariff drops to off-peak rate.',
    trigger: 'Tariff drops to off-peak ($0.14/kWh)',
    action: 'Release smart washer lock & send start signal',
    impact: '-$6.20/mo'
  },
  {
    title: 'Midnight Quiet HVAC Ramp',
    category: 'climate',
    icon: 'bedtime',
    description: 'Lowers HVAC compressor speed and fan noise after 11 PM for quiet sleep.',
    trigger: 'Time == 11:00 PM',
    action: 'Set thermostat to 22°C (Quiet Mode 35dB)',
    impact: '-8% kWh'
  }
];

export default function NewFlowModal() {
  const { activeModal, setActiveModal, addAutomation } = useEcoSync();

  const [formData, setFormData] = useState({
    title: '',
    category: 'energy',
    description: '',
    trigger: '',
    action: '',
    impact: '-10% kWh'
  });

  const isOpen = activeModal === 'new_flow';
  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setFormData({
      title: preset.title,
      category: preset.category,
      description: preset.description,
      trigger: preset.trigger,
      action: preset.action,
      impact: preset.impact
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addAutomation({
      title: formData.title.trim(),
      category: formData.category,
      type: formData.category,
      description: formData.description.trim() || 'Automated smart resource optimization rule.',
      trigger: formData.trigger.trim() || 'Schedule rule',
      action: formData.action.trim() || 'Optimize device setpoint',
      impact: formData.impact.trim() || '-10% kWh'
    });

    setFormData({
      title: '',
      category: 'energy',
      description: '',
      trigger: '',
      action: '',
      impact: '-10% kWh'
    });
    setActiveModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 glass-modal-bg flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-xl bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl border border-outline-variant/20 animate-scale-up my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">auto_mode</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">
                Create Automation Flow
              </h3>
              <p className="text-xs text-outline">Configure Luminous Engine rules</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Quick Presets Carousel */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
            One-Click Preset Templates
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {PRESET_TEMPLATES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-primary/10 text-left border border-outline-variant/10 transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface group-hover:text-primary mb-1">
                  <span className="material-symbols-outlined text-base text-primary">{p.icon}</span>
                  <span className="truncate">{p.title}</span>
                </div>
                <span className="text-[10px] text-outline line-clamp-1">{p.impact} • {p.category}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Flow Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart Pool Pump Solar Sync"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="energy">Energy (Power)</option>
                <option value="water">Water (Flow)</option>
                <option value="ev">EV Charging</option>
                <option value="climate">Climate / HVAC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Expected Impact
              </label>
              <input
                type="text"
                placeholder="e.g. -15% kWh"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Explain how this flow saves resources..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Trigger Condition
            </label>
            <input
              type="text"
              placeholder="e.g. Rooftop solar exceeds 3.5 kW"
              value={formData.trigger}
              onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Orchestrated Action
            </label>
            <input
              type="text"
              placeholder="e.g. Divert power to high-capacity pool filtration"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-sm font-medium text-on-surface border-0 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-outline hover:text-on-surface text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-container/20 transition-all"
            >
              Arm Flow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


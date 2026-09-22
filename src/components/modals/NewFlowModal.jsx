import React, { useState } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


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
      className="fixed inset-0 z-50 glass-modal-bg flex items-center justify-center p-4"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl border border-outline-variant/20 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15 mb-6">
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

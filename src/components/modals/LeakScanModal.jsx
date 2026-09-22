import React, { useState, useEffect } from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function LeakScanModal() {
  const { activeModal, setActiveModal, showToast } = useEcoSync();
  const [scanStep, setScanStep] = useState('idle'); // 'scanning', 'complete'
  const [progress, setProgress] = useState(0);

  const isOpen = activeModal === 'leak_scan';

  useEffect(() => {
    if (isOpen) {
      setScanStep('scanning');
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStep('complete');
            return 100;
          }
          return prev + 25;
        });
      }, 350);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    setActiveModal(null);
    showToast('Acoustic Scan Finished', 'All 6 zones verified. Zero leak anomalies.', 'verified', 'secondary');
  };

  return (
    <div
      className="fixed inset-0 z-50 glass-modal-bg flex items-center justify-center p-4"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl border border-outline-variant/20 text-center animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl animate-pulse">water_drop</span>
        </div>

        <h3 className="font-headline font-bold text-2xl text-on-surface">
          {scanStep === 'scanning' ? 'Diagnostic Acoustic Scan' : 'All Water Zones Secure'}
        </h3>
        <p className="text-xs text-outline mt-2 max-w-xs mx-auto">
          {scanStep === 'scanning'
            ? 'Analyzing micro-vibration signatures across main shutoff and sub-meters...'
            : '0.00 L/min baseline idle flow confirmed across Kitchen, Bathrooms, and Garden lines.'}
        </p>

        {/* Progress bar */}
        <div className="my-6">
          <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-outline mt-2">
            <span>Scan Progress</span>
            <span className="text-secondary">{progress}%</span>
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={scanStep === 'scanning'}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            scanStep === 'complete'
              ? 'bg-secondary text-on-secondary hover:shadow-lg hover:shadow-secondary/20'
              : 'bg-surface-container text-outline cursor-not-allowed'
          }`}
        >
          {scanStep === 'scanning' ? 'Scanning Network...' : 'Acknowledge & Close'}
        </button>
      </div>
    </div>
  );
}

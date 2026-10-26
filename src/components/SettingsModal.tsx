import React, { useState } from 'react';
import { AppSettings, CalculationMethodKey, MadhabKey } from '../types';
import { CALCULATION_METHOD_DESCRIPTIONS } from '../services/prayerService';
import { chimeService } from '../services/chimeService';
import { X, Sliders, Volume2, Clock, Check, Plus, Minus } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'method' | 'offsets' | 'audio'>('method');

  if (!isOpen) return null;

  const methodsList: CalculationMethodKey[] = [
    'MWL',
    'ISNA',
    'Egyptian',
    'Makkah',
    'Karachi',
    'Dubai',
    'Singapore',
    'Qatar',
    'Kuwait',
    'Tehran',
    'MoonsightingCommittee'
  ];

  const handleOffsetChange = (prayerKey: keyof AppSettings['offsets'], delta: number) => {
    setLocalSettings(prev => ({
      ...prev,
      offsets: {
        ...prev.offsets,
        [prayerKey]: Math.max(-30, Math.min(30, prev.offsets[prayerKey] + delta))
      }
    }));
  };

  const handleSaveAndClose = () => {
    onSave(localSettings);
    onClose();
  };

  const testChime = () => {
    chimeService.playGentleChime(0.6);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-panel-highlight rounded-3xl p-6 lg:p-8 flex flex-col max-h-[90vh] shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Calculation & Dashboard Settings
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Astronomical parameters, juristic rules, and minute adjustments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 my-4 p-1 bg-slate-900/60 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('method')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              activeTab === 'method'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Method & Madhab
          </button>
          <button
            onClick={() => setActiveTab('offsets')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              activeTab === 'offsets'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Minute Adjustments
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio & Display
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {activeTab === 'method' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 block">
                  Select Calculation Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {methodsList.map((m) => {
                    const isSelected = localSettings.method === m;
                    const meta = CALCULATION_METHOD_DESCRIPTIONS[m];
                    return (
                      <button
                        key={m}
                        onClick={() => setLocalSettings(prev => ({ ...prev, method: m }))}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                            : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm font-['Outfit']">{meta.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{meta.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 block">
                  Asr Juristic Method (Madhab)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['shafi', 'hanafi'] as MadhabKey[]).map((madhab) => {
                    const isSelected = localSettings.madhab === madhab;
                    return (
                      <button
                        key={madhab}
                        onClick={() => setLocalSettings(prev => ({ ...prev, madhab }))}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                            : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm capitalize font-['Outfit']">
                            {madhab === 'shafi' ? 'Standard (Shafi, Maliki, Hanbali)' : 'Hanafi'}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {madhab === 'shafi'
                            ? 'Shadow length equals object height + solar noon shadow'
                            : 'Shadow length equals 2x object height + solar noon shadow'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offsets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-mono mb-3">
                Fine-tune calculated times by adding or subtracting minutes (e.g. to match your local municipality or mosque calendar):
              </p>
              {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((pKey) => {
                const val = localSettings.offsets[pKey];
                return (
                  <div
                    key={pKey}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-white/5"
                  >
                    <div>
                      <span className="font-bold text-white capitalize font-['Outfit'] text-base">
                        {pKey}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 font-mono">
                        {val === 0 ? 'No offset' : `${val > 0 ? '+' : ''}${val} minutes`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOffsetChange(pKey, -1)}
                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 border border-white/10 cursor-pointer"
                        aria-label={`Decrease ${pKey} offset`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-base text-cyan-400">
                        {val > 0 ? `+${val}` : val}
                      </span>
                      <button
                        onClick={() => handleOffsetChange(pKey, 1)}
                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-200 border border-white/10 cursor-pointer"
                        aria-label={`Increase ${pKey} offset`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white font-['Outfit']">Prayer Transition Chime</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gentle harmonic chime alert when prayer time arrives
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={testChime}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-white/10 cursor-pointer"
                  >
                    Play Test Chime
                  </button>
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, chimeEnabled: !prev.chimeEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      localSettings.chimeEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                        localSettings.chimeEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white font-['Outfit']">Clock Time Display Format</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle between standard 12-hour AM/PM and 24-hour military clock
                  </p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, timeFormat: '12h' }))}
                    className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors cursor-pointer ${
                      localSettings.timeFormat === '12h' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    12 Hours
                  </button>
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, timeFormat: '24h' }))}
                    className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors cursor-pointer ${
                      localSettings.timeFormat === '24h' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    24 Hours
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-mono shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

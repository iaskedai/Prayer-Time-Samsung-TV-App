import React from 'react';
import { PrayerItem, AppSettings } from '../types';
import { X, Sun, Compass, Clock, Sliders } from 'lucide-react';

interface PrayerDetailModalProps {
  prayer: PrayerItem | null;
  settings: AppSettings;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const PrayerDetailModal: React.FC<PrayerDetailModalProps> = ({
  prayer,
  settings,
  onClose,
  onOpenSettings
}) => {
  if (!prayer) return null;

  const offsetMinutes = settings.offsets[prayer.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-highlight rounded-3xl p-6 lg:p-7 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Astronomical Detail
              </span>
              <h2 className="text-3xl font-extrabold text-white font-['Outfit']">
                {prayer.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Exact Time Today</span>
            </div>
            <span className="text-2xl font-bold font-mono text-white">
              {prayer.formattedTime}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Solar & Horizon Definition</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {prayer.angleInfo}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Calculation Method</span>
            <span className="text-cyan-400 font-semibold">{settings.method}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">User Minute Offset</span>
            <span className="text-amber-400 font-semibold">
              {offsetMinutes === 0 ? '0 min (None)' : `${offsetMinutes > 0 ? '+' : ''}${offsetMinutes} min`}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Adjust Offset</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-mono shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

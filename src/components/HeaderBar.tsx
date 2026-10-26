import React from 'react';
import { AppSettings } from '../types';
import { MapPin, Clock, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderBarProps {
  settings: AppSettings;
  currentTime: Date;
  dateFormatted: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  settings,
  currentTime,
  dateFormatted
}) => {
  const timeHours = settings.timeFormat === '24h'
    ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  const latFormatted = `${Math.abs(settings.city.latitude).toFixed(2)}° ${settings.city.latitude >= 0 ? 'N' : 'S'}`;
  const lngFormatted = `${Math.abs(settings.city.longitude).toFixed(2)}° ${settings.city.longitude >= 0 ? 'E' : 'W'}`;

  return (
    <header className="w-full flex items-center justify-between gap-6 px-6 py-4 glass-panel rounded-2xl shrink-0">
      {/* Zone 1: Brand & Location */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
              {settings.city.name}
            </span>
            <span className="text-sm font-medium text-slate-400">
              {settings.city.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>{latFormatted}, {lngFormatted}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{settings.city.timezone}</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Gregorian Calendar Date */}
      <div className="hidden md:flex flex-col items-center justify-center">
        <span className="text-base font-semibold tracking-wide text-slate-200 font-['Outfit']">
          {dateFormatted}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Calculation: <strong className="text-cyan-400 font-medium">{settings.method}</strong></span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Asr: <strong className="text-amber-400 font-medium capitalize">{settings.madhab}</strong></span>
        </div>
      </div>

      {/* Zone 3: Live Digital TV Clock & Audio Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/60 border border-white/5 text-xs text-slate-300">
          {settings.chimeEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className="font-mono">{settings.chimeEnabled ? 'CHIME ON' : 'MUTED'}</span>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 text-2xl lg:text-3xl font-bold tracking-tight text-white font-['JetBrains_Mono'] tabular-numbers">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{timeHours}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { PrayerSchedule } from '../types';
import { Sun, Sunset, Sunrise, Compass, Sparkles, Bell } from 'lucide-react';

interface SpotlightPanelProps {
  schedule: PrayerSchedule;
  chimeEnabled: boolean;
}

export const SpotlightPanel: React.FC<SpotlightPanelProps> = ({
  schedule,
  chimeEnabled
}) => {
  const next = schedule.nextPrayer;
  const current = schedule.currentPrayer;

  if (!next) return null;

  // Render celestial icon according to celestial phase
  const renderCelestialIcon = (phase: string) => {
    switch (phase) {
      case 'dawn':
      case 'sunrise':
        return <Sunrise className="w-10 h-10 text-amber-400" />;
      case 'zenith':
      case 'afternoon':
        return <Sun className="w-10 h-10 text-amber-300" />;
      case 'sunset':
        return <Sunset className="w-10 h-10 text-orange-400" />;
      case 'night':
      default:
        return <Sparkles className="w-10 h-10 text-cyan-300" />;
    }
  };

  return (
    <div className="w-full glass-panel-highlight rounded-3xl p-6 lg:p-8 relative overflow-hidden transition-all duration-300">
      {/* Ambient background light flare */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Next Prayer Spotlight info */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shrink-0 shadow-xl backdrop-blur-sm">
            {renderCelestialIcon(next.prayer.celestialPhase)}
          </div>

          <div>
            <div className="flex items-center gap-3 text-sm font-semibold tracking-wider text-cyan-400 uppercase font-mono mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next Astronomical Prayer</span>
              {chimeEnabled && (
                <span className="flex items-center gap-1 text-xs text-slate-400 font-normal lowercase">
                  <Bell className="w-3 h-3 text-emerald-400" />
                  chime active
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-['Outfit']">
                {next.prayer.name}
              </h1>
              <span className="text-xl lg:text-2xl font-medium text-slate-300 font-['JetBrains_Mono']">
                {next.prayer.formattedTime}
              </span>
            </div>

            <p className="text-xs lg:text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{next.prayer.subtitle}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{next.prayer.angleInfo}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Big 10-Foot Countdown Clock */}
        <div className="flex flex-col items-center md:items-end shrink-0">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase font-mono">
            Time Remaining
          </span>
          <div className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-amber-300 tracking-tight font-['JetBrains_Mono'] tabular-numbers drop-shadow-md">
            {next.countdownFormatted}
          </div>
          {current && (
            <span className="text-xs text-slate-400 mt-1 font-mono">
              Current Period: <strong className="text-slate-200">{current.name}</strong> ({current.formattedTime})
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar indicating time between previous and next prayer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{current ? current.name : 'Dawn Horizon'}</span>
          <span className="text-cyan-400">{next.progressPercentage}% of period elapsed</span>
          <span>{next.prayer.name}</span>
        </div>
        <div className="w-full h-2 bg-slate-900/80 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, Math.max(2, next.progressPercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

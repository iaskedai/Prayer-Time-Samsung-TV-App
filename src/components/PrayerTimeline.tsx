import React from 'react';
import { PrayerItem } from '../types';
import { Sunrise, Sun, Sunset, Sparkles, Clock, Compass } from 'lucide-react';

interface PrayerTimelineProps {
  prayers: PrayerItem[];
  focusedIndex: number;
  isZoneFocused: boolean;
  onSelectPrayer: (prayer: PrayerItem) => void;
  onCardHover?: (index: number) => void;
}

export const PrayerTimeline: React.FC<PrayerTimelineProps> = ({
  prayers,
  focusedIndex,
  isZoneFocused,
  onSelectPrayer,
  onCardHover
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Sparkles className="w-7 h-7 text-sky-300" />;
      case 'sunrise':
        return <Sunrise className="w-7 h-7 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-7 h-7 text-amber-300" />;
      case 'asr':
        return <Sun className="w-7 h-7 text-orange-400" />;
      case 'maghrib':
        return <Sunset className="w-7 h-7 text-rose-400" />;
      case 'isha':
      default:
        return <Sparkles className="w-7 h-7 text-indigo-300" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Daily Astronomical Solar Schedule</span>
        </h2>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          Use Remote D-Pad ◄ ► to select · Press OK for details
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 lg:gap-4">
        {prayers.map((prayer, index) => {
          const isFocused = isZoneFocused && focusedIndex === index;

          let cardStyle = 'glass-panel text-slate-200 border-white/10';
          let badgeText = '';
          let badgeStyle = '';

          if (prayer.isNext) {
            cardStyle = 'bg-slate-900/80 border-cyan-400/60 shadow-lg shadow-cyan-500/20';
            badgeText = 'UPCOMING';
            badgeStyle = 'text-cyan-300 font-mono bg-cyan-950/80 border border-cyan-500/40';
          } else if (prayer.isCurrent) {
            cardStyle = 'bg-slate-900/80 border-amber-400/60 prayer-pulse-glow';
            badgeText = 'ACTIVE NOW';
            badgeStyle = 'text-amber-300 font-mono bg-amber-950/80 border border-amber-500/40';
          } else if (prayer.isPassed) {
            cardStyle = 'glass-panel-subtle opacity-65 text-slate-400';
          }

          return (
            <button
              key={prayer.id}
              onClick={() => onSelectPrayer(prayer)}
              onMouseEnter={() => onCardHover && onCardHover(index)}
              className={`
                relative flex flex-col justify-between p-4 lg:p-5 rounded-2xl text-left cursor-pointer
                tv-focusable ${cardStyle}
                ${isFocused ? 'tv-focused' : ''}
              `}
              tabIndex={isFocused ? 0 : -1}
              aria-label={`${prayer.name} at ${prayer.formattedTime}`}
            >
              {/* Header inside card: Name and Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {getIcon(prayer.id)}
                </div>
                {badgeText && (
                  <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold ${badgeStyle}`}>
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Main prayer name and formatted time */}
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 block font-mono">
                  {prayer.subtitle}
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] mt-0.5">
                  {prayer.name}
                </h3>
                <div className="text-xl lg:text-2xl font-bold text-slate-100 font-['JetBrains_Mono'] tabular-numbers mt-1">
                  {prayer.formattedTime}
                </div>
              </div>

              {/* Bottom hint */}
              <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate">{prayer.angleInfo.split('·')[0]}</span>
                <Compass className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

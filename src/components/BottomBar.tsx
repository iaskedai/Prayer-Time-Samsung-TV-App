import React from 'react';
import { AppSettings } from '../types';
import { getTodayInspiration } from '../services/quotesService';
import { Settings, MapPin, Sliders, Volume2, VolumeX, Tv, Quote, Maximize2 } from 'lucide-react';

interface BottomBarProps {
  settings: AppSettings;
  focusedActionIndex: number;
  isZoneFocused: boolean;
  onOpenSettings: () => void;
  onOpenCitySelector: () => void;
  onToggleChime: () => void;
  onToggleRemoteSimulator: () => void;
  onActionHover?: (index: number) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  settings,
  focusedActionIndex,
  isZoneFocused,
  onOpenSettings,
  onOpenCitySelector,
  onToggleChime,
  onToggleRemoteSimulator,
  onActionHover
}) => {
  const quote = getTodayInspiration();

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const actionButtons = [
    {
      id: 'city',
      label: settings.city.name,
      sublabel: 'Change City',
      icon: <MapPin className="w-4 h-4 text-cyan-400" />,
      onClick: onOpenCitySelector
    },
    {
      id: 'method',
      label: settings.method,
      sublabel: 'Calculation Method',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      onClick: onOpenSettings
    },
    {
      id: 'chime',
      label: settings.chimeEnabled ? 'Chime ON' : 'Chime MUTED',
      sublabel: 'Audio Alert',
      icon: settings.chimeEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />,
      onClick: onToggleChime
    },
    {
      id: 'settings',
      label: 'Settings',
      sublabel: 'Offsets & Madhab',
      icon: <Settings className="w-4 h-4 text-sky-400" />,
      onClick: onOpenSettings
    },
    {
      id: 'remote',
      label: settings.showRemoteSimulator ? 'Hide Remote' : 'TV Remote',
      sublabel: 'D-Pad Simulator',
      icon: <Tv className="w-4 h-4 text-purple-400" />,
      onClick: onToggleRemoteSimulator
    },
    {
      id: 'fullscreen',
      label: 'Fullscreen',
      sublabel: '1080p/4K Mode',
      icon: <Maximize2 className="w-4 h-4 text-slate-300" />,
      onClick: handleToggleFullscreen
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch shrink-0">
      {/* Daily Inspiration Motivational Text Card */}
      <div className="lg:col-span-5 glass-panel rounded-2xl p-4 lg:p-5 flex items-start gap-3.5 relative overflow-hidden">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
          <Quote className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Daily Inspiration
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-400">{quote.theme}</span>
          </div>
          <p className="text-xs lg:text-sm text-slate-200 leading-relaxed font-serif italic">
            "{quote.text}"
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">
            — {quote.source}
          </span>
        </div>
      </div>

      {/* TV Bottom Settings and Action Controls */}
      <div className="lg:col-span-7 glass-panel rounded-2xl p-3 lg:p-3.5 flex items-center justify-between gap-2 overflow-x-auto">
        {actionButtons.map((btn, idx) => {
          const isFocused = isZoneFocused && focusedActionIndex === idx;

          return (
            <button
              key={btn.id}
              onClick={btn.onClick}
              onMouseEnter={() => onActionHover && onActionHover(idx)}
              className={`
                flex-1 min-w-[100px] flex flex-col items-center justify-center p-2.5 rounded-xl
                border border-white/5 bg-slate-900/50 text-slate-200 cursor-pointer
                tv-focusable-btn
                ${isFocused ? 'tv-focused' : 'hover:bg-slate-800/80 hover:border-white/10'}
              `}
              tabIndex={isFocused ? 0 : -1}
            >
              <div className="mb-1">{btn.icon}</div>
              <span className="text-xs font-semibold tracking-tight text-white font-['Outfit'] truncate max-w-full">
                {btn.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-full">
                {btn.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

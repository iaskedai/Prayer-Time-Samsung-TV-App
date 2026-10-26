import React, { useState } from 'react';
import { FocusZone } from '../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, Settings, MapPin, Volume2, X, Minimize2, Maximize2 } from 'lucide-react';

interface TVRemoteSimulatorProps {
  currentZone: FocusZone;
  timelineIndex: number;
  actionIndex: number;
  isModalOpen: boolean;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right' | 'enter' | 'back') => void;
  onOpenSettings: () => void;
  onOpenCitySelector: () => void;
  onToggleChime: () => void;
}

export const TVRemoteSimulator: React.FC<TVRemoteSimulatorProps> = ({
  currentZone,
  timelineIndex,
  actionIndex,
  isModalOpen,
  onNavigate,
  onOpenSettings,
  onOpenCitySelector,
  onToggleChime
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const getFocusDescription = () => {
    if (isModalOpen) return 'Active Dialog Window';
    if (currentZone === 'timeline') {
      const names = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      return `Prayer Card: ${names[timelineIndex] || 'Fajr'}`;
    }
    const actions = ['City', 'Method', 'Chime', 'Settings', 'Remote', 'Fullscreen'];
    return `Action Button: ${actions[actionIndex] || 'Action'}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold shadow-2xl backdrop-blur-md cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Show TV Remote</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-64 bg-slate-950/95 border border-slate-700/80 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-200">
      {/* Remote Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Tizen TV Remote
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Minimize remote"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Close remote"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* D-Pad Spatial Navigation Disc */}
      <div className="relative w-40 h-40 mx-auto my-2 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 shadow-inner flex items-center justify-center">
        {/* Up Button */}
        <button
          onClick={() => onNavigate('up')}
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-t-full transition-colors cursor-pointer"
          title="Remote D-Pad Up (ArrowUp)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* Down Button */}
        <button
          onClick={() => onNavigate('down')}
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-b-full transition-colors cursor-pointer"
          title="Remote D-Pad Down (ArrowDown)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* Left Button */}
        <button
          onClick={() => onNavigate('left')}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-l-full transition-colors cursor-pointer"
          title="Remote D-Pad Left (ArrowLeft)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Button */}
        <button
          onClick={() => onNavigate('right')}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-12 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-r-full transition-colors cursor-pointer"
          title="Remote D-Pad Right (ArrowRight)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Center OK / Enter Button */}
        <button
          onClick={() => onNavigate('enter')}
          className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold font-mono text-sm flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          title="Remote OK / Select (Enter)"
        >
          OK
        </button>
      </div>

      {/* Auxiliary TV Remote Buttons */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
        <button
          onClick={() => onNavigate('back')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Remote Back (Escape / Backspace / Tizen 10009)"
        >
          <CornerDownLeft className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[9px] font-mono uppercase">Back</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Remote Settings (Key S)"
        >
          <Settings className="w-4 h-4 mb-0.5 text-sky-400" />
          <span className="text-[9px] font-mono uppercase">Setup</span>
        </button>

        <button
          onClick={onOpenCitySelector}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Remote City (Key C)"
        >
          <MapPin className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span className="text-[9px] font-mono uppercase">City</span>
        </button>

        <button
          onClick={onToggleChime}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Remote Chime Mute/Unmute (Key T)"
        >
          <Volume2 className="w-4 h-4 mb-0.5 text-emerald-400" />
          <span className="text-[9px] font-mono uppercase">Mute</span>
        </button>
      </div>

      {/* Real-time Focus Telemetry indicator */}
      <div className="mt-3 p-2 rounded-xl bg-slate-900/80 border border-white/5 text-[10px] font-mono flex items-center justify-between text-slate-400">
        <span>Focused:</span>
        <span className="text-cyan-400 font-semibold truncate max-w-[130px]">
          {getFocusDescription()}
        </span>
      </div>

      <div className="mt-2 text-[10px] text-slate-500 font-mono text-center">
        Keyboard: Arrow Keys · Enter · Esc
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CityPreset } from '../types';
import { POPULAR_CITIES } from '../services/prayerService';
import { MapPin, X, Check, Search, Globe } from 'lucide-react';

interface CitySelectorModalProps {
  currentCity: CityPreset;
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityPreset) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  currentCity,
  isOpen,
  onClose,
  onSelectCity
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customLat, setCustomLat] = useState('51.5074');
  const [customLng, setCustomLng] = useState('-0.1278');

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng)) return;

    const customCity: CityPreset = {
      id: `custom-${Date.now()}`,
      name: customName.trim() || 'Custom Location',
      country: customCountry.trim() || 'GPS Coordinates',
      latitude: lat,
      longitude: lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      defaultMethod: 'MWL'
    };

    onSelectCity(customCity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel-highlight rounded-3xl p-6 lg:p-8 flex flex-col max-h-[85vh] shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Select City & Coordinates
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Astronomical times are computed strictly based on solar coordinates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toggle between preset and custom coordinates */}
        <div className="flex gap-2 my-4 p-1 bg-slate-900/60 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setCustomMode(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              !customMode ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Major Global Cities
          </button>
          <button
            onClick={() => setCustomMode(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
              customMode ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom GPS Coordinates
          </button>
        </div>

        {!customMode ? (
          <>
            {/* Search Input */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Cities List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredCities.map((city) => {
                const isSelected = currentCity.name === city.name;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white font-['Outfit'] block">
                          {city.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {city.country} · {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-xs text-cyan-400 font-mono font-semibold">
                        <span>Selected</span>
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Custom Coordinates Form */
          <form onSubmit={handleApplyCustom} className="flex-1 flex flex-col justify-between">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    City Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UK"
                    value={customCountry}
                    onChange={e => setCustomCountry(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Latitude (-90 to +90)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={customLat}
                    onChange={e => setCustomLat(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Longitude (-180 to +180)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={customLng}
                    onChange={e => setCustomLng(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-mono shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                Apply Custom Coordinates
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

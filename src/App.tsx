/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings, FocusZone, PrayerItem } from './types';
import { loadSettings, saveSettings, calculatePrayerSchedule } from './services/prayerService';
import { chimeService } from './services/chimeService';
import { HeaderBar } from './components/HeaderBar';
import { SpotlightPanel } from './components/SpotlightPanel';
import { PrayerTimeline } from './components/PrayerTimeline';
import { BottomBar } from './components/BottomBar';
import { SettingsModal } from './components/SettingsModal';
import { CitySelectorModal } from './components/CitySelectorModal';
import { PrayerDetailModal } from './components/PrayerDetailModal';
import { TVRemoteSimulator } from './components/TVRemoteSimulator';
import { TVInstallGuideModal } from './components/TVInstallGuideModal';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [focusZone, setFocusZone] = useState<FocusZone>('timeline');
  const [timelineIndex, setTimelineIndex] = useState<number>(0);
  const [actionIndex, setActionIndex] = useState<number>(0);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [detailPrayer, setDetailPrayer] = useState<PrayerItem | null>(null);

  // Keep track of previous next prayer to trigger chime on transition
  const prevNextPrayerIdRef = useRef<string | null>(null);

  // Compute live prayer schedule
  const schedule = calculatePrayerSchedule(settings, currentTime);

  // Register Samsung Tizen remote keys if running on real Tizen OS
  useEffect(() => {
    try {
      const win = window as unknown as {
        tizen?: {
          tvinputdevice?: {
            registerKey: (keyName: string) => void;
            getSupportedKeys: () => { name: string }[];
          };
        };
      };
      if (win.tizen && win.tizen.tvinputdevice) {
        const keysToRegister = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Info', 'MediaPlayPause'];
        keysToRegister.forEach(k => {
          try {
            win.tizen?.tvinputdevice?.registerKey(k);
          } catch {
            // Ignore if key registration fails
          }
        });
      }
    } catch {
      // Graceful fallback for browser
    }
  }, []);

  // Sync initial focused card with the upcoming prayer
  useEffect(() => {
    if (schedule.nextPrayer) {
      const idx = schedule.prayers.findIndex(p => p.id === schedule.nextPrayer?.prayer.id);
      if (idx !== -1) {
        setTimelineIndex(idx);
      }
    }
  }, [settings.city.id, settings.method]);

  // 1-second live clock ticker & chime trigger on prayer arrival
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check prayer arrival
      if (schedule.nextPrayer) {
        const currentNextId = schedule.nextPrayer.prayer.id;
        if (schedule.nextPrayer.remainingSeconds === 0) {
          if (settings.chimeEnabled && prevNextPrayerIdRef.current !== currentNextId) {
            chimeService.playGentleChime(0.6);
            prevNextPrayerIdRef.current = currentNextId;
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [schedule.nextPrayer, settings.chimeEnabled]);

  // Save settings on update
  const handleSaveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleToggleChime = useCallback(() => {
    setSettings(prev => {
      const updated = { ...prev, chimeEnabled: !prev.chimeEnabled };
      saveSettings(updated);
      if (updated.chimeEnabled) {
        chimeService.playGentleChime(0.5);
      }
      return updated;
    });
  }, []);

  const handleToggleRemote = useCallback(() => {
    setSettings(prev => {
      const updated = { ...prev, showRemoteSimulator: !prev.showRemoteSimulator };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Spatial Navigation Engine for TV Remote D-Pad
  const handleNavigate = useCallback((direction: 'up' | 'down' | 'left' | 'right' | 'enter' | 'back') => {
    // If any modal is open, back closes it
    if (direction === 'back') {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (isCitySelectorOpen) {
        setIsCitySelectorOpen(false);
        return;
      }
      if (isInstallGuideOpen) {
        setIsInstallGuideOpen(false);
        return;
      }
      if (detailPrayer) {
        setDetailPrayer(null);
        return;
      }
      // If no modal open, return focus to timeline
      setFocusZone('timeline');
      return;
    }

    // Modal is open: handle enter to close if on action
    if (isSettingsOpen || isCitySelectorOpen || isInstallGuideOpen || detailPrayer) {
      if (direction === 'enter') {
        if (detailPrayer) setDetailPrayer(null);
        if (isInstallGuideOpen) setIsInstallGuideOpen(false);
      }
      return;
    }

    // Timeline navigation
    if (focusZone === 'timeline') {
      if (direction === 'left') {
        setTimelineIndex(prev => (prev > 0 ? prev - 1 : 5));
      } else if (direction === 'right') {
        setTimelineIndex(prev => (prev < 5 ? prev + 1 : 0));
      } else if (direction === 'down') {
        setFocusZone('actions');
      } else if (direction === 'enter') {
        setDetailPrayer(schedule.prayers[timelineIndex]);
      }
    }
    // Actions navigation (7 buttons: City, Method, Chime, Settings, Install, Remote, Fullscreen)
    else if (focusZone === 'actions') {
      if (direction === 'left') {
        setActionIndex(prev => (prev > 0 ? prev - 1 : 6));
      } else if (direction === 'right') {
        setActionIndex(prev => (prev < 6 ? prev + 1 : 0));
      } else if (direction === 'up') {
        setFocusZone('timeline');
      } else if (direction === 'enter') {
        switch (actionIndex) {
          case 0: // City
            setIsCitySelectorOpen(true);
            break;
          case 1: // Method
          case 3: // Settings
            setIsSettingsOpen(true);
            break;
          case 2: // Chime
            handleToggleChime();
            break;
          case 4: // Install on TV Guide
            setIsInstallGuideOpen(true);
            break;
          case 5: // Remote
            handleToggleRemote();
            break;
          case 6: // Fullscreen
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
            break;
        }
      }
    }
  }, [
    focusZone,
    timelineIndex,
    actionIndex,
    isSettingsOpen,
    isCitySelectorOpen,
    isInstallGuideOpen,
    detailPrayer,
    schedule.prayers,
    handleToggleChime,
    handleToggleRemote
  ]);

  // Physical keyboard & TV remote hardware key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Standard Tizen and web key mappings
      const keyCode = e.keyCode;

      // 37 = Left, 38 = Up, 39 = Right, 40 = Down
      // 13 = Enter, 27 = Escape, 8 = Backspace, 10009 = Tizen Return Key
      if (e.key === 'ArrowLeft' || keyCode === 37) {
        e.preventDefault();
        handleNavigate('left');
      } else if (e.key === 'ArrowRight' || keyCode === 39) {
        e.preventDefault();
        handleNavigate('right');
      } else if (e.key === 'ArrowUp' || keyCode === 38) {
        e.preventDefault();
        handleNavigate('up');
      } else if (e.key === 'ArrowDown' || keyCode === 40) {
        e.preventDefault();
        handleNavigate('down');
      } else if (e.key === 'Enter' || keyCode === 13) {
        e.preventDefault();
        handleNavigate('enter');
      } else if (e.key === 'Escape' || e.key === 'Backspace' || keyCode === 27 || keyCode === 8 || keyCode === 10009) {
        e.preventDefault();
        handleNavigate('back');
      } else if (e.key.toLowerCase() === 's') {
        setIsSettingsOpen(true);
      } else if (e.key.toLowerCase() === 'c') {
        setIsCitySelectorOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        handleToggleChime();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, handleToggleChime]);

  const isModalActive = isSettingsOpen || isCitySelectorOpen || isInstallGuideOpen || !!detailPrayer;

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between select-none"
      role="application"
      aria-label="Tizen TV Prayer Dashboard"
    >
      {/* Darkened Scenic Nature Backdrop (Misty Mountain Twilight) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 pointer-events-none"
        style={{
          backgroundImage: `url('/src/assets/images/misty_mountain_twilight_1793041128367.jpg')`
        }}
      />

      {/* Measured Dark Scrim to guarantee WCAG AA contrast from 10 feet away */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/80 pointer-events-none" />

      {/* Subtle animated twilight ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 10-Foot UI Safe Zone Container */}
      <div className="relative z-10 w-full h-full tv-safe-zone flex flex-col justify-between gap-4 max-w-[1920px] mx-auto">
        {/* Top Section: Header Bar */}
        <HeaderBar
          settings={settings}
          currentTime={currentTime}
          dateFormatted={schedule.dateFormatted}
        />

        {/* Center Spotlight: Hero Countdown */}
        <div className="my-auto py-2">
          <SpotlightPanel
            schedule={schedule}
            chimeEnabled={settings.chimeEnabled}
          />
        </div>

        {/* Mid Section: Horizontal 6-Card Timeline */}
        <div className="py-1">
          <PrayerTimeline
            prayers={schedule.prayers}
            focusedIndex={timelineIndex}
            isZoneFocused={focusZone === 'timeline' && !isModalActive}
            onSelectPrayer={(prayer) => setDetailPrayer(prayer)}
            onCardHover={(idx) => {
              setFocusZone('timeline');
              setTimelineIndex(idx);
            }}
          />
        </div>

        {/* Bottom Section: Daily Inspiration & TV Actions Strip */}
        <BottomBar
          settings={settings}
          focusedActionIndex={actionIndex}
          isZoneFocused={focusZone === 'actions' && !isModalActive}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCitySelector={() => setIsCitySelectorOpen(true)}
          onToggleChime={handleToggleChime}
          onToggleRemoteSimulator={handleToggleRemote}
          onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          onActionHover={(idx) => {
            setFocusZone('actions');
            setActionIndex(idx);
          }}
        />
      </div>

      {/* Floating On-Screen TV Remote Simulator */}
      {settings.showRemoteSimulator && (
        <TVRemoteSimulator
          currentZone={focusZone}
          timelineIndex={timelineIndex}
          actionIndex={actionIndex}
          isModalOpen={isModalActive}
          onNavigate={handleNavigate}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCitySelector={() => setIsCitySelectorOpen(true)}
          onToggleChime={handleToggleChime}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      {/* City Selector Modal */}
      <CitySelectorModal
        currentCity={settings.city}
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        onSelectCity={(city) => {
          handleSaveSettings({
            ...settings,
            city,
            method: city.defaultMethod || settings.method
          });
        }}
      />

      {/* Prayer Astronomical Detail Modal */}
      <PrayerDetailModal
        prayer={detailPrayer}
        settings={settings}
        onClose={() => setDetailPrayer(null)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* TV Installation Guide Modal */}
      <TVInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        appUrl={typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-tnd7f4acyr6klo6zxboing-585530473025.europe-west2.run.app'}
      />
    </main>
  );
}

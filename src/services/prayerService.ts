import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { AppSettings, CityPreset, CalculationMethodKey, MadhabKey, PrayerSchedule, PrayerItem } from '../types';

export const POPULAR_CITIES: CityPreset[] = [
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    defaultMethod: 'MWL'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    defaultMethod: 'ISNA'
  },
  {
    id: 'mecca',
    name: 'Mecca',
    country: 'Saudi Arabia',
    latitude: 21.4225,
    longitude: 39.8262,
    timezone: 'Asia/Riyadh',
    defaultMethod: 'Makkah'
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: 'Europe/Istanbul',
    defaultMethod: 'MWL'
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
    defaultMethod: 'Egyptian'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
    defaultMethod: 'Dubai'
  },
  {
    id: 'karachi',
    name: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    timezone: 'Asia/Karachi',
    defaultMethod: 'Karachi'
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    country: 'Indonesia',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    defaultMethod: 'Singapore'
  },
  {
    id: 'kuala-lumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    latitude: 3.1390,
    longitude: 101.6869,
    timezone: 'Asia/Kuala_Lumpur',
    defaultMethod: 'Singapore'
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    defaultMethod: 'ISNA'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    defaultMethod: 'MWL'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    latitude: 52.5200,
    longitude: 13.4050,
    timezone: 'Europe/Berlin',
    defaultMethod: 'MWL'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    defaultMethod: 'Singapore'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    defaultMethod: 'MWL'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    defaultMethod: 'MWL'
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    latitude: 41.8781,
    longitude: -87.6298,
    timezone: 'America/Chicago',
    defaultMethod: 'ISNA'
  }
];

export const CALCULATION_METHOD_DESCRIPTIONS: Record<CalculationMethodKey, { label: string; desc: string }> = {
  ISNA: {
    label: 'ISNA (North America)',
    desc: 'Fajr 15°, Isha 15° · Islamic Society of North America'
  },
  MWL: {
    label: 'Muslim World League (MWL)',
    desc: 'Fajr 18°, Isha 17° · Standard European & International'
  },
  Egyptian: {
    label: 'Egyptian General Authority',
    desc: 'Fajr 19.5°, Isha 17.5° · Africa, Syria, Lebanon'
  },
  Makkah: {
    label: 'Umm Al-Qura (Makkah)',
    desc: 'Fajr 18.5°, Isha 90 min after Maghrib · Arabian Peninsula'
  },
  Karachi: {
    label: 'University of Karachi',
    desc: 'Fajr 18°, Isha 18° · Pakistan, India, Bangladesh'
  },
  Tehran: {
    label: 'Institute of Geophysics, Tehran',
    desc: 'Fajr 17.7°, Isha 14°, Maghrib 4.5°'
  },
  Dubai: {
    label: 'Dubai Standard',
    desc: 'Fajr 18.2°, Isha 18.2° · United Arab Emirates'
  },
  Qatar: {
    label: 'Qatar Standard',
    desc: 'Fajr 18°, Isha 90 min after Maghrib · State of Qatar'
  },
  Kuwait: {
    label: 'Kuwait Standard',
    desc: 'Fajr 18°, Isha 17.5° · State of Kuwait'
  },
  Singapore: {
    label: 'Singapore (MUIS)',
    desc: 'Fajr 20°, Isha 18° · Singapore & Southeast Asia'
  },
  MoonsightingCommittee: {
    label: 'Moonsighting Committee',
    desc: 'Fajr 18°, Isha 18° with seasonal high latitude rules'
  }
};

const SETTINGS_STORAGE_KEY = 'tizen_prayer_dashboard_settings_v1';

export function getDefaultSettings(): AppSettings {
  return {
    city: POPULAR_CITIES[0], // Default London, UK for testing as requested
    method: 'MWL',
    madhab: 'shafi',
    offsets: {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    },
    chimeEnabled: true,
    timeFormat: '12h',
    showRemoteSimulator: true
  };
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return getDefaultSettings();
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultSettings(),
      ...parsed,
      offsets: {
        ...getDefaultSettings().offsets,
        ...(parsed.offsets || {})
      }
    };
  } catch (err) {
    console.warn('Failed to load settings from localStorage, using defaults:', err);
    return getDefaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err);
  }
}

function getCalculationParams(methodKey: CalculationMethodKey, madhabKey: MadhabKey) {
  let params;
  switch (methodKey) {
    case 'ISNA':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'MWL':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'Makkah':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'Tehran':
      params = CalculationMethod.Tehran();
      break;
    case 'Dubai':
      params = CalculationMethod.Dubai();
      break;
    case 'Qatar':
      params = CalculationMethod.Qatar();
      break;
    case 'Kuwait':
      params = CalculationMethod.Kuwait();
      break;
    case 'Singapore':
      params = CalculationMethod.Singapore();
      break;
    case 'MoonsightingCommittee':
      params = CalculationMethod.MoonsightingCommittee();
      break;
    default:
      params = CalculationMethod.MuslimWorldLeague();
  }

  params.madhab = madhabKey === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function formatTime(date: Date, timeFormat: '12h' | '24h' = '12h'): string {
  if (timeFormat === '24h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function calculatePrayerSchedule(
  settings: AppSettings,
  targetDate: Date = new Date()
): PrayerSchedule {
  const coordinates = new Coordinates(settings.city.latitude, settings.city.longitude);
  const params = getCalculationParams(settings.method, settings.madhab);

  // Apply minute adjustments
  params.adjustments = {
    fajr: settings.offsets.fajr,
    sunrise: settings.offsets.sunrise,
    dhuhr: settings.offsets.dhuhr,
    asr: settings.offsets.asr,
    maghrib: settings.offsets.maghrib,
    isha: settings.offsets.isha
  };

  const todayPrayers = new PrayerTimes(coordinates, targetDate, params);

  // Tomorrow's Fajr for countdown if after today's Isha
  const tomorrowDate = new Date(targetDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowPrayers = new PrayerTimes(coordinates, tomorrowDate, params);

  const nowMs = targetDate.getTime();

  // Create list of raw items
  const rawList: {
    id: PrayerItem['id'];
    name: string;
    subtitle: string;
    time: Date;
    angleInfo: string;
    celestialPhase: PrayerItem['celestialPhase'];
  }[] = [
    {
      id: 'fajr',
      name: 'Fajr',
      subtitle: 'Astronomical Dawn',
      time: todayPrayers.fajr,
      angleInfo: 'Sub-horizon dawn twilight angle',
      celestialPhase: 'dawn'
    },
    {
      id: 'sunrise',
      name: 'Sunrise',
      subtitle: 'Solar Meridian Horizon',
      time: todayPrayers.sunrise,
      angleInfo: 'Solar disk upper limb reaches eastern horizon',
      celestialPhase: 'sunrise'
    },
    {
      id: 'dhuhr',
      name: 'Dhuhr',
      subtitle: 'Solar Noon Zenith',
      time: todayPrayers.dhuhr,
      angleInfo: 'Sun passes solar meridian zenith point',
      celestialPhase: 'zenith'
    },
    {
      id: 'asr',
      name: 'Asr',
      subtitle: 'Mid-Afternoon Descent',
      time: todayPrayers.asr,
      angleInfo: settings.madhab === 'hanafi' ? 'Shadow length equals object + 2x shadow' : 'Shadow length equals object + noon shadow',
      celestialPhase: 'afternoon'
    },
    {
      id: 'maghrib',
      name: 'Maghrib',
      subtitle: 'Dusk Sunset Horizon',
      time: todayPrayers.maghrib,
      angleInfo: 'Complete disappearance of solar disk past western horizon',
      celestialPhase: 'sunset'
    },
    {
      id: 'isha',
      name: 'Isha',
      subtitle: 'Night Sky Darkness',
      time: todayPrayers.isha,
      angleInfo: 'Complete disappearance of twilight glow across evening sky',
      celestialPhase: 'night'
    }
  ];

  // Determine current, next, and passed status
  let nextItemIndex = -1;
  for (let i = 0; i < rawList.length; i++) {
    if (rawList[i].time.getTime() > nowMs) {
      nextItemIndex = i;
      break;
    }
  }

  let currentItemIndex = -1;
  if (nextItemIndex === -1) {
    // All prayers today have passed, currently in Isha period
    currentItemIndex = 5;
  } else if (nextItemIndex === 0) {
    // Before Fajr, still night
    currentItemIndex = -1;
  } else {
    currentItemIndex = nextItemIndex - 1;
  }

  const prayers: PrayerItem[] = rawList.map((item, idx) => {
    const isPassed = nextItemIndex !== -1 ? idx < nextItemIndex : true;
    const isNext = idx === nextItemIndex;
    const isCurrent = idx === currentItemIndex;

    return {
      ...item,
      formattedTime: formatTime(item.time, settings.timeFormat),
      isNext,
      isCurrent,
      isPassed
    };
  });

  // Calculate Next Prayer countdown
  let nextPrayerTarget: PrayerItem;
  let prevPrayerTimeMs: number;
  let remainingSeconds = 0;

  if (nextItemIndex !== -1) {
    nextPrayerTarget = prayers[nextItemIndex];
    remainingSeconds = Math.max(0, Math.floor((nextPrayerTarget.time.getTime() - nowMs) / 1000));
    prevPrayerTimeMs = nextItemIndex > 0 ? prayers[nextItemIndex - 1].time.getTime() : prayers[5].time.getTime() - 24 * 3600 * 1000;
  } else {
    // Next is tomorrow's Fajr
    const tomorrowFajrTime = tomorrowPrayers.fajr;
    remainingSeconds = Math.max(0, Math.floor((tomorrowFajrTime.getTime() - nowMs) / 1000));
    nextPrayerTarget = {
      id: 'fajr',
      name: 'Fajr (Tomorrow)',
      subtitle: 'Dawn Twilight',
      time: tomorrowFajrTime,
      formattedTime: formatTime(tomorrowFajrTime, settings.timeFormat),
      isNext: true,
      isCurrent: false,
      isPassed: false,
      angleInfo: 'Tomorrow astronomical dawn',
      celestialPhase: 'dawn'
    };
    prevPrayerTimeMs = prayers[5].time.getTime(); // Isha today
  }

  // Calculate progress percentage between previous and next prayer
  const nextPrayerTimeMs = nextPrayerTarget.time.getTime();
  const totalWindowMs = Math.max(1, nextPrayerTimeMs - prevPrayerTimeMs);
  const elapsedMs = Math.max(0, Math.min(totalWindowMs, nowMs - prevPrayerTimeMs));
  const progressPercentage = Math.round((elapsedMs / totalWindowMs) * 100);

  // Standard Gregorian date format (e.g. "Monday, October 26, 2026")
  const dateFormatted = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    prayers,
    nextPrayer: {
      prayer: nextPrayerTarget,
      remainingSeconds,
      countdownFormatted: formatCountdown(remainingSeconds),
      progressPercentage
    },
    currentPrayer: currentItemIndex >= 0 ? prayers[currentItemIndex] : null,
    dateFormatted
  };
}

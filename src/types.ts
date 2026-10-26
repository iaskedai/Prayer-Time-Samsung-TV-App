export type CalculationMethodKey =
  | 'ISNA'
  | 'MWL'
  | 'Egyptian'
  | 'Makkah'
  | 'Karachi'
  | 'Tehran'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'Singapore'
  | 'MoonsightingCommittee';

export type MadhabKey = 'shafi' | 'hanafi';

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  defaultMethod: CalculationMethodKey;
}

export interface PrayerOffsets {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface AppSettings {
  city: CityPreset;
  method: CalculationMethodKey;
  madhab: MadhabKey;
  offsets: PrayerOffsets;
  chimeEnabled: boolean;
  timeFormat: '12h' | '24h';
  showRemoteSimulator: boolean;
}

export interface PrayerItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  subtitle: string;
  time: Date;
  formattedTime: string;
  isNext: boolean;
  isCurrent: boolean;
  isPassed: boolean;
  angleInfo: string;
  celestialPhase: 'dawn' | 'sunrise' | 'zenith' | 'afternoon' | 'sunset' | 'night';
}

export interface PrayerSchedule {
  prayers: PrayerItem[];
  nextPrayer: {
    prayer: PrayerItem;
    remainingSeconds: number;
    countdownFormatted: string;
    progressPercentage: number;
  } | null;
  currentPrayer: PrayerItem | null;
  dateFormatted: string;
}

export type FocusZone = 'timeline' | 'actions' | 'modal' | 'cityModal';

# Tizen TV Prayer Dashboard

High-performance, 10-foot UI prayer time dashboard engineered specifically for Smart TVs and Tizen Web OS with lightweight rendering, spatial D-pad remote navigation, and precise astronomical calculation.

> [!IMPORTANT]
> **Confirmed Design & Technical Decisions from Phase 1:**
> - **Visual Atmosphere**: Misty mountain peaks backdrop with dynamic twilight ambient lighting, high contrast for 10-foot living-room legibility, and no religious iconography (clean celestial and natural motifs only).
> - **Prayer Alert System**: Non-intrusive visual glow pulse on the active prayer card accompanied by an optional gentle synthesized audio chime.
> - **Testing & Navigation Affordance**: Physical TV remote D-Pad & keyboard handling (Up, Down, Left, Right, Enter/OK, Back, Settings) paired with a collapsible on-screen virtual TV remote simulator for effortless desktop testing.
> - **Architecture**: Zero-overhead DOM layout engineered for TV processors, standard Tizen packaging manifest (`config.xml`), and local astronomical solar math via `adhan` calculation engines.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a dedicated, always-on smart TV dashboard displaying real-time astronomical prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha), live countdown to the next prayer, smooth current-time and Gregorian date clock, custom location/calculation method adjustments, and a daily inspirational contemplation quote.
- **Target Audience / Persona**: Household members viewing from 10+ feet away on living-room Samsung Tizen Smart TVs, requiring high-contrast readability, calm aesthetics, and frictionless remote-control operation.
- **Key Value**: Low CPU and memory footprint avoiding sluggish TV DOM reflows, zero external cloud dependencies for daily calculations, reliable local persistence, and instant remote accessibility.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Ambient Dashboard View**: TV turns on or launches app into full-screen 1080p/4K view with ambient twilight mountain landscape, live digital clock (`HH:MM:SS`), Gregorian date banner, and prominent spotlight countdown ("Dhuhr in 01:24:18").
2. **Prayer Timeline**: 6 horizontal glassmorphic prayer cards across the center (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha). The active prayer is illuminated with a soft gold/cyan aura; the upcoming prayer displays remaining time; passed prayers are dimmed.
3. **Remote Spatial Navigation (D-Pad)**: Pressing Left/Right highlights individual prayer cards to inspect exact angles, offsets, and solar timings. Pressing Down navigates to the bottom action bar (Settings, Location Selector, Method Selector, Audio Toggle, Remote Help).
4. **Settings & Adjustment Modal**: Pressing Enter on Settings opens a focused TV-friendly glass overlay allowing immediate selection of calculation method (ISNA, MWL, Egyptian, Umm Al-Qura, Karachi, Dubai), Asr juristic school (Standard / Hanafi), manual minute adjustments, and preset cities (London, New York, Mecca, Istanbul, Singapore, Tokyo, Sydney, etc.) with custom coordinates.
5. **Daily Inspiration Card**: A serene, rotating daily contemplation quote at the bottom right that encourages mindfulness and focus without visual clutter.

#### Visual Identity & Theme
- **Aesthetic Direction**: Cinematic Twilight Glassmorphism. Darkened moody mountain backdrop with soft ethereal gradient lighting, frosted glass panels (`backdrop-blur-md bg-slate-900/60 border border-white/10`), and deep visual hierarchy.
- **Color Palette**:
  - Neutral Canvas: Deep Obsidian & Midnight Slate (`#0B0F19`, `#111827`)
  - Translucent Glass Surfaces: `#1E293B` at 50%–70% opacity with 1px hairline border `rgba(255, 255, 255, 0.12)`
  - Active Glow / Accent: Warm Dawn Gold (`#F59E0B`, `#FBBF24`) and Twilight Cyan (`#06B6D4`, `#38BDF8`)
  - Spatial Focus Ring: High-visibility 3px electric cyan/amber outline with soft elevation glow
- **Typography & Hierarchy**:
  - Primary Display: *Plus Jakarta Sans* / *Outfit* with large display numerals (`clamp(3.5rem, 6vw, 6rem)`) for 10-foot readability.
  - Telemetry & Countdown: Tabular numbers (`tabular-nums font-mono`) preventing horizontal jitter on second-by-second updates.
  - Metadata: Clean unboxed typography with typographic separators (`·`). Zero pill clutter.
- **Interactive Feedback & Motion**:
  - Smooth scale transition (`scale-105`) on focused cards with GPU-accelerated transforms.
  - Prayer transition pulse and soft Web Audio API synthesizer chime (no external audio assets required, guaranteed zero latency).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Framework Footprint & Tizen TV Performance**
  - *Chosen Approach*: Lightweight modular architecture utilizing modern DOM rendering with hardware-accelerated CSS and minimal memory footprint, structured alongside standard Tizen configuration files (`config.xml`, `icon.png`, `index.html`, `js/app.js`).
  - *Why*: Smart TV processors (especially budget Tizen quad-core ARM chips) suffer dropped frames with heavyweight virtual DOM trees and large bundle sizes. A lean architecture guarantees 60fps animations and immediate remote responsiveness.
  - *Alternatives Considered*: Heavy single-page-app frameworks that bundle dozens of unused polyfills and cause input lag on TV remotes.

- **Decision 2: Calculation Engine & Offline Independence**
  - *Chosen Approach*: Embed the standard `adhan` astronomical engine and bundle calculation methods (ISNA, MWL, Egyptian, Makkah, Karachi, Tehran, Gulf) directly into the app with local coordinate resolution and `localStorage` caching.
  - *Why*: Prayer times must calculate accurately even during network dropouts or offline TV operation without external API rate-limiting or downtime.
  - *Alternatives Considered*: Cloud API fetch on every boot (vulnerable to API failures, slow network latency on TV boot).

- **Decision 3: Remote Navigation & D-Pad Engine**
  - *Chosen Approach*: Spatial navigation state machine tracking focused elements across two primary horizontal planes (Cards Plane and Action Bar Plane) with standard Tizen key codes (37=Left, 38=Up, 39=Right, 40=Down, 13=Enter, 10009=Tizen Return/Back).
  - *Why*: Native TV navigation requires predictable 2D grid spatial focus without trap states or mouse cursor assumptions.
  - *Alternatives Considered*: Mouse-only clicks or unstructured tab indexing.

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIZEN TV WEB PLATFORM                           │
│   (config.xml Tizen Package Manifest + 1080p/4K Viewport Controller)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴────────────────────────────────┐
    │                 TV KEYBOARD & REMOTE CONTROLLER                │
    │  • D-Pad (Up/Down/Left/Right) • Enter/OK • Back/Return (10009) │
    │  • On-Screen Virtual Remote Simulator (Desktop / Dev Preview)  │
    └───────────────────────────────┬────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         CORE DASHBOARD ENGINE                          │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │   ASTRONOMICAL CALC       │      │     LOCAL STORAGE STORE     │   │
│   │   • `adhan` solar math    │◄────►│   • Selected City / Coords  │   │
│   │   • ISNA, MWL, Egypt, etc.│      │   • Method & Juristic Asr   │   │
│   │   • Minute offsets        │      │   • Audio Chime Preference  │   │
│   └─────────────┬─────────────┘      └─────────────────────────────┘   │
│                 │                                                      │
│                 ▼                                                      │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │     TICK & ALERT ENGINE   │      │     SYNTH CHIME ENGINE      │   │
│   │   • 1s clock & countdown  │─────►│   • Web Audio API oscillator│   │
│   │   • Current/Next detector │      │   • Harmonious chime tone   │   │
│   └─────────────┬─────────────┘      └─────────────────────────────┘   │
└─────────────────┼──────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        VIEWPORT RENDERING TREE                         │
│                                                                        │
│   [ Header Bar ]       City Name · Gregorian Date · Live Clock         │
│   [ Spotlight Banner ] Next Prayer Highlight & Large Countdown Timer   │
│   [ Timeline 6-Cards ] Fajr │ Sunrise │ Dhuhr │ Asr │ Maghrib │ Isha   │
│   [ Lower Strip ]      Daily Inspiration Card & Current Calculation Bar│
│   [ TV Control Strip ] Method Selector · City Switcher · Chime Toggle │
│   [ Modals / Dialogs ] Location Search & Settings Configuration Dialog │
└────────────────────────────────────────────────────────────────────────┘
```

#### State & Data Models

- **`AppSettings`**:
  - `city`: string (e.g., `"London, United Kingdom"`)
  - `coordinates`: `{ latitude: number, longitude: number }`
  - `method`: `"ISNA" | "MWL" | "MuslimWorldLeague" | "Egyptian" | "Karachi" | "UmmAlQura" | "Dubai" | "Qatar" | "Kuwait"`
  - `madhab`: `"shafi" | "hanafi"` (for Asr calculation)
  - `offsets`: `{ fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }`
  - `chimeEnabled`: boolean
  - `timeFormat`: `"12h" | "24h"`

- **`PrayerDay`**:
  - Array of 6 prayer items: `{ id, name, time: Date, formattedTime: string, isNext: boolean, isCurrent: boolean, isPassed: boolean, icon: string }`
  - `nextPrayer`: `{ name: string, time: Date, countdownFormatted: string, totalSeconds: number }`

#### Interactive Component & Navigation Mapping
- **Spatial Grid Zones**:
  - `Zone 0 (Timeline)`: Focus index 0 to 5 (Fajr to Isha cards). Pressing Enter opens detailed timing specs for that prayer.
  - `Zone 1 (Action Controls)`: Focus index 0 to 4 (Change City, Calculation Method, Audio Toggle, Settings, Remote Help). Pressing Enter activates the corresponding modal/toggle.
  - `Zone 2 (Modal Dialog)`: When Settings or City modal is open, D-Pad Up/Down navigates modal options; Enter selects; Back (or Escape) closes.
- **TV Remote Simulator**:
  - Fixed floating glass widget on the bottom-right of the screen (toggleable via key or button) with Power, D-Pad, OK, Back, and Settings buttons, allowing developers and reviewers to test TV controls directly with mouse clicks or physical keyboard arrows.

# Samsung Tizen TV Web Application Packaging Guide

This application is built with standard HTML5, ES6 JavaScript, and lightweight CSS conforming to Samsung Smart TV guidelines and Tizen Web Device Specifications (Tizen 3.0+ up to 8.0).

## Tizen Package Structure
```
├── config.xml             # Tizen TV Widget & Application Manifest
├── index.html             # Full-screen 1080p/4K TV entry point
├── icon.png               # 512x512 Smart TV home launcher icon
├── src/                   # Source architecture with local adhan engine
└── dist/                  # Built web distribution
```

## How to Package for Samsung Smart TV (.wgt)

1. Build the production assets:
   ```bash
   npm run build
   ```

2. Copy `config.xml` and `icon.png` into the `dist/` folder:
   ```bash
   cp config.xml dist/
   ```

3. Package into `.wgt` using the Samsung Tizen CLI:
   ```bash
   tizen package -t wgt -s <your-security-profile> -- dist/
   ```

4. Install onto your Samsung Smart TV (in Developer Mode):
   ```bash
   sdb connect <tv-ip-address>
   tizen install -n TizenPrayerDashboard.wgt -t <device-id>
   ```

## Remote Control Key Mappings
- **D-Pad Left / Right** (37 / 39): Navigate prayer cards and action items
- **D-Pad Up / Down** (38 / 40): Switch between timeline row and bottom toolbar
- **Enter / OK** (13): Select item, open prayer solar details, toggle setting
- **Back / Return** (10009 / Esc / Backspace): Close active modal or return focus
- **S**: Quick Open Settings
- **C**: Quick Open City Selector
- **T**: Toggle Audio Chime

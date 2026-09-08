# EcoSync — Luminous Engine Smart Home Dashboard

EcoSync is a resource intelligence and smart home automation dashboard built following the **Veridian Flow ("Digital Fluidity & Resource Intelligence")** design guidelines.

---

## ✨ Features

- **The Luminous Engine**: Concentric animated dual dials for live energy (`kWh`) and water (`Liters`) tracking.
- **Active Appliances Carousel**: Real-time load shedding and power relays for HVAC, EV Charger, Smart Sprinkler, Dishwasher, Heat Pump, and Solar Inverter.
- **Interactive Multi-Period Usage Trends**: Compare energy and water across 24-Hour, 7-Day, 30-Day, and 1-Year horizons with hover inspection.
- **Automations Flow Manager**: Category-based rule orchestration (Peak Eco Mode, Rain Defense, EV Off-Peak Tariff, Solar Diverter).
- **Settings & Gateways**: Dynamic utility pricing, grid standards (Nordic Pool, CAISO, UK National Grid), AI sensitivity controls, hardware sensor health monitors, and telemetry JSON exports.
- **Interactive Modals**: Notification slide-over drawer, EV off-peak scheduler, whole-home appliance manager, and dynamic toast notifications.

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- Python 3 or Node.js (for local HTTP server).

### Running Locally

Using Python:
```bash
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

Using Node (`npx`):
```bash
npx serve .
```

---

## 📁 Project Structure

```
├── index.html                 # Root single-page application entry point
├── veridian_flow/
│   └── DESIGN.md              # Design system documentation & tokens
├── main_dashboard/            # Original view prototype & reference
├── automations/               # Original view prototype & reference
├── usage_history/             # Original view prototype & reference
└── src/
    ├── app.js                 # Application coordinator & router
    ├── styles/
    │   └── main.css           # Glassmorphism, animations, & typography
    ├── context/
    │   └── store.js           # Reactive state store & telemetry simulator
    └── components/
        ├── common/modals.js   # Notification drawer, modals, toast stack
        ├── dashboard/         # Luminous dial, appliance toggles
        ├── usage/             # Multi-period chart, consumer breakdown
        ├── automations/       # Active flows, category filter
        └── settings/          # Tariffs, AI sensitivity, gateways
```

---

## 🎨 Design System
- **Fonts**: Space Grotesk (numerical metrics & headlines), Inter (body & labels).
- **Palette**: `primary` (#006d32), `primary-container` (#00d166), `secondary` (#0059bb), `surface` (#f8f9ff), `inverse-surface` (#213145).
- **Surface Hierarchy**: Tonal layering without 1px rigid borders.

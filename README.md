# 🌞 Smart Adaptive Solar Tracking System (SASTS)- By HackU

> A low-cost, self-powered dual-axis solar tracking system that maximizes energy output using intelligent light-based tracking — with a real-time web dashboard for monitoring and control.

[![License: Educational](https://img.shields.io/badge/License-Educational-blue.svg)](LICENSE)
[![SDG 7](https://img.shields.io/badge/UN%20SDG-7%20Affordable%20Energy-yellow)](https://sdgs.un.org/goals/goal7)
[![SDG 9](https://img.shields.io/badge/UN%20SDG-9%20Industry%20%26%20Innovation-orange)](https://sdgs.un.org/goals/goal9)
[![SDG 11](https://img.shields.io/badge/UN%20SDG-11%20Sustainable%20Cities-green)](https://sdgs.un.org/goals/goal11)
[![SDG 13](https://img.shields.io/badge/UN%20SDG-13%20Climate%20Action-brightgreen)](https://sdgs.un.org/goals/goal13)

---

## 📌 Overview

The **Smart Adaptive Solar Tracking System (SASTS)** improves the efficiency of solar panels by dynamically aligning them with the sun's position throughout the day. It combines hardware-level dual-axis tracking with a **web-based dashboard (SolarTrack)** that enables real-time monitoring, remote control, and data analytics — all from a browser.

---

## ✨ Key Features

- 🔄 Dual-axis solar tracking using LDR sensors
- 🧠 Intelligent Arduino-based decision-making
- ⚡ Fully self-powered (solar + battery)
- 🌥️ **Weather-adaptive logic** — pauses movement during low-light / cloudy conditions to conserve power
- 🌐 **SolarTrack Web Dashboard** — live monitoring, manual control, history, and analytics
- 🔌 **USB Serial Control** — direct Arduino control via Web Serial API (Chrome/Edge)
- 📊 Real-time charts, efficiency metrics, and alert system

---

## 🚨 Problem Statement

- Fixed solar panels lose **30–40% efficiency** due to static positioning
- Existing commercial trackers:
  - Consume excess energy for motor actuation
  - Move unnecessarily in cloudy or low-light conditions
  - Are expensive and unsuitable for rural/off-grid areas
- No accessible monitoring or control interface for small-scale systems

---

## 💡 Our Solution

SASTS introduces a smart, energy-aware tracking system paired with a full-stack monitoring platform:

| Layer | What we built |
|---|---|
| **Hardware** | Dual-axis tracker with 4× LDR sensors + 2× servo motors |
| **Firmware** | Arduino Uno R3 — intelligent sun-seeking + weather-adaptive logic |
| **Power** | Self-powered via 5W–10W solar panel + 18650 Li-ion battery |
| **Software** | SolarTrack web dashboard — live data, manual D-pad control, analytics |

---

## 🌐 SolarTrack — Web Dashboard

SolarTrack is a browser-based monitoring and control interface built for SASTS.

### Dashboard Sections

| Section | Description |
|---|---|
| **Dashboard** | Real-time voltage, power, light intensity, efficiency ring, and panel position animation |
| **Live Data** | Big-number live sensor readouts — azimuth, elevation, W/m² |
| **History** | Timestamped log of the last 30 sensor readings |
| **Analytics** | Daily energy yield chart, efficiency trend, performance summary |
| **Alerts** | System health alerts — warnings, info, and critical events |
| **Control** | Manual D-pad control panel with USB Serial (Web Serial API) — sends commands directly to Arduino |

### Manual Control

The **Control** panel connects to the Arduino over USB using the **Web Serial API** (Chrome / Edge). Commands are sent as plain text over serial at 9600 baud:

```
UP\n    — tilt panel upward
DOWN\n  — tilt panel downward
LEFT\n  — rotate panel left
RIGHT\n — rotate panel right
RESET\n — return to home position
STOP\n  — emergency stop
```

This matches `Serial.readStringUntil('\n')` in the Arduino firmware.

---

## 🌥️ Weather-Adaptive Logic

SASTS does not blindly track the sun. The system reads light intensity continuously and applies adaptive rules:

- If all four LDR sensors read below a threshold → **movement pauses** (cloudy / night)
- Prevents unnecessary motor actuation → **saves battery power**
- Resumes tracking automatically when light recovers
- The SolarTrack dashboard reflects real-time light intensity (W/m²) and displays tracking status

This makes SASTS suitable for regions with variable weather and intermittent cloud cover.

---

## 🔧 Components Used

### 🧠 Core Electronics

| Component | Qty |
|---|---|
| Arduino Uno R3 | 1 |
| LDR Sensors | 4 |
| SG90 Servo Motors | 2 |

### ⚡ Power System

| Component | Qty |
|---|---|
| Solar Panel (5W–10W) | 1 |
| 18650 Li-ion Battery | 1 |
| TP4056 Charging Module | 1 |
| DC-DC Boost Converter | 1 |

### 🔌 Supporting Components

- Resistors (10kΩ × 4)
- Breadboard + Jumper Wires

### 🏗️ Mechanical

- Solar panel mounting frame
- Servo brackets
- Base platform (wood / acrylic / 3D printed)

---

## 🔄 Working Principle

```
1. LDR sensors sample sunlight intensity from all 4 directions
2. Arduino compares sensor values
3. Weather check — if light is below threshold, skip movement
4. System calculates optimal pan/tilt direction
5. Servo motors adjust panel position (horizontal + vertical)
6. SolarTrack dashboard receives and displays updated data
```

---

## 📊 Results

| Metric | Value |
|---|---|
| Energy output improvement | **30–40%** vs fixed panels |
| Power source | Fully self-powered |
| Approximate build cost | **₹2,500** |
| Dashboard latency | ~2 second update interval |
| Supported browsers (Control) | Chrome, Edge (Web Serial API) |

---

## 🌍 UN Sustainable Development Goals Alignment

SASTS directly contributes to four UN SDGs:

### ⚡ SDG 7 — Affordable and Clean Energy
Increases solar panel output by 30–40% without additional panels, making renewable energy more accessible and cost-effective for low-income and rural communities.

### 🏭 SDG 9 — Industry, Innovation and Infrastructure
Demonstrates an affordable, locally-buildable smart energy system (₹2,500) using widely available components — promoting sustainable industrial innovation accessible to developing regions.

### 🏙️ SDG 11 — Sustainable Cities and Communities
Enables small-scale, off-grid solar installations for homes, farms, and community spaces — supporting energy-resilient, sustainable communities without dependence on centralized power grids.

### 🌍 SDG 13 — Climate Action
Maximizes energy harvested from each solar panel, reducing the number of panels needed to meet energy demand, which directly lowers manufacturing carbon footprint and accelerates the transition away from fossil fuels.

---

## 🚀 Future Scope

- 📡 **IoT integration** — WebSocket / MQTT for remote real-time monitoring
- 🤖 **AI-based predictive tracking** — use sun position algorithms (SPA) instead of LDRs
- 🌦️ **Weather API integration** — pre-emptively pause tracking based on forecast data
- 🔋 **Battery health monitoring** — track charge cycles in the dashboard
- 📱 **Mobile app** — Android/iOS companion for SolarTrack

---

## 👥 Team

| Name |
|---|
| Vedang Tiwari |
| Mayur Singh |
| Mahek Tiwari |
| Eshha Kuckian |

*Shree L. R. Tiwari College of Engineering*

---

## 📎 License

This project is developed for **educational and innovation purposes**.  
Feel free to fork, adapt, and build upon it for non-commercial use.

---
## 📎 Video Link

https://drive.google.com/file/d/1LH3cOWUQVn2p0_gdcqOmC1rO6zl3TSOs/view?usp=drivesdk

---
<p align="center">
  Made with ☀️ by Team SASTS &nbsp;|&nbsp; Aligned with UN SDGs 7, 9, 11, 13
</p>



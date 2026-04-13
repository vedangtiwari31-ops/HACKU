# 🌞 Smart Adaptive Solar Tracking System (SASTS)

> A low-cost, self-powered dual-axis solar tracking system that maximizes energy output using intelligent light-based tracking.

---

## 📌 Overview

The **Smart Adaptive Solar Tracking System (SASTS)** is designed to improve the efficiency of solar panels by dynamically aligning them with the sun’s position throughout the day.

### ✨ Key Features
- Tracks sunlight in real time  
- Avoids unnecessary movement during low-light conditions  
- Operates without external power  

---

## 🚨 Problem Statement

- Fixed solar panels lose **30–40% efficiency** due to static positioning  
- Existing trackers:
  - Consume excess energy  
  - Move even in cloudy or low-light conditions  
- Not suitable for **rural/off-grid areas**

---

## 💡 Our Solution

SASTS introduces a **smart, energy-aware tracking mechanism**:

- 🌞 Dual-axis solar tracking  
- 🧠 Intelligent decision-making using Arduino  
- ⚡ Self-powered system (solar + battery)  
- 🌥️ Weather-adaptive logic (stops movement in low light)  

---

## 🔧 Components Used

### 🧠 Core Electronics
- Arduino Uno R3  
- LDR Sensors (×4)  
- Servo Motors (SG90 ×2)  

### ⚡ Power System
- Solar Panel (5W–10W)  
- 18650 Li-ion Battery  
- TP4056 Charging Module  
- DC-DC Boost Converter  

### 🔌 Supporting Components
- Resistors (10kΩ ×4)  
- Breadboard  
- Jumper Wires  

### 🏗️ Mechanical Components
- Solar panel mounting frame  
- Servo brackets  
- Base platform (wood/acrylic/3D printed)  

---

## 🔄 Working Principle

1. LDR sensors detect sunlight intensity from four directions  
2. Arduino compares sensor values  
3. System determines optimal direction  
4. Servo motors adjust panel position (dual-axis)  
5. Movement pauses during low-light conditions to save energy  

---

## 📊 Results

- ⚡ **30–40% increase in energy output** compared to fixed panels  
- 🔋 Fully self-powered system  
- 💰 Approximate cost: **₹2,500**  

---

## 🌍 Applications

- Rural and off-grid homes  
- Agricultural farms  
- Small-scale solar installations  
- Smart energy systems  

---

## 🚀 Future Scope

- 📡 IoT integration for remote monitoring  
- 🤖 AI-based predictive sun tracking  
- 🌦️ Weather sensor integration  
- 🔋 Efficiency optimization  

---

## 👥 Team

- Vedang Tiwari  
- Mahek Tiwari  
- Mayur Singh  
- Eshha Kuckian  

---

## 📎 License

This project is developed for educational and innovation purposes.


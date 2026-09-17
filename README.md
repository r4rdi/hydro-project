# 🌿 Hydro — Smart Hydroponics Monitoring & Automated Telemetry System

![System Status](https://img.shields.io/badge/System-Production--Ready-emerald?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-IoT_%7C_ML_%7C_Fullstack-violet?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

**Hydro** adalah ekosistem pemantauan dan otomatisasi hidroponik berbasis *Internet of Things* (IoT) yang dilengkapi dengan analitik prediktif *Machine Learning*, pemrosesan data *time-series*, serta antarmuka web berkinerja tinggi. Sistem ini dirancang untuk menjaga keseimbangan nutrisi tanaman secara presisi, mengurangi kegagalan panen, serta mengoptimalkan penggunaan daya dan air.

---

## 🏗️ 1. Architecture Overview

Sistem Hydro mengintegrasikan 4 layer utama dalam arsitektur end-to-end:
[ ESP32 Node Sensors ] ──(MQTT/TLS)──> [ EMQX / Mosquitto Broker ]
│
▼
[ React/Next.js UI ] <──(WebSockets)─── [ FastAPI / Node.js Engine ]
(Dark-Theme Dashboard)                        │
├──> [ TimescaleDB / InfluxDB ]
└──> [ ML Analytics (Prophet/LSTM) ]

1. **IoT Edge Layer (Firmware):** ESP32 mengumpulkan data dari sensor pH, TDS, suhu air, dan kelembapan, lalu mengeksekusi kendali aktuator (relay pompa/lampu).
2. **Message Broker Layer:** Protokol MQTT ultra-low latency untuk transmisi data *telemetry* dan *command*.
3. **Backend & Machine Learning Layer:** Pemrosesan logika bisnis, prediksi kebutuhan nutrisi (ML forecasting), serta pembersihan data telemetry.
4. **Database Layer:** Storage time-series teroptimasi untuk pencatatan *real-time* dan *continuous aggregation*.
5. **Frontend Layer:** Dashboard interaktif dengan tema *Dark Elegance*, *glowing visual states*, dan keterbacaan kontras tinggi.

---

## ⚡ 2. Features

- 🛰️ **Real-Time Telemetry & Control:** Pemantauan parameter pH, TDS (PPM), Suhu Air, Suhu Ruang, dan Kelembapan via WebSockets/MQTT.
- 🔮 **Predictive Nutrient Balancing (AI):** Model ML yang memberikan rekomendasi penambahan dosis larutan AB Mix berdasarkan tren penurunan PPM.
- 🎛️ **Actuator Remote Control:** Override manual dan penjadwalan otomatis untuk relay pompa nutrisi, *solenoid valve*, dan lampu LED *growth light*.
- 📈 **Time-Series Analytics:** Visualisasi grafik histori data dengan agregasi per jam/hari tanpa membebani memori peramban.
- 🔒 **Enterprise-Grade Security:** Autentikasi berbasis JWT, TLS/SSL encryption pada jalur MQTT, dan *Role-Based Access Control* (RBAC).

---

## 🎨 3. UI/UX Design System Specification

UI Dashboard menggunakan standar desain **Dark Elegance & High-Contrast Precision**:

- **Color Palette:**
  - **Background Utama:** `#090A0F` (Dark Muted Slate)
  - **Surface & Cards:** `#12141D` dengan aksen *Glassmorphism* & *Border* `#2E3245`
  - **Brand & Active States:** `#8B5CF6` (Modern Violet)
  - **Eco/Healthy State:** `#10B981` (Emerald Green)
  - **Glow & Highlight Accent:** `linear-gradient(135deg, #FF6B00 0%, #FF8E53 100%)` (Silhouette Orange)
  - **Typography:** `#FFFFFF` (Primary Text) & `#94A3B8` (Secondary Text)
- **Responsiveness:** *Mobile-first approach* menggunakan Tailwind CSS dengan *collapsible drawer* dan grafik adaptif.

---

## 🛠️ 4. Tech Stack

| Layer | Technology / Tools |
| :--- | :--- |
| **Firmware (IoT)** | C++ / FreeRTOS, ESP32, PubSubClient, ArduinoJson |
| **Frontend** | React.js / Next.js, Tailwind CSS, Lucide Icons, Chart.js / Recharts |
| **Backend API** | Python (FastAPI) / Node.js (Express), Pydantic, WebSockets |
| **Machine Learning** | PyTorch / TensorFlow, Scikit-Learn, Pandas, Prophet |
| **Database** | TimescaleDB (PostgreSQL) / InfluxDB, Redis (Cache) |
| **DevOps & Cloud** | Docker, Nginx Reverse Proxy, EMQX Broker, Cloudflare / Vercel |

---

## 📁 5. Repository Directory Structure

```text
hydro/
├── firmware/                 # Source code ESP32 (PlatformIO / Arduino IDE)
│   ├── src/
│   │   ├── main.cpp          # Main execution & FreeRTOS tasks
│   │   ├── mqtt_handler.cpp  # MQTT connection & TLS setup
│   │   └── sensors.cpp       # Sensor calibration & analog reading
│   └── include/
├── backend/                  # API Services & Analytics Engine
│   ├── app/
│   │   ├── api/              # RESTful endpoints & WebSockets
│   │   ├── core/             # Security, JWT, & Configs
│   │   ├── ml/               # Inference scripts & trained ML models
│   │   └── models/           # ORM schemas (SQLAlchemy / Timescale)
│   ├── Dockerfile
│   └── main.py
├── frontend/                 # Web Dashboard Application
│   ├── src/
│   │   ├── components/       # UI Cards, Charts, Control Toggles
│   │   ├── pages/            # Dashboard, Devices, Settings, Login
│   │   └── styles/           # Tailwind config & Glowing animations
│   ├── DESIGN.md             # System UI/UX Guidelines Specification
│   └── package.json
├── docker-compose.yml        # Multi-container orchestration (API, DB, Broker)
└── README.md                 # System Documentation
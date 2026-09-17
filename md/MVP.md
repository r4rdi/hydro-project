# Minimum Viable Product (MVP) Master Specification Document
**Project Name:** Hydro - Enterprise Smart Hydroponic IoT Platform  
**Target Domain:** `hydro.web.id`  
**Version:** 2.0.0 (Unified Master Baseline)  
**Status:** Approved Architecture & Specification Blueprint  
**Authors:** Senior Cross-Disciplinary Engineering Lead (ML Engineer, UI/UX Architect, Lead DBA, Data Analyst, IoT Firmware Engineer)

---

## 1. Executive Summary & Core Philosophy

### 1.1 Project Overview
**Hydro** adalah platform pemantauan dan pengontrolan sistem hidroponik presisi berbasis Internet of Things (IoT) skala industri [cite: 1, 3]. Platform ini dirancang secara modular dan *scalable* untuk menghubungkan metrik perangkat keras fisik (*edge layer*) secara *real-time* ke infrastruktur web cloud modern, analitik data, dan model *Machine Learning* tingkat lanjut [cite: 1, 3].

### 1.2 Core System Philosophy
1. **Single Source of Truth (SSoT) / Contract Integrity:** Seluruh variabel sensor, tipe data, topik MQTT, dan skema database wajib mematuhi satu kontrak terpadu (*IoT Contract*) [cite: 1, 3, 4]. Tidak boleh ada perbedaan penamaan variabel antara ESP32 Firmware, Payload JSON, Backend API, PostgreSQL Schema, dan Next.js React Dashboard [cite: 1, 3, 4].
2. **Local Edge Autonomy & Fail-Safe:** Kontrol otomatisasi dasar dan logika keselamatan dieksekusi secara lokal di dalam firmware ESP32 [cite: 1, 2]. Terputusnya koneksi internet atau server cloud tidak boleh menghentikan sirkulasi nutrisi utama atau merusak tanaman [cite: 1, 2].
3. **Decoupled Modern Architecture:** Pemisahan yang jelas antara protokol kueri *stateful* streaming IoT (MQTT over TLS) dengan aplikasi web *stateless* (Next.js App Router di Vercel & Supabase Backend) [cite: 1, 3, 4].
4. **Data-First Integrity & Signal Calibration:** Penekanan utama diberikan pada akuisisi data sensor yang akurat, kalibrasi multi-point industri, penyimpanan time-series yang terstruktur, serta visualisasi *low-latency* sebelum menerapkan model kecerdasan buatan (AI/ML) [cite: 1, 3].

---

## 2. Multi-Role User Hierarchy & Access Control (RBAC)

Hydro menerapkan model **Role-Based Access Control (RBAC)** yang ketat [cite: 1, 3]. Pendaftaran akun publik (*public registration*) dinonaktifkan secara bawaan untuk menjamin keamanan operasional [cite: 1]. Akun baru hanya dapat dibuat oleh Admin atau disetujui (*admin-approved*) [cite: 1, 3].

| Role | Target Persona | Level Akses & Izin |
| :--- | :--- | :--- |
| **Super Admin** | System Architect / Lead DBA | Konfigurasi sistem penuh, manajemen tenant/site, migrasi database, akses raw API, provisi akun, dan kebijakan keamanan [cite: 1, 3]. |
| **Admin** | Farm Operation Manager | Pengaturan operasional greenhouse, konfigurasi batas ambang (*threshold*), alokasi role user internal site, dan persetujuan registrasi [cite: 1, 3]. |
| **Operator** | Farm Agronomist / Field Worker | Dashboard monitoring real-time, *manual actuator override* (pompa, fan, dosing), *acknowledgment* alert, dan catatan harian [cite: 1, 3]. |
| **Teknisi** | Hardware / IoT Engineer | Provisi device ESP32, diagnosa konektivitas telemetry, eksekusi skrip kalibrasi sensor, pengujian pin mapping, dan update firmware [cite: 1, 3]. |
| **Viewer** | Auditor / Investor / Guest | Akses read-only ke data sensor, grafik agregasi historis, serta ekspor laporan tanpa hak kontrol [cite: 1, 3]. |

---

## 3. IoT Contract & Payload JSON Schema

### 3.1 Strict IoT Contract Rules
Seluruh transmisi data dari ESP32 menuju MQTT Broker hingga PostgreSQL dan UI Frontend **wajib** menggunakan penamaan atribut baku berikut [cite: 1, 3, 4]:

```
+-------------------+       MQTT Topic: hydro/v1/sites/{site_id}/devices/{device_id}/telemetry
|  ESP32 Firmware   | ------------------------------------------------------------------------>
| (water_temp: 24.7)| 
+-------------------+ 
         │
         ▼
+-------------------+       +-------------------+       +-------------------+       +-------------------+
|    MQTT Broker    | ----> |   Backend Ingest  | ----> | Supabase Postgres | ----> |  Next.js React FE |
|   (HiveMQ/EMQX)   |       | (Node/Next API)   |       |  (water_temp)     |       |   (water_temp)    |
+-------------------+       +-------------------+       +-------------------+       +-------------------+
```

### 3.2 Canonical JSON Telemetry Schema
```json
{
  "device_id": "HYDRO-NODE-001",
  "site_id": "SITE-BDG-01",
  "timestamp": "2026-09-15T07:30:00.000Z",
  "firmware_version": "v1.2.4",
  "sensors": {
    "ph": 6.20,
    "ec": 1.85,
    "tds": 925,
    "water_temp": 24.7,
    "air_temp": 28.4,
    "humidity": 72.1,
    "light": 850,
    "water_level": 78,
    "flow_rate": 1.42
  },
  "actuators": {
    "water_pump": true,
    "nutrient_pump_a": false,
    "nutrient_pump_b": false,
    "ph_down_pump": false,
    "exhaust_fan": true
  },
  "diagnostics": {
    "wifi_rssi": -65,
    "free_heap": 184520,
    "uptime_seconds": 86400
  }
}
```

---

## 4. Hardware Architecture, Pin Mapping & Edge Logic

### 4.1 Hardware Pin Mapping ESP32 DevKit v1
Pinout diatur agar tidak berbenturan dengan pin strapping ESP32 dan mendukung fungsi I2C/OneWire [cite: 3].

| Komponen Hardware | Pin ESP32 | Tipe Signal | Keterangan & Modul |
| :--- | :--- | :--- | :--- |
| **Sensor pH** | GPIO 35 | Analog (ADC1_CH7) | Modul E-201C / DFRobot Signal Board [cite: 3] |
| **Sensor TDS / EC** | GPIO 34 | Analog (ADC1_CH6) | Sensor TDS Meter V1 / Probe EC [cite: 3] |
| **Suhu Air (DS18B20)** | GPIO 4 | Digital (OneWire) | Probe Waterproof Nutrisi [cite: 3] |
| **Suhu/Kelembaban (DHT22)** | GPIO 15 | Digital | Sensor Udara Ambient [cite: 3] |
| **Level Air (Ultrasonic)** | GPIO 5 (Trig), 18 (Echo) | Digital | Tangki Nutrisi Main Reservoir [cite: 3] |
| **Relay Pompa Air Utama** | PCF8574 P0 | I2C (SDA:21, SCL:22) | Relay Module (Optocoupler Isolated) [cite: 3] |
| **Relay Lampu / Fan** | PCF8574 P1 | I2C | Solenoid / Exhaust Control [cite: 3] |
| **Relay Dosing Nutrisi A** | PCF8574 P2 | I2C | Peristaltic Dosing Pump A [cite: 3] |
| **Relay Dosing Nutrisi B** | PCF8574 P3 | I2C | Peristaltic Dosing Pump B [cite: 3] |

### 4.2 Edge Fail-Safe & Multi-Tasking (FreeRTOS Core Allocation)
Firmware ESP32 menggunakan dual-core FreeRTOS [cite: 2]:
* **Core 0 (Telemetry Task):** Mengambil sampel sensor per 1 detik, menerapkan *Moving Average Filter*, mengemas JSON payload, dan memublikasikan ke broker MQTT per 5 detik [cite: 1, 3].
* **Core 1 (Control & Fail-Safe Task):** Mengevaluasi ambang batas (*threshold*) secara lokal [cite: 1, 2].
  * *Internet Disruption Mode:* Jika koneksi MQTT terputus > 30 detik, ESP32 berpindah ke mode otomatisasi lokal (*Looping Cycle*: Pompa ON 15 menit, OFF 45 menit) [cite: 2].
  * *Critical Dry-Run Protection:* Jika `water_level < 10%`, matikan `water_pump` secara instan untuk mencegah kerusakan motor [cite: 2].

---

## 5. Database Schema (Supabase PostgreSQL Time-Series)

### 5.1 Relational & Hyper-table Structure

```sql
-- 1. Sites & Hierarchy
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Device Registry
CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY, -- ex: HYDRO-NODE-001
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_online BOOLEAN DEFAULT false,
    last_ping TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. High-Frequency Telemetry Storage
CREATE TABLE sensor_readings (
    id BIGSERIES PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ph NUMERIC(4, 2),
    ec NUMERIC(4, 2),
    tds NUMERIC(6, 2),
    water_temp NUMERIC(4, 1),
    air_temp NUMERIC(4, 1),
    humidity NUMERIC(4, 1),
    light INT,
    water_level INT,
    flow_rate NUMERIC(4, 2)
);
CREATE INDEX idx_sensor_readings_device_time ON sensor_readings (device_id, timestamp DESC);

-- 4. Hourly Aggregates (Downsampling Strategy for >90 Days Retention)
CREATE TABLE sensor_aggregates_hourly (
    id BIGSERIES PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES devices(id),
    bucket TIMESTAMPTZ NOT NULL,
    ph_avg NUMERIC(4,2), ph_min NUMERIC(4,2), ph_max NUMERIC(4,2),
    ec_avg NUMERIC(4,2), ec_min NUMERIC(4,2), ec_max NUMERIC(4,2),
    water_temp_avg NUMERIC(4,1),
    air_temp_avg NUMERIC(4,1)
);

-- 5. Actuator Execution & Audit Logs
CREATE TABLE actuator_logs (
    id BIGSERIES PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES devices(id),
    actuator_name VARCHAR(50) NOT NULL,
    state BOOLEAN NOT NULL,
    triggered_by VARCHAR(50) NOT NULL, -- 'SYSTEM_AUTO', 'MANUAL_OPERATOR', 'FAILSAFE'
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. System Alerts & Alerts Management
CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) REFERENCES devices(id),
    severity alert_severity NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Algoritma Kalibrasi Sensor & Signal Processing

### 6.1 Kalibrasi Multipoint Sensor pH (E-201C)
Menggunakan regresi linier 3-titik standar industri (Buffer pH 4.01, 6.86, 9.18) [cite: 3]:

$$	ext{pH}_{	ext{calibrated}} = a \cdot V_{	ext{adc}} + b$$

* Target Akurasi: R² > 0.98, Margin Error < 5% [cite: 3].

### 6.2 Kompensasi Suhu & Konversi EC / TDS
Ketergantungan suhu larutan nutrisi dikompensasi dengan formula koefisien 2%/°C standar ISO [cite: 3]:

$$	ext{EC}_{25} = rac{	ext{EC}_{	ext{raw}}}{1 + 0.02 \cdot (T_{	ext{water}} - 25)}$$

$$	ext{TDS}_{	ext{ppm}} = 	ext{EC}_{25} 	imes 500 \quad (	ext{atau faktor } 0.5) 	ext{[cite: 3]}$$

---

## 7. Frontend UI/UX Architecture & Layout Specification

### 7.1 Real-Time Responsive Layout Schema
Layout dirancang *mobile-first* menggunakan Next.js App Router, React, Tailwind CSS, dan Recharts [cite: 1, 3].

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ HYDRO | Site: Site-Alpha-BDG (🟢 Online)           [User: Rian (Admin)]          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [Dashboard] [Devices] [Controls] [Analytics] [Alerts (2 Unread)] [Settings]     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ pH Level       │  │ EC / TDS       │  │ Water Temp     │  │ Air Humidity   │ │
│  │ 6.20           │  │ 1.85 mS/cm     │  │ 24.7 °C        │  │ 72.1 %         │ │
│  │ [🟢 Optimal]   │  │ [🟢 Optimal]   │  │ [🟡 Warm]      │  │ [🟢 Normal]    │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ REAL-TIME TELEMETRY STREAM (WebSocket / Supabase Realtime Connected)      │  │
│  │ [ Interactive Chart: pH & EC Target Range Corridor (Live 5s Refresh) ]    │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────┐ ┌───────────────────────────────┐│
│  │ ACTUATOR OVERRIDE CONTROLS                │ │ ACTIVE ALERTS & LOGS          ││
│  │ Circulation Pump:  [ ON  | Auto ]         │ │ 🔴 [10:14] Water Temp > 24.5C ││
│  │ Dosing Pump A:     [ OFF | Auto ]         │ │ 🟡 [09:30] Low EC Warning     ││
│  │ Exhaust Fan:       [ ON  | Auto ]         │ │ 🟢 [08:00] Calibration Passed ││
│  └───────────────────────────────────────────┘ └───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Visual Status Indicator Logic
* 🟢 **Normal / Optimal:** Nilai sensor berada di dalam batas target agronomi tanaman.
* 🟡 **Warning:** Nilai mendekati batas marjinal tolerance (10% batas atas/bawah).
* 🔴 **Critical:** Batas terlampaui. Peringatan pushed & tindakan otomatis aktif.
* ⚫ **Offline:** Telemetri terputus > 15 detik.

---

## 8. Technology Stack & Deployment Architecture

```
[ ESP32 Hardware ] ---> (MQTT over TLS) ---> [ HiveMQ Cloud / EMQX Broker ]
                                                     │
                                            (Webhooks / Ingestion API)
                                                     │
                                                     ▼
[ Browser Client ] <--- (Supabase Realtime) <--- [ Next.js API / PostgreSQL ]
```

* **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, Recharts [cite: 1, 3].
* **Backend:** Next.js API Routes / Node.js Express Handlers [cite: 1, 3].
* **Auth & Database:** Supabase Auth (JWT + RLS), Supabase PostgreSQL [cite: 1, 3].
* **MQTT Broker:** HiveMQ Cloud / EMQX (TLS Port 8883) [cite: 1, 3].
* **Hosting & Domain:** Vercel Production Deployment mapped to **`hydro.web.id`** [cite: 1, 3].

---

## 9. Keamanan & Proteksi Sistem

| Layer Keamanan | Mekanisme & Kebijakan |
| :--- | :--- |
| **Transport Protocol** | Wajib HTTPS & MQTT over TLS (Port 8883) [cite: 1, 3]. |
| **Password Hashing** | Bcrypt dengan salt rounds ≥ 10 [cite: 3]. |
| **API Auth & Session** | JSON Web Token (JWT) dengan durasi maksimum 24 jam [cite: 3]. |
| **Database Security** | Row Level Security (RLS) di Supabase PostgreSQL & Prepared Statements [cite: 1, 3]. |
| **Device Access** | Autentikasi credential per-device; credential hardware tersembunyi dari frontend [cite: 1, 3]. |
| **Rate Limiting** | Batasan request API (contoh: max 100 req / 15 menit) [cite: 3]. |

---

## 10. Development Roadmap & Prioritization Matrix

### 🔴 Phase P0 — Mandatory MVP Baseline (Scope Rilis Pertama) [cite: 1, 3]
- [x] Spesifikasi IoT Contract baku & penamaan variabel tunggal [cite: 1, 3, 4].
- [x] Autentikasi Supabase & RBAC Multi-role (Admin/Operator/Teknisi) [cite: 1, 3].
- [x] Provisi 1 Perangkat Utama (`HYDRO-NODE-001`) [cite: 1, 3].
- [x] Ingest Telemetri Sensor: pH, EC/TDS, Suhu Air, Suhu Udara, Kelembaban, Level Air [cite: 1, 3].
- [x] Kontrol 4 Actuator (Pompa Utama, Exhaust Fan, Dosing A, Dosing B) [cite: 1, 3].
- [x] Dashboard Responsive Real-Time (Visual Cards & Recharts Live Stream) [cite: 1, 3].
- [x] Logika Fail-Safe & Automation Lokal pada ESP32 Firmware [cite: 1, 2].
- [x] Audit Logging (`actuator_logs`, `alerts`) [cite: 1, 3].
- [x] Deployment penuh ke domain resmi **`hydro.web.id`** di Vercel [cite: 1, 3].

### 🟡 Phase P1 — Post-MVP Enhancements (Pengembangan Tahap 2) [cite: 1, 3]
- [ ] Dukungan Multi-site & Multi-greenhouse hierarchical tree [cite: 1, 3].
- [ ] Fitur Penjadwalan Aktuator Tingkat Lanjut (Cron-style dosing/lighting) [cite: 1, 3].
- [ ] Interactive Sensor Calibration Wizard UI (Buffer 3-titik) [cite: 1, 3].
- [ ] Engine Ekspor Data Historis (CSV, Excel, PDF Report) [cite: 1, 3].
- [ ] Support Progressive Web App (PWA) & Push Notification [cite: 1, 3].
- [ ] Over-The-Air (OTA) Firmware Updates untuk ESP32 [cite: 1, 3].

### 🟢 Phase P2 — AI / ML Analytics & Advanced Optimization (Pengembangan Lanjutan) [cite: 1, 3]
- [ ] **Anomaly Detection:** ML-based outlier detection untuk mengdeteksi kerusakan probe sensor [cite: 1, 3].
- [ ] **Predictive Growth Modeling:** Model ML untuk memprediksi hasil panen berbasis paparan EC/pH [cite: 1, 3].
- [ ] **Auto Nutrient Recommendation Engine:** Algoritma penyeimbang nutrisi otomatis berdasar fase tanam [cite: 1, 3].
- [ ] **Computer Vision Integration:** Deteksi kesehatan daun & penyakit via kamera CCTV [cite: 1, 3].

# Minimum Viable Product (MVP) Master Specification Document
**Project Name:** Hydro - Enterprise Smart Hydroponic IoT Platform  
**Target Domain:** `hydro.web.id`  
**Version:** 3.1.0 (ThingsBoard Enterprise Payload Integration)  
**Status:** Approved Architecture & Specification Blueprint  
**Authors:** Senior Cross-Disciplinary Engineering Lead (ML Engineer, UI/UX Architect, Lead DBA, Data Analyst, IoT Firmware Engineer)

---

## 1. Executive Summary & Core Philosophy

### 1.1 Project Overview
**Hydro** adalah platform pemantauan dan pengontrolan sistem hidroponik presisi berbasis Internet of Things (IoT) skala industri. Platform ini dirancang secara modular dan *scalable* untuk menghubungkan metrik perangkat keras fisik (*edge layer*) secara *real-time* ke infrastruktur web cloud modern, analitik data, dan model *Machine Learning* tingkat lanjut. 

Penyimpanan data *time-series* dan manajemen perangkat utama dialihkan menggunakan platform bawaan IoT Cloud sekolah, yaitu **ThingsBoard** (`https://things.smk2-yk.sch.id/`).

### 1.2 Core System Philosophy
1. **Single Source of Truth (SSoT) / Contract Integrity:** Seluruh variabel sensor, tipe data, dan skema integrasi wajib mematuhi satu kontrak terpadu (*IoT Contract*). Tidak boleh ada perbedaan penamaan variabel antara ESP32 Firmware, Payload JSON ThingsBoard, dan Next.js React Dashboard.
2. **Local Edge Autonomy & Fail-Safe:** Kontrol otomatisasi dasar dan logika keselamatan dieksekusi secara lokal di dalam firmware ESP32. Terputusnya koneksi internet ke ThingsBoard tidak boleh menghentikan sirkulasi nutrisi utama atau merusak tanaman.
3. **Decoupled Modern Architecture via REST API:** Pemisahan yang jelas antara platform IoT (ThingsBoard) dengan aplikasi web *stateless* (Next.js App Router di eksternal hosting). Pengambilan data dilakukan menggunakan metode *Request/Polling* (GET Request) via REST API ThingsBoard menggunakan otorisasi *Access Token* atau *JWT Token*.
4. **Data-First Integrity & Signal Calibration:** Penekanan utama diberikan pada akuisisi data sensor yang akurat, penyimpanan time-series yang terstruktur di ThingsBoard, serta visualisasi eksternal sebelum menerapkan model kecerdasan buatan (AI/ML).

---

## 2. Multi-Role User Hierarchy & Access Control (RBAC)

Hydro menerapkan model **Role-Based Access Control (RBAC)** yang ketat pada Web Dashboard Eksternal. Akun baru hanya dapat disetujui oleh Admin.

| Role | Target Persona | Level Akses & Izin |
| :--- | :--- | :--- |
| **Super Admin** | System Architect / Lead DBA | Konfigurasi sistem penuh, manajemen kredensial ThingsBoard (Access Token/JWT), provisi akun, dan kebijakan keamanan. |
| **Admin** | Farm Operation Manager | Pengaturan operasional greenhouse, konfigurasi batas ambang (*threshold*), dan persetujuan registrasi. |
| **Operator** | Farm Agronomist | Dashboard monitoring real-time, *manual actuator override*, *acknowledgment* alert, dan catatan harian. |
| **Teknisi** | Hardware / IoT Engineer | Provisi device ESP32, diagnosa konektivitas telemetry ke ThingsBoard, eksekusi skrip kalibrasi sensor, dan mapping pin hardware. |
| **Viewer** | Auditor / Guest | Akses read-only ke data sensor, grafik agregasi historis, serta ekspor laporan. |

---

## 3. Integrasi ThingsBoard & Payload JSON Schema

### 3.1 Arsitektur REST API & Access Token Integrasi
Setiap perangkat keras yang diprovisi akan dibuatkan *Device ID* unik di dalam ThingsBoard. Untuk mengintegrasikan data ke eksternal Web Dashboard, sistem menggunakan **Device Credentials** tipe **Access Token**.

**Alur Kerja Sistem Pembacaan Sensor:**
1. **Hardware (ESP32)** mengirimkan data *telemetry* JSON ke ThingsBoard via MQTT atau HTTP menggunakan Access Token perangkat.
2. **Database ThingsBoard** memproses dan menyimpan data riwayat secara *time-series*. Payload yang bersarang (*nested*) otomatis diubah menjadi format *dot-notation* (misal: `sensors.ph`).
3. **Web Dashboard (Next.js)** mengirimkan *GET request* (metode *Polling* berkala) ke REST API ThingsBoard (menggunakan *Access Token* atau *JWT Token*) untuk menarik *Latest Telemetry* secara *real-time*.

### 3.2 Canonical JSON Telemetry Schema (Enterprise Scale)
Penamaan variabel *keys* (*Latest telemetry*) menggunakan format *nested objects* untuk memisahkan logika pembacaan sensor, status aktuator, dan diagnostik jaringan.

```json
{
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
Pinout diatur agar tidak berbenturan dengan pin strapping ESP32 dan mendukung pembacaan berbagai tipe sensor.

| Komponen Hardware | Pin ESP32 | Tipe Signal | Key di ThingsBoard |
| :--- | :--- | :--- | :--- |
|Sensor pH | GPIO 35 | Analog | `sensors.ph` |
| Sensor EC/TDS |	GPIO 34 | Analog | `sensors.ec / sensors.tds` |
| Suhu Air (DS18B20) | GPIO 4 | Digital (OneWire) | 	`sensors.water_temp` |
| Suhu & Kelembaban (DHT22) | GPIO 15 | Digital | 	`sensors.air_temp, sensors.humidity` |
| Cahaya (LDR/BH1750) |	GPIO 32 | Analog / I2C | `sensors.light` |
| Level Air (Ultrasonic) | GPIO 5, 18 | Digital (Trig, Echo) | `sensors.water_level` |
| Flow Meter | GPIO 19 | Digital (Interrupt) | `sensors.flow_rate` |
| Relay Aktuator (Pompa/Kipas) | PCF8574 P0-P4 | I2C (SDA:21, SCL:22) | `actuators.water_pump, actuators.exhaust_fan, dll.` |

### 4.2 Edge Fail-Safe & Multi-Tasking (FreeRTOS Core Allocation)
- Firmware ESP32 menggunakan dual-core FreeRTOS:Core 0 (Telemetry Task): Mengambil sampel sensor per 1 detik, menyatukan objek JSON sensors, actuators, dan diagnostics, dan memublikasikan ke ThingsBoard per 5 detik.  
- Core 1 (Control & Fail-Safe Task): Mengevaluasi ambang batas (threshold) secara lokal. Contoh proteksi Dry-Run: Jika sensors.water_level < 10%, matikan actuators.water_pump secara instan dan jalankan siklus otomatisasi lokal bila koneksi terputus.

## 5. Database Architecture
Database Utama (Time-Series) ditangani sepenuhnya oleh platform bawaan ThingsBoard.IoT Time-Series Database (ThingsBoard):
1. Menyimpan seluruh histori data (seperti sensors.ph, actuators.water_pump, diagnostics.wifi_rssi) beserta timestamp secara otomatis dan efisien tanpa perlu setup RDBMS terpisah.
2. Relational Database (Opsional - Supabase/PostgreSQL eksternal): Tetap dapat digunakan hanya untuk mengelola data operasional pengguna Web Dashboard, seperti pemetaan RBAC dan manajemen profil kebun.

## 6. Algoritma Kalibrasi Sensor & Signal Processing
- Hardware Layer: ESP32 menyimpan nilai offset (misalnya untuk kompensasi suhu antara sensors.water_temp dengan pembacaan sensors.ec) sebelum mengirimkan payload bersih ke ThingsBoard.
- ThingsBoard Layer (Calculated Fields): Admin dapat menggunakan fitur Rule Chains bawaan ThingsBoard jika diperlukan konversi matematis pasca-penerimaan (misal: menghitung konversi TDS dari nilai EC).

## 7. Frontend UI/UX Architecture & Layout Specification

### 7.1 Visual Integration (Dashboard Dashboard)
Layout dirancang menggunakan Next.js dan Tailwind CSS berfokus pada pengalaman Dark Elegance. Dashboard mengurai objek sensors, actuators, dan diagnostics yang didapat dari REST API Polling ThingsBoard.

┌─────────────────────────────────────────────────────────────────────────────────┐
│ HYDRO | Device: Greenhouse Alpha (Token: JisoPAgt...)      [User: Rian (Admin)] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 📶 Diagnostics: WiFi -65 dBm | Uptime: 24h 0m | Heap: 184 KB                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ pH Level       │  │ EC / TDS       │  │ Water Temp     │  │ Water Level    │ │
│  │ 6.20           │  │ 1.85 mS/cm     │  │ 24.7 °C        │  │ 78 %           │ │
│  │ [🟢 Optimal]   │  │ [925 ppm]      │  │ [🟢 Normal]    │  │ [🟢 Cukup]     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                                                 │
│  ┌───────────────────────────────────────────┐ ┌───────────────────────────────┐│
│  │ ACTUATOR OVERRIDE CONTROLS                │ │ SENSOR ENVIRONMENT            ││
│  │ Water Pump:        [ 🟢 ON  | Auto ]      │ │ Air Temp:  28.4 °C            ││
│  │ Nutrient Pump A:   [ ⚫ OFF | Auto ]      │ │ Humidity:  72.1 %             ││
│  │ Exhaust Fan:       [ 🟢 ON  | Auto ]      │ │ Light:     850 Lux            ││
│  └───────────────────────────────────────────┘ └───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘

## 8. Technology Stack & Deployment Architecture
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Recharts.- Integrasi IoT API: Axios / SWR / React Query untuk Polling REST API ThingsBoard, memproses objek JSON telemetri bersarang.
- Database (Telemetry): ThingsBoard Built-in Database.
- Hosting Dashboard: Vercel Production Deployment mapped to hydro.web.id.

## 9. Development Roadmap & Prioritization Matrix

🔴 Phase P0 — Mandatory MVP Baseline
- [x] Pembuatan Device Profile dan entitas perangkat di ThingsBoard.
- [x] Ingest Full Payload JSON (Sensors, Actuators, Diagnostics) dari ESP32 ke ThingsBoard.   
- [x] Pembuatan fungsi fetching (REST API GET request) di aplikasi Next.js untuk membaca data lengkap dari URL server sekolah.
- [x] Pembuatan UI Dashboard Responsif memetakan data sensors dan status toggle dari actuators.
- [x] Deployment penuh Dashboard ke domain resmi hydro.web.id.

🟡 Phase P1 — Post-MVP Enhancements
- [ ] Implementasi integrasi JWT Token ThingsBoard untuk ekspor 
grafik historical telemetry ke dalam Dashboard Web eksternal.

- [ ] Pengiriman parameter kontrol balik (RPC Call) dari Dashboard Web ke ThingsBoard untuk mengeksekusi kontrol relay secara manual (actuators.water_pump = true/false).

🟢 Phase P2 — AI / ML Analytics
- [ ] Data Pipeline Retrieval: Skrip Machine Learning menarik data historis (sensors.ec, sensors.ph, sensors.light[cite: 14]) secara massal via API ThingsBoard untuk analisis.
- [ ] Auto Nutrient Recommendation: Model AI memproses riwayat parameter air untuk memberikan wawasan dan mengontrol aktuator dosis nutrisi secara cerdas.
# Hydro — Smart Hydroponic IoT Dashboard

> Dashboard monitoring & kontrol sistem hidroponik skala industri berbasis IoT.

## 🎯 Project Overview

**Hydro** adalah platform web untuk memantau dan mengontrol sistem hidroponik secara real-time. Sistem ini mengintegrasikan perangkat edge (ESP32 + sensor industri) dengan cloud backend dan frontend modern.

- **Domain:** `hydro.web.id`
- **Versi:** 1.0.0 (MVP)
- **Status:** Development
- **Timeline:** 8 minggu

## 📚 Dokumentasi Project

Baca file berikut **secara berurutan** sebelum memulai development:

| # | File | Deskripsi | Target Reader |
|---|------|-----------|---------------|
| 1 | `PRD.md` | Product requirements & success metrics | PM, Developer, QA |
| 2 | `ARCHITECTURE.md` | System design & data flow | Architect, Backend Dev |
| 3 | `TECH_STACK.md` | Technology choices & versions | All developers |
| 4 | `DATABASE.md` | Schema, migration, indexing | Backend Dev, DBA |
| 5 | `API.md` | REST API specification | Backend & Frontend Dev |
| 6 | `FIRMWARE.md` | ESP32 firmware specification | IoT/Firmware Dev |
| 7 | `UI_UX.md` | Design system & components | Frontend Dev, Designer |
| 8 | `DEPLOYMENT.md` | CI/CD & deployment strategy | DevOps, Backend Dev |
| 9 | `SECURITY.md` | Security requirements | All developers |
| 10 | `TESTING.md` | QA strategy & test cases | QA Engineer |

## 🏗️ Arsitektur Singkat
ESP32 (Edge) ──MQTT──▶ HiveMQ Cloud ──▶ Node.js Backend ──▶ PostgreSQL
│
├──▶ Socket.io ──▶ React Frontend
│
└──▶ hydro.web.id (Vercel)


## 🚀 Quick Start

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## 👥 Tim & Role
| Role | Responsibility |
|---|------|
| Project Planner | Timeline, milestone, risk management|
| Web Developer | Full-stack development (Node.js + React)|
| IoT Developer | ESP32 firmware, sensor integration|
| Data Analyst | Kalibrasi sensor, analytics, forecasting
| UI/UX Designer | Dashboard design, responsive layout |
| DBA | Database schema, optimization, backup |

## 📞 Support
Issues: GitHub Issues
Documentation: File .md di root project
Domain: hydro.web.id


---

## 2. `TECH_STACK.md`

```markdown
# Technology Stack
## Hydro: Smart Hydroponic IoT Dashboard

``` 
**Version:** 1.0  
**Last Updated:** 2026-09-14

---

## 1. Hardware Stack

### 1.1 Microcontroller

| Komponen | Spesifikasi | Alasan |
|----------|-------------|--------|
| ESP32 DevKit v1 | Dual-core 240MHz, 520KB SRAM, WiFi + BLE | Murah, matang, WiFi built-in |
| Alternatif | ESP32-S3 (jika perlu USB native) | Future-proof |

**Kriteria Pemilihan:**
- WiFi built-in (tidak perlu modul tambahan)
- ADC 12-bit (cukup untuk sensor analog)
- Dukungan komunitas luas
- Harga < $5

### 1.2 Sensor Suite

| Sensor | Model | Interface | Akurasi | Range |
|--------|-------|-----------|---------|-------|
| pH | E-201C-Blue | Analog (ADC) | ±0.1 pH | 0-14 pH |
| TDS/EC | TDS Meter V1 | Analog (ADC) | ±5% | 0-1000 PPM |
| Suhu Air | DS18B20 | OneWire | ±0.5°C | -10 to +85°C |
| Suhu Udara | DHT22 | Digital | ±0.5°C | -40 to +80°C |
| Kelembaban | DHT22 (built-in) | Digital | ±2% | 0-100% |
| Level Air | HC-SR04 Ultrasonic | Digital (Trig/Echo) | ±3mm | 2-400cm |

### 1.3 Aktuator

| Komponen | Spesifikasi | Qty |
|----------|-------------|-----|
| Relay Module | 5V 4-channel optocoupler | 1 |
| I2C Expander | PCF8574 (hemat GPIO) | 1 |
| Pompa Air | 12V DC submersible | 1 |
| Lampu Grow Light | LED full spectrum | 1 |
| Dosing Pump A | Peristaltic 12V | 1 |
| Dosing Pump B | Peristaltic 12V | 1 |

### 1.4 Power Supply

| Komponen | Spesifikasi |
|----------|-------------|
| Main PSU | 12V 5A (untuk relay & pump) |
| Buck Converter | 12V → 5V (untuk ESP32) |
| Backup | UPS mini (opsional) |

---

## 2. Firmware Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Arduino Framework | 2.x | Base framework |
| PlatformIO | 6.x | Build system |
| PubSubClient | 2.8+ | MQTT client |
| OneWire | 2.3+ | DS18B20 communication |
| DallasTemperature | 3.9+ | Temperature reading |
| DHT sensor library | 1.4+ | DHT22 reading |
| ArduinoJson | 6.x | JSON serialization |
| WiFiManager | 2.x | WiFi configuration portal |

**Build Tool:** PlatformIO (bukan Arduino IDE)  
**Reason:** Version control, dependency management, CI/CD friendly

---

## 3. Backend Stack

### 3.1 Core

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express | 4.18+ | Web framework |
| TypeScript | 5.x | Type safety (RECOMMENDED) |

### 3.2 Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Primary database |
| Supabase | Latest | Managed PostgreSQL + realtime |
| Prisma | 5.x | ORM (type-safe queries) |
| Alternatif | Knex.js | Query builder (jika tidak pakai Prisma) |

### 3.3 IoT & Realtime

| Technology | Version | Purpose |
|------------|---------|---------|
| MQTT.js | 5.x | MQTT client |
| Socket.io | 4.x | WebSocket server |
| HiveMQ Cloud | Free tier | MQTT broker |

### 3.4 Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| JWT | 9.x | Token-based auth |
| Bcrypt | 5.x | Password hashing |
| Zod | 3.x | Schema validation |
| Helmet | 7.x | Security headers |
| CORS | 2.x | Cross-origin control |
| express-rate-limit | 7.x | Rate limiting |

### 3.5 Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| Winston | 3.x | Logging |
| dotenv | 16.x | Environment variables |
| dayjs | 1.x | Date manipulation |
| nodemailer | 6.x | Email notifications (future) |

---

## 4. Frontend Stack

### 4.1 Core

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Type safety |

### 4.2 UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 3.x | Utility-first CSS |
| shadcn/ui | Latest | Component library |
| Radix UI | Latest | Accessible primitives |
| Lucide React | Latest | Icon library |

### 4.3 Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| Recharts | 2.x | Charts & graphs |
| date-fns | 3.x | Date formatting |

### 4.4 State & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| React Query (TanStack) | 5.x | Server state |
| Zustand | 4.x | Client state (lightweight) |
| Axios | 1.x | HTTP client |
| Socket.io-client | 4.x | WebSocket client |

### 4.5 Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |

### 4.6 Routing & Auth

| Technology | Version | Purpose |
|------------|---------|---------|
| React Router | 6.x | Client-side routing |
| React Query (auth) | 5.x | Auth state |

---

## 5. Infrastructure & Deployment

| Service | Provider | Purpose | Tier |
|---------|----------|---------|------|
| Frontend Hosting | Vercel | Static + SSR | Free |
| Backend Hosting | Render | Node.js runtime | Free (spin-down after 15min) |
| Database | Supabase | PostgreSQL | Free (500MB) |
| MQTT Broker | HiveMQ Cloud | Message broker | Free (100 connections) |
| Domain | Namecheap/ID registrar | DNS | Paid (~$10/year) |
| SSL | Let's Encrypt (via Vercel) | HTTPS | Free |
| Monitoring | UptimeRobot | Uptime monitoring | Free |
| Logging | Render logs + Winston | Application logs | Free |

---

## 6. Development Tools

| Tool | Purpose |
|------|---------|
| VS Code | IDE |
| Git + GitHub | Version control |
| GitHub Actions | CI/CD |
| Postman / Thunder Client | API testing |
| MQTT Explorer | MQTT debugging |
| DBeaver | Database management |
| Figma | UI/UX design |
| Draw.io | Architecture diagrams |

---

## 7. Version Compatibility Matrix

| Component | Min Version | Recommended | Notes |
|-----------|-------------|-------------|-------|
| Node.js | 18 LTS | 20 LTS | Jangan pakai versi < 18 |
| npm | 9.x | 10.x | |
| PostgreSQL | 14 | 15+ | Fitur JSONB optimal di 15+ |
| React | 18.2 | 18.3 | |
| TypeScript | 5.0 | 5.4+ | |

---

## 8. Dependency Management

### 8.1 Backend

```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### 8.2 Frontend
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

###8.3 Lock Files
Backend: package-lock.json (commit ke repo)
Frontend: package-lock.json (commit ke repo)
Firmware: platformio.ini + lib_deps (commit ke repo)

## 9. Trade-off Analysis
### 9.1 Mengapa Node.js bukan Go/Python?
Keuntungan Node.js:
JavaScript/TypeScript di frontend & backend (full-stack consistency)
Async I/O cocok untuk IoT workload
Ekosistem MQTT & WebSocket matang
Developer pool besar
Kekurangan:
CPU-bound tasks lambat (bukan masalah untuk IoT dashboard)
Single-threaded (bisa diatasi dengan worker threads)

### 9.2 Mengapa PostgreSQL bukan MongoDB?
Keuntungan PostgreSQL:
Strong consistency (penting untuk data sensor)
SQL query fleksibel untuk analytics
Time-series indexing optimal
Supabase menyediakan realtime subscription gratis
Kekurangan:
Schema migration diperlukan (bisa diatasi dengan Prisma)
Less flexible untuk schema yang sering berubah

### 9.3 Mengapa HiveMQ Cloud bukan Mosquitto self-hosted?
Keuntungan HiveMQ Cloud:
Zero maintenance
TLS built-in
Dashboard monitoring
Free tier cukup untuk MVP
Kekurangan:
Limit 100 connections (cukup untuk MVP)
Dependency pada third-party

### 9.4 Mengapa Render bukan Railway/Fly.io?
Keuntungan Render:
Free tier untuk backend
Auto-deploy dari GitHub
Environment variables management
Custom domain support
Kekurangan:
Spin-down setelah 15 menit tidak aktif (cold start ~30s)
Solusi: Gunakan UptimeRobot untuk ping setiap 5 menit

## 10. Future Tech Considerations
| Technology        | When to Adopt  | Trigger                        |
|-------------------|----------------|--------------------------------|
| Redis             | Phase 2        | Jika perlu caching/session     |
| RabbitMQ          | Phase 2        | Jika perlu async job queue     |
| TimescaleDB       | Phase 3        | Jika data > 10 juta rows       |
| Kubernetes        | Phase 3        | Jika perlu auto-scaling        |
| GraphQL           | Phase 2       | Jika frontend butuh flexible queries |

Document Status: Approved  
Next Review: 2026-10-14
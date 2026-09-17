# System Architecture Document
## Hydro: Smart Hydroponic IoT Dashboard

**Version:** 1.0  
**Last Updated:** 2026-09-14  
**Status:** Approved

---

## 1. Architecture Overview

Hydro menggunakan arsitektur **layered microservices** dengan pola **event-driven** untuk memastikan skalabilitas, maintainability, dan real-time performance.

### 1.1 High-Level Architecture Diagram
┌─────────────────────────────────────────────────────────────────────┐
│ EDGE LAYER │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ ESP32 + Sensors (pH, TDS, DS18B20, DHT22, Ultrasonic) │ │
│ │ + Relay Control (PCF8574 I2C Expander) │ │
│ └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
│ MQTT over TLS (port 8883)
▼
┌─────────────────────────────────────────────────────────────────────┐
│ TRANSPORT LAYER │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ HiveMQ Cloud (MQTT Broker) │ │
│ │ - Topics: hydro/{device_id}/sensor, hydro/{device_id}/ctrl │ │
│ │ - QoS 1 (at least once delivery) │ │
│ └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Backend API (Node.js + Express) │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │ │
│ │ │ MQTT Client │ │ REST API │ │ WebSocket Server │ │ │
│ │ │ (Subscriber)│ │ (Endpoints) │ │ (Socket.io) │ │ │
│ │ └─────────────┘ └─────────────┘ └─────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
│
┌──────────────┼──────────────┐
▼ ▼ ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│ DATA LAYER │ │ CACHE LAYER │ │ REALTIME LAYER │
│ ┌────────────┐ │ │ (Future) │ │ ┌────────────┐ │
│ │ PostgreSQL │ │ │ ┌────────┐ │ │ │ Socket.io │ │
│ │ (Supabase) │ │ │ │ Redis │ │ │ │ Rooms │ │
│ └────────────┘ │ │ └────────┘ │ │ └────────────┘ │
└──────────────────┘ └──────────────┘ └──────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Frontend (React + Vite + Tailwind) │ │
│ │ - Real-time Dashboard │ │
│ │ - Historical Charts (Recharts) │ │
│ │ - Device Control Panel │ │
│ │ - User Management │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

---

## 2. Architecture Layers

### 2.1 Edge Layer

**Komponen:**
- ESP32 Microcontroller
- Sensor Suite:
  - pH Sensor (E-201C-Blue) → GPIO 35 (ADC1_CH7)
  - TDS Sensor (V1) → GPIO 34 (ADC1_CH6)
  - DS18B20 (Water Temp) → GPIO 4 (OneWire)
  - DHT22 (Air Temp/Humidity) → GPIO 15 (Digital)
  - Ultrasonic (Water Level) → GPIO 5 (Trig), 18 (Echo)
- PCF8574 I2C Expander → 4 Relay Channels
  - P0: Pompa
  - P1: Lampu
  - P2: Dosing A
  - P3: Dosing B

**Responsibilities:**
- Akuisisi data sensor setiap 5 detik
- Kalibrasi sensor di edge (opsional)
- Publish data ke MQTT broker
- Subscribe command dari backend
- Kontrol aktuator berdasarkan command

**Constraints:**
- Limited memory (520KB SRAM)
- Power consumption optimization
- Unreliable WiFi connection handling

### 2.2 Transport Layer

**Komponen:** HiveMQ Cloud (MQTT Broker)

**Protocol:** MQTT v3.1.1 over TLS

**Topics Structure:**
hydro/
├── {device_id}/
│ ├── sensor (ESP32 → Backend)
│ ├── control (Backend → ESP32)
│ └── status (ESP32 → Backend, heartbeat)
└── broadcast/
└── config (Backend → All ESP32)

**QoS Levels:**
- Sensor data: QoS 1 (at least once)
- Control commands: QoS 2 (exactly once)
- Heartbeat: QoS 0 (at most once)

**Payload Format:** JSON (UTF-8 encoded)

### 2.3 Application Layer

**Komponen:** Node.js + Express Backend

**Sub-components:**

#### 2.3.1 MQTT Client Module
// Responsibilities:
- Subscribe to hydro/+/sensor
- Parse incoming sensor data
- Apply calibration algorithms
- Store to database
- Emit WebSocket events

#### 2.3.2 REST API Module
// Endpoints:
- /api/auth/* (Authentication)
- /api/devices/* (Device management)
- /api/sensor-data (Historical data)
- /api/control (Actuator control)

#### 2.3.3 WebSocket Server Module
// Responsibilities:
- Manage client connections
- Room-based broadcasting (device_{id})
- Real-time data push
- Connection state management

Design Patterns:
Repository Pattern - Data access abstraction
Service Layer - Business logic separation
Middleware Chain - Authentication, validation, logging
Event Emitter - Internal event handling

### 2.4 Data Layer
Primary Database: PostgreSQL (Supabase)

Tables:
users - User accounts
devices - IoT device registry
sensor_logs - Time-series sensor data
actuator_logs - Control command history
calibration_data - Sensor calibration parameters

Indexing Strategy:
-- Time-series optimization
CREATE INDEX idx_sensor_logs_device_time 
ON sensor_logs(device_id, timestamp DESC);

-- Composite index for common queries
CREATE INDEX idx_sensor_logs_composite 
ON sensor_logs(device_id, timestamp, ph, tds);

Partitioning (Future):
Partition sensor_logs by month for performance
Automatic partition creation via cron job
2.5 Realtime Layer

Technology: Socket.io
Architecture:
Client A (Device 01) ──┐
Client B (Device 01) ──┼── Room: device_hydro_01
Client C (Device 01) ──┘

Client D (Device 02) ──┐
Client E (Device 02) ──┼── Room: device_hydro_02
Client F (Device 02) ──┘

Events:
joinRoom - Client joins device room
leaveRoom - Client leaves device room
sensorUpdate - Real-time sensor data
controlAck - Control command acknowledgment

### 2.6 Presentation Layer
Technology: React + Vite + Tailwind CSS
Component Architecture:
App
├── AuthProvider (Context)
├── Router
│   ├── LoginPage
│   ├── RegisterPage
│   ├── Dashboard
│   │   ├── SensorCards
│   │   ├── RealtimeChart
│   │   ├── ControlPanel
│   │   └── HistoricalTable
│   ├── DeviceManagement
│   └── Settings
└── SocketProvider (Context)

State Management:
React Context - Global state (auth, socket)
Local State - Component-specific state
React Query - Server state caching

## 3. Data Flow
### 3.1 Sensor Data Flow
1. ESP32 reads sensors (every 5s)
   ↓
2. ESP32 publishes to MQTT: hydro/{device_id}/sensor
   ↓
3. HiveMQ broker receives message
   ↓
4. Backend MQTT client receives message
   ↓
5. Backend applies calibration
   ↓
6. Backend stores to PostgreSQL (sensor_logs)
   ↓
7. Backend emits Socket.io event: sensorUpdate
   ↓
8. Frontend receives event and updates UI

Latency Budget:
ESP32 → MQTT: ~100ms
MQTT → Backend: ~50ms
Backend processing: ~50ms
Backend → Frontend: ~100ms
Total: ~300ms (target < 2s)

### 3.2 Control Command Flow
1. User clicks control button in frontend
   ↓
2. Frontend sends POST /api/control
   ↓
3. Backend validates request (JWT, permissions)
   ↓
4. Backend publishes to MQTT: hydro/{device_id}/control
   ↓
5. HiveMQ broker delivers to ESP32
   ↓
6. ESP32 receives command and activates relay
   ↓
7. ESP32 publishes acknowledgment: hydro/{device_id}/status
   ↓
8. Backend receives acknowledgment
   ↓
9. Backend emits Socket.io event: controlAck
   ↓
10. Frontend updates UI with confirmation

### 3.3 Authentication Flow
1. User submits login credentials
   ↓
2. Backend validates credentials (bcrypt)
   ↓
3. Backend generates JWT (24h expiry)
   ↓
4. Backend returns JWT to frontend
   ↓
5. Frontend stores JWT (localStorage/HttpOnly cookie)
   ↓
6. Frontend includes JWT in Authorization header
   ↓
7. Backend middleware validates JWT on each request

## 4. Scalability Considerations
### 4.1 Horizontal Scaling
Backend:
Stateless design (no in-memory session)
Load balancer ready (Render handles this)
Multiple instances can run in parallel
Database:
Connection pooling (pg-pool)
Read replicas (Supabase feature)
Vertical scaling first, horizontal later
WebSocket:
Sticky sessions required (Socket.io adapter)
Redis adapter for multi-instance (future)

### 4.2 Vertical Scaling
Current Limits (Free Tier):
Backend: 512MB RAM, 0.1 CPU (Render)
Database: 500MB storage (Supabase)
MQTT: 100 connections (HiveMQ)
Upgrade Path:
Backend: Scale to 2GB RAM, 1 CPU
Database: Upgrade to 10GB storage
MQTT: Upgrade to 1000 connections

### 4.3 Performance Optimization
Database:
Index on (device_id, timestamp)
Materialized views for aggregations
Query result caching (Redis, future)
Backend:
Connection pooling
Async I/O (Node.js event loop)
Batch inserts for sensor data
Frontend:
Code splitting (React.lazy)
Image optimization
CDN for static assets (Vercel)

## 5. Fault Tolerance
### 5.1 Edge Layer
ESP32 Failure Modes:
WiFi disconnection → Auto-reconnect with exponential backoff
MQTT broker unreachable → Local buffering (SD card, future)
Sensor malfunction → Error code in payload, alert dashboard

### 5.2 Transport Layer
MQTT Broker Failure:
HiveMQ Cloud SLA: 99.9% uptime
ESP32 retries with QoS 1
Backend detects missing data, triggers alert

### 5.3 Application Layer
Backend Failure:
Render auto-restart on crash
Health check endpoint: /api/health
Graceful shutdown (close connections)
Database Failure:
Supabase automatic backups (daily)
Point-in-time recovery
Read-only mode during outage

### 5.4 Presentation Layer
Frontend Failure:
Vercel CDN redundancy
Offline mode (service worker, future)
Error boundary for React components

## 6. Security Architecture
### 6.1 Network Security
HTTPS/TLS - All HTTP traffic encrypted
MQTT over TLS - Port 8883, certificate validation
CORS - Whitelist frontend domain only
Rate Limiting - Prevent DDoS attacks

### 6.2 Application Security
JWT Authentication - Stateless, signed tokens
RBAC - Role-based access control
Input Validation - Joi/Zod schema validation
SQL Injection Prevention - Parameterized queries
XSS Protection - Input sanitization, CSP headers

### 6.3 Data Security
Password Hashing - bcrypt (salt rounds ≥ 10)
Sensitive Data - Never log passwords, tokens
Environment Variables - Secrets in .env, not in repo
Database Encryption - Supabase encryption at rest

## 7. Monitoring & Logging
### 7.1 Application Monitoring
Metrics:
Request rate, error rate, latency
WebSocket connection count
MQTT message throughput
Database query performance
Tools:
Render dashboard (backend)
Supabase dashboard (database)
HiveMQ dashboard (MQTT)
Custom logging (Winston/Pino)

### 7.2 Logging Strategy
Log Levels:
ERROR - Critical failures
WARN - Potential issues
INFO - Business events
DEBUG - Development details

Log Format:
{
  "timestamp": "2026-09-14T10:00:00Z",
  "level": "info",
  "message": "Sensor data received",
  "device_id": "hydro_01",
  "ph": 6.8,
  "tds": 450
}

## 8. Deployment Architecture
### 8.1 Infrastructure
┌─────────────────────────────────────────┐
│  Vercel (Frontend)                      │
│  - hydro.web.id                         │
│  - CDN, SSL, Auto-scaling               │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Render (Backend)                       │
│  - Node.js API                          │
│  - Auto-deploy from GitHub              │
│  - Environment variables                │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Supabase (Database)                    │
│  - PostgreSQL                           │
│  - Realtime subscriptions               │
│  - Auto-backups                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  HiveMQ Cloud (MQTT Broker)             │
│  - Managed MQTT service                 │
│  - TLS encryption                       │
│  - Dashboard monitoring                 │
└─────────────────────────────────────────┘

### 8.2 CI/CD Pipeline
Developer → Git Push → GitHub Actions → Build & Test → Deploy
                                                    ↓
                                              Vercel (FE)
                                              Render (BE)


## 9. Future Architecture Enhancements
### 9.1 Phase 2
Redis Cache - Session storage, query caching
Message Queue - RabbitMQ/Kafka for async processing
Microservices - Split backend into services
API Gateway - Centralized routing, rate limiting

### 9.2 Phase 3
Kubernetes - Container orchestration
Multi-region - Geographic redundancy
Edge Computing - Process data closer to devices
AI/ML Pipeline - Predictive analytics

## 10. Architecture Decision Records (ADR)
ADR-001: Use MQTT over HTTP for IoT Communication
Context: Need reliable, lightweight protocol for IoT devices
Decision: Use MQTT with QoS 1
Rationale:
Lower bandwidth than HTTP
Built-in pub/sub pattern
Better for unreliable networks
Industry standard for IoT

Consequences:
Need MQTT broker (HiveMQ)
Additional complexity in backend
Better scalability for many devices

ADR-002: Use PostgreSQL over NoSQL
Context: Need database for time-series sensor data
Decision: Use PostgreSQL with time-series indexing
Rationale:
Strong consistency
SQL querying flexibility
Supabase provides realtime features
Good performance with proper indexing
Consequences:
Need to optimize queries
Partitioning for large datasets
Less flexible schema than NoSQL
ADR-003: Use Socket.io over Raw WebSocket
Context: Need real-time communication to frontend
Decision: Use Socket.io library
Rationale:
Automatic reconnection
Room-based broadcasting
Fallback to polling
Easier to implement
Consequences:
Additional dependency
Slightly larger bundle size
Better developer experience
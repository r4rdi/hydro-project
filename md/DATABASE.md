## `DATABASE.md`

```markdown
# Database Design & Schema
## Hydro: Smart Hydroponic IoT Dashboard

**Version:** 1.0  
**Database:** PostgreSQL 15+ (via Supabase)  
**ORM:** Prisma 5.x
```

---

## 1. Schema Overview
┌──────────────┐ ┌──────────────┐ ┌─────────────────┐
│ users │ │ devices │ │ sensor_logs │
├──────────────┤ ├──────────────┤ ├─────────────────┤
│ id (PK) │◄──────│ owner_id(FK) │ │ id (PK) │
│ email │ │ id (PK) │◄──────│ device_id (FK) │
│ password │ │ device_id │ │ ph │
│ role │ │ name │ │ tds │
│ status │ │ created_at │ │ water_temp │
│ created_at │ └──────────────┘ │ air_temp │
│ updated_at │ │ humidity │
└──────────────┘ │ water_level │
│ timestamp │
┌──────────────┐ └─────────────────┘
│ actuator_logs│
├──────────────┤ ┌──────────────────┐
│ id (PK) │ │ calibration_data │
│ device_id(FK)│◄──────├──────────────────┤
│ actuator │ │ id (PK) │
│ state │ │ device_id (FK) │
│ triggered_by │ │ sensor_type │
│ timestamp │ │ calibration_json │
└──────────────┘ │ calibrated_at │
└──────────────────┘


---

## 2. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  fullName      String    @map("full_name")
  role          Role      @default(OPERATOR)
  status        UserStatus @default(PENDING)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  devices       Device[]
  
  @@map("users")
}

model Device {
  id            String    @id @default(uuid())
  deviceId      String    @unique @map("device_id")
  name          String
  description   String?
  ownerId       String    @map("owner_id")
  isActive      Boolean   @default(true) @map("is_active")
  lastSeenAt    DateTime? @map("last_seen_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  owner         User      @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  sensorLogs    SensorLog[]
  actuatorLogs  ActuatorLog[]
  calibrationData CalibrationData[]
  
  @@map("devices")
}

model SensorLog {
  id            BigInt    @id @default(autoincrement())
  deviceId      String    @map("device_id")
  ph            Decimal   @db.Decimal(4, 2)
  tds           Decimal   @db.Decimal(6, 2)
  waterTemp     Decimal   @map("water_temp") @db.Decimal(5, 2)
  airTemp       Decimal   @map("air_temp") @db.Decimal(5, 2)
  humidity      Decimal   @db.Decimal(5, 2)
  waterLevel    Decimal   @map("water_level") @db.Decimal(5, 2)
  rawPayload    Json?     @map("raw_payload")
  timestamp     DateTime  @default(now())
  
  device        Device    @relation(fields: [deviceId], references: [deviceId], onDelete: Cascade)
  
  @@index([deviceId, timestamp(sort: Desc)])
  @@index([timestamp])
  @@map("sensor_logs")
}

model ActuatorLog {
  id            BigInt    @id @default(autoincrement())
  deviceId      String    @map("device_id")
  actuator      ActuatorType
  state         Boolean
  triggeredBy   String    @map("triggered_by") // "user", "automation", "system"
  userId        String?   @map("user_id")
  timestamp     DateTime  @default(now())
  
  device        Device    @relation(fields: [deviceId], references: [deviceId], onDelete: Cascade)
  
  @@index([deviceId, timestamp(sort: Desc)])
  @@map("actuator_logs")
}

model CalibrationData {
  id            String    @id @default(uuid())
  deviceId      String    @map("device_id")
  sensorType    String    @map("sensor_type") // "ph", "tds", "water_level"
  calibrationJson Json    @map("calibration_json")
  calibratedBy  String    @map("calibrated_by")
  calibratedAt  DateTime  @default(now()) @map("calibrated_at")
  
  device        Device    @relation(fields: [deviceId], references: [deviceId], onDelete: Cascade)
  
  @@index([deviceId, sensorType])
  @@map("calibration_data")
}

enum Role {
  ADMIN
  OPERATOR
}

enum UserStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ActuatorType {
  PUMP
  LIGHT
  DOSING_A
  DOSING_B
}
```

## 3. SQL Migration (Manual Alternative)
Jika tidak menggunakan Prisma, gunakan SQL berikut:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERATOR');
CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE actuator_type AS ENUM ('PUMP', 'LIGHT', 'DOSING_A', 'DOSING_B');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role user_role DEFAULT 'OPERATOR',
  status user_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor logs (time-series optimized)
CREATE TABLE sensor_logs (
  id BIGSERIAL PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  ph DECIMAL(4, 2),
  tds DECIMAL(6, 2),
  water_temp DECIMAL(5, 2),
  air_temp DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  water_level DECIMAL(5, 2),
  raw_payload JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Actuator logs
CREATE TABLE actuator_logs (
  id BIGSERIAL PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  actuator actuator_type NOT NULL,
  state BOOLEAN NOT NULL,
  triggered_by VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Calibration data
CREATE TABLE calibration_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(50) NOT NULL,
  sensor_type VARCHAR(50) NOT NULL,
  calibration_json JSONB NOT NULL,
  calibrated_by VARCHAR(100) NOT NULL,
  calibrated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sensor_logs_device_time ON sensor_logs(device_id, timestamp DESC);
CREATE INDEX idx_sensor_logs_timestamp ON sensor_logs(timestamp DESC);
CREATE INDEX idx_actuator_logs_device_time ON actuator_logs(device_id, timestamp DESC);
CREATE INDEX idx_calibration_device_sensor ON calibration_data(device_id, sensor_type);
CREATE INDEX idx_devices_owner ON devices(owner_id);
CREATE INDEX idx_users_email ON users(email);
```

## 4. Indexing Strategy
### 4.1 Time-Series Optimization
Sensor logs adalah tabel dengan write-heavy workload. Strategi indexing:
```sql
-- Composite index untuk query paling umum
CREATE INDEX idx_sensor_logs_device_time 
ON sensor_logs(device_id, timestamp DESC);

-- Partial index untuk data terbaru (last 7 days)
CREATE INDEX idx_sensor_logs_recent 
ON sensor_logs(device_id, timestamp DESC)
WHERE timestamp > NOW() - INTERVAL '7 days';
```

### 4.2 Query Performance Targets
| Query | Target | Strategy |
|------|---------|----------|
| Last 24h data | < 100ms | Composite index
| Last 7d hourly avg | < 500ms | Materialized view
| Last 30d daily avg | < 1s | Materialized view
| Single device status | < 50ms | Primary key lookup |

## 5. Materialized Views (Analytics)
```sql
-- Hourly aggregation (refresh every hour)
CREATE MATERIALIZED VIEW mv_hourly_stats AS
SELECT 
  device_id,
  date_trunc('hour', timestamp) AS hour,
  AVG(ph) AS avg_ph,
  MIN(ph) AS min_ph,
  MAX(ph) AS max_ph,
  AVG(tds) AS avg_tds,
  AVG(water_temp) AS avg_water_temp,
  AVG(air_temp) AS avg_air_temp,
  AVG(humidity) AS avg_humidity,
  COUNT(*) AS sample_count
FROM sensor_logs
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY device_id, date_trunc('hour', timestamp);

CREATE UNIQUE INDEX idx_mv_hourly_stats 
ON mv_hourly_stats(device_id, hour);

-- Refresh command (run via cron job every hour)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hourly_stats;
```

## 6. Data Retention Policy
```sql
-- Auto-cleanup job (run daily via pg_cron)
DELETE FROM sensor_logs 
WHERE timestamp < NOW() - INTERVAL '90 days';

DELETE FROM actuator_logs 
WHERE timestamp < NOW() - INTERVAL '180 days';
```
**Alternatif**: Gunakan partitioning by month untuk performa lebih baik.

## 7. Common Queries
### 7.1 Get Latest Sensor Reading
```sql
SELECT DISTINCT ON (device_id) 
  device_id, ph, tds, water_temp, air_temp, humidity, water_level, timestamp
FROM sensor_logs
WHERE device_id = $1
ORDER BY device_id, timestamp DESC
LIMIT 1;
```

### 7.2 Get Data for Chart (Last 24h)
```sql
SELECT 
  timestamp,
  ph, tds, water_temp, air_temp, humidity, water_level
FROM sensor_logs
WHERE device_id = $1
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp ASC;
```

### 7.3 Get Hourly Averages (Last 7 days)
```sql
SELECT * FROM mv_hourly_stats
WHERE device_id = $1
  AND hour > NOW() - INTERVAL '7 days'
ORDER BY hour ASC;
```

### 7.4 Get Actuator Usage Stats
```sql
SELECT 
  actuator,
  COUNT(*) FILTER (WHERE state = TRUE) AS on_count,
  COUNT(*) FILTER (WHERE state = FALSE) AS off_count,
  SUM(EXTRACT(EPOCH FROM (
    LEAD(timestamp) OVER (PARTITION BY actuator ORDER BY timestamp) - timestamp
  ))) FILTER (WHERE state = TRUE) AS total_on_seconds
FROM actuator_logs
WHERE device_id = $1
  AND timestamp > NOW() - INTERVAL '7 days'
GROUP BY actuator;
```

## 8. Backup Strategy
### 8.1 Supabase Automatic Backup
Frequency: Daily  
Retention: 7 days (free tier)  
Recovery: Point-in-time recovery available

### 8.2 Manual Backup (Weekly)
```bash
pg_dump -h <host> -U <user> -d <database> -F c -f backup_$(date +%Y%m%d).dump
```

### 8.3 Export to CSV (Monthly)
```sql
\copy sensor_logs TO 'sensor_logs_2026_09.csv' WITH CSV HEADER;
```

## 9. Performance Monitoring
```sql
-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 10. Security
### 10.1 Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own devices
CREATE POLICY device_owner_policy ON devices
  FOR ALL
  USING (owner_id = auth.uid());

-- Policy: Users can see sensor logs for their devices
CREATE POLICY sensor_log_owner_policy ON sensor_logs
  FOR SELECT
  USING (
    device_id IN (
      SELECT device_id FROM devices WHERE owner_id = auth.uid()
    )
  );
```

### 10.2 Connection Security
SSL Mode: require (mandatory)  
Connection Pooling: Supabase built-in (max 100 connections)  
Credentials: Stored in environment variables, never in code
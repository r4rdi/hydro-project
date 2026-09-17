# Product Requirements Document (PRD)
## Hydro: Smart Hydroponic IoT Dashboard

**Version:** 1.0  
**Last Updated:** 2026-09-14  
**Project Name:** Hydro  
**Domain:** hydro.web.id  
**Project Type:** Industrial-Scale IoT Hydroponic Automation Dashboard

---

## 1. Executive Summary

Hydro adalah dashboard web berbasis IoT untuk monitoring dan kontrol sistem hidroponik skala industri. Sistem ini mengintegrasikan perangkat edge (ESP32 + sensor) dengan cloud backend dan frontend modern untuk menyediakan monitoring real-time, kontrol aktuator, dan analitik data dengan akurasi tinggi.

---

## 2. Project Objectives

### 2.1 Primary Goals
1. **Industrial-Scale Automation** — Sistem otomasi pertanian hidroponik berskala besar dengan akurasi sensor tinggi (error < 5%)
2. **Real-Time Monitoring** — Dashboard interaktif yang menampilkan data sensor secara real-time dengan latency < 2 detik
3. **Remote Access** — Akses via internet dari device desktop/mobile dengan domain publik hydro.web.id
4. **Secure Authentication** — Hanya user terdaftar (pemilik/pemrogram) yang dapat mengakses dashboard
5. **Firmware-Software Integration** — Konsistensi penuh antara pin mapping ESP32, payload MQTT, dan tampilan dashboard
6. **Cloud Database** — Database PostgreSQL yang dapat di-deploy publik (bukan hanya lokal)

### 2.2 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Sensor Data Latency | < 2 detik | Time from ESP32 publish → dashboard update |
| pH Sensor Accuracy | Error < 5% (R² > 0.98) | Comparison with calibrated pH meter |
| TDS Sensor Accuracy | Error < 5% | Comparison with calibrated TDS meter |
| Dashboard Uptime | > 99% | Monitoring via UptimeRobot/Pingdom |
| Page Load Time | < 3 detik | Lighthouse performance audit |
| Concurrent Users | 100+ | Load testing with k6/JMeter |

---

## 3. User Personas

### 3.1 Farm Owner/Admin
- **Role:** Full system access, user management, device configuration
- **Needs:** Complete control, analytics, user approval workflow
- **Pain Points:** Manual monitoring, lack of remote access, data inconsistency

### 3.2 Farm Operator
- **Role:** Daily monitoring and control of assigned devices
- **Needs:** Real-time data, quick actuator control, alert notifications
- **Pain Points:** Delayed data, complex interface, unauthorized access risks

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
- [ ] User registration with admin approval workflow
- [ ] JWT-based authentication (24-hour expiry)
- [ ] Role-Based Access Control (RBAC): admin, operator
- [ ] Password hashing with bcrypt (salt rounds ≥ 10)
- [ ] Session management with secure logout

### 4.2 Device Management
- [ ] Register IoT devices with unique device_id
- [ ] Assign devices to users (owner_id)
- [ ] Device status monitoring (online/offline)
- [ ] Device configuration (pin mapping, sensor types)

### 4.3 Real-Time Monitoring
- [ ] Live sensor data display (pH, TDS, temperature, humidity, water level)
- [ ] WebSocket-based real-time updates (Socket.io)
- [ ] Historical data visualization (24h, 7d, 30d)
- [ ] Data export (CSV, JSON)

### 4.4 Actuator Control
- [ ] Remote control of relays (pump, light, dosing A, dosing B)
- [ ] State confirmation feedback
- [ ] Control history logging
- [ ] Emergency stop functionality

### 4.5 Data Analytics
- [ ] Time-series data aggregation (hourly, daily)
- [ ] Statistical analysis (min, max, avg, std dev)
- [ ] Trend visualization with Recharts
- [ ] Anomaly detection alerts (future)

### 4.6 Sensor Calibration
- [ ] Multi-point calibration for pH sensor (4.0, 7.0, 10.0)
- [ ] Temperature compensation for TDS/EC sensor
- [ ] Calibration data storage and retrieval
- [ ] Raw vs calibrated data comparison

---

## 5. Non-Functional Requirements

### 5.1 Performance
- API response time: < 500ms (95th percentile)
- Database query time: < 200ms for time-series data
- WebSocket message delivery: < 100ms
- Frontend rendering: < 3 detik (First Contentful Paint)

### 5.2 Scalability
- Support 100+ concurrent WebSocket connections
- Handle 1000+ sensor readings per minute
- Database storage: 1 year of data without performance degradation

### 5.3 Security
- HTTPS/TLS for all communications
- MQTT over TLS (port 8883)
- Input validation with Joi/Zod
- Rate limiting (100 requests/15 minutes per IP)
- CORS whitelist for frontend domain
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)

### 5.4 Reliability
- 99.9% uptime SLA
- Automatic reconnection for WebSocket/MQTT
- Data persistence guarantee (no data loss)
- Backup strategy (daily PostgreSQL backups)

### 5.5 Maintainability
- Modular code architecture
- Comprehensive logging (Winston/Pino)
- API documentation (Swagger/OpenAPI)
- Code coverage > 80% (unit tests)

---

## 6. Technical Constraints

### 6.1 Hardware Constraints
- ESP32 microcontroller (limited memory: 520KB SRAM)
- MQTT payload size limit: 256KB
- Sensor sampling rate: 5 seconds minimum
- Power consumption optimization required

### 6.2 Software Constraints
- Free tier services (HiveMQ Cloud, Render, Vercel, Supabase)
- Bandwidth limitations on free tiers
- Concurrent connection limits
- Storage limits (Supabase: 500MB free)

### 6.3 Network Constraints
- Unreliable WiFi in farm environment
- Latency variability (rural internet)
- MQTT QoS 1 (at least once delivery)

---

## 7. Assumptions & Dependencies

### 7.1 Assumptions
- Stable internet connection at farm location
- Users have modern browsers (Chrome, Firefox, Safari, Edge)
- ESP32 firmware is pre-flashed and configured
- Sensors are properly calibrated before deployment

### 7.2 Dependencies
- HiveMQ Cloud MQTT broker availability
- Supabase PostgreSQL service uptime
- Render backend service reliability
- Vercel frontend CDN performance
- Domain registrar DNS propagation

---

## 8. Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| MQTT broker downtime | High | Low | Implement local buffering on ESP32 |
| Database performance degradation | Medium | Medium | Index optimization, query caching |
| Sensor drift over time | High | High | Regular calibration schedule |
| Security breach | Critical | Low | Penetration testing, security audit |
| Free tier limitations | Medium | High | Monitor usage, upgrade plan if needed |

---

## 9. Deliverables

### 9.1 Phase 1: MVP (8 weeks)
- [ ] Hardware prototype with sensor integration
- [ ] Backend API with authentication
- [ ] Database schema implementation
- [ ] Frontend dashboard with real-time monitoring
- [ ] MQTT integration (publish/subscribe)
- [ ] Deployment to production domain
- [ ] User documentation

### 9.2 Phase 2: Future Enhancements
- [ ] Multi-device support
- [ ] AI-based nutrient prediction
- [ ] Mobile app (React Native)
- [ ] WhatsApp/Telegram notifications
- [ ] Camera integration
- [ ] Advanced analytics dashboard

---

## 10. Acceptance Criteria

### 10.1 Functional Acceptance
- All user stories pass functional testing
- API endpoints return correct responses
- WebSocket delivers real-time updates
- Database stores and retrieves data accurately

### 10.2 Performance Acceptance
- Load test passes (100 concurrent users)
- Latency metrics meet targets
- No memory leaks after 24h runtime

### 10.3 Security Acceptance
- Penetration test passes
- No critical vulnerabilities (OWASP Top 10)
- Authentication/authorization works correctly

---

## 11. Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| Project Owner | Sponsor | ROI, project success |
| Development Team | Implementer | Technical challenges, code quality |
| End Users (Farm Staff) | Consumer | Usability, reliability |
| IoT Hardware Team | Supplier | Hardware compatibility |

---

## 12. Glossary

| Term | Definition |
|------|------------|
| MQTT | Message Queuing Telemetry Transport - lightweight IoT protocol |
| TDS | Total Dissolved Solids - concentration of dissolved substances |
| EC | Electrical Conductivity - ability to conduct electricity |
| pH | Potential of Hydrogen - acidity/alkalinity measure |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token - compact URL-safe token |
| WebSocket | Full-duplex communication protocol |

---

## 13. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | | | |
| Product Owner | | | |

---

**Document Status:** Draft  
**Next Review Date:** 2026-09-21
# Hydro — Testing & QA

| Jenis Uji | Metode | Target |
|---|---|---|
| Akurasi Sensor | Bandingkan dengan alat standar | Error < 5% |
| Latency | ESP32 publish → dashboard update | < 2 detik |
| Load Test | Simulasi 100 data/menit | Stabil tanpa crash |
| Security Test | Akses tanpa token, SQL injection, XSS | Tidak lolos |
| Cross-browser | Chrome, Firefox, Safari, Edge | Kompatibel |
| Mobile | Android & iOS | Layout rapi |

## Integration Test
Validasi alur `ESP32 → MQTT → Backend → Calibration → PostgreSQL → Socket.io → Frontend`.

## Firmware ↔ Software Checklist
- [ ] Pin mapping sama.
- [ ] Payload JSON sesuai schema.
- [ ] MQTT topic konsisten.
- [ ] Timestamp ISO 8601.
- [ ] Unit sama: °C, PPM, pH.
- [ ] Kalibrasi diterapkan sesuai kebutuhan.

# Hydro — Scope & Roadmap

## MVP
- 1 device (`hydro_01`).
- Monitoring 5 sensor: pH, TDS, suhu air, suhu udara, kelembaban.
- Kontrol 4 relay: pompa, lampu, dosing A, dosing B.
- Grafik historis 24 jam.
- Login/register + approval admin.
- Deployment ke `hydro.web.id`.

## Future Roadmap
- Multi-device & multi-tenant.
- Otomatisasi berbasis AI (prediksi nutrisi).
- Notifikasi WhatsApp/Telegram.
- Mobile app (React Native).
- Integrasi kamera.
- Analitik lanjutan & laporan ekspor.

## Timeline
| Minggu | Aktivitas | Deliverable |
|---|---|---|
| 1-2 | Riset hardware, wiring, firmware dasar ESP32, uji sensor | Prototype hardware |
| 3-4 | Backend, database, MQTT, API autentikasi | API dasar + DB |
| 5-6 | Frontend, dashboard real-time, kontrol | UI dashboard |
| 7 | Integrasi end-to-end, deployment, domain | Website live |
| 8 | Testing, kalibrasi, bug fixing, dokumentasi | Rilis MVP |

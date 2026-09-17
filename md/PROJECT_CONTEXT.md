# Hydro — Project Context

## Identity
- Project: Hydro
- Type: Smart Hidroponik IoT Dashboard
- Scale: Industri
- Domain: `hydro.web.id`
- MVP Version: 1.0

## Description
Hydro adalah dashboard berbasis web untuk memantau dan mengontrol sistem hidroponik skala industri secara real-time, interaktif, dan up-to-date. Sistem mengintegrasikan ESP32 + sensor dengan backend cloud dan frontend modern.

## Goals
1. Mengembangkan Smart Hidroponik berbasis IoT berskala industri dengan akurasi sensor tinggi.
2. Membuat dashboard interaktif, real-time, up-to-date, dan dapat diakses jarak jauh melalui internet.
3. Website dapat digunakan melalui desktop/HP dengan akses berbasis akun.
4. Variabel firmware dan software harus konsisten, termasuk pembacaan sensor dan pin ESP32.
5. Menggunakan database yang dapat dideploy publik, bukan hanya local.

## Success Metrics
| Metrik | Target |
|---|---|
| Latency sensor → dashboard | < 2 detik |
| Akurasi pH | Error < 5% (R² > 0.98) |
| Akurasi TDS | Error < 5% |
| Uptime dashboard | > 99% |
| Load halaman | < 3 detik |

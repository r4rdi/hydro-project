# Hydro — AI Agent Development Rules

1. `MVP.md` adalah sumber requirement utama.
2. Jangan mengubah requirement tanpa persetujuan.
3. Jangan menghapus fitur yang sudah bekerja.
4. Jangan mengubah pin mapping ESP32.
5. Jangan mengubah MQTT topic tanpa alasan dan persetujuan.
6. Jangan mengubah database schema sembarangan.
7. Jangan hardcode API key, password, JWT secret, atau credential.
8. Gunakan environment variables untuk secrets.
9. Periksa struktur repository sebelum membuat perubahan.
10. Reuse component/function yang sudah tersedia.
11. Pertahankan konsistensi nama field antara firmware, MQTT, backend, database, dan frontend.
12. Jika requirement ambigu dan berdampak pada arsitektur/data contract, tanyakan terlebih dahulu.
13. Jangan menambahkan fitur di luar scope tanpa persetujuan.
14. Jangan menganggap fitur selesai sebelum acceptance criteria terpenuhi.
15. Setelah perubahan, lakukan test dan periksa integrasi bagian yang terdampak.

## Workflow
`Understand → Inspect → Plan → Implement → Test → Review Integration → Report`

## Report
Setiap task selesai harus menjelaskan file yang berubah, perubahan, test, dan hal yang belum dapat diverifikasi.

### 📋 Laporan Eksekusi Agent AI

1. **File yang Diubah/Dibuat:**
   - `app/(dashboard)/page.tsx` (UI Real-time Dashboard)
   - `services/mqttSubscriber.js` (MQTT Ingestion & Calibration)
   - `prisma/schema.prisma` (Database Schema)

2. **Ringkasan Perubahan & Fitur:**
   - Berhasil mengintegrasikan WebSocket real-time dengan latency stream ~300ms.
   - Menambahkan algoritma kompensasi suhu ISO $2\%/^\circ\text{C}$ pada pembacaan EC.
   - Menyiapkan RLS (Row Level Security) pada tabel PostgreSQL.

3. **Pengujian yang Dilakukan:**
   - `npm run test` (Unit test API Route PASSED).
   - Simulasi payload JSON via MQTT Broker berhasil masuk ke database dan merender grafik.

4. **Hal yang Perlu Diverifikasi Lebih Lanjut:**
   - Pengujian koneksi fisik ESP32 dengan TLS Certificate aktual saat hardware terpasang.
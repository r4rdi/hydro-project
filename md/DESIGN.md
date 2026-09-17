# Hydro — UI/UX Design Specification & System Guidelines

## 1. Design Goal & Philosophy
Dashboard Monitoring Hidroponik IoT **Hydro** dirancang dengan pendekatan **Dark Elegance & High-Contrast Precision**. Sistem ini mengombinasikan nuansa gelap yang profesional (*dark & muted*) dengan aksen warna futuristik untuk memberikan keterbacaan data (*data legibility*) maksimal, meminimalisir kelelahan mata (*eye strain*), serta memastikan responsivitas interaktif secara *real-time* di seluruh perangkat (Desktop, Tablet, dan Mobile).

---

## 2. Color Palette & Theme System

Sistem warna dibangun menggunakan Tailwind CSS token dengan pendekatan kontras tinggi untuk fleksibilitas teks dan latar belakang (*light/dark exchange*).

### 2.1 Base & Background Colors (Hitam & Muted Dark)
- **Primary Background (Hitam Muted):** `#090A0F` (`bg-slate-950` / `bg-black-rich`) — Latar belakang utama aplikasi.
- **Card / Surface Background:** `#12141D` (`bg-slate-900/80`) — Kontainer untuk kartu sensor, grafik, dan tabel dengan efek *glassmorphism*.
- **Border & Dividers:** `#2E3245` (`border-slate-800`) — Garis batas halus untuk menjaga hirarki visual tanpa terkesan berat.

### 2.2 Accent & Brand Colors (Ungu & Hijau)
- **Primary Purple (Modern Purple):** `#8B5CF6` (`violet-500`) & `#6D28D9` (`violet-700`) — Digunakan untuk elemen navigasi aktif, status IoT terkoneksi, tombol utama, dan aksen *glowing border*.
- **Eco Green (Hydroponic Green):** `#10B981` (`emerald-500`) & `#059669` (`emerald-600`) — Mempresentasikan kesehatan tanaman, status kondisi ideal (pH, TDS, Suhu Air), dan indikator aktif/online.

### 2.3 Highlight & Silhouette Gradients (Oranye Gradient)
- **Silhouette Orange Gradient:** `linear-gradient(135deg, #FF6B00 0%, #FF8E53 100%)` atau `from-orange-500 via-amber-500 to-yellow-500`.
- **Penggunaan:** Digunakan secara elegan pada efek *hover state*, ring lampu indikator aktif, aksen *glow effect* pada grafik/chart, badge alert kritis, serta siluet pencahayaan pada header atau ilustrasi status sensor.

### 2.4 Typography & Background Contrast Swapping (Putih & High-Contrast Text)
- **Primary Text:** `#FFFFFF` (`text-white`) — Untuk judul, angka nilai sensor utama, dan teks penting.
- **Secondary Text:** `#94A3B8` (`text-slate-400`) — Untuk label sensor, unit satuan, timestamp, dan teks penjelasan.
- **Inverted Theme Contrast:** Elemen-elemen interaktif tertentu (seperti Badge khusus atau Tombol *Secondary*) mendukung pertukaran warna (*text & background swapping*) dari Gelap-ke-Putih (`bg-white text-black`) untuk memberikan penekanan aksen (*visual focus*).

---

## 3. Typography & Micro-Interactions

- **Font Family:** `Inter`, `Plus Jakarta Sans`, atau `JetBrains Mono` (khusus data telemetry & angka sensor).
- **Glow Effects:** Manfaatkan `drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]` (Ungu) dan `drop-shadow-[0_0_12px_rgba(255,107,0,0.4)]` (Oranye) untuk memberikan efek neon futuristik pada *card* dan *badge*.
- **Transitions:** Smooth UI state transition (`transition-all duration-300 ease-in-out`).

---

## 4. Pages Structure & Layout

### 4.1 Login / Register
- **Layout:** Centered Glassmorphism Card dengan siluet *background gradient* ungu-oranye yang redup.
- **Components:** Form autentikasi responsif, validasi input *real-time*, dan tombol aksi dengan warna gradasi oranye-ungu.

### 4.2 Dashboard (Main Telemetry & Control)
- **Header:** Ringkasan status koneksi MQTT (`Connected` / `Disconnected`), indikator waktu *real-time*, dan tombol profil.
- **Status Sensor Cards (Cards Grid):**
  - Parameter: pH Air, TDS (PPM), Suhu Air (°C), Humidity (%), dan Suhu Lingkungan.
  - Kartu dilengkapi aksen *glowing border* hijau (kondisi normal) atau oranye (kondisi *warning*).
- **Grafik Real-Time (Interactive Charts):**
  - Line chart adaptif dengan gradasi fill ungu & hijau transparan di bawah garis data.
- **Kontrol Actuator / Relay:**
  - Toggle switch interaktif untuk Pompa Nutrisi, Solenoid Valve, dan Lampu LED Growth dengan indikator visual *glow*.
- **Tabel Data Historis:**
  - Tabel terstruktur dengan paginasi, filter tanggal, dan fitur *export data* (CSV/Excel).

### 4.3 Device Management
- **Layout:** Grid/Table manajemen IoT node.
- **Features:** Modal Tambah/Edit perangkat, registrasi `Device ID` / `API Key` untuk Admin.

### 4.4 Settings
- **Layout:** Tabbed Interface (Profil Pengguna, Ambang Batas Sensor / Thresholds, & Ubah Password).

---

## 5. Responsive & Mobile-First Adaptation
- **Mobile (< 768px):** 
  - Sidebar berubah menjadi *Collapsible Drawer* / *Bottom Navigation Bar*.
  - Grid sensor menyesuaikan dari 4 kolom menjadi 1 atau 2 kolom.
  - Grafik mengaktifkan fitur horizontal scroll/zoom untuk menjaga legibilitas data pada layar kecil.
- **Desktop (>= 1024px):** 
  - Fixed Sidebar dengan ikon dan deskripsi jelas.
  - Dashboard multi-panel dengan tata letak komprehensif tanpa scroll berlebih.

---

## 6. UX States & Edge Cases

| UX State | Visual Indicator & Feedback |
| :--- | :--- |
| **Loading** | *Skeleton loader* berkilau (*pulsing dark-slate animation*) pada kartu dan tabel. |
| **Empty Data** | Ilustrasi siluet oranye redup dengan pesan "Belum ada data sensor tercatat". |
| **Error / Alert** | Notification Badge dengan warna aksen Oranye/Merah berpijar (*glowing stroke*). |
| **Connected (MQTT)**| Badge Hijau Energetik (`bg-emerald-500/20 text-emerald-400 border-emerald-500/40`) dengan animasi *ping dot*. |
| **Offline / Stale**| Badge Abu-abu/Ungu Gelap (`bg-slate-800 text-slate-400`) menunjukkan data terakhir yang tersimpan (*last seen*). |

---

## 7. Consistent Naming Conventions

Untuk mempermudah integrasi antara **Firmware IoT (ESP32)**, **MQTT Broker**, **Backend API**, dan **Database (DBA)**:

- **Sensors:** `ph_level`, `tds_ppm`, `water_temp`, `ambient_temp`, `ambient_humidity`
- **Actuators:** `relay_pump_nutrition`, `relay_pump_water`, `relay_led_grow`
- **Device Status:** `online`, `offline`, `maintenance`
- **Units:** `pH`, `ppm`, `°C`, `%`
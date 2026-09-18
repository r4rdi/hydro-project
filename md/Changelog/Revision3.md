# Hydro — Water Temp Card Visual Specification
**Project Name:** Hydro - Enterprise Smart Hydroponic IoT Platform  
**Target Domain:** `hydro.web.id`  
**Version:** 3.2.0 (Water Temp Visual Indicator)  
**Status:** Approved Design Specification  
**Parent Docs:** `Revision2.md`, `DESIGN.md`, `MVP.md`  
**Authors:** UI/UX Designer, Data Analyst, Web Developer

---

## 1. Latar Belakang & Tujuan

Kartu `Water Temp` pada Dashboard Hydro memerlukan **indikator visual berbasis warna background** yang mampu mengomunikasikan status suhu air secara instan kepada operator, tanpa harus membaca angka terlebih dahulu.

Pendekatan ini melengkapi spesifikasi pada `Revision2.md` yang telah menetapkan:
- **Sparkline Chart** sebagai elemen utama kartu Water Temp untuk analisis tren.
- **Dynamic Badge Component** untuk status `OPTIMAL` / `WARNING`.

Dokumen ini menambahkan **dimensi warna background** sebagai indikator status termal, selaras dengan filosofi visual `DESIGN.md` (Dark Elegance & High-Contrast Precision) serta tetap menggunakan palet Tailwind CSS yang telah ditetapkan.

---

## 2. Dasar Agronomi

Rentang suhu air yang relevan untuk sistem hidroponik:

| Parameter | Nilai | Keterangan |
|---|---|---|
| Rentang pembacaan sensor (DS18B20) | `0 – 50 °C` | Batas operasional probe |
| Rentang optimal hidroponik | `18 – 24 °C` | 65°F – 75°F, standar industri |
| Titik paling ideal | `20 – 22 °C` | Penyerapan nutrisi maksimal & oksigen terlarut tinggi |
| Ambang stress dingin | `< 15 °C` | Metabolisme tanaman melambat |
| Ambang stress panas | `> 26 °C` | Oksigen terlarut turun, risiko pathogen naik |

Rentang ini menjadi dasar pemetaan warna bertahap (*gradual color mapping*).

---

## 3. Peta Warna Background Berdasarkan Rentang Suhu

| Rentang Suhu | Zona | Warna Dasar | Tailwind Background | Text & Glow Accent |
|---|---|---|---|---|
| `< 8°C` | ❄️ Freezing / Critical Cold | Deep Navy Blue | `bg-blue-950/70 border-blue-700/60` | `text-blue-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]` |
| `8 – 12°C` | 🧊 Very Cold | Dark Blue | `bg-blue-900/60 border-blue-600/50` | `text-blue-200` |
| `12 – 15°C` | 💧 Cold | Blue | `bg-blue-800/50 border-blue-500/40` | `text-blue-100` |
| `15 – 18°C` | 🌊 Cool | Cyan / Sky | `bg-cyan-700/40 border-cyan-500/40` | `text-cyan-100` |
| `18 – 20°C` | 🌱 Optimal (Lower Bound) | Light Emerald | `bg-emerald-700/40 border-emerald-500/50` | `text-emerald-100` |
| **`20 – 22°C`** | ✅ **PEAK OPTIMAL** | Vibrant Emerald (glow) | `bg-emerald-600/50 border-emerald-400/70` | `text-white drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]` |
| `22 – 24°C` | 🌿 Optimal (Upper Bound) | Light Emerald | `bg-emerald-700/40 border-emerald-500/50` | `text-emerald-100` |
| `24 – 26°C` | ⚠️ Warm (Warning) | Amber | `bg-amber-600/40 border-amber-500/50` | `text-amber-100` |
| `26 – 30°C` | 🔥 Hot | Orange | `bg-orange-600/50 border-orange-500/60` | `text-orange-100 drop-shadow-[0_0_12px_rgba(255,107,0,0.4)]` |
| `30 – 35°C` | 🔥🔥 Very Hot | Deep Orange | `bg-orange-700/60 border-orange-500/70` | `text-orange-50` |
| `35 – 40°C` | 🚨 Critical | Red-Orange | `bg-red-600/50 border-red-500/60` | `text-red-50 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]` |
| `> 40°C` | 💀 Extreme / Danger | Deep Red (pulsing) | `bg-red-700/60 border-red-500/80 animate-pulse` | `text-white drop-shadow-[0_0_16px_rgba(239,68,68,0.7)]` |

---

## 4. Logika Gradasi Visual
COLD ◄────────────────── OPTIMAL ──────────────────► HOT

🔵🔵🔵 → 🩵🩵 → 🟦🟦 → 🟢🟢 → 🟢✅🟢 → 🟢🟢 → 🟠🟠 → 🔴🔴
<8 8-12 12-18 18-20 20-22 22-24 24-30 >40
(Deep) (Dark) (Blue) (Cool) (PEAK) (Mild) (Warn) (Crit)


**Prinsip:** transisi `biru (dingin) → hijau (ideal) → oranye → merah (panas)`. Warna bertransisi secara bertahap (*smooth gradient*) agar pengguna tidak terkejut ketika nilai berubah.

---

## 5. Implementasi React / Next.js

### 5.1 Utility Helper — `lib/waterTempStyle.ts`

```typescript
// lib/waterTempStyle.ts
export type TempStatus =
  | "freezing"
  | "cold"
  | "cool"
  | "optimal"
  | "peak"
  | "warm"
  | "hot"
  | "critical";

export interface WaterTempStyle {
  status: TempStatus;
  label: string;
  bgClass: string;
  textClass: string;
  glowClass: string;
  icon: string;
}

export function getWaterTempStyle(temp: number): WaterTempStyle {
  if (temp < 8) {
    return {
      status: "freezing",
      label: "CRITICAL COLD",
      bgClass: "bg-blue-950/70 border-blue-700/60",
      textClass: "text-blue-300",
      glowClass: "drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]",
      icon: "❄️",
    };
  }
  if (temp < 12) {
    return {
      status: "cold",
      label: "VERY COLD",
      bgClass: "bg-blue-900/60 border-blue-600/50",
      textClass: "text-blue-200",
      glowClass: "drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]",
      icon: "🧊",
    };
  }
  if (temp < 15) {
    return {
      status: "cold",
      label: "COLD",
      bgClass: "bg-blue-800/50 border-blue-500/40",
      textClass: "text-blue-100",
      glowClass: "drop-shadow-[0_0_8px_rgba(147,197,253,0.3)]",
      icon: "💧",
    };
  }
  if (temp < 18) {
    return {
      status: "cool",
      label: "COOL",
      bgClass: "bg-cyan-700/40 border-cyan-500/40",
      textClass: "text-cyan-100",
      glowClass: "drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]",
      icon: "🌊",
    };
  }
  if (temp < 20) {
    return {
      status: "optimal",
      label: "OPTIMAL",
      bgClass: "bg-emerald-700/40 border-emerald-500/50",
      textClass: "text-emerald-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      icon: "🌱",
    };
  }
  if (temp <= 22) {
    return {
      status: "peak",
      label: "PEAK OPTIMAL",
      bgClass: "bg-emerald-600/50 border-emerald-400/70",
      textClass: "text-white",
      glowClass: "drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]",
      icon: "✅",
    };
  }
  if (temp <= 24) {
    return {
      status: "optimal",
      label: "OPTIMAL",
      bgClass: "bg-emerald-700/40 border-emerald-500/50",
      textClass: "text-emerald-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      icon: "🌿",
    };
  }
  if (temp <= 26) {
    return {
      status: "warm",
      label: "WARM",
      bgClass: "bg-amber-600/40 border-amber-500/50",
      textClass: "text-amber-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]",
      icon: "⚠️",
    };
  }
  if (temp <= 30) {
    return {
      status: "hot",
      label: "HOT",
      bgClass: "bg-orange-600/50 border-orange-500/60",
      textClass: "text-orange-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(255,107,0,0.4)]",
      icon: "🔥",
    };
  }
  if (temp <= 35) {
    return {
      status: "hot",
      label: "VERY HOT",
      bgClass: "bg-orange-700/60 border-orange-500/70",
      textClass: "text-orange-50",
      glowClass: "drop-shadow-[0_0_14px_rgba(234,88,12,0.5)]",
      icon: "🔥🔥",
    };
  }
  if (temp <= 40) {
    return {
      status: "critical",
      label: "CRITICAL",
      bgClass: "bg-red-600/50 border-red-500/60",
      textClass: "text-red-50",
      glowClass: "drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]",
      icon: "🚨",
    };
  }
  return {
    status: "critical",
    label: "EXTREME",
    bgClass: "bg-red-700/60 border-red-500/80 animate-pulse",
    textClass: "text-white",
    glowClass: "drop-shadow-[0_0_16px_rgba(239,68,68,0.7)]",
    icon: "💀",
  };
}
```

### 5.2 Komponen Kartu — components/sensors/WaterTempCard.tsx

```tsx
// components/sensors/WaterTempCard.tsx
"use client";

import { getWaterTempStyle } from "@/lib/waterTempStyle";

interface Props {
  value: number; // °C
  timestamp?: string;
}

export function WaterTempCard({ value, timestamp }: Props) {
  const style = getWaterTempStyle(value);

  return (
    <div
      className={`
        relative rounded-2xl border backdrop-blur-sm p-5
        transition-all duration-500 ease-in-out
        ${style.bgClass} ${style.glowClass}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-300 font-medium">Water Temp</span>
        <span className={`text-xs font-semibold tracking-wide ${style.textClass}`}>
          {style.icon} {style.label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold font-mono tabular-nums ${style.textClass}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-lg text-slate-400">°C</span>
      </div>

      {/* Timestamp */}
      {timestamp && (
        <div className="mt-3 text-xs text-slate-400/80">
          Updated {timestamp}
        </div>
      )}

      {/* Optional: smooth gradient transition bar showing 0–50°C scale */}
      <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden bg-gradient-to-r from-blue-600 via-emerald-500 to-red-600">
        <div
          className="h-full bg-white/40 border-r-2 border-white transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, (value / 50) * 100))}%` }}
        />
      </div>
    </div>
  );
}
```

## 6. Manfaat UX dari Skema Warna
Recognition over Recall — Operator bisa langsung tahu kondisi air tanpa membaca angka, cukup lewat warna card.

Consistency — Skema warna ini selaras dengan filosofi DESIGN.md:

🟢 Hijau = sehat / optimal

🟠 Oranye = warning

🔴 Merah = critical

🔵 Biru = cold / info

Non-intrusive Animation — Hanya zona EXTREME (>40°C) yang menggunakan animate-pulse untuk mencegah visual fatigue pada kondisi normal.

Accessibility — Kontras teks text-{color}-100 di atas background gelap tetap memenuhi WCAG AA.

## 7. Catatan Integrasi
Sumber data: nilai sensors.water_temp dari ThingsBoard REST API (lihat Revision.md §3).

Fallback: Jika water_temp bernilai null / undefined, gunakan style default bg-slate-800 text-slate-400 dengan label ⚫ OFFLINE.

Threshold configurable: Rentang optimal 18–24°C sebaiknya disimpan sebagai env / threshold di tabel konfigurasi, bukan hardcoded, agar bisa disesuaikan per jenis tanaman pada fase P1.

Konsistensi kontrak: Gunakan field name water_temp (snake_case) sesuai IoT Contract — tidak menggunakan suhuAir atau temp_water.

Reusability: Pola utility + komponen ini dapat direplikasi untuk pH, EC/TDS, Humidity, dan Water Level agar seluruh grid sensor memiliki bahasa visual yang konsisten.

## 8. Roadmap Lanjutan (P1)
□ Ekstraksi base component SensorCard yang menerima props style agar tidak duplikasi layout.
□ Replikasi pola warna untuk sensor pH (linear gradient slider / lakmus spectrum).  
□ Replikasi pola gauge untuk EC/TDS (semi-circle radial bar).  
□ Replikasi liquid wave fill untuk Humidity & Water Level.  
□ Integrasi sparkline tren suhu (Recharts) di dalam kartu (lihat Revision2.md).    

Document Status: Approved
Next Review: Menunggu implementasi P1 untuk konsolidasi base SensorCard.


---

## 📋 Ringkasan

File `Revision3.md` di atas berisi **spesifikasi lengkap pemetaan warna background untuk kartu Water Temp**, mencakup:

1. **Latar belakang & dasar agronomi** — rentang 0–50°C dengan titik optimal 20–22°C.
2. **Tabel peta warna lengkap** — 12 zona dari `Freezing` hingga `Extreme` dengan class Tailwind eksplisit.
3. **Logika gradasi visual** — diagram transisi biru → hijau → oranye → merah.
4. **Implementasi TypeScript** — utility `getWaterTempStyle()` + komponen `WaterTempCard.tsx` yang siap dipakai di Next.js.
5. **Manfaat UX, catatan integrasi ThingsBoard, dan roadmap P1** — termasuk rencana replikasi pola ke sensor lain (pH, EC/TDS, Humidity, Water Level).

File ini konsisten dengan `DESIGN.md` (Dark Elegance, palet Tailwind yang sudah ditetapkan), `Revision2.md` (pendekatan visual per sensor), dan `Revision.md` (integrasi ThingsBoard REST API).

Apakah Anda ingin saya lanjutkan membuat spesifikasi serupa untuk **kartu pH** (linear gradient slider spektrum lakmus) atau **kartu EC/TDS** (semi-circle gauge)?
# Hydro — Data Analysis & Sensor Calibration

## pH — E-201C-Blue
- Kalibrasi 3 titik: buffer pH 4, 7, 10.
- Regresi linear: `pH = a * ADC + b`.
- Target error < 5% (R² > 0.98).

## TDS/EC — TDS Meter V1
`EC_25 = EC_terbaca / (1 + 0.02 * (T - 25))`

`TDS = EC_25 * 0.5`

Target error < 5%.

## DS18B20
Akurasi ±0.5°C; tidak perlu kalibrasi khusus.

## Water Level
Kalibrasi jarak minimum dan maksimum.

## Processing
`Raw Sensor → Validation → Calibration → Calibrated Data → Database + Dashboard`

## Future
- Prediksi kebutuhan nutrisi dengan ML.
- Deteksi anomali.
- Dashboard analitik mingguan/bulanan.

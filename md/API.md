# Hydro — Backend API Contract

## Stack
Node.js, Express, MQTT.js, Socket.io, JWT, Bcrypt.

## Endpoints
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi user (perlu approval admin) |
| POST | `/api/auth/login` | Login, return JWT |
| GET | `/api/devices` | List perangkat milik user |
| GET | `/api/sensor-data?device_id=&start=&end=` | Data historis |
| POST | `/api/control` | Kirim perintah kontrol ke MQTT |
| GET | `/api/me` | Profil user |

## MQTT Subscriber
Subscribe `hydro/+/sensor`, parse payload, kalibrasi, simpan ke `sensor_logs`, lalu emit `sensorUpdate` ke room `device_{device_id}`.

## Rules
- Validasi input.
- Protect endpoint yang memerlukan autentikasi.
- Parameterized queries.
- Jangan hardcode secrets.
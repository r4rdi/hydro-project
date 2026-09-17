# Hydro — Production & Deployment

## Platforms
| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase |
| MQTT Broker | HiveMQ Cloud |
| Domain | `hydro.web.id` |

## Backend Environment
```text
DATABASE_URL=postgres://...
MQTT_BROKER_URL=mqtts://...
MQTT_USERNAME=...
MQTT_PASSWORD=...
JWT_SECRET=...
PORT=3000
```

## Frontend Environment
```text
VITE_API_URL=https://hydro-api.onrender.com
VITE_SOCKET_URL=https://hydro-api.onrender.com
```

## Domain DNS
```text
Type: CNAME
Name: hydro (atau @)
Value: cname.vercel-dns.com
```
Kemudian tambahkan `hydro.web.id` di Vercel → Settings → Domains. SSL/HTTPS otomatis oleh Vercel.

# Hydro — Realtime Specification

## Pipeline
```text
ESP32 → MQTT → HiveMQ → Backend Subscriber → Calibration → PostgreSQL → Socket.io → React
```

## Socket.io
Client join room: `device_{deviceId}`.

```javascript
socket.emit('joinRoom', `device_${deviceId}`);
socket.on('sensorUpdate', (data) => {
  setSensorData(data);
});
```

## Target
Latency sensor → dashboard < 2 detik.

## Required Handling
- Connection established.
- Connection lost.
- Reconnection.
- Error/offline state.
- Konsistensi field dan unit antara MQTT, backend, database, dan frontend.

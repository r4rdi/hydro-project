# Hydro — Firmware & Hardware Contract

## Pin Mapping
| Modul | Pin ESP32 | Keterangan |
|---|---|---|
| Sensor pH | GPIO 35 | ADC1_CH7 |
| Sensor TDS | GPIO 34 | ADC1_CH6 |
| DS18B20 | GPIO 4 | OneWire |
| DHT22 | GPIO 15 | Digital |
| Relay Pompa | PCF8574 P0 | I2C SDA 21, SCL 22 |
| Relay Lampu | PCF8574 P1 | I2C |
| Relay Dosing A | PCF8574 P2 | I2C |
| Relay Dosing B | PCF8574 P3 | I2C |
| Level Air | GPIO 5 Trig, 18 Echo | Digital |

**Pin mapping harus sama persis antara firmware dan konfigurasi backend.**

## MQTT Sensor
Topic: `hydro/{device_id}/sensor`

```json
{
  "device_id": "hydro_01",
  "ph": 6.8,
  "tds": 450,
  "water_temp": 25.5,
  "air_temp": 28.0,
  "humidity": 65.0,
  "water_level": 80.0,
  "timestamp": "2026-09-14T10:00:00Z"
}
```

## MQTT Control
Topic: `hydro/{device_id}/control`

```json
{
  "device_id": "hydro_01",
  "pump": true,
  "light": false,
  "dosing_a": false,
  "dosing_b": false
}
```

## Firmware Stack
Arduino/PlatformIO, PubSubClient, OneWire, DallasTemperature, DHT.

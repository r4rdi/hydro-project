# Hydro — Security Specification

| Aspek | Implementasi |
|---|---|
| Transport | HTTPS + MQTT over TLS |
| Password | Bcrypt hash (salt rounds ≥ 10) |
| Session | JWT expiry 24 jam |
| MQTT | Username/password authentication |
| API | Validasi input (Joi/Zod) |
| Rate Limiting | Express-rate-limit (mis. 100 req/15 menit) |
| CORS | Whitelist domain frontend |
| SQL Injection | Parameterized queries |
| XSS | Sanitasi input di frontend |
| Environment | Secrets via `.env`, tidak commit ke repo |

Secrets tidak boleh ditulis langsung di source code.

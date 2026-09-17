# Hydro — Authentication & Authorization

## Registration Flow
`Register → pending → Admin approve → approved → Login → Dashboard`

## Authentication
- JWT.
- Penyimpanan dapat berupa localStorage atau HttpOnly cookie untuk lebih aman.
- Header: `Authorization: Bearer <token>`.
- Expiry: 24 jam.

## Roles
| Role | Akses |
|---|---|
| admin | Full access, kelola user & device |
| operator | Monitoring & kontrol device yang diberikan |

## Password
Bcrypt hash, salt rounds ≥ 10.

## Rules
User pending tidak dapat login. Dashboard dan endpoint protected harus membutuhkan authentication. Operator hanya dapat mengakses device yang diberikan.

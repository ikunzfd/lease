# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

```
d:\lease\
├── lease/              # Spring Boot 3.0.5 backend (Java 17, Maven multi-module)
│   ├── model/          #   JPA entities + enums
│   ├── common/         #   Shared: Result<T>, JWT utils, Redis/MinIO/AliyunSMS config
│   └── web/            #   Aggregator POM (no own source)
│       ├── web-admin/  #     Admin API — port 8080, auth via captcha+password
│       └── web-app/    #     Tenant-facing API — port 8081, auth via SMS code
├── rentHouseAdmin/     # Admin dashboard (Vue 3 + Element Plus + Vite 4 + TypeScript)
├── rentHouseH5/        # Mobile H5 tenant app (Vue 3 + Vant 4 + Vite 4 + TypeScript)
├── images/             # Seed images for MinIO upload
├── lease.sql           # Full DB schema dump (no Flyway/Liquibase)
└── README.md           # (empty — this file is the primary documentation)
```

## How the Three Sub-Projects Relate

```
┌──────────────────────────────────────────────────────────────────┐
│  rentHouseAdmin/          rentHouseH5/                            │
│  (Vue 3 + Element Plus)   (Vue 3 + Vant 4)                       │
│  Dev: localhost:5173      Dev: localhost:5174                     │
│  Proxy /admin -> :8080    Proxy /app   -> :8081                   │
└──────┬──────────────────────────┬─────────────────────────────────┘
       │ HTTP (axios)             │ HTTP (axios)
       │ access-token header      │ access-token header
       ▼                          ▼
┌──────────────────────────────────────────────────────────────────┐
│  lease/ — Spring Boot backend (Java 17)                          │
│                                                                  │
│  web-admin (port 8080)          web-app (port 8081)              │
│  ───────────────────────        ──────────────────────           │
│  Controllers under /admin/**    Controllers under /app/**        │
│  Login: captcha + password      Login: SMS verification code     │
│  JWT auth: all /admin/** except  JWT auth: all /app/** except    │
│    /admin/login/**                /app/login/**                  │
│  Scheduled: ScheduleTasks.java   @EnableAsync (SMS sending)      │
└──────────────────────┬───────────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       MySQL         Redis        MinIO
       :3306         :6379        :9000
       lease DB      captcha,     images
                     SMS rate
                     limit
```

Both API surfaces share the same MySQL database, Redis instance, and MinIO bucket. The `model` and `common` Maven modules are shared between both web modules.

## Backend Module Dependency Chain

```
model  ←  no dependencies (entities + enums only)
   ↓
common  ←  depends on model (MyBatis-Plus, JWT, Redis, MinIO, Aliyun SMS, Result<T>)
   ↓
web (aggregator POM, no source of its own)
   ├── web-admin  ←  depends on common + model (port 8080)
   └── web-app    ←  depends on common + model (port 8081)
```

- **model/** — JPA entities (`BaseEntity` subclasses) and enums (`LeaseStatus`, `AppointmentStatus`, `ReleaseStatus`, etc.). Enum pattern: implements `BaseEnum` interface with `getCode()`.
- **common/** — Shared infrastructure: `Result<T>` response wrapper, `ResultCodeEnum` (all error codes), `JwtUtil`, `LoginUserHolder` (ThreadLocal), MyBatis-Plus auto-fill config, MinIO client, Aliyun SMS client, Redis config, global exception handler.
- **web-admin/** — Admin REST API: apartment/room/fee/label/facility/lease/user management, file upload via MinIO, scheduled tasks.
- **web-app/** — Tenant-facing REST API: SMS login, room search, apartment detail, appointments, agreements, browsing history, region/payment/term lookups.

## Infrastructure Dependencies

| Service | Host | Port | Credentials | Used For |
|---------|------|------|-------------|----------|
| MySQL | 192.168.10.101 | 3306 | root / Whqr6842555! | Primary database (schema in `lease.sql`) |
| Redis | 192.168.10.101 | 6379 | (none) | Captcha storage, SMS rate limiting |
| MinIO | 192.168.10.101 | 9000 | minioadmin / minioadmin | Image/file storage (bucket: `lease`) |

All connection details are in `application.yml` files under `web-admin` and `web-app`. No database migration tool — `lease.sql` is the schema source of truth. Import it once against MySQL to initialize.

## API Contracts

**Unified response format** (`com.zfd.lease.common.result.Result<T>`):

```json
{ "code": 200, "data": T, "message": "success" }
```

**Key error codes** (from `ResultCodeEnum`):

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | General failure |
| 301 | Admin account exists |
| 302 | Admin captcha wrong |
| 305 | Admin not logged in |
| 501 | App not logged in |
| 502 | Phone empty |
| 504 | SMS sent too often |
| 601 | Token expired |
| 602 | Token invalid |

Both frontends check for `[601, 602, 305]` to detect token expiry and redirect to login.

## Authentication Architecture

Both entry points use JWT via the `access-token` HTTP header. The `JwtUtil` in the `common` module handles token creation and parsing.

- **Admin login**: Username/password + captcha. Captcha verified against Redis, credentials validated against `system_user` table, returns JWT.
- **App login**: Phone number → SMS code. Code sent via Aliyun SMS, stored in Redis with expiry. User submits phone + code, verified against Redis, returns JWT.
- **Request auth**: `AuthenticationInterceptor` (admin: `AuthenticationInterception`) reads `access-token` header, parses JWT, stores `userId`/`username` in `LoginUserHolder` ThreadLocal, cleared after request completes.
- **Token expiry**: Both frontend HTTP interceptors catch `60x`/`305` responses, clear stored state, redirect to login page.

## Key Architectural Decisions

1. **Duplicate mapper XML per web module** — Both web-admin and web-app maintain separate copies of MyBatis mapper interfaces and XML under `src/main/resources/mapper/`. They are NOT shared through `common`. Modifying one does not affect the other.
2. **Separate service layer per web module** — Even where business logic is similar (e.g., `RoomInfoServiceImpl` exists in both), each web module has its own service implementation. The `common` module contains only infrastructure, no business logic.
3. **Port separation** — Admin and tenant APIs run on different ports (8080 vs 8081), allowing independent deployment and scaling.
4. **Static DB schema** — Schema defined once in `lease.sql`. Any schema change must be manually applied and the dump file updated.
5. **No tests exist** in any sub-project.

## Commonly Used Commands

### Backend (lease/)

```bash
cd d:\lease\lease

# Build the entire backend (model → common → web)
mvn clean package -DskipTests

# Run admin API server (port 8080)
mvn -pl web/web-admin spring-boot:run -DskipTests

# Run app API server (port 8081)
mvn -pl web/web-app spring-boot:run -DskipTests
```

### Admin Frontend (rentHouseAdmin/)

```bash
cd d:\lease\rentHouseAdmin
npm install
npm run dev           # HMR at http://localhost:5173 (proxies /admin -> :8080)
npm run build         # Production build
```

### H5 Frontend (rentHouseH5/)

```bash
cd d:\lease\rentHouseH5
npm install
npm run dev           # HMR at http://localhost:5174 (proxies /app -> :8081)
npm run build         # Production build
```

### First-Time Setup

1. Import `lease.sql` into MySQL at 192.168.10.101:3306
2. Ensure Redis and MinIO are running at 192.168.10.101
3. Build the backend first, then start both frontends
4. Admin API docs: http://localhost:8080/doc.html (Knife4j Swagger)
5. App API docs: http://localhost:8081/doc.html (Knife4j Swagger)

## Module Boundaries

- **lease/** — Backend. The H5 frontend's CLAUDE.md states: "do not modify backend or admin code." Only change when explicitly tasked.
- **rentHouseAdmin/** — Admin frontend. Shares HTTP interceptor patterns (axios, token injection, error handling) with H5 but otherwise independent.
- **rentHouseH5/** — See [rentHouseH5/CLAUDE.md](rentHouseH5/CLAUDE.md) for detailed API endpoint reference, route structure, component conventions, and coding standards.
- **images/** — Seed images (room/apartment photos) for MinIO upload during development.
- **lease.sql** — Single source of truth for the database schema. Any schema change must update this file.

## Environment Variables

| Variable | Required For | Default |
|----------|-------------|---------|
| `ALIYUN_ACCESS_KEY_ID` | SMS sending (app login) | empty |
| `ALIYUN_ACCESS_KEY_SECRET` | SMS sending (app login) | empty |

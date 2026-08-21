# Employee Management System — Backend (Spring Boot)

Group ID: 2026-Y2-S1-MLB-B10G1-05 · Module: SE2030 Software Engineering

This is the REST API backend for all six modules from the proposal: **Employee**, **Attendance**,
**Leave**, **Department & Position**, **Payroll**, and **Performance & Reports** — plus a shared
**Auth** (JWT) module and a **Notifications** module.

The frontend (React) has not been built yet — this phase covers the backend only.

## 1. Tech stack

- Java 17, Spring Boot 3.5.3
- Spring Web, Spring Data JPA, Spring Security (JWT, stateless)
- MySQL (via `mysql-connector-j`)
- Lombok (reduces boilerplate on entities/DTOs)
- `jjwt` for token generation/validation

## 2. Project structure

```
backend/src/main/java/com/__Y2_S1_MLB_B10G1_05/demo/
├── auth/            User entity, Role, JWT filter/util, login & register
├── config/          SecurityConfig (JWT filter chain, CORS, method security)
├── common/          Shared exceptions + global error handler
├── department/      Department & Position (CRUD)
├── employee/         Employee profile (linked 1:1 to a User account)
├── attendance/        Check-in / check-out, attendance history
├── leave/            Leave application, approve/reject/cancel
├── payroll/          Salary records, mark-as-paid
├── performance/       Performance evaluations
├── notification/     In-app notifications
└── reports/          Admin dashboard summary
```

Each module follows the same pattern: `Entity → Repository → DTOs → Service → Controller`.

## 3. Setup

1. **Create the MySQL database** (or let Hibernate do it — `createDatabaseIfNotExist=true` is
   already set):
   ```sql
   CREATE DATABASE ems_db;
   ```
   A human-readable copy of the resulting schema is in `database/schema.sql` for reference.

2. **Edit `backend/src/main/resources/application.properties`** and set your real MySQL
   username/password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
   Also replace `app.jwt.secret` with your own long random string before any real deployment.

3. **Run the backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   The API starts on `http://localhost:8080`. Tables are created/updated automatically
   (`spring.jpa.hibernate.ddl-auto=update`).

## 4. Authentication

- `POST /api/auth/register` — creates a `User` (and returns a JWT). Body includes `role`
  (`ADMIN`, `MANAGER`, or `EMPLOYEE`). **Use this once to create your first ADMIN account** —
  after that, admins should create Employee/Manager accounts via `POST /api/employees` instead,
  since that also creates the linked Employee record (department, position, joined date).
- `POST /api/auth/login` → `{ username, password }` → returns `{ token, userId, username,
  fullName, role }`.
- Send the token on every subsequent request: `Authorization: Bearer <token>`.
- `GET /api/auth/me` — current user's profile.

Role gates are enforced with `@PreAuthorize` on controllers, matching the proposal's
Admin/Manager/Employee access levels (e.g. only `ADMIN` can create departments/positions or
delete employees; `ADMIN`/`MANAGER` can view all employees, approve leave, and see reports).

## 5. API reference (by module)

| Module | Endpoint | Notes |
|---|---|---|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | |
| **Department** | `GET/POST /api/departments`, `GET/PUT/DELETE /api/departments/{id}` | POST/PUT/DELETE = ADMIN |
| **Position** | `GET/POST /api/positions`, `GET /api/positions/department/{deptId}`, `GET/PUT/DELETE /api/positions/{id}` | POST/PUT/DELETE = ADMIN |
| **Employee** | `GET /api/employees`, `GET /api/employees/search?name=&departmentId=&positionId=`, `GET /api/employees/{id}`, `GET /api/employees/by-user/{userId}`, `POST /api/employees`, `PUT /api/employees/{id}`, `PUT /api/employees/{id}/deactivate`, `DELETE /api/employees/{id}` | Creating an employee also creates their login account |
| **Attendance** | `POST /api/attendance/check-in`, `PUT /api/attendance/check-out/{employeeId}`, `GET /api/attendance/employee/{employeeId}`, `GET /api/attendance/by-date?date=YYYY-MM-DD`, `GET /api/attendance` | Auto-marks `LATE` after 9:15 AM |
| **Leave** | `POST /api/leaves`, `GET /api/leaves/employee/{employeeId}`, `GET /api/leaves/pending`, `PUT /api/leaves/{id}/approve`, `PUT /api/leaves/{id}/reject`, `PUT /api/leaves/{id}/cancel` | Approve/reject = ADMIN/MANAGER |
| **Payroll** | `POST /api/payroll`, `GET /api/payroll/employee/{employeeId}`, `GET /api/payroll`, `PUT /api/payroll/{id}/mark-paid` | Net salary auto-calculated |
| **Performance** | `POST /api/performance`, `GET /api/performance/employee/{employeeId}`, `GET /api/performance/department/{departmentId}`, `GET /api/performance` | |
| **Notifications** | `GET /api/notifications/user/{userId}`, `GET /api/notifications/user/{userId}/unread`, `PUT /api/notifications/{id}/read` | |
| **Reports** | `GET /api/reports/dashboard` | Matches the admin dashboard in your diagram (total/active/inactive employees, on-leave today, pending leave, avg. performance) |

## 6. Frontend (React + Vite)

A full React frontend lives in `frontend/`, wired to every endpoint above.

**Design**: styled as a "personnel ledger" — navy for structure, manila-folder tan for record
cards, a rubber-stamp red/green/amber accent for status badges (`StatusStamp`), serif headings
(Source Serif 4) paired with IBM Plex Sans/Mono for data. Tokens live in
`frontend/src/styles/tokens.css`.

**Structure**:
```
frontend/src/
├── services/        One file per backend module (axios calls), api.js (JWT interceptor)
├── context/          AuthContext — holds the logged-in User + linked Employee profile
├── components/       Layout (sidebar/topbar), ProtectedRoute, Drawer, StatusStamp, StatCard…
├── pages/
│   ├── Auth/          Login, Register (register = create the first Admin account)
│   ├── Dashboard/     Role-aware: Admin/Manager summary vs. Employee check-in/leave view
│   ├── Employee/      List + search + create/edit drawer (Admin/Manager)
│   ├── Department/    Departments & Positions CRUD (Admin)
│   ├── Attendance/    Staff: pick a date and see everyone; Employee: check-in/out + history
│   ├── Leave/         Apply (Employee) / Approve-Reject (Admin/Manager)
│   ├── Payroll/       Create records (Admin) / view payslips (Employee)
│   ├── Performance/   Record evaluations (Admin/Manager) / view own history (Employee)
│   └── Profile/       "My Profile" — account + employment details
└── App.jsx            Routes, role-gated with <ProtectedRoute roles={[...]}>
```

**Run it**:
```bash
cd frontend
npm install
cp .env.example .env   # points to http://localhost:8080/api by default
npm run dev
```
Opens on `http://localhost:5173`. Make sure the backend is running first.

Build was verified with `npm run build` (Vite) — compiles cleanly.

**First login**: go to `/register`, create an `ADMIN` account, then use the Employees page to
create Manager/Employee accounts (each creation also makes their login).

## 7. What's next

- **Seed data**: register one ADMIN first, then create Departments → Positions → Employees from
  the UI.
- **Notifications UI**: the backend `NotificationService` and API are ready
  (`GET /api/notifications/user/{userId}`), but no frontend page consumes it yet — a bell icon
  in the topbar would be a natural next addition.
- Consider triggering `NotificationService.create(...)` from `LeaveService`/`PayrollService` on
  approval/rejection/payment events so the notification feed has real content.

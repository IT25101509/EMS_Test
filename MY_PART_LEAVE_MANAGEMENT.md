# My Part — Leave Management Module

**Group ID:** 2026-Y2-S1-MLB-B10G1-05 · **Module:** SE2030 Software Engineering
**Assigned function (per proposal):** Leave Management — *submit, approve/reject, and track
employee leave requests and balances*

> This zip contains the **complete, working backend project** because the Leave module depends
> on Employee accounts and login (a leave request belongs to an employee, and every endpoint
> requires authentication). The files listed below are the ones I built for my part. Everything
> else in the project (Employee, Department, Attendance, Payroll, Performance, Auth) is
> supporting infrastructure needed to run and demo this module end-to-end.

## Files I own

All under `backend/src/main/java/com/__Y2_S1_MLB_B10G1_05/demo/leave/`:

| File | What it does |
|---|---|
| `LeaveRequest.java` | JPA entity — the `leave_requests` table. Fields: employee, leave type, start/end date, reason, status, approver comment. |
| `LeaveType.java` | Enum of leave categories: `ANNUAL`, `SICK`, `CASUAL`, `MATERNITY`, `PATERNITY`, `UNPAID`, `OTHER`. |
| `LeaveStatus.java` | Enum of request states: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`. |
| `LeaveRequestRepository.java` | Spring Data JPA repository — lookups by employee and by status. |
| `dto/LeaveApplicationRequest.java` | Request body an employee sends when applying for leave. |
| `dto/LeaveActionRequest.java` | Request body used when a manager/admin approves or rejects (optional comment). |
| `dto/LeaveResponse.java` | Response shape returned to the frontend — includes a computed `numberOfDays`. |
| `LeaveService.java` | Business logic: validation (end date can't be before start date), state transitions (only `PENDING` requests can be approved/rejected/cancelled), and the apply/approve/reject/cancel flows. |
| `LeaveController.java` | REST endpoints (below), with role checks. |

## API endpoints

| Method | Endpoint | Who can call it | Purpose |
|---|---|---|---|
| `POST` | `/api/leaves` | Any logged-in employee | Apply for leave |
| `GET` | `/api/leaves/employee/{employeeId}` | Any logged-in user | View one employee's leave history |
| `GET` | `/api/leaves/pending` | Admin, Manager | See what needs a decision |
| `GET` | `/api/leaves` | Admin, Manager | See every leave request in the system |
| `PUT` | `/api/leaves/{id}/approve` | Admin, Manager | Approve a pending request |
| `PUT` | `/api/leaves/{id}/reject` | Admin, Manager | Reject a pending request (with a comment) |
| `PUT` | `/api/leaves/{id}/cancel` | Any logged-in user | Withdraw your own pending request |

Role checks are enforced with `@PreAuthorize` on the controller, and business rules (e.g. "only
a `PENDING` request can be modified") live in `LeaveService.assertPending()`.

## Frontend counterpart

`frontend/src/pages/Leave/LeavePage.jsx` and `frontend/src/services/leaveService.js` — the UI
for applying (employee view) and approving/rejecting (Admin/Manager view). Included so the
module can be demoed visually, not just via API calls.

## How to run and demo just this part

1. Follow the root `README.md` to start MySQL, the backend (`mvn spring-boot:run` in
   `backend/`), and the frontend (`npm install && npm run dev` in `frontend/`).
2. Register an Admin account, then create at least one Employee via the Employees page (this
   also creates their login).
3. Log in as that Employee → go to **Leave** → apply for leave.
4. Log back in as Admin → go to **Leave** → approve or reject it.
5. Or test directly via Postman/curl against the endpoints listed above, using the JWT from
   `POST /api/auth/login`.

## Known gap (flagged, not yet built)

The proposal's functional requirements also list **"track remaining leave balance"** — e.g. an
employee has 14 annual leave days per year and the system shows how many are left. That part
is **not implemented yet**. Currently the system stores and processes individual leave requests
but does not compute or cap against an annual entitlement. This would be a natural next
addition (a `LeaveBalance` entity per employee/year, decremented on approval) if the group wants
full proposal coverage.

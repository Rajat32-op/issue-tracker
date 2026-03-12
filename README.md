# Issue Tracker — Multi-Tenant SaaS Application

A full-stack issue tracking application with multi-tenant architecture, role-based access control, and a modern glassmorphism UI.

---

## hosted link
https://merry-cassata-439a0d.netlify.app/

## Architecture

### Multi-Tenant Model

The application follows a **shared-database, tenant-isolated** architecture. Each company (tenant) has its own isolated data — users, issues, and settings — scoped by a `tenantId` foreign key on every record.

### User Roles & Access Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      REGISTRATION FLOW                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Register Company ──► Creates Tenant + Admin user (APPROVED) │
│                       Returns unique company code            │
│                                                              │
│  Join Company ──────► User provides company code + email     │
│                       Account created with status: PENDING   │
│                       Waits for admin approval               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                        LOGIN FLOW                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PENDING user  ──────► Blocked — "Waiting for approval"      │
│  REJECTED user ──────► Blocked — "Request was rejected"      │
│  APPROVED user ──────► Logged in, JWT cookie set             │
│    ├─ ADMIN ─────────► Access to Admin Dashboard + Issues    │
│    └─ MEMBER ────────► Access to Issue Dashboard only        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── prisma.js              # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.js            # Register, join-request, login, me, logout
│   │   ├── admin.js           # Pending users, approve, reject, team list
│   │   └── issue.js           # CRUD operations for issues
│   ├── middlewears/
│   │   ├── auth.js            # JWT cookie verification
│   │   └── admin.js           # Admin role check
│   └── routes/
│       ├── auth.js            # /auth/* routes
│       ├── admin.js           # /admin/* routes (auth + admin protected)
│       └── issue.js           # /issues/* routes (auth protected)
└── prisma/
    └── schema.prisma          # Database schema
```

### Frontend Architecture

```
frontend/src/
├── api/
│   └── axios.ts               # Axios instance (baseURL + credentials)
├── context/
│   └── AuthContext.tsx         # Global auth state (user, role, tenant)
├── pages/
│   ├── Login.tsx              # Email + password login
│   ├── Register.tsx           # Tabbed — Register Company / Join Company
│   ├── Dashboard.tsx          # Issue dashboard (all users)
│   └── AdminDashboard.tsx     # Approve/reject requests, team view (admin only)
├── components/
│   ├── CreateIssue.tsx        # Collapsible issue creation form
│   └── IssueList.tsx          # Issue cards grid with status management
├── routes/
│   └── ProtectedRoute.tsx     # Auth guard with optional admin check
└── App.tsx                    # Router setup
```

### Database Schema

| Model    | Purpose                                                    |
|----------|------------------------------------------------------------|
| `Tenant` | Company — has `name`, unique `companyCode`, owns users/issues |
| `User`   | Belongs to a tenant — has `role` (ADMIN/MEMBER) and `status` (PENDING/APPROVED/REJECTED) |
| `Issue`  | Belongs to a tenant — has `title`, `description`, `status` (OPEN/IN_PROGRESS/DONE), linked to creator |

### API Endpoints

| Method | Endpoint             | Auth   | Description                        |
|--------|----------------------|--------|------------------------------------|
| POST   | `/auth/register`     | No     | Register company (creates admin)   |
| POST   | `/auth/join-request` | No     | Request to join a company via code |
| POST   | `/auth/login`        | No     | Login (returns JWT cookie)         |
| GET    | `/auth/me`           | Yes    | Get current user profile           |
| POST   | `/auth/logout`       | No     | Clear auth cookie                  |
| GET    | `/admin/pending`     | Admin  | List pending join requests         |
| PATCH  | `/admin/approve/:id` | Admin  | Approve a user                     |
| PATCH  | `/admin/reject/:id`  | Admin  | Reject a user                      |
| GET    | `/admin/team`        | Admin  | List approved team members         |
| GET    | `/issues`            | Yes    | Get all issues (tenant-scoped)     |
| POST   | `/issues`            | Yes    | Create an issue                    |
| PATCH  | `/issues/:id`        | Yes    | Update an issue                    |
| DELETE | `/issues/:id`        | Yes    | Delete an issue                    |

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma 6
- **Auth:** JWT (httpOnly cookies) + bcrypt for password hashing
- **Others:** cookie-parser, cors, dotenv

### Frontend
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router 7

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** running locally
- **npm**

### 1. Clone the repository

```bash
git clone <repo-url>
cd issue-tracker
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/issuetracker"
JWT_SECRET="your-secret-key"
```

Run database migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

The backend runs on **http://localhost:5000**.

### 3. Setup the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

### 4. Using the application

1. **Register a company** — go to `/register`, fill in company name, email & password. You'll receive a **company code**.
2. **Share the code** — give the company code to your team members.
3. **Team members join** — they go to `/register` → "Join Company" tab, enter the code, their email & a password.
4. **Admin approves** — log in as admin, go to the Admin Dashboard, approve pending requests.
5. **Members log in** — once approved, members can log in and start creating/managing issues.

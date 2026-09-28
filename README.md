# Student TPO Placement Portal

A modern, production-quality **Student Training & Placement Management Portal** built for college Training & Placement Officers (TPO) and trainers to monitor student coding readiness, maintain batch directories, and coordinate campus placement drives.

Directly connected to **MySQL Cloud** (`student_tpo`) with native batch tables.

---

## 🌟 Key Features

- **Direct Cloud MySQL Integration**: Connects straight to your MySQL cloud instance (`student_tpo`) reading directly from:
  - `aiml_ab` (AI & ML Sections A & B)
  - `aiml_jk` (AI & ML Sections J & K)
  - `ece_ef` (ECE Sections E & F)
  - `ds_ab` (Data Science Sections A & B)
- **Zero CSV Dependencies**: All data queries, filters, search, statistics, and CRUD operations execute directly on live database tables.
- **Academic Tech SaaS Design**: Clean, minimal, professional interface with smooth micro-animations (Framer Motion) and Lucide React icons.
- **Live Statistics & Metrics**: Real-time calculation of total students (436 live students), LeetCode coverage, missing profiles, and placement pool.
- **Search & Multi-Filter**: Instant debounced search across student names, emails, and roll numbers with cascading filters by batch/table, department, section, academic year, and LeetCode status.
- **Sorting & Pagination**: Full ascending/descending column sorting with customizable page sizing (10, 20, 25, 50, 100 per page).
- **Student Profile View**: Beautiful profile modal with generated initials avatars, normalized external LeetCode profiles (`View Profile ↗`), academic details, and verified coding metrics.
- **CRUD Operations**: Add, edit, and delete student records directly within the corresponding batch table in MySQL.
- **Comprehensive Reporting & Export**:
  - **CSV Export**: `student_tpo_data.csv` (Export all or filtered results)
  - **Excel Export**: `student_tpo_data.xlsx` (Native spreadsheet with automatic column widths)
  - **Print / PDF Report**: Clean printable document layout with official TPO headers (hides sidebars and UI controls)
- **Analytics Visualizations**: Interactive Recharts for department distribution, placement status breakdown, and profile completeness progress bars.
- **Dark Mode**: Persistent dark and light mode themes saved in browser storage.
- **Docker Ready**: Complete `Dockerfile` for backend, `Dockerfile` with Nginx for frontend, and `docker-compose.yml`.

---

## 🔐 Credentials

- **Role**: Training & Placement Officer (Admin)
- **Username / Email**: `admin@gmail.com`
- **Password**: `12345678`

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6, Axios, Lucide React, Recharts, Framer Motion, XLSX |
| **Backend** | Java 17, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Spring Validation, Lombok |
| **Database** | MySQL Cloud (Aiven) / Local MySQL (`student_tpo`) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## ⚙️ Environment Configuration (`.env`)

Configure your MySQL connection in `.env`:

```env
# MySQL Database Connection (Aiven Cloud / Local MySQL)
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_MYSQL_HOST:YOUR_MYSQL_PORT/student_tpo?ssl-mode=REQUIRED
SPRING_DATASOURCE_USERNAME=YOUR_USERNAME
SPRING_DATASOURCE_PASSWORD=YOUR_PASSWORD

# Backend Port
PORT=8080

# Frontend Port
FRONTEND_PORT=5173
VITE_API_BASE_URL=/api
```

---

## 🚀 Running Locally

### 1. Backend (Spring Boot)

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
Backend runs at: **`http://localhost:8080`**

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **`http://localhost:5173`**

---

## 🐳 Running with Docker & Docker Compose

To build and start both the backend and frontend containers with a single command:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080`

To stop:
```bash
docker-compose down
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin credentials |
| `GET` | `/api/students` | Get paginated, sorted, and filtered students |
| `GET` | `/api/students/all` | Fetch all students matching current filters (for export) |
| `GET` | `/api/students/{id}` | Get student profile by ID |
| `POST` | `/api/students` | Add a new student record to target batch table |
| `PUT` | `/api/students/{id}` | Update existing student record |
| `DELETE` | `/api/students/{id}` | Delete student record |
| `GET` | `/api/students/statistics` | Dynamic metrics for dashboard and charts |
| `GET` | `/api/students/recent` | Top 5 latest registered students |
| `GET` | `/api/students/filters` | Distinct filter values (years, departments, batches) |
| `GET` | `/api/students/search` | Fast keyword search by name, email, or roll number |

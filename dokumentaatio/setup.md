# ZeroPromile - Development Setup Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- npm
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ZeroPromile
```

### 2. Setup Frontend Environment

Create a `.env` file in the `frontend` folder:

```bash
cd frontend
echo "EXPO_PUBLIC_NODE_ENV=development" > .env
cd ..
```

### 3. Start Backend + Database

From the **project root** (`ZeroPromile/`), run:

```bash
docker compose up --build
```

Wait 10 seconds for services to start. You should see:

- Database migrations applied
- Backend server running on port 3001
- Server running on port: 3001
- DB connected via Prisma!

### 4. Start Frontend

Open a **new terminal** window:

```bash
cd frontend
npm install
npm run start:dev
```

Press `i` for iOS simulator or `a` for Android emulator or use the QR code with Expo Go

---

## Working with the Database

### Accessing the Database

Connect to the PostgreSQL database:

```bash
docker exec -it zeropromile-db psql -U zeropromile -d zeropromile
```

### Querying Tables

**Important:** Table names are case-sensitive and must be quoted!

```sql
-- List all tables
\dt

-- Query tables (note the quotes and capital letters!)
SELECT * FROM "User";
SELECT * FROM "Session";
SELECT * FROM "SessionDrink";

-- Exit
\q
```

---

## Managing Docker Containers

### Stop Containers

**Option 1: Keep data**

Press `Ctrl + C` in the terminal where docker-compose is running, then:

```bash
docker compose down
```

Data persists in Docker volumes - when you restart, your data will still be there.

**Option 2: Remove everything including data**

```bash
docker compose down -v
```

This removes containers AND volumes (deletes all database data).

### Rebuild After Code Changes

```bash
docker compose up --build
```

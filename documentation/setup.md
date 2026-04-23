# ZeroPromile - Development Setup Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 24+
- npm
- Git

## 1. Clone the Repository

```bash
git clone <repository-url>
cd ZeroPromile
```

## Option 1: Run locally without Docker

### 1. Install dependancies

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 2. Setup backend environment

```bash
cd backend
cp env.template .env
cd ..
```

Example `.env`:

```bash
NODE_ENV=development
APP_ENV=development
DATABASE_URL=postgresql://zeropromile:devpassword@localhost:5432/zeropromile
JWT_TOKEN_SECRET_STAGING=local_dev_staging_secret
JWT_REFRESH_TOKEN_SECRET_STAGING=local_dev_staging_refresh_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Setup frontend environment

```bash
cd frontend
cp env.template .env
cd ..
```

### 4. Setup Local PostgreSQL

Make sure PostgreSQL is running with:

- Database: `zeropromile`
- User: `zeropromile`
- Password: `devpassword`
- Port: `5432`

### 5. Run Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### 6. Start Backend

```bash
cd backend
npm run dev
```

### 7. Start Frontend

In a new terminal:

```bash
cd frontend
npm run start:dev
```

Press:

- `ì` &rarr; iOS
- `a` &rarr; Android
- or scan QR with Expo Go

## Option 2: Run locally with Docker

Use this if you want docker to manage backend + database

### 1. Setup frontend environment

```bash
cd frontend
cp env.template .env
cd ..
```

### 2. Start backend + database

```bash
docker compose up --build
```

Wait ~10s and you should see:

- Database migrations applied
- Backend server running on port 3001
- DB connected via Prisma

### 3. Start frontend

In a new terminal:

```bash
cd frontend
npm run start:dev
```

### Notes!

**Without** Docker

Use `localhost`:

```bash
DATABASE_URL=postgresql://zeropromile:devpassword@localhost:5432/zeropromile
```

**With** Docker

Use service name `db`:

```bash
DATABASE_URL=postgresql://zeropromile:devpassword@db:5432/zeropromile
```

### Working with the database (Docker)

```bash
docker exec -it zeropromile-db psql -U zeropromile -d zeropromile
```

Useful Queries:

```bash
\dt

SELECT * FROM "User";
SELECT * FROM "Session";
SELECT * FROM "SessionDrink";

\q
```

### Managing Docker containers

Stop (keep data):

```bash
docker compose down
```

Stop (remove all data):

```bash
docker compose down -v
```

Rebuild:

```bash
docker compose up --build
```

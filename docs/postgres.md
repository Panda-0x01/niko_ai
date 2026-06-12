# PostgreSQL Setup Guide

## Local Setup

### Install PostgreSQL 16

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql-16
sudo systemctl start postgresql
```

**Windows:** Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)

---

## Create Database

```bash
psql -U postgres
CREATE DATABASE nikoai;
\q
```

---

## Run Schema

```bash
psql -U postgres -d nikoai -f database/schema.sql
```

---

## Run Migrations (Alembic)

```bash
cd backend
alembic upgrade head
```

---

## Seed Disease Data

```bash
cd backend
python -m app.db.seed
```

---

## Verify

```bash
psql -U postgres -d nikoai
\dt                          -- list tables
SELECT count(*) FROM diseases;  -- should show 38
```

---

## Connection String

```
postgresql://postgres:password@localhost:5432/nikoai
```

Update in `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/nikoai
```

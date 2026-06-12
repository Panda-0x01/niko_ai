-- Niko AI — PostgreSQL initialization
-- This file runs automatically when the container first starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database if it doesn't exist (handled by docker env vars)
-- Tables are created by Alembic migrations or SQLAlchemy create_all

\echo 'Niko AI database initialized.'

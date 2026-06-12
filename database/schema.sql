-- ============================================================
-- Niko AI — Complete PostgreSQL Schema
-- ============================================================

-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    UNIQUE NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    profile_image   TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

-- ============================================================
-- DISEASES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS diseases (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name       VARCHAR(255)    NOT NULL,
    disease_name    VARCHAR(255)    NOT NULL,
    description     TEXT            NOT NULL,
    symptoms        TEXT[]          NOT NULL DEFAULT '{}',
    treatment       TEXT[]          NOT NULL DEFAULT '{}',
    prevention      TEXT[]          NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_diseases_crop_name ON diseases(crop_name);
CREATE INDEX IF NOT EXISTS ix_diseases_disease_name ON diseases(disease_name);
CREATE UNIQUE INDEX IF NOT EXISTS ux_diseases_crop_disease ON diseases(LOWER(crop_name), LOWER(disease_name));

-- ============================================================
-- PREDICTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name       VARCHAR(255)    NOT NULL,
    disease_name    VARCHAR(255)    NOT NULL,
    confidence      FLOAT           NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    image_url       TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS ix_predictions_created_at ON predictions(created_at DESC);

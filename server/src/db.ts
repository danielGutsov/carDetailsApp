import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data.sqlite3");

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    civil_liability_from TEXT,
    civil_liability_to TEXT,
    comprehensive_insurance_from TEXT,
    comprehensive_insurance_to TEXT,
    inspection_from TEXT,
    inspection_to TEXT,
    vignette_from TEXT,
    vignette_to TEXT,
    fire_extinguisher_from TEXT,
    fire_extinguisher_to TEXT,
    oil_change_km INTEGER,
    tyres_summer INTEGER NOT NULL DEFAULT 0,
    tyres_winter INTEGER NOT NULL DEFAULT 0,
    tyres_allseason INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
`);

// Migrate older databases created before the civil-liability rename / new columns existed.
const existingColumns = new Set(
  (db.prepare("PRAGMA table_info(vehicles)").all() as { name: string }[]).map((c) => c.name)
);

if (existingColumns.has("insurance_from") && !existingColumns.has("civil_liability_from")) {
  db.exec(`
    ALTER TABLE vehicles RENAME COLUMN insurance_from TO civil_liability_from;
    ALTER TABLE vehicles RENAME COLUMN insurance_to TO civil_liability_to;
  `);
}

if (!existingColumns.has("comprehensive_insurance_from")) {
  db.exec(`
    ALTER TABLE vehicles ADD COLUMN comprehensive_insurance_from TEXT;
    ALTER TABLE vehicles ADD COLUMN comprehensive_insurance_to TEXT;
  `);
}

if (!existingColumns.has("vignette_from")) {
  db.exec(`
    ALTER TABLE vehicles ADD COLUMN vignette_from TEXT;
    ALTER TABLE vehicles ADD COLUMN vignette_to TEXT;
  `);
}

if (!existingColumns.has("oil_change_km")) {
  db.exec(`ALTER TABLE vehicles ADD COLUMN oil_change_km INTEGER;`);
}

const existingUserColumns = new Set(
  (db.prepare("PRAGMA table_info(users)").all() as { name: string }[]).map((c) => c.name)
);

if (!existingUserColumns.has("is_admin")) {
  db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;`);
}

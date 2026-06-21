-- Script to convert SQLite database to WAL mode for Turso import
-- Run: sqlite3 database/database.db < scripts/convert-to-wal.sql

-- Enable WAL mode
PRAGMA journal_mode=WAL;

-- Verify WAL mode
PRAGMA journal_mode;

-- Optimize database
VACUUM;

-- Show database info
.databases

-- Drop existing table
DROP TABLE IF EXISTS sleep_records;

-- Create new table with updated schema
CREATE TABLE sleep_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  sleep_hours REAL NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
); 
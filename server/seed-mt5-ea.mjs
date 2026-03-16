#!/usr/bin/env node
/**
 * Seed script to add MT5 Uploader EA to the database
 * Run: node server/seed-mt5-ea.mjs
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data", "foldforge.db");

const sqlite = new Database(dbPath);

// Create files table if it doesn't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'other',
    version TEXT NOT NULL,
    changelog TEXT,
    fileKey TEXT NOT NULL,
    fileUrl TEXT,
    fileSize INTEGER,
    minPlan TEXT NOT NULL DEFAULT 'starter',
    isPublic INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Insert the MT5 Uploader EA
const stmt = sqlite.prepare(`
  INSERT OR REPLACE INTO files (name, description, category, version, changelog, fileKey, fileUrl, fileSize, minPlan, isPublic, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

stmt.run(
  "FoldForge MT5 Uploader EA",
  "Official MT5 Expert Advisor for syncing your broker's exact symbol specs, spreads, and OHLC history to FoldForge. Install on your MT5 platform and configure with your license key.",
  "ea",
  "1.0.0",
  "Initial release: Full broker data sync support for MT5",
  "foldforge-mt5-uploader-ea-v1.0.0",
  "https://foldforge.app/downloads/FoldForge_MT5_Uploader_EA_v1.0.mq5",
  45678, // approximate file size
  "starter",
  0 // not public by default, only for subscribers
);

console.log("✓ MT5 Uploader EA added to database");

// Also add MT4 version placeholder
stmt.run(
  "FoldForge MT4 Uploader EA",
  "Official MT4 Expert Advisor for syncing your broker's exact symbol specs, spreads, and OHLC history to FoldForge. Install on your MT4 platform and configure with your license key.",
  "ea",
  "1.0.0",
  "Initial release: Full broker data sync support for MT4",
  "foldforge-mt4-uploader-ea-v1.0.0",
  "https://foldforge.app/downloads/FoldForge_MT4_Uploader_EA_v1.0.ex4",
  43210, // approximate file size
  "starter",
  0 // not public by default, only for subscribers
);

console.log("✓ MT4 Uploader EA added to database");

sqlite.close();
console.log("Database seeding complete!");

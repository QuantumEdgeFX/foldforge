import { eq, and, desc, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import {
  InsertUser, users, subscriptions, licenses, activations,
  files, downloadLogs, tickets, brokerSymbols, brokerOhlc,
  brokerSpreads, symbolReference, studioRuns, featureFlags,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

function initSQLite() {
  const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "foldforge.db");
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite);
  // Create all tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      openId TEXT NOT NULL UNIQUE,
      name TEXT,
      email TEXT,
      passwordHash TEXT,
      loginMethod TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      stripeCustomerId TEXT,
      suspended INTEGER NOT NULL DEFAULT 0,
      dataSourcePreference TEXT NOT NULL DEFAULT 'reference',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      lastSignedIn TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      stripeSubscriptionId TEXT NOT NULL UNIQUE,
      stripeCustomerId TEXT NOT NULL,
      stripePriceId TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      currentPeriodStart TEXT,
      currentPeriodEnd TEXT,
      cancelAtPeriodEnd INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      subscriptionId INTEGER,
      licenseKey TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL,
      maxActivations INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      gracePeriodEnd TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS activations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      licenseId INTEGER NOT NULL,
      accountNumber TEXT NOT NULL,
      brokerServer TEXT NOT NULL,
      platform TEXT NOT NULL,
      lastHeartbeat TEXT,
      activatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
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
    CREATE TABLE IF NOT EXISTS download_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      fileId INTEGER NOT NULL,
      downloadedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      adminReply TEXT,
      repliedAt TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS broker_symbols (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      broker TEXT NOT NULL,
      description TEXT,
      digits INTEGER,
      contractSize REAL,
      minLot REAL,
      maxLot REAL,
      lotStep REAL,
      tickSize REAL,
      tickValue REAL,
      swapLong REAL,
      swapShort REAL,
      marginRequired REAL,
      spreadTypical REAL,
      tradeMode TEXT,
      lastSyncAt TEXT NOT NULL DEFAULT (datetime('now')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS broker_ohlc (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      broker TEXT NOT NULL,
      timeframe TEXT NOT NULL,
      openTime INTEGER NOT NULL,
      open REAL NOT NULL,
      high REAL NOT NULL,
      low REAL NOT NULL,
      close REAL NOT NULL,
      volume REAL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS broker_spreads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      broker TEXT NOT NULL,
      spreadPoints REAL NOT NULL,
      sampledAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS symbol_reference (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      displayName TEXT NOT NULL,
      category TEXT NOT NULL,
      baseCurrency TEXT,
      quoteCurrency TEXT,
      digits INTEGER NOT NULL DEFAULT 5,
      contractSize REAL NOT NULL DEFAULT 100000,
      minLot REAL NOT NULL DEFAULT 0.01,
      maxLot REAL NOT NULL DEFAULT 100,
      lotStep REAL NOT NULL DEFAULT 0.01,
      tickSize REAL,
      tickValue REAL,
      typicalSpread REAL,
      marginPercent REAL,
      swapLong REAL,
      swapShort REAL,
      tradingHours TEXT,
      description TEXT,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS studio_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      runType TEXT NOT NULL DEFAULT 'backtest',
      status TEXT NOT NULL DEFAULT 'queued',
      symbol TEXT NOT NULL,
      timeframe TEXT NOT NULL,
      dataSource TEXT NOT NULL DEFAULT 'reference',
      parameters TEXT,
      results TEXT,
      metrics TEXT,
      startedAt TEXT,
      completedAt TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS feature_flags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flagKey TEXT NOT NULL UNIQUE,
      flagValue INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed reference data if empty
  const refCount = sqlite.prepare("SELECT COUNT(*) as c FROM symbol_reference").get() as { c: number };
  if (refCount.c === 0) {
    seedReferenceData(sqlite);
  }

  console.log(`[Database] SQLite initialized at: ${dbPath}`);
  return db;
}

function seedReferenceData(sqlite: Database.Database) {
  const symbols = [
    // Forex Majors
    { symbol: "EURUSD", displayName: "Euro / US Dollar", category: "forex", baseCurrency: "EUR", quoteCurrency: "USD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.2 },
    { symbol: "GBPUSD", displayName: "British Pound / US Dollar", category: "forex", baseCurrency: "GBP", quoteCurrency: "USD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.5 },
    { symbol: "USDJPY", displayName: "US Dollar / Japanese Yen", category: "forex", baseCurrency: "USD", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.3 },
    { symbol: "USDCHF", displayName: "US Dollar / Swiss Franc", category: "forex", baseCurrency: "USD", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.6 },
    { symbol: "AUDUSD", displayName: "Australian Dollar / US Dollar", category: "forex", baseCurrency: "AUD", quoteCurrency: "USD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.4 },
    { symbol: "USDCAD", displayName: "US Dollar / Canadian Dollar", category: "forex", baseCurrency: "USD", quoteCurrency: "CAD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.8 },
    { symbol: "NZDUSD", displayName: "New Zealand Dollar / US Dollar", category: "forex", baseCurrency: "NZD", quoteCurrency: "USD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.8 },
    { symbol: "EURGBP", displayName: "Euro / British Pound", category: "forex", baseCurrency: "EUR", quoteCurrency: "GBP", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.5 },
    { symbol: "EURJPY", displayName: "Euro / Japanese Yen", category: "forex", baseCurrency: "EUR", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 1.8 },
    { symbol: "GBPJPY", displayName: "British Pound / Japanese Yen", category: "forex", baseCurrency: "GBP", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "EURCHF", displayName: "Euro / Swiss Franc", category: "forex", baseCurrency: "EUR", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.0 },
    { symbol: "EURAUD", displayName: "Euro / Australian Dollar", category: "forex", baseCurrency: "EUR", quoteCurrency: "AUD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.2 },
    { symbol: "EURCAD", displayName: "Euro / Canadian Dollar", category: "forex", baseCurrency: "EUR", quoteCurrency: "CAD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "EURNZD", displayName: "Euro / New Zealand Dollar", category: "forex", baseCurrency: "EUR", quoteCurrency: "NZD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "GBPCHF", displayName: "British Pound / Swiss Franc", category: "forex", baseCurrency: "GBP", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.8 },
    { symbol: "GBPAUD", displayName: "British Pound / Australian Dollar", category: "forex", baseCurrency: "GBP", quoteCurrency: "AUD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "GBPCAD", displayName: "British Pound / Canadian Dollar", category: "forex", baseCurrency: "GBP", quoteCurrency: "CAD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.2 },
    { symbol: "GBPNZD", displayName: "British Pound / New Zealand Dollar", category: "forex", baseCurrency: "GBP", quoteCurrency: "NZD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 4.0 },
    { symbol: "AUDCAD", displayName: "Australian Dollar / Canadian Dollar", category: "forex", baseCurrency: "AUD", quoteCurrency: "CAD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "AUDCHF", displayName: "Australian Dollar / Swiss Franc", category: "forex", baseCurrency: "AUD", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.8 },
    { symbol: "AUDJPY", displayName: "Australian Dollar / Japanese Yen", category: "forex", baseCurrency: "AUD", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.0 },
    { symbol: "AUDNZD", displayName: "Australian Dollar / New Zealand Dollar", category: "forex", baseCurrency: "AUD", quoteCurrency: "NZD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "CADJPY", displayName: "Canadian Dollar / Japanese Yen", category: "forex", baseCurrency: "CAD", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "CADCHF", displayName: "Canadian Dollar / Swiss Franc", category: "forex", baseCurrency: "CAD", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "CHFJPY", displayName: "Swiss Franc / Japanese Yen", category: "forex", baseCurrency: "CHF", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.5 },
    { symbol: "NZDJPY", displayName: "New Zealand Dollar / Japanese Yen", category: "forex", baseCurrency: "NZD", quoteCurrency: "JPY", digits: 3, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 2.8 },
    { symbol: "NZDCAD", displayName: "New Zealand Dollar / Canadian Dollar", category: "forex", baseCurrency: "NZD", quoteCurrency: "CAD", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "NZDCHF", displayName: "New Zealand Dollar / Swiss Franc", category: "forex", baseCurrency: "NZD", quoteCurrency: "CHF", digits: 5, contractSize: 100000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.5 },
    // Metals
    { symbol: "XAUUSD", displayName: "Gold / US Dollar", category: "metals", baseCurrency: "XAU", quoteCurrency: "USD", digits: 2, contractSize: 100, minLot: 0.01, maxLot: 50, lotStep: 0.01, typicalSpread: 25.0 },
    { symbol: "XAGUSD", displayName: "Silver / US Dollar", category: "metals", baseCurrency: "XAG", quoteCurrency: "USD", digits: 3, contractSize: 5000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "XPTUSD", displayName: "Platinum / US Dollar", category: "metals", baseCurrency: "XPT", quoteCurrency: "USD", digits: 2, contractSize: 50, minLot: 0.01, maxLot: 50, lotStep: 0.01, typicalSpread: 40.0 },
    { symbol: "XPDUSD", displayName: "Palladium / US Dollar", category: "metals", baseCurrency: "XPD", quoteCurrency: "USD", digits: 2, contractSize: 100, minLot: 0.01, maxLot: 20, lotStep: 0.01, typicalSpread: 50.0 },
    // Indices
    { symbol: "US30", displayName: "Dow Jones Industrial Average", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 2.0 },
    { symbol: "US500", displayName: "S&P 500 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 0.5 },
    { symbol: "NAS100", displayName: "NASDAQ 100 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 1.0 },
    { symbol: "UK100", displayName: "FTSE 100 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 1.0 },
    { symbol: "GER40", displayName: "DAX 40 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 1.5 },
    { symbol: "FRA40", displayName: "CAC 40 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 1.5 },
    { symbol: "JPN225", displayName: "Nikkei 225 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 10.0 },
    { symbol: "AUS200", displayName: "ASX 200 Index", category: "indices", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 2.0 },
    // Crypto
    { symbol: "BTCUSD", displayName: "Bitcoin / US Dollar", category: "crypto", baseCurrency: "BTC", quoteCurrency: "USD", digits: 2, contractSize: 1, minLot: 0.01, maxLot: 10, lotStep: 0.01, typicalSpread: 50.0 },
    { symbol: "ETHUSD", displayName: "Ethereum / US Dollar", category: "crypto", baseCurrency: "ETH", quoteCurrency: "USD", digits: 2, contractSize: 1, minLot: 0.01, maxLot: 50, lotStep: 0.01, typicalSpread: 5.0 },
    { symbol: "LTCUSD", displayName: "Litecoin / US Dollar", category: "crypto", baseCurrency: "LTC", quoteCurrency: "USD", digits: 2, contractSize: 1, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 1.0 },
    { symbol: "XRPUSD", displayName: "Ripple / US Dollar", category: "crypto", baseCurrency: "XRP", quoteCurrency: "USD", digits: 5, contractSize: 10000, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 0.005 },
    // Commodities
    { symbol: "USOIL", displayName: "US Crude Oil (WTI)", category: "commodities", digits: 3, contractSize: 1000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "UKOIL", displayName: "UK Brent Crude Oil", category: "commodities", digits: 3, contractSize: 1000, minLot: 0.01, maxLot: 100, lotStep: 0.01, typicalSpread: 3.0 },
    { symbol: "NATGAS", displayName: "Natural Gas", category: "commodities", digits: 3, contractSize: 10000, minLot: 0.1, maxLot: 100, lotStep: 0.1, typicalSpread: 0.01 },
    { symbol: "CORN", displayName: "Corn Futures", category: "commodities", digits: 2, contractSize: 5000, minLot: 0.1, maxLot: 50, lotStep: 0.1, typicalSpread: 2.0 },
    { symbol: "WHEAT", displayName: "Wheat Futures", category: "commodities", digits: 2, contractSize: 5000, minLot: 0.1, maxLot: 50, lotStep: 0.1, typicalSpread: 2.0 },
    { symbol: "SOYBEAN", displayName: "Soybean Futures", category: "commodities", digits: 2, contractSize: 5000, minLot: 0.1, maxLot: 50, lotStep: 0.1, typicalSpread: 3.0 },
  ];

  const stmt = sqlite.prepare(`
    INSERT OR IGNORE INTO symbol_reference
    (symbol, displayName, category, baseCurrency, quoteCurrency, digits, contractSize, minLot, maxLot, lotStep, typicalSpread, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const insertMany = sqlite.transaction((syms: typeof symbols) => {
    for (const s of syms) {
      stmt.run(s.symbol, s.displayName, s.category, s.baseCurrency ?? null, s.quoteCurrency ?? null,
        s.digits, s.contractSize, s.minLot, s.maxLot, s.lotStep, s.typicalSpread ?? null);
    }
  });
  insertMany(symbols);
  console.log(`[Database] Seeded ${symbols.length} reference symbols`);
}

export function getDb() {
  if (!_db) {
    _db = initSQLite();
  }
  return _db;
}

/* ── User helpers ──────────────────────────────────────────────── */
export async function upsertUser(user: InsertUser & { passwordHash?: string }): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = getDb();
  try {
    const existing = db.select().from(users).where(eq(users.openId, user.openId)).limit(1).all();
    const now = new Date().toISOString();
    if (existing.length > 0) {
      const updateData: any = { updatedAt: now };
      if (user.name !== undefined) updateData.name = user.name ?? null;
      if (user.email !== undefined) updateData.email = user.email ?? null;
      if (user.loginMethod !== undefined) updateData.loginMethod = user.loginMethod ?? null;
      if (user.lastSignedIn !== undefined) updateData.lastSignedIn = typeof user.lastSignedIn === 'string' ? user.lastSignedIn : now;
      if (user.role !== undefined) updateData.role = user.role;
      if ((user as any).passwordHash !== undefined) updateData.passwordHash = (user as any).passwordHash;
      db.update(users).set(updateData).where(eq(users.openId, user.openId)).run();
    } else {
      const insertData: any = {
        openId: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        loginMethod: user.loginMethod ?? null,
        role: user.role ?? (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        lastSignedIn: user.lastSignedIn ? (typeof user.lastSignedIn === 'string' ? user.lastSignedIn : now) : now,
        createdAt: now,
        updatedAt: now,
      };
      if ((user as any).passwordHash) insertData.passwordHash = (user as any).passwordHash;
      db.insert(users).values(insertData).run();
    }
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  const result = db.select().from(users).where(eq(users.openId, openId)).limit(1).all();
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = getDb();
  const result = db.select().from(users).where(eq(users.id, id)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const result = db.select().from(users).where(eq(users.email, email)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getAllUsers() {
  const db = getDb();
  return db.select().from(users).orderBy(desc(users.createdAt)).all();
}

export async function updateUserSuspended(userId: number, suspended: boolean) {
  const db = getDb();
  db.update(users).set({ suspended }).where(eq(users.id, userId)).run();
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = getDb();
  db.update(users).set({ role }).where(eq(users.id, userId)).run();
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = getDb();
  db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId)).run();
}

export async function updateUserDataSource(userId: number, pref: "reference" | "broker") {
  const db = getDb();
  db.update(users).set({ dataSourcePreference: pref }).where(eq(users.id, userId)).run();
}

/* ── Subscription helpers ──────────────────────────────────────── */
export async function createSubscription(data: {
  userId: number; stripeSubscriptionId: string; stripeCustomerId: string;
  stripePriceId: string; plan: "starter" | "pro" | "funded"; status?: string;
  currentPeriodStart?: Date; currentPeriodEnd?: Date;
}) {
  const db = getDb();
  db.insert(subscriptions).values({
    userId: data.userId, stripeSubscriptionId: data.stripeSubscriptionId,
    stripeCustomerId: data.stripeCustomerId, stripePriceId: data.stripePriceId,
    plan: data.plan, status: (data.status as any) ?? "active",
    currentPeriodStart: data.currentPeriodStart?.toISOString(),
    currentPeriodEnd: data.currentPeriodEnd?.toISOString(),
  }).run();
}

export async function getSubscriptionByStripeId(stripeSubId: string) {
  const db = getDb();
  const result = db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, stripeSubId)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getUserSubscription(userId: number) {
  const db = getDb();
  const result = db.select().from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .orderBy(desc(subscriptions.createdAt)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getAllSubscriptions() {
  const db = getDb();
  return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt)).all();
}

export async function updateSubscriptionStatus(stripeSubId: string, status: string, extra?: { currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean }) {
  const db = getDb();
  const set: any = { status };
  if (extra?.currentPeriodEnd) set.currentPeriodEnd = extra.currentPeriodEnd.toISOString();
  if (extra?.cancelAtPeriodEnd !== undefined) set.cancelAtPeriodEnd = extra.cancelAtPeriodEnd;
  db.update(subscriptions).set(set).where(eq(subscriptions.stripeSubscriptionId, stripeSubId)).run();
}

/* ── License helpers ───────────────────────────────────────────── */
function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `FF-${seg()}-${seg()}-${seg()}`;
}

export async function createLicense(data: { userId: number; subscriptionId?: number; plan: "starter" | "pro" | "funded" }) {
  const db = getDb();
  const maxAct = data.plan === "starter" ? 1 : data.plan === "pro" ? 5 : 25;
  const key = generateLicenseKey();
  db.insert(licenses).values({
    userId: data.userId, subscriptionId: data.subscriptionId ?? null,
    licenseKey: key, plan: data.plan, maxActivations: maxAct,
  }).run();
  return key;
}

export async function getLicenseByKey(key: string) {
  const db = getDb();
  const result = db.select().from(licenses).where(eq(licenses.licenseKey, key)).limit(1).all();
  return result[0] ?? undefined;
}

export async function getUserLicenses(userId: number) {
  const db = getDb();
  return db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.createdAt)).all();
}

export async function getAllLicenses() {
  const db = getDb();
  return db.select().from(licenses).orderBy(desc(licenses.createdAt)).all();
}

export async function updateLicenseStatus(licenseId: number, status: "active" | "suspended" | "expired" | "revoked") {
  const db = getDb();
  db.update(licenses).set({ status }).where(eq(licenses.id, licenseId)).run();
}

export async function suspendLicensesBySubscription(subId: number) {
  const db = getDb();
  const gracePeriodEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  db.update(licenses).set({ status: "suspended", gracePeriodEnd }).where(eq(licenses.subscriptionId, subId)).run();
}

/* ── Activation helpers ────────────────────────────────────────── */
export async function getActivationsByLicense(licenseId: number) {
  const db = getDb();
  return db.select().from(activations).where(eq(activations.licenseId, licenseId)).all();
}

export async function createActivation(data: { licenseId: number; accountNumber: string; brokerServer: string; platform: "MT4" | "MT5" }) {
  const db = getDb();
  db.insert(activations).values(data).run();
}

export async function deleteActivation(id: number) {
  const db = getDb();
  db.delete(activations).where(eq(activations.id, id)).run();
}

export async function updateHeartbeat(licenseId: number, accountNumber: string) {
  const db = getDb();
  db.update(activations).set({ lastHeartbeat: new Date().toISOString() })
    .where(and(eq(activations.licenseId, licenseId), eq(activations.accountNumber, accountNumber))).run();
}

/* ── Files helpers ─────────────────────────────────────────────── */
export async function getAllFiles() {
  const db = getDb();
  return db.select().from(files).orderBy(desc(files.createdAt)).all();
}

export async function getFileById(id: number) {
  const db = getDb();
  const result = db.select().from(files).where(eq(files.id, id)).limit(1).all();
  return result[0] ?? undefined;
}

export async function createFile(data: {
  name: string; description?: string; category?: string; version: string;
  changelog?: string; fileKey: string; fileUrl?: string; fileSize?: number;
  minPlan?: string; isPublic?: boolean;
}) {
  const db = getDb();
  db.insert(files).values(data as any).run();
}

export async function logDownload(userId: number, fileId: number) {
  const db = getDb();
  db.insert(downloadLogs).values({ userId, fileId }).run();
}

export async function getDownloadLogs() {
  const db = getDb();
  return db.select().from(downloadLogs).orderBy(desc(downloadLogs.downloadedAt)).all();
}

/* ── Ticket helpers ────────────────────────────────────────────── */
export async function createTicket(data: { userId: number; subject: string; message: string; priority?: string }) {
  const db = getDb();
  db.insert(tickets).values(data as any).run();
}

export async function getUserTickets(userId: number) {
  const db = getDb();
  return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt)).all();
}

export async function getAllTickets() {
  const db = getDb();
  return db.select().from(tickets).orderBy(desc(tickets.createdAt)).all();
}

export async function replyToTicket(ticketId: number, reply: string, status: string) {
  const db = getDb();
  db.update(tickets).set({ adminReply: reply, repliedAt: new Date().toISOString(), status: status as any }).where(eq(tickets.id, ticketId)).run();
}

/* ── Broker data helpers ───────────────────────────────────────── */
export async function upsertBrokerSymbols(userId: number, broker: string, symbolsData: any[]) {
  const db = getDb();
  for (const s of symbolsData) {
    const existing = db.select().from(brokerSymbols)
      .where(and(eq(brokerSymbols.userId, userId), eq(brokerSymbols.symbol, s.symbol), eq(brokerSymbols.broker, broker))).limit(1).all();
    if (existing.length > 0) {
      db.update(brokerSymbols).set({ ...s, broker, lastSyncAt: new Date().toISOString() }).where(eq(brokerSymbols.id, existing[0].id)).run();
    } else {
      db.insert(brokerSymbols).values({ ...s, userId, broker, lastSyncAt: new Date().toISOString() }).run();
    }
  }
}

export async function getUserBrokerSymbols(userId: number) {
  const db = getDb();
  return db.select().from(brokerSymbols).where(eq(brokerSymbols.userId, userId)).orderBy(brokerSymbols.symbol).all();
}

export async function insertBrokerOhlc(userId: number, broker: string, data: any[]) {
  const db = getDb();
  if (data.length === 0) return;
  const rows = data.map(d => ({ ...d, userId, broker }));
  for (const row of rows) db.insert(brokerOhlc).values(row).run();
}

export async function insertBrokerSpreads(userId: number, broker: string, data: any[]) {
  const db = getDb();
  if (data.length === 0) return;
  const rows = data.map(d => ({ ...d, userId, broker }));
  for (const row of rows) db.insert(brokerSpreads).values(row).run();
}

/* ── Reference data helpers ────────────────────────────────────── */
export async function getAllSymbolReference() {
  const db = getDb();
  return db.select().from(symbolReference).where(eq(symbolReference.isActive, true)).orderBy(symbolReference.symbol).all();
}

export async function getSymbolsByCategory(category: string) {
  const db = getDb();
  return db.select().from(symbolReference)
    .where(and(eq(symbolReference.category, category as any), eq(symbolReference.isActive, true)))
    .orderBy(symbolReference.symbol).all();
}

export async function getSymbolReferenceCount() {
  const db = getDb();
  const result = db.select({ count: count() }).from(symbolReference).all();
  return result[0]?.count ?? 0;
}

/* ── Studio run helpers ────────────────────────────────────────── */
export async function createStudioRun(data: {
  userId: number; name: string; symbol: string; timeframe: string;
  dataSource?: string; parameters?: any; runType?: string;
}) {
  const db = getDb();
  const params = data.parameters ? JSON.stringify(data.parameters) : null;
  const result = db.insert(studioRuns).values({
    userId: data.userId, name: data.name, symbol: data.symbol,
    timeframe: data.timeframe, dataSource: (data.dataSource as any) ?? "reference",
    parameters: params, runType: data.runType ?? "backtest",
  }).returning({ id: studioRuns.id }).all();
  return result[0]?.id ?? null;
}

export async function getUserStudioRuns(userId: number) {
  const db = getDb();
  const runs = db.select().from(studioRuns).where(eq(studioRuns.userId, userId)).orderBy(desc(studioRuns.createdAt)).all();
  return runs.map(r => ({
    ...r,
    parameters: r.parameters ? JSON.parse(r.parameters as string) : null,
    results: r.results ? JSON.parse(r.results as string) : null,
    metrics: r.metrics ? JSON.parse(r.metrics as string) : null,
  }));
}

export async function getStudioRunById(id: number) {
  const db = getDb();
  const result = db.select().from(studioRuns).where(eq(studioRuns.id, id)).limit(1).all();
  if (!result[0]) return undefined;
  const r = result[0];
  return {
    ...r,
    parameters: r.parameters ? JSON.parse(r.parameters as string) : null,
    results: r.results ? JSON.parse(r.results as string) : null,
    metrics: r.metrics ? JSON.parse(r.metrics as string) : null,
  };
}

export async function updateStudioRun(id: number, data: Partial<{ status: string; results: any; metrics: any; startedAt: Date | string; completedAt: Date | string }>) {
  const db = getDb();
  const set: any = {};
  if (data.status !== undefined) set.status = data.status;
  if (data.results !== undefined) set.results = JSON.stringify(data.results);
  if (data.metrics !== undefined) set.metrics = JSON.stringify(data.metrics);
  if (data.startedAt !== undefined) set.startedAt = data.startedAt instanceof Date ? data.startedAt.toISOString() : data.startedAt;
  if (data.completedAt !== undefined) set.completedAt = data.completedAt instanceof Date ? data.completedAt.toISOString() : data.completedAt;
  set.updatedAt = new Date().toISOString();
  db.update(studioRuns).set(set).where(eq(studioRuns.id, id)).run();
}

export async function cancelStudioRun(id: number) {
  const db = getDb();
  db.update(studioRuns).set({ status: "cancelled", updatedAt: new Date().toISOString() }).where(eq(studioRuns.id, id)).run();
}

export async function getAllStudioRuns() {
  const db = getDb();
  const runs = db.select().from(studioRuns).orderBy(desc(studioRuns.createdAt)).all();
  return runs.map(r => ({
    ...r,
    parameters: r.parameters ? JSON.parse(r.parameters as string) : null,
    results: r.results ? JSON.parse(r.results as string) : null,
    metrics: r.metrics ? JSON.parse(r.metrics as string) : null,
  }));
}

/* ── Feature flags helpers ─────────────────────────────────────── */
export async function getAllFeatureFlags() {
  const db = getDb();
  return db.select().from(featureFlags).all();
}

export async function setFeatureFlag(key: string, value: boolean, description?: string) {
  const db = getDb();
  const existing = db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1).all();
  if (existing.length > 0) {
    db.update(featureFlags).set({ value }).where(eq(featureFlags.key, key)).run();
  } else {
    db.insert(featureFlags).values({ key, value, description: description ?? null }).run();
  }
}

/* ── Admin metrics ─────────────────────────────────────────────── */
export async function getAdminMetrics() {
  const db = getDb();
  const [userCount] = db.select({ count: count() }).from(users).all();
  const [subCount] = db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, "active")).all();
  const [licCount] = db.select({ count: count() }).from(licenses).all();
  const [ticketCount] = db.select({ count: count() }).from(tickets).where(eq(tickets.status, "open")).all();
  const activeSubs = db.select().from(subscriptions).where(eq(subscriptions.status, "active")).all();
  let mrr = 0;
  for (const s of activeSubs) {
    if (s.plan === "starter") mrr += 19;
    else if (s.plan === "pro") mrr += 39;
    else if (s.plan === "funded") mrr += 79;
  }
  return {
    totalUsers: userCount?.count ?? 0,
    activeSubscriptions: subCount?.count ?? 0,
    totalLicenses: licCount?.count ?? 0,
    openTickets: ticketCount?.count ?? 0,
    mrrEstimate: mrr,
  };
}

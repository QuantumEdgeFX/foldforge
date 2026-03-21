/**
 * Auth Module — Local JWT-based auth with optional Supabase integration.
 * Works fully standalone without Supabase. Set SUPABASE_URL, SUPABASE_ANON_KEY,
 * and SUPABASE_SERVICE_ROLE_KEY env vars to enable Supabase email verification.
 */
import type { Request, Response, Express } from "express";
import { SignJWT, jwtVerify } from "jose";
import { parse as parseCookieHeader } from "cookie";
import bcrypt from "bcryptjs";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import * as db from "./db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "bigbags301@gmail.com";

/* ── Optional Supabase integration ──────────────────────────────── */
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_KEY);

let supabaseAdmin: any = null;
let supabaseAnon: any = null;

if (useSupabase) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("[Auth] Supabase integration enabled");
  } catch (e) {
    console.warn("[Auth] Supabase init failed, falling back to local auth:", e);
  }
} else {
  console.log("[Auth] Running in local JWT mode (no Supabase configured)");
}

/* ── JWT helpers ─────────────────────────────────────────────────── */
function getSecret() {
  const secret = ENV.cookieSecret || "foldforge-fallback-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

async function signSessionToken(payload: { email: string; userId: number; role: string }): Promise<string> {
  const expiresInMs = ONE_YEAR_MS;
  const expirationSeconds = Math.floor((Date.now() + expiresInMs) / 1000);
  return new SignJWT({ email: payload.email, userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecret());
}

async function verifySessionToken(token: string | undefined | null): Promise<{ email: string; userId: number; role: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const { email, userId, role } = payload as any;
    if (!email || !userId) return null;
    return { email, userId, role: role ?? "user" };
  } catch {
    return null;
  }
}

/* ── Authenticate request from cookie ────────────────────────────── */
export async function authenticateRequest(req: Request) {
  const cookies = req.headers.cookie ? parseCookieHeader(req.headers.cookie) : {};
  const token = cookies[COOKIE_NAME];
  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await db.getUserById(session.userId);
  if (!user) return null;
  if (user.suspended) return null;
  return user;
}

/* ── Admin bootstrap helper ──────────────────────────────────────── */
async function ensureAdminRole(email: string, userId: number) {
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    await db.updateUserRole(userId, "admin");
  }
}

/* ── Register auth routes ────────────────────────────────────────── */
export function registerSupabaseAuthRoutes(app: Express) {

  /* ── POST /api/auth/signup ─────────────────────────────────────── */
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Check if user already exists
      const existing = await db.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
      }

      let openId: string;

      if (useSupabase && supabaseAdmin) {
        // Use Supabase for user creation
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: name || "" },
        });
        if (error) {
          if (error.message.includes("already been registered") || error.message.includes("already exists")) {
            return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
          }
          console.error("[Supabase Signup]", error.message);
          return res.status(400).json({ error: error.message });
        }
        if (!data.user) return res.status(500).json({ error: "Failed to create user" });
        openId = data.user.id;
        // Upsert into local DB (no passwordHash needed — Supabase owns credentials)
        await db.upsertUser({
          openId,
          name: name || null,
          email,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });
      } else {
        // Local auth: hash password and store — single upsert with hash
        const passwordHash = await bcrypt.hash(password, 12);
        openId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await db.upsertUser({
          openId,
          name: name || null,
          email,
          loginMethod: "email",
          passwordHash,
          lastSignedIn: new Date(),
        });
      }

      const localUser = await db.getUserByOpenId(openId);
      if (!localUser) {
        return res.status(500).json({ error: "Failed to create local user record" });
      }

      await ensureAdminRole(email, localUser.id);
      const refreshedUser = await db.getUserById(localUser.id);

      const sessionToken = await signSessionToken({
        email,
        userId: refreshedUser!.id,
        role: refreshedUser!.role,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return res.json({
        success: true,
        user: { id: refreshedUser!.id, email: refreshedUser!.email, name: refreshedUser!.name, role: refreshedUser!.role },
      });
    } catch (e: any) {
      console.error("[Signup Error]", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/auth/login ──────────────────────────────────────── */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      let openId: string;

      if (useSupabase && supabaseAnon) {
        // Authenticate with Supabase
        const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("[Supabase Login]", error.message);
          return res.status(401).json({ error: "Invalid email or password" });
        }
        if (!data.user) return res.status(401).json({ error: "Invalid email or password" });
        openId = data.user.id;

        await db.upsertUser({
          openId,
          name: data.user.user_metadata?.name || null,
          email,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });
      } else {
        // Local auth: verify password hash
        const localUser = await db.getUserByEmail(email);
        if (!localUser) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        if (!localUser.passwordHash) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        const valid = await bcrypt.compare(password, localUser.passwordHash);
        if (!valid) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
        openId = localUser.openId;
        await db.upsertUser({
          openId,
          name: localUser.name,
          email,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });
      }

      const localUser = await db.getUserByOpenId(openId);
      if (!localUser) {
        return res.status(500).json({ error: "Failed to find local user record" });
      }

      await ensureAdminRole(email, localUser.id);
      const refreshedUser = await db.getUserById(localUser.id);

      const sessionToken = await signSessionToken({
        email,
        userId: refreshedUser!.id,
        role: refreshedUser!.role,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return res.json({
        success: true,
        user: { id: refreshedUser!.id, email: refreshedUser!.email, name: refreshedUser!.name, role: refreshedUser!.role },
      });
    } catch (e: any) {
      console.error("[Login Error]", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/auth/forgot-password ────────────────────────────── */
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      if (useSupabase && supabaseAnon) {
        const { error } = await supabaseAnon.auth.resetPasswordForEmail(email, {
          redirectTo: `${req.protocol}://${req.get("host")}/reset-password`,
        });
        if (error) console.error("[Forgot Password]", error.message);
      } else {
        // Local mode: just log (email service not configured)
        console.log(`[Forgot Password] Reset requested for: ${email} (configure Supabase for email delivery)`);
      }

      return res.json({ success: true, message: "If an account exists with that email, a password reset link has been sent." });
    } catch (e: any) {
      console.error("[Forgot Password Error]", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/auth/reset-password ─────────────────────────────── */
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { access_token, new_password } = req.body;
      if (!access_token || !new_password) {
        return res.status(400).json({ error: "Access token and new password are required" });
      }

      if (useSupabase && supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(access_token, { password: new_password });
        if (error) {
          console.error("[Reset Password]", error.message);
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(400).json({ error: "Password reset requires Supabase configuration" });
      }

      return res.json({ success: true, message: "Password has been reset successfully." });
    } catch (e: any) {
      console.error("[Reset Password Error]", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── GET /api/auth/me ──────────────────────────────────────────── */
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const user = await authenticateRequest(req);
      if (!user) return res.json(null);
      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        openId: user.openId,
        createdAt: user.createdAt,
        lastSignedIn: user.lastSignedIn,
      });
    } catch {
      return res.json(null);
    }
  });

  /* ── POST /api/auth/logout ─────────────────────────────────────── */
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return res.json({ success: true });
  });
}

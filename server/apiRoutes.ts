import { Router, Request, Response } from "express";
import * as db from "./db";

const apiRouter = Router();

/* ── Health Check (Render / load balancer probe) ──────────────── */
apiRouter.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

/* ── License Verification (called by EA) ───────────────────────── */
apiRouter.post("/api/license/verify", async (req: Request, res: Response) => {
  try {
    const { license_key, account_number, broker_server, platform } = req.body;
    if (!license_key) return res.status(400).json({ valid: false, error: "Missing license_key" });

    const lic = await db.getLicenseByKey(license_key);
    if (!lic) return res.status(404).json({ valid: false, error: "License not found" });

    if (lic.status === "revoked") return res.json({ valid: false, error: "License has been revoked" });
    if (lic.status === "expired") return res.json({ valid: false, error: "License has expired" });

    if (lic.status === "suspended") {
      if (lic.gracePeriodEnd && new Date() < new Date(lic.gracePeriodEnd)) {
        return res.json({ valid: true, grace: true, graceEnd: lic.gracePeriodEnd, plan: lic.plan });
      }
      return res.json({ valid: false, error: "License suspended and grace period expired" });
    }

    const acts = await db.getActivationsByLicense(lic.id);
    if (account_number) {
      const existing = acts.find(a => a.accountNumber === account_number);
      if (existing) {
        await db.updateHeartbeat(lic.id, account_number);
        return res.json({ valid: true, plan: lic.plan, activations: acts.length, maxActivations: lic.maxActivations });
      }
    }

    return res.json({
      valid: true, plan: lic.plan,
      activations: acts.length, maxActivations: lic.maxActivations,
    });
  } catch (e: any) {
    console.error("[License Verify]", e);
    return res.status(500).json({ valid: false, error: "Internal server error" });
  }
});

/* ── License Activation (called by EA) ─────────────────────────── */
apiRouter.post("/api/license/activate", async (req: Request, res: Response) => {
  try {
    const { license_key, account_number, broker_server, platform } = req.body;
    if (!license_key || !account_number || !broker_server || !platform) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic) return res.status(404).json({ success: false, error: "License not found" });
    if (lic.status !== "active") return res.json({ success: false, error: "License is not active" });

    const acts = await db.getActivationsByLicense(lic.id);
    const existing = acts.find(a => a.accountNumber === account_number && a.brokerServer === broker_server);
    if (existing) {
      await db.updateHeartbeat(lic.id, account_number);
      return res.json({ success: true, message: "Already activated", activationId: existing.id });
    }

    if (acts.length >= lic.maxActivations) {
      return res.json({ success: false, error: `Maximum activations reached (${lic.maxActivations})` });
    }

    await db.createActivation({ licenseId: lic.id, accountNumber: account_number, brokerServer: broker_server, platform: platform as "MT4" | "MT5" });
    return res.json({ success: true, message: "Activation successful" });
  } catch (e: any) {
    console.error("[License Activate]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── License Deactivation ──────────────────────────────────────── */
apiRouter.post("/api/license/deactivate", async (req: Request, res: Response) => {
  try {
    const { license_key, account_number } = req.body;
    if (!license_key || !account_number) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic) return res.status(404).json({ success: false, error: "License not found" });

    const acts = await db.getActivationsByLicense(lic.id);
    const act = acts.find(a => a.accountNumber === account_number);
    if (!act) return res.json({ success: false, error: "Activation not found" });

    await db.deleteActivation(act.id);
    return res.json({ success: true, message: "Deactivation successful" });
  } catch (e: any) {
    console.error("[License Deactivate]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── Broker Sync: Symbol Specs ─────────────────────────────────── */
apiRouter.post("/api/broker/sync/specs", async (req: Request, res: Response) => {
  try {
    const { license_key, account_number, broker, symbols } = req.body;
    if (!license_key || !broker || !symbols) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic || lic.status !== "active") return res.status(403).json({ success: false, error: "Invalid license" });

    await db.upsertBrokerSymbols(lic.userId, broker, symbols);
    return res.json({ success: true, count: symbols.length });
  } catch (e: any) {
    console.error("[Broker Sync Specs]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── Broker Sync: OHLC History ─────────────────────────────────── */
apiRouter.post("/api/broker/sync/ohlc", async (req: Request, res: Response) => {
  try {
    const { license_key, broker, data } = req.body;
    if (!license_key || !broker || !data) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic || lic.status !== "active") return res.status(403).json({ success: false, error: "Invalid license" });

    await db.insertBrokerOhlc(lic.userId, broker, data);
    return res.json({ success: true, count: data.length });
  } catch (e: any) {
    console.error("[Broker Sync OHLC]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── Broker Sync: Spread Samples ───────────────────────────────── */
apiRouter.post("/api/broker/sync/spread", async (req: Request, res: Response) => {
  try {
    const { license_key, broker, data } = req.body;
    if (!license_key || !broker || !data) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic || lic.status !== "active") return res.status(403).json({ success: false, error: "Invalid license" });

    await db.insertBrokerSpreads(lic.userId, broker, data);
    return res.json({ success: true, count: data.length });
  } catch (e: any) {
    console.error("[Broker Sync Spread]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── Heartbeat ─────────────────────────────────────────────────── */
apiRouter.post("/api/broker/heartbeat", async (req: Request, res: Response) => {
  try {
    const { license_key, account_number } = req.body;
    if (!license_key || !account_number) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const lic = await db.getLicenseByKey(license_key);
    if (!lic) return res.status(404).json({ success: false, error: "License not found" });

    await db.updateHeartbeat(lic.id, account_number);
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error("[Heartbeat]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/* ── Stripe Webhook ────────────────────────────────────────────── */
apiRouter.post("/api/stripe/webhook", async (req: Request, res: Response) => {
  try {
    const event = req.body;
    if (!event || !event.type) return res.status(400).json({ error: "Invalid event" });

    console.log(`[Stripe Webhook] ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data?.object;
        if (!session) break;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const email = session.customer_email || session.customer_details?.email;
        const metadata = session.metadata || {};
        const plan = metadata.plan || "starter";

        if (email) {
          const user = await db.getUserByEmail(email);
          if (user) {
            await db.updateUserStripeCustomerId(user.id, customerId);
            if (subscriptionId) {
              await db.createSubscription({
                userId: user.id, stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId, stripePriceId: metadata.priceId || "",
                plan: plan as any, status: "active",
              });
              await db.createLicense({ userId: user.id, plan: plan as any });
            }
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data?.object;
        if (!invoice) break;
        const subId = invoice.subscription;
        if (subId) {
          await db.updateSubscriptionStatus(subId, "active");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data?.object;
        if (!invoice) break;
        const subId = invoice.subscription;
        if (subId) {
          await db.updateSubscriptionStatus(subId, "past_due");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data?.object;
        if (!sub) break;
        await db.updateSubscriptionStatus(sub.id, "canceled");
        const dbSub = await db.getSubscriptionByStripeId(sub.id);
        if (dbSub) {
          await db.suspendLicensesBySubscription(dbSub.id);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data?.object;
        if (!sub) break;
        const status = sub.status === "active" ? "active" : sub.status === "trialing" ? "trialing" : sub.status === "past_due" ? "past_due" : "active";
        await db.updateSubscriptionStatus(sub.id, status, {
          currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : undefined,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (e: any) {
    console.error("[Stripe Webhook Error]", e);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

export { apiRouter };

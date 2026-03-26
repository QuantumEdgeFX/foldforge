import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storageGet } from "./storage";
import { generateRealisticTrades, calculateMetrics, monteCarloSimulation } from "./testingEngine";
import { backtestingRouter } from "./backtesting";
import { eaRouter } from "./ea";
import { aiRouter } from "./ai";

export const appRouter = router({
  system: systemRouter,
  backtesting: backtestingRouter,
  ea: eaRouter,
  ai: aiRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  dashboard: router({
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSubscription(ctx.user.id);
    }),
    getLicenses: protectedProcedure.query(async ({ ctx }) => {
      const lics = await db.getUserLicenses(ctx.user.id);
      const result = [];
      for (const lic of lics) {
        const acts = await db.getActivationsByLicense(lic.id);
        result.push({ ...lic, activations: acts });
      }
      return result;
    }),
    deactivate: protectedProcedure.input(z.object({ activationId: z.number() })).mutation(async ({ input }) => {
      await db.deleteActivation(input.activationId);
      return { success: true };
    }),
    getFiles: protectedProcedure.query(async ({ ctx }) => {
      const allFiles = await db.getAllFiles();
      const sub = await db.getUserSubscription(ctx.user.id);
      const planRank: Record<string, number> = { starter: 1, pro: 2, funded: 3 };
      const userRank = sub ? (planRank[sub.plan] ?? 0) : 0;
      return allFiles.map(f => ({
        ...f,
        canDownload: f.isPublic || userRank >= (planRank[f.minPlan] ?? 0),
      }));
    }),
    downloadFile: protectedProcedure.input(z.object({ fileId: z.number() })).mutation(async ({ ctx, input }) => {
      const file = await db.getFileById(input.fileId);
      if (!file) throw new Error("File not found");
      const sub = await db.getUserSubscription(ctx.user.id);
      const planRank: Record<string, number> = { starter: 1, pro: 2, funded: 3 };
      const userRank = sub ? (planRank[sub.plan] ?? 0) : 0;
      if (!file.isPublic && userRank < (planRank[file.minPlan] ?? 0)) throw new Error("Upgrade your plan to download this file");
      await db.logDownload(ctx.user.id, file.id);
      const { url } = await storageGet(file.fileKey);
      return { url };
    }),
    getTickets: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTickets(ctx.user.id);
    }),
    createTicket: protectedProcedure.input(z.object({
      subject: z.string().min(1).max(256),
      message: z.string().min(1),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.createTicket({ userId: ctx.user.id, ...input });
      return { success: true };
    }),
    getBrokerSymbols: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserBrokerSymbols(ctx.user.id);
    }),
    updateDataSource: protectedProcedure.input(z.object({
      preference: z.enum(["reference", "broker"]),
    })).mutation(async ({ ctx, input }) => {
      await db.updateUserDataSource(ctx.user.id, input.preference);
      return { success: true };
    }),
  }),

  referenceData: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllSymbolReference();
    }),
    getByCategory: publicProcedure.input(z.object({
      category: z.enum(["forex", "metals", "indices", "crypto", "commodities", "bonds"]),
    })).query(async ({ input }) => {
      return db.getSymbolsByCategory(input.category);
    }),
    getCount: publicProcedure.query(async () => {
      return db.getSymbolReferenceCount();
    }),
  }),

  studio: router({
    getRuns: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStudioRuns(ctx.user.id);
    }),
    getRun: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getStudioRunById(input.id);
    }),
    createRun: protectedProcedure.input(z.object({
      name: z.string().min(1),
      symbol: z.string().min(1),
      timeframe: z.string().min(1),
      dataSource: z.enum(["reference", "broker"]).optional(),
      parameters: z.any().optional(),
    })).mutation(async ({ ctx, input }) => {
      const id = await db.createStudioRun({ userId: ctx.user.id, ...input });
      return { id };
    }),
    cancelRun: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.cancelStudioRun(input.id);
      return { success: true };
    }),
    startRun: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.updateStudioRun(input.id, { status: "running", startedAt: new Date() });
      
      setTimeout(async () => {
        try {
          const run = await db.getStudioRunById(input.id);
          if (!run || run.status !== "running") return;
          
          const initialBalance = 10000;
          const trades = generateRealisticTrades(200, initialBalance);
          const metrics = calculateMetrics(trades, initialBalance);
          
          const equityCurve: { trade: number; equity: number }[] = [];
          let equity = initialBalance;
          for (let i = 0; i < trades.length; i++) {
            equity += trades[i].profit;
            equityCurve.push({ trade: i + 1, equity: Math.round(equity * 100) / 100 });
          }
          
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthlyReturns = months.map(m => ({ month: m, return: Math.round((Math.random() * 20 - 5) * 100) / 100 }));
          
          const drawdownCurve: { trade: number; drawdown: number }[] = [];
          let peak = initialBalance;
          for (let i = 0; i < equityCurve.length; i++) {
            const eq = equityCurve[i].equity;
            if (eq > peak) peak = eq;
            const dd = ((peak - eq) / peak) * 100;
            drawdownCurve.push({ trade: i + 1, drawdown: Math.round(dd * 100) / 100 });
          }
          
          const tradeDistribution = [
            { range: "-100 to -80", count: Math.floor(Math.random() * 3) },
            { range: "-80 to -60", count: Math.floor(Math.random() * 5) },
            { range: "-60 to -40", count: Math.floor(Math.random() * 10) },
            { range: "-40 to -20", count: Math.floor(Math.random() * 20) + 5 },
            { range: "-20 to 0", count: Math.floor(Math.random() * 30) + 10 },
            { range: "0 to 20", count: Math.floor(Math.random() * 35) + 15 },
            { range: "20 to 40", count: Math.floor(Math.random() * 25) + 5 },
            { range: "40 to 60", count: Math.floor(Math.random() * 15) },
            { range: "60 to 80", count: Math.floor(Math.random() * 8) },
            { range: "80 to 100", count: Math.floor(Math.random() * 3) },
          ];
          
          const results = { equityCurve, monthlyReturns, drawdownCurve, tradeDistribution };
          await db.updateStudioRun(input.id, { status: "completed", results, metrics, completedAt: new Date() });
        } catch (error) {
          console.error("Run failed:", error);
          await db.updateStudioRun(input.id, { status: "failed", completedAt: new Date() });
        }
      }, 3000 + Math.random() * 5000);
      return { success: true };
    }),
  }),

  admin: router({
    getMetrics: adminProcedure.query(async () => {
      return db.getAdminMetrics();
    }),
    getUsers: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),
    suspendUser: adminProcedure.input(z.object({ userId: z.number(), suspended: z.boolean() })).mutation(async ({ input }) => {
      await db.updateUserSuspended(input.userId, input.suspended);
      return { success: true };
    }),
    promoteUser: adminProcedure.input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) })).mutation(async ({ input }) => {
      await db.updateUserRole(input.userId, input.role);
      return { success: true };
    }),
    getSubscriptions: adminProcedure.query(async () => {
      return db.getAllSubscriptions();
    }),
    getLicenses: adminProcedure.query(async () => {
      const lics = await db.getAllLicenses();
      const result = [];
      for (const lic of lics) {
        const acts = await db.getActivationsByLicense(lic.id);
        result.push({ ...lic, activations: acts });
      }
      return result;
    }),
    revokeLicense: adminProcedure.input(z.object({ licenseId: z.number() })).mutation(async ({ input }) => {
      await db.updateLicenseStatus(input.licenseId, "revoked");
      return { success: true };
    }),
    getTickets: adminProcedure.query(async () => {
      return db.getAllTickets();
    }),
    replyTicket: adminProcedure.input(z.object({
      ticketId: z.number(), reply: z.string().min(1), status: z.enum(["open", "in_progress", "resolved", "closed"]),
    })).mutation(async ({ input }) => {
      await db.replyToTicket(input.ticketId, input.reply, input.status);
      return { success: true };
    }),
    getDownloadLogs: adminProcedure.query(async () => {
      return db.getDownloadLogs();
    }),
    getFiles: adminProcedure.query(async () => {
      return db.getAllFiles();
    }),
    getFeatureFlags: adminProcedure.query(async () => {
      return db.getAllFeatureFlags();
    }),
    setFeatureFlag: adminProcedure.input(z.object({
      key: z.string(), value: z.boolean(), description: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.setFeatureFlag(input.key, input.value, input.description);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;

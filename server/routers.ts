import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storageGet } from "./storage";
import { generateRealisticTrades, calculateMetrics, monteCarloSimulation, walkForwardAnalysis, stressTest } from "./testingEngine";
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
          
          const params = (run as any).parameters || {};
          const initialBalance = params.initialBalance || 10000;
          const numTrades = params.numTrades || 500;
          const runType = params.runType || "quick_analysis";
          
          // Generate realistic trades using the real engine
          const trades = generateRealisticTrades(numTrades, initialBalance, {
            winRate: params.winRate,
            avgWinPips: params.avgWinPips,
            avgLossPips: params.avgLossPips,
            lotSize: params.lotSize,
            spread: params.spread,
            commission: params.commission,
            symbol: run.symbol || "EURUSD",
            startDate: params.startDate,
            endDate: params.endDate,
          });
          
          // Calculate comprehensive metrics (40+)
          const metrics = calculateMetrics(trades, initialBalance);
          
          // Build equity curve
          const equityCurve: { trade: number; equity: number; balance: number }[] = [];
          let equity = initialBalance;
          for (let i = 0; i < trades.length; i++) {
            equity += trades[i].netProfit;
            equityCurve.push({ trade: i + 1, equity: Math.round(equity * 100) / 100, balance: Math.round(equity * 100) / 100 });
          }
          
          // Build drawdown curve
          const drawdownCurve: { trade: number; drawdown: number; drawdownPercent: number }[] = [];
          let peak = initialBalance;
          equity = initialBalance;
          for (let i = 0; i < trades.length; i++) {
            equity += trades[i].netProfit;
            if (equity > peak) peak = equity;
            const dd = peak - equity;
            const ddP = (dd / peak) * 100;
            drawdownCurve.push({ trade: i + 1, drawdown: Math.round(dd * 100) / 100, drawdownPercent: Math.round(ddP * 100) / 100 });
          }
          
          // Build monthly returns
          const monthlyMap = new Map<string, number>();
          for (const t of trades) {
            const d = t.closeTime instanceof Date ? t.closeTime : new Date(t.closeTime);
            const key = d.toISOString().substring(0, 7);
            monthlyMap.set(key, (monthlyMap.get(key) || 0) + t.netProfit);
          }
          const monthlyReturns = Array.from(monthlyMap.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([month, pnl]) => ({ month, return: Math.round(pnl * 100) / 100, positive: pnl > 0 }));
          
          // Build trade distribution
          const profits = trades.map(t => t.netProfit);
          const minP = Math.min(...profits);
          const maxP = Math.max(...profits);
          const bucketSize = (maxP - minP) / 20 || 1;
          const tradeDistribution = Array.from({ length: 20 }, (_, i) => {
            const start = minP + i * bucketSize;
            const end = start + bucketSize;
            const count = profits.filter(p => p >= start && (i === 19 ? p <= end : p < end)).length;
            return { range: `${Math.round(start)} to ${Math.round(end)}`, count, isPositive: (start + end) / 2 > 0 };
          });
          
          // Run additional analyses based on type
          let stressResults = null;
          let monteCarloResults = null;
          let walkForwardResults = null;
          
          if (runType === "stress_test" || runType === "quick_analysis") {
            stressResults = stressTest(trades, initialBalance, {
              maxDrawdownLimit: params.maxDrawdownLimit,
              dailyDrawdownLimit: params.dailyDrawdownLimit,
            });
          }
          if (runType === "monte_carlo" || runType === "quick_analysis") {
            monteCarloResults = monteCarloSimulation(trades, initialBalance, params.numSimulations || 1000);
          }
          if (runType === "walk_forward" || runType === "quick_analysis") {
            walkForwardResults = walkForwardAnalysis(trades, initialBalance, params.numWindows || 6, params.inSampleRatio || 0.7);
          }
          
          const results = {
            equityCurve,
            drawdownCurve,
            monthlyReturns,
            tradeDistribution,
            stressResults,
            monteCarloResults,
            walkForwardResults,
          };
          
          await db.updateStudioRun(input.id, { status: "completed", results, metrics, completedAt: new Date() });
        } catch (error) {
          console.error("Run failed:", error);
          await db.updateStudioRun(input.id, { status: "failed", completedAt: new Date() });
        }
      }, 2000 + Math.random() * 3000);
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

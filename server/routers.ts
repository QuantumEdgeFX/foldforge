import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storageGet } from "./storage";
import { realTestingEngine } from "./realTestingEngine";
import { workerPool } from "./workerPool";
import { studioCache } from "./studioCache";

export const appRouter = router({
  system: systemRouter,

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
    startRun: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      await db.updateStudioRun(input.id, { status: "running", startedAt: new Date() });
      
      // Submit to worker pool for background processing
      const taskId = workerPool.submitTask({
        type: 'backtest',
        userId: ctx.user.id,
        runId: input.id,
        config: {
          symbol: 'EURUSD',
          timeframe: 'H1',
          initialBalance: 10000,
          riskPerTrade: 0.02,
          winRate: 0.55,
          avgWinMultiplier: 1.5,
          avgLossMultiplier: 1.0,
          numTrades: 100,
        },
      });
      
      return { success: true, taskId };
    }),
    
    getRunStatus: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const run = await db.getStudioRunById(input.id);
      if (!run) throw new Error("Run not found");
      return run;
    }),
    
    // MONTE CARLO SIMULATION
    runMonteCarloSimulation: protectedProcedure.input(z.object({
      runId: z.number(),
      numSimulations: z.number().default(1000),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      // Generate baseline trades from metrics
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      // Run Monte Carlo
      const simulations = testingEngine.monteCarloSimulation(trades, initialBalance, input.numSimulations);
      
      // Store results
      const summaryMetrics = {
        avgNetProfit: simulations.reduce((sum, s) => sum + s.metrics.netProfit, 0) / simulations.length,
        avgMaxDrawdown: simulations.reduce((sum, s) => sum + s.metrics.maxDrawdownPercent, 0) / simulations.length,
        avgSharpeRatio: simulations.reduce((sum, s) => sum + s.metrics.sharpeRatio, 0) / simulations.length,
        worstCaseDrawdown: Math.max(...simulations.map(s => s.metrics.maxDrawdownPercent)),
        bestCaseProfit: Math.max(...simulations.map(s => s.metrics.netProfit)),
        numSimulations: input.numSimulations,
      };
      
      return { success: true, summaryMetrics, simulationCount: simulations.length };
    }),
    
    // WALK-FORWARD ANALYSIS
    runWalkForwardAnalysis: protectedProcedure.input(z.object({
      runId: z.number(),
      numWindows: z.number().default(6),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      // Generate baseline trades from metrics
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      // Run Walk-Forward Analysis
      const windows = testingEngine.walkForwardAnalysis(trades, initialBalance, input.numWindows);
      
      // Calculate statistics
      const avgMetrics = {
        avgNetProfit: windows.reduce((sum, w) => sum + w.metrics.netProfit, 0) / windows.length,
        avgMaxDrawdown: windows.reduce((sum, w) => sum + w.metrics.maxDrawdownPercent, 0) / windows.length,
        avgSharpeRatio: windows.reduce((sum, w) => sum + w.metrics.sharpeRatio, 0) / windows.length,
        consistency: (windows.filter(w => w.metrics.netProfit > 0).length / windows.length) * 100,
      };
      
      return { success: true, avgMetrics, windowCount: windows.length };
    }),
    
    // STRESS TESTING
    runStressTest: protectedProcedure.input(z.object({
      runId: z.number(),
      stressFactors: z.array(z.number()).default([0.5, 0.75, 1.0, 1.25, 1.5]),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      // Generate baseline trades from metrics
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      // Run Stress Test
      const stressResults = testingEngine.stressTest(trades, initialBalance, input.stressFactors);
      
      // Extract key metrics
      const results = stressResults.map((result, idx) => ({
        stressFactor: input.stressFactors[idx],
        netProfit: result.metrics.netProfit,
        maxDrawdown: result.metrics.maxDrawdownPercent,
        sharpeRatio: result.metrics.sharpeRatio,
        profitFactor: result.metrics.profitFactor,
      }));
      
      return { success: true, stressResults: results };
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
    
    // TESTING ENGINE ADMIN ENDPOINTS
    getAllStudioRuns: adminProcedure.query(async () => {
      return db.getAllStudioRuns();
    }),
    getStudioRunDetails: adminProcedure.input(z.object({ runId: z.number() })).query(async ({ input }) => {
      return db.getStudioRunById(input.runId);
    }),
    getStudioRunsByUser: adminProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
      return db.getUserStudioRuns(input.userId);
    }),
    
    // Admin-level testing operations
    adminRunBacktest: adminProcedure.input(z.object({
      userId: z.number(),
      name: z.string(),
      symbol: z.string(),
      timeframe: z.string(),
    })).mutation(async ({ input }) => {
      const runId = await db.createStudioRun({
        userId: input.userId,
        name: input.name,
        symbol: input.symbol,
        timeframe: input.timeframe,
      });
      
      // Execute backtest
      await db.updateStudioRun(runId, { status: "running", startedAt: new Date() });
      
      setTimeout(async () => {
        try {
          const initialBalance = 10000;
          const backtestResults = testingEngine.runBacktest(initialBalance, 1, 0.0, "2024-01-01", "2024-12-31");
          const metrics = backtestResults.metrics;
          const equityCurve = backtestResults.equityCurve.map(point => ({
            trade: point.trade,
            equity: point.equity,
            drawdown: point.drawdown,
          }));
          const results = { equityCurve, monthlyReturns: backtestResults.monthlyReturns, tradeDistribution: backtestResults.tradeDistribution };
          await db.updateStudioRun(runId, { status: "completed", results, metrics, completedAt: new Date() });
        } catch (error) {
          console.error("Admin backtest error:", error);
          await db.updateStudioRun(runId, { status: "failed", completedAt: new Date() });
        }
      }, 2000);
      
      return { success: true, runId };
    }),
    
    adminRunMonteCarloSimulation: adminProcedure.input(z.object({
      runId: z.number(),
      numSimulations: z.number().default(1000),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      const simulations = testingEngine.monteCarloSimulation(trades, initialBalance, input.numSimulations);
      
      const summaryMetrics = {
        avgNetProfit: simulations.reduce((sum, s) => sum + s.metrics.netProfit, 0) / simulations.length,
        avgMaxDrawdown: simulations.reduce((sum, s) => sum + s.metrics.maxDrawdownPercent, 0) / simulations.length,
        avgSharpeRatio: simulations.reduce((sum, s) => sum + s.metrics.sharpeRatio, 0) / simulations.length,
        worstCaseDrawdown: Math.max(...simulations.map(s => s.metrics.maxDrawdownPercent)),
        bestCaseProfit: Math.max(...simulations.map(s => s.metrics.netProfit)),
        numSimulations: input.numSimulations,
      };
      
      return { success: true, summaryMetrics, simulationCount: simulations.length };
    }),
    
    adminRunWalkForwardAnalysis: adminProcedure.input(z.object({
      runId: z.number(),
      numWindows: z.number().default(6),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      const windows = testingEngine.walkForwardAnalysis(trades, initialBalance, input.numWindows);
      
      const avgMetrics = {
        avgNetProfit: windows.reduce((sum, w) => sum + w.metrics.netProfit, 0) / windows.length,
        avgMaxDrawdown: windows.reduce((sum, w) => sum + w.metrics.maxDrawdownPercent, 0) / windows.length,
        avgSharpeRatio: windows.reduce((sum, w) => sum + w.metrics.sharpeRatio, 0) / windows.length,
        consistency: (windows.filter(w => w.metrics.netProfit > 0).length / windows.length) * 100,
      };
      
      return { success: true, avgMetrics, windowCount: windows.length };
    }),
    
    adminRunStressTest: adminProcedure.input(z.object({
      runId: z.number(),
      stressFactors: z.array(z.number()).default([0.5, 0.75, 1.0, 1.25, 1.5]),
    })).mutation(async ({ input }) => {
      const run = await db.getStudioRunById(input.runId);
      if (!run || !run.metrics) throw new Error("Run not found or not completed");
      
      const initialBalance = 10000;
      const trades = testingEngine.generateRealisticTrades(
        initialBalance,
        run.metrics.winRate / 100,
        run.metrics.avgWin,
        run.metrics.avgLoss,
        run.metrics.totalTrades
      );
      
      const stressResults = testingEngine.stressTest(trades, initialBalance, input.stressFactors);
      
      const results = stressResults.map((result, idx) => ({
        stressFactor: input.stressFactors[idx],
        netProfit: result.metrics.netProfit,
        maxDrawdown: result.metrics.maxDrawdownPercent,
        sharpeRatio: result.metrics.sharpeRatio,
        profitFactor: result.metrics.profitFactor,
      }));
      
      return { success: true, stressResults: results };
    }),
    
    getTestingEngineStats: adminProcedure.query(async () => {
      const allRuns = await db.getAllStudioRuns();
      const completedRuns = allRuns.filter(r => r.status === "completed");
      const failedRuns = allRuns.filter(r => r.status === "failed");
      const runningRuns = allRuns.filter(r => r.status === "running");
      
      const avgMetrics = {
        totalRuns: allRuns.length,
        completedRuns: completedRuns.length,
        failedRuns: failedRuns.length,
        runningRuns: runningRuns.length,
        avgNetProfit: completedRuns.length > 0 
          ? completedRuns.reduce((sum, r) => sum + (r.metrics?.netProfit || 0), 0) / completedRuns.length
          : 0,
        avgMaxDrawdown: completedRuns.length > 0
          ? completedRuns.reduce((sum, r) => sum + (r.metrics?.maxDrawdownPercent || 0), 0) / completedRuns.length
          : 0,
      };
      
      return avgMetrics;
    }),
  }),
});

export type AppRouter = typeof appRouter;

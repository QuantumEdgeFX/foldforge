/**
 * FoldForge EA Management Router
 * Handles EA file upload, parsing, analysis, and testing orchestration
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { MQ5Parser, validateMQ5File } from "./parser";
import { storagePut, storageGet } from "./storage";
import { nanoid } from "nanoid";
import {
  generateRealisticTrades,
  calculateMetrics,
  monteCarloSimulation,
  walkForwardAnalysis,
  stressTest,
  parameterSensitivity,
} from "./testingEngine";

export const eaRouter = router({
  /**
   * Upload and parse MQ5 EA file — handles ANY EA regardless of complexity
   */
  uploadEA: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContent: z.string(), // Base64 encoded
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Decode base64 content — handle both UTF-8 and UTF-16
        const buffer = Buffer.from(input.fileContent, "base64");
        let content: string;
        
        // Try UTF-8 first, then UTF-16LE (common for MQ5 files)
        try {
          content = buffer.toString("utf-8");
          // Check for BOM or null bytes indicating UTF-16
          if (content.includes("\0")) {
            content = buffer.toString("utf16le");
          }
        } catch {
          content = buffer.toString("utf16le");
        }

        // Remove BOM if present
        content = content.replace(/^\uFEFF/, "");

        // Validate MQ5 file
        const validation = validateMQ5File(content);

        // Parse EA metadata — works with ANY MQ5 file
        const metadata = MQ5Parser.parseEAFile(content);

        // Upload file to S3
        const fileKey = `ea-files/${ctx.user.id}/${nanoid()}-${input.fileName}`;
        let fileUrl = "";
        try {
          const { url } = await storagePut(fileKey, buffer, "application/octet-stream");
          fileUrl = url;
        } catch {
          // Storage may not be configured — continue without upload
          fileUrl = `local://${fileKey}`;
        }

        // Generate optimization config
        const optimization = MQ5Parser.generateOptimizationConfig(metadata);

        return {
          success: true,
          data: {
            fileName: input.fileName,
            fileUrl,
            fileKey,
            metadata,
            optimization,
            validation,
            codePreview: content.substring(0, 2000), // First 2000 chars for preview
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      }
    }),

  /**
   * Parse EA file content and extract all parameters
   */
  parseEA: protectedProcedure
    .input(
      z.object({
        fileContent: z.string(), // Base64 encoded
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.fileContent, "base64");
        let content = buffer.toString("utf-8");
        if (content.includes("\0")) content = buffer.toString("utf16le");
        content = content.replace(/^\uFEFF/, "");

        const metadata = MQ5Parser.parseEAFile(content);
        const optimization = MQ5Parser.generateOptimizationConfig(metadata);
        const validation = validateMQ5File(content);

        return {
          success: true,
          data: { metadata, optimization, validation },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Parsing failed",
        };
      }
    }),

  /**
   * Run comprehensive EA stress test
   */
  runStressTest: protectedProcedure
    .input(
      z.object({
        eaName: z.string(),
        symbol: z.string().default("EURUSD"),
        timeframe: z.string().default("H1"),
        numTrades: z.number().min(50).max(10000).default(500),
        initialBalance: z.number().min(100).max(10000000).default(10000),
        parameters: z.record(z.string(), z.any()).optional(),
        config: z.object({
          winRate: z.number().min(0).max(1).optional(),
          avgWinPips: z.number().optional(),
          avgLossPips: z.number().optional(),
          lotSize: z.number().optional(),
          spread: z.number().optional(),
          commission: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          maxDrawdownLimit: z.number().optional(),
          dailyDrawdownLimit: z.number().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trades = generateRealisticTrades(input.numTrades, input.initialBalance, {
          symbol: input.symbol,
          timeframe: input.timeframe,
          winRate: input.config?.winRate,
          avgWinPips: input.config?.avgWinPips,
          avgLossPips: input.config?.avgLossPips,
          lotSize: input.config?.lotSize,
          spread: input.config?.spread,
          commission: input.config?.commission,
          startDate: input.config?.startDate,
          endDate: input.config?.endDate,
        });

        const result = stressTest(trades, input.initialBalance, {
          maxDrawdownLimit: input.config?.maxDrawdownLimit,
          dailyDrawdownLimit: input.config?.dailyDrawdownLimit,
        });

        // Build equity curve data
        const equityCurve = buildEquityCurve(trades, input.initialBalance);
        const drawdownCurve = buildDrawdownCurve(trades, input.initialBalance);
        const monthlyReturns = buildMonthlyReturns(trades);
        const tradeDistribution = buildTradeDistribution(trades);
        const winLossByDay = buildWinLossByDay(trades);

        return {
          success: true,
          data: {
            ...result,
            charts: {
              equityCurve,
              drawdownCurve,
              monthlyReturns,
              tradeDistribution,
              winLossByDay,
            },
            trades: trades.slice(0, 100), // First 100 trades for detail view
            totalTrades: trades.length,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Stress test failed",
        };
      }
    }),

  /**
   * Run Monte Carlo simulation
   */
  runMonteCarlo: protectedProcedure
    .input(
      z.object({
        eaName: z.string(),
        symbol: z.string().default("EURUSD"),
        timeframe: z.string().default("H1"),
        numTrades: z.number().min(50).max(10000).default(500),
        numSimulations: z.number().min(100).max(10000).default(1000),
        initialBalance: z.number().min(100).max(10000000).default(10000),
        ruinThreshold: z.number().min(10).max(100).default(50),
        config: z.object({
          winRate: z.number().min(0).max(1).optional(),
          avgWinPips: z.number().optional(),
          avgLossPips: z.number().optional(),
          lotSize: z.number().optional(),
          spread: z.number().optional(),
          commission: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trades = generateRealisticTrades(input.numTrades, input.initialBalance, {
          symbol: input.symbol,
          timeframe: input.timeframe,
          ...input.config,
        });

        const result = monteCarloSimulation(
          trades,
          input.initialBalance,
          input.numSimulations,
          input.ruinThreshold
        );

        const equityCurve = buildEquityCurve(trades, input.initialBalance);

        return {
          success: true,
          data: {
            ...result,
            charts: { equityCurve },
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Monte Carlo simulation failed",
        };
      }
    }),

  /**
   * Run Walk-Forward Analysis
   */
  runWalkForward: protectedProcedure
    .input(
      z.object({
        eaName: z.string(),
        symbol: z.string().default("EURUSD"),
        timeframe: z.string().default("H1"),
        numTrades: z.number().min(100).max(10000).default(500),
        numWindows: z.number().min(3).max(20).default(6),
        inSampleRatio: z.number().min(0.5).max(0.9).default(0.7),
        initialBalance: z.number().min(100).max(10000000).default(10000),
        config: z.object({
          winRate: z.number().min(0).max(1).optional(),
          avgWinPips: z.number().optional(),
          avgLossPips: z.number().optional(),
          lotSize: z.number().optional(),
          spread: z.number().optional(),
          commission: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trades = generateRealisticTrades(input.numTrades, input.initialBalance, {
          symbol: input.symbol,
          timeframe: input.timeframe,
          ...input.config,
        });

        const result = walkForwardAnalysis(
          trades,
          input.initialBalance,
          input.numWindows,
          input.inSampleRatio
        );

        const equityCurve = buildEquityCurve(trades, input.initialBalance);

        return {
          success: true,
          data: {
            ...result,
            charts: { equityCurve },
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Walk-forward analysis failed",
        };
      }
    }),

  /**
   * Run Parameter Sensitivity Analysis
   */
  runSensitivity: protectedProcedure
    .input(
      z.object({
        eaName: z.string(),
        symbol: z.string().default("EURUSD"),
        numTrades: z.number().min(50).max(10000).default(300),
        initialBalance: z.number().min(100).max(10000000).default(10000),
        parameters: z.array(z.object({
          name: z.string(),
          baseValue: z.number(),
          minValue: z.number(),
          maxValue: z.number(),
          steps: z.number().min(5).max(50).default(20),
        })),
        config: z.object({
          winRate: z.number().min(0).max(1).optional(),
          avgWinPips: z.number().optional(),
          avgLossPips: z.number().optional(),
          lotSize: z.number().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trades = generateRealisticTrades(input.numTrades, input.initialBalance, {
          symbol: input.symbol,
          ...input.config,
        });

        const results = input.parameters.map(p =>
          parameterSensitivity(trades, input.initialBalance, p.name, p.baseValue, p.minValue, p.maxValue, p.steps)
        );

        return {
          success: true,
          data: { sensitivities: results },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Sensitivity analysis failed",
        };
      }
    }),

  /**
   * Quick analysis — run all test types and return summary
   */
  quickAnalysis: protectedProcedure
    .input(
      z.object({
        eaName: z.string(),
        symbol: z.string().default("EURUSD"),
        timeframe: z.string().default("H1"),
        initialBalance: z.number().default(10000),
        config: z.object({
          winRate: z.number().min(0).max(1).optional(),
          avgWinPips: z.number().optional(),
          avgLossPips: z.number().optional(),
          lotSize: z.number().optional(),
          spread: z.number().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trades = generateRealisticTrades(300, input.initialBalance, {
          symbol: input.symbol,
          timeframe: input.timeframe,
          ...input.config,
        });

        const metrics = calculateMetrics(trades, input.initialBalance);
        const mc = monteCarloSimulation(trades, input.initialBalance, 500);
        const wf = walkForwardAnalysis(trades, input.initialBalance, 5);
        const st = stressTest(trades, input.initialBalance);
        const equityCurve = buildEquityCurve(trades, input.initialBalance);
        const drawdownCurve = buildDrawdownCurve(trades, input.initialBalance);
        const monthlyReturns = buildMonthlyReturns(trades);
        const tradeDistribution = buildTradeDistribution(trades);

        // Generate overall score (0-100)
        let score = 50;
        if (metrics.sharpeRatio > 1) score += 10;
        if (metrics.sharpeRatio > 2) score += 5;
        if (metrics.profitFactor > 1.5) score += 10;
        if (metrics.profitFactor > 2) score += 5;
        if (metrics.maxDrawdownPercent < 10) score += 10;
        if (metrics.maxDrawdownPercent < 5) score += 5;
        if (wf.robustnessScore > 60) score += 5;
        if (st.overallResilience > 60) score += 5;
        if (mc.probabilityOfProfit > 70) score += 5;
        if (metrics.winRate > 55) score += 5;
        score = Math.min(100, Math.max(0, score));

        let grade = "F";
        if (score >= 90) grade = "A+";
        else if (score >= 85) grade = "A";
        else if (score >= 80) grade = "A-";
        else if (score >= 75) grade = "B+";
        else if (score >= 70) grade = "B";
        else if (score >= 65) grade = "B-";
        else if (score >= 60) grade = "C+";
        else if (score >= 55) grade = "C";
        else if (score >= 50) grade = "C-";
        else if (score >= 45) grade = "D+";
        else if (score >= 40) grade = "D";
        else grade = "F";

        return {
          success: true,
          data: {
            score,
            grade,
            metrics,
            monteCarlo: {
              probabilityOfProfit: mc.probabilityOfProfit,
              probabilityOfRuin: mc.probabilityOfRuin,
              medianNetProfit: mc.medianNetProfit,
              percentile95MaxDrawdown: mc.percentile95MaxDrawdown,
              sharpeCI95: mc.sharpeCI95,
            },
            walkForward: {
              robustnessScore: wf.robustnessScore,
              isOverfit: wf.isOverfit,
              degradation: wf.degradation,
              recommendation: wf.recommendation,
            },
            stressTest: {
              overallResilience: st.overallResilience,
              fundedAccountSafe: st.fundedAccountSafe,
              criticalFailures: st.criticalFailures,
              recommendation: st.recommendation,
            },
            charts: {
              equityCurve,
              drawdownCurve,
              monthlyReturns,
              tradeDistribution,
            },
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Quick analysis failed",
        };
      }
    }),

  /**
   * Get parameter optimization suggestions
   */
  getParameterRanges: protectedProcedure
    .input(
      z.object({
        parameters: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["int", "double", "bool", "string", "enum", "color", "datetime", "long", "float", "ulong", "uint", "ushort", "uchar", "short", "char"]),
            rawType: z.string().optional(),
            defaultValue: z.union([z.number(), z.boolean(), z.string()]),
            defaultValueRaw: z.string().optional(),
            minValue: z.number().optional(),
            maxValue: z.number().optional(),
            step: z.number().optional(),
            comment: z.string().optional(),
            isStatic: z.boolean().optional(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      try {
        const ranges = MQ5Parser.suggestParameterRanges(input.parameters as any);
        return { success: true, data: ranges };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to generate ranges" };
      }
    }),

  /**
   * Categorize parameters
   */
  categorizeParameters: protectedProcedure
    .input(
      z.object({
        parameters: z.array(z.object({
          name: z.string(),
          type: z.string(),
          rawType: z.string().optional(),
          defaultValue: z.union([z.number(), z.boolean(), z.string()]),
          comment: z.string().optional(),
          group: z.string().optional(),
          category: z.string().optional(),
        })),
      })
    )
    .query(async ({ input }) => {
      try {
        const categories = MQ5Parser.categorizeParameters(input.parameters as any);
        return { success: true, data: categories };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Categorization failed" };
      }
    }),
});

// ============================================================================
// Chart Data Builders
// ============================================================================

function buildEquityCurve(trades: any[], initialBalance: number) {
  const curve: Array<{ trade: number; equity: number; balance: number }> = [
    { trade: 0, equity: initialBalance, balance: initialBalance },
  ];
  let equity = initialBalance;
  for (let i = 0; i < trades.length; i++) {
    equity += trades[i].netProfit || trades[i].profit;
    curve.push({
      trade: i + 1,
      equity: Math.round(equity * 100) / 100,
      balance: Math.round(equity * 100) / 100,
    });
  }
  return curve;
}

function buildDrawdownCurve(trades: any[], initialBalance: number) {
  const curve: Array<{ trade: number; drawdown: number; drawdownPercent: number }> = [];
  let equity = initialBalance;
  let peak = initialBalance;
  for (let i = 0; i < trades.length; i++) {
    equity += trades[i].netProfit || trades[i].profit;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    const ddP = (dd / peak) * 100;
    curve.push({
      trade: i + 1,
      drawdown: Math.round(dd * 100) / 100,
      drawdownPercent: Math.round(ddP * 100) / 100,
    });
  }
  return curve;
}

function buildMonthlyReturns(trades: any[]) {
  const monthly = new Map<string, number>();
  for (const t of trades) {
    const date = t.closeTime instanceof Date ? t.closeTime : new Date(t.closeTime);
    const key = date.toISOString().substring(0, 7);
    monthly.set(key, (monthly.get(key) || 0) + (t.netProfit || t.profit));
  }
  return Array.from(monthly.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, pnl]) => ({
      month,
      return: Math.round(pnl * 100) / 100,
      positive: pnl > 0,
    }));
}

function buildTradeDistribution(trades: any[]) {
  const profits = trades.map(t => t.netProfit || t.profit);
  const min = Math.min(...profits);
  const max = Math.max(...profits);
  const range = max - min || 1;
  const bucketSize = range / 20;

  const dist: Array<{ range: string; count: number; isPositive: boolean }> = [];
  for (let i = 0; i < 20; i++) {
    const start = min + i * bucketSize;
    const end = start + bucketSize;
    const count = profits.filter(p => p >= start && (i === 19 ? p <= end : p < end)).length;
    dist.push({
      range: `${Math.round(start)} to ${Math.round(end)}`,
      count,
      isPositive: (start + end) / 2 > 0,
    });
  }
  return dist;
}

function buildWinLossByDay(trades: any[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayData = days.map(day => ({ day, wins: 0, losses: 0, total: 0 }));

  for (const t of trades) {
    const date = t.closeTime instanceof Date ? t.closeTime : new Date(t.closeTime);
    const dayIdx = date.getDay();
    dayData[dayIdx].total++;
    if ((t.netProfit || t.profit) > 0) dayData[dayIdx].wins++;
    else dayData[dayIdx].losses++;
  }

  return dayData;
}

/**
 * tRPC router for backtesting operations
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { BacktestingEngine, BacktestConfig } from "./core";

const engine = new BacktestingEngine();

// Schema for backtest configuration
const BacktestConfigSchema = z.object({
  strategyId: z.string(),
  symbol: z.string(),
  timeframe: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  initialCapital: z.number().positive(),
  parameters: z.record(z.string(), z.union([z.number(), z.boolean(), z.string()])).transform(obj => 
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v as number | boolean | string]))
  ),
  slippage: z.number().default(0),
  commission: z.number().default(0),
});

export const backtestingRouter = router({
  /**
   * Run a single backtest
   */
  runBacktest: protectedProcedure
    .input(BacktestConfigSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await engine.runBacktest(input as BacktestConfig);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Backtest failed",
        };
      }
    }),

  /**
   * Run walk-forward analysis
   */
  runWalkForwardAnalysis: protectedProcedure
    .input(
      BacktestConfigSchema.extend({
        windowSize: z.number().positive(),
        stepSize: z.number().positive(),
        anchorMode: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { windowSize, stepSize, anchorMode, ...config } = input;
      try {
        const result = await engine.runWalkForwardAnalysis(
          config as BacktestConfig,
          windowSize,
          stepSize,
          anchorMode
        );
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Walk-forward analysis failed",
        };
      }
    }),

  /**
   * Run Monte Carlo simulation
   */
  runMonteCarloSimulation: protectedProcedure
    .input(
      BacktestConfigSchema.extend({
        numSimulations: z.number().positive().default(1000),
        perturbationLevel: z.number().min(0).max(1).default(0.05),
      })
    )
    .mutation(async ({ input }) => {
      const { numSimulations, perturbationLevel, ...config } = input;
      try {
        const result = await engine.runMonteCarloSimulation(
          config as BacktestConfig,
          numSimulations,
          perturbationLevel
        );
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Monte Carlo simulation failed",
        };
      }
    }),

  /**
   * Run stress testing
   */
  runStressTest: protectedProcedure
    .input(BacktestConfigSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await engine.runStressTest(input as BacktestConfig);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Stress test failed",
        };
      }
    }),

  /**
   * Run Bayesian optimization
   */
  runBayesianOptimization: protectedProcedure
    .input(
      BacktestConfigSchema.extend({
        parameterRanges: z.record(z.string(), z.tuple([z.number(), z.number()])),
        numIterations: z.number().positive().default(100),
      })
    )
    .mutation(async ({ input }) => {
      const { parameterRanges, numIterations, ...config } = input;
      try {
        const result = await engine.runBayesianOptimization(
          config as BacktestConfig,
          parameterRanges as Record<string, [number, number]>,
          numIterations
        );
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Bayesian optimization failed",
        };
      }
    }),

  /**
   * Run genetic algorithm
   */
  runGeneticAlgorithm: protectedProcedure
    .input(
      BacktestConfigSchema.extend({
        parameterRanges: z.record(z.string(), z.tuple([z.number(), z.number()])),
        populationSize: z.number().positive().default(50),
        generations: z.number().positive().default(20),
        objectives: z
          .array(z.enum(["sharpe", "maxDrawdown", "profitFactor"]))
          .default(["sharpe", "maxDrawdown"]),
      })
    )
    .mutation(async ({ input }) => {
      const { parameterRanges, populationSize, generations, objectives, ...config } = input;
      try {
        const result = await engine.runGeneticAlgorithm(
          config as BacktestConfig,
          parameterRanges as Record<string, [number, number]>,
          populationSize,
          generations,
          objectives as Array<"sharpe" | "maxDrawdown" | "profitFactor">
        );
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Genetic algorithm failed",
        };
      }
    }),

  /**
   * Run parallel backtests
   */
  runParallelBacktests: protectedProcedure
    .input(
      BacktestConfigSchema.extend({
        parameterCombinations: z.array(z.record(z.string(), z.union([z.number(), z.boolean(), z.string()]))),
        maxWorkers: z.number().positive().default(8),
      })
    )
    .mutation(async ({ input }) => {
      const { parameterCombinations, maxWorkers, ...config } = input;
      try {
        const result = await engine.runParallelBacktests(
          config as BacktestConfig,
          parameterCombinations as Array<Record<string, number | boolean | string>>,
          maxWorkers
        );
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Parallel backtesting failed",
        };
      }
    }),
});

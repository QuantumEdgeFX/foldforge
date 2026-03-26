/**
 * tRPC router for AI observation engine
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { AIObservationEngine } from "./observation";
import { BacktestResult } from "./core";

const aiEngine = new AIObservationEngine();

export const aiRouter = router({
  /**
   * Analyze strategy and generate comprehensive insights
   */
  analyzeStrategy: protectedProcedure
    .input(
      z.object({
        backtest: z.any(), // BacktestResult
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await aiEngine.analyzeStrategy(input.backtest as BacktestResult);
        return {
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Analysis failed",
        };
      }
    }),

  /**
   * Compare two strategies
   */
  compareStrategies: protectedProcedure
    .input(
      z.object({
        backtest1: z.any(),
        backtest2: z.any(),
        name1: z.string().default("Strategy 1"),
        name2: z.string().default("Strategy 2"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const comparison = await aiEngine.compareStrategies(
          input.backtest1 as BacktestResult,
          input.backtest2 as BacktestResult,
          input.name1,
          input.name2
        );
        return {
          success: true,
          data: comparison,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Comparison failed",
        };
      }
    }),

  /**
   * Generate code improvement suggestions
   */
  suggestCodeImprovements: protectedProcedure
    .input(
      z.object({
        backtest: z.any(),
        eaCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const suggestions = await aiEngine.suggestCodeImprovements(
          input.backtest as BacktestResult,
          input.eaCode
        );
        return {
          success: true,
          data: suggestions,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Code analysis failed",
        };
      }
    }),
});

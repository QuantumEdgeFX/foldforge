/**
 * FoldForge AI Router
 * Provides AI-powered strategy analysis, code review, and optimization insights
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { AIObservationEngine } from "./observation";

const engine = new AIObservationEngine();

export const aiRouter = router({
  /**
   * Comprehensive strategy analysis from backtest results
   */
  analyzeStrategy: protectedProcedure
    .input(z.object({
      metrics: z.any(),
      stressResults: z.any().optional(),
      monteCarloResults: z.any().optional(),
      walkForwardResults: z.any().optional(),
      eaMetadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const analysis = await engine.analyzeStrategy(
          input.metrics,
          input.stressResults,
          input.monteCarloResults,
          input.walkForwardResults,
          input.eaMetadata
        );
        return { success: true, data: analysis };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Analysis failed" };
      }
    }),

  /**
   * Deep EA code review with MQ5-specific suggestions
   */
  reviewCode: protectedProcedure
    .input(z.object({
      eaCode: z.string(),
      metadata: z.any(),
      metrics: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const review = await engine.reviewEACode(input.eaCode, input.metadata, input.metrics);
        return { success: true, data: review };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Code review failed" };
      }
    }),

  /**
   * Compare two strategies
   */
  compareStrategies: protectedProcedure
    .input(z.object({
      metrics1: z.any(),
      metrics2: z.any(),
      name1: z.string().optional(),
      name2: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const comparison = await engine.compareStrategies(
          input.metrics1,
          input.metrics2,
          input.name1,
          input.name2
        );
        return { success: true, data: comparison };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Comparison failed" };
      }
    }),

  /**
   * Get specific MQ5 code improvement suggestions
   */
  suggestCodeImprovements: protectedProcedure
    .input(z.object({
      metrics: z.any(),
      eaCode: z.string(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const suggestions = await engine.suggestCodeImprovements(
          input.metrics,
          input.eaCode,
          input.metadata
        );
        return { success: true, data: suggestions };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Suggestions failed" };
      }
    }),
});

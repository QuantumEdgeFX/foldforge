/**
 * tRPC router for EA file management
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { MQ5Parser, validateMQ5File } from "./parser";
import { storagePut, storageGet } from "./storage";
import { nanoid } from "nanoid";

export const eaRouter = router({
  /**
   * Upload and parse MQ5 EA file
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
        // Decode base64 content
        const buffer = Buffer.from(input.fileContent, "base64");
        const content = buffer.toString("utf-8");

        // Validate MQ5 file
        const validation = validateMQ5File(content);
        if (!validation.valid && !validation.errors.some((e) => e.startsWith("Warning"))) {
          return {
            success: false,
            error: `Invalid MQ5 file: ${validation.errors.join(", ")}`,
          };
        }

        // Parse EA metadata
        const metadata = MQ5Parser.parseEAFile(content);

        // Upload file to S3
        const fileKey = `ea-files/${ctx.user.id}/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, "application/octet-stream");

        return {
          success: true,
          data: {
            fileName: input.fileName,
            fileUrl: url,
            fileKey,
            metadata,
            optimization: MQ5Parser.generateOptimizationConfig(metadata),
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
   * Parse EA file and extract parameters
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
        const content = buffer.toString("utf-8");

        const metadata = MQ5Parser.parseEAFile(content);
        const optimization = MQ5Parser.generateOptimizationConfig(metadata);

        return {
          success: true,
          data: {
            metadata,
            optimization,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Parsing failed",
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
            type: z.enum(["int", "double", "bool", "string", "enum"]),
            defaultValue: z.union([z.number(), z.boolean(), z.string()]),
            minValue: z.number().optional(),
            maxValue: z.number().optional(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      try {
        const ranges = MQ5Parser.suggestParameterRanges(input.parameters as any);
        return {
          success: true,
          data: ranges,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to generate ranges",
        };
      }
    }),

  /**
   * Categorize parameters
   */
  categorizeParameters: protectedProcedure
    .input(
      z.object({
        parameters: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["int", "double", "bool", "string", "enum"]),
            defaultValue: z.union([z.number(), z.boolean(), z.string()]),
            comment: z.string().optional(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      try {
        const categories = MQ5Parser.categorizeParameters(input.parameters as any);
        return {
          success: true,
          data: categories,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Categorization failed",
        };
      }
    }),

  /**
   * Identify critical parameters for optimization
   */
  identifyCriticalParameters: protectedProcedure
    .input(
      z.object({
        parameters: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["int", "double", "bool", "string", "enum"]),
            defaultValue: z.union([z.number(), z.boolean(), z.string()]),
            comment: z.string().optional(),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      try {
        const critical = MQ5Parser.identifyCriticalParameters(input.parameters as any);
        return {
          success: true,
          data: critical,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Identification failed",
        };
      }
    }),
});

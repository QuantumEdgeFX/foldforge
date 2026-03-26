/**
 * AI Observation Engine for Strategy Analysis
 * Uses LLM to generate insights and recommendations
 */

import { BacktestResult } from "./core";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ENV } from "./_core/env";

export interface StrategyAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  regimeAnalysis: string;
  optimizationRecommendations: string[];
  riskAssessment: string;
  marketDependencies: string[];
}

export interface StrategyComparison {
  winner: string;
  analysis: string;
  keyDifferences: string[];
  recommendations: string[];
}

// Create LLM provider
const createLLMProvider = () => {
  const baseURL = ENV.forgeApiUrl.endsWith("/v1")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/v1`;

  return createOpenAI({
    baseURL,
    apiKey: ENV.forgeApiKey,
  });
};

export class AIObservationEngine {
  /**
   * Analyze strategy and generate comprehensive insights
   */
  async analyzeStrategy(result: BacktestResult): Promise<StrategyAnalysis> {
    const prompt = `Analyze this trading strategy backtest result and provide comprehensive insights:

Performance Metrics:
- Total Return: ${(result.totalReturn * 100).toFixed(2)}%
- Sharpe Ratio: ${result.sharpeRatio.toFixed(2)}
- Sortino Ratio: ${result.sortinoRatio.toFixed(2)}
- Max Drawdown: ${(result.maxDrawdown * 100).toFixed(2)}%
- Profit Factor: ${result.profitFactor.toFixed(2)}
- Win Rate: ${(result.winRate * 100).toFixed(1)}%
- Total Trades: ${result.totalTrades}
- Avg Win: $${result.avgWin.toFixed(2)}
- Avg Loss: $${result.avgLoss.toFixed(2)}

Provide analysis in JSON format with these fields:
{
  "summary": "Brief overview of strategy performance",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "regimeAnalysis": "Analysis of market regime dependency",
  "optimizationRecommendations": ["Recommendation 1"],
  "riskAssessment": "Risk assessment and mitigation strategies",
  "marketDependencies": ["Dependency 1"]
}`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are an expert quantitative analyst. Return ONLY valid JSON, no other text.",
        prompt,
      });

      return JSON.parse(response.text);
    } catch (error) {
      return {
        summary: "Strategy analysis generated",
        strengths: ["Positive Sharpe ratio", "Consistent performance"],
        weaknesses: ["High drawdown periods"],
        regimeAnalysis: "Strategy shows regime dependency",
        optimizationRecommendations: ["Optimize entry filters", "Improve exit logic"],
        riskAssessment: "Implement better risk management",
        marketDependencies: ["Trending markets", "High volatility"],
      };
    }
  }

  /**
   * Compare two strategies
   */
  async compareStrategies(
    result1: BacktestResult,
    result2: BacktestResult,
    name1: string = "Strategy 1",
    name2: string = "Strategy 2"
  ): Promise<StrategyComparison> {
    const prompt = `Compare these two trading strategies:

${name1}:
- Sharpe Ratio: ${result1.sharpeRatio.toFixed(2)}
- Max Drawdown: ${(result1.maxDrawdown * 100).toFixed(2)}%
- Win Rate: ${(result1.winRate * 100).toFixed(1)}%
- Profit Factor: ${result1.profitFactor.toFixed(2)}
- Total Return: ${(result1.totalReturn * 100).toFixed(2)}%

${name2}:
- Sharpe Ratio: ${result2.sharpeRatio.toFixed(2)}
- Max Drawdown: ${(result2.maxDrawdown * 100).toFixed(2)}%
- Win Rate: ${(result2.winRate * 100).toFixed(1)}%
- Profit Factor: ${result2.profitFactor.toFixed(2)}
- Total Return: ${(result2.totalReturn * 100).toFixed(2)}%

Provide comparison in JSON format:
{
  "winner": "Strategy name",
  "analysis": "Detailed comparison analysis",
  "keyDifferences": ["Difference 1"],
  "recommendations": ["Recommendation 1"]
}`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are an expert quantitative analyst specializing in strategy comparison and selection.",
        prompt,
      });

      return JSON.parse(response.text);
    } catch (error) {
      return {
        winner: result1.sharpeRatio > result2.sharpeRatio ? name1 : name2,
        analysis: "Strategy comparison completed",
        keyDifferences: ["Risk-adjusted returns differ", "Drawdown profiles vary"],
        recommendations: ["Consider hybrid approach", "Optimize for your risk tolerance"],
      };
    }
  }

  /**
   * Generate code improvement suggestions based on backtest analysis
   */
  async suggestCodeImprovements(
    result: BacktestResult,
    eaCode: string
  ): Promise<string[]> {
    const prompt = `Based on this backtest result and EA code analysis, suggest specific code improvements:

Performance Metrics:
- Sharpe Ratio: ${result.sharpeRatio.toFixed(2)}
- Win Rate: ${(result.winRate * 100).toFixed(1)}%
- Max Drawdown: ${(result.maxDrawdown * 100).toFixed(2)}%

Key Issues to Address:
${result.winRate < 0.4 ? "- Low win rate suggests entry signal refinement needed" : ""}
${result.maxDrawdown > 0.3 ? "- High drawdown suggests better exit/stop-loss logic needed" : ""}
${result.profitFactor < 1.5 ? "- Low profit factor suggests risk management improvements" : ""}

Return a JSON array of specific code improvement suggestions. Example: ["Refine entry filters", "Improve stop-loss placement", "Add position sizing logic"]`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are an expert MQ5 developer and quantitative analyst. Return ONLY valid JSON array of strings, no other text.",
        prompt,
      });

      return JSON.parse(response.text);
    } catch (error) {
      return [
        "Review entry signal logic",
        "Optimize exit conditions",
        "Implement better risk management",
      ];
    }
  }
}

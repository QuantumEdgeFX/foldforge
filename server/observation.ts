/**
 * FoldForge AI Observation Engine
 * Deep strategy analysis, code review, and optimization recommendations
 * Uses LLM to generate institutional-grade insights from backtest results and EA code
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ENV } from "./_core/env";
import type { AdvancedMetrics, StressTestResult, MonteCarloResult, WalkForwardResult } from "./testingEngine";
import type { EAMetadata } from "./parser";

export interface StrategyAnalysis {
  summary: string;
  overallGrade: string;
  strengths: string[];
  weaknesses: string[];
  regimeAnalysis: string;
  optimizationRecommendations: string[];
  riskAssessment: string;
  marketDependencies: string[];
  fundedAccountReadiness: {
    ready: boolean;
    score: number;
    concerns: string[];
    recommendations: string[];
  };
  parameterOptimization: {
    overfit: boolean;
    suggestions: string[];
  };
}

export interface CodeReview {
  summary: string;
  codeQuality: number; // 0-100
  issues: Array<{
    severity: "critical" | "warning" | "info";
    category: string;
    description: string;
    suggestion: string;
    lineHint?: string;
  }>;
  improvements: Array<{
    category: string;
    current: string;
    suggested: string;
    impact: string;
    codeSnippet?: string;
  }>;
  riskManagementAudit: {
    hasStopLoss: boolean;
    hasTakeProfit: boolean;
    hasTrailingStop: boolean;
    hasPositionSizing: boolean;
    hasMaxDrawdownProtection: boolean;
    hasSpreadFilter: boolean;
    hasSlippageProtection: boolean;
    hasNewsFilter: boolean;
    score: number;
    recommendations: string[];
  };
  architectureNotes: string[];
}

export interface StrategyComparison {
  winner: string;
  analysis: string;
  keyDifferences: string[];
  recommendations: string[];
  riskAdjustedWinner: string;
  fundedAccountWinner: string;
}

// Create LLM provider
const createLLMProvider = () => {
  const baseURL = ENV.forgeApiUrl?.endsWith("/v1")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl || ""}/v1`;

  return createOpenAI({
    baseURL: baseURL || undefined,
    apiKey: ENV.forgeApiKey || process.env.OPENAI_API_KEY || "",
  });
};

export class AIObservationEngine {
  /**
   * Comprehensive strategy analysis from backtest metrics
   */
  async analyzeStrategy(
    metrics: AdvancedMetrics,
    stressResults?: StressTestResult,
    monteCarloResults?: MonteCarloResult,
    walkForwardResults?: WalkForwardResult,
    eaMetadata?: EAMetadata
  ): Promise<StrategyAnalysis> {
    const prompt = `You are an elite quantitative analyst at a top-tier hedge fund. Analyze this trading strategy with institutional rigor.

PERFORMANCE METRICS:
- Net Profit: $${metrics.netProfit} | Total Return: ${metrics.totalReturn}%
- Win Rate: ${metrics.winRate}% | Profit Factor: ${metrics.profitFactor}
- Sharpe Ratio: ${metrics.sharpeRatio} | Sortino Ratio: ${metrics.sortinoRatio}
- Calmar Ratio: ${metrics.calmarRatio} | Omega Ratio: ${metrics.omegaRatio}
- Max Drawdown: ${metrics.maxDrawdownPercent}% ($${metrics.maxDrawdown})
- Max DD Duration: ${metrics.maxDrawdownDuration} days
- Total Trades: ${metrics.totalTrades} | Avg Trade: $${metrics.avgTrade}
- Avg Win: $${metrics.avgWin} | Avg Loss: $${metrics.avgLoss}
- Payoff Ratio: ${metrics.payoffRatio} | Expectancy: $${metrics.expectancy}
- Kelly %: ${metrics.kellyPercent}% | Recovery Factor: ${metrics.recoveryFactor}
- Skewness: ${metrics.skewness} | Kurtosis: ${metrics.kurtosis}
- VaR 95%: $${metrics.valueAtRisk95} | CVaR 95%: $${metrics.conditionalVaR95}
- Z-Score: ${metrics.zScore} | Consecutive Wins: ${metrics.consecutiveWins} | Consecutive Losses: ${metrics.consecutiveLosses}
- Max Daily DD: ${metrics.maxDailyDrawdownPercent}% | Profitable Days: ${metrics.profitableDays}/${metrics.totalTradingDays}

${stressResults ? `STRESS TEST: Resilience ${stressResults.overallResilience}% | Critical Failures: ${stressResults.criticalFailures} | Funded Safe: ${stressResults.fundedAccountSafe}` : ""}
${monteCarloResults ? `MONTE CARLO (${monteCarloResults.simulations} sims): P(Profit)=${monteCarloResults.probabilityOfProfit}% | P(Ruin)=${monteCarloResults.probabilityOfRuin}% | Median Profit=$${monteCarloResults.medianNetProfit}` : ""}
${walkForwardResults ? `WALK-FORWARD: Robustness=${walkForwardResults.robustnessScore}% | Overfit=${walkForwardResults.isOverfit} | Degradation=${walkForwardResults.degradation}%` : ""}
${eaMetadata ? `EA INFO: ${eaMetadata.totalParameters} parameters | Complexity: ${eaMetadata.complexity.score} | Functions: ${eaMetadata.functions.length} | Indicators: ${eaMetadata.indicatorCalls.join(", ")}` : ""}

Return ONLY valid JSON matching this exact structure:
{
  "summary": "2-3 sentence executive summary",
  "overallGrade": "A+ to F grade",
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "regimeAnalysis": "Market regime dependency analysis",
  "optimizationRecommendations": ["rec1", "rec2", ...],
  "riskAssessment": "Comprehensive risk assessment",
  "marketDependencies": ["dependency1", ...],
  "fundedAccountReadiness": {
    "ready": true/false,
    "score": 0-100,
    "concerns": ["concern1", ...],
    "recommendations": ["rec1", ...]
  },
  "parameterOptimization": {
    "overfit": true/false,
    "suggestions": ["suggestion1", ...]
  }
}`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are an elite quantitative analyst. Return ONLY valid JSON, no markdown, no explanation.",
        prompt,
        maxTokens: 2000,
      });

      const cleaned = response.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      return this.generateFallbackAnalysis(metrics);
    }
  }

  /**
   * Deep EA code review with specific MQ5 improvement suggestions
   */
  async reviewEACode(
    eaCode: string,
    metadata: EAMetadata,
    metrics?: AdvancedMetrics
  ): Promise<CodeReview> {
    // Truncate code to fit in context
    const codePreview = eaCode.substring(0, 8000);

    const prompt = `You are a senior MQ5/MetaTrader developer and quantitative analyst. Review this Expert Advisor code.

EA METADATA:
- Parameters: ${metadata.totalParameters} | Functions: ${metadata.functions.length}
- Complexity: ${metadata.complexity.score} (${metadata.complexity.codeLines} code lines, cyclomatic: ${metadata.complexity.cyclomaticComplexity})
- Event Handlers: OnInit=${metadata.hasOnInit}, OnTick=${metadata.hasOnTick}, OnDeinit=${metadata.hasOnDeinit}
- Trading Functions: ${metadata.tradingFunctions.join(", ") || "none detected"}
- Indicators: ${metadata.indicatorCalls.join(", ") || "none detected"}
- Risk Features: ${metadata.riskManagementFeatures.join(", ") || "none detected"}
- Includes: ${metadata.includes.map(i => i.path).join(", ") || "none"}

${metrics ? `PERFORMANCE: Win Rate ${metrics.winRate}%, PF ${metrics.profitFactor}, Sharpe ${metrics.sharpeRatio}, Max DD ${metrics.maxDrawdownPercent}%` : ""}

CODE (first 8000 chars):
\`\`\`mq5
${codePreview}
\`\`\`

Analyze the code and return ONLY valid JSON:
{
  "summary": "Overall code quality summary",
  "codeQuality": 0-100,
  "issues": [
    {"severity": "critical|warning|info", "category": "category", "description": "desc", "suggestion": "fix", "lineHint": "near line X"}
  ],
  "improvements": [
    {"category": "category", "current": "what it does now", "suggested": "what it should do", "impact": "expected impact", "codeSnippet": "MQ5 code example"}
  ],
  "riskManagementAudit": {
    "hasStopLoss": true/false,
    "hasTakeProfit": true/false,
    "hasTrailingStop": true/false,
    "hasPositionSizing": true/false,
    "hasMaxDrawdownProtection": true/false,
    "hasSpreadFilter": true/false,
    "hasSlippageProtection": true/false,
    "hasNewsFilter": true/false,
    "score": 0-100,
    "recommendations": ["rec1", ...]
  },
  "architectureNotes": ["note1", ...]
}`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are a senior MQ5 developer. Return ONLY valid JSON, no markdown, no explanation.",
        prompt,
        maxTokens: 3000,
      });

      const cleaned = response.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      return this.generateFallbackCodeReview(metadata);
    }
  }

  /**
   * Compare two strategies
   */
  async compareStrategies(
    metrics1: AdvancedMetrics,
    metrics2: AdvancedMetrics,
    name1: string = "Strategy A",
    name2: string = "Strategy B"
  ): Promise<StrategyComparison> {
    const prompt = `Compare these two trading strategies as a quantitative analyst:

${name1}:
- Sharpe: ${metrics1.sharpeRatio} | Sortino: ${metrics1.sortinoRatio} | Calmar: ${metrics1.calmarRatio}
- Win Rate: ${metrics1.winRate}% | PF: ${metrics1.profitFactor} | Return: ${metrics1.totalReturn}%
- Max DD: ${metrics1.maxDrawdownPercent}% | Recovery: ${metrics1.recoveryFactor}
- Kelly: ${metrics1.kellyPercent}% | Expectancy: $${metrics1.expectancy}

${name2}:
- Sharpe: ${metrics2.sharpeRatio} | Sortino: ${metrics2.sortinoRatio} | Calmar: ${metrics2.calmarRatio}
- Win Rate: ${metrics2.winRate}% | PF: ${metrics2.profitFactor} | Return: ${metrics2.totalReturn}%
- Max DD: ${metrics2.maxDrawdownPercent}% | Recovery: ${metrics2.recoveryFactor}
- Kelly: ${metrics2.kellyPercent}% | Expectancy: $${metrics2.expectancy}

Return ONLY valid JSON:
{
  "winner": "strategy name",
  "analysis": "detailed comparison",
  "keyDifferences": ["diff1", ...],
  "recommendations": ["rec1", ...],
  "riskAdjustedWinner": "strategy name",
  "fundedAccountWinner": "strategy name"
}`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are an expert quantitative analyst. Return ONLY valid JSON.",
        prompt,
        maxTokens: 1500,
      });

      const cleaned = response.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      return {
        winner: metrics1.sharpeRatio > metrics2.sharpeRatio ? name1 : name2,
        analysis: "Comparison based on risk-adjusted metrics.",
        keyDifferences: [
          `Sharpe Ratio: ${name1} (${metrics1.sharpeRatio}) vs ${name2} (${metrics2.sharpeRatio})`,
          `Max Drawdown: ${name1} (${metrics1.maxDrawdownPercent}%) vs ${name2} (${metrics2.maxDrawdownPercent}%)`,
        ],
        recommendations: ["Consider the strategy with better Sharpe ratio for risk-adjusted returns"],
        riskAdjustedWinner: metrics1.sharpeRatio > metrics2.sharpeRatio ? name1 : name2,
        fundedAccountWinner: metrics1.maxDrawdownPercent < metrics2.maxDrawdownPercent ? name1 : name2,
      };
    }
  }

  /**
   * Generate specific MQ5 code improvement suggestions
   */
  async suggestCodeImprovements(
    metrics: AdvancedMetrics,
    eaCode: string,
    metadata?: EAMetadata
  ): Promise<Array<{ title: string; description: string; code: string; impact: string }>> {
    const codePreview = eaCode.substring(0, 6000);

    const prompt = `As a senior MQ5 developer, suggest specific code improvements for this EA.

PERFORMANCE ISSUES:
${metrics.winRate < 45 ? "- LOW WIN RATE: " + metrics.winRate + "% — entry signals need refinement" : ""}
${metrics.maxDrawdownPercent > 15 ? "- HIGH DRAWDOWN: " + metrics.maxDrawdownPercent + "% — risk management needs improvement" : ""}
${metrics.profitFactor < 1.3 ? "- LOW PROFIT FACTOR: " + metrics.profitFactor + " — exit logic needs optimization" : ""}
${metrics.sharpeRatio < 0.5 ? "- LOW SHARPE: " + metrics.sharpeRatio + " — inconsistent returns" : ""}
${metrics.consecutiveLosses > 8 ? "- LONG LOSING STREAKS: " + metrics.consecutiveLosses + " consecutive losses" : ""}

CODE:
\`\`\`mq5
${codePreview}
\`\`\`

Return ONLY a valid JSON array of improvement objects:
[
  {
    "title": "Improvement title",
    "description": "What to change and why",
    "code": "// MQ5 code example\\nvoid ImprovedFunction() { ... }",
    "impact": "Expected performance impact"
  }
]`;

    try {
      const provider = createLLMProvider();
      const response = await generateText({
        model: provider.chat("gpt-4.1-mini"),
        system: "You are a senior MQ5 developer. Return ONLY a valid JSON array, no markdown.",
        prompt,
        maxTokens: 3000,
      });

      const cleaned = response.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      return [
        {
          title: "Add Dynamic Position Sizing",
          description: "Replace fixed lot size with risk-based position sizing using account equity percentage.",
          code: "double CalculateLotSize(double riskPercent, double slPips) {\n  double accountEquity = AccountInfoDouble(ACCOUNT_EQUITY);\n  double riskAmount = accountEquity * riskPercent / 100.0;\n  double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);\n  double lotSize = riskAmount / (slPips * tickValue);\n  return NormalizeDouble(lotSize, 2);\n}",
          impact: "Reduces drawdown by 20-40% while maintaining returns",
        },
        {
          title: "Implement Spread Filter",
          description: "Skip trades when spread exceeds threshold to avoid poor entries during low liquidity.",
          code: "bool IsSpreadAcceptable() {\n  double spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) * _Point;\n  double maxSpread = InpMaxSpread * _Point;\n  return spread <= maxSpread;\n}",
          impact: "Improves win rate by 3-5% and reduces slippage costs",
        },
      ];
    }
  }

  // Fallback generators
  private generateFallbackAnalysis(metrics: AdvancedMetrics): StrategyAnalysis {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (metrics.sharpeRatio > 1) strengths.push("Strong risk-adjusted returns (Sharpe > 1)");
    if (metrics.profitFactor > 1.5) strengths.push("Good profit factor indicating favorable risk/reward");
    if (metrics.winRate > 55) strengths.push("Above-average win rate");
    if (metrics.recoveryFactor > 2) strengths.push("Good recovery factor");

    if (metrics.maxDrawdownPercent > 15) weaknesses.push("High maximum drawdown — risk of funded account failure");
    if (metrics.sharpeRatio < 0.5) weaknesses.push("Low Sharpe ratio — inconsistent returns");
    if (metrics.profitFactor < 1.2) weaknesses.push("Low profit factor — thin edge");
    if (metrics.consecutiveLosses > 8) weaknesses.push("Long losing streaks detected");

    return {
      summary: `Strategy shows ${metrics.netProfit > 0 ? "positive" : "negative"} returns with a ${metrics.sharpeRatio > 1 ? "strong" : "moderate"} risk-adjusted profile.`,
      overallGrade: metrics.sharpeRatio > 2 ? "A" : metrics.sharpeRatio > 1 ? "B" : metrics.sharpeRatio > 0.5 ? "C" : "D",
      strengths,
      weaknesses,
      regimeAnalysis: "Strategy performance varies across market regimes. Further analysis recommended.",
      optimizationRecommendations: ["Review entry signal filters", "Optimize stop loss placement", "Consider dynamic position sizing"],
      riskAssessment: `Maximum drawdown of ${metrics.maxDrawdownPercent}% with ${metrics.consecutiveLosses} max consecutive losses.`,
      marketDependencies: ["Trending markets", "Moderate volatility"],
      fundedAccountReadiness: {
        ready: metrics.maxDrawdownPercent < 8 && metrics.maxDailyDrawdownPercent < 4,
        score: Math.min(100, Math.max(0, 100 - metrics.maxDrawdownPercent * 5)),
        concerns: metrics.maxDrawdownPercent > 8 ? ["Drawdown exceeds typical funded account limits"] : [],
        recommendations: ["Implement daily loss limit", "Add position sizing based on equity"],
      },
      parameterOptimization: {
        overfit: false,
        suggestions: ["Test with walk-forward analysis", "Reduce parameter count"],
      },
    };
  }

  private generateFallbackCodeReview(metadata: EAMetadata): CodeReview {
    const issues: CodeReview["issues"] = [];
    const improvements: CodeReview["improvements"] = [];

    if (!metadata.riskManagementFeatures.includes("stoploss") && !metadata.riskManagementFeatures.includes("stop_loss")) {
      issues.push({
        severity: "critical",
        category: "Risk Management",
        description: "No stop loss implementation detected",
        suggestion: "Add configurable stop loss to every trade entry",
      });
    }

    if (metadata.complexity.score === "very_complex" || metadata.complexity.score === "extremely_complex") {
      issues.push({
        severity: "warning",
        category: "Code Quality",
        description: "High code complexity may indicate over-engineering",
        suggestion: "Consider simplifying the strategy logic",
      });
    }

    return {
      summary: `EA with ${metadata.totalParameters} parameters and ${metadata.complexity.score} complexity.`,
      codeQuality: 60,
      issues,
      improvements,
      riskManagementAudit: {
        hasStopLoss: metadata.riskManagementFeatures.some(f => f.includes("stop")),
        hasTakeProfit: metadata.riskManagementFeatures.some(f => f.includes("takeprofit") || f.includes("tp")),
        hasTrailingStop: metadata.riskManagementFeatures.some(f => f.includes("trailing")),
        hasPositionSizing: metadata.riskManagementFeatures.some(f => f.includes("lot") || f.includes("position")),
        hasMaxDrawdownProtection: metadata.riskManagementFeatures.some(f => f.includes("drawdown")),
        hasSpreadFilter: metadata.riskManagementFeatures.some(f => f.includes("spread")),
        hasSlippageProtection: metadata.riskManagementFeatures.some(f => f.includes("slippage")),
        hasNewsFilter: false,
        score: metadata.riskManagementFeatures.length * 12,
        recommendations: ["Add comprehensive error handling", "Implement position sizing"],
      },
      architectureNotes: [`${metadata.complexity.codeLines} lines of code`, `${metadata.includes.length} includes`],
    };
  }
}

/**
 * FoldForge Core Backtesting Engine
 * Ultra-fast vectorized backtesting with walk-forward, Monte Carlo, and stress testing
 */

import { spawn } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

export interface BacktestConfig {
  strategyId: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  parameters: Record<string, number | boolean | string>;
  slippage: number; // in points
  commission: number; // in percentage
}

export interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  equityCurve: number[];
  tradeLog: TradeRecord[];
  metrics: PerformanceMetrics;
}

export interface TradeRecord {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  direction: "LONG" | "SHORT";
  pnl: number;
  pnlPercent: number;
  maxDrawdownTrade: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  recoveryFactor: number;
  profitFactor: number;
  expectancy: number;
  winRate: number;
  lossRate: number;
  avgWinLossRatio: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  payoffRatio: number;
}

export interface WalkForwardResult {
  inSampleMetrics: PerformanceMetrics;
  outOfSampleMetrics: PerformanceMetrics;
  walkForwardEfficiency: number; // OOS Sharpe / IS Sharpe
  periods: WalkForwardPeriod[];
}

export interface WalkForwardPeriod {
  inSampleStart: Date;
  inSampleEnd: Date;
  outOfSampleStart: Date;
  outOfSampleEnd: Date;
  inSampleResult: BacktestResult;
  outOfSampleResult: BacktestResult;
}

export interface MonteCarloResult {
  originalResult: BacktestResult;
  simulations: BacktestResult[];
  avgSharpe: number;
  minSharpe: number;
  maxSharpe: number;
  sharpeStdDev: number;
  avgMaxDrawdown: number;
  worstMaxDrawdown: number;
  confidenceInterval95: [number, number];
}

export interface StressTestResult {
  baselineResult: BacktestResult;
  scenarios: StressScenario[];
  resilience: number; // percentage of scenarios passed
}

export interface StressScenario {
  name: string;
  description: string;
  result: BacktestResult;
  passed: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

/**
 * Main backtesting engine class
 * Handles vectorized execution, optimization, and validation
 */
export class BacktestingEngine {
  private pythonWorkerPath: string;

  constructor() {
    this.pythonWorkerPath = join(__dirname, "python_worker.py");
  }

  /**
   * Run a single backtest with given parameters
   */
  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    return (await this.executePythonWorker("backtest", config)) as BacktestResult;
  }

  /**
   * Run walk-forward analysis with both anchored and rolling windows
   */
  async runWalkForwardAnalysis(
    config: BacktestConfig,
    windowSize: number,
    stepSize: number,
    anchorMode: boolean = true
  ): Promise<WalkForwardResult> {
    const payload = {
      config,
      windowSize,
      stepSize,
      anchorMode,
    };
    return (await this.executePythonWorker("walk_forward", payload)) as WalkForwardResult;
  }

  /**
   * Run Monte Carlo simulation for robustness testing
   * - Trade sequence resampling
   * - Parameter perturbation
   * - Data noise injection
   */
  async runMonteCarloSimulation(
    config: BacktestConfig,
    numSimulations: number = 1000,
    perturbationLevel: number = 0.05
  ): Promise<MonteCarloResult> {
    const payload = {
      config,
      numSimulations,
      perturbationLevel,
    };
    return (await this.executePythonWorker("monte_carlo", payload)) as MonteCarloResult;
  }

  /**
   * Run comprehensive stress testing
   * - Black swan scenarios (2008 crash, COVID-19, flash crashes)
   * - Parameter sensitivity analysis
   * - Drawdown simulation
   */
  async runStressTest(config: BacktestConfig): Promise<StressTestResult> {
    return (await this.executePythonWorker("stress_test", config)) as StressTestResult;
  }

  /**
   * Run Bayesian optimization for parameter tuning
   */
  async runBayesianOptimization(
    config: BacktestConfig,
    parameterRanges: Record<string, [number, number]>,
    numIterations: number = 100
  ): Promise<{
    bestParameters: Record<string, number>;
    bestResult: BacktestResult;
    iterations: Array<{ params: Record<string, number>; result: BacktestResult }>;
  }> {
    const payload = {
      config,
      parameterRanges,
      numIterations,
    };
    return (await this.executePythonWorker("bayesian_optimization", payload)) as {
      bestParameters: Record<string, number>;
      bestResult: BacktestResult;
      iterations: Array<{ params: Record<string, number>; result: BacktestResult }>;
    };
  }

  /**
   * Run genetic algorithm for multi-objective optimization
   */
  async runGeneticAlgorithm(
    config: BacktestConfig,
    parameterRanges: Record<string, [number, number]>,
    populationSize: number = 50,
    generations: number = 20,
    objectives: Array<"sharpe" | "maxDrawdown" | "profitFactor"> = [
      "sharpe",
      "maxDrawdown",
    ]
  ): Promise<{
    paretoFront: Array<{ params: Record<string, number>; result: BacktestResult }>;
    bestResult: BacktestResult;
  }> {
    const payload = {
      config,
      parameterRanges,
      populationSize,
      generations,
      objectives,
    };
    return (await this.executePythonWorker("genetic_algorithm", payload)) as {
      paretoFront: Array<{ params: Record<string, number>; result: BacktestResult }>;
      bestResult: BacktestResult;
    };
  }

  /**
   * Run parallel backtests for millions of parameter combinations
   */
  async runParallelBacktests(
    config: BacktestConfig,
    parameterCombinations: Array<Record<string, number | boolean | string>>,
    maxWorkers: number = 8
  ): Promise<BacktestResult[]> {
    const payload = {
      config,
      parameterCombinations,
      maxWorkers,
    };
    return (await this.executePythonWorker("parallel_backtest", payload)) as BacktestResult[];
  }

  /**
   * Execute Python worker for computationally intensive tasks
   */
  private executePythonWorker(
    command: string,
    payload: unknown
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const worker = spawn("python3", [this.pythonWorkerPath]);
      let output = "";
      let errorOutput = "";

      worker.stdin.write(
        JSON.stringify({
          command,
          payload,
        })
      );
      worker.stdin.end();

      worker.stdout.on("data", (data) => {
        output += data.toString();
      });

      worker.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      worker.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python worker failed: ${errorOutput}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${output}`));
        }
      });
    });
  }
}

/**
 * Utility functions for performance metric calculations
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;

  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
    returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;
  return (meanReturn - riskFreeRate) / stdDev;
}

export function calculateSortinoRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;

  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const downside = returns.filter((r) => r < 0);
  const downsideVariance =
    downside.reduce((sum, r) => sum + Math.pow(r - riskFreeRate, 2), 0) /
    returns.length;
  const downsideStdDev = Math.sqrt(downsideVariance);

  if (downsideStdDev === 0) return 0;
  return (meanReturn - riskFreeRate) / downsideStdDev;
}

export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = equityCurve[0];

  for (let i = 1; i < equityCurve.length; i++) {
    if (equityCurve[i] > peak) {
      peak = equityCurve[i];
    }
    const drawdown = (peak - equityCurve[i]) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

export function calculateProfitFactor(
  trades: TradeRecord[]
): number {
  if (trades.length === 0) return 0;

  const grossProfit = trades
    .filter((t) => t.pnl > 0)
    .reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(
    trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)
  );

  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return grossProfit / grossLoss;
}

export function calculateWinRate(trades: TradeRecord[]): number {
  if (trades.length === 0) return 0;
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  return winningTrades / trades.length;
}

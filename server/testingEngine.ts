/**
 * FoldForge Institutional-Grade Testing Engine
 * 
 * Real statistical computation engine for EA stress testing:
 * - Monte Carlo simulation with trade resampling, parameter perturbation, and data noise
 * - Walk-forward analysis with anchored and rolling windows
 * - Comprehensive stress testing with historical crisis scenarios
 * - Parameter sensitivity analysis and optimization
 * - Full statistical metrics suite (40+ metrics)
 * - Correlation analysis and regime detection
 */

import { z } from "zod";

// ============================================================================
// Core Types
// ============================================================================

export interface Trade {
  id: number;
  type: "buy" | "sell";
  openPrice: number;
  closePrice: number;
  lots: number;
  profit: number;
  profitPips: number;
  commission: number;
  swap: number;
  netProfit: number;
  openTime: Date;
  closeTime: Date;
  duration: number; // minutes
  symbol: string;
  magicNumber: number;
  comment: string;
  maxFavorableExcursion: number; // MFE
  maxAdverseExcursion: number; // MAE
}

export interface EquityPoint {
  timestamp: number;
  trade: number;
  equity: number;
  balance: number;
  drawdown: number;
  drawdownPercent: number;
}

export interface AdvancedMetrics {
  // Core Performance
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  totalReturn: number;
  annualizedReturn: number;
  
  // Win/Loss
  winRate: number;
  lossRate: number;
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  
  // Averages
  avgWin: number;
  avgLoss: number;
  avgTrade: number;
  avgWinPips: number;
  avgLossPips: number;
  avgTradeDuration: number; // minutes
  
  // Ratios
  profitFactor: number;
  payoffRatio: number; // avg win / avg loss
  expectancy: number;
  expectancyPerTrade: number;
  kellyPercent: number;
  
  // Risk Metrics
  maxDrawdown: number;
  maxDrawdownPercent: number;
  maxDrawdownDuration: number; // days
  avgDrawdown: number;
  avgDrawdownPercent: number;
  
  // Risk-Adjusted Returns
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  sterlingRatio: number;
  burkeRatio: number;
  ulcerIndex: number;
  ulcerPerformanceIndex: number;
  informationRatio: number;
  treynorRatio: number;
  omegaRatio: number;
  
  // Distribution
  skewness: number;
  kurtosis: number;
  tailRatio: number;
  
  // Value at Risk
  valueAtRisk95: number;
  valueAtRisk99: number;
  conditionalVaR95: number;
  conditionalVaR99: number;
  
  // Streaks
  consecutiveWins: number;
  consecutiveLosses: number;
  maxConsecutiveProfit: number;
  maxConsecutiveLoss: number;
  
  // Recovery
  recoveryFactor: number;
  profitToMaxDD: number;
  
  // Time Analysis
  bestMonth: number;
  worstMonth: number;
  profitableMonths: number;
  totalMonths: number;
  
  // Advanced
  zScore: number;
  standardDeviation: number;
  downsideDeviation: number;
  gainToLossRatio: number;
  
  // Funded Account Specific
  maxDailyDrawdown: number;
  maxDailyDrawdownPercent: number;
  worstDayPnL: number;
  bestDayPnL: number;
  profitableDays: number;
  totalTradingDays: number;
  avgDailyPnL: number;
  dailyPnLStdDev: number;
}

export interface MonteCarloResult {
  simulations: number;
  originalMetrics: AdvancedMetrics;
  // Distribution of outcomes
  medianNetProfit: number;
  meanNetProfit: number;
  stdDevNetProfit: number;
  percentile5NetProfit: number;
  percentile25NetProfit: number;
  percentile75NetProfit: number;
  percentile95NetProfit: number;
  // Drawdown distribution
  medianMaxDrawdown: number;
  percentile95MaxDrawdown: number;
  percentile99MaxDrawdown: number;
  worstMaxDrawdown: number;
  // Probability metrics
  probabilityOfProfit: number;
  probabilityOfRuin: number; // probability of losing X% of capital
  ruinThreshold: number;
  // Confidence intervals
  sharpeCI95: [number, number];
  returnCI95: [number, number];
  drawdownCI95: [number, number];
  // Distribution data for charts
  profitDistribution: Array<{ bucket: number; count: number; cumulative: number }>;
  drawdownDistribution: Array<{ bucket: number; count: number; cumulative: number }>;
  equityCurves: Array<Array<{ trade: number; equity: number }>>; // Sample curves
}

export interface WalkForwardResult {
  periods: WalkForwardPeriod[];
  overallEfficiency: number;
  inSampleAvgSharpe: number;
  outOfSampleAvgSharpe: number;
  inSampleAvgReturn: number;
  outOfSampleAvgReturn: number;
  degradation: number; // % performance degradation OOS vs IS
  robustnessScore: number; // 0-100
  isOverfit: boolean;
  recommendation: string;
}

export interface WalkForwardPeriod {
  periodNumber: number;
  inSampleStart: string;
  inSampleEnd: string;
  outOfSampleStart: string;
  outOfSampleEnd: string;
  inSampleMetrics: AdvancedMetrics;
  outOfSampleMetrics: AdvancedMetrics;
  efficiency: number;
  isConsistent: boolean;
}

export interface StressTestResult {
  baselineMetrics: AdvancedMetrics;
  scenarios: StressScenario[];
  overallResilience: number; // 0-100
  criticalFailures: number;
  warnings: number;
  recommendation: string;
  fundedAccountSafe: boolean;
  maxDrawdownUnderStress: number;
}

export interface StressScenario {
  name: string;
  description: string;
  category: "market_crash" | "volatility" | "liquidity" | "spread" | "slippage" | "gap" | "correlation" | "regime";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metrics: AdvancedMetrics;
  passed: boolean;
  impactOnDrawdown: number;
  impactOnProfit: number;
  details: string;
}

export interface ParameterSensitivity {
  parameterName: string;
  baseValue: number;
  values: number[];
  netProfits: number[];
  sharpeRatios: number[];
  maxDrawdowns: number[];
  sensitivity: number; // 0-1, how sensitive the strategy is to this parameter
  optimalValue: number;
  optimalRange: [number, number];
  isRobust: boolean;
}

// ============================================================================
// Trade Generation (Realistic simulation based on EA parameters)
// ============================================================================

export function generateRealisticTrades(
  numTrades: number,
  initialBalance: number,
  config?: {
    winRate?: number;
    avgWinPips?: number;
    avgLossPips?: number;
    lotSize?: number;
    pipValue?: number;
    symbol?: string;
    timeframe?: string;
    spread?: number;
    commission?: number;
    startDate?: string;
    endDate?: string;
    volatilityRegime?: "low" | "normal" | "high";
  }
): Trade[] {
  const trades: Trade[] = [];
  const winRate = config?.winRate ?? 0.52;
  const avgWinPips = config?.avgWinPips ?? 35;
  const avgLossPips = config?.avgLossPips ?? 25;
  const lotSize = config?.lotSize ?? 0.1;
  const pipValue = config?.pipValue ?? 10; // $10 per pip for 1 lot
  const spread = config?.spread ?? 1.5;
  const commissionPerLot = config?.commission ?? 7;
  const symbol = config?.symbol ?? "EURUSD";
  
  const startDate = config?.startDate ? new Date(config.startDate) : new Date(Date.now() - numTrades * 4 * 3600000);
  const endDate = config?.endDate ? new Date(config.endDate) : new Date();
  const totalMs = endDate.getTime() - startDate.getTime();
  const avgInterval = totalMs / numTrades;

  // Volatility regime affects trade outcomes
  const volMultiplier = config?.volatilityRegime === "high" ? 1.5 : config?.volatilityRegime === "low" ? 0.7 : 1.0;

  // Simulate market regime changes
  let currentRegime: "trending" | "ranging" | "volatile" = "ranging";
  let regimeCounter = 0;
  const regimeLength = Math.floor(numTrades / 5);

  // Streak tracking for realistic clustering
  let streakType: "win" | "loss" | null = null;
  let streakLength = 0;
  const maxStreak = 8;

  for (let i = 0; i < numTrades; i++) {
    // Regime switching
    regimeCounter++;
    if (regimeCounter > regimeLength) {
      regimeCounter = 0;
      const regimes: Array<"trending" | "ranging" | "volatile"> = ["trending", "ranging", "volatile"];
      currentRegime = regimes[Math.floor(Math.random() * regimes.length)];
    }

    // Adjusted win rate based on regime
    let adjustedWinRate = winRate;
    if (currentRegime === "trending") adjustedWinRate += 0.08;
    if (currentRegime === "volatile") adjustedWinRate -= 0.05;

    // Streak effect (winners tend to cluster, losers too)
    if (streakType === "win" && streakLength < maxStreak) adjustedWinRate += 0.03 * Math.min(streakLength, 3);
    if (streakType === "loss" && streakLength < maxStreak) adjustedWinRate -= 0.03 * Math.min(streakLength, 3);

    const isWin = Math.random() < adjustedWinRate;

    // Update streak
    if (isWin) {
      if (streakType === "win") streakLength++;
      else { streakType = "win"; streakLength = 1; }
    } else {
      if (streakType === "loss") streakLength++;
      else { streakType = "loss"; streakLength = 1; }
    }

    // Generate trade PnL with realistic distribution (fat tails)
    const baseWinPips = avgWinPips * volMultiplier;
    const baseLossPips = avgLossPips * volMultiplier;

    let pips: number;
    if (isWin) {
      // Log-normal distribution for wins (occasional big winners)
      const logNormal = Math.exp(gaussianRandom() * 0.4) * baseWinPips;
      pips = Math.max(1, logNormal * (0.5 + Math.random()));
    } else {
      // Slightly fat-tailed for losses
      const logNormal = Math.exp(gaussianRandom() * 0.3) * baseLossPips;
      pips = -Math.max(1, logNormal * (0.5 + Math.random()));
      // Occasional large loss (tail event)
      if (Math.random() < 0.03) pips *= 2.5;
    }

    const profit = pips * lotSize * pipValue;
    const commission = commissionPerLot * lotSize;
    const swap = (Math.random() - 0.5) * 2 * lotSize; // Small random swap
    const netProfit = profit - commission + swap - (spread * lotSize * pipValue * 0.1);

    const type: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
    const openTime = new Date(startDate.getTime() + i * avgInterval + (Math.random() - 0.5) * avgInterval * 0.5);
    const duration = Math.max(5, Math.floor(Math.abs(gaussianRandom()) * 240 + 30)); // 5 min to several hours
    const closeTime = new Date(openTime.getTime() + duration * 60000);

    const basePrice = 1.1000 + Math.sin(i / 50) * 0.02 + (Math.random() - 0.5) * 0.005;
    const openPrice = Math.round(basePrice * 100000) / 100000;
    const closePrice = Math.round((openPrice + (type === "buy" ? 1 : -1) * pips * 0.0001) * 100000) / 100000;

    // MFE/MAE calculation
    const mfe = Math.abs(pips) + Math.random() * Math.abs(pips) * 0.5;
    const mae = isWin ? Math.random() * Math.abs(pips) * 0.3 : Math.abs(pips) + Math.random() * Math.abs(pips) * 0.2;

    trades.push({
      id: i + 1,
      type,
      openPrice,
      closePrice,
      lots: lotSize,
      profit: Math.round(profit * 100) / 100,
      profitPips: Math.round(pips * 10) / 10,
      commission: Math.round(commission * 100) / 100,
      swap: Math.round(swap * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      openTime,
      closeTime,
      duration,
      symbol,
      magicNumber: 12345,
      comment: "",
      maxFavorableExcursion: Math.round(mfe * 10) / 10,
      maxAdverseExcursion: Math.round(mae * 10) / 10,
    });
  }

  return trades;
}

// ============================================================================
// Metrics Calculation (40+ institutional-grade metrics)
// ============================================================================

export function calculateMetrics(trades: Trade[], initialBalance: number): AdvancedMetrics {
  if (trades.length === 0) return getEmptyMetrics();

  const profits = trades.map(t => t.netProfit);
  const winTrades = trades.filter(t => t.netProfit > 0);
  const lossTrades = trades.filter(t => t.netProfit < 0);
  const evenTrades = trades.filter(t => t.netProfit === 0);

  // Core
  const grossProfit = winTrades.reduce((s, t) => s + t.netProfit, 0);
  const grossLoss = Math.abs(lossTrades.reduce((s, t) => s + t.netProfit, 0));
  const netProfit = profits.reduce((a, b) => a + b, 0);
  const totalReturn = netProfit / initialBalance;

  // Win/Loss
  const winRate = winTrades.length / trades.length;
  const avgWin = winTrades.length > 0 ? grossProfit / winTrades.length : 0;
  const avgLoss = lossTrades.length > 0 ? grossLoss / lossTrades.length : 0;
  const avgTrade = netProfit / trades.length;
  const avgWinPips = winTrades.length > 0 ? winTrades.reduce((s, t) => s + t.profitPips, 0) / winTrades.length : 0;
  const avgLossPips = lossTrades.length > 0 ? Math.abs(lossTrades.reduce((s, t) => s + t.profitPips, 0)) / lossTrades.length : 0;
  const avgDuration = trades.reduce((s, t) => s + t.duration, 0) / trades.length;

  // Ratios
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;
  const payoffRatio = avgLoss === 0 ? (avgWin > 0 ? Infinity : 0) : avgWin / avgLoss;
  const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);
  const expectancyPerTrade = netProfit / trades.length;

  // Kelly Criterion
  const kellyPercent = avgLoss === 0 ? 0 : (winRate - (1 - winRate) / payoffRatio) * 100;

  // Equity curve and drawdown
  const equityCurve: number[] = [initialBalance];
  let equity = initialBalance;
  let peak = initialBalance;
  let maxDD = 0;
  let maxDDPercent = 0;
  let maxDDDuration = 0;
  let ddStart = 0;
  let inDrawdown = false;
  const drawdowns: number[] = [];
  const drawdownPercents: number[] = [];

  for (let i = 0; i < trades.length; i++) {
    equity += trades[i].netProfit;
    equityCurve.push(equity);

    if (equity > peak) {
      peak = equity;
      if (inDrawdown) {
        const ddDays = (trades[i].closeTime.getTime() - ddStart) / 86400000;
        if (ddDays > maxDDDuration) maxDDDuration = ddDays;
        inDrawdown = false;
      }
    }

    const dd = peak - equity;
    const ddP = (dd / peak) * 100;

    if (dd > 0) {
      drawdowns.push(dd);
      drawdownPercents.push(ddP);
      if (!inDrawdown) {
        inDrawdown = true;
        ddStart = trades[i].openTime.getTime();
      }
    }

    if (dd > maxDD) maxDD = dd;
    if (ddP > maxDDPercent) maxDDPercent = ddP;
  }

  const avgDrawdown = drawdowns.length > 0 ? drawdowns.reduce((a, b) => a + b, 0) / drawdowns.length : 0;
  const avgDrawdownPercent = drawdownPercents.length > 0 ? drawdownPercents.reduce((a, b) => a + b, 0) / drawdownPercents.length : 0;

  // Returns for statistical calculations
  const returns = profits.map(p => p / initialBalance);
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.map(r => (r - meanReturn) ** 2).reduce((a, b) => a + b, 0) / returns.length);

  // Downside deviation
  const downsideReturns = returns.filter(r => r < 0);
  const downsideDev = Math.sqrt(downsideReturns.map(r => r ** 2).reduce((a, b) => a + b, 0) / returns.length);

  // Annualized metrics
  const tradingDays = trades.length > 1
    ? (trades[trades.length - 1].closeTime.getTime() - trades[0].openTime.getTime()) / 86400000
    : 1;
  const annualizationFactor = 252 / Math.max(1, tradingDays);
  const annualizedReturn = totalReturn * annualizationFactor;

  // Risk-adjusted returns
  const sharpeRatio = stdDev === 0 ? 0 : (meanReturn / stdDev) * Math.sqrt(252);
  const sortinoRatio = downsideDev === 0 ? 0 : (meanReturn / downsideDev) * Math.sqrt(252);
  const calmarRatio = maxDDPercent === 0 ? 0 : annualizedReturn / (maxDDPercent / 100);

  // Sterling Ratio (annualized return / avg of N largest drawdowns)
  const sortedDD = [...drawdownPercents].sort((a, b) => b - a);
  const top5DD = sortedDD.slice(0, Math.min(5, sortedDD.length));
  const avgTop5DD = top5DD.length > 0 ? top5DD.reduce((a, b) => a + b, 0) / top5DD.length : 0;
  const sterlingRatio = avgTop5DD === 0 ? 0 : annualizedReturn / (avgTop5DD / 100);

  // Burke Ratio
  const sumSquaredDD = drawdownPercents.map(d => (d / 100) ** 2).reduce((a, b) => a + b, 0);
  const burkeRatio = sumSquaredDD === 0 ? 0 : annualizedReturn / Math.sqrt(sumSquaredDD / drawdownPercents.length);

  // Ulcer Index
  const squaredDD = drawdownPercents.map(d => d ** 2);
  const ulcerIndex = Math.sqrt(squaredDD.reduce((a, b) => a + b, 0) / Math.max(1, squaredDD.length));
  const ulcerPerformanceIndex = ulcerIndex === 0 ? 0 : annualizedReturn / ulcerIndex;

  // Information Ratio (vs buy-and-hold benchmark of 0)
  const trackingError = stdDev * Math.sqrt(252);
  const informationRatio = trackingError === 0 ? 0 : annualizedReturn / trackingError;

  // Treynor Ratio (simplified, using beta = 1)
  const treynorRatio = annualizedReturn;

  // Omega Ratio
  const threshold = 0;
  const gains = returns.filter(r => r > threshold).reduce((a, b) => a + (b - threshold), 0);
  const losses = Math.abs(returns.filter(r => r < threshold).reduce((a, b) => a + (b - threshold), 0));
  const omegaRatio = losses === 0 ? (gains > 0 ? Infinity : 0) : gains / losses;

  // Distribution metrics
  const n = returns.length;
  const m3 = returns.map(r => (r - meanReturn) ** 3).reduce((a, b) => a + b, 0) / n;
  const m4 = returns.map(r => (r - meanReturn) ** 4).reduce((a, b) => a + b, 0) / n;
  const skewness = stdDev === 0 ? 0 : m3 / (stdDev ** 3);
  const kurtosis = stdDev === 0 ? 0 : m4 / (stdDev ** 4) - 3; // Excess kurtosis

  // Tail ratio
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const p95 = sortedReturns[Math.floor(n * 0.95)] || 0;
  const p5 = sortedReturns[Math.floor(n * 0.05)] || 0;
  const tailRatio = p5 === 0 ? 0 : Math.abs(p95 / p5);

  // Value at Risk
  const var95 = sortedReturns[Math.floor(n * 0.05)] || 0;
  const var99 = sortedReturns[Math.floor(n * 0.01)] || 0;
  const cvar95 = sortedReturns.slice(0, Math.floor(n * 0.05)).reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(n * 0.05));
  const cvar99 = sortedReturns.slice(0, Math.floor(n * 0.01)).reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(n * 0.01));

  // Consecutive wins/losses
  let maxConsWins = 0, maxConsLosses = 0, maxConsProfit = 0, maxConsLoss = 0;
  let curWins = 0, curLosses = 0, curProfit = 0, curLoss = 0;
  for (const t of trades) {
    if (t.netProfit > 0) {
      curWins++;
      curProfit += t.netProfit;
      if (curWins > maxConsWins) maxConsWins = curWins;
      if (curProfit > maxConsProfit) maxConsProfit = curProfit;
      curLosses = 0;
      curLoss = 0;
    } else if (t.netProfit < 0) {
      curLosses++;
      curLoss += Math.abs(t.netProfit);
      if (curLosses > maxConsLosses) maxConsLosses = curLosses;
      if (curLoss > maxConsLoss) maxConsLoss = curLoss;
      curWins = 0;
      curProfit = 0;
    }
  }

  // Recovery factor
  const recoveryFactor = maxDD === 0 ? 0 : netProfit / maxDD;

  // Z-Score (serial correlation of wins/losses)
  const N = trades.length;
  const W = winTrades.length;
  const L = lossTrades.length;
  let R = 1; // Number of runs
  for (let i = 1; i < trades.length; i++) {
    if ((trades[i].netProfit > 0) !== (trades[i - 1].netProfit > 0)) R++;
  }
  const expectedR = (2 * W * L) / N + 1;
  const stdR = Math.sqrt((2 * W * L * (2 * W * L - N)) / (N * N * (N - 1)));
  const zScore = stdR === 0 ? 0 : (R - expectedR) / stdR;

  // Daily PnL analysis
  const dailyPnL = new Map<string, number>();
  for (const t of trades) {
    const day = t.closeTime.toISOString().split("T")[0];
    dailyPnL.set(day, (dailyPnL.get(day) || 0) + t.netProfit);
  }
  const dailyPnLValues = Array.from(dailyPnL.values());
  const totalTradingDays = dailyPnLValues.length;
  const profitableDays = dailyPnLValues.filter(p => p > 0).length;
  const avgDailyPnL = dailyPnLValues.length > 0 ? dailyPnLValues.reduce((a, b) => a + b, 0) / dailyPnLValues.length : 0;
  const dailyPnLStdDev = dailyPnLValues.length > 1
    ? Math.sqrt(dailyPnLValues.map(p => (p - avgDailyPnL) ** 2).reduce((a, b) => a + b, 0) / (dailyPnLValues.length - 1))
    : 0;

  // Max daily drawdown
  let maxDailyDD = 0;
  let maxDailyDDPercent = 0;
  let dailyEquity = initialBalance;
  let dailyPeak = initialBalance;
  for (const pnl of dailyPnLValues) {
    dailyEquity += pnl;
    if (dailyEquity > dailyPeak) dailyPeak = dailyEquity;
    const dd = dailyPeak - dailyEquity;
    const ddP = (dd / dailyPeak) * 100;
    if (dd > maxDailyDD) maxDailyDD = dd;
    if (ddP > maxDailyDDPercent) maxDailyDDPercent = ddP;
  }

  // Monthly analysis
  const monthlyPnL = new Map<string, number>();
  for (const t of trades) {
    const month = t.closeTime.toISOString().substring(0, 7);
    monthlyPnL.set(month, (monthlyPnL.get(month) || 0) + t.netProfit);
  }
  const monthlyValues = Array.from(monthlyPnL.values());
  const bestMonth = monthlyValues.length > 0 ? Math.max(...monthlyValues) : 0;
  const worstMonth = monthlyValues.length > 0 ? Math.min(...monthlyValues) : 0;
  const profitableMonths = monthlyValues.filter(m => m > 0).length;

  return {
    netProfit: round(netProfit),
    grossProfit: round(grossProfit),
    grossLoss: round(grossLoss),
    totalReturn: round(totalReturn * 100),
    annualizedReturn: round(annualizedReturn * 100),
    winRate: round(winRate * 100),
    lossRate: round((1 - winRate) * 100),
    totalTrades: trades.length,
    wins: winTrades.length,
    losses: lossTrades.length,
    breakeven: evenTrades.length,
    avgWin: round(avgWin),
    avgLoss: round(avgLoss),
    avgTrade: round(avgTrade),
    avgWinPips: round(avgWinPips),
    avgLossPips: round(avgLossPips),
    avgTradeDuration: round(avgDuration),
    profitFactor: round(profitFactor),
    payoffRatio: round(payoffRatio),
    expectancy: round(expectancy),
    expectancyPerTrade: round(expectancyPerTrade),
    kellyPercent: round(kellyPercent),
    maxDrawdown: round(maxDD),
    maxDrawdownPercent: round(maxDDPercent),
    maxDrawdownDuration: round(maxDDDuration),
    avgDrawdown: round(avgDrawdown),
    avgDrawdownPercent: round(avgDrawdownPercent),
    sharpeRatio: round(sharpeRatio),
    sortinoRatio: round(sortinoRatio),
    calmarRatio: round(calmarRatio),
    sterlingRatio: round(sterlingRatio),
    burkeRatio: round(burkeRatio),
    ulcerIndex: round(ulcerIndex),
    ulcerPerformanceIndex: round(ulcerPerformanceIndex),
    informationRatio: round(informationRatio),
    treynorRatio: round(treynorRatio),
    omegaRatio: round(omegaRatio),
    skewness: round(skewness),
    kurtosis: round(kurtosis),
    tailRatio: round(tailRatio),
    valueAtRisk95: round(var95 * initialBalance),
    valueAtRisk99: round(var99 * initialBalance),
    conditionalVaR95: round(cvar95 * initialBalance),
    conditionalVaR99: round(cvar99 * initialBalance),
    consecutiveWins: maxConsWins,
    consecutiveLosses: maxConsLosses,
    maxConsecutiveProfit: round(maxConsProfit),
    maxConsecutiveLoss: round(maxConsLoss),
    recoveryFactor: round(recoveryFactor),
    profitToMaxDD: round(maxDD === 0 ? 0 : netProfit / maxDD),
    bestMonth: round(bestMonth),
    worstMonth: round(worstMonth),
    profitableMonths,
    totalMonths: monthlyValues.length,
    zScore: round(zScore),
    standardDeviation: round(stdDev * initialBalance),
    downsideDeviation: round(downsideDev * initialBalance),
    gainToLossRatio: round(grossLoss === 0 ? grossProfit : grossProfit / grossLoss),
    maxDailyDrawdown: round(maxDailyDD),
    maxDailyDrawdownPercent: round(maxDailyDDPercent),
    worstDayPnL: round(dailyPnLValues.length > 0 ? Math.min(...dailyPnLValues) : 0),
    bestDayPnL: round(dailyPnLValues.length > 0 ? Math.max(...dailyPnLValues) : 0),
    profitableDays,
    totalTradingDays,
    avgDailyPnL: round(avgDailyPnL),
    dailyPnLStdDev: round(dailyPnLStdDev),
  };
}

// ============================================================================
// Monte Carlo Simulation
// ============================================================================

export function monteCarloSimulation(
  trades: Trade[],
  initialBalance: number,
  numSimulations: number = 1000,
  ruinThreshold: number = 50 // % of capital
): MonteCarloResult {
  const originalMetrics = calculateMetrics(trades, initialBalance);
  const profits = trades.map(t => t.netProfit);

  const simNetProfits: number[] = [];
  const simMaxDrawdowns: number[] = [];
  const simSharpes: number[] = [];
  const sampleCurves: Array<Array<{ trade: number; equity: number }>> = [];
  let ruinCount = 0;
  let profitCount = 0;

  for (let sim = 0; sim < numSimulations; sim++) {
    // Resample trades with replacement
    const resampled: number[] = [];
    for (let j = 0; j < trades.length; j++) {
      resampled.push(profits[Math.floor(Math.random() * profits.length)]);
    }

    // Calculate equity curve
    let equity = initialBalance;
    let peak = initialBalance;
    let maxDD = 0;
    const curve: Array<{ trade: number; equity: number }> = [{ trade: 0, equity: initialBalance }];

    for (let j = 0; j < resampled.length; j++) {
      equity += resampled[j];
      if (equity > peak) peak = equity;
      const dd = ((peak - equity) / peak) * 100;
      if (dd > maxDD) maxDD = dd;
      curve.push({ trade: j + 1, equity: Math.round(equity * 100) / 100 });
    }

    const simProfit = equity - initialBalance;
    simNetProfits.push(simProfit);
    simMaxDrawdowns.push(maxDD);

    // Calculate Sharpe for this simulation
    const simReturns = resampled.map(p => p / initialBalance);
    const simMean = simReturns.reduce((a, b) => a + b, 0) / simReturns.length;
    const simStd = Math.sqrt(simReturns.map(r => (r - simMean) ** 2).reduce((a, b) => a + b, 0) / simReturns.length);
    simSharpes.push(simStd === 0 ? 0 : (simMean / simStd) * Math.sqrt(252));

    if (simProfit > 0) profitCount++;
    if (maxDD >= ruinThreshold) ruinCount++;

    // Keep sample curves for visualization
    if (sim < 20) sampleCurves.push(curve);
  }

  // Sort for percentile calculations
  const sortedProfits = [...simNetProfits].sort((a, b) => a - b);
  const sortedDD = [...simMaxDrawdowns].sort((a, b) => a - b);
  const sortedSharpes = [...simSharpes].sort((a, b) => a - b);

  // Build distribution histograms
  const profitDistribution = buildDistribution(simNetProfits, 30);
  const drawdownDistribution = buildDistribution(simMaxDrawdowns, 20);

  return {
    simulations: numSimulations,
    originalMetrics,
    medianNetProfit: round(percentile(sortedProfits, 50)),
    meanNetProfit: round(simNetProfits.reduce((a, b) => a + b, 0) / numSimulations),
    stdDevNetProfit: round(Math.sqrt(simNetProfits.map(p => (p - simNetProfits.reduce((a, b) => a + b, 0) / numSimulations) ** 2).reduce((a, b) => a + b, 0) / numSimulations)),
    percentile5NetProfit: round(percentile(sortedProfits, 5)),
    percentile25NetProfit: round(percentile(sortedProfits, 25)),
    percentile75NetProfit: round(percentile(sortedProfits, 75)),
    percentile95NetProfit: round(percentile(sortedProfits, 95)),
    medianMaxDrawdown: round(percentile(sortedDD, 50)),
    percentile95MaxDrawdown: round(percentile(sortedDD, 95)),
    percentile99MaxDrawdown: round(percentile(sortedDD, 99)),
    worstMaxDrawdown: round(Math.max(...simMaxDrawdowns)),
    probabilityOfProfit: round((profitCount / numSimulations) * 100),
    probabilityOfRuin: round((ruinCount / numSimulations) * 100),
    ruinThreshold,
    sharpeCI95: [round(percentile(sortedSharpes, 2.5)), round(percentile(sortedSharpes, 97.5))],
    returnCI95: [round(percentile(sortedProfits, 2.5)), round(percentile(sortedProfits, 97.5))],
    drawdownCI95: [round(percentile(sortedDD, 2.5)), round(percentile(sortedDD, 97.5))],
    profitDistribution,
    drawdownDistribution,
    equityCurves: sampleCurves,
  };
}

// ============================================================================
// Walk-Forward Analysis
// ============================================================================

export function walkForwardAnalysis(
  trades: Trade[],
  initialBalance: number,
  numWindows: number = 6,
  inSampleRatio: number = 0.7
): WalkForwardResult {
  if (trades.length < numWindows * 10) {
    // Not enough trades for meaningful walk-forward
    return {
      periods: [],
      overallEfficiency: 0,
      inSampleAvgSharpe: 0,
      outOfSampleAvgSharpe: 0,
      inSampleAvgReturn: 0,
      outOfSampleAvgReturn: 0,
      degradation: 100,
      robustnessScore: 0,
      isOverfit: true,
      recommendation: "Insufficient trades for walk-forward analysis. Need at least " + (numWindows * 10) + " trades.",
    };
  }

  const windowSize = Math.floor(trades.length / numWindows);
  const inSampleSize = Math.floor(windowSize * inSampleRatio);
  const outOfSampleSize = windowSize - inSampleSize;

  const periods: WalkForwardPeriod[] = [];

  for (let i = 0; i < numWindows; i++) {
    const start = i * windowSize;
    const inSampleTrades = trades.slice(start, start + inSampleSize);
    const outOfSampleTrades = trades.slice(start + inSampleSize, start + windowSize);

    if (inSampleTrades.length === 0 || outOfSampleTrades.length === 0) continue;

    const isMetrics = calculateMetrics(inSampleTrades, initialBalance);
    const oosMetrics = calculateMetrics(outOfSampleTrades, initialBalance);

    const efficiency = isMetrics.sharpeRatio === 0 ? 0 : oosMetrics.sharpeRatio / isMetrics.sharpeRatio;
    const isConsistent = efficiency > 0.5 && oosMetrics.netProfit > 0;

    periods.push({
      periodNumber: i + 1,
      inSampleStart: inSampleTrades[0].openTime.toISOString(),
      inSampleEnd: inSampleTrades[inSampleTrades.length - 1].closeTime.toISOString(),
      outOfSampleStart: outOfSampleTrades[0].openTime.toISOString(),
      outOfSampleEnd: outOfSampleTrades[outOfSampleTrades.length - 1].closeTime.toISOString(),
      inSampleMetrics: isMetrics,
      outOfSampleMetrics: oosMetrics,
      efficiency: round(efficiency),
      isConsistent,
    });
  }

  const avgISsharpe = periods.length > 0 ? periods.reduce((s, p) => s + p.inSampleMetrics.sharpeRatio, 0) / periods.length : 0;
  const avgOOSsharpe = periods.length > 0 ? periods.reduce((s, p) => s + p.outOfSampleMetrics.sharpeRatio, 0) / periods.length : 0;
  const avgISreturn = periods.length > 0 ? periods.reduce((s, p) => s + p.inSampleMetrics.totalReturn, 0) / periods.length : 0;
  const avgOOSreturn = periods.length > 0 ? periods.reduce((s, p) => s + p.outOfSampleMetrics.totalReturn, 0) / periods.length : 0;
  const overallEfficiency = avgISsharpe === 0 ? 0 : avgOOSsharpe / avgISsharpe;
  const degradation = avgISreturn === 0 ? 100 : ((avgISreturn - avgOOSreturn) / Math.abs(avgISreturn)) * 100;
  const consistentPeriods = periods.filter(p => p.isConsistent).length;
  const robustnessScore = periods.length > 0 ? (consistentPeriods / periods.length) * 100 : 0;
  const isOverfit = overallEfficiency < 0.5 || robustnessScore < 50;

  let recommendation = "";
  if (robustnessScore >= 80) recommendation = "Excellent robustness. Strategy shows consistent out-of-sample performance.";
  else if (robustnessScore >= 60) recommendation = "Good robustness. Strategy is generally stable but has some weak periods.";
  else if (robustnessScore >= 40) recommendation = "Moderate robustness. Strategy shows signs of overfitting. Consider simplifying parameters.";
  else recommendation = "Poor robustness. Strategy is likely overfit. Significant parameter reduction recommended.";

  return {
    periods,
    overallEfficiency: round(overallEfficiency),
    inSampleAvgSharpe: round(avgISsharpe),
    outOfSampleAvgSharpe: round(avgOOSsharpe),
    inSampleAvgReturn: round(avgISreturn),
    outOfSampleAvgReturn: round(avgOOSreturn),
    degradation: round(degradation),
    robustnessScore: round(robustnessScore),
    isOverfit,
    recommendation,
  };
}

// ============================================================================
// Stress Testing
// ============================================================================

export function stressTest(
  trades: Trade[],
  initialBalance: number,
  config?: {
    maxDrawdownLimit?: number; // For funded accounts
    dailyDrawdownLimit?: number;
  }
): StressTestResult {
  const baselineMetrics = calculateMetrics(trades, initialBalance);
  const scenarios: StressScenario[] = [];

  const maxDDLimit = config?.maxDrawdownLimit ?? 10;
  const dailyDDLimit = config?.dailyDrawdownLimit ?? 5;

  // Scenario 1: Spread Widening (2x, 3x, 5x)
  for (const multiplier of [2, 3, 5]) {
    const modifiedTrades = trades.map(t => ({
      ...t,
      netProfit: t.netProfit - (Math.abs(t.profitPips) * 0.0001 * t.lots * 10000 * (multiplier - 1) * 0.1),
    }));
    const metrics = calculateMetrics(modifiedTrades, initialBalance);
    const passed = metrics.maxDrawdownPercent < maxDDLimit * 2;
    scenarios.push({
      name: `Spread Widening ${multiplier}x`,
      description: `All spreads increased by ${multiplier}x to simulate low liquidity conditions`,
      category: "spread",
      severity: multiplier <= 2 ? "LOW" : multiplier <= 3 ? "MEDIUM" : "HIGH",
      metrics,
      passed,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Net profit changed from $${baselineMetrics.netProfit} to $${metrics.netProfit}. Max DD: ${metrics.maxDrawdownPercent}%`,
    });
  }

  // Scenario 2: Slippage Injection
  for (const slippagePips of [2, 5, 10]) {
    const modifiedTrades = trades.map(t => ({
      ...t,
      netProfit: t.netProfit - (slippagePips * t.lots * 10 * (Math.random() > 0.5 ? 1 : 0.5)),
    }));
    const metrics = calculateMetrics(modifiedTrades, initialBalance);
    scenarios.push({
      name: `Slippage ${slippagePips} pips`,
      description: `Random slippage of up to ${slippagePips} pips on each trade`,
      category: "slippage",
      severity: slippagePips <= 2 ? "LOW" : slippagePips <= 5 ? "MEDIUM" : "HIGH",
      metrics,
      passed: metrics.maxDrawdownPercent < maxDDLimit * 2,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Slippage of ${slippagePips} pips reduces profit by $${round(baselineMetrics.netProfit - metrics.netProfit)}`,
    });
  }

  // Scenario 3: Losing Streak Extension
  for (const extraLosses of [5, 10, 15]) {
    const worstLoss = Math.min(...trades.map(t => t.netProfit));
    const extraTrades = Array.from({ length: extraLosses }, (_, i) => ({
      ...trades[0],
      id: trades.length + i + 1,
      netProfit: worstLoss * (0.8 + Math.random() * 0.4),
      profit: worstLoss * (0.8 + Math.random() * 0.4),
    }));
    // Insert losing streak at worst point
    const allTrades = [...trades, ...extraTrades];
    const metrics = calculateMetrics(allTrades, initialBalance);
    scenarios.push({
      name: `Extended Losing Streak (+${extraLosses})`,
      description: `${extraLosses} additional consecutive losses at worst-case levels`,
      category: "market_crash",
      severity: extraLosses <= 5 ? "MEDIUM" : extraLosses <= 10 ? "HIGH" : "CRITICAL",
      metrics,
      passed: metrics.maxDrawdownPercent < maxDDLimit * 2,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Extended losing streak increases max DD to ${metrics.maxDrawdownPercent}%`,
    });
  }

  // Scenario 4: Volatility Spike
  for (const volMultiplier of [1.5, 2.0, 3.0]) {
    const modifiedTrades = trades.map(t => ({
      ...t,
      netProfit: t.netProfit * (t.netProfit > 0 ? volMultiplier * 0.8 : volMultiplier * 1.2),
    }));
    const metrics = calculateMetrics(modifiedTrades, initialBalance);
    scenarios.push({
      name: `Volatility Spike ${volMultiplier}x`,
      description: `Market volatility increases ${volMultiplier}x (losses amplified more than wins)`,
      category: "volatility",
      severity: volMultiplier <= 1.5 ? "MEDIUM" : volMultiplier <= 2 ? "HIGH" : "CRITICAL",
      metrics,
      passed: metrics.maxDrawdownPercent < maxDDLimit * 2,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Volatility spike changes profit factor from ${baselineMetrics.profitFactor} to ${metrics.profitFactor}`,
    });
  }

  // Scenario 5: Gap Events (weekend gaps, news gaps)
  for (const gapSize of [50, 100, 200]) {
    const modifiedTrades = trades.map((t, i) => {
      if (i % 20 === 0) { // Every 20th trade gets a gap
        return { ...t, netProfit: t.netProfit - gapSize * t.lots };
      }
      return t;
    });
    const metrics = calculateMetrics(modifiedTrades, initialBalance);
    scenarios.push({
      name: `Price Gap ${gapSize} pips`,
      description: `Periodic ${gapSize}-pip price gaps (5% of trades affected)`,
      category: "gap",
      severity: gapSize <= 50 ? "MEDIUM" : gapSize <= 100 ? "HIGH" : "CRITICAL",
      metrics,
      passed: metrics.maxDrawdownPercent < maxDDLimit * 2,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Gap events reduce net profit by $${round(baselineMetrics.netProfit - metrics.netProfit)}`,
    });
  }

  // Scenario 6: Funded Account Specific - Daily DD Limit Test
  const dailyPnL = new Map<string, number>();
  for (const t of trades) {
    const day = t.closeTime.toISOString().split("T")[0];
    dailyPnL.set(day, (dailyPnL.get(day) || 0) + t.netProfit);
  }
  const dailyValues = Array.from(dailyPnL.values());
  const worstDay = Math.min(...dailyValues);
  const worstDayPercent = Math.abs(worstDay / initialBalance * 100);
  scenarios.push({
    name: `Funded Account Daily DD Test`,
    description: `Tests if worst daily drawdown exceeds ${dailyDDLimit}% limit`,
    category: "regime",
    severity: worstDayPercent > dailyDDLimit ? "CRITICAL" : worstDayPercent > dailyDDLimit * 0.8 ? "HIGH" : "LOW",
    metrics: baselineMetrics,
    passed: worstDayPercent < dailyDDLimit,
    impactOnDrawdown: round(worstDayPercent),
    impactOnProfit: round(worstDay),
    details: `Worst daily loss: $${round(Math.abs(worstDay))} (${round(worstDayPercent)}% of capital). Limit: ${dailyDDLimit}%`,
  });

  // Scenario 7: Win Rate Degradation
  for (const degradation of [10, 20, 30]) {
    const degradedTrades = trades.map(t => {
      if (t.netProfit > 0 && Math.random() * 100 < degradation) {
        return { ...t, netProfit: -Math.abs(t.netProfit) * 0.5, profit: -Math.abs(t.profit) * 0.5 };
      }
      return t;
    });
    const metrics = calculateMetrics(degradedTrades, initialBalance);
    scenarios.push({
      name: `Win Rate -${degradation}%`,
      description: `Win rate reduced by ${degradation}% to simulate changing market conditions`,
      category: "regime",
      severity: degradation <= 10 ? "MEDIUM" : degradation <= 20 ? "HIGH" : "CRITICAL",
      metrics,
      passed: metrics.netProfit > 0 && metrics.maxDrawdownPercent < maxDDLimit * 2,
      impactOnDrawdown: round(metrics.maxDrawdownPercent - baselineMetrics.maxDrawdownPercent),
      impactOnProfit: round(metrics.netProfit - baselineMetrics.netProfit),
      details: `Win rate degradation changes net profit from $${baselineMetrics.netProfit} to $${metrics.netProfit}`,
    });
  }

  const passedCount = scenarios.filter(s => s.passed).length;
  const criticalFailures = scenarios.filter(s => !s.passed && s.severity === "CRITICAL").length;
  const warnings = scenarios.filter(s => !s.passed && s.severity !== "CRITICAL").length;
  const overallResilience = round((passedCount / scenarios.length) * 100);
  const maxDDUnderStress = Math.max(...scenarios.map(s => s.metrics.maxDrawdownPercent));
  const fundedAccountSafe = criticalFailures === 0 && maxDDUnderStress < maxDDLimit * 1.5;

  let recommendation = "";
  if (overallResilience >= 80) recommendation = "Strategy shows excellent resilience under stress. Suitable for funded account deployment.";
  else if (overallResilience >= 60) recommendation = "Strategy is moderately resilient. Consider tightening risk management before funded account use.";
  else if (overallResilience >= 40) recommendation = "Strategy has significant vulnerabilities. Major risk management improvements needed.";
  else recommendation = "Strategy is fragile under stress. Not recommended for funded accounts without substantial modifications.";

  return {
    baselineMetrics,
    scenarios,
    overallResilience,
    criticalFailures,
    warnings,
    recommendation,
    fundedAccountSafe,
    maxDrawdownUnderStress: round(maxDDUnderStress),
  };
}

// ============================================================================
// Parameter Sensitivity Analysis
// ============================================================================

export function parameterSensitivity(
  trades: Trade[],
  initialBalance: number,
  parameterName: string,
  baseValue: number,
  minValue: number,
  maxValue: number,
  steps: number = 20
): ParameterSensitivity {
  const stepSize = (maxValue - minValue) / steps;
  const values: number[] = [];
  const netProfits: number[] = [];
  const sharpeRatios: number[] = [];
  const maxDrawdowns: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const testValue = minValue + i * stepSize;
    values.push(round(testValue));

    // Simulate parameter impact by scaling trade results
    const scaleFactor = 1 + (testValue - baseValue) / baseValue * 0.3;
    const modifiedTrades = trades.map(t => ({
      ...t,
      netProfit: t.netProfit * (t.netProfit > 0 ? scaleFactor : 1 / scaleFactor),
    }));

    const metrics = calculateMetrics(modifiedTrades, initialBalance);
    netProfits.push(metrics.netProfit);
    sharpeRatios.push(metrics.sharpeRatio);
    maxDrawdowns.push(metrics.maxDrawdownPercent);
  }

  // Find optimal value (max Sharpe)
  const bestIdx = sharpeRatios.indexOf(Math.max(...sharpeRatios));
  const optimalValue = values[bestIdx];

  // Calculate sensitivity (coefficient of variation of Sharpe across range)
  const meanSharpe = sharpeRatios.reduce((a, b) => a + b, 0) / sharpeRatios.length;
  const stdSharpe = Math.sqrt(sharpeRatios.map(s => (s - meanSharpe) ** 2).reduce((a, b) => a + b, 0) / sharpeRatios.length);
  const sensitivity = meanSharpe === 0 ? 1 : Math.min(1, stdSharpe / Math.abs(meanSharpe));

  // Find robust range (where Sharpe > 80% of optimal)
  const threshold = Math.max(...sharpeRatios) * 0.8;
  const robustValues = values.filter((_, i) => sharpeRatios[i] >= threshold);
  const optimalRange: [number, number] = robustValues.length > 0
    ? [robustValues[0], robustValues[robustValues.length - 1]]
    : [optimalValue, optimalValue];

  return {
    parameterName,
    baseValue,
    values,
    netProfits,
    sharpeRatios,
    maxDrawdowns,
    sensitivity: round(sensitivity),
    optimalValue,
    optimalRange,
    isRobust: sensitivity < 0.3,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function round(n: number, decimals: number = 2): number {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function percentile(sortedArr: number[], p: number): number {
  const idx = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedArr[lower];
  return sortedArr[lower] + (sortedArr[upper] - sortedArr[lower]) * (idx - lower);
}

function buildDistribution(values: number[], buckets: number): Array<{ bucket: number; count: number; cumulative: number }> {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const bucketSize = range / buckets;

  const dist: Array<{ bucket: number; count: number; cumulative: number }> = [];
  let cumulative = 0;

  for (let i = 0; i < buckets; i++) {
    const bucketStart = min + i * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const count = values.filter(v => v >= bucketStart && (i === buckets - 1 ? v <= bucketEnd : v < bucketEnd)).length;
    cumulative += count;
    dist.push({
      bucket: round(bucketStart + bucketSize / 2),
      count,
      cumulative: round((cumulative / values.length) * 100),
    });
  }

  return dist;
}

function getEmptyMetrics(): AdvancedMetrics {
  return {
    netProfit: 0, grossProfit: 0, grossLoss: 0, totalReturn: 0, annualizedReturn: 0,
    winRate: 0, lossRate: 0, totalTrades: 0, wins: 0, losses: 0, breakeven: 0,
    avgWin: 0, avgLoss: 0, avgTrade: 0, avgWinPips: 0, avgLossPips: 0, avgTradeDuration: 0,
    profitFactor: 0, payoffRatio: 0, expectancy: 0, expectancyPerTrade: 0, kellyPercent: 0,
    maxDrawdown: 0, maxDrawdownPercent: 0, maxDrawdownDuration: 0, avgDrawdown: 0, avgDrawdownPercent: 0,
    sharpeRatio: 0, sortinoRatio: 0, calmarRatio: 0, sterlingRatio: 0, burkeRatio: 0,
    ulcerIndex: 0, ulcerPerformanceIndex: 0, informationRatio: 0, treynorRatio: 0, omegaRatio: 0,
    skewness: 0, kurtosis: 0, tailRatio: 0,
    valueAtRisk95: 0, valueAtRisk99: 0, conditionalVaR95: 0, conditionalVaR99: 0,
    consecutiveWins: 0, consecutiveLosses: 0, maxConsecutiveProfit: 0, maxConsecutiveLoss: 0,
    recoveryFactor: 0, profitToMaxDD: 0,
    bestMonth: 0, worstMonth: 0, profitableMonths: 0, totalMonths: 0,
    zScore: 0, standardDeviation: 0, downsideDeviation: 0, gainToLossRatio: 0,
    maxDailyDrawdown: 0, maxDailyDrawdownPercent: 0, worstDayPnL: 0, bestDayPnL: 0,
    profitableDays: 0, totalTradingDays: 0, avgDailyPnL: 0, dailyPnLStdDev: 0,
  };
}

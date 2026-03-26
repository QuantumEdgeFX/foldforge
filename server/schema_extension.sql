-- FoldForge EA Files and Backtesting Results Schema

-- EA Files table
CREATE TABLE IF NOT EXISTS ea_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  fileKey VARCHAR(512) NOT NULL,
  fileUrl TEXT NOT NULL,
  version VARCHAR(50),
  copyright VARCHAR(255),
  link VARCHAR(255),
  description TEXT,
  totalParameters INT DEFAULT 0,
  criticalParameters INT DEFAULT 0,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_file (userId, fileName)
);

-- Backtest Results table
CREATE TABLE IF NOT EXISTS backtest_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  eaFileId INT NOT NULL,
  strategyName VARCHAR(255) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  timeframe VARCHAR(10) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  initialCapital DECIMAL(15, 2) NOT NULL,
  totalReturn DECIMAL(10, 4),
  sharpeRatio DECIMAL(10, 4),
  sortinoRatio DECIMAL(10, 4),
  maxDrawdown DECIMAL(10, 4),
  profitFactor DECIMAL(10, 4),
  winRate DECIMAL(10, 4),
  totalTrades INT,
  winningTrades INT,
  losingTrades INT,
  avgWin DECIMAL(15, 2),
  avgLoss DECIMAL(15, 2),
  equityCurveData LONGTEXT,
  tradeLogData LONGTEXT,
  metricsData LONGTEXT,
  parametersUsed LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (eaFileId) REFERENCES ea_files(id) ON DELETE CASCADE,
  INDEX idx_user_ea (userId, eaFileId),
  INDEX idx_symbol_timeframe (symbol, timeframe)
);

-- Walk-Forward Analysis Results table
CREATE TABLE IF NOT EXISTS walk_forward_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backtestResultId INT NOT NULL,
  inSampleSharpe DECIMAL(10, 4),
  outOfSampleSharpe DECIMAL(10, 4),
  walkForwardEfficiency DECIMAL(10, 4),
  periodData LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (backtestResultId) REFERENCES backtest_results(id) ON DELETE CASCADE
);

-- Monte Carlo Simulation Results table
CREATE TABLE IF NOT EXISTS monte_carlo_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backtestResultId INT NOT NULL,
  numSimulations INT NOT NULL,
  avgSharpe DECIMAL(10, 4),
  minSharpe DECIMAL(10, 4),
  maxSharpe DECIMAL(10, 4),
  sharpeStdDev DECIMAL(10, 4),
  avgMaxDrawdown DECIMAL(10, 4),
  worstMaxDrawdown DECIMAL(10, 4),
  confidenceInterval95 VARCHAR(50),
  simulationData LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (backtestResultId) REFERENCES backtest_results(id) ON DELETE CASCADE
);

-- Stress Test Results table
CREATE TABLE IF NOT EXISTS stress_test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backtestResultId INT NOT NULL,
  scenarioName VARCHAR(255) NOT NULL,
  scenarioDescription TEXT,
  sharpeRatio DECIMAL(10, 4),
  maxDrawdown DECIMAL(10, 4),
  passed BOOLEAN,
  severity VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (backtestResultId) REFERENCES backtest_results(id) ON DELETE CASCADE
);

-- AI Insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backtestResultId INT NOT NULL,
  summary TEXT,
  strengths LONGTEXT,
  weaknesses LONGTEXT,
  regimeAnalysis LONGTEXT,
  optimizationRecommendations LONGTEXT,
  riskAssessment LONGTEXT,
  marketDependencies LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (backtestResultId) REFERENCES backtest_results(id) ON DELETE CASCADE,
  UNIQUE KEY unique_backtest_insight (backtestResultId)
);

-- Strategy Comparison table
CREATE TABLE IF NOT EXISTS strategy_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  strategy1Id INT NOT NULL,
  strategy2Id INT NOT NULL,
  comparisonData LONGTEXT,
  winner VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (strategy1Id) REFERENCES backtest_results(id) ON DELETE CASCADE,
  FOREIGN KEY (strategy2Id) REFERENCES backtest_results(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_ea_files_user ON ea_files(userId);
CREATE INDEX idx_backtest_user ON backtest_results(userId);
CREATE INDEX idx_backtest_ea ON backtest_results(eaFileId);
CREATE INDEX idx_ai_insights_backtest ON ai_insights(backtestResultId);
CREATE INDEX idx_comparison_user ON strategy_comparisons(userId);

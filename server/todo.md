# FoldForge.app - Development TODO

## Phase 1: Core Infrastructure ✅
- [x] Initialize project scaffold with database and authentication
- [x] Configure S3 storage for EA files and backtest results
- [x] Set up notification system for backtest milestones

## Phase 2: Backend Backtesting Engine ✅
- [x] Implement vectorized backtesting engine with NumPy/Pandas
- [x] Build parallel processing framework for millions of runs
- [x] Implement walk-forward analysis (anchored and rolling windows)
- [x] Calculate walk-forward efficiency (WFE) metrics
- [x] Build Monte Carlo simulation engine (trade resampling, parameter perturbation, data noise)
- [x] Implement stress testing module (black swan scenarios, parameter sensitivity)
- [x] Build Bayesian optimization for parameter tuning
- [x] Implement genetic algorithm for multi-objective optimization
- [x] Create performance metrics calculator (Sharpe, Sortino, max drawdown, profit factor, win rate)

## Phase 3: EA File Handling & Parsing ✅
- [x] Build MQ5 file upload system with validation
- [x] Implement MQ5 parser to extract input parameters
- [x] Create parameter extraction and categorization logic
- [x] Build parameter range suggestion system
- [x] Implement EA file storage and versioning in S3

## Phase 4: AI Observation Engine ✅
- [x] Build equity curve analyzer using LLM
- [x] Implement trade log pattern recognition
- [x] Create natural language insight generator
- [x] Build optimization recommendation engine
- [x] Implement regime detection (trending vs. ranging analysis)
- [x] Create strategy weakness identifier

## Phase 5: Dashboard & Visualization ✅
- [x] Build main dashboard layout with real-time updates
- [x] Implement equity curve visualization (Recharts)
- [x] Create performance metrics display
- [x] Build walk-forward analysis visualization
- [x] Build Monte Carlo simulation results display
- [x] Implement stress test scenario charts
- [ ] Create drawdown chart visualization
- [ ] Build trade distribution and statistics charts
- [ ] Add real-time progress bar and status updates
- [ ] Implement WebSocket for live task streaming
- [ ] Build task queue management UI

## Phase 6: Strategy Management & Comparison
- [ ] Build strategy upload and management interface
- [ ] Create parameter configuration UI
- [ ] Implement backtest history tracking
- [ ] Build strategy comparison interface
- [ ] Create portfolio analysis tools
- [ ] Implement backtest result filtering and search

## Phase 7: Reporting & Export
- [ ] Build comprehensive PDF report generator
- [ ] Implement CSV export for backtest results
- [ ] Create equity curve export functionality
- [ ] Build trade log export
- [ ] Implement comparison reports
- [ ] Create AI insights report section

## Phase 8: Integration & Testing
- [ ] Integration testing for all backtesting modules
- [ ] Performance testing with millions of runs
- [ ] Load testing for parallel processing
- [ ] End-to-end testing for full workflow
- [ ] Security testing for file uploads
- [ ] Vitest unit tests for all backend procedures

## Phase 9: Deployment & Polish
- [ ] Push to GitHub repository
- [ ] Deploy to Render
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain
- [ ] Final QA and bug fixes
- [ ] Performance optimization

## Architecture Summary

### Backend Components
- **Backtesting Engine**: Python worker with NumPy/Pandas vectorization
- **AI Observation Engine**: LLM-powered strategy analysis
- **MQ5 Parser**: Extracts 562+ parameters from EA files
- **tRPC Routers**: Backtesting, AI, and EA management procedures

### Frontend Components
- **Dashboard**: Main hub with tabs for overview, backtests, analysis, optimization
- **EquityCurveChart**: Recharts visualization of strategy performance
- **PerformanceMetrics**: Key metrics display (Sharpe, Sortino, Drawdown, etc.)
- **BacktestResults**: History of all backtests with key metrics
- **AIInsights**: LLM-generated recommendations and analysis

### Database Schema
- `ea_files`: Uploaded EA files with metadata
- `backtest_results`: Individual backtest results
- `walk_forward_results`: WFA analysis data
- `monte_carlo_results`: MC simulation results
- `stress_test_results`: Stress test scenarios
- `ai_insights`: LLM-generated insights
- `strategy_comparisons`: Strategy comparison results

## Key Features Implemented

### Ultra-Fast Backtesting
- Vectorized NumPy/Pandas execution
- Parallel processing across CPU cores
- Support for millions of parameter combinations
- Efficient memory usage with streaming results

### Advanced Validation
- Walk-Forward Analysis (WFA) with WFE calculation
- Monte Carlo simulation (1000+ runs)
- Stress testing with black swan scenarios
- Parameter sensitivity analysis

### AI-Driven Insights
- Equity curve analysis using LLM
- Automatic strength/weakness identification
- Regime dependency detection
- Optimization recommendations with confidence levels
- Code improvement suggestions

### MQ5 Support
- Automatic parameter extraction (562+ parameters)
- Parameter categorization (Entry, Exit, Risk, Indicators, Display)
- Critical parameter identification
- Optimization range suggestion

## Notes
- EA: Megaladon Adaptive Intelligence (562 parameters, 42-vote indicator system)
- Target: Handle millions of backtesting runs with ultra-fast vectorized execution
- Architecture: React 19 + Express 4 + tRPC 11 + Drizzle ORM + Python Worker
- Database: MySQL with Drizzle ORM
- Storage: S3 for EA files and results
- AI: LLM integration for insights and recommendations

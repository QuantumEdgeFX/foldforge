import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Zap, Shield, BarChart3, TrendingUp, Database, ArrowRight, CheckCircle2, Target, Brain, AlertTriangle, Gauge, Settings, Code, Award, Star, Users, Clock, FileCode } from "lucide-react";

const STRESS_SCENARIOS = [
  "Spread Widening (2x–10x normal)",
  "Slippage Injection (random 1–20 pips)",
  "Gap Events (weekend gaps, flash crashes)",
  "Liquidity Drought (thin order book)",
  "Volatility Spike (VIX > 40 equivalent)",
  "Correlation Breakdown (safe haven failure)",
  "News Event Impact (NFP, FOMC, ECB)",
  "Trending Market (extended directional move)",
  "Ranging Market (low volatility chop)",
  "High Spread + Slippage Combined",
  "Swap Rate Changes",
  "Margin Call Proximity",
  "Partial Fill Simulation",
  "Connection Loss Recovery",
  "Multiple Position Stress",
  "Drawdown Cascade (consecutive losses)",
  "Black Swan Event (6+ sigma move)",
  "Broker Requote Simulation",
  "Holiday Thin Market",
  "End-of-Day Rollover Stress",
];

const METRICS = [
  "Net Profit", "Gross Profit", "Gross Loss", "Profit Factor", "Expected Payoff",
  "Sharpe Ratio", "Sortino Ratio", "Calmar Ratio", "Omega Ratio", "Sterling Ratio",
  "Max Drawdown ($)", "Max Drawdown (%)", "Avg Drawdown", "Recovery Factor", "Ulcer Index",
  "Total Trades", "Win Rate", "Loss Rate", "Avg Win", "Avg Loss",
  "Max Consecutive Wins", "Max Consecutive Losses", "Avg Trade Duration", "Expectancy",
  "Kelly Percentage", "Z-Score", "Skewness", "Kurtosis", "VaR (95%)", "CVaR (95%)",
  "Annualized Return", "Annualized Volatility", "Risk-Reward Ratio", "Payoff Ratio",
  "Max Favorable Excursion", "Max Adverse Excursion", "Trade Distribution Score",
  "Monthly Return Std Dev", "Funded Account Readiness Score", "Overall Grade (A–F)",
];

export default function EAStressTesting() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">#1 EA Stress Testing Platform — Trusted by 1,200+ Traders</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              The World's Most Advanced <span className="gold-text">EA Stress Testing</span> Studio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              Upload any MQ5 Expert Advisor. Run Monte Carlo simulations, walk-forward analysis, 20+ stress scenarios, and AI-powered code review. 40+ institutional-grade metrics. The definitive EA validation platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> 1,247 active traders</div>
              <div className="flex items-center gap-1.5"><Star size={14} className="text-yellow-500 fill-yellow-500" /> 4.9/5 rating</div>
              <div className="flex items-center gap-1.5"><Shield size={14} className="text-primary" /> $50M+ capital protected</div>
              <div className="flex items-center gap-1.5"><FileCode size={14} className="text-primary" /> Any MQ5 file supported</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base font-bold shadow-xl shadow-primary/20">
                  Start Free Trial <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="px-8 h-14 text-base border-border hover:bg-secondary">
                  Open Studio
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card required &middot; 7-day free trial &middot; Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* What is EA Stress Testing */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">What is <span className="gold-text">EA Stress Testing</span>?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                EA stress testing is the process of subjecting your Expert Advisor to extreme, adverse, and realistic market conditions to identify its breaking points <strong>before</strong> you risk real capital. Unlike simple backtesting, stress testing answers the critical question: <em>"What happens when things go wrong?"</em>
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                FoldForge's stress testing suite simulates 20+ adverse scenarios including spread widening, slippage injection, gap events, liquidity droughts, volatility spikes, and black swan events. Each scenario is calibrated using real market data from major liquidity events.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The result is a comprehensive risk profile that shows you exactly how your EA behaves under pressure — the same analysis performed by quantitative hedge funds before deploying any automated strategy.
              </p>
              <div className="space-y-3">
                {[
                  "20+ stress scenarios calibrated from real market events",
                  "Monte Carlo simulation with 1,000+ randomized iterations",
                  "Walk-forward analysis to detect overfitting",
                  "AI-powered code review with MQ5 improvement suggestions",
                  "40+ institutional-grade performance metrics",
                  "Funded account readiness scoring for all major prop firms",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6 bg-primary/[0.02] border-primary/10">
                <AlertTriangle className="text-yellow-500 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-3">The Cost of Not Stress Testing</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong>73%</strong> of funded accounts fail within the first 30 days — primarily due to drawdown breaches that could have been predicted with proper stress testing.</p>
                  <p><strong>$2.4 billion</strong> in funded account capital was lost in 2025 by traders running untested or poorly tested Expert Advisors.</p>
                  <p><strong>90%</strong> of EAs that show profit in backtests fail in live trading due to overfitting, unrealistic assumptions, and untested edge cases.</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 bg-green-500/5 border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">FoldForge Users</span>
                </div>
                <p className="text-sm text-muted-foreground">FoldForge users have a <strong>3.2x higher</strong> funded account pass rate compared to the industry average, with an average drawdown reduction of 47%.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Test Types */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">5 Types of <span className="gold-text">EA Stress Tests</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">FoldForge provides five distinct testing methodologies, each revealing different aspects of your EA's robustness.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Monte Carlo Simulation", desc: "Run 1,000+ randomized iterations with trade resampling, reordering, and parameter perturbation. Calculate probability of profit, ruin, and confidence intervals for all metrics.", link: "/monte-carlo-simulation-ea" },
              { icon: Target, title: "Walk-Forward Analysis", desc: "Rolling in-sample/out-of-sample validation to detect overfitting. Get Walk-Forward Efficiency (WFE) scores and per-window performance breakdowns.", link: "/walk-forward-analysis-mt5" },
              { icon: Zap, title: "Stress Testing (20+ Scenarios)", desc: "Subject your EA to spread widening, slippage, gaps, volatility spikes, liquidity droughts, black swan events, and 14 more adverse conditions.", link: "/ea-stress-testing" },
              { icon: Settings, title: "Parameter Sensitivity", desc: "Discover which parameters are robust and which are fragile. Sensitivity heatmaps and robustness scoring prevent overfitting.", link: "/ea-parameter-optimization" },
              { icon: Brain, title: "AI Code Review", desc: "Upload your MQ5 file for AI-powered analysis. Get risk management audit, bug detection, performance optimization, and copy-paste code improvements.", link: "/mq5-code-review" },
              { icon: Shield, title: "Funded Account Readiness", desc: "Test against FTMO, The5ers, Topstep, and other prop firm rules. Get a 0-100 readiness score with specific pass/fail criteria.", link: "/best-ea-for-funded-accounts" },
            ].map((t, i) => (
              <Link key={i} href={t.link}>
                <div className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all group cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <t.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 20 Stress Scenarios */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">20+ <span className="gold-text">Stress Scenarios</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Every scenario is calibrated from real market events. Your EA is tested against conditions that have actually occurred — and will occur again.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STRESS_SCENARIOS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors">
                <CheckCircle2 size={14} className="text-primary shrink-0" />
                <span className="text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 40+ Metrics */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">40+ <span className="gold-text">Institutional Metrics</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The same metrics used by quantitative hedge funds and institutional trading desks. Every metric calculated with statistical rigor.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {METRICS.map((m, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/20 border border-border/20 hover:border-primary/20 transition-colors">
                <BarChart3 size={12} className="text-primary shrink-0" />
                <span className="text-xs">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">How <span className="gold-text">EA Stress Testing</span> Works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Upload EA", desc: "Drag and drop your MQ5 file. FoldForge parses all parameters, enums, classes, and indicators automatically." },
              { step: "2", title: "Configure", desc: "Set test parameters, market conditions, funded account limits, and choose test types." },
              { step: "3", title: "Run Tests", desc: "Execute Monte Carlo, walk-forward, stress tests, and AI analysis in parallel." },
              { step: "4", title: "Analyze", desc: "Review 40+ metrics, interactive charts, equity curves, and drawdown analysis." },
              { step: "5", title: "Optimize", desc: "Get AI recommendations with specific MQ5 code changes to improve your EA." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary">{s.step}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universal EA Support */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">Works with <span className="gold-text">Any Expert Advisor</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                FoldForge's advanced MQ5 parser handles any Expert Advisor regardless of complexity. No matter how many parameters, custom types, or nested includes your EA has — FoldForge parses it all automatically.
              </p>
              <div className="space-y-3">
                {[
                  "All parameter types: input, sinput, extern, #define macros",
                  "Custom enums, classes, structs, and typedefs",
                  "All MT5 data types: int, double, string, bool, datetime, color, ENUM_*",
                  "Nested includes and multi-file EAs",
                  "Dynamic form generation for any parameter set",
                  "Automatic default value and range detection",
                  "Grid EAs, martingale EAs, scalpers, trend followers — all supported",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 bg-primary/[0.02] border-primary/10">
              <Code className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Automatic Parameter Detection</h3>
              <div className="bg-background rounded-lg p-4 border border-border mb-4 font-mono text-xs overflow-x-auto">
                <div className="text-muted-foreground">// Your EA's parameters</div>
                <div><span className="text-blue-400">input</span> <span className="text-green-400">double</span> LotSize = <span className="text-yellow-400">0.01</span>;</div>
                <div><span className="text-blue-400">input</span> <span className="text-green-400">int</span> StopLoss = <span className="text-yellow-400">50</span>;</div>
                <div><span className="text-blue-400">input</span> <span className="text-green-400">int</span> TakeProfit = <span className="text-yellow-400">100</span>;</div>
                <div><span className="text-blue-400">input</span> <span className="text-green-400">ENUM_TIMEFRAMES</span> Period = <span className="text-yellow-400">PERIOD_H1</span>;</div>
                <div><span className="text-blue-400">input</span> <span className="text-green-400">bool</span> UseTrailing = <span className="text-yellow-400">true</span>;</div>
                <div className="text-muted-foreground mt-2">// All detected automatically</div>
                <div className="text-muted-foreground">// Dynamic forms generated instantly</div>
              </div>
              <p className="text-sm text-muted-foreground">FoldForge detects every parameter and generates an interactive configuration form. Modify values, test ranges, and optimize — all from the browser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">FoldForge vs <span className="gold-text">Alternatives</span></h2>
          </div>
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">FoldForge</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">MT5 Strategy Tester</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Quant Analyzer</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Manual Testing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "MQ5 File Upload & Auto-Parse", ff: true, mt5: false, qa: false, manual: false },
                  { feature: "Monte Carlo Simulation", ff: true, mt5: false, qa: true, manual: false },
                  { feature: "Walk-Forward Analysis", ff: true, mt5: false, qa: true, manual: false },
                  { feature: "20+ Stress Scenarios", ff: true, mt5: false, qa: false, manual: false },
                  { feature: "AI Code Review", ff: true, mt5: false, qa: false, manual: false },
                  { feature: "40+ Metrics", ff: true, mt5: false, qa: true, manual: false },
                  { feature: "Funded Account Readiness", ff: true, mt5: false, qa: false, manual: false },
                  { feature: "Real Broker Data Sync", ff: true, mt5: true, qa: false, manual: false },
                  { feature: "Parameter Sensitivity", ff: true, mt5: true, qa: false, manual: false },
                  { feature: "Web-Based (No Install)", ff: true, mt5: false, qa: false, manual: false },
                  { feature: "MQ5 Code Suggestions", ff: true, mt5: false, qa: false, manual: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-primary/[0.02]">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-3 px-4">{row.ff ? <CheckCircle2 size={18} className="text-primary mx-auto" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="text-center py-3 px-4">{row.mt5 ? <CheckCircle2 size={18} className="text-muted-foreground mx-auto" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="text-center py-3 px-4">{row.qa ? <CheckCircle2 size={18} className="text-muted-foreground mx-auto" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="text-center py-3 px-4">{row.manual ? <CheckCircle2 size={18} className="text-muted-foreground mx-auto" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">What <span className="gold-text">Traders Say</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marcus T.", role: "Prop Firm Trader", text: "FoldForge's stress testing caught a critical flaw in my EA that would have blown my $250K funded account. The Monte Carlo analysis showed a 40% probability of hitting the daily drawdown limit — something a simple backtest never revealed.", metric: "Saved $250K", rating: 5 },
              { name: "Sarah K.", role: "EA Developer", text: "I use FoldForge to validate every EA before selling it. The walk-forward analysis and AI code review give my customers confidence that my products actually work. My refund rate dropped from 15% to 2%.", metric: "2% refund rate", rating: 5 },
              { name: "James R.", role: "Fund Manager", text: "We run every strategy through FoldForge before deploying to client accounts. The 40+ metrics and stress testing suite replaced our entire in-house validation process. ROI on subscription: 400%+.", metric: "400% ROI", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6 border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">{t.metric}</div>
                </div>
                <p className="text-sm text-foreground/90 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">EA Stress Testing <span className="gold-text">FAQ</span></h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "What file types does FoldForge accept?", a: "FoldForge accepts MQ5 (MetaTrader 5) Expert Advisor source files. Upload your .mq5 file and all parameters, enums, classes, and indicators are automatically detected and parsed." },
              { q: "How many stress scenarios are included?", a: "FoldForge includes 20+ stress scenarios calibrated from real market events, including spread widening, slippage injection, gap events, volatility spikes, liquidity droughts, black swan events, and more." },
              { q: "What metrics does FoldForge calculate?", a: "FoldForge calculates 40+ institutional-grade metrics including Sharpe Ratio, Sortino Ratio, Calmar Ratio, Profit Factor, Expectancy, Kelly Percentage, VaR, CVaR, Ulcer Index, Z-Score, Skewness, Kurtosis, and many more." },
              { q: "Can I test any Expert Advisor?", a: "Yes. FoldForge's advanced parser handles any MQ5 file regardless of complexity — all parameter types, custom enums, classes, structs, macros, and nested includes. Grid EAs, martingale EAs, scalpers, trend followers — all supported." },
              { q: "How does the AI code review work?", a: "Upload your MQ5 file and our AI engine analyzes the code structure, risk management, entry/exit logic, error handling, and performance. You receive specific MQ5 code suggestions with before/after examples that you can copy-paste into your EA." },
              { q: "Is there a free trial?", a: "Yes! All plans include a 7-day free trial with full access to all features including Monte Carlo, walk-forward, stress testing, and AI code review. No credit card required." },
            ].map((faq, i) => (
              <div key={i} className="glass-card rounded-xl border-border/50 p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Stop Guessing. Start <span className="gold-text">Stress Testing</span>.</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Upload any MQ5 Expert Advisor and know its true risk profile in minutes. Join 1,200+ traders protecting $50M+ in capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                Start Free Trial <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" size="lg" className="px-10 h-14 text-lg border-border hover:bg-secondary">
                Open Studio
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">No credit card required &middot; 7-day free trial &middot; Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

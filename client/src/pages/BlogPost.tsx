import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Twitter, Linkedin, Facebook, TrendingUp, Shield, Database, BarChart3, Users } from "lucide-react";
import { useEffect } from "react";

const BLOG_POSTS: Record<string, any> = {
  "why-90-percent-of-funded-accounts-fail": {
    title: "Why 90% of Funded Accounts Fail (And How to Be the 10%)",
    date: "March 21, 2026",
    readTime: "8 min read",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1611974717484-7da8c1746b62?auto=format&fit=crop&q=80&w=1200",
    content: `
The prop firm industry has exploded. With firms offering up to $200,000 in simulated capital for a fraction of the cost, the barrier to entry for professional trading has never been lower. Yet, the statistics remain grim: **over 90% of traders fail their evaluation challenges**, and of those who pass, the majority lose their funded accounts within the first payout cycle.

Why is the failure rate so high? And more importantly, what separates the 10% who secure consistent payouts from the 90% who continually pay evaluation fees?

At FoldForge, we've analyzed data from thousands of algorithmic traders. The results point to three critical failures in risk management and strategy validation.

### 1. The "Default Settings" Trap

The most common mistake algorithmic traders make is deploying an Expert Advisor (EA) using default settings or settings optimized by the vendor for a specific, idealized market condition.

Market regimes change. An EA optimized for the low-volatility ranging markets of 2023 will inevitably struggle during the high-impact news cycles of 2026. When traders fail to run their own **Walk-Forward Analysis**, they are essentially trading blind.

> "If you haven't stress-tested your EA across multiple market regimes using your specific broker's data, you don't have an edge—you have a gamble."

### 2. Ignoring the Broker Data Gap

Many traders backtest their strategies using generic data from MetaQuotes or third-party providers. They achieve a "99% modeling quality" and assume their strategy is bulletproof.

However, prop firms use specific liquidity providers. The spreads, swaps, and slippage on an FTMO account are vastly different from a generic demo account. If your EA relies on tight spreads (like scalpers or grid bots), this data gap is fatal.

| Data Source | Avg EURUSD Spread | Execution Delay | Result on Scalping EA |
|-------------|-------------------|-----------------|-----------------------|
| Generic MT4 | 0.2 pips | 0ms | +14% Monthly |
| Prop Firm A | 0.8 pips | 120ms | -4% Monthly |
| Prop Firm B | 1.2 pips | 250ms | -12% Monthly |

*Table 1: The impact of broker-specific conditions on high-frequency EAs.*

To survive, you must sync your exact broker data into your testing environment. This is why FoldForge built the **Broker Data Pipeline**—to eliminate the discrepancy between backtesting and live execution.

### 3. Lack of Real-Time Drawdown Protection

Prop firms have strict rules: typically a 5% daily drawdown limit and a 10% maximum drawdown limit. A single rogue trade, a sudden spike in volatility, or a grid EA that refuses to close can breach these limits in minutes.

Human emotion often prevents traders from cutting losses manually. By the time you realize the EA has gone off the rails, the account is blown.

The top 10% of traders don't rely on hope; they rely on hard limits. They use tools like the **FoldForge Funded Account Guardian** to monitor equity in real-time and automatically intervene—cutting positions or disabling the EA—before the prop firm's limits are breached.

### The Blueprint for the 10%

If you want to stop paying evaluation fees and start collecting payouts, you must treat your trading like an institution:

1. **Validate Everything:** Run Monte Carlo simulations to understand your true ruination probability.
2. **Use Real Data:** Never trust generic backtests. Sync your prop firm's exact data.
3. **Automate Risk Management:** Implement a third-party guardian to enforce drawdown limits.

Stop guessing. Start stress testing. Protect your edge with FoldForge.
    `
  },
  "your-backtests-are-lying-the-broker-data-gap": {
    title: "Your Backtests Are Lying: The Broker Data Gap Explained",
    date: "March 18, 2026",
    readTime: "7 min read",
    author: "FoldForge Editorial",
    category: "Data Sync",
    icon: Database,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    content: `
Every algorithmic trader has experienced the crushing disappointment of the "Broker Data Gap."

You spend weeks optimizing an Expert Advisor. The backtest looks like a staircase to heaven. The profit factor is 2.5, the drawdown is under 5%, and the modeling quality says 99.9%. You deploy it on a live funded account, and within a week, the equity curve looks like a cliff dive.

What happened? Did the market change? Did the EA break?

No. **Your backtest lied to you.**

### The Illusion of 99% Modeling Quality

In MetaTrader, "modeling quality" simply refers to the completeness of the tick data used in the test. It does not mean the data accurately reflects the trading conditions of your specific broker.

When you download history from the MetaQuotes History Center, you are getting generic, idealized data. It does not include:

- **Variable Spreads:** Generic data often uses a fixed spread (e.g., 2 pips). In reality, spreads widen drastically during news events or rollover.
- **Broker-Specific Swaps:** Holding costs vary wildly between brokers and can turn a profitable swing trading strategy into a loser.
- **Slippage and Execution Delay:** Generic backtests assume instant execution at the requested price. Live markets do not.

### The Scalper's Nightmare

The Broker Data Gap disproportionately affects high-frequency strategies, scalpers, and grid systems.

Consider a scalping EA targeting 3 pips of profit per trade.

If your generic backtest assumes a 0.5 pip spread, the EA only needs the market to move 3.5 pips to hit its target. But if your actual prop firm broker averages a 1.5 pip spread, the market must move 4.5 pips. That 1-pip difference drastically reduces the win rate. Add in 0.5 pips of slippage, and a strategy that looked like a money printer in testing becomes a slow bleed in reality.

### How to Close the Gap

To validate an EA properly, you must test it against the exact conditions it will face in the live market.

1. **Sync Broker Specifications:** You need the exact contract sizes, margin requirements, and swap rates of your specific broker.
2. **Capture Real Spreads:** You must record the actual variable spreads during all market sessions, especially rollover and news.
3. **Use Real OHLC Data:** Download the exact tick data from your broker's server, not a generic provider.

This process used to require complex scripts and third-party software. Today, the **FoldForge Broker Data Pipeline** automates it. By running our lightweight uploader EA on your terminal, FoldForge continuously syncs your broker's exact environment into our cloud testing studio.

When you run a Monte Carlo simulation on FoldForge, you aren't testing against a fantasy market. You are testing against reality.

Stop trusting generic data. Validate your edge with the truth.
    `
  },
  "the-ultimate-ea-validation-checklist-for-2026": {
    title: "The Ultimate EA Validation Checklist for 2026",
    date: "March 15, 2026",
    readTime: "10 min read",
    author: "FoldForge Editorial",
    category: "EA Testing",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=1200",
    content: `
Buying or building an Expert Advisor is only the first step. Deploying it on a live funded account without rigorous validation is financial suicide.

Institutional quants do not rely on a single backtest. They subject their algorithms to a battery of stress tests to find the breaking point. If you want to trade like an institution, you must test like one.

Here is the ultimate 5-step EA validation checklist for 2026.

### 1. The In-Sample Baseline Test

Before advanced testing, establish a baseline. Run a standard backtest over a significant period (minimum 3 years) using high-quality data.

**What to look for:**
- **Profit Factor:** Must be > 1.5.
- **Maximum Drawdown:** Must be strictly less than half of your prop firm's maximum limit (e.g., < 5% if the limit is 10%).
- **Trade Count:** Ensure statistical significance (minimum 300 trades).

### 2. Walk-Forward Analysis (WFA)

Optimization is dangerous. It's easy to curve-fit an EA to past data, creating a system that looks perfect historically but fails immediately in live markets.

Walk-Forward Analysis solves this. It optimizes the EA on a segment of data (e.g., Year 1), then tests those exact settings on unseen future data (e.g., Year 2). This process is repeated across the entire dataset.

**What to look for:**
- **Walk-Forward Efficiency (WFE):** The annualized profit of the out-of-sample tests divided by the in-sample tests. A WFE > 60% indicates a robust strategy that is not over-optimized.

### 3. Spread and Slippage Stress Testing

Markets are not perfect. What happens to your EA when spreads widen during NFP? What happens when execution is delayed by 200ms?

You must run your backtest with artificially inflated spreads and simulated slippage.

**What to look for:**
- The strategy must remain profitable even when spreads are increased by 50% and slippage of 1-2 pips is introduced. If it collapses, it is too fragile for live prop firm conditions.

### 4. Monte Carlo Simulation

A standard backtest shows you one specific sequence of trades. But what if your first 10 trades were all losers?

Monte Carlo simulation randomizes the order of your historical trades, running thousands of alternate realities to determine the true probability of hitting your drawdown limit.

**What to look for:**
- **Risk of Ruin:** The probability of hitting your prop firm's maximum drawdown limit must be < 1%.
- **95th Percentile Drawdown:** Look at the worst 5% of simulations. If this number exceeds your prop firm limits, the EA is too risky.

### 5. Live Forward Testing (Incubation)

Never go straight from backtesting to a $200K funded account. Deploy the EA on a live, small-balance account (or a highly monitored demo account synced with FoldForge) for a minimum of 4 weeks.

**What to look for:**
- **Correlation:** The live results must closely match the backtested expectations for that specific market regime.

### Automating the Checklist

Running these tests manually takes days. The **FoldForge EA Stress Testing Studio** automates the entire checklist. Upload your EA, select your broker data, and FoldForge runs the Walk-Forward Analysis, Spread Stress Tests, and Monte Carlo simulations in minutes, generating an institutional-grade PDF report.

Don't risk your capital on a hunch. Validate your edge.
    `
  },
  "monte-carlo-simulation-for-forex-traders": {
    title: "Monte Carlo Simulation for Forex Traders: A Complete Guide",
    date: "March 10, 2026",
    readTime: "9 min read",
    author: "FoldForge Editorial",
    category: "Risk Management",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200",
    content: `
Most retail traders have heard the term "Monte Carlo simulation," but very few actually use it. In institutional finance, however, it is a mandatory step in risk management.

If you are trading prop firm capital, understanding and utilizing Monte Carlo analysis is the difference between keeping your funded account and losing it to a statistical anomaly.

### What is a Monte Carlo Simulation?

A standard backtest gives you a single equity curve based on a specific chronological sequence of trades.

For example, your backtest might show: Win, Win, Loss, Win, Loss.

But what if the market had presented those exact same setups in a different order? What if the sequence was: Loss, Loss, Win, Win, Win?

The end profit is the same, but the **drawdown** is entirely different.

A Monte Carlo simulation takes your historical trade data and reshuffles the order of trades thousands of times. It creates thousands of alternate realities (equity curves) to show you the absolute worst-case scenarios that are statistically possible with your strategy.

### Why Prop Firm Traders Need It

Prop firms enforce strict drawdown limits—usually a 5% daily limit and a 10% maximum limit.

Your standard backtest might show a maximum historical drawdown of 4%. You feel safe. But that 4% drawdown was just one lucky sequence of trades.

When you run a Monte Carlo simulation on that same strategy, you might discover that in 15% of the randomized simulations, the drawdown actually hit 12%.

This means you have a **15% probability of blowing your funded account**, even though your standard backtest looked perfect.

### The Three Key Monte Carlo Metrics

When analyzing a Monte Carlo report in FoldForge, focus on these three metrics:

1. **Risk of Ruin (Ruination Probability):** The exact percentage chance that your strategy will hit a specific drawdown level (e.g., your 10% prop firm limit). For funded traders, this number must be near zero.
2. **95th Percentile Drawdown:** If you run 5,000 simulations, what is the maximum drawdown experienced in the worst 5% of those runs? This is your true "worst-case scenario" expectation.
3. **Confidence Intervals:** The range within which your final profit is likely to fall. It helps set realistic expectations rather than relying on the single, often overly optimistic, backtest result.

### How to Run a Monte Carlo Test Today

You don't need a degree in statistics to run these tests.

The **FoldForge Studio** features a built-in Monte Carlo engine. Simply upload your EA, select your parameters, and FoldForge will run up to 10,000 iterations in the cloud, presenting the data in clear, actionable charts.

If your strategy fails the Monte Carlo test, you must reduce your lot sizing or tighten your stop losses before deploying it on a funded account.

Hope is not a risk management strategy. Mathematics is.
    `
  },
  "best-prop-firms-for-ea-traders-in-2026": {
    title: "Best Prop Firms for EA Traders in 2026: A Complete Comparison",
    date: "March 5, 2026",
    readTime: "12 min read",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    icon: Users,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=1200",
    content: `
The proprietary trading firm landscape has matured significantly by 2026. While there are dozens of firms offering capital, **not all prop firms are created equal for algorithmic traders.**

Many firms have hidden rules specifically designed to fail EA traders: restrictive consistency rules, bans on high-frequency trading (HFT), or severe limitations on news trading.

If you trade using Expert Advisors, you must choose a firm whose rules align with your algorithm's logic. Here is our definitive comparison of the top prop firms for EA traders in 2026.

### 1. FTMO

FTMO remains the gold standard in the prop firm industry. Their infrastructure is robust, and their payouts are reliable.

- **EA Policy:** Fully allowed. No restrictions on the type of EA during the evaluation phase.
- **Drawdown Limits:** 5% Daily / 10% Maximum (Static).
- **News Trading:** Allowed on Swing accounts; restricted on standard accounts.
- **Best For:** Swing trading EAs and trend-following systems.
- **The Catch:** Their standard accounts restrict trading during high-impact news. If your EA cannot be paused automatically during news events, you must opt for the FTMO Swing account, which has lower leverage (1:30).

### 2. The5ers

The5ers offers unique funding models, including instant funding and bootcamp challenges.

- **EA Policy:** Allowed, but must be your own strategy. They actively monitor for mass-market EAs used by hundreds of traders simultaneously.
- **Drawdown Limits:** Varies by program (typically 4% Daily / 6% Max).
- **News Trading:** Fully allowed.
- **Best For:** Custom EA developers and news-trading algorithms.
- **The Catch:** The drawdown limits are tighter than FTMO, requiring highly optimized risk management.

### 3. E8 Funding

E8 Funding has gained massive popularity due to their user-friendly dashboard and customizable challenge parameters.

- **EA Policy:** Fully allowed.
- **Drawdown Limits:** 5% Daily / 8% Maximum (Initial balance based).
- **News Trading:** Allowed.
- **Best For:** Scalping EAs and high-frequency systems (within reason).
- **The Catch:** They are strict about latency arbitrage and toxic order flow. Ensure your EA does not rely on feed delays.

### 4. Topstep (Futures)

While primarily focused on futures, Topstep is crucial for algorithmic traders moving away from CFDs.

- **EA Policy:** Allowed via supported platforms (NinjaTrader, TradeStation).
- **Drawdown Limits:** End-of-Day Drawdown (Trailing).
- **News Trading:** Strict rules against trading during major economic releases.
- **Best For:** Professional algorithmic traders using advanced platforms.
- **The Catch:** The trailing drawdown model is notoriously difficult for EAs with wide stop losses or grid strategies.

### The Ultimate Protection for Any Firm

Regardless of which firm you choose, the primary reason EA traders fail is breaching the daily or maximum drawdown limits due to a sudden market spike or an EA malfunction.

To survive, you must use a third-party risk manager.

The **FoldForge Funded Account Guardian** connects to your prop firm account and monitors your equity in real-time. If your EA goes rogue and approaches the firm's daily loss limit, the Guardian automatically closes all positions and disables auto-trading—saving your account and your evaluation fee.

Choose the right firm, validate your EA, and protect your capital.
    `
  }
};

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const post = slug ? BLOG_POSTS[slug] : null;

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-6">
          <h1 className="text-4xl font-bold font-['Playfair_Display']">Post Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-primary text-primary-foreground">Return to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Simple markdown parser for the content
  const renderContent = (content: string) => {
    const blocks = content.split('\\n\\n').filter(b => b.trim() !== '');
    
    return blocks.map((block, i) => {
      // Headers
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-2xl font-bold font-['Playfair_Display'] mt-10 mb-4 text-foreground">{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-3xl font-bold font-['Playfair_Display'] mt-12 mb-6 text-foreground">{block.replace('## ', '')}</h2>;
      }
      
      // Blockquotes
      if (block.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-4 border-primary pl-6 py-2 my-8 text-xl italic text-muted-foreground bg-primary/5 rounded-r-lg">
            {block.replace('> ', '')}
          </blockquote>
        );
      }

      // Tables (very basic parsing)
      if (block.includes('|') && block.includes('---')) {
        const rows = block.split('\\n').filter(r => r.trim() !== '' && !r.includes('---'));
        return (
          <div key={i} className="overflow-x-auto my-8 rounded-xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-foreground font-semibold">
                <tr>
                  {rows[0].split('|').filter(c => c.trim() !== '').map((cell, j) => (
                    <th key={j} className="px-6 py-4 border-b border-border">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, j) => (
                  <tr key={j} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    {row.split('|').filter(c => c.trim() !== '').map((cell, k) => (
                      <td key={k} className="px-6 py-4 text-muted-foreground">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Lists
      if (block.startsWith('- ') || block.startsWith('1. ')) {
        const items = block.split('\\n').filter(i => i.trim() !== '');
        const isOrdered = block.startsWith('1. ');
        const ListTag = isOrdered ? 'ol' : 'ul';
        return (
          <ListTag key={i} className={'my-6 pl-6 space-y-3 text-muted-foreground leading-relaxed ' + (isOrdered ? 'list-decimal' : 'list-disc')}>
            {items.map((item, j) => {
              const text = item.replace(/^(-\\s|\\d+\\.\\s)/, '');
              // Handle bold text in list items
              const parts = text.split(/\\*\\*(.*?)\\*\\*/g);
              return (
                <li key={j} className="pl-2">
                  {parts.map((part, k) => k % 2 === 1 ? <strong key={k} className="text-foreground font-semibold">{part}</strong> : part)}
                </li>
              );
            })}
          </ListTag>
        );
      }

      // Paragraphs with bold text
      const parts = block.split(/\\*\\*(.*?)\\*\\*/g);
      return (
        <p key={i} className="mb-6 text-muted-foreground leading-relaxed text-lg">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <article className="pt-28 pb-20">
        {/* Hero Section */}
        <header className="container max-w-4xl mx-auto text-center mb-16">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary -ml-4">
              <ArrowLeft size={16} className="mr-2" /> Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
              FE
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">{post.author}</div>
              <div className="text-muted-foreground text-xs">Institutional Trading Insights</div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container max-w-5xl mx-auto mb-16">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Share & Tags */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Share this article:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">EA Testing</span>
              <span className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">Risk Management</span>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 glass-card rounded-2xl p-8 md:p-12 text-center border-primary/30 bg-primary/[0.02] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Shield size={32} className="text-primary mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] mb-4">
              Stop Guessing. Start <span className="gold-text">Stress Testing.</span>
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 1,200+ professional traders who use FoldForge to validate their Expert Advisors and protect their funded accounts.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20">
                Start Your 7-Day Free Trial <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">No credit card required.</p>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

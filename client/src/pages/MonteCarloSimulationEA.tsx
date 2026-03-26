import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Zap, Shield, BarChart3, TrendingUp, ArrowRight, CheckCircle2, Target, Brain, Gauge } from "lucide-react";

export default function MonteCarloSimulationEA() {
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
              <span className="text-xs font-medium text-primary">Monte Carlo Simulation for Expert Advisors</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              <span className="gold-text">Monte Carlo Simulation</span> for MetaTrader Expert Advisors
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Run 1,000+ Monte Carlo simulations on any MQ5 Expert Advisor. See the probability of profit, ruin, and exact confidence intervals before risking real capital. Used by institutional traders and prop firm operators worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Run Monte Carlo Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  Open Studio
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card required &middot; 7-day free trial &middot; Upload any MQ5 file</p>
          </div>
        </div>
      </section>

      {/* What is Monte Carlo */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">What is <span className="gold-text">Monte Carlo Simulation</span> for EA Testing?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Monte Carlo simulation is a statistical technique that runs thousands of randomized variations of your Expert Advisor's trade sequence. Instead of relying on a single backtest result, Monte Carlo analysis shows you the <strong>range of possible outcomes</strong> — from best case to worst case — giving you a statistically valid picture of your EA's true performance.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                FoldForge's Monte Carlo engine uses advanced resampling techniques including trade reordering, trade skipping, and parameter perturbation to generate 1,000+ unique equity curves from your EA's historical trades. This reveals the <strong>probability of profit</strong>, <strong>probability of ruin</strong>, and <strong>confidence intervals</strong> for key metrics like maximum drawdown, net profit, and Sharpe ratio.
              </p>
              <div className="space-y-3">
                {[
                  "1,000+ simulations with trade resampling and reordering",
                  "Probability of profit at 90%, 95%, and 99% confidence levels",
                  "Probability of ruin (account blowup) calculation",
                  "Confidence intervals for drawdown, profit, and Sharpe ratio",
                  "Funded account survival probability analysis",
                  "Visual distribution of all possible equity curves",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 bg-primary/[0.02] border-primary/10">
              <Activity className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Why Single Backtests Lie</h3>
              <p className="text-muted-foreground mb-6">
                A single backtest shows you <strong>one possible outcome</strong> from one specific sequence of trades. But in live trading, the order of wins and losses is random. A strategy that shows 20% return in a backtest might have a 40% chance of hitting a 15% drawdown first — enough to blow your funded account.
              </p>
              <p className="text-muted-foreground mb-6">
                Monte Carlo simulation reveals this hidden risk by testing thousands of different trade orderings. It's the difference between <strong>hoping your EA works</strong> and <strong>knowing the statistical probability</strong> that it will.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  "Monte Carlo analysis is the single most important test for any Expert Advisor. Without it, you're trading blind." — Institutional Risk Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FoldForge Does It */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">How FoldForge <span className="gold-text">Monte Carlo</span> Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our Monte Carlo engine goes far beyond basic trade reordering. Here's what makes FoldForge the most advanced Monte Carlo tool for EA testing.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Trade Resampling", desc: "Randomly reorder and resample trades from your EA's history to generate thousands of unique equity curves. Each simulation represents a statistically valid alternative outcome." },
              { icon: Target, title: "Confidence Intervals", desc: "Calculate 90%, 95%, and 99% confidence intervals for net profit, maximum drawdown, Sharpe ratio, and other key metrics. Know the range of likely outcomes." },
              { icon: Shield, title: "Ruin Probability", desc: "Calculate the exact probability that your EA will hit a specified drawdown limit. Essential for funded account traders who can't afford to breach prop firm rules." },
              { icon: Gauge, title: "Percentile Analysis", desc: "See the 5th, 25th, 50th, 75th, and 95th percentile outcomes for every metric. Understand the full distribution of possible results." },
              { icon: Brain, title: "AI Interpretation", desc: "Our AI engine interprets Monte Carlo results and provides plain-English recommendations. Know exactly what the numbers mean for your trading." },
              { icon: BarChart3, title: "Visual Distribution", desc: "Interactive charts showing all simulation equity curves overlaid, probability distributions, and confidence bands. See the full picture at a glance." },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Who Uses <span className="gold-text">Monte Carlo</span> EA Testing?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Prop Firm Traders", desc: "Validate that your EA can survive FTMO, The5ers, and other prop firm challenges without breaching drawdown limits." },
              { title: "EA Developers", desc: "Prove to customers that your Expert Advisor is statistically robust, not just curve-fitted to historical data." },
              { title: "Fund Managers", desc: "Institutional-grade risk assessment before deploying any automated strategy to client accounts." },
              { title: "Retail Traders", desc: "Stop guessing and start knowing. See the real probability of your EA making money over 1,000+ scenarios." },
            ].map((uc, i) => (
              <div key={i} className="glass-card rounded-xl p-6 border-border/50 hover:border-primary/30 transition-colors">
                <h3 className="text-lg font-semibold mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Run Your First <span className="gold-text">Monte Carlo Simulation</span></h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Upload any MQ5 Expert Advisor and run 1,000+ simulations in minutes. See the statistical truth about your strategy.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
              Start Free Trial <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">No credit card required &middot; 7-day free trial &middot; Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

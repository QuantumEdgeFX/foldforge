import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Target, Zap, Shield, BarChart3, TrendingUp, ArrowRight, CheckCircle2, Activity, Brain, AlertTriangle } from "lucide-react";

export default function WalkForwardAnalysisMT5() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Target size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Walk-Forward Analysis for MetaTrader 5</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              <span className="gold-text">Walk-Forward Analysis</span> for MT5 Expert Advisors
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Detect overfitting and validate your EA's true edge with institutional-grade walk-forward analysis. Rolling in-sample/out-of-sample testing reveals whether your strategy works on unseen data — or just looks good on paper.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Start Walk-Forward Analysis <ArrowRight size={18} className="ml-2" />
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

      {/* What is Walk-Forward */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">What is <span className="gold-text">Walk-Forward Analysis</span>?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Walk-forward analysis (WFA) is the gold standard for validating trading strategies. It divides your historical data into multiple rolling windows, each with an <strong>in-sample</strong> (optimization) period and an <strong>out-of-sample</strong> (validation) period. The strategy is optimized on in-sample data, then tested on unseen out-of-sample data.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                If your EA performs well on out-of-sample data across multiple windows, it demonstrates a <strong>genuine statistical edge</strong> — not just curve-fitting. This is the same validation technique used by quantitative hedge funds and institutional trading desks.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                FoldForge automates the entire walk-forward process. Upload your MQ5 file, configure the number of windows and in-sample ratio, and get a complete Walk-Forward Efficiency (WFE) score in minutes.
              </p>
              <div className="space-y-3">
                {[
                  "Rolling window analysis with configurable in-sample/out-of-sample ratios",
                  "Walk-Forward Efficiency (WFE) score — the definitive overfitting metric",
                  "Per-window performance breakdown with consistency analysis",
                  "Out-of-sample degradation measurement",
                  "Automatic overfitting detection and warnings",
                  "Compatible with any MQ5 Expert Advisor",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 bg-primary/[0.02] border-primary/10">
              <AlertTriangle className="text-yellow-500 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">The Overfitting Problem</h3>
              <p className="text-muted-foreground mb-6">
                <strong>90% of Expert Advisors that look profitable in backtests fail in live trading.</strong> The reason? Overfitting. When you optimize parameters on historical data, you're often finding patterns that are unique to that specific data — patterns that won't repeat in the future.
              </p>
              <p className="text-muted-foreground mb-6">
                Walk-forward analysis is the only reliable way to detect overfitting. By testing on data your EA has never seen, you get an honest assessment of whether your strategy has a real edge or is just memorizing the past.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  "If your EA hasn't passed walk-forward analysis, you don't have a strategy — you have a curve-fit." — Quantitative Trading Principle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">How FoldForge <span className="gold-text">Walk-Forward</span> Works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Upload EA", desc: "Upload your MQ5 Expert Advisor. FoldForge automatically detects all parameters and generates the trade history for analysis." },
              { step: "2", title: "Configure Windows", desc: "Set the number of rolling windows (3-20) and the in-sample/out-of-sample ratio (50%-90%). More windows = more robust validation." },
              { step: "3", title: "Run Analysis", desc: "FoldForge runs the walk-forward analysis, optimizing on in-sample data and validating on out-of-sample data for each window." },
              { step: "4", title: "Get WFE Score", desc: "Receive your Walk-Forward Efficiency score, per-window breakdown, consistency metrics, and overfitting detection results." },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary">{s.step}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WFE Explained */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.02]">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">Understanding <span className="gold-text">Walk-Forward Efficiency</span></h2>
          <div className="glass-card rounded-2xl p-8 border-primary/10">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Walk-Forward Efficiency (WFE) measures how well your EA's in-sample performance translates to out-of-sample results. It's calculated as the ratio of out-of-sample performance to in-sample performance, expressed as a percentage.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">WFE &gt; 50%</div>
                <div className="text-sm text-green-400">Excellent — Strong Edge</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">WFE 30-50%</div>
                <div className="text-sm text-yellow-400">Acceptable — Moderate Edge</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">WFE &lt; 30%</div>
                <div className="text-sm text-red-400">Poor — Likely Overfit</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A WFE above 50% indicates that your EA retains more than half of its optimization performance when tested on unseen data — a strong indicator of a genuine trading edge. Below 30% suggests significant overfitting and the strategy should not be deployed with real capital.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Validate Your EA's <span className="gold-text">True Edge</span></h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Upload any MQ5 Expert Advisor and run walk-forward analysis in minutes. Know if your strategy is real or just curve-fitted.
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

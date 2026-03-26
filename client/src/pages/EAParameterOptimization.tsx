import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings, Zap, Shield, BarChart3, ArrowRight, CheckCircle2, Activity, Target, Brain, TrendingUp, Gauge } from "lucide-react";

export default function EAParameterOptimization() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Settings size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">EA Parameter Optimization & Sensitivity Analysis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              <span className="gold-text">EA Parameter Optimization</span> Without Overfitting
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Find the optimal parameters for your Expert Advisor without curve-fitting. FoldForge's sensitivity analysis shows you which parameters matter, which are fragile, and which settings are robust across market conditions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Optimize My EA <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  Open Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Optimization Trap */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">The <span className="gold-text">Optimization Trap</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Traditional EA optimization finds the "best" parameters by testing thousands of combinations on historical data. The problem? The "best" parameters are almost always overfit — they work perfectly on past data but fail on live markets.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                FoldForge takes a different approach. Instead of finding the single "best" parameter set, we identify <strong>robust parameter regions</strong> — ranges of values where your EA performs consistently well. This is the approach used by quantitative hedge funds and institutional trading desks.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our sensitivity analysis shows you exactly how each parameter affects performance. Parameters that cause dramatic performance swings are fragile and likely overfit. Parameters with smooth, gradual performance curves indicate genuine edge.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Parameter Sensitivity Heatmaps", desc: "Visual heatmaps showing how each parameter pair affects Sharpe ratio, profit factor, and drawdown. Identify robust regions instantly." },
                { title: "Robustness Scoring", desc: "Each parameter gets a robustness score from 0-100. High scores mean the parameter value is stable; low scores indicate fragility." },
                { title: "Automatic Detection", desc: "FoldForge automatically detects all parameters from your MQ5 file — integers, doubles, enums, booleans — and generates the optimization grid." },
                { title: "Walk-Forward Validated", desc: "All optimization results are validated with walk-forward analysis to ensure they work on unseen data, not just historical data." },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-5 border-border/50 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">How <span className="gold-text">Parameter Optimization</span> Works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Upload EA", desc: "Upload your MQ5 file. FoldForge detects all input parameters automatically — no manual configuration needed." },
              { step: "2", title: "Select Parameters", desc: "Choose which parameters to optimize. Set ranges and step sizes for each. FoldForge suggests optimal ranges based on parameter types." },
              { step: "3", title: "Run Sensitivity Analysis", desc: "FoldForge tests parameter combinations and generates sensitivity heatmaps, robustness scores, and performance surfaces." },
              { step: "4", title: "Get Robust Settings", desc: "Receive the most robust parameter regions with walk-forward validation. Know which settings will work in live trading." },
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

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Optimize Without <span className="gold-text">Overfitting</span></h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Find robust parameters that work in live trading, not just backtests. Upload your EA and start optimizing.
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

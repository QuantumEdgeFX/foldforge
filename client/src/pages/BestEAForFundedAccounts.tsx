import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Zap, BarChart3, TrendingUp, ArrowRight, CheckCircle2, Activity, Target, Brain, AlertTriangle, Award, Gauge } from "lucide-react";

export default function BestEAForFundedAccounts() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Award size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Funded Account EA Validation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Find the <span className="gold-text">Best EA for Funded Accounts</span> — Validated by Data
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't guess which Expert Advisor is safe for your FTMO, The5ers, or Topstep account. FoldForge stress-tests any EA against real prop firm rules and gives you a funded account readiness score. Know before you risk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Test Your EA Now <ArrowRight size={18} className="ml-2" />
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

      {/* Why Most EAs Fail Funded Accounts */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Why <span className="gold-text">90% of EAs</span> Fail Funded Account Challenges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Most Expert Advisors are optimized for profit, not for survival. Prop firms have strict rules that most EAs aren't designed to handle.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: AlertTriangle, title: "Drawdown Breaches", desc: "The #1 killer. Most EAs have drawdown profiles that exceed the 5% daily or 10% total limits set by prop firms. One bad day = failed challenge.", color: "text-red-400", bg: "bg-red-500/10" },
              { icon: Activity, title: "Inconsistent Performance", desc: "EAs that show great average returns but have wild variance. Prop firms need consistency, not occasional home runs followed by devastating losses.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: Target, title: "Overfitted Strategies", desc: "EAs optimized on historical data that don't perform on live markets. Walk-forward analysis reveals the truth about whether your EA has a real edge.", color: "text-orange-400", bg: "bg-orange-500/10" },
            ].map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-6 border-border/50 hover:border-primary/30 transition-colors">
                <div className={`w-12 h-12 rounded-lg ${p.bg} flex items-center justify-center mb-4`}>
                  <p.icon size={22} className={p.color} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes an EA Funded-Account Safe */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">What Makes an EA <span className="gold-text">Funded-Account Safe</span>?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The best EAs for funded accounts share specific characteristics that FoldForge tests for automatically. Our Funded Account Readiness Score evaluates your EA across all these dimensions:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Max Drawdown < 5% Daily", desc: "Your EA must never breach the daily drawdown limit under any market condition — including spread widening, slippage, and gap events." },
                  { title: "Consistent Win Rate > 50%", desc: "Funded accounts need steady, predictable returns. High variance strategies fail even if they're profitable on average." },
                  { title: "Profit Factor > 1.5", desc: "A profit factor above 1.5 provides enough margin to survive the inevitable losing streaks without breaching limits." },
                  { title: "Recovery Factor > 2.0", desc: "The ability to recover from drawdowns quickly is critical. A recovery factor above 2 means your EA can bounce back." },
                  { title: "Sharpe Ratio > 1.0", desc: "Risk-adjusted returns matter more than raw returns. A Sharpe above 1 indicates your EA generates returns efficiently." },
                  { title: "Monte Carlo Survival > 90%", desc: "Your EA should survive 90%+ of Monte Carlo simulations without breaching funded account limits." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 bg-primary/[0.02] border-primary/10">
              <Shield className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Funded Account Readiness Score</h3>
              <p className="text-muted-foreground mb-6">
                FoldForge calculates a comprehensive Funded Account Readiness Score from 0-100 based on your EA's stress test results, Monte Carlo survival rate, walk-forward efficiency, and risk metrics.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="text-sm font-medium text-green-400">Score 80-100</span>
                  <span className="text-xs text-green-400">Ready for Funded Trading</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-sm font-medium text-yellow-400">Score 60-79</span>
                  <span className="text-xs text-yellow-400">Needs Optimization</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-sm font-medium text-red-400">Score Below 60</span>
                  <span className="text-xs text-red-400">Not Ready — High Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prop Firms Supported */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Compatible with <span className="gold-text">All Major Prop Firms</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">FoldForge tests your EA against the exact rules of every major prop firm. Pre-configured profiles for instant validation.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-8">
            {["FTMO", "The5ers", "Topstep", "MyForexFunds", "E8 Funding", "Funded Engineer", "Alpha Capital", "Apex Trader Funding"].map((firm, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <Shield size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black tracking-tighter text-foreground/80 group-hover:text-primary transition-colors">{firm}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Is Your EA <span className="gold-text">Funded-Account Ready</span>?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Upload your Expert Advisor and get a Funded Account Readiness Score in minutes. Know before you risk.
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

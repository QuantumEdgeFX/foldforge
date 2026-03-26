import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Code, Brain, Shield, BarChart3, ArrowRight, CheckCircle2, Activity, Target, AlertTriangle, Lightbulb, Zap } from "lucide-react";

export default function MQ5CodeReview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Code size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered MQ5 Code Review</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              AI-Powered <span className="gold-text">MQ5 Code Review</span> for Expert Advisors
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your MQ5 Expert Advisor and get an instant AI-powered code review. Identify bugs, risk management gaps, optimization opportunities, and specific code improvements — with actual MQ5 code suggestions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Review My EA Code <ArrowRight size={18} className="ml-2" />
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

      {/* What We Review */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">What Our <span className="gold-text">AI Code Review</span> Analyzes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our AI engine performs a comprehensive analysis of your MQ5 code across 8 critical dimensions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Risk Management", desc: "Stop loss, take profit, trailing stops, position sizing, max drawdown protection, spread filters, slippage protection, and news filters." },
              { icon: AlertTriangle, title: "Bug Detection", desc: "Common MQ5 bugs including uninitialized variables, memory leaks, array out-of-bounds, incorrect order types, and magic number conflicts." },
              { icon: Zap, title: "Performance", desc: "Code efficiency analysis including unnecessary indicator calls, redundant calculations, slow loops, and optimization opportunities." },
              { icon: Brain, title: "Logic Analysis", desc: "Entry/exit logic review, signal confirmation, multi-timeframe consistency, and strategy coherence assessment." },
              { icon: BarChart3, title: "Money Management", desc: "Position sizing algorithms, risk-per-trade calculations, lot size validation, and margin requirement checks." },
              { icon: Target, title: "Robustness", desc: "Error handling, connection loss recovery, partial fill handling, and broker compatibility checks." },
              { icon: Activity, title: "Complexity Score", desc: "Cyclomatic complexity, code lines, function count, nesting depth, and maintainability index." },
              { icon: Lightbulb, title: "Improvements", desc: "Specific MQ5 code suggestions with before/after examples. Copy-paste ready improvements for your EA." },
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

      {/* Example Output */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">Example <span className="gold-text">Code Review Output</span></h2>
          <div className="glass-card rounded-2xl p-8 border-primary/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Risk Management Audit</h3>
              <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold">Score: 65/100</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                ["Stop Loss", true], ["Take Profit", true], ["Trailing Stop", false], ["Position Sizing", true],
                ["DD Protection", false], ["Spread Filter", false], ["Slippage Protection", true], ["News Filter", false],
              ].map(([label, has], i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${has ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {has ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {label as string}
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-3">Suggested Improvement:</h4>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-2"><strong>Current:</strong> Fixed lot size with no drawdown protection</p>
                <p className="text-sm text-primary mb-3"><strong>Suggested:</strong> Add dynamic position sizing based on account equity</p>
                <pre className="text-xs font-mono bg-secondary/50 p-3 rounded overflow-x-auto">{`// Add this to your OnTick() function:
double riskPercent = 1.0; // Risk 1% per trade
double accountEquity = AccountInfoDouble(ACCOUNT_EQUITY);
double riskAmount = accountEquity * riskPercent / 100.0;
double lotSize = NormalizeDouble(
  riskAmount / (stopLossPips * pipValue), 2
);
lotSize = MathMax(lotSize, SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN));
lotSize = MathMin(lotSize, SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX));`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Get Your EA <span className="gold-text">Code Reviewed</span> by AI</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Upload your MQ5 file and get instant, actionable code improvements. Find bugs, fix risk management gaps, and optimize performance.
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

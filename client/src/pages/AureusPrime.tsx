import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Shield, Zap, BarChart3, TrendingUp, ArrowRight, Star, Play } from "lucide-react";

const LOGO_URL = "/logo.webp";

const FEATURES = [
  "Multi-pair gold and forex trading",
  "Adaptive volatility engine",
  "Dynamic lot sizing with equity protection",
  "Hidden stop-loss and take-profit levels",
  "News filter with economic calendar integration",
  "Session-aware trading (London, NY, Asian)",
  "Trailing stop with breakeven logic",
  "Compatible with MT4 and MT5",
  "Prop firm safe mode",
  "Built-in drawdown guardian",
];

const SPECS = [
  { label: "Platform", value: "MetaTrader 4 / MetaTrader 5" },
  { label: "Recommended Pairs", value: "XAUUSD, EURUSD, GBPUSD, USDJPY" },
  { label: "Minimum Deposit", value: "$500 (recommended $1,000+)" },
  { label: "Timeframe", value: "M15 / H1 (configurable)" },
  { label: "Leverage", value: "1:100 or higher recommended" },
  { label: "Account Type", value: "ECN / Raw Spread preferred" },
  { label: "VPS", value: "Recommended for 24/5 operation" },
];

export default function AureusPrime() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Zap size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Flagship Expert Advisor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">
                <span className="gold-text">Aureus Prime</span> EA
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The institutional-grade Expert Advisor built for serious traders. Aureus Prime combines adaptive volatility analysis, dynamic position sizing, and prop-firm-safe risk management into a single, battle-tested trading engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">
                    Get Free Access <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/aureus-prime/showcase">
                  <Button variant="outline" size="lg" className="px-8 h-12 border-border">
                    See Live Trades
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img src={LOGO_URL} alt="Aureus Prime EA" className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-center">
            Built for <span className="gold-text">Performance</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 glass-card rounded-lg">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-16 border-t border-border/50 bg-primary/[0.03]">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-center">
            Technical <span className="gold-text">Specifications</span>
          </h2>
          <div className="glass-card rounded-xl overflow-hidden">
            {SPECS.map((s, i) => (
              <div key={i} className={`flex items-center justify-between p-4 ${i < SPECS.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Trading Results */}
      <section className="py-16 border-t border-border/50 bg-primary/[0.02]">
        <div className="container">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-center">
            Live Trading <span className="gold-text">Results</span>
          </h2>

          <div className="max-w-4xl mx-auto">
            {/* Outer card */}
            <div className="glass-card rounded-2xl border border-primary/20 bg-primary/[0.03] overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-5">
                <div>
                  <h3 className="text-xl font-bold mb-1">Aureus Prime Live Account</h3>
                  <p className="text-sm text-muted-foreground">Real-time performance tracking on MyFXBook</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <a
                    href="https://www.myfxbook.com/members/AureusPrimeEA/aureus-prime-ea/11972224"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View on MyFXBook &rarr;
                  </a>
                </div>
              </div>

              {/* MyFXBook widget — zero padding, fills full card width */}
              <a
                href="https://www.myfxbook.com/members/AureusPrimeEA/aureus-prime-ea/11972224"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
                style={{ lineHeight: 0 }}
              >
                <img
                  alt="Aureus Prime EA — MyFXBook Live Performance"
                  src="https://widget.myfxbook.com/widget/widget.png?accountOid=11972224&type=6"
                  className="w-full block"
                  style={{
                    height: 'auto',
                    aspectRatio: '430 / 215',
                    objectFit: 'fill',
                    imageRendering: 'auto',
                    display: 'block',
                  }}
                />
              </a>

              {/* Key Metrics — below widget, inside card */}
              <div className="grid md:grid-cols-3 gap-4 px-8 py-6 border-t border-primary/10">
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Account Status</div>
                  <div className="text-lg font-bold text-primary">Live Trading</div>
                  <div className="text-xs text-muted-foreground mt-2">Real money account</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Broker</div>
                  <div className="text-lg font-bold">Premium ECN</div>
                  <div className="text-xs text-muted-foreground mt-2">Low spreads, fast execution</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">Platform</div>
                  <div className="text-lg font-bold">MetaTrader 5</div>
                  <div className="text-xs text-muted-foreground mt-2">Latest version</div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
              This live account demonstrates Aureus Prime&apos;s real-world performance. All trades are executed with real capital under actual market conditions. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </section>

      {/* Performance */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-center">
            Proven <span className="gold-text">Track Record</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Avg Monthly Return", value: "8.2%", icon: TrendingUp },
              { label: "Max Drawdown", value: "12.4%", icon: Shield },
              { label: "Profit Factor", value: "2.31", icon: BarChart3 },
              { label: "Win Rate", value: "68.5%", icon: Star },
            ].map((m, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center">
                <m.icon size={24} className="text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold gold-text mb-1">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-xl mx-auto">
            Past performance is not indicative of future results. Trading involves substantial risk of loss. These figures are based on backtested and live demo results.
          </p>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-center">
            Watch <span className="gold-text">Aureus Prime</span> in Action
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Video 1: Live Backtest */}
            <a href="https://www.youtube.com/embed/dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="aspect-video bg-background/50 flex items-center justify-center relative">
                <img src="/aureus-prime-trade-1.webp" alt="Aureus Prime Live Gold Backtest" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Play size={28} className="text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Live Gold Backtest Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See Aureus Prime in action on XAUUSD with an 18% return. This video demonstrates the EA's adaptive volatility engine and dynamic position sizing in real market conditions.
                </p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <span>▶ 4.7 min</span>
                  <span>&bull;</span>
                  <span>Live Trading</span>
                </div>
              </div>
            </a>

            {/* Video 2: Stress Testing */}
            <a href="https://www.youtube.com/embed/dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="aspect-video bg-background/50 flex items-center justify-center relative">
                <img src="/aureus-prime-trade-2.png" alt="EA Stress Testing Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Play size={28} className="text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Institutional-Grade EA Stress Testing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Why your backtests might be lying to you. Learn how FoldForge's stress testing tools reveal the true edge of your trading strategies with Monte Carlo analysis and walk-forward validation.
                </p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <span>▶ 1.7 min</span>
                  <span>&bull;</span>
                  <span>Educational</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border/50 bg-primary/[0.03]">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-4">
            Ready to Trade with <span className="gold-text">Aureus Prime</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get 7 days free access to Aureus Prime EA, the testing studio, and real-time drawdown protection. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                Start Free Trial <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/aureus-prime/showcase">
              <Button variant="outline" size="lg" className="px-8 h-12 border-border hover:border-primary/50">
                <BarChart3 size={18} className="mr-2" /> View Live Results
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

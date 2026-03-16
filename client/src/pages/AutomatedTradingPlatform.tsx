import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Activity, Shield, BarChart3, TrendingUp, Database, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AutomatedTradingPlatform() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Next-Gen Automated Trading Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              The Professional <span className="gold-text">Automated Trading</span> Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Take your Expert Advisors to the next level with FoldForge. The only automated trading platform designed for institutional-grade stress testing and broker-specific data synchronization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Get Started Free <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  Open Studio Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="glass-card rounded-2xl p-1 bg-gradient-to-br from-primary/20 to-transparent">
              <div className="bg-background rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Built for Serious Traders</h3>
                <div className="space-y-6">
                  {[
                    { icon: Database, title: "Broker-Specific Data Sync", desc: "Sync your exact broker spreads and slippage data for 100% accurate backtesting." },
                    { icon: Activity, title: "Monte Carlo Simulations", desc: "Run thousands of variations to understand the true risk profile of your automated strategy." },
                    { icon: TrendingUp, title: "Advanced Performance Metrics", desc: "Analyze Sharpe ratios, recovery factors, and drawdown durations with institutional precision." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg h-fit">
                        <item.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">Why Choose FoldForge as Your <span className="gold-text">Automated Trading Platform</span>?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Most automated trading platforms give you generic results based on "ideal" market conditions. FoldForge is different. We focus on the "stress" in stress testing—ensuring your EAs can survive real-world market volatility, broker manipulations, and high-impact news events.
              </p>
              <ul className="space-y-3">
                {["Full MT4 and MT5 Compatibility", "Hardware-Bound License Protection", "172+ Pre-loaded Symbol References", "Real-time Risk Management Guardian"].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary" />
                    <span className="text-foreground font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.03]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Ready to Automate with <span className="gold-text">Confidence</span>?</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop deploying untested EAs. Join the professional traders who use FoldForge to validate every trade before it happens.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 h-14 text-lg font-bold">
              Start Your 7-Day Free Trial
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

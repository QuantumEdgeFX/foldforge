import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Zap, Shield, BarChart3, TrendingUp, Database, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EAStressTesting() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Institutional-Grade EA Stress Testing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              The Professional <span className="gold-text">EA Stress Testing</span> Studio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't deploy your Expert Advisors blindly. Use FoldForge to run advanced EA stress testing, Monte Carlo simulations, and walk-forward analysis with 100% accurate broker data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Start Stress Testing <ArrowRight size={18} className="ml-2" />
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

      {/* Content Section */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">Why <span className="gold-text">EA Stress Testing</span> is Essential for Every Trader</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most traders rely on simple backtests that use "perfect" data. In reality, market conditions change, spreads widen, and slippage happens. Our EA stress testing tools help you identify the breaking point of your strategy before you risk real capital.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Monte Carlo Analysis", desc: "Run thousands of variations to see the probability of success in different market conditions." },
                  { title: "Broker Data Synchronization", desc: "Sync your exact broker spreads and slippage to ensure 100% accurate results." },
                  { title: "Walk-Forward Validation", desc: "Test your strategy on unseen data to prevent over-optimization and curve-fitting." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-primary/10 p-1 rounded-full h-fit">
                      <CheckCircle2 size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 bg-primary/[0.02] border-primary/10">
              <Zap className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Validate Your Edge</h3>
              <p className="text-muted-foreground mb-8">
                FoldForge provides the tools that professional hedge funds use to validate their trading algorithms. Stop relying on luck and start using institutional-grade data.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm italic">"The only EA stress testing tool that actually gives me realistic results." — Pro Trader</li>
                <li className="flex items-center gap-3 text-sm italic">"Essential for anyone managing large funded accounts." — EA Developer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Ready to Secure Your <span className="gold-text">Trading Future</span>?</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of traders who use FoldForge to maintain discipline and protect their capital with advanced EA stress testing.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 h-14 text-lg font-bold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

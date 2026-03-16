import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Activity, Shield, BarChart3, TrendingUp, Database, ArrowRight, CheckCircle2, Code } from "lucide-react";

export default function ExpertAdvisorBuilder() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Code size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Advanced Expert Advisor Validation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              The Professional <span className="gold-text">Expert Advisor</span> Testing Studio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't just build EAs—validate them. FoldForge is the ultimate Expert Advisor builder's companion, providing institutional-grade stress testing and Monte Carlo analysis for MetaTrader developers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Start Testing Free <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  Developer Docs
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
            <div>
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">The Essential Toolkit for Every <span className="gold-text">Expert Advisor Builder</span></h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                As an Expert Advisor builder, your reputation depends on the performance and reliability of your code. FoldForge gives you the tools to prove your edge and ensure your EAs can handle any market condition.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Monte Carlo Simulation", desc: "Run thousands of randomized scenarios to see the true probability of success." },
                  { title: "Walk-Forward Analysis", desc: "Validate your EA's performance on unseen data to prevent over-optimization." },
                  { title: "Parameter Sensitivity Sweeps", desc: "Identify which settings are robust and which are fragile." }
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
              <h3 className="text-2xl font-bold mb-4">Validate Your Code</h3>
              <p className="text-muted-foreground mb-8">
                Stop relying on standard MetaTrader backtests. Use FoldForge to sync real broker data and stress test your EAs against institutional-grade models.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm italic">"FoldForge has cut my development time in half and doubled my strategy robustness." — Senior EA Developer</li>
                <li className="flex items-center gap-3 text-sm italic">"The only platform that gives me the confidence to deploy my EAs on high-balance funded accounts." — Algorithmic Trader</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50 bg-secondary/20">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto glass-card p-12 rounded-3xl border-primary/20 bg-background">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Elevate Your <span className="gold-text">EA Development</span></h2>
            <p className="text-muted-foreground mb-10">
              Join the elite group of Expert Advisor builders who prioritize validation and risk management.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 h-14 text-lg font-bold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

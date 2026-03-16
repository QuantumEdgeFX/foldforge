import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, CheckCircle2, ArrowRight, Activity, Lock, TrendingUp, BarChart3, Zap } from "lucide-react";

export default function FundedAccountRiskManagement() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Shield size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Advanced Funded Account Risk Management</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Master Your <span className="gold-text">Funded Account</span> Risk Management
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't let one rogue trade wipe out your hard-earned prop firm capital. FoldForge provides the institutional-grade tools you need to enforce discipline and protect your funded accounts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Protect My Account <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-4">Why <span className="gold-text">Funded Account Risk Management</span> is Critical</h2>
              <p className="text-muted-foreground leading-relaxed">
                Trading a funded account is different from trading your own capital. With strict drawdown limits and daily loss rules, traditional risk management isn't enough. You need a system that understands prop firm rules and enforces them at the execution level.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Hard Drawdown Limits", desc: "Automatic liquidation when approaching daily or total drawdown thresholds." },
                  { title: "Dynamic Position Sizing", desc: "Calculate lot sizes based on current equity and prop firm specific risk rules." },
                  { title: "News Event Protection", desc: "Prevent trading during high-impact news as required by many prop firm evaluations." }
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
              <Activity className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">The FoldForge Advantage</h3>
              <p className="text-muted-foreground mb-8">
                Our platform was built by traders, for traders. We understand the pressure of a $200K challenge and the heartbreak of a 0.1% violation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm italic">"The only tool that actually stopped me from revenge trading during my Topstep challenge." — Pro Trader</li>
                <li className="flex items-center gap-3 text-sm italic">"Essential for anyone running multiple EAs on a single funded account." — EA Developer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border/50 bg-secondary/20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-12">Built-in <span className="gold-text">Risk Controls</span></h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="glass-card p-6 rounded-xl">
              <Zap className="text-primary mb-4" />
              <h3 className="font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground">Millisecond-level monitoring of your MetaTrader account equity and drawdown status.</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <Lock className="text-primary mb-4" />
              <h3 className="font-bold mb-2">Discipline Enforcement</h3>
              <p className="text-sm text-muted-foreground">Hard-coded rules that prevent you from over-leveraging or trading outside of your plan.</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <BarChart3 className="text-primary mb-4" />
              <h3 className="font-bold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed reports on your risk-to-reward ratios and drawdown patterns to improve your edge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto glass-card p-12 rounded-3xl border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Ready to Secure Your <span className="gold-text">Trading Future</span>?</h2>
            <p className="text-muted-foreground mb-10">
              Join thousands of traders who use FoldForge to maintain discipline and protect their funded accounts.
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

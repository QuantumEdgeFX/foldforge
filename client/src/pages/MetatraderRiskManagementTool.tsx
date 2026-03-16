import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Activity, Lock, BarChart3, Zap, Database, ArrowRight, CheckCircle2 } from "lucide-react";

export default function MetatraderRiskManagementTool() {
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
              <span className="text-xs font-medium text-primary">Advanced MetaTrader Risk Management Tool</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              The Professional <span className="gold-text">MetaTrader</span> Risk Management Tool
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Enforce discipline and protect your capital with FoldForge. The ultimate MetaTrader risk management tool for serious MT4 and MT5 traders who value consistency over luck.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                  Secure My Account <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card rounded-2xl p-8 border-primary/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Lock className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Guardian Mode</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="text-primary shrink-0" />
                    <p className="text-sm">Real-time drawdown protection that stops you before you hit your limits.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="text-primary shrink-0" />
                    <p className="text-sm">Automatic lot-size calculation based on your exact risk tolerance per trade.</p>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="text-primary shrink-0" />
                    <p className="text-sm">Daily loss limit enforcement that prevents revenge trading and emotional errors.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">A <span className="gold-text">MetaTrader Risk Management Tool</span> Built for Institutional Results</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Generic stop-losses aren't enough in today's volatile markets. FoldForge provides a comprehensive MetaTrader risk management tool that monitors every aspect of your trading account, from broker-specific slippage to equity drawdown patterns.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <Activity className="text-primary mb-2" size={20} />
                  <h4 className="font-bold text-sm">Equity Monitoring</h4>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <BarChart3 className="text-primary mb-2" size={20} />
                  <h4 className="font-bold text-sm">Risk Analytics</h4>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <Zap className="text-primary mb-2" size={20} />
                  <h4 className="font-bold text-sm">Instant Execution</h4>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <Database className="text-primary mb-2" size={20} />
                  <h4 className="font-bold text-sm">Broker Data Sync</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Stop <span className="gold-text">Gambling</span>. Start Trading.</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Take control of your risk with the most advanced MetaTrader risk management tool on the market.
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

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Award } from "lucide-react";
import { Link } from "wouter";

export default function Founder() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider mb-6 uppercase">
                <Award size={14} /> Meet the Founder
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6 leading-tight">
                Quant Warren: <br />
                <span className="gold-text">Institutional Precision</span> <br />
                Meets Personal Vision
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                At 34, Quant Warren has spent over 15 years mastering the quantitative trading landscape, 
                bridging the gap between complex data and actionable market edges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
                    Start Your Free Trial <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/aureus-prime">
                  <Button variant="outline" className="h-12 px-8 border-primary/20 hover:bg-primary/5 text-base font-semibold">
                    Explore Aureus Prime
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card aspect-[4/5] w-full max-w-[400px] shadow-2xl">
                  <img 
                    src="/images/quant-warren-founder.webp" 
                    alt="Quant Warren - Founder of FoldForge" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/60 to-transparent">
                    <p className="text-2xl font-bold font-['Playfair_Display'] text-white">Quant Warren</p>
                    <p className="text-primary font-medium text-sm">Founder & CIO, Giddings Capital Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 bg-primary/5 border-y border-border/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">The Origin of <span className="gold-text">FoldForge</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              FoldForge wasn't born in a marketing lab—it was forged in the high-stakes environment of Giddings Capital Management. 
              As a quantitative hedge fund owner, Quant recognized a critical flaw in the trading industry: 
              most traders were flying blind, deploying strategies without rigorous, broker-specific stress testing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Internal Validation</h3>
              <p className="text-muted-foreground">
                What began as an internal risk management tool for Giddings Capital's own $50M+ AUM operations has now been democratized for serious traders.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Risk Management First</h3>
              <p className="text-muted-foreground">
                Quant's mission is to provide every trader with the same level of Monte Carlo simulation and walk-forward analysis used by the world's most sophisticated institutions.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Democratizing the Edge</h3>
              <p className="text-muted-foreground">
                We bring institutional-grade infrastructure to the retail market, ensuring your strategy is validated before a single dollar is risked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl text-primary/20 font-serif mb-4 leading-none">"</div>
            <blockquote className="text-2xl md:text-3xl font-medium font-['Playfair_Display'] italic mb-8 leading-snug">
              My goal is to prove that technology and discipline—not luck—are the true drivers of long-term investment success. 
              FoldForge is my way of empowering the trading community with the infrastructure they need to survive and thrive in any market condition.
            </blockquote>
            <div className="w-12 h-1 bg-primary mx-auto mb-6"></div>
            <p className="font-bold text-lg">Quant Warren</p>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Founder & Chief Investment Officer</p>
          </div>
        </div>
      </section>

      {/* Career Stats */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold gold-text mb-2">15+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Years in Markets</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gold-text mb-2">$50M+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Assets Managed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gold-text mb-2">1,200+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Traders Empowered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gold-text mb-2">172+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Symbols Covered</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

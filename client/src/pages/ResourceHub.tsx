import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, TrendingUp, Shield, Zap, BarChart3, Award, ArrowRight, Search, Filter } from "lucide-react";
import { useState } from "react";

const RESOURCES = [
  {
    category: "EA Validation",
    items: [
      { title: "The Complete Guide to Monte Carlo Simulation for EAs", desc: "Learn how Monte Carlo simulations reveal hidden risks in your trading strategies.", link: "#", icon: BarChart3 },
      { title: "Walk-Forward Analysis: Detecting Overfitting in Expert Advisors", desc: "Understand why backtests fail and how walk-forward analysis prevents curve-fitting.", link: "#", icon: TrendingUp },
      { title: "20 Stress Test Scenarios Every EA Must Pass", desc: "The definitive checklist for stress testing before deploying to prop firms.", link: "#", icon: Shield },
    ]
  },
  {
    category: "Prop Firm Mastery",
    items: [
      { title: "How to Pass FTMO, The5ers, and Topstep Challenges", desc: "Step-by-step guide to passing prop firm challenges with automated strategies.", link: "#", icon: Award },
      { title: "Prop Firm Risk Rules Decoded: A Trader's Handbook", desc: "Complete breakdown of drawdown limits, daily loss limits, and profit targets.", link: "#", icon: Shield },
      { title: "The Psychology of Funded Account Failure", desc: "Why 73% of funded traders fail and how to avoid the pitfalls.", link: "#", icon: Zap },
    ]
  },
  {
    category: "Advanced Trading",
    items: [
      { title: "Kelly Criterion for Position Sizing: The Math Behind Optimal Risk", desc: "Master the mathematical foundation of professional risk management.", link: "#", icon: BarChart3 },
      { title: "Sharpe Ratio, Sortino Ratio, and Beyond: Performance Metrics Explained", desc: "Understand the metrics that separate elite traders from the rest.", link: "#", icon: TrendingUp },
      { title: "Building Robust EAs: Parameter Sensitivity and Robustness Testing", desc: "Learn how to build EAs that survive real-world market conditions.", link: "#", icon: Zap },
    ]
  },
];

export default function ResourceHub() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredResources = selectedCategory
    ? RESOURCES.filter(r => r.category === selectedCategory)
    : RESOURCES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <BookOpen size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Knowledge Base & Learning Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Master <span className="gold-text">EA Stress Testing</span> & Prop Firm Trading
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Access the most comprehensive knowledge base for Expert Advisor validation, prop firm mastery, and advanced trading techniques.
            </p>
            <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50 bg-secondary/5">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              All Resources
            </button>
            {RESOURCES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="container">
          {filteredResources.map((category) => (
            <div key={category.category} className="mb-16">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, i) => (
                  <Link key={i} href={item.link}>
                    <div className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all group cursor-pointer h-full flex flex-col">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <item.icon size={22} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{item.desc}</p>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        Read More <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">
            Ready to Master <span className="gold-text">EA Stress Testing</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your 7-day free trial and get instant access to the FoldForge Studio, all learning resources, and our expert community.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base font-bold">
              Start Free Trial <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

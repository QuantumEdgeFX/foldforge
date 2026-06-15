import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, TrendingUp, Shield, Zap, BarChart3, Award, ArrowRight, Search, Filter, GraduationCap, PlayCircle, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

const ACADEMY_SECTIONS = [
  {
    id: "courses",
    title: "Mastery Courses",
    icon: GraduationCap,
    items: [
      { title: "EA Stress Testing Masterclass", desc: "The definitive guide to validating Expert Advisors for prop firm trading.", link: "/ea-stress-testing", icon: Zap, duration: "2.5 hours" },
      { title: "Prop Firm Risk Management", desc: "Learn the exact position sizing and drawdown rules used by elite funded traders.", link: "/funded-account-risk-management", icon: Shield, duration: "1.8 hours" },
      { title: "Monte Carlo & Statistical Edge", desc: "Master the mathematics of trading and identify your true statistical advantage.", link: "/monte-carlo-simulation-ea", icon: BarChart3, duration: "2.1 hours" },
    ]
  },
  {
    id: "guides",
    title: "Technical Guides",
    icon: FileText,
    items: [
      { title: "Walk-Forward Analysis Guide", desc: "Detect overfitting and curve-fitting before deploying to live markets.", link: "/walk-forward-analysis-mt5", icon: TrendingUp },
      { title: "MQ5 Code Audit Framework", desc: "How to perform a professional security and logic audit on any MQL5 file.", link: "/mq5-code-review", icon: Shield },
      { title: "Broker Data Sync Tutorial", desc: "Step-by-step setup for synchronizing real broker data with the FoldForge Studio.", link: "/docs", icon: Zap },
    ]
  },
  {
    id: "blog",
    title: "Latest Insights",
    icon: TrendingUp,
    items: [
      { title: "How I Passed FTMO in 7 Days", desc: "Case study of a $200K challenge pass using FoldForge validation.", link: "/blog/how-i-passed-ftmo-in-7-days-with-an-ea", icon: Award },
      { title: "Why 90% of Funded Accounts Fail", desc: "The psychological and technical reasons behind prop firm failure.", link: "/blog/why-90-percent-of-funded-accounts-fail", icon: Shield },
      { title: "The Future of AI Trading 2026", desc: "How machine learning is reshaping the algorithmic trading landscape.", link: "/blog/the-future-of-algorithmic-trading-in-2026", icon: Zap },
    ]
  }
];

export default function Academy() {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [
    { name: "Home", url: "https://foldforge.app" },
    { name: "Academy", url: "https://foldforge.app/academy" }
  ];

  const schema = {
    "@type": "EducationEvent",
    "name": "FoldForge Academy - Master Algorithmic Trading",
    "description": "Comprehensive educational platform for Expert Advisor validation, prop firm mastery, and algorithmic trading strategies.",
    "url": "https://foldforge.app/academy",
    "organizer": {
      "@type": "Organization",
      "name": "FoldForge",
      "url": "https://foldforge.app"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="FoldForge Academy - Master Algorithmic Trading & EA Validation"
        description="Learn Expert Advisor stress testing, prop firm risk management, Monte Carlo analysis, and algorithmic trading from industry experts. Comprehensive courses and guides."
        canonical="https://foldforge.app/academy"
        breadcrumbs={breadcrumbs}
        schema={schema}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <GraduationCap size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">FoldForge Academy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Master the Art of <span className="gold-text">Algorithmic Trading</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              From EA validation to prop firm mastery, access the institutional knowledge required to succeed in the modern markets.
            </p>
            <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses, guides, and articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Academy Content */}
      <section className="py-20">
        <div className="container">
          {ACADEMY_SECTIONS.map((section) => (
            <div key={section.id} className="mb-20 last:mb-0">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon size={20} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-['Playfair_Display']">{section.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, i) => (
                  <Link key={i} href={item.link}>
                    <div className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all group cursor-pointer h-full flex flex-col border border-border/50 bg-secondary/5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <item.icon size={22} className="text-primary" />
                        </div>
                        {'duration' in item && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">
                            {item.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        Access Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container">
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <GraduationCap size={200} className="text-primary" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">
                Join the <span className="gold-text">FoldForge Elite</span> Community
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Get direct access to our expert traders, weekly strategy webinars, and exclusive EA templates.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base font-bold w-full sm:w-auto">
                    Start Free Trial <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/support">
                  <Button size="lg" variant="outline" className="px-8 h-14 text-base font-bold w-full sm:w-auto">
                    Contact Support <MessageSquare size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

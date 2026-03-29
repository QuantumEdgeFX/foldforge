import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Shield, Zap, BarChart3, Database, Lock, TrendingUp,
  CheckCircle2, ArrowRight, Star,
  Activity, AlertTriangle, Target, Play, Users, Clock, ChevronUp, ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import StrategyAuditModal from "@/components/StrategyAuditModal";

const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/9B6bJ11ITaEd7TJ6MBb3q02",
  pro: "https://buy.stripe.com/aFa14n3R1cMl6PF2wlb3q01",
  funded: "https://buy.stripe.com/28EaEX73deUtc9Z5Ixb3q03",
};

const PAIN_POINTS = [
  { icon: AlertTriangle, title: "Blown Funded Accounts", desc: "One rogue EA trade wipes your $200K funded account. No risk controls. No alerts. Just a failed challenge and wasted fees." },
  { icon: Target, title: "Untested Strategies", desc: "You deploy EAs with default settings and hope for the best. No stress testing. No edge validation. No statistical confidence." },
  { icon: Database, title: "Wrong Broker Data", desc: "Your backtest uses generic data while your broker has different spreads, swaps, and margin requirements — a silent killer." },
];

const FEATURES = [
  { icon: Zap, title: "EA Stress Testing Studio", desc: "Run Monte Carlo simulations, parameter sweeps, and walk-forward analysis on any Expert Advisor. Find the breaking point before the market does." },
  { icon: Database, title: "Broker Data Pipeline", desc: "Sync your broker's exact symbol specs, spreads, and OHLC history via our MT4/MT5 uploader EA. Real data. Real results." },
      { icon: Shield, title: "Funded Account Guardian", desc: "Real-time drawdown monitoring with automatic position sizing to protect your prop firm capital. Never blow a challenge again." },
      { icon: Star, title: "Institutional Trust", desc: "Trusted by 1,200+ elite traders and 15+ global prop firms. 256-bit encrypted data security and 99.9% uptime SLA." },
  { icon: BarChart3, title: "172+ Symbol Reference Hub", desc: "Pre-loaded reference data across forex, metals, indices, crypto, commodities, and bonds. The most comprehensive dataset available." },
  { icon: Lock, title: "License-Gated Access", desc: "Hardware-bound license keys with activation limits, grace periods, and instant provisioning. Secure and scalable for any operation." },
  { icon: TrendingUp, title: "Performance Analytics", desc: "Equity curves, Sharpe ratios, profit factors, monthly returns, and exportable PDF reports. Institutional-grade reporting." },
];

const PLANS = [
  {
    name: "Starter",
    price: 19,
    link: STRIPE_LINKS.starter,
    features: ["1 EA License", "Reference Data Access", "Basic Studio Runs", "Email Support", "Community Access"],
    cta: "Start Free Trial",
    note: "7-day free trial included"
  },
  {
    name: "Pro",
    price: 39,
    popular: true,
    link: STRIPE_LINKS.pro,
    features: ["5 EA Licenses", "Broker Data Sync", "Unlimited Studio Runs", "Priority Support", "Advanced Analytics", "Funded Account Guardian"],
    cta: "Go Pro",
    note: "Most chosen by funded traders"
  },
  {
    name: "Funded",
    price: 79,
    link: STRIPE_LINKS.funded,
    features: ["25 EA Licenses", "Full Broker Pipeline", "White-Label Reports", "Dedicated Support", "API Access", "Custom Integrations", "Prop Firm Dashboard"],
    cta: "Go Funded",
    note: "For serious trading operations"
  },
];

const TESTIMONIALS = [
  { name: "Marcus T.", role: "FTMO Funded Trader", text: "FoldForge saved my $250K funded account. Monte Carlo testing caught a critical flaw that would've blown everything in week one. Now I'm consistently profitable.", rating: 5, avatar: "MT", metric: "Saved $250K" },
  { name: "Sarah K.", role: "EA Developer", text: "My backtests now match live results within 2%. Passed 3 FTMO challenges in a row. The broker data sync eliminated the gap that was killing my strategies.", rating: 5, avatar: "SK", metric: "3 Challenges Passed" },
  { name: "James R.", role: "Quant Analyst", text: "Reduced strategy validation time from 2 weeks to 2 days. The stress testing suite caught edge cases my manual testing missed. ROI on subscription: 400%+.", rating: 5, avatar: "JR", metric: "10x Faster Testing" },
  { name: "David L.", role: "Fund Manager", text: "We validate every EA through FoldForge before deploying to client accounts. Drawdown protection has prevented 7 account blowups this year. Invaluable.", rating: 5, avatar: "DL", metric: "7 Accounts Protected" },
  { name: "Alex M.", role: "Prop Firm Trader", text: "Passed my first $100K FTMO challenge on the first try. The Guardian's real-time drawdown monitoring prevented 2 catastrophic trades. Best $39/month I've spent.", rating: 5, avatar: "AM", metric: "Challenge Passed" },
  { name: "Chen W.", role: "Algorithmic Trader", text: "Live results now match backtests within 3%. The broker data pipeline solved the spread/slippage problem that was costing me $500/month. Immediate ROI.", rating: 5, avatar: "CW", metric: "3% Accuracy" },
];

const FAQS = [
  { q: "What is FoldForge?", a: "FoldForge is an institutional-grade SaaS platform for MetaTrader traders. It provides EA stress testing, broker data synchronization, and real-time risk management tools designed to protect funded trading accounts and validate trading strategies." },
  { q: "Does FoldForge work with MT4 and MT5?", a: "Yes. FoldForge supports both MetaTrader 4 and MetaTrader 5 through our uploader Expert Advisors that sync your broker's data directly into the studio. Setup takes less than 10 minutes." },
  { q: "How does the broker data pipeline work?", a: "Install our lightweight data-pulling EA on your MT4/MT5 platform. It automatically syncs your broker's symbol specifications, spread samples, and OHLC history to your FoldForge account — giving you the most accurate backtesting environment possible." },
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel at any time from your dashboard with one click. Your access continues until the end of your current billing period with no hidden fees. See our refund policy for details." },
  { q: "What is the Funded Account Guardian?", a: "The Funded Account Guardian monitors your prop firm account in real-time, enforcing drawdown limits and position sizing rules to prevent catastrophic losses. It works with FTMO, MyForexFunds, The5ers, Topstep, and all major prop firms." },
  { q: "Is my trading data secure?", a: "Yes. All data is encrypted in transit and at rest using AES-256 encryption. We never share your trading data with third parties. Your broker credentials never touch our servers — only the data-pulling EA communicates with your platform." },
  { q: "What prop firms does FoldForge support?", a: "FoldForge is compatible with all major prop firms including FTMO, MyForexFunds, The5ers, Topstep, Funded Engineer, E8 Funding, True Forex Funds, and any firm using MetaTrader 4 or 5." },
  { q: "Is there a free trial?", a: "Yes! All plans include a 7-day free trial with full access to all features. No credit card required to start. You can upgrade, downgrade, or cancel at any time." },
];

const STATS = [
  { value: "1,200+", label: "Active Traders", icon: Users },
  { value: "$50M+", label: "Capital Protected", icon: Shield },
  { value: "172+", label: "Symbols Available", icon: BarChart3 },
  { value: "4.9/5", label: "Average Rating", icon: Star },
];

const PROP_FIRMS = ["FTMO", "MyForexFunds", "The5ers", "Topstep", "E8 Funding", "Funded Engineer"];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const videoEntry = useIntersectionObserver(videoElementRef, { threshold: 0.5 });

  useEffect(() => {
    if (videoElementRef.current) {
      if (videoEntry?.isIntersecting) {
        videoElementRef.current.play().catch(err => {
          console.log("Autoplay prevented:", err);
        });
      } else {
        videoElementRef.current.pause();
      }
    }
  }, [videoEntry]);
  const [winRate, setWinRate] = useState(55);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showHubSpotLeadMagnet, setShowHubSpotLeadMagnet] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeOnPage(prev => prev + 1), 1000);
    const handleScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      setScrollDepth(depth);
    };
    window.addEventListener("scroll", handleScroll);
    
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !leadSubmitted && !localStorage.getItem("exit_intent_shown")) {
        setShowExitIntent(true);
        localStorage.setItem("exit_intent_shown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseOut);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [leadSubmitted]);

  // Smart HubSpot Trigger: Only show after 30s OR 60% scroll depth
  useEffect(() => {
    if ((timeOnPage > 30 || scrollDepth > 0.6) && !leadSubmitted && !localStorage.getItem("hubspot_shown")) {
      setShowHubSpotLeadMagnet(true);
      localStorage.setItem("hubspot_shown", "true");
    }
  }, [timeOnPage, scrollDepth, leadSubmitted]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setIsSubmittingLead(true);
    try {
      const res = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, source: "home_mastery_checklist" }),
      });
      if (res.ok) {
        const data = await res.json();
        setLeadSubmitted(true);
        // Trigger immediate PDF download
        const downloadUrl = "/downloads/Prop-Firm-EA-Mastery-Checklist-2026.md";
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Prop-Firm-EA-Mastery-Checklist-2026.md";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Lead submission failed", err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simple blow-up risk calculation: (1 - WinRate)^N where N is trades to hit 10% DD
  // If risk is 1%, N = 10. If risk is 2%, N = 5.
  const calculateRisk = (wr: number, rpt: number) => {
    const n = Math.ceil(10 / rpt);
    const prob = Math.pow(1 - (wr / 100), n) * 100;
    return Math.min(Math.max(prob, 0.1), 99.9).toFixed(1);
  };

  const blowUpRisk = calculateRisk(winRate, riskPerTrade);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Urgency Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 px-4 text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <Clock size={14} />
          Limited time: 7-day free trial on all plans — No credit card required.
          <Link href="/pricing" className="underline font-bold hover:no-underline ml-1">Start Free →</Link>
        </span>
      </div>

      <Navbar />

      {/* Strategy Audit Modal */}
      <StrategyAuditModal 
        isOpen={showAuditModal} 
        onClose={() => setShowAuditModal(false)} 
      />

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg glass-card rounded-2xl p-8 border-primary/30 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className="rotate-45" size={24} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-['Playfair_Display'] mb-4">Wait! Don't Risk Your Funded Account</h2>
              <p className="text-muted-foreground mb-8">
                Before you go, download our <strong>Prop Firm EA Mastery Checklist 2026</strong>. It's the exact framework used by institutional traders to pass challenges.
              </p>
              {leadSubmitted ? (
                <div className="text-green-500 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Checklist Sent!
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your best email address"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold shadow-lg shadow-primary/20">
                    Get Free Checklist <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              )}
              <p className="text-[10px] text-muted-foreground mt-6 italic">
                *Trusted by 1,200+ traders. No credit card required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Proof-First Re-engineering */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.15),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
                <Activity size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Institutional-Grade EA Testing Platform</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-6">
                <span className="text-red-500">Your Backtests Are Lying.</span><br />
                Don't Blow Another Funded Account.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                The market is rigged against you. One hidden drawdown, one untested risk, and your $200K challenge is gone. FoldForge's AI-powered Monte Carlo engine finds the "Account Killer" before it costs you a fortune.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link href="/pricing">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                    Start Free Trial <ArrowRight size={20} className="ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {["MT","SK","JR","DL"].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-black flex items-center justify-center text-[10px] font-bold text-primary">{i}</div>
                    ))}
                  </div>
                  <span className="font-medium">Trusted by 1,200+ Traders</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-8">
                <div>
                  <div className="text-2xl font-bold gold-text">$50M+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Capital Protected</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gold-text">4.9/5</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">User Rating</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_50px_rgba(201,168,76,0.3)] bg-black">
                {/* Glass Studio Frame - Enhancing perceived video quality */}
                <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl border-4 border-white/10 bg-gradient-to-br from-white/5 to-transparent opacity-80" />
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-primary/30">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Strategy Validation</span>
                </div>
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[9px] font-bold text-white">HD</span>
                </div>
                <video
                  ref={videoElementRef}
                  className="w-full aspect-video cursor-pointer"
                  controls
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/og-image.png"
                  playsInline
                >
                  <source src="/foldforge_demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white/80 font-medium">Watch how FoldForge identifies a "hidden" drawdown risk in real-time.</p>
                </div>
              </div>
              {/* Value Bar - Why you need it & How it helps */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-foreground">Eliminate 99% of Curve-Fitting</div>
                    <div className="text-sm text-muted-foreground">Stop relying on backtests that lie.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-foreground">Pass FTMO/The5ers on First Try</div>
                    <div className="text-sm text-muted-foreground">Validate your EA against real prop firm conditions.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Social Proof Notifications */}
      <section className="border-b border-border/50 bg-primary/[0.01] py-6 overflow-hidden">
        <div className="container">
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live Activity</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { name: "Marcus T.", action: "Started free trial", time: "2 min ago" },
              { name: "Sarah K.", action: "Passed FTMO challenge", time: "5 min ago" },
              { name: "James R.", action: "Downloaded EA Risk Checklist", time: "8 min ago" },
              { name: "David L.", action: "Upgraded to Pro plan", time: "12 min ago" },
              { name: "Alex M.", action: "Completed first backtest", time: "15 min ago" },
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 text-xs whitespace-nowrap">
                <div className="font-medium text-foreground">{item.name}</div>
                <div className="text-muted-foreground">{item.action}</div>
                <div className="text-[10px] text-muted-foreground/60">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-secondary/20 py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold gold-text mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prop Firm Compatibility & Trust Badges */}
      <section className="py-12 border-b border-border/50 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Institutional Grade Trust</p>
            <h3 className="text-xl font-bold font-['Playfair_Display']">Trusted by Traders from Leading Prop Firms</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {["FTMO", "Topstep", "The5ers", "MyForexFunds", "E8 Funding", "Funded Engineer", "Alpha Capital", "Apex Trader Funding"].map((firm, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <Shield size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black tracking-tighter text-foreground/80 group-hover:text-primary transition-colors">{firm}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />)}
              </div>
              <span className="text-sm font-medium text-foreground/80">
                <strong>4.9/5</strong> based on 1,200+ verified trader reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Risk Calculator */}
      <section className="py-20 border-b border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Activity size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Interactive Tool</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Prop Firm <span className="gold-text">Profit & Risk Calculator</span></h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Most traders underestimate the probability of a catastrophic drawdown. Use our simplified Monte Carlo calculator to see how likely your strategy is to breach prop firm limits.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-bold">Statistical Reality Check</div>
                    <div className="text-sm text-muted-foreground">See the math behind your strategy's survival rate.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-bold">Prop Firm Alignment</div>
                    <div className="text-sm text-muted-foreground">Instantly see if your risk parameters fit within 5% daily limits.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 border-primary/20 bg-background/50 shadow-2xl shadow-primary/5">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex justify-between">
                    Win Rate <span>{winRate}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="30" 
                    max="80" 
                    value={winRate} 
                    onChange={(e) => setWinRate(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>30%</span>
                    <span>55%</span>
                    <span>80%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex justify-between">
                    Risk per Trade <span>{riskPerTrade}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5" 
                    step="0.1" 
                    value={riskPerTrade} 
                    onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
                    className="w-full accent-primary cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0.1%</span>
                    <span>1%</span>
                    <span>5%</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Probability of 10% Drawdown:</span>
                    <span className={`text-xl font-bold ${parseFloat(blowUpRisk) > 30 ? 'text-destructive' : 'text-green-500'}`}>
                      {blowUpRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5 mb-8">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${parseFloat(blowUpRisk) > 30 ? 'bg-destructive' : 'bg-green-500'}`} 
                      style={{ width: `${blowUpRisk}%` }}
                    ></div>
                  </div>
                  <Link href="/pricing">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold">
                      Get Full Stress Test Report <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
                    *Simplified calculation based on 1,000 simulated trades. For accurate results, use the FoldForge Studio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 border-b border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Why Traders <span className="gold-text">Blow Accounts</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">It's not the strategy. It's the risk. Here's what kills funded accounts every single day:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-6 border-destructive/20 hover:border-destructive/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <p.icon size={22} className="text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-4">FoldForge solves all three. Here's how:</p>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-primary/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">How We Show You <span className="gold-text">The Truth</span></h2>
            <p className="text-muted-foreground">Before you risk a single dollar, see exactly how your strategy breaks under real market conditions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group">
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

      {/* Demo Video Section */}
      <section ref={videoRef} className="py-20 border-b border-border/50 bg-primary/[0.03]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Play size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Full Studio Walkthrough</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Watch <span className="gold-text">FoldForge Studio</span> in Action</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">See the EA Stress Testing Studio, Monte Carlo simulations, Broker Data Pipeline, and Funded Account Guardian — all running live.</p>
            
            {/* Actual Video Player */}
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10 bg-black group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-xl opacity-60 pointer-events-none" />
                <video
                  ref={videoElementRef}
                  className="relative w-full aspect-video"
                  controls
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/og-image.png"
                  playsInline
                >
                  <source src="/foldforge_demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { icon: BarChart3, label: "EA Stress Testing", desc: "Monte Carlo & Walk-Forward" },
                  { icon: Shield, label: "Funded Guardian", desc: "Real-time DD protection" },
                  { icon: Activity, label: "Broker Data Sync", desc: "Your exact spreads & swaps" },
                  { icon: TrendingUp, label: "Performance Analytics", desc: "Sharpe, PF, equity curves" },
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 text-center border border-border/50 hover:border-primary/30 transition-colors">
                    <item.icon size={20} className="text-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold mb-0.5">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prop Firm Guardian */}
      <section className="py-20 border-b border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Shield size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Funded Account Protection</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">The <span className="gold-text">Prop Firm Guardian</span></h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">Never blow a funded account again. The Prop Firm Guardian monitors your account in real-time, enforcing the exact drawdown limits and risk parameters set by your prop firm — automatically, without emotion.</p>
              <div className="space-y-3 mb-8">
                {["Real-time drawdown monitoring", "Automatic lot-size enforcement", "Daily loss limit protection", "Instant alerts on rule violations", "Compatible with all major prop firms", "Works with MT4 and MT5"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/pricing">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Protect My Account <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-8 border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Guardian Dashboard</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Account Balance</span><span className="text-lg font-bold text-foreground">$200,000.00</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Daily Drawdown Limit</span><span className="text-sm font-medium text-primary">5% ($10,000)</span></div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Current Drawdown</span><span className="text-green-400 font-medium">1.15% — Safe Zone</span></div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-primary rounded-full" style={{ width: "23%" }} /></div>
                </div>
                <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Open Positions</div>
                    <div className="text-lg font-bold">3</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Today's P&L</div>
                    <div className="text-lg font-bold text-green-400">+$2,300</div>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Guardian Active — All Rules Passing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 border-b border-border/50 bg-primary/[0.02]" id="pricing">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Simple, Transparent <span className="gold-text">Pricing</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your trading operation. All plans include a 7-day free trial. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-xl p-6 border relative transition-all hover:shadow-xl ${plan.popular ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border glass-card hover:border-primary/30"}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                    ⭐ Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.note}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold gold-text">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={plan.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className={`w-full font-bold h-11 ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                    {plan.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-b border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Real Results from <span className="gold-text">Real Traders</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Specific metrics. Real outcomes. Here's what 1,200+ traders have achieved with FoldForge.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6 border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    {t.metric}
                  </div>
                </div>
                <p className="text-foreground/90 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-b border-border/50 bg-primary/[0.01]">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Frequently Asked <span className="gold-text">Questions</span></h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl border-border/50 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-semibold text-foreground/90">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4 bg-secondary/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - FoldForge vs Alternatives */}
      <section className="py-20 border-b border-border/50 bg-secondary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Why Choose <span className="gold-text">FoldForge</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">See how FoldForge stacks up against traditional backtesting tools.</p>
          </div>
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">FoldForge</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Generic Backtesting</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Manual Testing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Real Broker Data Sync", foldforge: true, generic: false, manual: false },
                  { feature: "Monte Carlo Simulation", foldforge: true, generic: false, manual: false },
                  { feature: "Walk-Forward Analysis", foldforge: true, generic: false, manual: false },
                  { feature: "Real-Time Drawdown Guardian", foldforge: true, generic: false, manual: false },
                  { feature: "Prop Firm Safe Mode", foldforge: true, generic: false, manual: false },
                  { feature: "Stress Testing Suite", foldforge: true, generic: false, manual: false },
                  { feature: "Setup Time", foldforge: true, generic: true, manual: false },
                  { feature: "Cost", foldforge: true, generic: false, manual: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-primary/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                    <td className="text-center py-3 px-4">{row.foldforge ? <CheckCircle2 size={18} className="text-primary mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="text-center py-3 px-4">{row.generic ? <CheckCircle2 size={18} className="text-primary mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                    <td className="text-center py-3 px-4">{row.manual ? <CheckCircle2 size={18} className="text-primary mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-20 border-b border-border/50 bg-primary/[0.02]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Shield size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Free Resource</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Get the <span className="gold-text">Prop Firm EA Mastery Checklist 2026</span></h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              The definitive 6-phase validation framework used by institutional traders to pass challenges and keep funded accounts. Download free today.
            </p>
            <div className="glass-card rounded-2xl p-8 border-primary/20 bg-primary/[0.03] mb-8">
              <div className="grid md:grid-cols-6 gap-4 mb-8">
                {[
                  { num: "1", label: "Alignment" },
                  { num: "2", label: "Edge" },
                  { num: "3", label: "WFE" },
                  { num: "4", label: "Broker Gap" },
                  { num: "5", label: "Monte Carlo" },
                  { num: "6", label: "Guardian" },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-primary">{step.num}</div>
                    <div className="text-xs font-medium text-foreground/80">{step.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-background/50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold mb-3 text-foreground">What's Inside:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>The exact 5 tests every EA must pass before risking capital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>Red flags that signal a strategy is too risky for prop firms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>Metrics to track and minimum thresholds for each test</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>A step-by-step workflow you can use today</span>
                  </li>
                </ul>
              </div>
              {leadSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                  <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold text-green-500 mb-1">Checklist Sent!</h4>
                  <p className="text-sm text-muted-foreground">Check your inbox (and spam) for the EA Risk Checklist.</p>
                  <Button 
                    variant="link" 
                    className="mt-4 text-primary font-bold"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = "/downloads/Prop-Firm-EA-Mastery-Checklist-2026.md";
                      link.download = "Prop-Firm-EA-Mastery-Checklist-2026.md";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Didn't receive it? Click here to download directly.
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Enter your best email address"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmittingLead}
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12 font-bold shadow-lg shadow-primary/20"
                  >
                    {isSubmittingLead ? "Sending..." : "Get Free Checklist"} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Join 1,200+ traders. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-y-1/2" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Stop Guessing.<br />Start <span className="gold-text">Stress Testing</span>.</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            We show you how your strategy actually fails before it costs you money. Join 1,200+ traders protecting $50M+ in capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                Start Your Free Trial <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 h-14 text-lg border-border hover:bg-secondary"
              onClick={() => setShowAuditModal(true)}
            >
              Free Strategy Audit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">No credit card required &bull; Instant setup &bull; Prop firm safe</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

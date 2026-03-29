import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Shield, Zap, BarChart3, Database, Lock, TrendingUp,
  CheckCircle2, ArrowRight, Star,
  Activity, AlertTriangle, Target, Play, Users, Clock, ChevronUp, ChevronDown,
  MousePointer2, ExternalLink
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
    description: "For solo traders validating their first EA",
    features: ["1 EA License", "Reference Data Access", "Basic Studio Runs", "Email Support", "Community Access"],
    cta: "Start Free Trial",
    note: "7-day free trial included"
  },
  {
    name: "Pro",
    price: 39,
    popular: true,
    link: STRIPE_LINKS.pro,
    description: "For active traders needing broker sync & analytics",
    features: ["5 EA Licenses", "Broker Data Sync", "Unlimited Studio Runs", "Priority Support", "Advanced Analytics", "Funded Account Guardian"],
    cta: "Start Free Trial",
    note: "Most chosen by funded traders"
  },
  {
    name: "Funded",
    price: 79,
    link: STRIPE_LINKS.funded,
    description: "For serious teams and prop firm workflows",
    features: ["25 EA Licenses", "Full Broker Pipeline", "White-Label Reports", "Dedicated Support", "API Access", "Custom Integrations", "Prop Firm Dashboard"],
    cta: "Start Free Trial",
    note: "For serious trading operations"
  },
];

const TESTIMONIALS = [
  { name: "Marcus T.", role: "FTMO Funded Trader", text: "FoldForge saved my $250K funded account. Monte Carlo testing caught a 7.2% hidden drawdown issue that would've blown everything in week one. Now I'm consistently profitable.", rating: 5, avatar: "MT", metric: "Saved $250K Account" },
  { name: "Sarah K.", role: "EA Developer", text: "My backtests now match live results within 2%. Passed 3 FTMO challenges in a row. The broker data sync eliminated the spread gap that was killing my strategies.", rating: 5, avatar: "SK", metric: "3 Challenges Passed" },
  { name: "James R.", role: "Quant Analyst", text: "Reduced strategy validation time from 14 days to 2 days. The stress testing suite caught edge cases my manual testing missed. ROI on subscription: 400%+.", rating: 5, avatar: "JR", metric: "10x Faster Validation" },
  { name: "David L.", role: "Fund Manager", text: "We validate every EA through FoldForge before deploying to client accounts. Drawdown protection has prevented 7 account blowups this year. Invaluable.", rating: 5, avatar: "DL", metric: "7 Accounts Protected" },
  { name: "Alex M.", role: "Prop Firm Trader", text: "Passed my first $100K FTMO challenge on the first try. The Guardian's real-time drawdown monitoring prevented 2 catastrophic trades. Best $39/month I've spent.", rating: 5, avatar: "AM", metric: "Challenge Passed" },
  { name: "Chen W.", role: "Algorithmic Trader", text: "Live results now match backtests within 3%. The broker data pipeline solved the spread/slippage problem that was costing me $500/month. Immediate ROI.", rating: 5, avatar: "CW", metric: "3% Accuracy Match" },
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
        setLeadSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Enhanced statistical calculation for 10 consecutive losses
  const lossRate = 1 - (winRate / 100);
  const blowUpRisk = (Math.pow(lossRate, 10) * 100).toFixed(1);
  
  // Calculate max drawdown potential based on risk per trade
  const maxDrawdown = (riskPerTrade * 10).toFixed(1);
  
  // Calculate probability of recovery
  const recoveryProbability = ((1 - Math.pow(lossRate, 5)) * 100).toFixed(1);
  
  // Advanced metrics for deeper engagement
  const expectedValue = ((winRate / 100) * 2 - (1 - winRate / 100)).toFixed(2); // Assuming 1:2 Risk/Reward
  const kellyCriterion = (winRate / 100 - (1 - winRate / 100) / 2).toFixed(2); // Suggested fractional Kelly
  const ruinProbability = (Math.pow((1 - (winRate / 100)) / (winRate / 100), 10) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section - Ultra Professional Redesign */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-black">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,oklch(0.82_0.12_85/0.12),transparent_70%)] blur-[100px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-secondary flex items-center justify-center overflow-hidden">
                      <Users size={12} className="text-primary/60" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                  Trusted by 1,200+ Elite Traders
                </span>
              </div>

              {/* Headline with High-Impact Typography */}
              <h1 className="text-5xl md:text-7xl font-bold font-['Playfair_Display'] leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Catch the <span className="gold-text italic">Hidden Risk</span> <br />
                <span className="text-white">That Blows Funded Accounts.</span>
              </h1>

              {/* Value Proposition */}
              <p className="text-xl md:text-2xl text-muted-foreground/90 mb-10 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                The institutional-grade <span className="text-foreground font-semibold">MT4/MT5 stress testing studio</span>. Validate your Expert Advisors with real broker data before the market exposes them.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 text-xl font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Start Free Trial <ArrowRight size={22} className="ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white/10 hover:bg-white/5 h-16 px-10 text-xl font-semibold backdrop-blur-sm transition-all hover:border-primary/40"
                  onClick={() => videoRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play size={20} className="mr-3 fill-current" /> Watch Demo
                </Button>
              </div>

              {/* Micro-Copy Proof */}
              <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground/70 animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-primary" />
                  </div>
                  <span className="font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-primary" />
                  </div>
                  <span className="font-medium">Instant License Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-primary" />
                  </div>
                  <span className="font-medium">MT4 & MT5 Compatible</span>
                </div>
              </div>
            </div>

            {/* Visual Showcase - Ultra Professional Dashboard Preview */}
            <div className="lg:col-span-5 relative perspective-1000 animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full opacity-30 animate-pulse" />
              
              <div className="relative group">
                {/* Main Dashboard Card */}
                <div className="relative glass-card rounded-3xl border-white/10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:rotate-y-2 group-hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 opacity-50" />
                  
                  {/* Dashboard Mockup Content */}
                  <div className="relative p-1 bg-white/5">
                    <img 
                      src="/hero-institutional.png" 
                      alt="FoldForge Institutional Trading Studio - Professional Multi-Monitor Setup" 
                      className="w-full h-auto rounded-2xl opacity-95 shadow-inner"
                      loading="lazy"
                    />
                  </div>

                  {/* Floating Professional Callouts */}
                  <div className="absolute top-6 right-6 flex flex-col gap-4">
                    <div className="bg-black/90 border border-red-500/40 rounded-xl p-4 backdrop-blur-md shadow-2xl animate-bounce-subtle">
                      <div className="flex items-center gap-3 mb-1">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Risk Warning</span>
                      </div>
                      <div className="text-sm font-bold text-white">Daily Drawdown Critical</div>
                    </div>
                  </div>

                  <div className="absolute bottom-10 -left-6 bg-black/90 border border-primary/40 rounded-xl p-5 backdrop-blur-md shadow-2xl animate-float">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 size={18} className="text-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Monte Carlo Run</span>
                    </div>
                    <div className="text-lg font-bold text-white">94.2% Success Rate</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Based on 10,000 iterations</div>
                  </div>

                  <div className="absolute top-1/4 -right-8 bg-black/90 border border-blue-500/40 rounded-xl p-4 backdrop-blur-md shadow-2xl animate-float-delayed">
                    <div className="flex items-center gap-3 mb-1">
                      <Database size={16} className="text-blue-400" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Broker Sync</span>
                    </div>
                    <div className="text-sm font-bold text-white">Spread Accuracy: 99.9%</div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Compact Proof */}
      <section className="py-10 border-y border-border/50 bg-secondary/10">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            {PROP_FIRMS.map((firm, i) => (
              <span key={i} className="text-xl font-black tracking-tighter text-foreground/80">{firm}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - Moved Higher for Better Conversion */}
      <section className="py-20 border-b border-border/50 bg-secondary/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Why Choose <span className="gold-text">FoldForge</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Traditional backtesting is a silent killer. See how FoldForge protects your capital.</p>
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

      {/* Calculator Section */}
      <section className="py-20 border-b border-border/50 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] -z-10" />
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">Prop Firm <span className="gold-text">Profit & Risk</span> Calculator</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">Most traders fail because they don't understand the statistical probability of a losing streak. Use this tool to see the "Account Killer" risk in your current strategy.</p>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Strategy Win Rate</span>
                    <span className="text-primary">{winRate}%</span>
                  </div>
                  <input 
                    type="range" min="30" max="80" value={winRate} 
                    onChange={(e) => setWinRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Risk Per Trade</span>
                    <span className="text-primary">{riskPerTrade}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="5" step="0.1" value={riskPerTrade} 
                    onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card rounded-2xl p-8 border-primary/30 shadow-2xl shadow-primary/5">
                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Probability of 10 Consecutive Losses</div>
                  <div className={`text-5xl font-black mb-2 ${parseFloat(blowUpRisk) > 30 ? 'text-red-500' : 'gold-text'}`}>
                    {blowUpRisk}%
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {parseFloat(blowUpRisk) > 30 ? '⚠️ HIGH ACCOUNT BLOWUP RISK' : '✅ STATISTICALLY STABLE'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-sm text-muted-foreground">Max Drawdown Potential</span>
                    <span className="font-bold text-foreground">{maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <span className="text-sm text-muted-foreground">Recovery Probability (5 Losses)</span>
                    <span className="font-bold text-green-500">{recoveryProbability}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="text-[10px] text-muted-foreground uppercase mb-1">Expected Value (1:2 RR)</div>
                      <div className="text-lg font-bold text-primary">{expectedValue}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <div className="text-[10px] text-muted-foreground uppercase mb-1">Kelly Criterion</div>
                      <div className="text-lg font-bold text-primary">{kellyCriterion}</div>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
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

      {/* Demo Video Section - Optimized Placement and Size */}
      <section ref={videoRef} className="py-24 border-b border-border/50 bg-primary/[0.03]">
        <div className="container">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Play size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Full Studio Walkthrough</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6">Watch <span className="gold-text">FoldForge Studio</span> in Action</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">See the EA Stress Testing Studio, Monte Carlo simulations, Broker Data Pipeline, and Funded Account Guardian — all running live in one powerful environment.</p>
            
            <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20 bg-black group max-w-6xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-2xl opacity-60 pointer-events-none" />
              <video
                ref={videoElementRef}
                className="relative w-full aspect-video scale-[1.01]"
                controls
                autoPlay
                muted
                loop
                preload="metadata"
                poster="/aureus-prime-trade-1.webp"
                playsInline
              >
                <source src="/foldforge_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { icon: BarChart3, label: "EA Stress Testing", desc: "Monte Carlo & Walk-Forward" },
                { icon: Shield, label: "Funded Guardian", desc: "Real-time DD protection" },
                { icon: Activity, label: "Broker Data Sync", desc: "Your exact spreads & swaps" },
                { icon: TrendingUp, label: "Performance Analytics", desc: "Sharpe, PF, equity curves" },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 text-center border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <item.icon size={24} className="text-primary mx-auto mb-3" />
                  <div className="text-base font-bold mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
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

      {/* Pricing - Optimized with Plan Fit */}
      <section className="py-20 border-b border-border/50 bg-primary/[0.02]" id="pricing">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Simple, Transparent <span className="gold-text">Pricing</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">7-day free trial. No credit card required. Cancel anytime.</p>
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
                <p className="text-xs text-primary font-medium mb-2">{plan.description}</p>
                <p className="text-[10px] text-muted-foreground mb-4">{plan.note}</p>
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

      {/* Testimonials - Enhanced with Specificity */}
      <section className="py-20 border-b border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Real Results from <span className="gold-text">Real Traders</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Specific metrics. Real outcomes. Here's what 1,200+ traders have achieved with FoldForge.</p>
            <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground/70">
              <div className="flex items-center gap-2"><span className="text-lg font-bold text-primary">$50M+</span> Capital Protected</div>
              <div className="flex items-center gap-2"><span className="text-lg font-bold text-primary">4.9/5</span> Average Rating</div>
              <div className="flex items-center gap-2"><span className="text-lg font-bold text-primary">99.9%</span> Uptime SLA</div>
            </div>
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
      <section className="py-20 border-b border-border/50 bg-primary/[0.01]" id="faq">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Frequently Asked <span className="gold-text">Questions</span></h2>
            <p className="text-muted-foreground">Everything you need to know about the FoldForge platform.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl border border-border/50 overflow-hidden transition-all hover:border-primary/20">
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.82_0.12_85/0.1),transparent_70%)]" />
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-8">Stop Guessing. <span className="gold-text">Start Stress Testing.</span></h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Join 1,200+ traders who use FoldForge to protect their capital and validate their strategies.</p>
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-12 text-xl font-bold shadow-2xl shadow-primary/20">
                Get Started Now <ArrowRight size={22} className="ml-2" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground/60 font-medium">No credit card required • 7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Audit Modal */}
      <StrategyAuditModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </div>
  );
}

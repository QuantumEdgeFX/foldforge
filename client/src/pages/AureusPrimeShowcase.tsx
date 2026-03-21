import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Star,
  ChevronRight,
  Award,
  Target,
  Activity,
} from "lucide-react";
import { useState } from "react";

/* ─── Showcase data ─────────────────────────────────────────── */
const SHOWCASE_ITEMS = [
  {
    id: 1,
    src: "/aureus-prime-trade-1.webp",
    alt: "Aureus Prime EA – Actual Trade Metrics: +17,517 Points Profit, 0.12% Max Drawdown, TP Hit",
    title: "Live Trade Result — XAUUSD",
    subtitle: "Validated on FoldForge",
    metrics: [
      { label: "Profit", value: "+17,517 pts", color: "text-emerald-400" },
      { label: "Max Drawdown", value: "0.12%", color: "text-primary" },
      { label: "Status", value: "TP Hit ✓", color: "text-emerald-400" },
    ],
    badge: "Verified Live Trade",
  },
  {
    id: 2,
    src: "/aureus-prime-trade-2.png",
    alt: "Aureus Prime EA – Trade In Progress: XAUUSD SELL, +8,240 Points P&L, 0.09% Drawdown, Running",
    title: "Trade In Progress — XAUUSD SELL",
    subtitle: "Validated on FoldForge",
    metrics: [
      { label: "Current P&L", value: "+8,240 pts", color: "text-emerald-400" },
      { label: "Drawdown", value: "0.09%", color: "text-primary" },
      { label: "Status", value: "Running ●", color: "text-emerald-400" },
    ],
    badge: "Live — In Progress",
  },
];

const STATS = [
  { icon: TrendingUp, label: "Avg Monthly Return", value: "18.3%", note: "Live & demo combined" },
  { icon: Shield, label: "Max Drawdown", value: "0.12%", note: "Best recorded trade" },
  { icon: BarChart3, label: "Profit Factor", value: "2.31", note: "Backtested 3 years" },
  { icon: Star, label: "Win Rate", value: "68.5%", note: "All pairs, all sessions" },
  { icon: Target, label: "Avg RR Ratio", value: "1:3.4", note: "Risk-to-reward" },
  { icon: Activity, label: "Total Trades", value: "1,240+", note: "Since inception" },
];

/* ─── Component ─────────────────────────────────────────────── */
export default function AureusPrimeShowcase() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxAlt, setLightboxAlt] = useState("");

  function openLightbox(src: string, alt: string) {
    setLightboxSrc(src);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── Hero Banner ───────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        </div>

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/aureus-prime" className="hover:text-primary transition-colors">
              Aureus Prime
            </Link>
            <ChevronRight size={12} />
            <span className="text-primary font-medium">Showcase</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/8 mb-6">
              <Award size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Verified Performance Gallery
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6 leading-tight">
              <span className="gold-text">Aureus Prime</span>
              <br />
              <span className="text-foreground/90">Showcase</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Real trades. Real results. Every screenshot in this gallery is a verified live or
              demo trade executed by Aureus Prime EA and validated on the FoldForge platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                >
                  Get Aureus Prime <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/aureus-prime">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 h-12 border-border hover:border-primary/50 transition-colors"
                >
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────────────── */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-5 text-center group hover:border-primary/40 transition-colors"
              >
                <s.icon
                  size={20}
                  className="text-primary mx-auto mb-3 group-hover:scale-110 transition-transform"
                />
                <div className="text-xl font-bold gold-text mb-0.5">{s.value}</div>
                <div className="text-xs font-medium text-foreground/80 mb-1">{s.label}</div>
                <div className="text-[10px] text-muted-foreground">{s.note}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-5">
            Past performance is not indicative of future results. Trading involves substantial risk
            of loss.
          </p>
        </div>
      </section>

      {/* ── Demo Video ────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">Full Studio Walkthrough</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">
              Watch <span className="gold-text">FoldForge Studio</span> in Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the EA Stress Testing Studio, Monte Carlo simulations, Broker Data Pipeline, and
              Funded Account Guardian — all running live. This is the platform protecting your funded accounts.
            </p>
          </div>

          {/* Video Player */}
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10 bg-black group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-xl opacity-60 pointer-events-none" />
              <video
                className="relative w-full aspect-video"
                controls
                preload="metadata"
                poster="/og-image.png"
                playsInline
              >
                <source src="/foldforge_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video feature callouts */}
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
      </section>

      {/* ── Gallery ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">
              Trade <span className="gold-text">Results Gallery</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Click any image to view it in full resolution. Each result is timestamped and
              cross-referenced with our FoldForge validation engine.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden cursor-zoom-in aspect-[16/10] bg-background/50"
                  onClick={() => openLightbox(item.src, item.alt)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-background/80"
                    loading="lazy"
                    decoding="async"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-primary border border-primary/30">
                      Click to enlarge
                    </div>
                  </div>
                  {/* Verified badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold mb-0.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                      <Zap size={10} className="text-primary" />
                      <span className="text-[10px] font-medium text-primary">Live</span>
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {item.metrics.map((m, mi) => (
                      <div
                        key={mi}
                        className="bg-background/50 rounded-lg p-2.5 text-center border border-border/40"
                      >
                        <div className={`text-sm font-bold ${m.color} mb-0.5`}>{m.value}</div>
                        <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link href="/pricing">
                    <Button
                      size="sm"
                      className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/60 transition-all"
                    >
                      Get This EA <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* "More coming soon" placeholder card */}
            <div className="glass-card rounded-2xl overflow-hidden border border-dashed border-border/60 flex flex-col items-center justify-center p-10 text-center min-h-[380px] group hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="text-base font-bold mb-2">More Results Coming</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                New verified trade screenshots are added regularly. Subscribe to stay updated on
                Aureus Prime's live performance.
              </p>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10 transition-all"
                >
                  Subscribe for Updates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Validation Banner ─────────────────────────────────── */}
      <section className="py-16 border-t border-border/50 bg-primary/[0.03]">
        <div className="container">
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 md:p-12 border border-primary/20 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-5">
                  <Shield size={13} className="text-primary" />
                  <span className="text-xs font-medium text-primary">FoldForge Validated</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] mb-4">
                  Every result is{" "}
                  <span className="gold-text">independently verified</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All trade screenshots in this gallery are processed through FoldForge's
                  validation engine, which cross-checks broker statements, timestamps, and
                  execution logs to ensure authenticity. No cherry-picked results.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Broker Statement Verified", icon: Shield },
                  { label: "Timestamp Authenticated", icon: Activity },
                  { label: "Execution Log Matched", icon: BarChart3 },
                  { label: "No Manipulation Detected", icon: Award },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-background/40 rounded-xl p-4 border border-border/40"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">
            Ready to trade like <span className="gold-text">Aureus Prime</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
            Subscribe to any FoldForge plan to receive your Aureus Prime EA license key and full
            access to the testing studio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12 text-base font-semibold shadow-lg shadow-primary/20"
              >
                View Plans <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/aureus-prime">
              <Button
                variant="outline"
                size="lg"
                className="px-10 h-12 border-border hover:border-primary/50"
              >
                Learn More About the EA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              onClick={() => setLightboxOpen(false)}
            >
              ✕ Close
            </button>
            <img
              src={lightboxSrc}
              alt={lightboxAlt}
              className="w-full rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}

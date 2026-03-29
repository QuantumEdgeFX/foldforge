import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, BarChart3 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOGO_URL = "/logo.webp";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aureusDdOpen, setAureusDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setAureusDdOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAureusActive =
    location === "/aureus-prime" || location === "/aureus-prime/showcase";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src={LOGO_URL} alt="FoldForge Home" className="w-8 h-8 rounded cursor-pointer" title="Back to Home" />
          <span className="text-lg font-bold gold-text font-['Playfair_Display'] cursor-pointer">FoldForge</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/pricing" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Pricing
          </Link>

          {/* Studio Dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                location.startsWith("/studio") || location.includes("testing") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Studio
              <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-3 w-64 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
              {[
                { title: "EA Stress Testing", href: "/ea-stress-testing", desc: "Monte Carlo & Stress Scenarios" },
                { title: "Monte Carlo Simulation", href: "/monte-carlo-simulation-ea", desc: "Statistical Edge Validation" },
                { title: "Walk-Forward Analysis", href: "/walk-forward-analysis-mt5", desc: "Overfitting Detection" },
                { title: "MQ5 Code Review", href: "/mq5-code-review", desc: "AI-Powered Risk Audit" },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="flex flex-col px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                  <span className="text-sm font-bold text-foreground">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Aureus Prime dropdown */}
          <div className="relative" ref={ddRef}>
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isAureusActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setAureusDdOpen((v) => !v)}
            >
              Aureus Prime
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${aureusDdOpen ? "rotate-180" : ""}`}
              />
            </button>

            {aureusDdOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl shadow-background/50 overflow-hidden z-50">
                {/* Arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-background/95 border-l border-t border-border/60" />

                <Link
                  href="/aureus-prime"
                  className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 transition-colors border-b border-border/40 ${
                    location === "/aureus-prime" ? "text-primary" : "text-foreground/80"
                  }`}
                  onClick={() => setAureusDdOpen(false)}
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">AP</span>
                  </div>
                  <div>
                    <div className="font-medium leading-none mb-0.5">Overview</div>
                    <div className="text-[10px] text-muted-foreground">Features & specs</div>
                  </div>
                </Link>

                <Link
                  href="/aureus-prime/showcase"
                  className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 transition-colors ${
                    location === "/aureus-prime/showcase" ? "text-primary" : "text-foreground/80"
                  }`}
                  onClick={() => setAureusDdOpen(false)}
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium leading-none mb-0.5">
                      Showcase
                      <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-semibold uppercase tracking-wide">
                        New
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Verified trade results</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/docs"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/docs" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Docs
          </Link>

          <Link
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/blog" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Blog
          </Link>

          <Link
            href="/support"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/support" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Support
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/studio">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Open Studio
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/pricing">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-3">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>

            <Link
              href="/aureus-prime"
              className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              Aureus Prime — Overview
            </Link>

            <Link
              href="/aureus-prime/showcase"
              className={`text-sm font-medium py-2 flex items-center gap-2 ${
                location === "/aureus-prime/showcase"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <BarChart3 size={14} />
              Aureus Prime — Showcase
              <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-semibold uppercase tracking-wide">
                New
              </span>
            </Link>

            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              Docs
            </Link>

            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>

            <Link
              href="/support"
              className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              Support
            </Link>

            <div className="border-t border-border pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Link href="/studio" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full bg-primary text-primary-foreground">Open Studio</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full bg-primary text-primary-foreground">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

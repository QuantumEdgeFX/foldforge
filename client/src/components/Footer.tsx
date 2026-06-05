import { Link } from "wouter";
import { Twitter, Youtube, Linkedin, Mail, Phone, MapPin, Shield, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/lib/i18n";

const LOGO_URL = "/logo.webp";

export default function Footer() {
  const { currentLanguage } = useLanguage();
  const getLink = (path: string) => getLocalizedPath(path, currentLanguage);

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={LOGO_URL} alt="FoldForge" className="w-8 h-8 rounded" />
              <span className="text-xl font-bold gold-text font-['Playfair_Display']">FoldForge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Institutional-grade EA stress testing, broker data synchronization, and real-time risk management for MetaTrader traders.
            </p>
            {/* Trust Badges */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
                <Shield size={12} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
                <Lock size={12} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">256-bit Encrypted</span>
              </div>
            </div>
            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Giddings Capital Management LLC</p>
                  <p className="text-xs text-muted-foreground">1209 Mountain Road Pl NE Ste N</p>
                  <p className="text-xs text-muted-foreground">Albuquerque, NM 87110 USA</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-muted-foreground shrink-0" />
                <a href="tel:+15052301932" className="text-xs text-muted-foreground hover:text-primary transition-colors">(505) 230-1932</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-muted-foreground shrink-0" />
                <a href="mailto:support@foldforge.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">support@foldforge.com</a>
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href="https://twitter.com/foldforge" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors">
                <Twitter size={14} />
              </a>
              <a href="https://youtube.com/@foldforge" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors">
                <Youtube size={14} />
              </a>
              <a href="https://linkedin.com/company/foldforge" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors">
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href={getLink("/")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href={getLink("/pricing")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link href={getLink("/studio")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Studio</Link>
              <Link href={getLink("/aureus-prime")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Aureus Prime EA</Link>
              <Link href={getLink("/aureus-prime/showcase")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Live Showcase</Link>
              <Link href={getLink("/academy")} className="text-sm text-primary font-bold hover:text-primary transition-colors">Academy</Link>
              <Link href={getLink("/docs")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
              <Link href={getLink("/blog")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              <Link href={getLink("/founder")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Founder</Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Solutions</h4>
            <div className="flex flex-col gap-2.5">
              <Link href={getLink("/ea-stress-testing")} className="text-sm text-muted-foreground hover:text-primary transition-colors">EA Stress Testing</Link>
              <Link href={getLink("/monte-carlo-simulation-ea")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Monte Carlo Simulation</Link>
              <Link href={getLink("/walk-forward-analysis-mt5")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Walk-Forward Analysis</Link>
              <Link href={getLink("/mq5-code-review")} className="text-sm text-muted-foreground hover:text-primary transition-colors">MQ5 Code Review</Link>
              <Link href={getLink("/ea-parameter-optimization")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Parameter Optimization</Link>
              <Link href={getLink("/best-ea-for-funded-accounts")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Best EA for Funded Accounts</Link>
              <Link href={getLink("/funded-account-risk-management")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Funded Account Risk Management</Link>
              <Link href={getLink("/automated-trading-platform")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Automated Trading Platform</Link>
              <Link href={getLink("/metatrader-risk-management-tool")} className="text-sm text-muted-foreground hover:text-primary transition-colors">MetaTrader Risk Management</Link>
              <Link href={getLink("/support")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link href={getLink("/terms")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href={getLink("/privacy")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href={getLink("/refund-policy")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
              <Link href={getLink("/disclaimer")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Risk Disclaimer</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Giddings Capital Management LLC. All rights reserved. Registered in New Mexico, USA.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/50">
              <span className="h-px w-4 bg-primary/30" />
              God-Mode Optimized v2.6
              <span className="h-px w-4 bg-primary/30" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
            Trading involves substantial risk of loss. Past performance is not indicative of future results. FoldForge is a software tool and does not provide financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

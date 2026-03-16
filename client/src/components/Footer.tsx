import { Link } from "wouter";

const LOGO_URL = "/logo.webp";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={LOGO_URL} alt="FoldForge" className="w-7 h-7 rounded" />
              <span className="text-lg font-bold gold-text font-['Playfair_Display']">FoldForge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Institutional-grade EA testing and risk management for MetaTrader traders.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Giddings Capital Management LLC</p>
              <p className="text-xs text-muted-foreground">1209 Mountain Road Pl NE Ste N</p>
              <p className="text-xs text-muted-foreground">Albuquerque, NM 87110 USA</p>
              <p className="text-xs text-muted-foreground mt-2">
                Phone: <a href="tel:+15052301932" className="hover:text-primary">(505) 230-1932</a>
              </p>
              <p className="text-xs text-muted-foreground">
                Email: <a href="mailto:support@foldforge.com" className="hover:text-primary">support@foldforge.com</a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Home</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link href="/studio" className="text-sm text-muted-foreground hover:text-primary transition-colors">Studio</Link>
              <Link href="/aureus-prime" className="text-sm text-muted-foreground hover:text-primary transition-colors">Aureus Prime EA</Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
              <Link href="/funded-account-risk-management" className="text-sm text-muted-foreground hover:text-primary transition-colors">Funded Account Risk Management</Link>
              <Link href="/automated-trading-platform" className="text-sm text-muted-foreground hover:text-primary transition-colors">Automated Trading Platform</Link>
              <Link href="/expert-advisor-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">Expert Advisor Builder</Link>
              <Link href="/metatrader-risk-management-tool" className="text-sm text-muted-foreground hover:text-primary transition-colors">MetaTrader Risk Management Tool</Link>
              <Link href="/ea-stress-testing" className="text-sm text-muted-foreground hover:text-primary transition-colors">EA Stress Testing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
              <a href="mailto:support@foldforge.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@foldforge.com</a>
              <a href="tel:+15052301932" className="text-sm text-muted-foreground hover:text-primary transition-colors">(505) 230-1932</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
              <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Risk Disclaimer</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Giddings Capital Management LLC. All rights reserved. Registered in New Mexico, USA.
          </p>
          <p className="text-xs text-muted-foreground">
            Trading involves substantial risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}

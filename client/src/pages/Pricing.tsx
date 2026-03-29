import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/9B6bJ11ITaEd7TJ6MBb3q02",
  pro: "https://buy.stripe.com/aFa14n3R1cMl6PF2wlb3q01",
  funded: "https://buy.stripe.com/28EaEX73deUtc9Z5Ixb3q03",
};

const PLANS = [
  {
    name: "Starter", price: 19, desc: "For individual traders getting started with EA testing.",
    features: ["1 EA License Key", "Reference Data Access (172+ symbols)", "5 Studio Runs / Month", "Advanced Performance Metrics", "Email Support", "Community Forum Access", "7-Day Free Trial"],
    stripeLink: STRIPE_LINKS.starter,
    activations: "1 device",
  },
  {
    name: "Pro", price: 39, popular: true, desc: "For serious traders who need broker-specific data and unlimited testing.",
    features: ["5 EA License Keys", "Full Broker Data Sync (MT4/MT5)", "Unlimited Studio Runs", "Advanced Analytics & Reports", "Monte Carlo Simulations", "Walk-Forward Analysis", "Priority Support", "Funded Account Guardian", "7-Day Free Trial"],
    stripeLink: STRIPE_LINKS.pro,
    activations: "5 devices",
  },
  {
    name: "Funded", price: 79, desc: "For prop firm traders and fund managers who need everything.",
    features: ["25 EA License Keys", "Full Broker Data Pipeline", "White-Label PDF Reports", "Parameter Sweep Optimization", "Dedicated Account Manager", "API Access", "Custom Integrations", "Prop Firm Dashboard", "Phone Support", "7-Day Free Trial"],
    stripeLink: STRIPE_LINKS.funded,
    activations: "25 devices",
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-4">
              Choose Your <span className="gold-text">Trading Edge</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All plans include a 7-day free trial. Start your trial today and cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border ${plan.popular ? "border-primary bg-primary/5 relative shadow-lg shadow-primary/10" : "border-border glass-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{plan.desc}</p>
                <p className="text-xs text-primary mb-6">Up to {plan.activations}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold gold-text">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={plan.stripeLink} target="_blank" rel="noopener noreferrer">
                  <Button className={`w-full h-11 ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    Start 7-Day Free Trial <ArrowRight size={16} className="ml-2" />
                  </Button>
                </a>
              </div>
            ))}
          </div>

          {/* Detailed Comparison Table */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-4">Compare <span className="gold-text">Plans</span></h2>
              <p className="text-muted-foreground">Find the perfect fit for your trading operation.</p>
            </div>
            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-foreground">Starter</th>
                    <th className="text-center py-4 px-6 font-semibold text-primary">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold text-foreground">Funded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {[
                    { f: "EA License Keys", s: "1", p: "5", f: "25" },
                    { f: "Studio Runs / Month", s: "5", p: "Unlimited", f: "Unlimited" },
                    { f: "Broker Data Sync", s: "❌", p: "✅", f: "✅" },
                    { f: "Monte Carlo Simulation", s: "❌", p: "✅", f: "✅" },
                    { f: "Walk-Forward Analysis", s: "❌", p: "✅", f: "✅" },
                    { f: "Funded Account Guardian", s: "❌", p: "✅", f: "✅" },
                    { f: "White-Label Reports", s: "❌", p: "❌", f: "✅" },
                    { f: "API Access", s: "❌", p: "❌", f: "✅" },
                    { f: "Support Level", s: "Email", p: "Priority", f: "Dedicated" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="py-4 px-6 text-muted-foreground">{row.f}</td>
                      <td className="py-4 px-6 text-center font-medium">{row.s}</td>
                      <td className="py-4 px-6 text-center font-bold text-primary">{row.p}</td>
                      <td className="py-4 px-6 text-center font-medium">{row.f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-4">Pricing <span className="gold-text">FAQ</span></h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately." },
                { q: "What happens after the 7-day trial?", a: "If you don't cancel during the trial period, your selected plan will automatically begin. We'll send you a reminder 2 days before the trial ends." },
                { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on all initial subscriptions if you're not satisfied with the platform." },
              ].map((faq, i) => (
                <div key={i} className="glass-card rounded-xl p-6 border-border/50">
                  <h4 className="font-bold mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              All prices in USD. Subscriptions are billed monthly. You can upgrade, downgrade, or cancel at any time.
            </p>
            {!isAuthenticated && (
              <p className="text-muted-foreground text-sm">
                Don't have an account yet?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">Create one first</Link>, then subscribe.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

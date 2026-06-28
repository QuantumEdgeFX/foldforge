import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, ArrowRight, X, Activity } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

interface StrategyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StrategyAuditModal({ isOpen, onClose }: StrategyAuditModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    trackFormSubmission("strategy_audit", false, ["email"]);
    try {
      const res = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "strategy_audit_modal" }),
      });
      if (res.ok) {
        trackFormSubmission("strategy_audit", true, ["email"]);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Audit request failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden border-primary/30 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X size={24} />
        </button>
        
        <div className="grid md:grid-cols-2">
          <div className="bg-primary/10 p-8 flex flex-col justify-center border-r border-border/50">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Activity size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-['Playfair_Display'] mb-4">Free Strategy Audit</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Get a professional risk assessment of your Expert Advisor. Our team will analyze your strategy's drawdown profile and prop firm compatibility.
            </p>
            <div className="space-y-3">
              {[
                "Monte Carlo Risk Analysis",
                "Broker Data Gap Check",
                "Prop Firm Rule Alignment",
                "Parameter Sensitivity Report"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle2 size={14} className="text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-8 flex flex-col justify-center bg-background">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Request Received!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Our analysts will reach out to you within 24 hours to begin your audit.
                </p>
                <Button onClick={onClose} className="w-full">Close</Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">Secure Your Audit Slot</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Limited to 5 audits per week to ensure institutional-grade quality.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-bold shadow-lg shadow-primary/20"
                  >
                    {loading ? "Processing..." : "Request Free Audit"} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
                <p className="text-[10px] text-muted-foreground mt-6 text-center italic">
                  *Your data is encrypted and never shared with third parties.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

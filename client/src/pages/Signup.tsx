import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent } from "@/components/ui/card";
  import { Link } from "wouter";
  import { useState } from "react";
  import { toast } from "sonner";
  import { Loader2, Mail } from "lucide-react";

const LOGO_URL = "/logo.webp";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setStep('password');
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error("Email is required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      toast.success("Account created! Check your email to verify and set your password.");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="FoldForge" className="w-16 h-16 rounded-xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-['Playfair_Display']">Start Your 7-Day Free Trial</h1>
            <p className="text-muted-foreground text-sm mt-1">No credit card required. Full access to all features.</p>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
              <div className={`flex items-center gap-1 ${step === 'email' ? 'text-primary font-bold' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'email' ? 'bg-primary text-white' : 'bg-secondary'}`}>1</div>
                <span>Email</span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div className={`flex items-center gap-1 ${step === 'password' ? 'text-primary font-bold' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 'password' ? 'bg-primary text-white' : 'bg-secondary'}`}>2</div>
                <span>Confirm</span>
              </div>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <form onSubmit={step === 'email' ? handleEmailSubmit : handleSignup} className="space-y-4">
                {step === 'email' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="pl-10 bg-input border-border"
                        autoComplete="email"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
                      <strong>Email:</strong> {email}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">A confirmation email will be sent to verify your account.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                >
                  {loading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> {step === 'email' ? 'Continuing...' : 'Starting trial...'}</>
                  ) : (
                    step === 'email' ? 'Continue with Email' : 'Start 7-Day Free Trial'
                  )}
                </Button>

                {step === 'email' && (
                  <p className="text-xs text-muted-foreground text-center">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                )}

                {step === 'password' && (
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to email
                  </button>
                )}
              </form>

              {step === 'email' && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

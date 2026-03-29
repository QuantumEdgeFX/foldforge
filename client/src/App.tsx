import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Suspense } from "react";
import { lazyRetry } from "./lib/lazy-retry";
import StickyCTA from "./components/StickyCTA";

const Home = lazyRetry(() => import("./pages/Home"), "Home");
const Blog = lazyRetry(() => import("./pages/Blog"), "Blog");
const BlogPost = lazyRetry(() => import("./pages/BlogPost"), "BlogPost");
const Login = lazyRetry(() => import("./pages/Login"), "Login");
const Signup = lazyRetry(() => import("./pages/Signup"), "Signup");
const ForgotPassword = lazyRetry(() => import("./pages/ForgotPassword"), "ForgotPassword");
const Dashboard = lazyRetry(() => import("./pages/Dashboard"), "Dashboard");
const Studio = lazyRetry(() => import("./pages/Studio"), "Studio");
const Admin = lazyRetry(() => import("./pages/Admin"), "Admin");
const Pricing = lazyRetry(() => import("./pages/Pricing"), "Pricing");
const AureusPrime = lazyRetry(() => import("./pages/AureusPrime"), "AureusPrime");
const AureusPrimeShowcase = lazyRetry(() => import("./pages/AureusPrimeShowcase"), "AureusPrimeShowcase");
const Terms = lazyRetry(() => import("./pages/Terms"), "Terms");
const Privacy = lazyRetry(() => import("./pages/Privacy"), "Privacy");
const RefundPolicy = lazyRetry(() => import("./pages/RefundPolicy"), "RefundPolicy");
const Disclaimer = lazyRetry(() => import("./pages/Disclaimer"), "Disclaimer");
const Docs = lazyRetry(() => import("./pages/Docs"), "Docs");
const FundedAccountRiskManagement = lazyRetry(() => import("./pages/FundedAccountRiskManagement"), "FundedAccountRiskManagement");
const AutomatedTradingPlatform = lazyRetry(() => import("./pages/AutomatedTradingPlatform"), "AutomatedTradingPlatform");
const ExpertAdvisorBuilder = lazyRetry(() => import("./pages/ExpertAdvisorBuilder"), "ExpertAdvisorBuilder");
const MetatraderRiskManagementTool = lazyRetry(() => import("./pages/MetatraderRiskManagementTool"), "MetatraderRiskManagementTool");
const EAStressTesting = lazyRetry(() => import("./pages/EAStressTesting"), "EAStressTesting");
const MonteCarloSimulationEA = lazyRetry(() => import("./pages/MonteCarloSimulationEA"), "MonteCarloSimulationEA");
const WalkForwardAnalysisMT5 = lazyRetry(() => import("./pages/WalkForwardAnalysisMT5"), "WalkForwardAnalysisMT5");
const BestEAForFundedAccounts = lazyRetry(() => import("./pages/BestEAForFundedAccounts"), "BestEAForFundedAccounts");
const MQ5CodeReview = lazyRetry(() => import("./pages/MQ5CodeReview"), "MQ5CodeReview");
const EAParameterOptimization = lazyRetry(() => import("./pages/EAParameterOptimization"), "EAParameterOptimization");
const Support = lazyRetry(() => import("./pages/Support"), "Support");
const Success = lazyRetry(() => import("./pages/Success"), "Success");
const NotFound = lazyRetry(() => import("./pages/NotFound"), "NotFound");
const Founder = lazyRetry(() => import("./pages/Founder"), "Founder");

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/studio" component={Studio} />
        <Route path="/admin" component={Admin} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/aureus-prime/showcase" component={AureusPrimeShowcase} />
        <Route path="/aureus-prime" component={AureusPrime} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route path="/docs" component={Docs} />
        <Route path="/funded-account-risk-management" component={FundedAccountRiskManagement} />
        <Route path="/automated-trading-platform" component={AutomatedTradingPlatform} />
        <Route path="/expert-advisor-builder" component={ExpertAdvisorBuilder} />
        <Route path="/metatrader-risk-management-tool" component={MetatraderRiskManagementTool} />
        <Route path="/ea-stress-testing" component={EAStressTesting} />
        <Route path="/monte-carlo-simulation-ea" component={MonteCarloSimulationEA} />
        <Route path="/walk-forward-analysis-mt5" component={WalkForwardAnalysisMT5} />
        <Route path="/best-ea-for-funded-accounts" component={BestEAForFundedAccounts} />
        <Route path="/mq5-code-review" component={MQ5CodeReview} />
        <Route path="/ea-parameter-optimization" component={EAParameterOptimization} />
        <Route path="/support" component={Support} />
        <Route path="/success" component={Success} />
        <Route path="/founder" component={Founder} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <StickyCTA />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

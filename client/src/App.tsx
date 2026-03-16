import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Studio = lazy(() => import("./pages/Studio"));
const Admin = lazy(() => import("./pages/Admin"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AureusPrime = lazy(() => import("./pages/AureusPrime"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Docs = lazy(() => import("./pages/Docs"));
const FundedAccountRiskManagement = lazy(() => import("./pages/FundedAccountRiskManagement"));
const AutomatedTradingPlatform = lazy(() => import("./pages/AutomatedTradingPlatform"));
const ExpertAdvisorBuilder = lazy(() => import("./pages/ExpertAdvisorBuilder"));
const MetatraderRiskManagementTool = lazy(() => import("./pages/MetatraderRiskManagementTool"));
const EAStressTesting = lazy(() => import("./pages/EAStressTesting"));
const Support = lazy(() => import("./pages/Support"));
const Success = lazy(() => import("./pages/Success"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/studio" component={Studio} />
        <Route path="/admin" component={Admin} />
        <Route path="/pricing" component={Pricing} />
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
        <Route path="/support" component={Support} />
        <Route path="/success" component={Success} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

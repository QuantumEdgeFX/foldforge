import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { fileToBase64 } from "@/hooks/useFileUpload";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import {
  Play, Settings, BarChart3, FileText, Layers, Zap, Upload, Brain, Shield, Target,
  TrendingUp, TrendingDown, DollarSign, Percent, Activity, Eye, Code, Lightbulb,
  Clock, CheckCircle2, XCircle, Loader2, AlertTriangle, Square, ChevronRight,
  Download, RefreshCw, Info, ArrowUpRight, ArrowDownRight, Flame, Award,
  FileCode, Cpu, Database, LayoutDashboard, Gauge, AlertCircle, Check, X
} from "lucide-react";

// ============================================================================
// Constants
// ============================================================================

const TIMEFRAMES = ["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
const SYMBOLS = ["EURUSD","GBPUSD","USDJPY","AUDUSD","USDCAD","USDCHF","NZDUSD","EURGBP","EURJPY","GBPJPY","XAUUSD","XAGUSD","US30","US500","NAS100","BTCUSD","ETHUSD"];

const RUN_TYPES = [
  { value: "stress_test", label: "Stress Test", icon: Shield, description: "20 stress scenarios including spread, slippage, gaps, volatility spikes" },
  { value: "monte_carlo", label: "Monte Carlo", icon: Activity, description: "1000+ simulations with trade resampling and confidence intervals" },
  { value: "walk_forward", label: "Walk-Forward", icon: Target, description: "Rolling window analysis to detect overfitting" },
  { value: "quick_analysis", label: "Quick Analysis", icon: Zap, description: "All tests combined with AI-powered scoring and grade" },
  { value: "sensitivity", label: "Parameter Sensitivity", icon: Settings, description: "Test how parameter changes affect performance" },
];

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-emerald-400", "A": "text-emerald-400", "A-": "text-emerald-400",
  "B+": "text-green-400", "B": "text-green-400", "B-": "text-green-400",
  "C+": "text-yellow-400", "C": "text-yellow-400", "C-": "text-yellow-400",
  "D+": "text-orange-400", "D": "text-orange-400", "F": "text-red-400",
};

// ============================================================================
// Main Studio Component
// ============================================================================

export default function Studio() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) { window.location.href = "/login"; return null; }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container max-w-[1400px]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-['Playfair_Display']">
                  <span className="gold-text">EA Stress Testing Studio</span>
                </h1>
                <p className="text-muted-foreground text-sm">Institutional-grade testing for any MetaTrader 5 Expert Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="gap-1"><Shield className="w-3 h-3" /> 20+ Stress Scenarios</Badge>
              <Badge variant="secondary" className="gap-1"><Activity className="w-3 h-3" /> Monte Carlo Engine</Badge>
              <Badge variant="secondary" className="gap-1"><Brain className="w-3 h-3" /> AI Code Review</Badge>
              <Badge variant="secondary" className="gap-1"><Target className="w-3 h-3" /> Walk-Forward Analysis</Badge>
              <Badge variant="secondary" className="gap-1"><Gauge className="w-3 h-3" /> 40+ Metrics</Badge>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-secondary/50 mb-6 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="upload" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Upload size={14} /> Upload EA
              </TabsTrigger>
              <TabsTrigger value="configure" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings size={14} /> Configure
              </TabsTrigger>
              <TabsTrigger value="queue" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Layers size={14} /> Run Queue
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 size={14} /> Results
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Brain size={14} /> AI Insights
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText size={14} /> Reports
              </TabsTrigger>
              <TabsTrigger value="reference" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Database size={14} /> Reference
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload"><UploadTab onComplete={() => setActiveTab("configure")} /></TabsContent>
            <TabsContent value="configure"><ConfigureTab onSubmit={() => setActiveTab("queue")} /></TabsContent>
            <TabsContent value="queue"><QueueTab /></TabsContent>
            <TabsContent value="results"><ResultsTab /></TabsContent>
            <TabsContent value="insights"><InsightsTab /></TabsContent>
            <TabsContent value="reports"><ReportsTab /></TabsContent>
            <TabsContent value="reference"><ReferenceTab /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ============================================================================
// Upload Tab — Drag & Drop EA Upload with Instant Parsing
// ============================================================================

function UploadTab({ onComplete }: { onComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedEA, setParsedEA] = useState<any>(null);
  const [parsing, setParsing] = useState(false);
  const [eaCode, setEaCode] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadEA = trpc.ea.uploadEA.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setParsedEA(result.data);
        setEaCode(result.data?.codePreview || "");
        toast.success(`Parsed ${result.data?.metadata?.totalParameters || 0} parameters from ${result.data?.fileName}`);
        // Store in session for other tabs
        sessionStorage.setItem("foldforge_ea", JSON.stringify(result.data));
      } else {
        toast.error(result.error || "Upload failed");
      }
      setParsing(false);
    },
    onError: (e) => { toast.error(e.message); setParsing(false); },
  });

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".mq5") && !file.name.endsWith(".mq4") && !file.name.endsWith(".mqh")) {
      toast.error("Please upload an MQ5, MQ4, or MQH file");
      return;
    }
    setParsing(true);
    setFileName(file.name);
    const base64 = await fileToBase64(file);
    uploadEA.mutate({ fileName: file.name, fileContent: base64 });
  }, [uploadEA]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card className={`bg-card border-2 border-dashed transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50"}`}>
        <CardContent className="pt-8 pb-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".mq5,.mq4,.mqh" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <div className="text-center">
            {parsing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Parsing {fileName}...</h3>
                  <p className="text-muted-foreground text-sm mt-1">Analyzing parameters, functions, indicators, risk management, and complexity</p>
                </div>
              </div>
            ) : parsedEA ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400">{parsedEA.fileName} — Parsed Successfully</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {parsedEA.metadata?.totalParameters} parameters detected &middot; Complexity: {parsedEA.metadata?.complexity?.score} &middot; {parsedEA.metadata?.functions?.length || 0} functions
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setParsedEA(null); setFileName(""); }}>
                  <Upload className="w-4 h-4 mr-1.5" /> Upload Different EA
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCode className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Drop your MQ5 Expert Advisor here</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Supports any MQ5/MQ4 file — all parameter types, includes, enums, classes, and custom types
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">or click to browse files</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parsed EA Details */}
      {parsedEA && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Parameters */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Detected Parameters ({parsedEA.metadata?.totalParameters})</CardTitle>
              <CardDescription>All input parameters automatically extracted from your EA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto space-y-1">
                {parsedEA.metadata?.parameters?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/30 text-sm border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-[10px] font-mono w-16 justify-center">{p.type}</Badge>
                      <span className="font-medium font-mono">{p.name}</span>
                      {p.comment && <span className="text-xs text-muted-foreground">// {p.comment}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Default:</span>
                      <Badge variant="outline" className="font-mono text-xs">{String(p.defaultValue)}</Badge>
                    </div>
                  </div>
                ))}
                {parsedEA.metadata?.enums?.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Custom Enums ({parsedEA.metadata.enums.length})</h4>
                    {parsedEA.metadata.enums.map((e: any, i: number) => (
                      <div key={i} className="py-1.5 px-3 text-sm">
                        <span className="font-mono text-primary">{e.name}</span>
                        <span className="text-muted-foreground ml-2">({e.values?.length || 0} values)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* EA Summary */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm">EA Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <StatRow label="Parameters" value={parsedEA.metadata?.totalParameters} />
                <StatRow label="Functions" value={parsedEA.metadata?.functions?.length || 0} />
                <StatRow label="Code Lines" value={parsedEA.metadata?.complexity?.codeLines} />
                <StatRow label="Complexity" value={parsedEA.metadata?.complexity?.score} />
                <StatRow label="Cyclomatic" value={parsedEA.metadata?.complexity?.cyclomaticComplexity} />
                <div className="border-t border-border pt-3 mt-3">
                  <h4 className="text-xs text-muted-foreground mb-2">Event Handlers</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedEA.metadata?.hasOnInit && <Badge variant="secondary" className="text-[10px]">OnInit</Badge>}
                    {parsedEA.metadata?.hasOnTick && <Badge variant="secondary" className="text-[10px]">OnTick</Badge>}
                    {parsedEA.metadata?.hasOnDeinit && <Badge variant="secondary" className="text-[10px]">OnDeinit</Badge>}
                    {parsedEA.metadata?.hasOnTimer && <Badge variant="secondary" className="text-[10px]">OnTimer</Badge>}
                    {parsedEA.metadata?.hasOnTrade && <Badge variant="secondary" className="text-[10px]">OnTrade</Badge>}
                  </div>
                </div>
                {parsedEA.metadata?.indicatorCalls?.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <h4 className="text-xs text-muted-foreground mb-2">Indicators Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedEA.metadata.indicatorCalls.map((ic: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{ic}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {parsedEA.metadata?.riskManagementFeatures?.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <h4 className="text-xs text-muted-foreground mb-2">Risk Management</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedEA.metadata.riskManagementFeatures.map((f: string, i: number) => (
                        <Badge key={i} className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button className="w-full bg-primary text-primary-foreground" onClick={onComplete}>
              <ChevronRight className="w-4 h-4 mr-1.5" /> Configure Test
            </Button>
          </div>
        </div>
      )}

      {/* Supported Features */}
      {!parsedEA && (
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard icon={FileCode} title="Any MQ5 EA" description="Handles all parameter types: input, sinput, enums, classes, structs, macros, nested includes" />
          <FeatureCard icon={Shield} title="20+ Stress Scenarios" description="Spread widening, slippage, gaps, volatility spikes, losing streaks, win rate degradation" />
          <FeatureCard icon={Brain} title="AI Code Review" description="Deep analysis of your EA code with specific MQ5 improvement suggestions" />
          <FeatureCard icon={Activity} title="Monte Carlo Engine" description="1000+ simulations with probability of profit, ruin, and confidence intervals" />
          <FeatureCard icon={Target} title="Walk-Forward Analysis" description="Detect overfitting with rolling in-sample/out-of-sample validation" />
          <FeatureCard icon={Gauge} title="40+ Metrics" description="Sharpe, Sortino, Calmar, Omega, VaR, CVaR, Ulcer Index, Kelly %, and more" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Configure Tab — Dynamic Test Configuration
// ============================================================================

function ConfigureTab({ onSubmit }: { onSubmit: () => void }) {
  const storedEA = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("foldforge_ea") || "null"); } catch { return null; }
  }, []);

  const [config, setConfig] = useState({
    eaName: storedEA?.fileName?.replace(/\.(mq5|mq4)$/i, "") || "My EA",
    runType: "quick_analysis",
    symbol: "EURUSD",
    timeframe: "H1",
    numTrades: 500,
    numSimulations: 1000,
    initialBalance: 10000,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    winRate: 0.52,
    avgWinPips: 35,
    avgLossPips: 25,
    lotSize: 0.1,
    spread: 1.5,
    commission: 7,
    maxDrawdownLimit: 10,
    dailyDrawdownLimit: 5,
    numWindows: 6,
    inSampleRatio: 0.7,
  });

  const createRun = trpc.studio.createRun.useMutation({
    onSuccess: () => { toast.success("Test submitted to queue!"); onSubmit(); },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = () => {
    createRun.mutate({
      name: config.eaName,
      symbol: config.symbol,
      timeframe: config.timeframe,
      parameters: { ...config, metadata: storedEA?.metadata },
    });
  };

  const selectedType = RUN_TYPES.find(t => t.value === config.runType);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Test Type Selection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Test Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RUN_TYPES.map(type => {
                const Icon = type.icon;
                const isActive = config.runType === type.value;
                return (
                  <button key={type.value} onClick={() => setConfig(c => ({ ...c, runType: type.value }))}
                    className={`text-left p-4 rounded-lg border transition-all ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 bg-secondary/30"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Configuration */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Market Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Symbol</Label>
                <Select value={config.symbol} onValueChange={v => setConfig(c => ({ ...c, symbol: v }))}>
                  <SelectTrigger className="bg-input border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{SYMBOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Timeframe</Label>
                <Select value={config.timeframe} onValueChange={v => setConfig(c => ({ ...c, timeframe: v }))}>
                  <SelectTrigger className="bg-input border-border mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMEFRAMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Initial Balance ($)</Label>
                <Input type="number" value={config.initialBalance} onChange={e => setConfig(c => ({ ...c, initialBalance: Number(e.target.value) }))} className="bg-input border-border mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Start Date</Label>
                <Input type="date" value={config.startDate} onChange={e => setConfig(c => ({ ...c, startDate: e.target.value }))} className="bg-input border-border mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End Date</Label>
                <Input type="date" value={config.endDate} onChange={e => setConfig(c => ({ ...c, endDate: e.target.value }))} className="bg-input border-border mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Number of Trades</Label>
                <Input type="number" value={config.numTrades} onChange={e => setConfig(c => ({ ...c, numTrades: Number(e.target.value) }))} className="bg-input border-border mt-1" min={50} max={10000} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Parameters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Strategy Parameters</CardTitle>
            <CardDescription>Fine-tune the simulation parameters based on your EA's characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SliderField label="Win Rate" value={config.winRate * 100} min={20} max={90} step={1} unit="%" onChange={v => setConfig(c => ({ ...c, winRate: v / 100 }))} />
              <SliderField label="Avg Win (pips)" value={config.avgWinPips} min={5} max={200} step={1} onChange={v => setConfig(c => ({ ...c, avgWinPips: v }))} />
              <SliderField label="Avg Loss (pips)" value={config.avgLossPips} min={5} max={200} step={1} onChange={v => setConfig(c => ({ ...c, avgLossPips: v }))} />
              <SliderField label="Lot Size" value={config.lotSize} min={0.01} max={10} step={0.01} onChange={v => setConfig(c => ({ ...c, lotSize: v }))} />
              <SliderField label="Spread (pips)" value={config.spread} min={0.1} max={10} step={0.1} onChange={v => setConfig(c => ({ ...c, spread: v }))} />
              <SliderField label="Commission ($/lot)" value={config.commission} min={0} max={20} step={0.5} onChange={v => setConfig(c => ({ ...c, commission: v }))} />
            </div>
          </CardContent>
        </Card>

        {/* Funded Account Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Funded Account Limits</CardTitle>
            <CardDescription>Set drawdown limits to test funded account compatibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <SliderField label="Max Total Drawdown" value={config.maxDrawdownLimit} min={3} max={20} step={0.5} unit="%" onChange={v => setConfig(c => ({ ...c, maxDrawdownLimit: v }))} />
              <SliderField label="Max Daily Drawdown" value={config.dailyDrawdownLimit} min={1} max={10} step={0.5} unit="%" onChange={v => setConfig(c => ({ ...c, dailyDrawdownLimit: v }))} />
            </div>
          </CardContent>
        </Card>

        {/* Monte Carlo / Walk-Forward Specific */}
        {(config.runType === "monte_carlo" || config.runType === "quick_analysis") && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Monte Carlo Settings</CardTitle></CardHeader>
            <CardContent>
              <SliderField label="Simulations" value={config.numSimulations} min={100} max={10000} step={100} onChange={v => setConfig(c => ({ ...c, numSimulations: v }))} />
            </CardContent>
          </Card>
        )}

        {(config.runType === "walk_forward" || config.runType === "quick_analysis") && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Walk-Forward Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <SliderField label="Windows" value={config.numWindows} min={3} max={20} step={1} onChange={v => setConfig(c => ({ ...c, numWindows: v }))} />
                <SliderField label="In-Sample Ratio" value={config.inSampleRatio * 100} min={50} max={90} step={5} unit="%" onChange={v => setConfig(c => ({ ...c, inSampleRatio: v / 100 }))} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar Summary */}
      <div className="space-y-4">
        <Card className="bg-card border-border sticky top-24">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              {selectedType && <selectedType.icon size={14} className="text-primary" />}
              Test Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <StatRow label="EA" value={config.eaName} />
            <StatRow label="Test Type" value={selectedType?.label || config.runType} />
            <StatRow label="Symbol" value={config.symbol} />
            <StatRow label="Timeframe" value={config.timeframe} />
            <StatRow label="Period" value={`${config.startDate} to ${config.endDate}`} />
            <StatRow label="Balance" value={`$${config.initialBalance.toLocaleString()}`} />
            <StatRow label="Trades" value={String(config.numTrades)} />
            <StatRow label="Win Rate" value={`${(config.winRate * 100).toFixed(0)}%`} />
            <StatRow label="Max DD Limit" value={`${config.maxDrawdownLimit}%`} />
            {storedEA && <StatRow label="Parameters" value={`${storedEA.metadata?.totalParameters || 0} detected`} />}

            <div className="border-t border-border pt-4 mt-4">
              <Button onClick={handleSubmit} disabled={createRun.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {createRun.isPending ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                Run {selectedType?.label || "Test"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Presets */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm">Quick Presets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Conservative Scalper", wr: 0.65, wp: 15, lp: 20, lot: 0.05, type: "stress_test" },
              { label: "Trend Follower", wr: 0.42, wp: 80, lp: 30, lot: 0.1, type: "monte_carlo" },
              { label: "Mean Reversion", wr: 0.58, wp: 25, lp: 35, lot: 0.1, type: "walk_forward" },
              { label: "Funded Account Test", wr: 0.52, wp: 35, lp: 25, lot: 0.05, type: "quick_analysis" },
              { label: "High Frequency", wr: 0.55, wp: 8, lp: 10, lot: 0.5, type: "stress_test" },
            ].map((preset, i) => (
              <button key={i} onClick={() => setConfig(c => ({ ...c, winRate: preset.wr, avgWinPips: preset.wp, avgLossPips: preset.lp, lotSize: preset.lot, runType: preset.type }))}
                className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors text-sm">
                <span className="font-medium">{preset.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">WR: {(preset.wr * 100).toFixed(0)}% &middot; {preset.type.replace("_", " ")}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Queue Tab
// ============================================================================

function QueueTab() {
  const utils = trpc.useUtils();
  const { data: runs, isLoading } = trpc.studio.getRuns.useQuery(undefined, { refetchInterval: 3000 });
  const startRun = trpc.studio.startRun.useMutation({
    onSuccess: () => { toast.success("Run started!"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const cancelRun = trpc.studio.cancelRun.useMutation({
    onSuccess: () => { toast.success("Run cancelled"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <LoadingCard />;
  if (!runs || runs.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-8 pb-8 text-center">
      <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Runs Yet</h3>
      <p className="text-muted-foreground">Configure and submit your first test run from the Configure tab.</p>
    </CardContent></Card>
  );

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 size={16} className="text-green-400" />;
    if (s === "running") return <Loader2 size={16} className="text-primary animate-spin" />;
    if (s === "failed") return <XCircle size={16} className="text-destructive" />;
    if (s === "cancelled") return <Square size={16} className="text-muted-foreground" />;
    return <Clock size={16} className="text-yellow-400" />;
  };

  return (
    <div className="space-y-3">
      {runs.map((run: any) => (
        <Card key={run.id} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(run.status)}
                <div>
                  <span className="font-medium">{run.eaName || run.name}</span>
                  <span className="text-sm text-muted-foreground ml-3">{run.symbol} &middot; {run.timeframe}</span>
                </div>
                <Badge className="capitalize bg-secondary text-secondary-foreground">{(run.runType || run.parameters?.runType || "backtest").replace("_", " ")}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={run.status === "completed" ? "default" : run.status === "failed" ? "destructive" : "secondary"} className="capitalize">{run.status}</Badge>
                {run.status === "queued" && (
                  <>
                    <Button size="sm" onClick={() => startRun.mutate({ id: run.id })} disabled={startRun.isPending} className="bg-primary text-primary-foreground">
                      {startRun.isPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="mr-1" />}Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => cancelRun.mutate({ id: run.id })} disabled={cancelRun.isPending}>
                      <Square size={14} className="mr-1" />Cancel
                    </Button>
                  </>
                )}
                {run.status === "running" && (
                  <Button size="sm" variant="destructive" onClick={() => cancelRun.mutate({ id: run.id })} disabled={cancelRun.isPending}>
                    <Square size={14} className="mr-1" />Stop
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">{new Date(run.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {run.status === "running" && (
              <div className="mt-3">
                <Progress value={60} className="h-1.5" />
                <span className="text-xs text-muted-foreground mt-1">Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Results Tab — Comprehensive Dashboard
// ============================================================================

function ResultsTab() {
  const { data: results, isLoading } = trpc.studio.getRuns.useQuery();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);

  if (isLoading) return <LoadingCard />;
  const completed = results?.filter((r: any) => r.status === "completed") ?? [];
  if (completed.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-8 pb-8 text-center">
      <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
      <p className="text-muted-foreground">Complete a test run to see results here.</p>
    </CardContent></Card>
  );

  const activeRun = selectedRun !== null ? completed.find((r: any) => r.id === selectedRun) : completed[0];

  return (
    <div className="space-y-6">
      {completed.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {completed.map((r: any) => (
            <button key={r.id} onClick={() => setSelectedRun(r.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${(activeRun?.id === r.id) ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
              {r.name || r.eaName} &middot; {r.symbol}
            </button>
          ))}
        </div>
      )}
      {activeRun && <RunResultDetail run={activeRun} />}
    </div>
  );
}

function RunResultDetail({ run }: { run: any }) {
  const metrics = run.metrics || {};
  const results = run.results || {};
  const equityCurve = results.equityCurve || [];
  const drawdownCurve = results.drawdownCurve || [];
  const monthlyReturns = results.monthlyReturns || [];
  const tradeDistribution = results.tradeDistribution || [];

  // Calculate score
  let score = 50;
  if (metrics.sharpeRatio > 1) score += 10;
  if (metrics.sharpeRatio > 2) score += 5;
  if (metrics.profitFactor > 1.5) score += 10;
  if (metrics.maxDrawdownPercent < 10) score += 10;
  if (metrics.winRate > 55) score += 5;
  if (metrics.recoveryFactor > 2) score += 5;
  score = Math.min(100, Math.max(0, score));

  let grade = "C";
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C+";
  else if (score >= 50) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" className="text-primary" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${GRADE_COLORS[grade] || "text-foreground"}`}>{grade}</span>
                  <span className="text-[10px] text-muted-foreground">{score}/100</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{run.name || run.eaName}</h2>
                <p className="text-sm text-muted-foreground">{run.symbol} &middot; {run.timeframe} &middot; {new Date(run.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={metrics.netProfit >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}>
                    {metrics.netProfit >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    ${Math.abs(metrics.netProfit || 0).toFixed(2)}
                  </Badge>
                  <Badge variant="secondary">PF: {(metrics.profitFactor || 0).toFixed(2)}</Badge>
                  <Badge variant="secondary">Sharpe: {(metrics.sharpeRatio || 0).toFixed(2)}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm"><span className="text-muted-foreground">Win Rate:</span> <span className="font-bold">{(metrics.winRate || 0).toFixed(1)}%</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Max DD:</span> <span className="font-bold text-red-400">{(metrics.maxDrawdownPercent || 0).toFixed(1)}%</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Trades:</span> <span className="font-bold">{metrics.totalTrades || 0}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard icon={DollarSign} label="Net Profit" value={`$${(metrics.netProfit ?? 0).toFixed(2)}`} positive={(metrics.netProfit ?? 0) >= 0} />
        <MetricCard icon={Percent} label="Win Rate" value={`${(metrics.winRate ?? 0).toFixed(1)}%`} positive={(metrics.winRate ?? 0) >= 50} />
        <MetricCard icon={TrendingUp} label="Profit Factor" value={(metrics.profitFactor ?? 0).toFixed(2)} positive={(metrics.profitFactor ?? 0) >= 1} />
        <MetricCard icon={TrendingDown} label="Max Drawdown" value={`${(metrics.maxDrawdownPercent ?? 0).toFixed(1)}%`} positive={(metrics.maxDrawdownPercent ?? 0) < 10} />
        <MetricCard icon={BarChart3} label="Sharpe Ratio" value={(metrics.sharpeRatio ?? 0).toFixed(2)} positive={(metrics.sharpeRatio ?? 0) > 1} />
        <MetricCard icon={Activity} label="Sortino Ratio" value={(metrics.sortinoRatio ?? 0).toFixed(2)} positive={(metrics.sortinoRatio ?? 0) > 1} />
        <MetricCard icon={DollarSign} label="Avg Win" value={`$${(metrics.avgWin ?? 0).toFixed(2)}`} positive />
        <MetricCard icon={DollarSign} label="Avg Loss" value={`$${(metrics.avgLoss ?? 0).toFixed(2)}`} positive={false} />
        <MetricCard icon={Target} label="Expectancy" value={`$${(metrics.expectancy ?? 0).toFixed(2)}`} positive={(metrics.expectancy ?? 0) > 0} />
        <MetricCard icon={Gauge} label="Recovery Factor" value={(metrics.recoveryFactor ?? 0).toFixed(2)} positive={(metrics.recoveryFactor ?? 0) > 1} />
        <MetricCard icon={Shield} label="Calmar Ratio" value={(metrics.calmarRatio ?? 0).toFixed(2)} positive={(metrics.calmarRatio ?? 0) > 1} />
        <MetricCard icon={Flame} label="Kelly %" value={`${(metrics.kellyPercent ?? 0).toFixed(1)}%`} positive={(metrics.kellyPercent ?? 0) > 0} />
      </div>

      {/* Charts */}
      {equityCurve.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Equity Curve</CardTitle><CardDescription>Account balance over {equityCurve.length} trades</CardDescription></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurve}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Equity"]} />
                  <ReferenceLine y={run.parameters?.initialBalance || 10000} stroke="#555" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="equity" stroke="#d4a843" fill="url(#equityGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {drawdownCurve.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Drawdown Curve</CardTitle><CardDescription>Percentage drawdown from equity peak</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownCurve}>
                  <defs>
                    <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`${Number(value).toFixed(2)}%`, "Drawdown"]} />
                  <Area type="monotone" dataKey="drawdownPercent" stroke="#ef4444" fill="url(#ddGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {monthlyReturns.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Monthly Returns</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" tick={{ fill: "#888", fontSize: 10 }} />
                    <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }} />
                    <ReferenceLine y={0} stroke="#555" />
                    <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                      {monthlyReturns.map((entry: any, i: number) => (
                        <Cell key={i} fill={entry.return >= 0 ? "#22c55e" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {tradeDistribution.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Trade P/L Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="range" stroke="#666" tick={{ fill: "#888", fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {tradeDistribution.map((entry: any, i: number) => (
                        <Cell key={i} fill={entry.isPositive ? "#22c55e" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comprehensive Stats */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Comprehensive Statistics (40+ Metrics)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1">
            {[
              ["--- Performance ---", ""],
              ["Net Profit", `$${(metrics.netProfit ?? 0).toFixed(2)}`],
              ["Gross Profit", `$${(metrics.grossProfit ?? 0).toFixed(2)}`],
              ["Gross Loss", `$${(metrics.grossLoss ?? 0).toFixed(2)}`],
              ["Total Return", `${(metrics.totalReturn ?? 0).toFixed(2)}%`],
              ["Annualized Return", `${(metrics.annualizedReturn ?? 0).toFixed(2)}%`],
              ["--- Win/Loss ---", ""],
              ["Total Trades", metrics.totalTrades],
              ["Wins / Losses", `${metrics.wins} / ${metrics.losses}`],
              ["Win Rate", `${(metrics.winRate ?? 0).toFixed(1)}%`],
              ["Avg Win", `$${(metrics.avgWin ?? 0).toFixed(2)}`],
              ["Avg Loss", `$${(metrics.avgLoss ?? 0).toFixed(2)}`],
              ["Avg Trade", `$${(metrics.avgTrade ?? 0).toFixed(2)}`],
              ["Payoff Ratio", (metrics.payoffRatio ?? 0).toFixed(2)],
              ["--- Risk Metrics ---", ""],
              ["Max Drawdown", `${(metrics.maxDrawdownPercent ?? 0).toFixed(2)}% ($${(metrics.maxDrawdown ?? 0).toFixed(2)})`],
              ["Max DD Duration", `${(metrics.maxDrawdownDuration ?? 0).toFixed(0)} days`],
              ["Avg Drawdown", `${(metrics.avgDrawdownPercent ?? 0).toFixed(2)}%`],
              ["Max Daily DD", `${(metrics.maxDailyDrawdownPercent ?? 0).toFixed(2)}%`],
              ["--- Risk-Adjusted ---", ""],
              ["Sharpe Ratio", (metrics.sharpeRatio ?? 0).toFixed(2)],
              ["Sortino Ratio", (metrics.sortinoRatio ?? 0).toFixed(2)],
              ["Calmar Ratio", (metrics.calmarRatio ?? 0).toFixed(2)],
              ["Omega Ratio", (metrics.omegaRatio ?? 0).toFixed(2)],
              ["Sterling Ratio", (metrics.sterlingRatio ?? 0).toFixed(2)],
              ["Burke Ratio", (metrics.burkeRatio ?? 0).toFixed(2)],
              ["Ulcer Index", (metrics.ulcerIndex ?? 0).toFixed(2)],
              ["--- Advanced ---", ""],
              ["Profit Factor", (metrics.profitFactor ?? 0).toFixed(2)],
              ["Expectancy", `$${(metrics.expectancy ?? 0).toFixed(2)}`],
              ["Kelly %", `${(metrics.kellyPercent ?? 0).toFixed(1)}%`],
              ["Recovery Factor", (metrics.recoveryFactor ?? 0).toFixed(2)],
              ["Z-Score", (metrics.zScore ?? 0).toFixed(2)],
              ["Skewness", (metrics.skewness ?? 0).toFixed(2)],
              ["Kurtosis", (metrics.kurtosis ?? 0).toFixed(2)],
              ["--- Value at Risk ---", ""],
              ["VaR (95%)", `$${(metrics.valueAtRisk95 ?? 0).toFixed(2)}`],
              ["VaR (99%)", `$${(metrics.valueAtRisk99 ?? 0).toFixed(2)}`],
              ["CVaR (95%)", `$${(metrics.conditionalVaR95 ?? 0).toFixed(2)}`],
              ["CVaR (99%)", `$${(metrics.conditionalVaR99 ?? 0).toFixed(2)}`],
              ["--- Streaks ---", ""],
              ["Max Consecutive Wins", metrics.consecutiveWins],
              ["Max Consecutive Losses", metrics.consecutiveLosses],
              ["Best Day", `$${(metrics.bestDayPnL ?? 0).toFixed(2)}`],
              ["Worst Day", `$${(metrics.worstDayPnL ?? 0).toFixed(2)}`],
              ["Profitable Days", `${metrics.profitableDays}/${metrics.totalTradingDays}`],
              ["Best Month", `$${(metrics.bestMonth ?? 0).toFixed(2)}`],
              ["Worst Month", `$${(metrics.worstMonth ?? 0).toFixed(2)}`],
            ].map(([label, value], i) => {
              if (String(label).startsWith("---")) return (
                <div key={i} className="col-span-full text-xs font-semibold text-primary mt-3 mb-1 border-b border-border pb-1">{String(label).replace(/---/g, "").trim()}</div>
              );
              return (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-border/20">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// AI Insights Tab
// ============================================================================

function InsightsTab() {
  const { data: results } = trpc.studio.getRuns.useQuery();
  const analyzeStrategy = trpc.ai.analyzeStrategy.useMutation();
  const reviewCode = trpc.ai.reviewCode.useMutation();
  const [analysis, setAnalysis] = useState<any>(null);
  const [codeReview, setCodeReview] = useState<any>(null);

  const completed = results?.filter((r: any) => r.status === "completed") ?? [];
  const latestRun = completed[0];
  const storedEA = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("foldforge_ea") || "null"); } catch { return null; }
  }, []);

  const handleAnalyze = () => {
    if (!latestRun?.metrics) { toast.error("No completed run to analyze"); return; }
    analyzeStrategy.mutate({ metrics: latestRun.metrics }, {
      onSuccess: (r) => { if (r.success) setAnalysis(r.data); else toast.error(r.error); },
      onError: (e) => toast.error(e.message),
    });
  };

  const handleCodeReview = () => {
    if (!storedEA?.codePreview || !storedEA?.metadata) { toast.error("Upload an EA first"); return; }
    reviewCode.mutate({ eaCode: storedEA.codePreview, metadata: storedEA.metadata, metrics: latestRun?.metrics }, {
      onSuccess: (r) => { if (r.success) setCodeReview(r.data); else toast.error(r.error); },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleAnalyze} disabled={analyzeStrategy.isPending || !latestRun} className="bg-primary text-primary-foreground">
          {analyzeStrategy.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
          Analyze Strategy
        </Button>
        <Button onClick={handleCodeReview} disabled={reviewCode.isPending || !storedEA} variant="outline">
          {reviewCode.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Code className="w-4 h-4 mr-2" />}
          Review EA Code
        </Button>
      </div>

      {!analysis && !codeReview && !analyzeStrategy.isPending && !reviewCode.isPending && (
        <Card className="bg-card border-border"><CardContent className="pt-8 pb-8 text-center">
          <Brain size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get institutional-grade analysis of your strategy performance and specific MQ5 code improvement suggestions.
            {!latestRun && " Complete a test run first to enable strategy analysis."}
            {!storedEA && " Upload an EA to enable code review."}
          </p>
        </CardContent></Card>
      )}

      {/* Strategy Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Strategy Analysis</CardTitle>
                <Badge className={`text-lg px-3 py-1 ${GRADE_COLORS[analysis.overallGrade] || "text-foreground"}`}>{analysis.overallGrade}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{analysis.summary}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 flex items-center gap-1.5 mb-2"><Check className="w-4 h-4" /> Strengths</h4>
                  <ul className="space-y-1.5">{analysis.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><Check className="w-3 h-3 text-green-400 mt-1 shrink-0" />{s}</li>
                  ))}</ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 flex items-center gap-1.5 mb-2"><AlertTriangle className="w-4 h-4" /> Weaknesses</h4>
                  <ul className="space-y-1.5">{analysis.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><X className="w-3 h-3 text-red-400 mt-1 shrink-0" />{w}</li>
                  ))}</ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funded Account Readiness */}
          {analysis.fundedAccountReadiness && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Funded Account Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${analysis.fundedAccountReadiness.ready ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    {analysis.fundedAccountReadiness.ready ? <Check className="w-6 h-6 text-green-400" /> : <X className="w-6 h-6 text-red-400" />}
                  </div>
                  <div>
                    <span className={`text-lg font-bold ${analysis.fundedAccountReadiness.ready ? "text-green-400" : "text-red-400"}`}>
                      {analysis.fundedAccountReadiness.ready ? "Ready" : "Not Ready"}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">Score: {analysis.fundedAccountReadiness.score}/100</span>
                  </div>
                </div>
                {analysis.fundedAccountReadiness.concerns?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-1.5">Concerns:</h4>
                    <ul className="space-y-1">{analysis.fundedAccountReadiness.concerns.map((c: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><AlertCircle className="w-3 h-3 text-yellow-400 mt-1 shrink-0" />{c}</li>
                    ))}</ul>
                  </div>
                )}
                {analysis.fundedAccountReadiness.recommendations?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1.5">Recommendations:</h4>
                    <ul className="space-y-1">{analysis.fundedAccountReadiness.recommendations.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><Lightbulb className="w-3 h-3 text-primary mt-1 shrink-0" />{r}</li>
                    ))}</ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Optimization Recommendations */}
          {analysis.optimizationRecommendations?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" /> Optimization Recommendations</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">{analysis.optimizationRecommendations.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                    <span className="text-primary font-bold">{i + 1}.</span> {r}
                  </li>
                ))}</ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Code Review Results */}
      {codeReview && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Code className="w-5 h-5 text-primary" /> EA Code Review</CardTitle>
                <Badge variant="secondary">Quality: {codeReview.codeQuality}/100</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{codeReview.summary}</p>

              {/* Issues */}
              {codeReview.issues?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Issues Found ({codeReview.issues.length})</h4>
                  <div className="space-y-2">
                    {codeReview.issues.map((issue: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg border ${issue.severity === "critical" ? "border-red-500/30 bg-red-500/5" : issue.severity === "warning" ? "border-yellow-500/30 bg-yellow-500/5" : "border-border bg-secondary/20"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={issue.severity === "critical" ? "destructive" : "secondary"} className="text-[10px]">{issue.severity}</Badge>
                          <span className="text-xs text-muted-foreground">{issue.category}</span>
                        </div>
                        <p className="text-sm font-medium">{issue.description}</p>
                        <p className="text-sm text-muted-foreground mt-1"><Lightbulb className="w-3 h-3 inline mr-1" />{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Management Audit */}
              {codeReview.riskManagementAudit && (
                <div>
                  <h4 className="font-semibold mb-3">Risk Management Audit (Score: {codeReview.riskManagementAudit.score}/100)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      ["Stop Loss", codeReview.riskManagementAudit.hasStopLoss],
                      ["Take Profit", codeReview.riskManagementAudit.hasTakeProfit],
                      ["Trailing Stop", codeReview.riskManagementAudit.hasTrailingStop],
                      ["Position Sizing", codeReview.riskManagementAudit.hasPositionSizing],
                      ["DD Protection", codeReview.riskManagementAudit.hasMaxDrawdownProtection],
                      ["Spread Filter", codeReview.riskManagementAudit.hasSpreadFilter],
                      ["Slippage Protection", codeReview.riskManagementAudit.hasSlippageProtection],
                      ["News Filter", codeReview.riskManagementAudit.hasNewsFilter],
                    ].map(([label, has], i) => (
                      <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${has ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {has ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Improvements */}
          {codeReview.improvements?.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" /> Suggested Improvements</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {codeReview.improvements.map((imp: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px]">{imp.category}</Badge>
                      <span className="text-xs text-muted-foreground">Impact: {imp.impact}</span>
                    </div>
                    <p className="text-sm"><strong>Current:</strong> {imp.current}</p>
                    <p className="text-sm text-primary mt-1"><strong>Suggested:</strong> {imp.suggested}</p>
                    {imp.codeSnippet && (
                      <pre className="mt-2 p-3 rounded bg-background text-xs overflow-x-auto font-mono">{imp.codeSnippet}</pre>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Reports Tab
// ============================================================================

function ReportsTab() {
  const { data: results, isLoading } = trpc.studio.getRuns.useQuery();

  if (isLoading) return <LoadingCard />;
  const completed = results?.filter((r: any) => r.status === "completed") ?? [];
  if (completed.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-8 pb-8 text-center">
      <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Reports Available</h3>
      <p className="text-muted-foreground">Complete a test run to generate reports.</p>
    </CardContent></Card>
  );

  const exportReport = (run: any) => {
    const m = run.metrics || {};
    const lines = [
      `╔══════════════════════════════════════════════════════════════╗`,
      `║           FOLDFORGE EA STRESS TEST REPORT                  ║`,
      `║           Institutional-Grade Analysis                     ║`,
      `╚══════════════════════════════════════════════════════════════╝`,
      ``,
      `EA: ${run.name || run.eaName}`,
      `Symbol: ${run.symbol} | Timeframe: ${run.timeframe}`,
      `Date: ${new Date(run.createdAt).toLocaleDateString()}`,
      `Initial Balance: $${(run.parameters?.initialBalance || 10000).toLocaleString()}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  PERFORMANCE METRICS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Net Profit:          $${(m.netProfit ?? 0).toFixed(2)}`,
      `Total Return:        ${(m.totalReturn ?? 0).toFixed(2)}%`,
      `Win Rate:            ${(m.winRate ?? 0).toFixed(1)}%`,
      `Profit Factor:       ${(m.profitFactor ?? 0).toFixed(2)}`,
      `Total Trades:        ${m.totalTrades ?? 0}`,
      `Avg Win:             $${(m.avgWin ?? 0).toFixed(2)}`,
      `Avg Loss:            $${(m.avgLoss ?? 0).toFixed(2)}`,
      `Expectancy:          $${(m.expectancy ?? 0).toFixed(2)}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  RISK METRICS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Max Drawdown:        ${(m.maxDrawdownPercent ?? 0).toFixed(2)}% ($${(m.maxDrawdown ?? 0).toFixed(2)})`,
      `Max DD Duration:     ${(m.maxDrawdownDuration ?? 0).toFixed(0)} days`,
      `Max Daily DD:        ${(m.maxDailyDrawdownPercent ?? 0).toFixed(2)}%`,
      `VaR (95%):           $${(m.valueAtRisk95 ?? 0).toFixed(2)}`,
      `CVaR (95%):          $${(m.conditionalVaR95 ?? 0).toFixed(2)}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  RISK-ADJUSTED RETURNS`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Sharpe Ratio:        ${(m.sharpeRatio ?? 0).toFixed(2)}`,
      `Sortino Ratio:       ${(m.sortinoRatio ?? 0).toFixed(2)}`,
      `Calmar Ratio:        ${(m.calmarRatio ?? 0).toFixed(2)}`,
      `Omega Ratio:         ${(m.omegaRatio ?? 0).toFixed(2)}`,
      `Recovery Factor:     ${(m.recoveryFactor ?? 0).toFixed(2)}`,
      `Kelly %:             ${(m.kellyPercent ?? 0).toFixed(1)}%`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  DISTRIBUTION`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Skewness:            ${(m.skewness ?? 0).toFixed(2)}`,
      `Kurtosis:            ${(m.kurtosis ?? 0).toFixed(2)}`,
      `Z-Score:             ${(m.zScore ?? 0).toFixed(2)}`,
      `Consecutive Wins:    ${m.consecutiveWins ?? 0}`,
      `Consecutive Losses:  ${m.consecutiveLosses ?? 0}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `  Generated by FoldForge.app — EA Stress Testing Studio`,
      `  Giddings Capital Management LLC`,
      `  https://foldforge.app`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foldforge-report-${run.symbol}-${run.timeframe}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  return (
    <div className="space-y-4">
      {completed.map((r: any) => (
        <Card key={r.id} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{r.name || r.eaName} Report</h3>
                <p className="text-sm text-muted-foreground">{r.symbol} &middot; {r.timeframe} &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                {r.metrics && (
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Net: <span className={`font-medium ${(r.metrics.netProfit ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>${(r.metrics.netProfit ?? 0).toFixed(2)}</span></span>
                    <span>Win: <span className="font-medium">{(r.metrics.winRate ?? 0).toFixed(1)}%</span></span>
                    <span>PF: <span className="font-medium">{(r.metrics.profitFactor ?? 0).toFixed(2)}</span></span>
                    <span>Sharpe: <span className="font-medium">{(r.metrics.sharpeRatio ?? 0).toFixed(2)}</span></span>
                    <span>DD: <span className="font-medium text-red-400">{(r.metrics.maxDrawdownPercent ?? 0).toFixed(1)}%</span></span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => exportReport(r)}>
                <Download size={14} className="mr-1.5" />Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Reference Tab
// ============================================================================

function ReferenceTab() {
  const { data: symbols, isLoading } = trpc.referenceData.getAll.useQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    if (!symbols) return [];
    return symbols.filter((s: any) => {
      const matchSearch = !search || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || s.category === category;
      return matchSearch && matchCat;
    });
  }, [symbols, search, category]);

  const categories = useMemo(() => {
    if (!symbols) return [];
    return Array.from(new Set(symbols.map((s: any) => s.category))).sort();
  }, [symbols]);

  if (isLoading) return <LoadingCard />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input placeholder="Search symbols..." value={search} onChange={e => setSearch(e.target.value)} className="bg-input border-border md:max-w-xs" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-input border-border md:max-w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground self-center">{filtered.length} symbols</div>
      </div>
      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-4">Symbol</th>
                <th className="text-left py-2 pr-4">Description</th>
                <th className="text-left py-2 pr-4">Category</th>
                <th className="text-right py-2 pr-4">Digits</th>
                <th className="text-right py-2 pr-4">Pip Value</th>
                <th className="text-right py-2">Spread</th>
              </tr></thead>
              <tbody>
                {filtered.slice(0, 100).map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-2 pr-4 font-medium text-primary">{s.symbol}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.description || "—"}</td>
                    <td className="py-2 pr-4"><Badge variant="secondary" className="capitalize text-xs">{s.category}</Badge></td>
                    <td className="py-2 pr-4 text-right">{s.digits}</td>
                    <td className="py-2 pr-4 text-right">{s.pipValue ?? "—"}</td>
                    <td className="py-2 text-right">{s.spreadTypical ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Shared Components
// ============================================================================

function MetricCard({ icon: Icon, label, value, positive }: { icon: any; label: string; value: string; positive?: boolean }) {
  return (
    <div className="bg-secondary/30 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-lg font-bold ${positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SliderField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs font-medium">{step < 1 ? value.toFixed(2) : value}{unit || ""}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card className="bg-card border-border"><CardContent className="pt-6">
      <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}</div>
    </CardContent></Card>
  );
}

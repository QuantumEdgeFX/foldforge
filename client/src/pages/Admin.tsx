import { useAuth } from "@/_core/hooks/useAuth";

import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import {
  Users, CreditCard, Key, LifeBuoy, Download, BarChart3,
  Shield, UserX, UserCheck, Crown, MessageSquare, Settings
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) { window.location.href = "/login"; return null; }
  if (user?.role !== "admin") return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="bg-card border-border max-w-md"><CardContent className="pt-6 text-center">
        <Shield size={48} className="mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have admin privileges.</p>
      </CardContent></Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Admin Dashboard</span></h1>
            <p className="text-muted-foreground">Manage users, subscriptions, licenses, and platform operations.</p>
          </div>
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border flex-wrap">
              <TabsTrigger value="metrics"><BarChart3 size={14} className="mr-1.5" />Metrics</TabsTrigger>
              <TabsTrigger value="testing"><Settings size={14} className="mr-1.5" />Testing</TabsTrigger>
              <TabsTrigger value="users"><Users size={14} className="mr-1.5" />Users</TabsTrigger>
              <TabsTrigger value="subscriptions"><CreditCard size={14} className="mr-1.5" />Subscriptions</TabsTrigger>
              <TabsTrigger value="licenses"><Key size={14} className="mr-1.5" />Licenses</TabsTrigger>
              <TabsTrigger value="tickets"><LifeBuoy size={14} className="mr-1.5" />Tickets</TabsTrigger>
              <TabsTrigger value="downloads"><Download size={14} className="mr-1.5" />Downloads</TabsTrigger>
            </TabsList>
            <TabsContent value="metrics"><MetricsTab /></TabsContent>
            <TabsContent value="testing"><TestingTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
            <TabsContent value="subscriptions"><SubscriptionsTab /></TabsContent>
            <TabsContent value="licenses"><LicensesTab /></TabsContent>
            <TabsContent value="tickets"><TicketsTab /></TabsContent>
            <TabsContent value="downloads"><DownloadsTab /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function MetricsTab() {
  const { data: metrics, isLoading } = trpc.admin.getMetrics.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  if (!metrics) return null;
  const cards = [
    { label: "Total Users", value: metrics.totalUsers, icon: Users },
    { label: "Active Subscriptions", value: metrics.activeSubscriptions, icon: CreditCard },
    { label: "Total Licenses", value: metrics.totalLicenses, icon: Key },
    { label: "Open Tickets", value: metrics.openTickets, icon: LifeBuoy },
    { label: "MRR (Est.)", value: `$${metrics.mrrEstimate?.toLocaleString() ?? 0}`, icon: BarChart3 },
  ];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={18} className="text-primary" />
            </div>
            <span className="text-3xl font-bold">{c.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading, refetch } = trpc.admin.getUsers.useQuery();
  const suspend = trpc.admin.suspendUser.useMutation({ onSuccess: () => { toast.success("User updated"); refetch(); } });
  const promote = trpc.admin.promoteUser.useMutation({ onSuccess: () => { toast.success("Role updated"); refetch(); } });
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Users ({users?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">Name</th><th className="text-left py-2 pr-4">Email</th>
              <th className="text-left py-2 pr-4">Role</th><th className="text-left py-2 pr-4">Joined</th>
              <th className="text-right py-2">Actions</th>
            </tr></thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{u.name || "—"}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.email || "—"}</td>
                  <td className="py-2 pr-4"><Badge className={u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"} >{u.role}</Badge></td>
                  <td className="py-2 pr-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.role !== "admin" && <Button variant="ghost" size="sm" onClick={() => promote.mutate({ userId: u.id, role: "admin" })}><Crown size={14} className="mr-1" />Promote</Button>}
                      {u.role === "admin" && <Button variant="ghost" size="sm" onClick={() => promote.mutate({ userId: u.id, role: "user" })}><UserCheck size={14} className="mr-1" />Demote</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionsTab() {
  const { data: subs, isLoading } = trpc.admin.getSubscriptions.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Subscriptions ({subs?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">User ID</th><th className="text-left py-2 pr-4">Plan</th>
              <th className="text-left py-2 pr-4">Status</th><th className="text-left py-2 pr-4">Period End</th>
              <th className="text-left py-2">Stripe ID</th>
            </tr></thead>
            <tbody>
              {subs?.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2 pr-4">{s.userId}</td>
                  <td className="py-2 pr-4"><Badge className="capitalize bg-primary/10 text-primary">{s.plan}</Badge></td>
                  <td className="py-2 pr-4"><Badge variant={s.status === "active" ? "default" : "destructive"} className="capitalize">{s.status}</Badge></td>
                  <td className="py-2 pr-4 text-muted-foreground">{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                  <td className="py-2 text-muted-foreground font-mono text-xs">{s.stripeSubscriptionId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LicensesTab() {
  const { data: licenses, isLoading, refetch } = trpc.admin.getLicenses.useQuery();
  const revoke = trpc.admin.revokeLicense.useMutation({ onSuccess: () => { toast.success("License revoked"); refetch(); } });
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Licenses ({licenses?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">Key</th><th className="text-left py-2 pr-4">Plan</th>
              <th className="text-left py-2 pr-4">Status</th><th className="text-left py-2 pr-4">Activations</th>
              <th className="text-right py-2">Actions</th>
            </tr></thead>
            <tbody>
              {licenses?.map((l: any) => (
                <tr key={l.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono text-xs text-primary">{l.licenseKey}</td>
                  <td className="py-2 pr-4"><Badge className="capitalize bg-secondary text-secondary-foreground">{l.plan}</Badge></td>
                  <td className="py-2 pr-4"><Badge variant={l.status === "active" ? "default" : "destructive"} className="capitalize">{l.status}</Badge></td>
                  <td className="py-2 pr-4">{l.activations?.length ?? 0}/{l.maxActivations}</td>
                  <td className="py-2 text-right">
                    {l.status === "active" && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revoke.mutate({ licenseId: l.id })}>Revoke</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketsTab() {
  const { data: tickets, isLoading, refetch } = trpc.admin.getTickets.useQuery();
  const reply = trpc.admin.replyTicket.useMutation({ onSuccess: () => { toast.success("Reply sent"); refetch(); setReplyText(""); setReplyId(null); } });
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<string>("resolved");
  if (isLoading) return <LoadingSkeleton />;
  return (
    <div className="space-y-4">
      {tickets?.map((t: any) => (
        <Card key={t.id} className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">{t.subject}</h3>
                <p className="text-xs text-muted-foreground">User #{t.userId} &middot; {new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`capitalize ${t.priority === "urgent" ? "bg-destructive text-destructive-foreground" : t.priority === "high" ? "bg-orange-500/10 text-orange-400" : "bg-secondary text-secondary-foreground"}`}>{t.priority}</Badge>
                <Badge variant={t.status === "resolved" || t.status === "closed" ? "default" : "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t.message}</p>
            {t.adminReply && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mb-3">
                <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                <p className="text-sm">{t.adminReply}</p>
              </div>
            )}
            {replyId === t.id ? (
              <div className="space-y-3 border-t border-border pt-3">
                <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." rows={3} className="bg-input border-border" />
                <div className="flex items-center gap-3">
                  <Select value={replyStatus} onValueChange={setReplyStatus}>
                    <SelectTrigger className="w-40 bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => reply.mutate({ ticketId: t.id, reply: replyText, status: replyStatus as any })} disabled={!replyText} className="bg-primary text-primary-foreground">Send Reply</Button>
                  <Button variant="ghost" onClick={() => setReplyId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setReplyId(t.id)}>
                <MessageSquare size={14} className="mr-1.5" />Reply
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TestingTab() {
  const { data: users } = trpc.admin.getUsers.useQuery();
  const { data: allRuns, isLoading, refetch } = trpc.admin.getAllStudioRuns.useQuery();
  const { data: stats } = trpc.admin.getTestingEngineStats.useQuery();
  const runBacktest = trpc.admin.adminRunBacktest.useMutation({ onSuccess: () => { toast.success("Backtest started!"); refetch(); } });
  const runMonteCarlo = trpc.admin.adminRunMonteCarloSimulation.useMutation({ onSuccess: () => { toast.success("Monte Carlo simulation started!"); refetch(); } });
  const runWalkForward = trpc.admin.adminRunWalkForwardAnalysis.useMutation({ onSuccess: () => { toast.success("Walk-Forward analysis started!"); refetch(); } });
  const runStressTest = trpc.admin.adminRunStressTest.useMutation({ onSuccess: () => { toast.success("Stress test started!"); refetch(); } });

  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [testMode, setTestMode] = useState<'admin' | 'self'>('admin');
  const [testConfig, setTestConfig] = useState({ name: "Admin Test", symbol: "EURUSD", timeframe: "H1", initialBalance: 10000, riskPerTrade: 0.02, winRate: 0.55, numTrades: 100 });

  const handleRunBacktest = () => {
    if (testMode === 'admin' && !selectedUser) { toast.error("Select a user"); return; }
    const userId = testMode === 'self' ? user?.id : parseInt(selectedUser);
    if (!userId) { toast.error("User not found"); return; }
    runBacktest.mutate({ userId, name: testConfig.name, symbol: testConfig.symbol, timeframe: testConfig.timeframe });
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Testing Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-card border-border"><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Runs</span><span className="text-3xl font-bold">{stats?.totalRuns ?? 0}</span></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Completed</span><span className="text-3xl font-bold text-green-400">{stats?.completedRuns ?? 0}</span></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Running</span><span className="text-3xl font-bold text-blue-400">{stats?.runningRuns ?? 0}</span></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Failed</span><span className="text-3xl font-bold text-red-400">{stats?.failedRuns ?? 0}</span></div></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="pt-6"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Avg Profit</span><span className="text-3xl font-bold">${(stats?.avgNetProfit ?? 0).toFixed(0)}</span></div></CardContent></Card>
      </div>

      {/* Test Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setTestMode('admin')} className={testMode === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}>Run for User</Button>
        <Button onClick={() => setTestMode('self')} className={testMode === 'self' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}>Run My Own Test</Button>
      </div>

      {/* Run Test Configuration */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>{testMode === 'self' ? 'Run Your Own Test' : 'Run Test for User'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            {testMode === 'admin' && <div>
              <label className="text-sm text-muted-foreground block mb-2">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Choose user..." /></SelectTrigger>
                <SelectContent>
                  {users?.map((u: any) => <SelectItem key={u.id} value={String(u.id)}>{u.email} (ID: {u.id})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Test Name</label>
              <Input value={testConfig.name} onChange={e => setTestConfig({...testConfig, name: e.target.value})} className="bg-input border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Symbol</label>
              <Input value={testConfig.symbol} onChange={e => setTestConfig({...testConfig, symbol: e.target.value})} className="bg-input border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Timeframe</label>
              <Input value={testConfig.timeframe} onChange={e => setTestConfig({...testConfig, timeframe: e.target.value})} className="bg-input border-border" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRunBacktest} disabled={runBacktest.isPending} className="bg-primary text-primary-foreground">Run Backtest</Button>
            <Button onClick={() => selectedUser && runMonteCarlo.mutate({ runId: allRuns?.[0]?.id || 1, numSimulations: 1000 })} disabled={runMonteCarlo.isPending} variant="outline">Monte Carlo (1000)</Button>
            <Button onClick={() => selectedUser && runWalkForward.mutate({ runId: allRuns?.[0]?.id || 1, numWindows: 6 })} disabled={runWalkForward.isPending} variant="outline">Walk-Forward</Button>
            <Button onClick={() => selectedUser && runStressTest.mutate({ runId: allRuns?.[0]?.id || 1 })} disabled={runStressTest.isPending} variant="outline">Stress Test</Button>
          </div>
        </CardContent>
      </Card>

      {/* Test History */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Test History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="text-left py-2 pr-4">ID</th><th className="text-left py-2 pr-4">User</th><th className="text-left py-2 pr-4">Symbol</th><th className="text-left py-2 pr-4">Status</th><th className="text-left py-2 pr-4">Profit</th><th className="text-left py-2">Created</th></tr></thead>
              <tbody>
                {allRuns?.slice(0, 20).map((r: any) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{r.id}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{r.userId}</td>
                    <td className="py-2 pr-4">{r.symbol}</td>
                    <td className="py-2 pr-4"><Badge className={r.status === "completed" ? "bg-green-500/10 text-green-400" : r.status === "running" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}>{r.status}</Badge></td>
                    <td className="py-2 pr-4 font-medium">${(r.metrics?.netProfit ?? 0).toFixed(2)}</td>
                    <td className="py-2 text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</td>
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

function DownloadsTab() {
  const { data: logs, isLoading } = trpc.admin.getDownloadLogs.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>Download Logs</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">User ID</th><th className="text-left py-2 pr-4">File ID</th>
              <th className="text-left py-2">Downloaded At</th>
            </tr></thead>
            <tbody>
              {logs?.map((l: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 pr-4">{l.userId}</td>
                  <td className="py-2 pr-4">{l.fileId}</td>
                  <td className="py-2 text-muted-foreground">{new Date(l.downloadedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return <Card className="bg-card border-border"><CardContent className="pt-6"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}</div></CardContent></Card>;
}

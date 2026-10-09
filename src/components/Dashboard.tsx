import { useMemo, useState } from "react";
import type { SeoReport } from "@/lib/seo-analyzer";
import { generateSeoPdf } from "@/lib/pdf-report";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from "recharts";
import {
  AlertCircle, AlertTriangle, CheckCircle2, RotateCw, Share2, Download, Globe, Smartphone, Lock, Bot, Gauge,
} from "lucide-react";

type Tab = "overview" | "issues" | "onpage" | "technical" | "keywords" | "performance";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "issues", label: "Issues & Recommendations" },
  { id: "onpage", label: "On-Page SEO" },
  { id: "technical", label: "Technical SEO" },
  { id: "keywords", label: "Keywords" },
  { id: "performance", label: "Performance" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} stroke="var(--muted)" strokeWidth="14" fill="none" />
        <circle
          cx="80" cy="80" r={r}
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground">SEO Score</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number | string; tone: "error" | "warning" | "success" | "default" }) {
  const tones = {
    error: "bg-destructive/10 text-destructive",
    warning: "bg-warning/15 text-[oklch(0.5_0.15_60)]",
    success: "bg-success/15 text-[oklch(0.45_0.15_155)]",
    default: "bg-accent text-accent-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}

const STATUS_BADGE = {
  error: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle, label: "Error" },
  warning: { cls: "bg-warning/15 text-[oklch(0.45_0.15_60)] border-warning/30", icon: AlertTriangle, label: "Warning" },
  good: { cls: "bg-success/15 text-[oklch(0.4_0.15_155)] border-success/30", icon: CheckCircle2, label: "Good" },
};

export function Dashboard({ report, onReanalyze }: { report: SeoReport; onReanalyze: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  const pieData = useMemo(() => [
    { name: "Passed", value: report.passed, color: "var(--success)" },
    { name: "Warnings", value: report.warnings, color: "var(--warning)" },
    { name: "Critical", value: report.critical, color: "var(--destructive)" },
  ], [report]);

  const categoriesData = [
    { name: "On-Page", value: report.categories.onPage },
    { name: "Technical", value: report.categories.technical },
    { name: "Off-Page", value: report.categories.offPage },
    { name: "Social", value: report.categories.social },
  ];

  const share = async () => {
    const text = `SEO Score for ${report.domain}: ${report.score}/100`;
    try {
      if (navigator.share) await navigator.share({ title: "Smart-SEO-Analyzer", text, url: report.url });
      else {
        await navigator.clipboard.writeText(`${text} — ${report.url}`);
        alert("Report summary copied to clipboard!");
      }
    } catch {/* noop */}
  };

  const download = () => {
    generateSeoPdf(report);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-gradient-to-r from-accent/40 to-transparent px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Analyzed website</div>
              <div className="text-lg font-semibold">{report.domain}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onReanalyze} className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
              <RotateCw className="h-4 w-4" /> Re-analyze
            </button>
            <button onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow px-3 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto px-3 py-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Gauge} label="SEO Score" value={`${report.score}/100`} tone="default" />
        <StatCard icon={AlertCircle} label="Critical Issues" value={report.critical} tone="error" />
        <StatCard icon={AlertTriangle} label="Warnings" value={report.warnings} tone="warning" />
        <StatCard icon={CheckCircle2} label="Passed Checks" value={report.passed} tone="success" />
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Overall Score</h3>
            <div className="flex justify-center"><ScoreRing score={report.score} /></div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">SEO Categories</h3>
            <div className="space-y-4">
              <CategoryBar label="On-Page SEO" value={report.categories.onPage} />
              <CategoryBar label="Technical SEO" value={report.categories.technical} />
              <CategoryBar label="Off-Page SEO" value={report.categories.offPage} />
              <CategoryBar label="Social Score" value={report.categories.social} />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Issue Breakdown</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Categories Comparison</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "issues" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Check</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {report.issues.map((i, idx) => {
                const s = STATUS_BADGE[i.status];
                const SIcon = s.icon;
                return (
                  <tr key={idx} className="border-t border-border/60 transition-colors hover:bg-accent/30">
                    <td className="px-5 py-3.5 font-medium">{i.type}</td>
                    <td className="px-5 py-3.5">{i.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.cls}`}>
                        <SIcon className="h-3 w-3" /> {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{i.suggestion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "onpage" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoRow label="Title length" value={`${report.onPage.titleLength} chars`} ok={report.onPage.titleLength <= 60} />
          <InfoRow label="Meta description" value={`${report.onPage.metaDescription} chars`} ok={report.onPage.metaDescription >= 120 && report.onPage.metaDescription <= 160} />
          <InfoRow label="H1 tags" value={report.onPage.h1Count} ok={report.onPage.h1Count === 1} />
          <InfoRow label="H2 tags" value={report.onPage.h2Count} ok={report.onPage.h2Count >= 2} />
          <InfoRow label="Keyword density" value={`${report.onPage.keywordDensity.toFixed(1)}%`} ok={report.onPage.keywordDensity >= 1 && report.onPage.keywordDensity <= 3} />
          <InfoRow label="Images without alt" value={`${report.onPage.imagesWithoutAlt} / ${report.onPage.totalImages}`} ok={report.onPage.imagesWithoutAlt === 0} />
        </div>
      )}

      {tab === "technical" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TechCard icon={Gauge} label="Page Speed Score" value={`${report.technical.pageSpeed}/100`} ok={report.technical.pageSpeed >= 70} />
          <TechCard icon={Smartphone} label="Mobile Friendly" value={report.technical.mobileFriendly ? "Yes" : "No"} ok={report.technical.mobileFriendly} />
          <TechCard icon={Lock} label="HTTPS / SSL" value={report.technical.https ? "Secure" : "Not secure"} ok={report.technical.https} />
          <TechCard icon={Bot} label="Crawlability (robots.txt)" value={report.technical.robotsTxt ? "Accessible" : "Missing"} ok={report.technical.robotsTxt} />
        </div>
      )}

      {tab === "keywords" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Keyword</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Volume</th>
                <th className="px-5 py-3">Difficulty</th>
                <th className="px-5 py-3">Intent</th>
              </tr>
            </thead>
            <tbody>
              {report.keywords.map((k, i) => (
                <tr key={i} className="border-t border-border/60 hover:bg-accent/30">
                  <td className="px-5 py-3.5 font-medium">{k.term}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{k.longTail ? "Long-tail" : "Primary"}</td>
                  <td className="px-5 py-3.5">{k.volume.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      k.difficulty === "Low" ? "bg-success/15 text-[oklch(0.4_0.15_155)]" :
                      k.difficulty === "Medium" ? "bg-warning/15 text-[oklch(0.45_0.15_60)]" :
                      "bg-destructive/10 text-destructive"
                    }`}>{k.difficulty}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{k.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "performance" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Performance Trend (simulated)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* What to fix first */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-accent/40 via-card to-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-lg font-bold">🎯 What to fix first</h3>
        <p className="mt-1 text-sm text-muted-foreground">Tackle these in order — biggest impact at the top.</p>
        <div className="mt-4 space-y-3">
          {report.priorityFixes.length === 0 && <p className="text-sm">Nothing critical — your site is in great shape! 🎉</p>}
          {report.priorityFixes.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                f.impact === "Critical" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-[oklch(0.45_0.15_60)]"
              }`}>{i + 1}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{f.title}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{f.impact}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, ok }: { label: string; value: string | number; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 text-xl font-semibold">{value}</div>
      </div>
      {ok
        ? <CheckCircle2 className="h-6 w-6 text-[oklch(0.55_0.18_155)]" />
        : <AlertTriangle className="h-6 w-6 text-[oklch(0.6_0.18_60)]" />}
    </div>
  );
}

function TechCard({ icon: Icon, label, value, ok }: { icon: any; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ok ? "bg-success/15 text-[oklch(0.45_0.15_155)]" : "bg-destructive/10 text-destructive"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

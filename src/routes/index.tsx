import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dashboard } from "@/components/Dashboard";
import { analyze, type SeoReport } from "@/lib/seo-analyzer";
import { Search, Sparkles, BarChart3, Lightbulb, Zap, ShieldCheck, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart-SEO-Analyzer — Free instant SEO audit" },
      { name: "description", content: "Analyze any website's SEO performance instantly. Get an SEO score, issues, keywords and actionable fixes — free." },
      { property: "og:title", content: "Smart-SEO-Analyzer — Free instant SEO audit" },
      { property: "og:description", content: "Analyze any website's SEO performance instantly with beginner-friendly insights." },
    ],
  }),
  component: Index,
});

const EXAMPLES = ["google.com", "amazon.com", "github.com"];

function Index() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);

  const run = async (target?: string) => {
    const value = (target ?? url).trim();
    if (!value) return;
    setUrl(value);
    setLoading(true);
    setReport(null);
    await new Promise(r => setTimeout(r, 1100));
    setReport(analyze(value));
    setLoading(false);
    setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 opacity-50 [background:radial-gradient(circle_at_30%_20%,oklch(0.7_0.2_300/0.25),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.7_0.18_200/0.2),transparent_50%)]" />
        <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> 100% free · No signup required
          </div>
          <h1 className="text-balance bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            Smart SEO Analyzer
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Analyze your website SEO performance instantly. Get a clear score, prioritized fixes, and beginner-friendly insights.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); run(); }}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card/80 p-2 shadow-[var(--shadow-card)] backdrop-blur-xl sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g. example.com)"
                className="w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? <Spinner /> : <><Zap className="h-4 w-4" /> Analyze Website</>}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Try:</span>
            {EXAMPLES.map(e => (
              <button
                key={e}
                onClick={() => run(e)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Report */}
      <section id="report" className="mx-auto max-w-6xl px-4 pb-16">
        {loading && <LoadingState />}
        {report && !loading && <Dashboard report={report} onReanalyze={() => run(report.url)} />}
        {!report && !loading && <FeatureGrid />}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How Smart-SEO-Analyzer Works</h2>
          <p className="mt-2 text-muted-foreground">Three simple steps to better SEO.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: 1, t: "Enter your website URL", d: "Paste any URL — no signup, no installation." },
            { n: 2, t: "Click Analyze", d: "We scan on-page, technical, and keyword signals in seconds." },
            { n: 3, t: "Get actionable insights", d: "Read prioritized fixes ordered by impact, then download your report." },
          ].map(s => (
            <div key={s.n} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What this tool does */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-accent/30 p-10 shadow-[var(--shadow-card)]">
          <h2 className="text-3xl font-bold">What this tool does</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">A complete, beginner-friendly SEO audit you can act on today.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: BarChart3, t: "SEO Audit", d: "On-page, technical and off-page checks with a single score." },
              { icon: Lightbulb, t: "Keyword Suggestions", d: "Primary and long-tail ideas with volume, intent, and difficulty." },
              { icon: ShieldCheck, t: "Performance Insights", d: "Page speed, mobile, HTTPS, crawlability — explained simply." },
            ].map(f => (
              <div key={f.t} className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />;
}

function LoadingState() {
  return (
    <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      <p className="font-semibold">Analyzing your website…</p>
      <p className="mt-1 text-sm text-muted-foreground">Running 30+ SEO checks. This usually takes under 2 seconds.</p>
    </div>
  );
}

function FeatureGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[
        { icon: Target, t: "Prioritized fixes", d: "We rank issues by impact so you know what to fix first." },
        { icon: BarChart3, t: "Beautiful charts", d: "Visualize SEO scores, categories and trends at a glance." },
        { icon: Sparkles, t: "Beginner friendly", d: "Plain-English explanations — no SEO jargon required." },
      ].map(f => (
        <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <f.icon className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-semibold">{f.t}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
        </div>
      ))}
    </div>
  );
}

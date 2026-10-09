import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Smart-SEO-Analyzer" },
      { name: "description", content: "See how Smart-SEO-Analyzer audits any website in three steps and turns the results into clear, prioritized fixes." },
      { property: "og:title", content: "How it works — Smart-SEO-Analyzer" },
      { property: "og:description", content: "Three steps from URL to actionable SEO insights." },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { n: 1, t: "Enter your website URL", d: "Paste any URL (with or without https). We'll normalize it for you." },
  { n: 2, t: "Click Analyze", d: "Smart-SEO-Analyzer runs 30+ on-page, technical, and keyword checks." },
  { n: 3, t: "Read your report", d: "Score, charts, issues, keywords, and a 'fix this first' list ordered by impact." },
];

const USAGE = [
  "Open the homepage and type a domain like example.com.",
  "Click 'Analyze Website' or pick one of the example URLs.",
  "Switch tabs to drill into On-Page, Technical, Keywords or Performance.",
  "Open 'What to fix first' for a prioritized to-do list.",
  "Use Re-analyze to refresh, Share to send the result, or Download for a JSON copy.",
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">How it works</h1>
        <p className="mt-3 text-lg text-muted-foreground">From URL to actionable SEO insights in under 2 seconds.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map(s => (
            <div key={s.n} className="relative rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">How to use</h2>
          <ol className="mt-5 space-y-3">
            {USAGE.map((u, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="text-sm">{u}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            Run your first audit →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

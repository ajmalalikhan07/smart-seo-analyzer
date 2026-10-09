import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, GraduationCap, Megaphone, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Smart-SEO-Analyzer" },
      { name: "description", content: "Smart-SEO-Analyzer is a free, beginner-friendly SEO audit tool for students, marketers, and small businesses." },
      { property: "og:title", content: "About — Smart-SEO-Analyzer" },
      { property: "og:description", content: "Free, beginner-friendly SEO insights for everyone." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> About
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Smart-SEO-Analyzer</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Smart-SEO-Analyzer is a free, no-signup SEO audit tool that turns confusing technical reports into clear,
          actionable steps. Enter a URL, and within seconds you get a score, prioritized issues, keyword ideas and
          performance insights — all in plain English.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: GraduationCap, t: "For students", d: "Learn SEO fundamentals by exploring real audits." },
            { icon: Megaphone, t: "For marketers", d: "Quick checks before publishing content or campaigns." },
            { icon: Heart, t: "For beginners", d: "No jargon — just clear next steps that actually move the needle." },
          ].map(f => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-gradient-to-br from-accent/40 to-card p-8">
          <h2 className="text-2xl font-bold">Why is it free?</h2>
          <p className="mt-3 text-muted-foreground">
            Good SEO shouldn't be locked behind paywalls. We built Smart-SEO-Analyzer so anyone — independent creators,
            students, side-project hackers — can get the same baseline SEO clarity that pros pay hundreds for.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            Try the analyzer →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Search } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ssa-theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ssa-theme", next ? "dark" : "light");
  };

  const linkCls = (to: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      pathname === to ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-glow)]">
            <Search className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight">
            Smart-SEO-Analyzer
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className={linkCls("/")}>Home</Link>
          <Link to="/how-it-works" className={linkCls("/how-it-works")}>How it works</Link>
          <Link to="/about" className={linkCls("/about")}>About</Link>
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

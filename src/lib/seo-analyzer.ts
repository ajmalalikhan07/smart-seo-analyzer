// Deterministic-ish "SEO" simulation based on URL hash
export type Severity = "error" | "warning" | "good";

export type Issue = {
  type: string;
  name: string;
  status: Severity;
  suggestion: string;
};

export type Keyword = {
  term: string;
  volume: number;
  difficulty: "Low" | "Medium" | "High";
  intent: "Informational" | "Transactional" | "Navigational";
  longTail: boolean;
};

export type SeoReport = {
  url: string;
  domain: string;
  scannedAt: string;
  score: number;
  critical: number;
  warnings: number;
  passed: number;
  categories: { onPage: number; technical: number; offPage: number; social: number };
  issues: Issue[];
  onPage: {
    titleLength: number;
    titleStatus: Severity;
    metaDescription: number;
    metaStatus: Severity;
    h1Count: number;
    h2Count: number;
    keywordDensity: number;
    imagesWithoutAlt: number;
    totalImages: number;
  };
  technical: {
    pageSpeed: number;
    mobileFriendly: boolean;
    https: boolean;
    crawlable: boolean;
    robotsTxt: boolean;
  };
  keywords: Keyword[];
  performanceTrend: { month: string; score: number }[];
  priorityFixes: { title: string; impact: "Critical" | "High" | "Medium" | "Low"; tip: string }[];
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(seed: number, arr: T[]) {
  return arr[seed % arr.length];
}

export function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
}

export function analyze(rawUrl: string): SeoReport {
  const url = normalizeUrl(rawUrl);
  const domain = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const seed = hash(domain);
  const rand = (offset: number, max: number) => ((seed + offset * 7) % max);

  const onPage = 55 + rand(1, 40);
  const technical = 50 + rand(2, 45);
  const offPage = 40 + rand(3, 55);
  const social = 35 + rand(4, 60);
  const score = Math.round((onPage * 0.3 + technical * 0.3 + offPage * 0.25 + social * 0.15));

  const allIssues: Issue[] = [
    { type: "On-Page", name: "Missing H1 tag", status: rand(5, 3) === 0 ? "error" : "good", suggestion: "Add a unique H1 describing the page topic." },
    { type: "On-Page", name: "Title tag too long", status: rand(6, 2) === 0 ? "warning" : "good", suggestion: "Keep title under 60 characters." },
    { type: "On-Page", name: "Missing meta description", status: rand(7, 2) === 0 ? "error" : "good", suggestion: "Add a 150–160 char meta description." },
    { type: "Technical", name: "Broken internal links", status: rand(8, 3) === 0 ? "warning" : "good", suggestion: "Audit and remove broken links." },
    { type: "Performance", name: "Slow page load speed", status: technical < 70 ? "warning" : "good", suggestion: "Compress images and enable caching." },
    { type: "Accessibility", name: "Images missing alt text", status: rand(9, 2) === 0 ? "warning" : "good", suggestion: "Add descriptive alt attributes to images." },
    { type: "Mobile", name: "Mobile viewport configured", status: "good", suggestion: "Great — viewport meta tag is set." },
    { type: "Security", name: "HTTPS enabled", status: url.startsWith("https") ? "good" : "error", suggestion: "Install an SSL certificate." },
    { type: "SEO", name: "Sitemap.xml present", status: rand(10, 3) === 0 ? "warning" : "good", suggestion: "Submit sitemap to Google Search Console." },
    { type: "SEO", name: "Open Graph tags", status: rand(11, 2) === 0 ? "warning" : "good", suggestion: "Add og:title, og:description, og:image." },
  ];

  const critical = allIssues.filter(i => i.status === "error").length;
  const warnings = allIssues.filter(i => i.status === "warning").length;
  const passed = allIssues.filter(i => i.status === "good").length;

  const intents: Keyword["intent"][] = ["Informational", "Transactional", "Navigational"];
  const diffs: Keyword["difficulty"][] = ["Low", "Medium", "High"];
  const baseTerms = [domain.split(".")[0], "best " + domain.split(".")[0], "how to use " + domain.split(".")[0], domain.split(".")[0] + " review", domain.split(".")[0] + " pricing", "alternatives to " + domain.split(".")[0], domain.split(".")[0] + " tutorial", "free " + domain.split(".")[0]];
  const keywords: Keyword[] = baseTerms.map((t, i) => ({
    term: t,
    volume: 200 + ((seed + i * 13) % 9800),
    difficulty: pick(seed + i, diffs),
    intent: pick(seed + i * 3, intents),
    longTail: t.split(" ").length >= 3,
  }));

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const performanceTrend = months.map((m, i) => ({
    month: m,
    score: Math.max(20, Math.min(100, score - 15 + ((seed + i * 11) % 25))),
  }));

  const priorityFixes = allIssues
    .filter(i => i.status !== "good")
    .map(i => ({
      title: i.name,
      impact: (i.status === "error" ? "Critical" : "Medium") as "Critical" | "Medium",
      tip: i.suggestion,
    }))
    .slice(0, 5);

  return {
    url,
    domain,
    scannedAt: new Date().toISOString(),
    score,
    critical,
    warnings,
    passed,
    categories: { onPage, technical, offPage, social },
    issues: allIssues,
    onPage: {
      titleLength: 35 + rand(20, 40),
      titleStatus: rand(20, 40) > 25 ? "warning" : "good",
      metaDescription: 110 + rand(21, 70),
      metaStatus: "good",
      h1Count: rand(22, 3),
      h2Count: 3 + rand(23, 8),
      keywordDensity: 1 + (rand(24, 40) / 10),
      imagesWithoutAlt: rand(25, 8),
      totalImages: 10 + rand(26, 20),
    },
    technical: {
      pageSpeed: technical,
      mobileFriendly: rand(27, 5) > 0,
      https: url.startsWith("https"),
      crawlable: true,
      robotsTxt: rand(28, 4) > 0,
    },
    keywords,
    performanceTrend,
    priorityFixes,
  };
}

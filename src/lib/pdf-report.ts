import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SeoReport } from "./seo-analyzer";

const PURPLE: [number, number, number] = [124, 58, 237];
const PURPLE_LIGHT: [number, number, number] = [167, 139, 250];
const TEXT: [number, number, number] = [30, 27, 45];
const MUTED: [number, number, number] = [110, 110, 130];
const SUCCESS: [number, number, number] = [22, 163, 74];
const WARNING: [number, number, number] = [217, 119, 6];
const DANGER: [number, number, number] = [220, 38, 38];
const BG_SOFT: [number, number, number] = [245, 243, 255];

function statusColor(s: string): [number, number, number] {
  if (s === "good") return SUCCESS;
  if (s === "warning") return WARNING;
  return DANGER;
}

function statusLabel(s: string) {
  return s === "good" ? "Passed" : s === "warning" ? "Warning" : "Critical";
}

export function generateSeoPdf(report: SeoReport) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 0;

  // ===== Header banner =====
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(...PURPLE_LIGHT);
  doc.circle(pageW - 60, 30, 80, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Smart SEO Analyzer", margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Professional SEO Audit Report", margin, 70);
  doc.setFontSize(9);
  doc.text(
    `Generated: ${new Date(report.scannedAt).toLocaleString()}`,
    margin,
    90
  );

  y = 140;

  // ===== Website + Score card =====
  doc.setFillColor(...BG_SOFT);
  doc.roundedRect(margin, y, pageW - margin * 2, 110, 10, 10, "F");

  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("ANALYZED WEBSITE", margin + 20, y + 25);

  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(report.domain, margin + 20, y + 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(report.url, margin + 20, y + 63);

  // Score circle
  const cx = pageW - margin - 55;
  const cy = y + 55;
  doc.setFillColor(...PURPLE);
  doc.circle(cx, cy, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(`${report.score}`, cx, cy + 4, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("/ 100", cx, cy + 18, { align: "center" });

  // Stat pills
  const pillY = y + 80;
  const pillW = 95;
  const pillH = 22;
  const stats = [
    { label: "Critical", value: report.critical, color: DANGER },
    { label: "Warnings", value: report.warnings, color: WARNING },
    { label: "Passed", value: report.passed, color: SUCCESS },
  ];
  stats.forEach((s, i) => {
    const px = margin + 20 + i * (pillW + 8);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(px, pillY, pillW, pillH, 6, 6, "F");
    doc.setFillColor(...s.color);
    doc.circle(px + 10, pillY + 11, 3.5, "F");
    doc.setTextColor(...TEXT);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${s.value}`, px + 20, pillY + 14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(s.label, px + 35, pillY + 14);
  });

  y += 130;

  // ===== Section helper =====
  const section = (title: string) => {
    if (y > pageH - 100) {
      doc.addPage();
      y = margin;
    }
    doc.setDrawColor(...PURPLE);
    doc.setLineWidth(3);
    doc.line(margin, y + 4, margin + 18, y + 4);
    doc.setTextColor(...TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, margin + 26, y + 8);
    y += 22;
  };

  // ===== Overview / Category scores =====
  section("Overview — Category Scores");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Category", "Score", "Rating"]],
    body: [
      ["On-Page SEO", `${report.categories.onPage}%`, rating(report.categories.onPage)],
      ["Technical SEO", `${report.categories.technical}%`, rating(report.categories.technical)],
      ["Off-Page SEO", `${report.categories.offPage}%`, rating(report.categories.offPage)],
      ["Social Signals", `${report.categories.social}%`, rating(report.categories.social)],
    ],
    headStyles: { fillColor: PURPLE, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 10, cellPadding: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // ===== Issues & Recommendations =====
  section("Issues & Recommendations");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Status", "Category", "Check", "Recommendation"]],
    body: report.issues.map((i) => [
      statusLabel(i.status),
      i.type,
      i.name,
      i.suggestion,
    ]),
    headStyles: { fillColor: PURPLE, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 9, cellPadding: 6, valign: "middle" },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold" },
      1: { cellWidth: 70 },
      2: { cellWidth: 140 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        const raw = report.issues[data.row.index].status;
        data.cell.styles.textColor = statusColor(raw);
      }
    },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // ===== On-Page SEO =====
  section("On-Page SEO");
  const op = report.onPage;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Metric", "Value", "Status"]],
    body: [
      ["Title length", `${op.titleLength} chars`, statusLabel(op.titleStatus)],
      ["Meta description", `${op.metaDescription} chars`, statusLabel(op.metaStatus)],
      ["H1 tags", `${op.h1Count}`, op.h1Count === 1 ? "Passed" : "Warning"],
      ["H2 tags", `${op.h2Count}`, "Passed"],
      ["Keyword density", `${op.keywordDensity.toFixed(1)}%`, "Passed"],
      ["Images without alt", `${op.imagesWithoutAlt} / ${op.totalImages}`, op.imagesWithoutAlt > 0 ? "Warning" : "Passed"],
    ],
    headStyles: { fillColor: PURPLE, textColor: 255 },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 10, cellPadding: 7 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // ===== Technical SEO =====
  section("Technical SEO");
  const t = report.technical;
  const yn = (b: boolean) => (b ? "Yes" : "No");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Check", "Result"]],
    body: [
      ["Page speed score", `${t.pageSpeed}%`],
      ["Mobile friendly", yn(t.mobileFriendly)],
      ["HTTPS enabled", yn(t.https)],
      ["Crawlable by bots", yn(t.crawlable)],
      ["robots.txt present", yn(t.robotsTxt)],
    ],
    headStyles: { fillColor: PURPLE, textColor: 255 },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 10, cellPadding: 7 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // ===== Keywords =====
  section("Keyword Suggestions");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Keyword", "Volume", "Difficulty", "Intent"]],
    body: report.keywords.map((k) => [
      k.term,
      k.volume.toLocaleString(),
      k.difficulty,
      k.intent,
    ]),
    headStyles: { fillColor: PURPLE, textColor: 255 },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 10, cellPadding: 6 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // ===== Performance =====
  section("Performance Trend (Last 8 Months)");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Month", "Score"]],
    body: report.performanceTrend.map((p) => [p.month, `${p.score}`]),
    headStyles: { fillColor: PURPLE, textColor: 255 },
    alternateRowStyles: { fillColor: BG_SOFT },
    styles: { fontSize: 10, cellPadding: 6 },
  });
  y = (doc as any).lastAutoTable.finalY + 24;

  // Mini bar chart for trend
  if (y > pageH - 140) {
    doc.addPage();
    y = margin;
  }
  const chartW = pageW - margin * 2;
  const chartH = 90;
  doc.setFillColor(...BG_SOFT);
  doc.roundedRect(margin, y, chartW, chartH, 8, 8, "F");
  const trend = report.performanceTrend;
  const barW = (chartW - 40) / trend.length - 6;
  const maxScore = 100;
  trend.forEach((p, i) => {
    const bx = margin + 20 + i * (barW + 6);
    const bh = (p.score / maxScore) * (chartH - 30);
    const by = y + chartH - 15 - bh;
    doc.setFillColor(...PURPLE);
    doc.roundedRect(bx, by, barW, bh, 2, 2, "F");
    doc.setTextColor(...MUTED);
    doc.setFontSize(7);
    doc.text(p.month, bx + barW / 2, y + chartH - 4, { align: "center" });
  });
  y += chartH + 24;

  // ===== Priority Fixes =====
  if (report.priorityFixes.length) {
    section("What to Fix First");
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["#", "Priority", "Issue", "Recommendation"]],
      body: report.priorityFixes.map((p, i) => [
        `${i + 1}`,
        p.impact,
        p.title,
        p.tip,
      ]),
      headStyles: { fillColor: PURPLE, textColor: 255 },
      alternateRowStyles: { fillColor: BG_SOFT },
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 60, fontStyle: "bold" } },
    });
  }

  // ===== Footer on every page =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(230, 230, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 30, pageW - margin, pageH - 30);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by Smart SEO Analyzer", margin, pageH - 15);
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 15, { align: "right" });
  }

  const safeDomain = report.domain.replace(/[^a-z0-9.-]/gi, "-");
  doc.save(`seo-report-${safeDomain}.pdf`);
}

function rating(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

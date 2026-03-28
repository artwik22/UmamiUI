import KPICards from "../components/KPICards";
import UmamiChart from "../components/UmamiChart";
import TopLists from "../components/TopLists";
import DateFilter from "../components/DateFilter";
import ThemeToggle from "../components/ThemeToggle";
import { Suspense } from "react";
import { getStats, getPageviews, getMetrics } from "../lib/umami";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const range = (params.range as string) || "7d";

  const [stats, chartData, topQueries, topReferrers, topDevices] = await Promise.all([
    getStats(range),
    getPageviews(range),
    getMetrics(range, "query"),
    getMetrics(range, "referrer"),
    getMetrics(range, "browser"),
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-10">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-9 w-40 rounded-lg bg-[var(--surface)]"></div>}>
              <DateFilter />
            </Suspense>
            <ThemeToggle />
          </div>
        </header>

        <section className="mb-8">
          <KPICards stats={stats} />
        </section>
        
        <section className="mb-8">
          <UmamiChart data={chartData} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TopLists title="Top Pages" data={topQueries} />
          <TopLists title="Top Referrers" data={topReferrers} />
          <TopLists title="Top Devices" data={topDevices} />
        </section>

        <footer className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">Powered by Umami Analytics</p>
        </footer>
      </div>
    </main>
  );
}

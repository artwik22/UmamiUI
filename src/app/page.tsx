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
    <main className="min-h-screen bg-m3-background text-m3-on-surface p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-[length:var(--m3-title-large)] font-normal tracking-normal text-m3-on-surface">
            Analytics
          </h1>
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="h-10 w-64 rounded-lg bg-m3-surface-variant"></div>}>
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopLists title="Top Pages" data={topQueries} />
          <TopLists title="Top Referrers" data={topReferrers} />
          <TopLists title="Top Devices" data={topDevices} />
        </section>

        <footer className="mt-12 flex items-center gap-2 text-m3-on-surface-variant">
          <span className="material-symbols-outlined text-lg">power</span>
          <span className="text-sm">Umami Analytics</span>
        </footer>
      </div>
    </main>
  );
}

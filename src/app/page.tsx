import KPICards from "../components/KPICards";
import UmamiChart from "../components/UmamiChart";
import TopLists from "../components/TopLists";
import DateFilter from "../components/DateFilter";
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
    <main className="min-h-screen bg-black text-neutral-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
          <Suspense fallback={<div className="h-10 w-40 bg-neutral-900 rounded-lg"></div>}>
            <DateFilter />
          </Suspense>
        </header>

        <section>
          <KPICards stats={stats} />
        </section>
        
        <section className="mt-6">
          <UmamiChart data={chartData} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <TopLists title="Top Pages" data={topQueries} />
          <TopLists title="Top Referrers" data={topReferrers} />
          <TopLists title="Top Devices" data={topDevices} />
        </section>
      </div>
    </main>
  );
}

import { getStats, getPageviews, getMetrics } from "../lib/umami";
import DashboardContent from "../components/DashboardContent";
import AuthGuard from "../components/AuthGuard";

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
    <AuthGuard>
      <DashboardContent
        stats={stats}
        chartData={chartData}
        topQueries={topQueries}
        topReferrers={topReferrers}
        topDevices={topDevices}
      />
    </AuthGuard>
  );
}

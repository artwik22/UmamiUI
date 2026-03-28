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
  const websiteId = (params.website as string) || undefined;

  const [stats, chartData, topQueries, topReferrers, topDevices] = await Promise.all([
    getStats(range, websiteId),
    getPageviews(range, websiteId),
    getMetrics(range, "query", websiteId),
    getMetrics(range, "referrer", websiteId),
    getMetrics(range, "browser", websiteId),
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

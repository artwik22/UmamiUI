"use client";

import { Suspense } from "react";
import KPICards from "./KPICards";
import UmamiChart from "./UmamiChart";
import TopLists from "./TopLists";
import DateFilter from "./DateFilter";
import WebsiteFilter from "./WebsiteFilter";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

interface DashboardContentProps {
  stats: {
    pageviews: number;
    uniques: number;
    bounceRate: number;
    avgSession: number;
  };
  chartData: { name: string; value: number }[];
  topQueries: { name: string; value: number }[];
  topReferrers: { name: string; value: number }[];
  topDevices: { name: string; value: number }[];
}

export default function DashboardContent({
  stats,
  chartData,
  topQueries,
  topReferrers,
  topDevices,
}: DashboardContentProps) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-10">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-9 w-40 rounded-lg bg-[var(--surface)]"></div>}>
              <WebsiteFilter />
            </Suspense>
            <Suspense fallback={<div className="h-9 w-40 rounded-lg bg-[var(--surface)]"></div>}>
              <DateFilter />
            </Suspense>
            <ThemeToggle />
            <LogoutButton />
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

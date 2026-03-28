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
    <main className="min-h-screen text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Analytics
              </h1>
              <p className="text-sm text-[var(--text-muted)]">Track your website performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-10 w-44 rounded-xl bg-[var(--surface)]"></div>}>
              <WebsiteFilter />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-40 rounded-xl bg-[var(--surface)]"></div>}>
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TopLists title="Top Pages" data={topQueries} />
          <TopLists title="Top Referrers" data={topReferrers} />
          <TopLists title="Top Devices" data={topDevices} />
        </section>

        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">Powered by Umami Analytics</p>
            <p className="text-xs text-[var(--text-muted)]">Dashboard UI v2.0</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

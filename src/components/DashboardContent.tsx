"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import KPICards from "./KPICards";
import UmamiChart from "./UmamiChart";
import TopLists from "./TopLists";
import DateFilter from "./DateFilter";
import WebsiteFilter from "./WebsiteFilter";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import SettingsModal from "./SettingsModal";
import SidePanel from "./SidePanel";
import Sidebar from "./Sidebar";
import { Bars3Icon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface DashboardContentProps {
  stats: {
    pageviews: number;
    uniques: number;
    bounceRate: number;
    avgSession: number;
  };
  chartData: { date: string; pageviews: number; uniques: number }[];
  topQueries: { name: string; value: number }[];
  topReferrers: { name: string; value: number }[];
  topDevices: { name: string; value: number }[];
  range: string;
  allWebsites?: boolean;
}

export default function DashboardContent({
  stats,
  chartData,
  topQueries,
  topReferrers,
  topDevices,
  range,
  allWebsites = false,
}: DashboardContentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-1 ml-[280px] min-h-screen text-[var(--text-primary)] transition-all">
        <div className="max-w-full mx-auto px-2 py-3 md:px-3 md:py-4">
          {allWebsites && (
            <div className="mb-4 px-3 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg">
              <p className="text-sm text-[var(--accent)] font-medium">
                Aggregated data from all websites
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 w-full">
          <Suspense fallback={
            <div className="h-11 md:h-10 w-full sm:w-40 rounded-xl bg-[var(--surface)] animate-pulse"></div>
          }>
            <DateFilter />
          </Suspense>
          </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <SidePanel 
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)} 
          title="Menu"
        >
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setIsSettingsOpen(true);
                setIsPanelOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-[var(--text-primary)] p-2 rounded-md hover:bg-[var(--surface-elevated)]"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </button>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
              <ThemeToggle />
              <div className="flex-1">
                <LogoutButton />
              </div>
            </div>
          </div>
        </SidePanel>
        
        <section className="mb-3">
          <KPICards stats={stats} />
        </section>

        <section className="mb-3">
          <UmamiChart data={chartData} range={range} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TopLists title="Top Pages" data={topQueries} />
          <TopLists title="Top Referrers" data={topReferrers} />
          <TopLists title="Top Devices" data={topDevices} />
        </section>

        <footer className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-[var(--text-muted)]">Powered by Umami Analytics</p>
            <p className="text-xs text-[var(--text-muted)]">Dashboard UI v2.0</p>
          </div>
        </footer>
      </div>
    </main>
    </div>
  );
}
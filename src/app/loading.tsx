'use client';

import { KPICardSkeleton, ChartSkeleton, TopListSkeleton } from '../components/Skeletons';

export default function Loading() {
  return (
    <div className="flex-1 ml-[280px] min-h-screen text-[var(--text-primary)]">
      <div className="max-w-full mx-auto px-2 py-3 md:px-3 md:py-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 w-full">
          <div className="h-11 md:h-10 w-24 sm:w-32 rounded-xl bg-[var(--surface)] animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          {[...Array(4)].map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>

        <div className="mb-3">
          <ChartSkeleton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <TopListSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-[var(--surface)] rounded-lg ${className}`}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="card flex flex-col justify-between min-h-[140px] p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-10 w-24 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-1 md:p-2 h-[300px] md:h-[400px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-1">
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}

export function TopListSkeleton() {
  return (
    <div className="card p-4">
      <Skeleton className="h-5 w-24 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}

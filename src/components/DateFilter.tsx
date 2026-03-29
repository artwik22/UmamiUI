'use client';
import { useRouter, useSearchParams } from "next/navigation";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "7d";

  const ranges = [
    { label: "Today", value: "1d" },
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "All Time", value: "all" },
  ];

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 p-1.5 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm h-11 md:h-10">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleValueChange(range.value)}
          className={`
            px-3 py-2 md:px-4 md:py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] md:min-h-0
            ${currentRange === range.value
              ? "bg-[var(--accent)] text-[var(--bg)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

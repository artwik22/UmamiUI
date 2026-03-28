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
  ];

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleValueChange(range.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150
            ${currentRange === range.value
              ? "bg-[var(--accent)] text-[var(--bg)]"
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

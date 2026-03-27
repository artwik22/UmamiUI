'use client';
import { useRouter, useSearchParams } from "next/navigation";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "7d";

  const ranges = [
    { label: "Today", value: "1d" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
  ];

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="inline-flex rounded-xl p-1 bg-m3-surface-variant">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleValueChange(range.value)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentRange === range.value
              ? "bg-m3-primary text-m3-on-primary shadow-sm"
              : "text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-m3-surface"
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

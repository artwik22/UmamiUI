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
    <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleValueChange(range.value)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            currentRange === range.value
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Website {
  id: string;
  name: string;
  domain: string;
}

export default function WebsiteFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWebsiteId = searchParams.get("website") || "";
  
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchWebsites() {
      try {
        const res = await fetch('/api/websites');
        const data = await res.json();
        setWebsites(data);
      } catch (error) {
        console.error('Failed to fetch websites:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWebsites();
  }, []);

  if (!mounted) {
    return <div className="h-11 md:h-10 w-44 rounded-xl bg-[var(--surface)]"></div>;
  }

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.set("all", "true");
      params.delete("website");
    } else if (value) {
      params.set("website", value);
      params.delete("all");
    } else {
      params.delete("website");
      params.delete("all");
    }
    router.push(`/?${params.toString()}`);
  };

  const isAllMode = searchParams.get("all") === "true";

  if (loading) {
    return <div className="h-11 md:h-10 w-44 rounded-xl bg-[var(--surface)] animate-pulse"></div>;
  }

  if (websites.length <= 1) {
    return null;
  }

  const defaultWebsiteId = websites[0]?.id || "";

  return (
    <select
      value={isAllMode ? "all" : (currentWebsiteId || defaultWebsiteId)}
      onChange={(e) => handleValueChange(e.target.value)}
      className="h-11 md:h-10 px-3 md:px-4 text-sm font-medium bg-[var(--surface)] text-[var(--text-primary)] rounded-xl border border-[var(--border)] cursor-pointer hover:bg-[var(--surface-elevated)] transition-all outline-none shadow-sm"
    >
      <option value="all">All Websites</option>
      {websites.map((website) => (
        <option key={website.id} value={website.id}>
          {website.name}
        </option>
      ))}
    </select>
  );
}

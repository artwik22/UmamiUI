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
    if (value) {
      params.set("website", value);
    } else {
      params.delete("website");
    }
    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return <div className="h-11 md:h-10 w-44 rounded-xl bg-[var(--surface)] animate-pulse"></div>;
  }

  if (websites.length <= 1) {
    return null;
  }

  const defaultWebsiteId = websites[0]?.id || "";

  return (
    <select
      value={currentWebsiteId || defaultWebsiteId}
      onChange={(e) => handleValueChange(e.target.value)}
      className="h-11 md:h-10 px-3 md:px-4 text-sm font-medium bg-[var(--surface)] text-[var(--text-primary)] rounded-xl border border-[var(--border)] cursor-pointer hover:bg-[var(--surface-elevated)] transition-all outline-none shadow-sm"
    >
      {websites.map((website) => (
        <option key={website.id} value={website.id}>
          {website.name}
        </option>
      ))}
    </select>
  );
}

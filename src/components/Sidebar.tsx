'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

interface Website {
  id: string;
  name: string;
  domain: string;
}

interface SidebarProps {
  onSettingsClick: () => void;
}

const navItems = [
  { name: 'Dashboard', icon: ChartBarIcon, href: '/' },
  { name: 'Pages', icon: DocumentChartBarIcon, href: '/pages' },
  { name: 'Websites', icon: GlobeAltIcon, href: '/websites' },
];

function SidebarContent({
  onSettingsClick,
  collapsed,
  setCollapsed,
  onClose,
}: SidebarProps & {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  const currentWebsiteId = searchParams.get("website") || "";

  useEffect(() => {
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

  const handleWebsiteChange = (websiteId: string) => {
    const params = new URLSearchParams(searchParams);
    if (websiteId) {
      params.set("website", websiteId);
    } else {
      params.delete("website");
    }
    router.push(`/?${params.toString()}`);
    onClose?.();
  };

  const defaultWebsiteId = websites[0]?.id || "";
  const selectedWebsiteId = currentWebsiteId || defaultWebsiteId;
  const selectedWebsite = websites.find(w => w.id === selectedWebsiteId);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-50 shadow-lg"
    >
      <div className="p-4 flex items-center justify-between border-b border-[var(--border)] h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0 shadow-md">
            <ChartBarIcon className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-[var(--text-primary)] leading-tight">Umami</span>
              <span className="text-xs text-[var(--text-muted)]">Analytics</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
          >
            <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
            Website
          </label>
          {loading ? (
            <div className="h-10 rounded-lg bg-[var(--surface-elevated)] animate-pulse" />
          ) : websites.length > 1 ? (
            <select
              value={selectedWebsiteId}
              onChange={(e) => handleWebsiteChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-lg border border-[var(--border)] cursor-pointer hover:bg-[var(--surface)] transition-all outline-none appearance-none"
            >
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.name}
                </option>
              ))}
            </select>
          ) : selectedWebsite ? (
            <div className="px-3 py-2.5 text-sm bg-[var(--surface-elevated)] rounded-lg border border-[var(--border)]">
              <span className="text-[var(--text-primary)] font-medium">{selectedWebsite.name}</span>
            </div>
          ) : null}
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className={`text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {!collapsed && 'Menu'}
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-2">
        <button
          onClick={() => {
            onSettingsClick();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all duration-200"
        >
          <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </button>

        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-3'}`}>
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
          {!collapsed && (
            <Link
              href="/logout"
              className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Logout</span>
            </Link>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

export default function Sidebar({ onSettingsClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <SidebarContent
          onSettingsClick={onSettingsClick}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <SidebarContent
            onSettingsClick={onSettingsClick}
            collapsed={false}
            setCollapsed={() => {}}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

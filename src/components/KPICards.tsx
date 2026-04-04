'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  stats: {
    pageviews: number;
    uniques: number;
    bounceRate: number;
    avgSession: number;
    trends?: {
      pageviews: number | null;
      uniques: number | null;
      bounceRate: number | null;
      avgSession: number | null;
    };
  };
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR').replace(/\s/g, ' ');
};

const icons = {
  pageviews: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  visitors: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  bounce: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  session: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const iconBg = {
  pageviews: 'bg-[var(--surface)]',
  visitors: 'bg-[var(--surface)]',
  bounce: 'bg-[var(--surface)]',
  session: 'bg-[var(--surface)]',
};

export default function KPICards({ stats }: Props) {
  if (!stats) return null;

  const safeStats = {
    pageviews: stats.pageviews ?? 0,
    uniques: stats.uniques ?? 0,
    bounceRate: stats.bounceRate ?? 0,
    avgSession: stats.avgSession ?? 0,
    trends: stats.trends ?? { pageviews: null, uniques: null, bounceRate: null, avgSession: null },
  };

  const cards = [
    { 
      key: 'pageviews',
      label: 'Pageviews', 
      value: formatNumber(safeStats.pageviews), 
      subtext: 'Total views',
      trend: safeStats.trends?.pageviews !== null ? `${safeStats.trends.pageviews > 0 ? '+' : ''}${safeStats.trends.pageviews}%` : null,
      trendUp: (safeStats.trends?.pageviews ?? 0) >= 0 
    },
    { 
      key: 'visitors',
      label: 'Visitors', 
      value: formatNumber(safeStats.uniques), 
      subtext: 'Unique users',
      trend: safeStats.trends?.uniques !== null ? `${safeStats.trends.uniques > 0 ? '+' : ''}${safeStats.trends.uniques}%` : null,
      trendUp: (safeStats.trends?.uniques ?? 0) >= 0
    },
    { 
      key: 'bounce',
      label: 'Bounce', 
      value: `${safeStats.bounceRate}%`, 
      subtext: 'Bounce rate',
      trend: safeStats.trends?.bounceRate !== null ? `${safeStats.trends.bounceRate > 0 ? '+' : ''}${safeStats.trends.bounceRate}%` : null,
      trendUp: (safeStats.trends?.bounceRate ?? 0) <= 0
    },
    { 
      key: 'session',
      label: 'Avg. Session', 
      value: `${safeStats.avgSession}s`, 
      subtext: 'Duration',
      trend: safeStats.trends?.avgSession !== null ? `${safeStats.trends.avgSession > 0 ? '+' : ''}${safeStats.trends.avgSession}%` : null,
      trendUp: (safeStats.trends?.avgSession ?? 0) >= 0
    },
  ];


  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          className="card flex flex-col justify-between min-h-[140px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {card.label}
            </p>
            <div className={`p-2 rounded-xl ${iconBg[card.key as keyof typeof iconBg]}`}>
              <span className="text-[var(--text-secondary)]">
                {icons[card.key as keyof typeof icons]}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              {card.value}
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">{card.subtext}</p>
              {card.trend && (
                <span className={`text-sm md:text-xs font-medium ${card.key === 'bounce' ? (card.trendUp ? 'text-[var(--danger)]' : 'text-[var(--success)]') : (card.trendUp ? 'text-[var(--success)]' : 'text-[var(--danger)]')}`}>
                  {card.trend}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

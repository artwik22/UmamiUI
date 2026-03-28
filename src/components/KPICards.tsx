'use client';

import { motion } from 'framer-motion';

interface Props {
  stats: {
    pageviews: number;
    uniques: number;
    bounceRate: number;
    avgSession: number;
  };
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
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
  const cards = [
    { 
      key: 'pageviews',
      label: 'Pageviews', 
      value: formatNumber(stats.pageviews), 
      subtext: 'Total views',
      trend: '+12%',
      trendUp: true 
    },
    { 
      key: 'visitors',
      label: 'Visitors', 
      value: formatNumber(stats.uniques), 
      subtext: 'Unique users',
      trend: '+8%',
      trendUp: true
    },
    { 
      key: 'bounce',
      label: 'Bounce', 
      value: `${stats.bounceRate}%`, 
      subtext: 'Bounce rate',
      trend: '-3%',
      trendUp: false
    },
    { 
      key: 'session',
      label: 'Avg. Session', 
      value: `${stats.avgSession}s`, 
      subtext: 'Duration',
      trend: '+5%',
      trendUp: true
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {card.label}
            </p>
            <div className={`p-2 rounded-xl ${iconBg[card.key as keyof typeof iconBg]}`}>
              <span className="text-[var(--text-secondary)]">
                {icons[card.key as keyof typeof icons]}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {card.value}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-[var(--text-muted)]">{card.subtext}</p>
              <span className="text-xs font-medium text-[var(--text-muted)]">
                {card.trend}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

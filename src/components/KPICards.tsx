'use client';

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

export default function KPICards({ stats }: Props) {
  const cards = [
    { label: 'Pageviews', value: formatNumber(stats.pageviews), subtext: 'Total views' },
    { label: 'Visitors', value: formatNumber(stats.uniques), subtext: 'Unique users' },
    { label: 'Bounce', value: `${stats.bounceRate}%`, subtext: 'Bounce rate' },
    { label: 'Avg. Session', value: `${stats.avgSession}s`, subtext: 'Duration' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card card-hover flex flex-col justify-between min-h-[120px]"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              {card.label}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
              {card.value}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

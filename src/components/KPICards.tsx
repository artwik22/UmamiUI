'use client';

interface Stat {
  title: string;
  metric: string | number;
}

interface Props {
  stats: {
    pageviews: number;
    uniques: number;
    bounceRate: number;
    avgSession: number;
  };
}

export default function KPICards({ stats }: Props) {
  const data: Stat[] = [
    { title: "Pageviews", metric: stats.pageviews },
    { title: "Uniques", metric: stats.uniques },
    { title: "Bounce Rate", metric: `${stats.bounceRate}%` },
    { title: "Avg Session", metric: `${stats.avgSession}s` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => (
        <div key={item.title} className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
          <p className="text-neutral-500 text-xs uppercase tracking-wider font-medium">{item.title}</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-100 tracking-tighter">{item.metric}</p>
        </div>
      ))}
    </div>
  );
}

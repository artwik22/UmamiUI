'use client';

interface Stat {
  title: string;
  metric: string | number;
  color: string;
  colorBg: string;
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
    { title: "PAGEVIEWS", metric: stats.pageviews, color: "var(--m3-on-surface)", colorBg: "bg-m3-primary" },
    { title: "UNIQUES", metric: stats.uniques, color: "var(--m3-on-surface)", colorBg: "bg-blue-600" },
    { title: "BOUNCE RATE", metric: `${stats.bounceRate}%`, color: "var(--m3-on-surface)", colorBg: "bg-orange-500" },
    { title: "AVG SESSION", metric: `${stats.avgSession}s`, color: "var(--m3-on-surface)", colorBg: "bg-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <div 
          key={item.title} 
          className="m3-elevated-card flex items-center gap-5"
        >
          <div className={`w-4 h-4 rounded-full ${item.colorBg}`} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-m3-on-surface-variant">{item.title}</p>
            <p className="text-4xl font-normal mt-1" style={{ color: item.color }}>{item.metric}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

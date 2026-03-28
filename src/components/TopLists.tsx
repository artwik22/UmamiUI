'use client';

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

const getDeviceIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('chrome')) return '🔵';
  if (lower.includes('firefox')) return '🦊';
  if (lower.includes('safari')) return '🧭';
  if (lower.includes('edge')) return '🔷';
  if (lower.includes('ios') || lower.includes('iphone') || lower.includes('ipad')) return '📱';
  if (lower.includes('android')) return '🤖';
  if (lower.includes('mac') || lower.includes('macos')) return '🍎';
  if (lower.includes('windows')) return '🪟';
  if (lower.includes('linux')) return '🐧';
  return '💻';
};

const colors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export default function TopLists({ title, data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const isTopDevices = title.toLowerCase().includes('device');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--accent-subtle)] px-2 py-1 rounded-lg">
          {data.length}
        </span>
      </div>
      <ul className="space-y-3 md:space-y-5">
        {data.slice(0, 5).map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = colors[index % colors.length];
          return (
            <li key={item.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-[var(--text-muted)] bg-[var(--surface)] rounded-md">
                    {index + 1}
                  </span>
                  {isTopDevices && (
                    <span className="text-sm">{getDeviceIcon(item.name)}</span>
                  )}
                  <span className="text-xs md:text-sm text-[var(--text-primary)] truncate font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums" style={{ color }}>
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ 
                    width: `${percentage}%`
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

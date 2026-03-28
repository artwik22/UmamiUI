'use client';

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

const getDeviceIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('chrome')) return '🟢';
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

export default function TopLists({ title, data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const isTopDevices = title.toLowerCase().includes('device');

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      <ul className="space-y-4">
        {data.slice(0, 5).map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <li key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {isTopDevices && (
                    <span className="text-sm">{getDeviceIcon(item.name)}</span>
                  )}
                  <span className="text-sm text-[var(--text-primary)] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)] tabular-nums">
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill bg-[var(--accent)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

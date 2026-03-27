'use client';

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

const getDeviceIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('chrome')) return 'chrome_reader_mode';
  if (lowerName.includes('firefox')) return 'firefox';
  if (lowerName.includes('safari')) return 'safari';
  if (lowerName.includes('edge')) return 'edge';
  if (lowerName.includes('ios') || lowerName.includes('iphone') || lowerName.includes('ipad')) return 'phone_iphone';
  if (lowerName.includes('android')) return 'android';
  if (lowerName.includes('mac') || lowerName.includes('macos')) return 'laptop_mac';
  if (lowerName.includes('windows')) return 'desktop_windows';
  if (lowerName.includes('linux')) return 'terminal';
  return 'language';
};

export default function TopLists({ title, data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value));

  const colors = [
    'bg-black dark:bg-white',
    'bg-blue-600',
    'bg-green-600',
    'bg-orange-500',
  ];

  const isTopDevices = title.toLowerCase().includes('device');

  return (
    <div className="m3-filled-card">
      <h3 className="text-sm font-medium uppercase tracking-wider text-m3-on-surface-variant pb-3 mb-4">{title}</h3>
      <ul className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <li key={item.name} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  {isTopDevices && (
                    <span className="material-symbols-outlined text-lg text-m3-on-surface-variant flex-shrink-0">
                      {getDeviceIcon(item.name)}
                    </span>
                  )}
                  <span className="truncate pr-2 font-normal text-m3-on-surface">{item.name}</span>
                </div>
                <span className="font-medium tabular-nums text-m3-on-surface">{item.value}</span>
              </div>
              <div className="h-2 bg-m3-surface-variant rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors[index % colors.length]}`}
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

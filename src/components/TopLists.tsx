'use client';

import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  DevicePhoneMobileIcon, 
  CpuChipIcon, 
  ComputerDesktopIcon,
  ServerIcon 
} from '@heroicons/react/24/outline';

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

const getDeviceIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('chrome')) return <GlobeAltIcon className="w-4 h-4 text-orange-500" />;
  if (lower.includes('firefox')) return <GlobeAltIcon className="w-4 h-4 text-orange-600" />;
  if (lower.includes('safari')) return <GlobeAltIcon className="w-4 h-4 text-blue-500" />;
  if (lower.includes('edge')) return <GlobeAltIcon className="w-4 h-4 text-blue-600" />;
  if (lower.includes('ios') || lower.includes('iphone') || lower.includes('ipad')) return <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />;
  if (lower.includes('android')) return <CpuChipIcon className="w-4 h-4 text-green-500" />;
  if (lower.includes('mac') || lower.includes('macos')) return <ComputerDesktopIcon className="w-4 h-4 text-gray-400" />;
  if (lower.includes('windows')) return <ComputerDesktopIcon className="w-4 h-4 text-blue-400" />;
  if (lower.includes('linux')) return <ServerIcon className="w-4 h-4 text-yellow-500" />;
  return <GlobeAltIcon className="w-4 h-4 text-gray-400" />;
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
      <ul className="space-y-4 md:space-y-5">
        {data.slice(0, 5).map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = colors[index % colors.length];
          return (
            <motion.li
              key={item.name}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-[var(--text-muted)] bg-[var(--surface)] rounded-md">
                    {index + 1}
                  </span>
                  {isTopDevices && (
                    <span className="text-sm">{getDeviceIcon(item.name)}</span>
                  )}
                  <span className="text-sm md:text-sm text-[var(--text-primary)] truncate font-medium">
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
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, var(--chart-3))`
                  }}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
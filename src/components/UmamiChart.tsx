'use client';

import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
  range: string;
}

function formatDate(dateStr: string | number, range: string, timeFormat: '12h' | '24h'): string {
  const date = new Date(dateStr);
  if (range === '1d') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: timeFormat === '12h' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label, range, timeFormat }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-2 md:p-3 rounded-lg shadow-lg">
        <p className="text-[var(--text-secondary)] text-xs md:text-sm mb-2">{formatDate(label, range, timeFormat)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs md:text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function UmamiChart({ data, range }: Props) {
  console.log('UmamiChart data:', data);
  const [selectedMetric, setSelectedMetric] = useState<'pageviews' | 'uniques'>('pageviews');
  const { timeFormat } = useSettings();
  
  const metricConfig = {
    pageviews: {
      key: 'pageviews',
      color: 'var(--chart-1)',
      gradient: 'gradientPageviews',
      name: 'Pageviews'
    },
    uniques: {
      key: 'uniques',
      color: 'var(--chart-2)',
      gradient: 'gradientUniques',
      name: 'Unique Visitors'
    }
  };

  const config = metricConfig[selectedMetric];

  return (
    <div className="card p-1 md:p-2 h-[400px] md:h-[500px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-1">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Traffic Overview</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {config.name}
          </p>
        </div>
        <div className="flex items-center bg-[var(--surface-elevated)] rounded-lg p-1">
          <button
            onClick={() => setSelectedMetric('pageviews')}
            className={`px-3 py-1 text-xs md:text-sm rounded-md transition-colors ${
              selectedMetric === 'pageviews'
                ? 'bg-[var(--chart-1)] text-[var(--bg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Pageviews
          </button>
          <button
            onClick={() => setSelectedMetric('uniques')}
            className={`px-3 py-1 text-xs md:text-sm rounded-md transition-colors ${
              selectedMetric === 'uniques'
                ? 'bg-[var(--chart-2)] text-[var(--bg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Visitors
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradientUniques" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)"
              tickFormatter={(val) => formatDate(val, range, timeFormat)}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tickFormatter={(n) => n.toLocaleString()}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip range={range} timeFormat={timeFormat} />} />
            
            <Area
              type="monotone"
              dataKey={config.key}
              fill={`url(#${config.gradient})`}
              stroke="none"
              strokeWidth={0}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              dot={{ fill: config.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--surface-elevated)", strokeWidth: 2 }}
              name={config.name}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

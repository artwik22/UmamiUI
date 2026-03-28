'use client';

import {
  LineChart,
  Line,
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

function formatDate(dateStr: string | number, range: string): string {
  const date = new Date(dateStr);
  if (range === '1d') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label, range }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
        <p className="text-[var(--text-secondary)] text-sm mb-2">{formatDate(label, range)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function UmamiChart({ data, range }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Traffic Overview</h3>
          <p className="text-sm text-[var(--text-secondary)]">Pageviews and unique visitors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--chart-1)]"></span>
            <span className="text-sm text-[var(--text-muted)]">Pageviews</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--chart-2)]"></span>
            <span className="text-sm text-[var(--text-muted)]">Visitors</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)"
              tickFormatter={(val) => formatDate(val, range)}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tickFormatter={(n) => n.toLocaleString()}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip range={range} />} />
            <Line
              type="monotone"
              dataKey="pageviews"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ fill: "var(--chart-1)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--surface-elevated)", strokeWidth: 2 }}
              name="Pageviews"
            />
            <Line
              type="monotone"
              dataKey="uniques"
              stroke="var(--chart-2)"
              strokeWidth={3}
              dot={{ fill: "var(--chart-2)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--surface-elevated)", strokeWidth: 2 }}
              name="Unique Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
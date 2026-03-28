'use client';

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
      <div className="bg-[var(--surface)] border border-[var(--border)] p-2 md:p-3 rounded-lg shadow-lg">
        <p className="text-[var(--text-secondary)] text-xs md:text-sm mb-2">{formatDate(label, range)}</p>
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
  return (
    <div className="card p-1 md:p-2 h-[400px] md:h-[500px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-1">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Traffic Overview</h3>
          <p className="text-sm text-[var(--text-secondary)]">Pageviews and unique visitors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--chart-1)]"></span>
            <span className="text-xs md:text-sm text-[var(--text-muted)]">Pageviews</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--chart-2)]"></span>
            <span className="text-xs md:text-sm text-[var(--text-muted)]">Visitors</span>
          </div>
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
              tickFormatter={(val) => formatDate(val, range)}
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
            />
            <Tooltip content={<CustomTooltip range={range} />} />
            <Area
              type="monotone"
              dataKey="pageviews"
              fill="url(#gradientPageviews)"
              stroke="none"
              strokeWidth={0}
            />
            <Line
              type="monotone"
              dataKey="pageviews"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ fill: "var(--chart-1)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--surface-elevated)", strokeWidth: 2 }}
              name="Pageviews"
            />
            <Area
              type="monotone"
              dataKey="uniques"
              fill="url(#gradientUniques)"
              stroke="none"
              strokeWidth={0}
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
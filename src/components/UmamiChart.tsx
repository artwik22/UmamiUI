'use client';

import { Card } from "@tremor/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
}

function formatDate(dateStr: string | number): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg shadow-lg">
        <p className="text-[var(--text-secondary)] text-sm mb-2">{formatDate(label)}</p>
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

export default function UmamiChart({ data }: Props) {
  return (
    <Card className="card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Traffic Overview</h3>
        <p className="text-sm text-[var(--text-secondary)]">Pageviews and unique visitors</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-secondary)"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              tickFormatter={(n) => n.toLocaleString()}
              tick={{ fontSize: 12 }}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="pageviews"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Pageviews"
            />
            <Line
              type="monotone"
              dataKey="uniques"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Unique Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

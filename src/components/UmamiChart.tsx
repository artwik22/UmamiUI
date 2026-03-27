'use client';

import { Card, Title, LineChart } from "@tremor/react";

interface Props {
  data: any[];
}

export default function UmamiChart({ data }: Props) {
  const valueFormatter = (number: number) => `${number}`;

  return (
    <div className="m3-filled-card">
      <h3 className="text-sm font-medium uppercase tracking-wider text-m3-on-surface-variant pb-3 mb-2">Pageviews over time</h3>
      <LineChart
        className="h-80"
        data={data}
        index="date"
        categories={["pageviews", "uniques"]}
        colors={["indigo", "rose"]}
        valueFormatter={valueFormatter}
        showLegend={true}
        showGridLines={true}
        showAnimation={true}
        yAxisWidth={40}
        curveType="linear"
      />
    </div>
  );
}

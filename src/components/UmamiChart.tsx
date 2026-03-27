'use client';

import { Card, Title, LineChart } from "@tremor/react";

interface Props {
  data: any[];
}

export default function UmamiChart({ data }: Props) {
  const valueFormatter = (number: number) => `${number}`;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-neutral-200 text-sm font-semibold mb-6">Pageviews over time</h3>
      <LineChart
        className="h-80"
        data={data}
        index="date"
        categories={["pageviews", "uniques"]}
        colors={["blue-500", "emerald-500"]}
        valueFormatter={valueFormatter}
        showLegend={true}
        showGridLines={true}
        showAnimation={true}
        yAxisWidth={40}
      />
    </div>
  );
}

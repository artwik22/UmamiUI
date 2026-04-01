'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSettings } from '../context/SettingsContext';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  data: any[];
  range: string;
}

function formatDate(dateStr: string | number, range: string, timeFormat: '12h' | '24h'): string {
  const date = new Date(dateStr);
  if (range === '1d') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: timeFormat === '12h' });
  }
  if (range === 'all') {
    return date.toLocaleDateString('en-US', { year: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function UmamiChartApex({ data, range }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<'pageviews' | 'uniques'>('pageviews');
  const { timeFormat } = useSettings();

  const chartData = useMemo(() => {
    return {
      categories: data.map((d) => formatDate(d.date, range, timeFormat)),
      series: [
        {
          name: selectedMetric === 'pageviews' ? 'Pageviews' : 'Unique Visitors',
          data: data.map((d) => (selectedMetric === 'pageviews' ? d.pageviews : d.uniques)),
        },
      ],
    };
  }, [data, range, selectedMetric, timeFormat]);

  const options: any = {
    chart: {
      type: 'area',
      height: '100%',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      },
    },
    colors: [selectedMetric === 'pageviews' ? 'var(--chart-1)' : 'var(--chart-2)'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: { colors: 'var(--text-muted)', fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--text-muted)', fontSize: '11px' },
        formatter: (val: number) => val.toLocaleString('fr-FR').replace(/\s/g, ' ')
      },
    },
    grid: {
      borderColor: 'var(--border)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    tooltip: {
      theme: 'dark',
      x: { show: true },
      y: { formatter: (val: number) => val.toLocaleString('fr-FR').replace(/\s/g, ' ') }
    },
  };

  return (
    <div className="card p-1 md:p-2 h-[300px] md:h-[400px] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-1">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Traffic Overview</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {selectedMetric === 'pageviews' ? 'Pageviews' : 'Unique Visitors'}
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
        <Chart options={options} series={chartData.series} type="area" height="100%" width="100%" />
      </div>
    </div>
  );
}

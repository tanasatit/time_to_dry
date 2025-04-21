import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface DryingChartProps {
  data: any[];
  series: SeriesConfig[];
  title: string;
  yLabel: string;
}

export default function DryingChart({ data, series, title, yLabel }: DryingChartProps) {
  const categories = data.map((d) => new Date(d.timestamp).getTime());

  const chartSeries = series.map(s => ({
    name: s.name,
    data: data.map((d) => d[s.key]),
  }));

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: { enabled: true },
    },
    stroke: { curve: 'smooth', width: 1.5 },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      categories,
      labels: {
        rotate: -45,
        datetimeFormatter: {
          hour: 'HH:mm',
          minute: 'HH:mm',
        },
      },
      tickAmount: Math.min(Math.floor(categories.length / 10), 12),
    },
    yaxis: { title: { text: yLabel } },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
    tooltip: {
      x: { format: 'HH:mm' },
    },
    colors: series.map(s => s.color),
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Chart options={chartOptions} series={chartSeries} type="area" width="100%" height="350" />
    </div>
  );
}

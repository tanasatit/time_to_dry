import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HumidityChartProps {
  data: any[];
}

export default function HumidityChart({ data }: HumidityChartProps) {
  const categories = data.map((d) => new Date(d.timestamp).getTime());
  const humInSeries = data.map((d) => d.hum_in);
  const humOutSeries = data.map((d) => d.hum_out);

  const chartOptions: ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: true } },
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
    yaxis: { title: { text: 'Humidity (%)' } },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
    tooltip: {
      x: {
        format: 'HH:mm',
      },
    },
  };

  const series = [
    { name: 'Humidity In', data: humInSeries },
    { name: 'Humidity Out', data: humOutSeries },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Humidity In vs Out</h2>
      <Chart options={chartOptions} series={series} type="area" width="100%" height="350" />
    </div>
  );
}

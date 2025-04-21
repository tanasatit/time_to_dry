import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TemperatureChartProps {
  data: any[];
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  const categories = data.map((d) => new Date(d.timestamp).getTime());
  const tempInSeries = data.map((d) => d.temp_in);
  const tempOutSeries = data.map((d) => d.temp_out);

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
      zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true,
    },
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
    yaxis: { title: { text: 'Temperature (°C)' } },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 3 },
    tooltip: {
      x: { format: 'HH:mm' },
    },
    colors: ['#FF0000', '#FFD700'],
  };

  const series = [
    { name: 'Temperature In', data: tempInSeries },
    { name: 'Temperature Out', data: tempOutSeries },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Temperature In vs Out</h2>
      <Chart options={chartOptions} series={series} type="area" width="100%" height="350" />
    </div>
  );
}

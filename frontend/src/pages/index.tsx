import Head from 'next/head';
import useSWR from 'swr';
import HumidityChart from '../components/charts/HumidityChart';
import TemperatureChart from '../components/charts/TemperatureChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: tmd, error: tmdError, isLoading: tmdLoading } = useSWR('http://localhost:8080/api/tmd', fetcher);
  const { data: statusData, error: statusError, isLoading: statusLoading } = useSWR(
    'http://localhost:8080/api/test/status',
    fetcher
  );
  const { data: dryingData, error: dryingError, isLoading: dryingLoading } = useSWR(
    'http://localhost:8080/api/test/latest/all',
    fetcher
  );

  if (tmdLoading || statusLoading || dryingLoading) return <p className="text-center">Loading...</p>;
  if (tmdError || statusError || dryingError) return <p className="text-center text-red-500">Failed to fetch data</p>;

  const latestTMD = tmd?.[tmd.length - 1];

  const weatherData = {
    temperature: latestTMD?.temperature ?? '--',
    humidity: latestTMD?.humidity ?? '--',
    rainfall: latestTMD?.rainfall ?? '--',
    rating: latestTMD ? getRating(latestTMD.temperature, latestTMD.humidity, latestTMD.rainfall) : 0,
  };

  return (
    <>
      <Head>
        <title>Time to Dry - Home</title>
        <meta name="description" content="Smart cloth drying assistant" />
      </Head>

      <div className="flex flex-col gap-8 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Time to Dry</h1>
            <p className="text-gray-500">Your smart cloth drying assistant</p>
          </div>
          <span
            className={`px-4 py-1 rounded-full font-medium text-sm ${
              statusData?.is_working ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {statusData?.is_working ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>

        {/* Weather Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Weather</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card icon="🌡️" label="Temperature" value={`${weatherData.temperature}°C`} />
            <Card icon="💧" label="Humidity" value={`${weatherData.humidity}%`} />
            <Card icon="☔" label="Rainfall" value={`${weatherData.rainfall} mm`} />
            <Card icon="👕" label="Drying Rating" value={`⭐`.repeat(weatherData.rating)} />
          </div>
        </div>

        {/* Humidity Chart */}
        <div>
        <HumidityChart data={dryingData} />
        </div>

        {/* Temperature Chart */}
        <div>
        <TemperatureChart data={dryingData} />
        </div>
      </div>
    </>
  );
}

function Card({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-gray-600 font-medium">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function getRating(temp: number, hum: number, rain: number): number {
  if (rain > 0) return 1;
  if (temp > 35 && hum < 40) return 5;
  if (temp > 30 && hum < 50) return 4;
  if (temp > 25 && hum < 60) return 3;
  return 2;
}

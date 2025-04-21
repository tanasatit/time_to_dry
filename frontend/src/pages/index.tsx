import Head from 'next/head';
import useSWR from 'swr';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import DryingChart from '@/components/charts/DryingChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: tmd, error: tmdError, isLoading: tmdLoading } = useSWR('http://localhost:8080/api/tmd', fetcher);

  if (tmdLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DotLottieReact
          src="https://lottie.host/8d2f602b-892f-4649-b0a9-0e8f55325b9a/o5I77hUzRP.lottie"
          loop
          autoplay
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  if (tmdError) {
    return <p className="text-center text-red-500">Failed to fetch TMD data</p>;
  }

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
        {/* Weather Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Weather Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card icon="bi bi-thermometer-sun" label="Temperature" value={`${weatherData.temperature}°C`} />
            <Card icon="bi bi-droplet-half" label="Humidity" value={`${weatherData.humidity}%`} />
            <Card icon="bi bi-cloud-rain" label="Rainfall" value={`${weatherData.rainfall} mm`} />
            <Card
              icon="bi bi-clipboard-check"
              label="Drying Rating"
              value={Array.from({ length: weatherData.rating }).map((_, i) => (
                <i key={i} className="bi bi-star-fill text-yellow-500 mr-1"></i>
              ))}
            />
          </div>
        </div>

        {/* Weather Charts */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Weather Last 24 Hours</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <DryingChart
              data={tmd}
              title="Humidity"
              yLabel="Humidity (%)"
              series={[
                { key: 'humidity', name: 'Humidity', color: '#1F45FC' }
              ]}
            />
            <DryingChart
              data={tmd}
              title="Temperature"
              yLabel="Temperature (°C)"
              series={[
                { key: 'temperature', name: 'Temperature', color: '#FF0000' }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Card({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-2">
        <i className={icon}></i>
      </div>
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

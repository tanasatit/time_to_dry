import React, { useEffect, useState } from 'react';
import { FaSun, FaThermometerHalf, FaTint } from 'react-icons/fa';
import { ClothingModel } from '@/components/statistics/ClothingModel';
import { MetricCircle } from '@/components/statistics/MetricCircle';
import { ProgressBar } from '@/components/statistics/ProgressBar';
import useSWR from 'swr';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import DryingChart from '@/components/charts/DryingChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: allTests } = useSWR<any[]>('http://localhost:8080/api/timetodry', fetcher);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const { data: deviceStatusByTest } = useSWR<{ status: string; test_id: number; last_timestamp: string }>(
    selectedTest !== null ? `http://localhost:8080/api/ttd/status/check?test_id=${selectedTest}` : null,
    fetcher,
    { refreshInterval: 10000 }
  );

  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [selectedTestData, setSelectedTestData] = useState<any[]>([]);

  useEffect(() => {
    if (allTests && allTests.length > 0) {
      const groupedByTestId: { [key: number]: any[] } = {};
      allTests.forEach((entry) => {
        if (!groupedByTestId[entry.test_id]) {
          groupedByTestId[entry.test_id] = [];
        }
        groupedByTestId[entry.test_id].push(entry);
      });

      const testIds = Object.keys(groupedByTestId).map(Number);
      const initialTestId = testIds[0];
      setSelectedTest(initialTestId);
    }
  }, [allTests]);

  useEffect(() => {
    if (allTests && selectedTest !== null) {
      const filtered = allTests.filter((entry) => entry.test_id === selectedTest);
      setSelectedTestData(filtered);

      const first = new Date(filtered[0].timestamp);
      const last = new Date(filtered[filtered.length - 1].timestamp);
      const diff = last.getTime() - first.getTime();
      const minutes = Math.round(diff / (1000 * 60));
      setDurationMinutes(minutes);
      setData(filtered[filtered.length - 1]);

      const query = new URLSearchParams({
        temp_in: filtered[filtered.length - 1].temp_in,
        temp_out: filtered[filtered.length - 1].temp_out,
        hum_in: filtered[filtered.length - 1].hum_in,
        hum_out: filtered[filtered.length - 1].hum_out,
        light: filtered[filtered.length - 1].light
      }).toString();

      fetch(`http://localhost:8080/api/drytime/estimate?${query}`)
        .then((res) => res.json())
        .then((res) => setEstimatedMinutes(res.estimated_drying_time_minutes))
        .catch((err) => console.error('Failed to fetch estimated drying time:', err));
    }
  }, [allTests, selectedTest]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen">
      <DotLottieReact
        src="/animations/loading.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );

  const percentComplete = estimatedMinutes
    ? Math.min(100, Math.round((durationMinutes / estimatedMinutes) * 100))
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Drying Statistics</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-8">
            <MetricCircle icon={<FaSun className="text-yellow-400" />} value={data.light} label="Light" unit="" bgColor="bg-yellow-100" />
            <MetricCircle icon={<FaThermometerHalf className="text-red-500" />} value={data.temp_out} label="Temp Outside" unit="°C" bgColor="bg-red-100" />
            <MetricCircle icon={<FaTint className="text-blue-500" />} value={data.hum_out} label="Hum Outside" unit="%" bgColor="bg-blue-100" />
          </div>
          <div className="flex flex-col items-center">
            <ClothingModel humidityLevel={data.hum_in} />
            <div className="w-full mt-6">
              <p className="text-center mb-2">Drying Progress</p>
              <ProgressBar percentage={percentComplete} />
              <p className="text-center mt-2 text-lg font-semibold">{percentComplete}% Complete</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3" value={selectedTest ?? ''} onChange={(e) => setSelectedTest(Number(e.target.value))}>
              {allTests && [...new Set(allTests.map(test => test.test_id))].map((id) => (
                <option key={id} value={id}>{`TEST-${id}`}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Test ID</h3>
              <p className="text-xl font-semibold">TEST-{data.test_id}</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Status</h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deviceStatusByTest?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {deviceStatusByTest?.status === 'in_progress' ? 'In Process' : 'Completed'}
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Duration</h3>
              <p className="text-xl font-semibold">{Math.floor(durationMinutes / 60)} hour {durationMinutes % 60} minute</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Last Update</h3>
              <p className="text-xl font-semibold">{new Date(data.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Temp Inside</h3>
              <p className="text-xl font-semibold">{data.temp_in}°C</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Hum Inside</h3>
              <p className="text-xl font-semibold">{data.hum_in}%</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Temp Difference</h3>
              <p className="text-xl font-semibold">{data.diff_temp > 0 ? '+' : ''}{data.diff_temp}°C</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Humidity Difference</h3>
              <p className="text-xl font-semibold">{data.diff_hum > 0 ? '+' : ''}{data.diff_hum}%</p>
            </div>
            <div className="border rounded-md p-4 col-span-2">
              <h3 className="text-sm text-gray-500">Estimated time finished</h3>
              <p className="text-xl font-semibold">
                {estimatedMinutes !== null ? `${Math.floor(estimatedMinutes / 60)} hour ${estimatedMinutes % 60} minute` : 'Estimating...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <DryingChart
          data={selectedTestData}
          title="Humidity In vs Out"
          yLabel="Humidity (%)"
          series={[
            { key: 'hum_in', name: 'Humidity In', color: '#1F45FC' },
            { key: 'hum_out', name: 'Humidity Out', color: '#1FD655' }
          ]}
        />
        <DryingChart
          data={selectedTestData}
          title="Temperature In vs Out"
          yLabel="Temperature (°C)"
          series={[
            { key: 'temp_in', name: 'Temperature In', color: '#FF0000' },
            { key: 'temp_out', name: 'Temperature Out', color: '#FFD700' }
          ]}
        />
      </div>
    </div>
  );
}

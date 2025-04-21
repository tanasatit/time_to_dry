import React, { useEffect, useState } from 'react';
import { FaSun, FaThermometerHalf, FaTint } from 'react-icons/fa';
import { ClothingModel } from '@/components/statistics/ClothingModel';
import { MetricCircle } from '@/components/statistics/MetricCircle';
import { ProgressBar } from '@/components/statistics/ProgressBar';
import useSWR from 'swr';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import HumidityChart from '@/components/charts/TTDHumidityChart';
import TemperatureChart from '@/components/charts/TTDTemperatureChart';
import DryingChart from '@/components/charts/DryingChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: allTests } = useSWR<any[]>('http://localhost:8080/api/timetodry', fetcher);

  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [duration, setDuration] = useState<string>('');
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
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setDuration(`${hours} hour ${minutes} minute`);
      setData(filtered[filtered.length - 1]); // Latest
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

  const completionPercentage = 100 - Math.min(100, Math.max(0, data.hum_in));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Drying Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          {/* Top Circles */}
          <div className="flex justify-between mb-8">
            <MetricCircle
              icon={<FaSun className="text-yellow-400" />}
              value={data.light}
              label="Light"
              unit=""
              bgColor="bg-yellow-100"
            />
            <MetricCircle
              icon={<FaThermometerHalf className="text-red-500" />}
              value={data.temp_out}
              label="Temp Outside"
              unit="°C"
              bgColor="bg-red-100"
            />
            <MetricCircle
              icon={<FaTint className="text-blue-500" />}
              value={data.hum_out}
              label="Hum Outside"
              unit="%"
              bgColor="bg-blue-100"
            />
          </div>

          {/* Shirt Model */}
          <div className="flex flex-col items-center">
            <ClothingModel humidityLevel={data.hum_in} />
            <div className="w-full mt-6">
              <p className="text-center mb-2">Drying Progress</p>
              <ProgressBar percentage={completionPercentage} />
              <p className="text-center mt-2 text-lg font-semibold">
                {completionPercentage.toFixed(1)}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Test</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={selectedTest ?? ''}
              onChange={(e) => setSelectedTest(Number(e.target.value))}
            >
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
              <h3 className="text-sm text-gray-500">Duration</h3>
              <p className="text-xl font-semibold">{duration}</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Status</h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.status === 'in_process' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {data.status === 'in_process' ? 'In Process' : 'Complete'}
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Last Update</h3>
              <p className="text-xl font-semibold">
                {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Temp Inside</h3>
              <p className="text-xl font-semibold">
                {data.temp_in}°C
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Hum Inside</h3>
              <p className="text-xl font-semibold">
                {data.hum_in}%
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Temp Difference</h3>
              <p className="text-xl font-semibold">
                {data.diff_temp > 0 ? '+' : ''}{data.diff_temp}°C
              </p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="text-sm text-gray-500">Humidity Difference</h3>
              <p className="text-xl font-semibold">
                {data.diff_hum > 0 ? '+' : ''}{data.diff_hum}%
              </p>
            </div>
            <div className="border rounded-md p-4 col-span-2">
              <h3 className="text-sm text-gray-500">Estimated time finished</h3>
              <p className="text-xl font-semibold">
                100 hour 100 minute 100 second
              </p>
            </div>
          </div>


        </div>
      </div>
      {/* Charts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <HumidityChart data={selectedTestData} />
            <TemperatureChart data={selectedTestData} />
          </div> */}
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
          { key: 'temp_in', name: 'Temperature In', color: '#FF0000'},
          { key: 'temp_out', name: 'Temperature Out', color: '#FFD700' }
        ]}
      />
      </div>
    </div>
  );
}

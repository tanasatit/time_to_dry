// src/pages/dryingTable.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { generatePagination } from '@/lib/generatePagination';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface DryingTest {
  id: number;
  timestamp: string;
  lat: number;
  lon: number;
  light: number;
  temp_in: number;
  temp_out: number;
  hum_in: number;
  hum_out: number;
  diff_temp: number;
  diff_hum: number;
  test_id: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DryingTable() {
  const router = useRouter();
  const { query } = router;
  const { data: allTests, error, isLoading } = useSWR<DryingTest[]>(
    'http://localhost:8080/api/timetodry',
    fetcher,
    { refreshInterval: 60000 }
  );

  const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);
  const [selectedTestId, setSelectedTestId] = useState<number | 'all'>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    if (query.page) {
      setCurrentPage(Number(query.page));
    }
  }, [query.page]);

  const handlePageChange = (page: number) => {
    router.push({ pathname: '/dryingTable', query: { ...query, page } });
  };

  const filteredData = allTests?.filter(test => selectedTestId === 'all' || test.test_id === selectedTestId) || [];

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = itemsPerPage === -1 ? filteredData : filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pageNumbers = generatePagination(currentPage, totalPages);

  return (
    <>
      <Head>
        <title>Time to Dry - Drying Table</title>
      </Head>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Drying Time Data</h1>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
          <DotLottieReact
            src="/animations/loading.lottie"
            loop
            autoplay
            style={{ width: 300, height: 300 }}
          />
        </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading data. Please check your API connection.
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-x-2">
                <label className="text-sm text-gray-600 font-medium">Filter by Test ID:</label>
                <select
                  value={selectedTestId}
                  onChange={(e) => {
                    setSelectedTestId(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border px-2 py-1 rounded-md"
                >
                  <option value="all">All</option>
                  {[...new Set((allTests ?? []).map(test => test.test_id))].map(id => (
                    <option key={id} value={id}>Test-{id}</option>
                  ))}
                </select>
              </div>

              <div className="space-x-2">
                <label className="text-sm text-gray-600 font-medium">Rows per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    const value = e.target.value === 'all' ? -1 : Number(e.target.value);
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                  className="border px-2 py-1 rounded-md"
                >
                  {[10, 25, 50, 100].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Light</th>
                    <th className="px-4 py-2">Temp (In)</th>
                    <th className="px-4 py-2">Temp (Out)</th>
                    <th className="px-4 py-2">Hum (In)</th>
                    <th className="px-4 py-2">Hum (Out)</th>
                    <th className="px-4 py-2">Temp Diff</th>
                    <th className="px-4 py-2">Hum Diff</th>
                    <th className="px-4 py-2">Test ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{test.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{new Date(test.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.light}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.temp_in}°C</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.temp_out}°C</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.hum_in}%</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.hum_out}%</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.diff_temp}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{test.diff_hum}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">Test-{test.test_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                {pageNumbers.map((page, i) =>
                  page === '...' ? (
                    <span key={i} className="px-3 py-1 text-gray-500">...</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

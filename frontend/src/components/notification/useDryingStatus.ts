// src/components/notification/useDryingStatus.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDryingStatus() {
  const { data: generalStatus } = useSWR('http://localhost:8080/api/ttd/status', fetcher);
  const { data: testStatus } = useSWR(
    'http://localhost:8080/api/ttd/status/check?test_id=0',
    fetcher,
    { refreshInterval: 10000 }
  );

  return {
    isWorking: generalStatus?.is_working,
    testStatus: testStatus?.status,
    lastUpdated: testStatus?.last_timestamp,
  };
}

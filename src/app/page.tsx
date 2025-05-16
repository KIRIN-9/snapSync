'use client';

import { useEffect } from 'react';
import { useGetAutoUploadLatestQuery } from './store/api';
import ResultDisplay from './components/ResultDisplay';
import { initializeSettings } from './utils/settings';

export default function Home() {
  const { data: latestResult, isLoading, isError } = useGetAutoUploadLatestQuery(undefined, {
    pollingInterval: 2000
  });

  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-[#181926]">
      <div className="max-w-3xl mx-auto">
        {isError ? (
          <div className="bg-red-900 p-3 rounded-md text-red-200 border border-red-800">
            Error connecting to server
          </div>
        ) : latestResult && 'result' in latestResult ? (
          <div className="bg-[#24273a] rounded-lg shadow-md overflow-hidden border border-[#363a4f]">
            <ResultDisplay result={latestResult} />
          </div>
        ) : (
          <div className="text-center py-4 bg-[#24273a] rounded-lg shadow-md p-6 border border-[#363a4f]">
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <p className="text-gray-400">Waiting for images...</p>
          </div>
        )}
      </div>
    </div>
  );
}

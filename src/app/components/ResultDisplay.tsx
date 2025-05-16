'use client';

import { useEffect, useState } from 'react';
import { useGetAutoUploadLatestQuery } from '../store/api';
import { ProcessImageResponse } from '../store/api';

interface ResultDisplayProps {
  manualResult?: ProcessImageResponse | null;
}

export default function ResultDisplay({ manualResult }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');

  const { data: autoResult, isLoading, isError } = useGetAutoUploadLatestQuery(
    undefined,
    {
      pollingInterval: 5000,
      skip: activeTab !== 'auto'
    }
  );
  useEffect(() => {
    if (manualResult) {
      setActiveTab('manual');
    }
  }, [manualResult]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'manual'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('manual')}
        >
          Manual Upload
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'auto'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('auto')}
        >
          Auto Upload
        </button>
      </div>

      {activeTab === 'manual' ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Manual Upload Result</h2>
          {manualResult ? (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Processed at: {formatTimestamp(manualResult.timestamp)}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap">
                {manualResult.result}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No results yet. Upload an image to get started.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Auto Upload Result</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading latest result...</p>
          ) : isError ? (
            <div>
              <p className="text-red-500">Error loading auto-uploaded results</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : autoResult && 'result' in autoResult ? (
            <div>
              <p className="text-sm text-gray-500 mb-1">
                File: {autoResult.filename}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Processed at: {formatTimestamp(autoResult.timestamp)}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap">
                {autoResult.result}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No auto-uploaded results yet. Use the Python script to upload images automatically.</p>
          )}
        </div>
      )}
    </div>
  );
}

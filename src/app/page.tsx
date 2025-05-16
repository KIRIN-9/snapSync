'use client';

import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { ProcessImageResponse } from './store/api';

export default function Home() {
  const [manualResult, setManualResult] = useState<ProcessImageResponse | null>(null);

  const handleUploadSuccess = (result: ProcessImageResponse) => {
    setManualResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SnapSync - Image Q&A App
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload an image and get detailed analysis using Gemini AI
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ImageUploader onUploadSuccess={handleUploadSuccess} />
          <ResultDisplay manualResult={manualResult} />
        </div>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Next.js, RTK Query, and Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
}

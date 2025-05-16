'use client';

import { useState, useRef } from 'react';
import { useUploadImageMutation } from '../store/api';
import { ProcessImageResponse } from '../store/api';

interface ImageUploaderProps {
  onUploadSuccess?: (result: ProcessImageResponse) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading, isError, error }] = useUploadImageMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const result = await uploadImage(formData).unwrap();

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload an Image</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select an image to analyze
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedImage || isLoading}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          !selectedImage || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Analyze Image'}
      </button>

      {isError && (
        <p className="mt-2 text-red-500 text-sm">
          Error: {(error as any)?.data?.error || 'Failed to upload image'}
        </p>
      )}
    </div>
  );
}

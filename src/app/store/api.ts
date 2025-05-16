import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ProcessImageResponse {
  result: string;
  timestamp: string;
}

export interface AutoUploadLatestResponse {
  result: string;
  timestamp: string;
  filename: string;
}
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['AutoUpload'],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<ProcessImageResponse, FormData>({
      query: (formData) => ({
        url: 'process-image',
        method: 'POST',
        body: formData,
      }),
    }),

    getAutoUploadLatest: builder.query<AutoUploadLatestResponse, void>({
      query: () => 'auto-upload-latest',
      providesTags: ['AutoUpload'],
    }),
  }),
});

export const { useUploadImageMutation, useGetAutoUploadLatestQuery } = api;

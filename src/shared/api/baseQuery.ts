import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from '@/shared/environments';

export const baseQuery = fetchBaseQuery({
  baseUrl: `${environment.serverUrl}/api`,
  prepareHeaders: (headers, { getState }) => {
    // Aquí puedes inyectar el token de auth globalmente si lo deseas
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
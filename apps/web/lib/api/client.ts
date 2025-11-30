// lib/api/client.ts
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { paths as serverPaths } from './server-types';

type AllPaths = serverPaths;

const createApiClient = (baseUrl: string) => {
  return createFetchClient<AllPaths>({
    baseUrl,
    credentials: 'include',
  });
};

export const fetchClient = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
export const api = createClient(fetchClient); // Named export
export default api; // Also keep default export for flexibility
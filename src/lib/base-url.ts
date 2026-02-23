import { headers } from 'next/headers';

/**
 * Derive base URL for server-side fetch calls so API routes work in both dev and prod.
 */
export async function getBaseUrl(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get('host') || 'localhost:3000';
  const isLocalhost = host.includes('localhost') || host.startsWith('127.');
  const protocol = isLocalhost ? 'http' : 'https';
  return `${protocol}://${host}`;
}

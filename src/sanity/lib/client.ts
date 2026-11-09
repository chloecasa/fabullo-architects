// src/sanity/lib/client.ts
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Pages are cached by Next.js and refreshed by the revalidate webhook,
  // so the Sanity CDN is not needed here.
  useCdn: false,
});

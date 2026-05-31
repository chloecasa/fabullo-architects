// src/app/(payload)/admin/[[...segments]]/not-found.tsx
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views';
import type { Metadata } from 'next';
import config from '@/payload.config';
import { importMap } from '../importMap'; // 1. Add this import

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams }); // 2. Pass importMap here

export default NotFound;

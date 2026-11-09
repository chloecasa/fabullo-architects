// src/app/(studio)/studio/[[...tool]]/StudioClient.tsx
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../../sanity.config';

export default function StudioClient() {
  return <NextStudio config={config} />;
}

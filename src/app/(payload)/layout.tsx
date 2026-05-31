// src/app/(payload)/layout.tsx
import configPromise from '@/payload.config';
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';
import { importMap } from './admin/importMap';

type LayoutProps = {
  children: React.ReactNode;
};

// This is the secure server-side bridge function required by Next.js
const serverFunction = async function (args: any) {
  'use server';
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export default function PayloadLayout({ children }: LayoutProps) {
  return (
    <RootLayout 
      config={configPromise} 
      importMap={importMap} 
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}

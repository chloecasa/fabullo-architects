// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { searchProjectsQuery } from '@/sanity/lib/queries';

export async function GET(req: NextRequest) {
  try {
    const query = new URL(req.url).searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // "term*" matches words that start with what was typed
    const results = await client.fetch(searchProjectsQuery, { term: `${query}*` });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('SEARCH API EXCEPTION:', error);
    return NextResponse.json({ error: 'Search operations failed.' }, { status: 500 });
  }
}

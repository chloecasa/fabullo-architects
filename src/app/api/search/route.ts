// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q'); 

    if (!query || query.trim() === '') {
      return NextResponse.json({ results: [] });
    }

    const payload = await getPayload({ config });

    // 1. Search projects, resolving Media relations to extract image URLs [1]
    const projectsResult = await payload.find({
      collection: 'projects',
      where: {
        title: {
          like: query, 
        },
      },
      limit: 5,
      depth: 1, // Resolves heroImg link [1]
    });

    // 2. Search journals, resolving Media relations to extract cover image URLs [1]
    const journalResult = await payload.find({
      collection: 'journal',
      where: {
        title: {
          like: query,
        },
      },
      limit: 5,
      depth: 1, // Resolves cover img link [1]
    });

    // 3. Map both results to a consistent JSON format [1]
    const mappedProjects = projectsResult.docs.map((doc: any) => ({
      id: `project-${doc.id}`,
      title: doc.title,
      type: 'PROJECT',
      slug: `/projects/${doc.slug}`,
      img: doc.heroImg?.url || '', // Return the active database image URL [1]
    }));

    // Inside src/app/api/search/route.ts
    const mappedJournal = journalResult.docs.map((doc: any) => ({
      id: `journal-${doc.id}`,
      title: doc.title,
      type: 'JOURNAL',
      slug: `/journal?open=${doc.slug}`, // Updated to pass the exact dynamic article slug [1.4.2]
      img: doc.img?.url || '', 
    }));

    const results = [...mappedProjects, ...mappedJournal];

    return NextResponse.json({ results });

  } catch (error) {
    console.error('SEARCH API EXCEPTION:', error);
    return NextResponse.json({ error: 'Search operations failed.' }, { status: 500 });
  }
}

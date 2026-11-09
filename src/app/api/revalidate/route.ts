// src/app/api/revalidate/route.ts
// Sanity calls this when content is published, so the live site updates without a redeploy.
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 });
    }

    const { isValidSignature } = await parseBody(req, secret);
    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    }

    revalidatePath('/', 'layout'); // refresh every page
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('REVALIDATE ERROR:', error);
    return new Response('Revalidate failed', { status: 500 });
  }
}

// scripts/import-from-payload.mjs
// One-off: copies projects, team, awards and books from your running Payload site into Sanity.
//
// 1. Start the old site:   npm run dev   (Payload must still be installed and working)
// 2. In another terminal:  node --env-file=.env.local scripts/import-from-payload.mjs
//
// It is safe to run again: documents use fixed ids, so they are replaced, not duplicated.
// Tip: first run it against a test dataset with SANITY_IMPORT_DATASET=test
import { createClient } from 'next-sanity';
import { randomUUID } from 'node:crypto';

const PAYLOAD_URL = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '');
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_IMPORT_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false });

const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const assetCache = new Map(); // url -> Sanity asset id, so the same file is uploaded once

async function getAll(collection, extra = '') {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=1000&depth=1${extra}`);
  if (!res.ok) throw new Error(`Could not read ${collection} from Payload (${res.status})`);
  const json = await res.json();
  return json.docs ?? [];
}

// Downloads a Payload media file and uploads it to Sanity as an image
async function uploadImage(media) {
  if (!media || typeof media !== 'object' || !media.url) return undefined;

  const url = media.url.startsWith('http') ? media.url : `${PAYLOAD_URL}${media.url}`;
  let assetId = assetCache.get(url);

  if (!assetId) {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! could not download ${url} (${res.status})`);
      return undefined;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = media.filename || url.split('/').pop()?.split('?')[0] || 'image';
    const asset = await client.assets.upload('image', buffer, { filename });
    assetId = asset._id;
    assetCache.set(url, assetId);
  }

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: media.alt || '',
  };
}

async function imageArray(items = []) {
  const out = [];
  for (const item of items) {
    const img = await uploadImage(item?.image);
    if (img) out.push({ _key: key(), ...img });
  }
  return out;
}

const rows = (list = []) =>
  list.map((r) => ({ _key: key(), _type: 'labelValue', label: r.label ?? '', val: r.val ?? '' }));

async function importProjects() {
  // Oldest first, so the newest project ends up with the newest creation date in Sanity
  const docs = (await getAll('projects')).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  console.log(`Projects: ${docs.length}`);

  for (const doc of docs) {
    console.log(`  - ${doc.title}`);

    const out = {
      _id: `project-${doc.slug}`,
      _type: 'project',
      title: doc.title,
      slug: { _type: 'slug', current: doc.slug },
      category: doc.category,
      year: String(doc.year ?? ''),
      credits: doc.credits || undefined,
      team: rows(doc.team),
      consultants: rows(doc.consultants),
      slides: (doc.slides || []).map((s) => s.text).filter(Boolean),
      verticalImages: await imageArray(doc.verticalImages),
      horizontalGallery: await imageArray(doc.horizontalGallery),
    };

    const hero = await uploadImage(doc.heroImg);
    if (hero) out.heroImg = hero;

    const f = doc.homepageFeatured;
    if (f && (f.line1 || f.line2)) out.homepageFeatured = { line1: f.line1, line2: f.line2 };

    await client.createOrReplace(out);
  }
}

async function importTeam() {
  const docs = await getAll('team', '&sort=sortOrder');
  console.log(`Team: ${docs.length}`);

  for (const doc of docs) {
    console.log(`  - ${doc.name}`);
    const out = {
      _id: `team-${doc.id}`,
      _type: 'team',
      name: doc.name,
      desc: doc.desc,
      sortOrder: doc.sortOrder ?? 0,
    };
    const image = await uploadImage(doc.image);
    if (image) out.image = image;
    await client.createOrReplace(out);
  }
}

async function importSimple(collection, type) {
  const docs = await getAll(collection);
  console.log(`${collection}: ${docs.length}`);

  for (const doc of docs) {
    await client.createOrReplace({
      _id: `${type}-${doc.id}`,
      _type: type,
      year: String(doc.year ?? ''),
      recognition: doc.recognition,
      project: doc.project,
    });
  }
}

console.log(`Importing from ${PAYLOAD_URL} into Sanity project ${projectId} (dataset: ${dataset})`);
await importProjects();
await importTeam();
await importSimple('awards', 'award');
await importSimple('books', 'book');
console.log('Done. Open /studio to check the content.');

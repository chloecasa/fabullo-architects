// src/app/(app)/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { projectBySlugQuery, projectTitleBySlugQuery } from '@/sanity/lib/queries';
import ProjectDetailView from '@/components/projects/ProjectDetailView';
import ContactSection from '@/components/contact/ContactSection';

export interface ProjectData {
  title: string;
  year: string;
  heroImg: string;
  credits: string;
  team: { label: string; val: string }[];
  consultants: { label: string; val: string }[];
  slides: string[];
  verticalImages: string[];
  horizontalGallery: string[];
}

// What the Sanity query returns
interface SanityProject {
  title?: string | null;
  year?: string | null;
  credits?: string | null;
  heroImg?: string | null;
  team?: { label?: string; val?: string }[] | null;
  consultants?: { label?: string; val?: string }[] | null;
  slides?: string[] | null;
  verticalImages?: (string | null)[] | null;
  horizontalGallery?: (string | null)[] | null;
}

// ---------- TEMPORARY PLACEHOLDERS (remove once every project has content) ----------
const PLACEHOLDER_HERO = 'https://placehold.co/1600x1000/9ca3af/ffffff?text=Hero+Image';

const PLACEHOLDER_SLIDES = [
  'Placeholder paragraph one. The studio approaches each site with a careful reading of light, material, and the surrounding street, shaping the building to sit quietly within its context.',
  'Placeholder paragraph two. Structure and circulation are developed together, so that every threshold, stair, and window frames a deliberate view of the city beyond.',
  'Placeholder paragraph three. Materials are chosen for their honesty and how they age over time, with raw concrete, timber, and stone used in calm, measured proportions.',
  'Placeholder paragraph four. The final scheme balances public and private space, allowing the building to host daily life while holding a clear and lasting architectural identity.',
];

const PLACEHOLDER_VERTICAL = [1, 2, 3, 4].map(
  (n) => `https://placehold.co/1200x1500/a1a1aa/ffffff?text=Vertical+${n}`
);

const PLACEHOLDER_GALLERY = [1, 2, 3, 4, 5].map(
  (n) => `https://placehold.co/1600x1100/d4d4d8/3f3f46?text=Gallery+${n}`
);
// ------------------------------------------------------------------------------

const toRows = (rows: { label?: string; val?: string }[] | null | undefined) =>
  (rows ?? []).map((r) => ({ label: r.label ?? '', val: r.val ?? '' }));

const mapSanityProject = (doc: SanityProject): ProjectData => ({
  title: doc.title || 'Placeholder Project',
  year: doc.year || '2026',
  heroImg: doc.heroImg || PLACEHOLDER_HERO,
  credits:
    doc.credits ||
    'Placeholder credits: photography, drawings, and site notes for testing the layout.',
  team: doc.team?.length
    ? toRows(doc.team)
    : [
        { label: 'Lead Architect', val: 'Placeholder Name' },
        { label: 'Designer', val: 'Placeholder Name' },
      ],
  consultants: doc.consultants?.length
    ? toRows(doc.consultants)
    : [
        { label: 'Structural', val: 'Placeholder Firm' },
        { label: 'MEP', val: 'Placeholder Firm' },
      ],
  slides: doc.slides?.length ? doc.slides : PLACEHOLDER_SLIDES,
  verticalImages: doc.verticalImages?.length
    ? doc.verticalImages.map((url) => url || '')
    : PLACEHOLDER_VERTICAL,
  horizontalGallery: doc.horizontalGallery?.length
    ? doc.horizontalGallery.map((url) => url || '')
    : PLACEHOLDER_GALLERY,
});

const fetchOptions = { next: { revalidate: 3600 } };

// SEO meta title from the project in Sanity
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const project = await client.fetch<{ title?: string } | null>(
    projectTitleBySlugQuery,
    { slug },
    fetchOptions
  );

  return { title: project?.title ? `${project.title} | MGK` : 'Project Not Found' };
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const rawProject = await client.fetch<SanityProject | null>(
    projectBySlugQuery,
    { slug },
    fetchOptions
  );

  if (!rawProject) {
    notFound();
  }

  const project = mapSanityProject(rawProject);

  return (
    <main>
      <ProjectDetailView project={project} />
      <ContactSection />
    </main>
  );
}

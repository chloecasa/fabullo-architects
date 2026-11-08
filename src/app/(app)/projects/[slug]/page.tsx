// src/app/(app)/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";

export interface ProjectData {
  title: string;
  year: string; // Added to interface [2.1]
  heroImg: string;
  credits: string;
  team: { label: string; val: string }[];
  consultants: { label: string; val: string }[];
  slides: string[]; 
  verticalImages: string[];
  horizontalGallery: string[];
}

// Types to satisfy ESLint without using 'any'
interface SlideItem {
  text?: string;
}

interface MediaItem {
  image?: {
    url?: string | null;
  } | null;
}

interface PayloadProjectDoc {
  title?: string;
  year?: string | number;
  heroImg?: { url?: string | null } | null;
  credits?: string;
  team?: string[];
  consultants?: string[];
  slides?: SlideItem[];
  verticalImages?: MediaItem[];
  horizontalGallery?: MediaItem[];
  [key: string]: unknown;
}

// Helper to safely format Payload's relational database arrays into the flat array formats expected by your GSAP timelines
/* eslint-disable @typescript-eslint/no-explicit-any */
// ---------- TEMPORARY PLACEHOLDERS (remove once Payload has content) ----------
const PLACEHOLDER_HERO = "https://placehold.co/1600x1000/9ca3af/ffffff?text=Hero+Image";

const PLACEHOLDER_SLIDES = [
  "Placeholder paragraph one. The studio approaches each site with a careful reading of light, material, and the surrounding street, shaping the building to sit quietly within its context.",
  "Placeholder paragraph two. Structure and circulation are developed together, so that every threshold, stair, and window frames a deliberate view of the city beyond.",
  "Placeholder paragraph three. Materials are chosen for their honesty and how they age over time, with raw concrete, timber, and stone used in calm, measured proportions.",
  "Placeholder paragraph four. The final scheme balances public and private space, allowing the building to host daily life while holding a clear and lasting architectural identity.",
];

const PLACEHOLDER_VERTICAL = [1, 2, 3, 4].map(
  (n) => `https://placehold.co/1200x1500/a1a1aa/ffffff?text=Vertical+${n}`
);

const PLACEHOLDER_GALLERY = [1, 2, 3, 4, 5].map(
  (n) => `https://placehold.co/1600x1100/d4d4d8/3f3f46?text=Gallery+${n}`
);
// ------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapPayloadProjectDetail = (doc: any): ProjectData => {
  const slides = doc.slides?.length
    ? doc.slides.map((slide: any) => slide.text)
    : PLACEHOLDER_SLIDES;

  const verticalImages = doc.verticalImages?.length
    ? doc.verticalImages.map((item: any) => item.image?.url || "")
    : PLACEHOLDER_VERTICAL;

  const horizontalGallery = doc.horizontalGallery?.length
    ? doc.horizontalGallery.map((item: any) => item.image?.url || "")
    : PLACEHOLDER_GALLERY;

  return {
    title: doc.title || "Placeholder Project",
    year: doc.year || "2026",
    heroImg: doc.heroImg?.url || PLACEHOLDER_HERO,
    credits: doc.credits || "Placeholder credits: photography, drawings, and site notes for testing the layout.",
    team: doc.team?.length
      ? doc.team
      : [
          { label: "Lead Architect", val: "Placeholder Name" },
          { label: "Designer", val: "Placeholder Name" },
        ],
    consultants: doc.consultants?.length
      ? doc.consultants
      : [
          { label: "Structural", val: "Placeholder Firm" },
          { label: "MEP", val: "Placeholder Firm" },
        ],
    slides,
    verticalImages,
    horizontalGallery,
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-explicit-any */

// Dynamically generate SEO Meta Titles from your Neon Database entries
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;
  
  const payload = await getPayload({ config });
  
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
  });
  
  const project = result.docs[0];
  return { title: project ? `${project.title} | MGK` : "Project Not Found" };
}

export default async function ProjectPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the promise first to define 'slug' clearly, matching your original compiler structure
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;
  
  const payload = await getPayload({ config });

  // Query PostgreSQL for the project matching this slug, populating images
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 1, // Resolves the Media upload links so we get actual file URLs
  });

  const rawProject = result.docs[0];

  if (!rawProject) {
    notFound();
  }

  // Format database arrays into flat JSX structures for your GSAP timelines
  const project = mapPayloadProjectDetail(rawProject);

  return (
    <main>
      <ProjectDetailView project={project} />
      <ContactSection />
    </main>
  );
}

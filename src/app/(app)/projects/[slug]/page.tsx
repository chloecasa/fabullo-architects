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
const mapPayloadProjectDetail = (doc: any): ProjectData => {
  return {
    title: doc.title,
    year: doc.year || '', // Map dynamic completion year from Neon DB [1]
    heroImg: doc.heroImg?.url || '', // Resolve Hero image URL from relation
    credits: doc.credits || '',
    team: doc.team || [],
    consultants: doc.consultants || [],
    // Extract raw text strings from your schema array objects
    slides: doc.slides ? doc.slides.map((slide: any) => slide.text) : [],
    // Resolve nested primary image URLs from your relational media lists
    verticalImages: doc.verticalImages
      ? doc.verticalImages.map((item: any) => item.image?.url || '')
      : [],
    horizontalGallery: doc.horizontalGallery
      ? doc.horizontalGallery.map((item: any) => item.image?.url || '')
      : [],
  };
};
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

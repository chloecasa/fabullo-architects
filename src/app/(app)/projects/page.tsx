// src/app/(app)/projects/page.tsx
import { getPayload } from 'payload';
import config from '@/payload.config';
import Projects from "@/components/projects/Projects";
import ContactSection from "@/components/contact/ContactSection";

export const metadata = {
  title: "Projects | FABULLO Architects",
  description: "A portfolio of refined, context-driven architectural works.",
};

export default async function ProjectsPage() {
  const payload = await getPayload({ config });

  // Fetch all projects from Neon PostgreSQL via Payload Local API [1, 2]
  const result = await payload.find({
    collection: 'projects',
    sort: '-createdAt',
    depth: 1, // Populate the Media relationship to resolve image URLs [1]
  });

  return (
    <main>
      {/* Pass the live database projects directly to your client component [2] */}
      <Projects initialProjects={result.docs} />
      <ContactSection />
    </main>
  );
}

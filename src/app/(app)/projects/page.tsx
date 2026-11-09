// src/app/(app)/projects/page.tsx
import { client } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import Projects from '@/components/projects/Projects';
import ContactSection from '@/components/contact/ContactSection';

export const metadata = {
  title: 'Projects | FABULLO Architects',
  description: 'A portfolio of refined, context-driven architectural works.',
};

export default async function ProjectsPage() {
  // Fetch all projects from Sanity. The shape matches the old Payload docs.
  const projects = await client.fetch(projectsQuery, {}, { next: { revalidate: 3600 } });

  return (
    <main>
      <Projects initialProjects={projects} />
      <ContactSection />
    </main>
  );
}

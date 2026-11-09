// src/app/(app)/page.tsx
import Hero from "@/components/homepage/Hero";
import HorizontalBlog from "@/components/homepage/HorizontalBlog";
import UnifiedTransition from "@/components/homepage/UnifiedTransition";
import IntroSequence from "@/components/homepage/IntroSequence";
import ContactSection from "@/components/contact/ContactSection";
import { client } from "@/sanity/lib/client";
import { homepageQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const homepage = await client.fetch(homepageQuery);

  // Drop any featured project that was deleted (its reference comes back null)
  const featuredProjects = (homepage?.featuredProjects ?? []).filter(Boolean);

  return (
    <main>
      <Hero />
      <IntroSequence />

      <UnifiedTransition featuredProjects={featuredProjects} />

      <HorizontalBlog />
      <ContactSection />
    </main>
  );
}

// src/app/(app)/page.tsx
import { getPayload } from 'payload';
import config from '@/payload.config';
import Hero from "@/components/homepage/Hero";
import HorizontalBlog from "@/components/homepage/HorizontalBlog";
import UnifiedTransition from "@/components/homepage/UnifiedTransition";
import IntroSequence from "@/components/homepage/IntroSequence";
import ContactSection from "@/components/contact/ContactSection";

export default async function Home() {
  const payload = await getPayload({ config });

  // Query your Homepage Global configurations, resolving the nested projects and hero images [1, 2]
  const homepageData = await payload.findGlobal({
    slug: 'homepage',
    depth: 2, // Depth 2 is required to resolve both the projects and their media uploads [1]
  });

  return (
    <main>
      <Hero />
      <IntroSequence />
      
      {/* Pass the dynamic featured projects directly into your slider component [2] */}
      <UnifiedTransition featuredProjects={homepageData.featuredProjects || []} />
      
      <HorizontalBlog />
      <ContactSection />
    </main>
  );
}

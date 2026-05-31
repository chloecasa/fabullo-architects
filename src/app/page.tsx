import Hero from "@/components/homepage/Hero";
import HorizontalBlog from "@/components/homepage/HorizontalBlog";
import UnifiedTransition from "@/components/homepage/UnifiedTransition";
import IntroSequence from "@/components/homepage/IntroSequence";
import ContactSection from "@/components/contact/ContactSection";




export default function Home() {
  return (
    <>
      {/* 
         The Header and Footer are already in layout.tsx, 
         so we only put the page-specific content here.
      */}
      <main>
      <Hero />
        <IntroSequence />
      <UnifiedTransition/>
    
      <HorizontalBlog />
      <ContactSection/>
   </main>


    </>
  );
}

import Hero from "@/components/homepage/Hero";
import HorizontalBlog from "@/components/homepage/HorizontalBlog";
import UnifiedTransition from "@/components/homepage/UnifiedTransition";
import IntroSequence from "@/components/homepage/IntroSequence";


export default function Home() {
  return (
    <>
      {/* 
         The Header and Footer are already in layout.tsx, 
         so we only put the page-specific content here.
      */}
      
      <Hero />
        <IntroSequence />
      <UnifiedTransition />
    
      <HorizontalBlog />

      {/* 
          This is a 'Light' section. 
          The 'data-header-theme' tells the Header to turn BLACK here.
      */}
     

    </>
  );
}

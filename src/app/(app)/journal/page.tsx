// src/app/(app)/journal/page.tsx
import { getPayload } from 'payload';
import config from '@/payload.config';
import JournalHome from '@/components/journal/JournalHome'; 
import ContactSection from '@/components/contact/ContactSection'; 
import { Metadata } from 'next';
import { Suspense } from 'react'; 

export const metadata: Metadata = {
  title: "Journal | FABULLO Architects",
  description: "An exploration of context-driven design and refined structural forms within the modern landscape.",
};

interface PreviewSlide {
  title?: string;
  image: string;
  smallImage?: string;
  textLeft?: string;
  textMiddle?: string;
  textRight?: string;
}

interface JournalEntry {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  previewTemplate?: "version-1" | "version-2" | "version-3" | "version-4" | "version-5";
  previewSlides?: PreviewSlide[];
  slug: string; // Changed from slug?: string to slug: string
}

// Data Mapper: Automatically transforms static database groups into the dynamic React arrays [1.4.2]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPayloadJournalEntries = (docs: any[]): JournalEntry[] => {
  if (!docs || !Array.isArray(docs)) return [];

  return docs.map((doc) => {
    let slides: PreviewSlide[] = [];

    // Extract and format slides based on which specific layout is selected in the CMS [1.4.2]
    if (doc.previewTemplate === 'version-1' && doc.template1) {
      slides = [
        {
          title: doc.template1.slide1?.title,
          image: doc.template1.slide1?.image?.url || '',
        },
        {
          image: doc.template1.slide2?.image?.url || '',
          textLeft: doc.template1.slide2?.textLeft,
          textRight: doc.template1.slide2?.textRight,
        },
        {
          image: doc.template1.slide3?.image?.url || '',
          smallImage: doc.template1.slide3?.smallImage?.url,
          textLeft: doc.template1.slide3?.textLeft,
          textRight: doc.template1.slide3?.textRight,
        },
      ];
    } else if (doc.previewTemplate === 'version-2' && doc.template2) {
      slides = [
        {
          title: doc.template2.slide1?.title,
          image: doc.template2.slide1?.image?.url || '',
        },
        {
          image: doc.template2.slide2?.image?.url || '',
          textLeft: doc.template2.slide2?.textLeft,
          textRight: doc.template2.slide2?.textRight,
        },
        {
          image: doc.template2.slide3?.image?.url || '',
          textLeft: doc.template2.slide3?.textLeft,
          textMiddle: doc.template2.slide3?.textMiddle,
        },
        {
          image: doc.template2.slide4?.image?.url || '',
          textLeft: doc.template2.slide4?.textLeft,
          textRight: doc.template2.slide4?.textRight,
        },
      ];
    } else if (doc.previewTemplate === 'version-3' && doc.template3) {
      slides = [
        {
          title: doc.template3.slide1?.title,
          image: doc.template3.slide1?.image?.url || '',
        },
        {
          image: doc.template3.slide2?.image?.url || '',
          textLeft: doc.template3.slide2?.textLeft,
          textRight: doc.template3.slide2?.textRight,
        },
        {
          image: doc.template3.slide3?.image?.url || '',
          textLeft: doc.template3.slide3?.textLeft,
          textRight: doc.template3.slide3?.textRight,
        },
      ];
    } else if (doc.previewTemplate === 'version-4' && doc.template4) {
      slides = [
        {
          title: doc.template4.slide1?.title,
          image: doc.template4.slide1?.image?.url || '',
        },
        {
          image: doc.template4.slide2?.image?.url || '',
          textLeft: doc.template4.slide2?.textLeft,
          textMiddle: doc.template4.slide2?.textMiddle,
          textRight: doc.template4.slide2?.textRight,
        },
        {
          image: doc.template4.slide3?.image?.url || '',
          textLeft: doc.template4.slide3?.textLeft,
          textRight: doc.template4.slide3?.textRight,
        },
        {
          image: doc.template4.slide4?.image?.url || '',
          textLeft: doc.template4.slide4?.textLeft,
        },
      ];
    } else if (doc.previewTemplate === 'version-5' && doc.template5) {
      slides = [
        {
          title: doc.template5.slide1?.title,
          image: doc.template5.slide1?.image?.url || '',
        },
        {
          image: doc.template5.slide2?.image?.url || '',
          textLeft: doc.template5.slide2?.textLeft,
          textRight: doc.template5.slide2?.textRight,
        },
      ];
    }

    return {
      id: doc.id,
      title: doc.title,
      subtitle: doc.subtitle || 'Architectural Journal',
      desc: doc.desc || '',
      img: doc.img?.url || '',
      previewTemplate: doc.previewTemplate,
      previewSlides: slides,
      slug: doc.slug || '', // Changed to guarantee a non-undefined string fallback
    };
  });
};

export default async function JournalPage() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'journal',
    sort: '-createdAt',
    depth: 2, 
  });

  const dynamicEntries = mapPayloadJournalEntries(result.docs);

  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <JournalHome initialEntries={dynamicEntries} />
      </Suspense>

      <ContactSection />
    </main>
  );
}

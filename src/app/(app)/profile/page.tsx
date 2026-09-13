// src/app/(app)/profile/page.tsx
import { getPayload } from 'payload';
import config from '@/payload.config';
import Profile from "@/components/profile/Profile"; // Restored your custom Profile wrapper
import Teams from '@/components/profile/Teams';
import Awards from '@/components/profile/Awards';
import ContactSection from '@/components/contact/ContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Profile | FABULLO Architects",
  description: "Meet the team and explore the vision behind MGK Architects.",
};

interface TeamMember {
  id: number;
  name: string;
  img: string;
  desc: string;
}

interface AwardEntry {
  recognition: string;
  project: string;
}

interface YearGroup {
  year: string;
  entries: AwardEntry[];
}

// Database-to-Frontend Team Profile Mapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPayloadTeam = (docs: any[]): TeamMember[] => {
  if (!docs || !Array.isArray(docs)) return [];

  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    img: doc.image?.url || '', // Resolves Media upload portrait URL [1]
    desc: doc.desc || '',
  }));
};

// High-Performance Grouping Reducer (Converts flat database rows into nested year arrays) [2]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupByYear = (docs: any[]): YearGroup[] => {
  if (!docs || !Array.isArray(docs)) return [];

  return docs.reduce((acc: YearGroup[], doc) => {
    const year = doc.year || 'Unknown';
    let group = acc.find((g) => g.year === year);

    if (!group) {
      group = { year, entries: [] };
      acc.push(group);
    }

    group.entries.push({
      recognition: doc.recognition || '',
      project: doc.project || '',
    });

    return acc;
  }, []);
};

export default async function ProfilePage() {
  const payload = await getPayload({ config });

  // 1. Query your Team collection sorted by their sortOrder [2]
  const teamResult = await payload.find({
    collection: 'team',
    sort: 'sortOrder',
    depth: 1, // Resolves the staff portrait upload relationship [1]
  });

  // 2. Query your flat Awards collection sorted by year descending [2]
  const awardsResult = await payload.find({
    collection: 'awards',
    sort: '-year',
  });

  // 3. Query your flat Books collection sorted by year descending [2]
  const booksResult = await payload.find({
    collection: 'books',
    sort: '-year',
  });

  // Hydrate and map database results into flat/nested frontend components [2]
  const dynamicMembers = mapPayloadTeam(teamResult.docs);
  const dynamicAwards = groupByYear(awardsResult.docs);
  const dynamicBooks = groupByYear(booksResult.docs);

  return (
    <main>
      {/* Restored: Renders the primary intro/bio block exactly as designed */}
      <Profile />
      
      {/* Renders the dynamic team spotlight ticker [2] */}
      <Teams initialMembers={dynamicMembers} />
      
      {/* Renders the dynamic accordion year-groups list [2] */}
      <Awards initialAwards={dynamicAwards} initialBooks={dynamicBooks} />
      
      {/* Standard Footer Section [2] */}
      <ContactSection />
    </main>
  );
}

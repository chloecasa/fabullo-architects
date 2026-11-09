// src/app/(app)/profile/page.tsx
import Profile from "@/components/profile/Profile";
import Teams from "@/components/profile/Teams";
import Awards from "@/components/profile/Awards";
import ContactSection from "@/components/contact/ContactSection";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { teamQuery, awardsQuery, booksQuery } from "@/sanity/lib/queries";

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

// Groups flat rows (one per award or book) into year blocks, newest year first
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupByYear = (docs: any[]): YearGroup[] => {
  if (!docs || !Array.isArray(docs)) return [];

  return docs.reduce((acc: YearGroup[], doc) => {
    const year = doc.year || "Unknown";
    let group = acc.find((g) => g.year === year);

    if (!group) {
      group = { year, entries: [] };
      acc.push(group);
    }

    group.entries.push({
      recognition: doc.recognition || "",
      project: doc.project || "",
    });

    return acc;
  }, []);
};

export default async function ProfilePage() {
  // Team, awards and books are already sorted by their queries
  const teamRows = await client.fetch(teamQuery);
const team: TeamMember[] = teamRows.map((member: { name: string; img: string; desc: string }, index: number) => ({
  id: index + 1, // Teams.tsx expects a number; the list order is what matters
  name: member.name,
  img: member.img,
  desc: member.desc,
}));
  const awards = await client.fetch(awardsQuery);
  const books = await client.fetch(booksQuery);

  const dynamicAwards = groupByYear(awards);
  const dynamicBooks = groupByYear(books);

  return (
    <main>
      <Profile />
      <Teams initialMembers={team} />
      <Awards initialAwards={dynamicAwards} initialBooks={dynamicBooks} />
      <ContactSection />
    </main>
  );
}

// src/app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";

export interface ProjectData {
  title: string;
  heroImg: string;
  credits: string;
  team: { label: string; val: string }[];
  consultants: { label: string; val: string }[];
  // The 4 text parts for the pinned sequence
  slides: string[]; 
  // The 4 images for the pinned sequence
  verticalImages: string[];
  // The list of images for the bottom scroll
  horizontalGallery: string[];
}

const ALL_PROJECTS: Record<string, ProjectData> = {
  "res-1": {
    title: "SUN GARDEN HOUSE",
    heroImg: "/assets/images/Tareola Image.png", 
    credits: "PHOTOGRAPHY BY PRUE RUSCOE STYLED BY OLGA LEWIS",
      team: [
      { label: "MCK TEAM", val: "MAKI YAMAJI, SU LIEW, STEVE KOOLLOOS" },
      { label: "BUILDER", val: "RICHARDS BUILDING" },
      { label: "STRUCTURAL ENGINEER", val: "SDA STRUCTURES" },
      { label: "LANDSCAPE ARCHITECTS", val: "MARIKO FRASER" },
      { label: "INTERIOR DESIGN", val: "MCK ARCHITECTS" },

    ],
    consultants: [
        { label: "HERITAGE", val: "ZOLTAN KOVACS" },
      { label: "PLANNING", val: "GSA PLANNING" },
      { label: "JOINERY", val: "ELAN" },
      { label: "SOLAR BLINDS", val: "SHADE FACTOR" },
      { label: "GLASS BRICKS", val: "AUSTRAL" },
      
    ],
    slides: [
        "Presented to the street as a reinvogprated victorian terrace, the Ghrian-Glyph Fouse appears understated",
        "As traditonal as the day it was built, the journey in takes no time to alert the inhabitant.",
        "The contemporary twist presents a generous source of light at the end of the tunnel.",
        "Beyond the seamless black balustrade that flanks the stair leading down to the new living zone."
    ],
    verticalImages: [
      "/assets/images/Tareola Image.png",
      "/assets/images/Tareola Image.png",
      "/assets/images/Tareola Image.png",
      "/assets/images/Tareola Image.png",
    ],
    horizontalGallery: [
       "/assets/images/download (3).jpg",
      "/assets/images/download (5).jpg",
      "/assets/images/download (3).jpg",
      "/assets/images/download (10).jpg",
       "/assets/images/download (3).jpg",
       "/assets/images/download (3).jpg",
      "/assets/images/download (10).jpg",
       "/assets/images/download (3).jpg",
      "/assets/images/download (10).jpg",
       "/assets/images/download (3).jpg",
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = ALL_PROJECTS[slug];
  return { title: project ? `${project.title} | MGK` : "Project Not Found" };
}

// This version is "cleaner" and easier for TypeScript to read
export default async function ProjectPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the promise first
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug; // This defines 'slug' clearly
  
  const project = ALL_PROJECTS[slug];

  if (!project) {
    notFound();
  }

  return (

    <main>
<ProjectDetailView project={project} />;
<ContactSection/>
</main>
  ) 
}

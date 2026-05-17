import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/projects/ProjectDetailView";

// --- This will eventually come from your Backend Dashboard ---
const ALL_PROJECTS = {
  "tareola": {
    title: "Monochrome Signal",
    description: "A stripped-back visual experience blending luxury fashion with streetwear edge. Designed for bold statements and minimal distractions.",
    url: "#",
    tags: ["Monochrome", "Editorial", "Fashion", "Visual Identity"],
    img: "/assets/projects/tareola.png",
    index: "01 / 04"
  },
  "manning": {
    title: "Manning Strand",
    description: "A minimalist commercial space focused on material honesty and industrial refined forms.",
    url: "#",
    tags: ["Industrial", "Retail", "Sydney"],
    img: "/assets/projects/manning.png",
    index: "02 / 04"
  }
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = ALL_PROJECTS[slug as keyof typeof ALL_PROJECTS];

  if (!project) notFound();

  return <ProjectDetailView project={project} />;
}

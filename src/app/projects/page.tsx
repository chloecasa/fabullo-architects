import Projects from "@/components/projects/Projects";
import ContactSection from "@/components/contact/ContactSection";


export const metadata = {
  title: "Projects | MGK Architects",
  description: "A portfolio of refined, context-driven architectural works.",
};

export default function ProjectsPage() {
  return (
  
  <main>
<Projects />
<ContactSection/>
</main>
  );
  }

import Teams from "@/components/profile/Teams";
import Awards from "@/components/profile/Awards";

export const metadata = {
  title: "Profile | MGK Architects",
  description: "Meet the team and explore the vision behind MGK Architects.",
};

export default function ProfilePage() {
  return (
    <main>
      {/* You can add a Bio section here later */}
      <Teams />
      <Awards />
      
      {/* We will refactor your Awards next and put it here */}
    </main>
  );
}

import Teams from "@/components/profile/Teams";
import Profile from "@/components/profile/Profile";
import Awards from "@/components/profile/Awards";
import ContactSection from "@/components/contact/ContactSection";




export const metadata = {
  title: "Profile | MGK Architects",
  description: "Meet the team and explore the vision behind MGK Architects.",
};

export default function ProfilePage() {
  return (
    <main>
      {/* You can add a Bio section here later */}
      <Profile/>
      <Teams />
      <Awards />
      <ContactSection/>
      {/* We will refactor your Awards next and put it here */}
    </main>
  );
}

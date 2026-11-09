import MenuProvider from "@/components/context/MenuProvider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GsapInitializer from "@/components/helpers/GsapInitializer";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

import CircleCursor from "@/components/ui/CircleCursor";
import CookieBanner from "@/components/ui/CookieBanner";
import ScrollToTopOnRoute from "@/components/ui/ScrollToTopOnRoute";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GsapInitializer />

      <MenuProvider>
        <Header />

        <SmoothScroll>
          <main className="relative z-20 min-h-svh w-full bg-white">
            {children}
          </main>

       <ScrollToTopOnRoute />
          <CircleCursor />
          <Footer />
        </SmoothScroll>
      </MenuProvider>

      <CookieBanner />
    </>
  );
}

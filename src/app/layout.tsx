import localFont from "next/font/local";
import "./globals.css";

// 1. LT Superior (Your primary UI font)
const ltSuperior = localFont({
  src: [
    { path: "./fonts/LTSuperior-Light.ttf", weight: "300", style: "light" },
    { path: "./fonts/LTSuperior-Regular.ttf", weight: "400", style: "regular" },
    { path: "./fonts/LTSuperior-Medium.ttf", weight: "500", style: "medium" },
    { path: "./fonts/LTSuperior-Bold.ttf", weight: "700", style: "bold" },
  ],
  variable: "--font-lt-superior",
});

// 2. Cinzel (For elegant headings)
const cinzel = localFont({
  src: [
    { path: "./fonts/Cinzel-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Cinzel-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
});

// 3. Code (For minimalist accents)
const codeFont = localFont({
  src: [
    { path: "./fonts/CODE Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/CODE Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-code",
});

// 4. TT Hoves (Industry standard professional font)
const ttHoves = localFont({
  src: [
    { path: "./fonts/TT Hoves Pro Trial Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/TT Hoves Pro Trial Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-hoves",
});

import MenuProvider from "@/context/MenuProvider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GsapInitializer from "@/components/helpers/GsapInitializer";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import CursorWord from "@/components/ui/CursorWord";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`overflow-x-hidden ${ltSuperior.variable} ${cinzel.variable} ${codeFont.variable} ${ttHoves.variable}`}
    >
      <body className="antialiased overflow-x-hidden w-full bg-white">
        <GsapInitializer />
      
        
        <SmoothScroll>
          <MenuProvider>
            {/* Header sits on top of everything */}
            <Header />

            {/* 
              MAIN acts as the "Curtain". 
              z-20 and bg-black ensures it stays on top of the footer.
            */}
            <main            className="relative z-20 w-full min-h-screen bg-white shadow-none"
>
              {children}
            </main>
<CursorWord/>
            {/* 
              FOOTER sits at the bottom. 
              The internal GSAP in your Footer component handles the "reveal" movement.
            */}
            <Footer />

        
          </MenuProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

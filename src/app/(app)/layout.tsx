import localFont from "next/font/local";
import "./globals.css";

const ltSuperior = localFont({
  src: [
    { path: "./fonts/LTSuperior-Light.ttf", weight: "300", style: "light" },
    { path: "./fonts/LTSuperior-Regular.ttf", weight: "400", style: "regular" },
    { path: "./fonts/LTSuperior-Medium.ttf", weight: "500", style: "medium" },
    { path: "./fonts/LTSuperior-Bold.ttf", weight: "700", style: "bold" },
  ],
  variable: "--font-lt-superior",
});

const cinzel = localFont({
  src: [
    { path: "./fonts/Cinzel-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Cinzel-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
});

const codeFont = localFont({
  src: [
    { path: "./fonts/CODE Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/CODE Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-code",
});

const ttHoves = localFont({
  src: [
    { path: "./fonts/TT Hoves Pro Trial Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/TT Hoves Pro Trial Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-hoves",
});

import MenuProvider from "@/components/context/MenuProvider";
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
      <body className="w-full overflow-x-hidden bg-white antialiased">
        <GsapInitializer />

        <MenuProvider>
          <Header />

          <SmoothScroll>
            <main className="relative z-20 min-h-screen w-full bg-white shadow-none">
              {children}
            </main>

            <CursorWord />
            <Footer />
          </SmoothScroll>
        </MenuProvider>
      </body>
    </html>
  );
}

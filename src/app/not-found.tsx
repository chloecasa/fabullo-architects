// src/app/not-found.tsx
// Shown for any address that doesn't exist. The site header and footer still appear around it.
import RollLink from "@/components/ui/RollLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] w-full flex-col bg-white px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[90px] text-black md:px-5 md:pt-[120px]">
      <div className="flex flex-1 items-center justify-center">
        <h1
          className="whitespace-nowrap text-center font-bold uppercase leading-[0.8] tracking-tighter text-[clamp(4.5rem,28vw,22rem)]"
        >
          404
        </h1>
      </div>

      <div className="flex justify-end">
        <RollLink
          href="/projects"
          className="text-[clamp(1.25rem,5vw,2.25rem)] font-semibold uppercase"
        >
          [See projects] ↗
        </RollLink>
      </div>
    </section>
  );
}

// src/app/not-found.tsx
// Shown for any address that doesn't exist. The site header and footer still appear around it.
import RollLink from "@/components/ui/RollLink";

export default function NotFound() {
  return (
    <section className="flex min-h-svh w-full flex-col justify-between bg-white px-[12px] pb-10 pt-[90px] text-black md:px-[20px] md:pt-[120px]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
          Error 404
        </p>
        <h1 className="mt-4 font-bold uppercase leading-[0.8] tracking-tighter text-[clamp(7rem,30vw,24rem)]">
          404
        </h1>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-md text-left text-sm font-normal leading-snug md:text-base">
          This page doesn&apos;t exist, or it has moved.
        </p>

        <RollLink
          href="/projects"
          className="text-2xl font-semibold uppercase md:text-4xl"
        >
          [See projects] ↗
        </RollLink>
      </div>
    </section>
  );
}

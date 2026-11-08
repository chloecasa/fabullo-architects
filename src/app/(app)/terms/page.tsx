import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-svh bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pt-[clamp(6rem,12svh,8rem)] pb-16 md:px-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 md:mb-12 uppercase">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mb-8">
          Last Updated: June 2026
        </p>

        <div className="space-y-10 md:space-y-12 text-base leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              1. Intellectual Property
            </h2>
            <p>
              All architectural renderings, photographs, visual blueprints, textual descriptions, and digital assets displayed on this platform are the exclusive intellectual property of FABULLO. Unauthorized reproduction, modification, or distribution of this material is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              2. Copyright Takedown (DMCA Safe Harbor)
            </h2>
            <p>
              We respect the intellectual property rights of others. If you believe that any image, photograph, or project asset hosted on this platform infringes upon a copyright owned by you, please submit an official written takedown notice to our designated agent at{" "}
              <span className="underline select-all break-all">hello@fabullo.com</span>.
            </p>
            <p className="mt-4">
              Upon receipt of a valid copyright claim, we will immediately review and remove the disputed media asset from our database and Cloudinary storage arrays to preserve safe harbor protections.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              3. Governing Law
            </h2>
            <p>
              These terms of service and any disputes arising from your use of this digital platform are governed exclusively by the laws of New South Wales, Australia, without regard to conflict of law principles.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

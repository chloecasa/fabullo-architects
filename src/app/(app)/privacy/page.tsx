import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pt-[clamp(6rem,12svh,8rem)] pb-16 md:px-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 md:mb-12 uppercase">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mb-8">
          Last Updated: June 2026
        </p>

        <div className="space-y-10 md:space-y-12 text-base leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              1. Information Collection
            </h2>
            <p>
              When you submit an inquiry through our contact portal, we collect your name, email address, phone number, and project-specific parameters. This information is gathered strictly to facilitate bespoke architectural consultations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              2. Data Storage & Security
            </h2>
            <p>
              Your contact data is processed securely and archived inside our serverless PostgreSQL database. We implement strict server-side encryption and access controls to prevent unauthorized data retrieval, leaks, or exposure. We do not sell, rent, or distribute your personal details to third-party marketers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              3. Analytics & Cookies
            </h2>
            <p>
              We utilize lightweight, privacy-compliant product analytics to track user interactions and optimize website performance. These tools use performance cookies only with your explicit consent. You can adjust your consent choices at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-4 tracking-tight">
              4. Your Rights & Data Deletion
            </h2>
            <p>
              Under global privacy frameworks, you retain the right to access, rectify, or request the absolute deletion of your personal data from our systems. To request deletion, please contact us directly at{" "}
              <span className="underline select-all break-all">hello@fabullo.com</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

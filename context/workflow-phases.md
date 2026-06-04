# Full-Stack Integration Map: MGK Architects

This map outlines the complete structural phases required to connect the Next.js 16 frontend to a robust, serverless backend powered by Payload CMS v3. Each phase is isolated to prevent code regressions, simplify auditing, and ensure a clean, zero-cost production footprint.

---

## Phase 1: Local Environment, Core CMS, & Secure Modeling
**Objective:** Establish the local CMS framework, wire it directly to your serverless PostgreSQL database, and model your secure, locked data schemas.

*   **Milestone 1.1: Payload v3 Initialization**
    *   Integrate the Payload CMS engine directly into the Next.js App Router.
    *   Configure the local CMS configuration mapping file.
    *   Define the administrative access path (the `/admin` path) handled natively by Next.js.
*   **Milestone 1.2: Serverless Database Mapping**
    *   Configure the native Postgres database adapter.
    *   Connect Payload to the Neon PostgreSQL connection string.
    *   Allow the adapter to automatically generate and maintain SQL tables in Neon.
*   **Milestone 1.3: Secure Data Schema Modeling (Collections & Globals)**
    *   Model the `Users` schema for secure administrative login.
    *   Model the `Projects` schema for portfolio items (capturing dates, metadata, slides, and media).
    *   Model the `Journal` schema with static template configurations (`template1` to `template5`).
    *   Model the `Team`, `Awards`, and `Books` collections to support dynamic profile groups.
    *   Model the `Homepage` Global document to let the client select and arrange exactly 4 featured projects.
    *   Model the `Leads` schema as a secure, read-only database backup for contact inquiries.
*   **Milestone 1.4: Collection-Level Access Hardening**
    *   *Implementation:* Define strict, built-in access control rules inside your collection files [1.2.3, 19]. 
    *   *Target:* Configure the `Leads` and `Users` collections so that public unauthenticated users can only write data (`create: () => true`), but strictly restrict reading, updating, or deleting records to authenticated administrators (`read: ({ req }) => Boolean(req.user)`).
*   **Milestone 1.5: Cloud Storage Connection**
    *   Configure the cloud storage plugin (`payloadcms-storage-cloudinary`).
    *   Map media uploads from the CMS interface to Cloudinary.

---

## Phase 2: Local Technical SEO, Site Maps, & Crawl Protection
**Objective:** Replace static frontend mock templates with live database queries and implement an automated, dynamic search engine optimization system.

*   **Milestone 2.1: Dynamic Content Hydration**
    *   Update Next.js Server Components to fetch content using Payload's Local API.
    *   Ensure all data reads are resolved directly on the server for maximum speed.
    *   Wire the Journal template switcher to render specific React designs based on the CMS selection.
*   **Milestone 2.2: The SEO Plugin & Meta Management**
    *   Integrate the first-party SEO plugin (`@payloadcms/plugin-seo`) into the global CMS configuration [2.2].
    *   Verify that the dynamic "SEO Meta" input fields and search engine preview cards appear automatically inside the Project and Journal editing panels [2.2].
    *   Define fallbacks to automatically generate meta titles and descriptions if left empty by the editor.
*   **Milestone 2.3: Dynamic Metadata Generation**
    *   Implement Next.js dynamic metadata handlers inside the project and journal subroutes.
    *   Configure the handlers to read the CMS SEO meta fields and generate proper OpenGraph, Twitter, and standard HTML meta tags.
*   **Milestone 2.4: Indexing, Crawling Automation, & Spoofing Protection**
    *   Set up a programmatic sitemap file to dynamically generate a search engine XML map of all active projects and journals.
    *   Configure a `robots.txt` rules file to safely expose public content while shielding administrative paths from search engine web crawlers.
    *   *Crawl Protection:* Audit all routing configurations and Next.js redirects to ensure no dynamic evaluations are based on the incoming `User-Agent` header, shielding the domain from bot-cloaking and search engine index-hijacking [3.1, 3.7].

---

## Phase 3: The Integration Middleware & Sanitized CRM Pipeline
**Objective:** Construct a highly secure, automated serverless pipeline that captures public contact form submissions, sanitizes input, archives them locally, and pushes them to external business tools.

*   **Milestone 3.1: Secure Server-Side Form Handling & Rate Limiting**
    *   Develop a secure Next.js Server Action (`submitInquiry`) to catch submissions from the public Contact Page.
    *   Implement strict Zod validation schemas to verify all input structures.
    *   Apply strict HTML, script, and CSS stripping to protect the backend database from cross-site scripting (XSS) injections.
    *   Configure standard rate limiting on your Server Action and `/api/search` route to block bot spam.
*   **Milestone 3.2: Local Database Logging**
    *   Hook the validated, sanitized form payload into the CMS `Leads` collection, writing a permanent, secure database backup.
*   **Milestone 3.3: Email Alerts (Resend)**
    *   Connect the Resend transactional email API to the server pipeline.
    *   Configure automated email alerts to immediately notify the architectural team when a new inquiry is registered.
    *   Wrap the mailing trigger in secure handlers to prevent form submittal crashes if an email bounce occurs.
*   **Milestone 3.4: Asynchronous CRM Synchronization**
    *   Write asynchronous API integration hooks inside the submission lifecycle of your contact form Server Action.
    *   *CRM Sync:* Map, format, and push the lead payload to the client's active board on **Monday.com** or **HubSpot** using their secure REST APIs.
    *   *Team Alert:* Connect a webhook to dispatch a formatted alert to their team communications chat (Slack or Microsoft Teams) once a lead card is generated.

---

## Phase 3.5: Dedicated Frontend Polish, Visual Compliance, & Accessibility (The Design Intermission)
**Objective:** Transition your focus from backend logic back to pure visual design, alignment, and responsiveness. Audit and lock in the entire user experience, legal pages, and accessibility markers across all devices.

*   **Milestone 3.5.1: Navigation & Header Finalization**
    *   Refine the desktop slide-out overlay menu physics and active link states.
    *   Audit and lock in the mobile navigation bar layout, ensuring touch-targets are appropriately sized.
*   **Milestone 3.5.2: CSS Spacing, Positioning, & Alignment**
    *   Polish margins, padding, and text boundaries on the split-screen Contact Page.
    *   Audit all image grids to ensure aspect-ratio parameters prevent layout shifting.
    *   Verify typography sizes and visual weights conform strictly to the tokens in `ui-context.md`.
*   **Milestone 3.5.3: Cross-Device Responsive Sweep**
    *   Test and debug the layout fluidly across standard viewport sizes (mobile portrait, tablet landscape, standard laptops, and ultrawide screens).
    *   Adjust Tailwind responsive classes (`sm:`, `md:`, `lg:`, `xl:`) to handle text wrapping on tricky transition widths.
*   **Milestone 3.5.4: WCAG AA Accessibility Audit**
    *   Ensure all images uploaded in the CMS require alternate text (`alt` attributes).
    *   Confirm typography colors strictly adhere to contrast-ratio tokens in `ui-context.md`.
    *   Verify that custom button outlines support standard keyboard navigation (focus rings) [26].
*   **Milestone 3.5.5: Privacy Policy, Terms of Service, & Cookie Consent Banner**
    *   Design a minimalist, stark cookie consent banner matching your design tokens. Ensure analytics scripts only run *after* consent [26].
    *   Compile and deploy your client's GDPR/Privacy Act compliant Privacy Policy [26].
    *   Add a standard copyright takedown clause (DMCA Safe Harbor) to protect your client from copyright claims on team or project media [22].
*   **Milestone 3.5.6: Animation & Transition Audit**
    *   Verify that your GSAP text-splitting and entrance/exit timelines run smoothly without causing visual stuttering or layout clipping during window resizes.

---

## Phase 4: Cloud Deployment & Live E2E Testing
**Objective:** Move the unified code repository to production-grade cloud servers and prepare production environment variables.

*   **Milestone 4.1: Unified Production Deployment**
    *   Deploy the integrated Next.js application to Vercel's hosting environment.
*   **Milestone 4.2: Secure Environment Configuration**
    *   Input database strings, encryption keys, and third-party API credentials into Vercel's secure server-side environment variables. 
    *   *Audit:* Ensure no sensitive keys (like database passwords or API secrets) are prefixed with `NEXT_PUBLIC_` [11].
*   **Milestone 4.3: Secure Package Installation Configuration**
    *   Configure the local project settings to default to secure installations by disabling post-install scripts during package fetches (`--ignore-scripts`), mitigating NPM dependency supply-chain worms.

---

## Phase 4.5: Enterprise Security Hardening & Vulnerability Shielding
**Objective:** Secure the platform's backend endpoints, sanitize user inputs, apply strict HTTP security headers, and prevent unauthorized data lookups.

*   **Task 4.5.1: Payload CMS Collection-Level Access Controls**
    *   *Implementation:* Hard-code strict access security controls within the collection schemas.
    *   *Target:* Ensure that while the public contact form can submit data (`create: () => true`), only authenticated administrative users with valid session cookies can query, view, edit, or delete leads (`read: ({ req }) => Boolean(req.user)`) [19].
    *   *Files Affected:* `src/collections/Leads.ts`, `src/collections/Users.ts`
*   **Task 4.5.2: Multi-Layered Input Sanitization & XSS Shielding**
    *   *Implementation:* Validate all incoming payloads against Zod validation schemas inside Next.js Server Actions. Strip out hazardous characters, SQL escape sequences, and HTML/script tags before writing to the Neon PostgreSQL database [11b].
    *   *Files Affected:* `src/lib/actions/submitInquiry.ts`
*   **Task 4.5.3: Production HTTP Security Headers Configuration**
    *   *Implementation:* Apply secure headers within `next.config.ts` (or root middleware) to block clickjacking, MIME-sniffing, cross-site scripting (XSS), and session hijacking.
    *   *Headers:* `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
    *   *Files Affected:* `next.config.ts` or `next.config.mjs`
*   **Task 4.5.4: API Route Rate Limiting & Auth Session Cleansing**
    *   *Implementation:* Protect public endpoints like `/api/search` and your contact form Server Action from automated abuse or DDoS attempts by implementing rate limiting [11b]. Ensure that logging out of Payload completely clears the `HttpOnly` secure cookie to prevent session-jacking [10].
    *   *Files Affected:* `src/app/api/search/route.ts`, `src/payload.config.ts`
*   **Task 4.5.5: Secure Package Installation Configuration**
    *   *Implementation:* Configure local project settings to default to secure installations by disabling post-install scripts during package fetches (`--ignore-scripts`), mitigating NPM dependency supply-chain worms [23].
    *   *Files Affected:* `.npmrc` or terminal workflow guidelines

---

## Phase 4.6: Technical SEO & Local Optimization
**Objective:** Empower the client with built-in Google/social preview panels, block domain hijacking, and automate local review generation.

*   **Task 4.6.1: Payload CMS first-party SEO Plugin Integration**
    *   *Implementation:* Install and register `@payloadcms/plugin-seo` inside the global config [2.2].
    *   *CMS Interface:* Inject a visual **SEO Tab** inside the editing interface for both Project and Journal collections, presenting the client with a real-time layout preview showing exactly how their page will appear on **Google Search**, **Facebook**, and **Twitter** [2.2].
    *   *Files Affected:* `src/payload.config.ts`, `src/collections/Projects.ts`, `src/collections/Journal.ts`
*   **Task 4.6.2: Dynamic OpenGraph Branded Card Generation**
    *   *Implementation:* Implement a dynamic open-graph generation pipeline using `@vercel/og` (utilizing Vercel's edge network).
    *   *Behavior:* Generate and serve a custom social-sharing graphic displaying the project's title, material tags, and branding in a high-contrast minimalist layout when shared on social channels.
    *   *Files Affected:* `src/app/(app)/projects/[slug]/opengraph-image.tsx`
*   **Task 4.6.3: Google Business Profile (GBP) Review Link Generator**
    *   *Implementation:* Build a simple administrative utility in the `/admin` dashboard that generates a direct, pre-formatted Google Review shortlink so the architects can easily copy and send this to clients upon project handover to automate 5-star review acquisition [5].
    *   *Files Affected:* `src/payload.config.ts` (custom Admin dashboard view)
*   **Task 4.6.4: Crawl / User-Agent Spoofing Verification**
    *   *Implementation:* Audit all routing configurations and Next.js redirects to ensure no dynamic evaluations are based on the incoming `User-Agent` header, shielding the domain from bot-cloaking and search engine index-hijacking [3, 7].
    *   *Files Affected:* `next.config.ts` or root routing middleware

---

## Phase 4.7: Automated CRM & Pipeline Sync
**Objective:** Convert the website from a standard brochure into an automated sales machine by securely linking submissions directly to the client's existing workflow boards.

*   **Task 4.7.1: Asynchronous Third-Party API Sync Hooks**
    *   *Implementation:* Build asynchronous API connectors inside the submission lifecycle of your contact form Server Action [3.4].
    *   *Behavior:* Initiate an outgoing API call to **Monday.com** or **HubSpot** using their secure REST APIs immediately upon a successful database save [3.4].
    *   *Files Affected:* `src/lib/actions/submitInquiry.ts`
*   **Task 4.7.2: Automated Deal Card Generation**
    *   *Implementation:* Map, format, and push the lead payload to the client's active board, automatically creating a new "Deal Card" or "Lead Contact" with their submitted parameters (Name, Email, Phone, Project Type, Estimated Budget, and Project Address).
*   **Task 4.7.3: Format and Trigger Real-Time Team Alerts**
    *   *Implementation:* Connect a webhook to dispatch a styled JSON payload to their team communications chat (such as Slack or Microsoft Teams) once a lead card is generated, notifying the team of the project details and providing a direct link to the deal card.

---

## Phase 4.8: Legal, Compliance, & Accessibility Sweep
**Objective:** Insulate your client from regulatory privacy fines (GDPR, Australia Privacy Act) and accessibility lawsuits.

*   **Task 4.8.1: Privacy Policy and Stark Cookie Consent Banner**
    *   *Implementation:* Design a minimalist, stark-minimalist cookie consent overlay that respects your design tokens. Ensure analytics scripts only execute *after* the visitor clicks accept [26]. Compile a compliant, plain-language Privacy Policy page [26].
    *   *Files Affected:* `src/components/ui/CookieBanner.tsx`, `src/app/(app)/privacy/page.tsx`
*   **Task 4.8.2: WCAG AA Accessibility Sweep**
    *   *Implementation:* Audit the frontend markup to ensure 100% compliance with accessibility requirements:
        *   All images uploaded in the CMS must require alternate text (`alt` attributes) [26].
        *   Confirm typography colors strictly adhere to contrast-ratio tokens in `ui-context.md` [26].
        *   Verify that custom button outlines support standard keyboard navigation (focus rings) [26].
    *   *Files Affected:* Global CSS, all Page and Component files
*   **Task 4.8.3: UGC DMCA Safe Harbor Protection**
    *   *Implementation:* Add a standard copyright takedown clause to your footer's Terms of Service to shield the firm from third-party image copyright claims on team or project media [22].
    *   *Files Affected:* `src/app/(app)/terms/page.tsx`, `src/components/ui/Footer.tsx`

---

## Phase 4.9: Client Operations Analytics & Performance Monitoring
**Objective:** Provide the client with zero-overhead, privacy-compliant visual metrics on how their portfolio performs.

*   **Task 4.9.1: Lightweight Product Analytics Integration**
    *   *Implementation:* Configure Vercel Web Analytics (or Plausible) inside the Next.js layout.
    *   *Details:* Track high-traffic projects, visitor drop-offs, and contact form clicks in a secure, privacy-first dashboard without slowing down your Lenis smooth scroll or GSAP page transition engines.
    *   *Files Affected:* `src/app/(app)/layout.tsx`

--- 

## Phase 5: Turnkey Handover & Asset Migration
**Objective:** Transition full ownership of the digital infrastructure to the client, providing documentation and offboarding your access.

*   **Milestone 5.1: Infrastructure Account Migration**
    *   Assist the client in establishing their own accounts with the cloud services (Vercel, Neon, Cloudinary, Resend).
    *   Update the production deployment environment to use their direct credentials, shifting all scaling capacities and zero-cost billing options to their control.
*   **Milestone 5.2: Domain Mapping**
    *   Route the client’s custom business domain directly to the live production server.
*   **Milestone 5.3: Core Repository Transfer**
    *   Transfer ownership of the secure GitHub code repository to their corporate account.
*   **Milestone 5.4: Delivery of Handover Documentation**
    *   Deliver a plain-language training PDF detailing how to manage website content, optimize images, utilize the SEO tools, and check internal lead backups.

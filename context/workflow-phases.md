# Full-Stack Integration Map: MGK Architects

This map outlines the complete structural phases required to connect the completed Next.js 16 frontend to a robust, serverless backend powered by Payload CMS v3. Each phase is isolated to prevent code regressions, simplify auditing, and ensure a clean, zero-cost production footprint.

---

## Phase 1: Local Environment & Core CMS Setup
**Objective:** Establish the local CMS framework, wire it directly to your serverless PostgreSQL database, and model the essential data schemas.

*   **Milestone 1.1: Payload v3 Initialization**
    *   Integrate the Payload CMS engine directly into the Next.js App Router.
    *   Configure the local CMS configuration mapping file.
    *   Define the administrative access path (the `/admin` path) handled natively by Next.js.
*   **Milestone 1.2: Serverless Database Mapping**
    *   Configure the native Postgres database adapter.
    *   Connect Payload to the Neon PostgreSQL connection string.
    *   Allow the adapter to automatically generate and maintain SQL tables in Neon.
*   **Milestone 1.3: Data Schema Modeling (Collections)**
    *   Model the `Users` schema for secure administrative login.
    *   Model the `Projects` schema for portfolio items (capturing dates, metadata, and media).
    *   Model the `Journal` schema with dynamic design templates and rich-text configurations.
    *   Model the `Leads` schema as a secure, read-only database backup for contact inquiries.
*   **Milestone 1.4: Cloud Storage Connection**
    *   Configure the cloud storage plugin.
    *   Map media uploads from the CMS interface to Cloudinary.

---

## Phase 2: Frontend Data Hydration & SEO Architecture
**Objective:** Replace static frontend mock templates with live database queries and implement an automated, dynamic search engine optimization system.

*   **Milestone 2.1: Dynamic Content Hydration**
    *   Update Next.js Server Components to fetch content using Payload's Local API.
    *   Ensure all data reads are resolved directly on the server for maximum speed.
    *   Wire the Journal template switcher to render specific React designs based on the CMS selection.
*   **Milestone 2.2: The SEO Plugin & Meta Management**
    *   Integrate the first-party SEO plugin into the global CMS configuration.
    *   Verify that the dynamic "SEO Meta" input fields appear automatically inside the Project and Journal editing panels.
    *   Define fallbacks to automatically generate meta titles and descriptions if left empty by the editor.
*   **Milestone 2.3: Dynamic Metadata Generation**
    *   Implement Next.js dynamic metadata handlers inside the project and journal subroutes.
    *   Configure the handlers to read the CMS SEO meta fields and generate proper OpenGraph, Twitter, and standard HTML meta tags.
*   **Milestone 2.4: Indexing & Crawling Automation**
    *   Set up a programmatic sitemap file to dynamically generate a search engine XML map of all active projects and journals.
    *   Configure a robots rules file to safely expose public content while shielding administrative paths from search engine web crawlers.

---

## Phase 3: The Integration Middleware & CRM Pipeline
**Objective:** Construct a highly secure, automated serverless pipeline that captures public contact form submissions, archives them locally, and pushes them to external business tools.

*   **Milestone 3.1: Server-Side Form Handling**
    *   Develop a secure Next.js Server Action to catch submissions from the public Contact Page.
    *   Implement strict validation schemas to verify all input structures.
    *   Apply strict HTML and script stripping to protect the backend database from cross-site scripting (XSS).
*   **Milestone 3.2: Local Database Logging**
    *   Hook the validated form payload into the CMS `Leads` collection, writing a permanent, secure database backup.
*   **Milestone 3.3: Email Alerts (Resend)**
    *   Connect the Resend transactional email API to the server pipeline.
    *   Configure automated email alerts to immediately notify the architectural team when a new inquiry is registered.
    *   Wrap the mailing trigger in secure handlers to prevent form submittal crashes if an email bounce occurs.
*   **Milestone 3.4: Third-Party CRM Synchronization**
    *   Write asynchronous API integration hooks inside the submission lifecycle.
    *   Map, format, and push the inquiry data directly to external workspaces (such as Monday.com, HubSpot, or Slack) in real-time.


---

## Phase 3.5: Dedicated Frontend Polish & Visual Sweep (The Design Intermission)
**Objective:** Transition your focus from backend logic back to pure visual design, alignment, and responsiveness. Audit and lock in the entire user experience across all devices before pushing the code to production.

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
*   **Milestone 3.5.4: Animation & Transition Audit**
    *   Verify that your GSAP text-splitting and entrance/exit timelines run smoothly without causing visual stuttering or layout clipping during window resizes.

    
---

## Phase 4: Cloud Deployment & Live E2E Testing
**Objective:** Move the unified code repository to production-grade cloud servers and perform end-to-end verification of all visual, content, and data sync flows.

*   **Milestone 4.1: Unified Production Deployment**
    *   Deploy the integrated Next.js application to Vercel's hosting environment.
*   **Milestone 4.2: Secure Environment Configuration**
    *   Input database strings, encryption keys, and third-party API credentials into the secure server-side environment variables.
*   **Milestone 4.3: End-to-End System Auditing**
    *   Create a live administrative user and log in to the production CMS dashboard.
    *   Publish a live project, input metadata inside the CMS SEO tab, and verify that the page renders instantly on the live site with correct search tags.
    *   Submit a mock lead via the public contact form and verify that the inquiry is logged in the CMS, an email notification is delivered, and a CRM deal card is successfully created.

---
# Extension Integration Map: Security, SEO, & CRM Automation

This document outlines the implementation specifications for the final security and commercial automation phases of the MGK Architects platform. These integrations are positioned after the frontend styling sweep and prior to the turnkey handover.

---

## Phase 4.5: Premium SEO & Automated Social Graphics
**Objective:** Empower the client with built-in Google/social preview panels and dynamically generate custom OpenGraph graphics when they publish new content.

*   **Task 4.6.1: Payload CMS first-party SEO Plugin Integration**
    *   *Implementation:* Install and register `@payloadcms/plugin-seo` inside the global config.
    *   *CMS Interface:* This will automatically inject a visual **SEO Tab** inside the editing interface for both Project and Journal collections, presenting the client with a real-time layout preview showing exactly how their page will appear on **Google Search**, **Facebook**, and **Twitter**.
    *   *Files Affected:* `src/payload.config.ts`, `src/collections/Projects.ts`, `src/collections/Journal.ts`
*   **Task 4.6.2: Dynamic OpenGraph Branded Card Generation**
    *   *Implementation:* Implement a dynamic open-graph generation pipeline using `@vercel/og` (utilizing Vercel's edge network).
    *   *Behavior:* When a new project is shared on LinkedIn, X, or Slack, the platform automatically generates and serves a custom social-sharing graphic displaying the project's title, material tags, and branding in a high-contrast minimalist layout.
    *   *Files Affected:* `src/app/(app)/projects/[slug]/opengraph-image.tsx`

---

## Phase 4.6: Automated CRM & Pipeline Sync
**Objective:** Convert the website from a standard brochure into an automated sales machine by securely linking submissions directly to the client's existing workflow boards.

*   **Task 4.7.1: Asynchronous Third-Party API Sync Hooks**
    *   *Implementation:* Build asynchronous API connectors inside the submission lifecycle of your contact form Server Action.
    *   *Behavior:* The exact millisecond a lead is successfully saved to the Neon database, the server initiates an outgoing API call to **Monday.com** or **HubSpot** using their secure REST APIs.
    *   *Files Affected:* `src/lib/actions/submitInquiry.ts`
*   **Task 4.7.2: Automated Deal Card Generation**
    *   *Implementation:* Map, format, and push the lead payload to the client's active board.
    *   *Parameters:* Automatically create a new "Deal Card" or "Lead Contact" on their board, mapping the fields they submitted (e.g., Name, Email, Phone, Project Type, Estimated Budget, and Project Address).
*   **Task 4.7.3: Format and Trigger Real-Time Team Alerts**
    *   *Implementation:* Connect a webhook to dispatch a styled JSON payload to their team communications chat (such as Slack or Microsoft Teams).
    *   *Content:* Send a private notification saying: *"New Project Inquiry Registered — [Client Name] has requested a consultation for [Project Type]. A new card has been automatically generated on your Monday.com board."*

## Phase 4.7: Enterprise Security Hardening & Vulnerability Shielding
**Objective:** Secure the platform's backend endpoints, sanitize user inputs, apply strict HTTP security headers, and prevent unauthorized data lookups.

*   **Task 4.5.1: Payload CMS Collection-Level Access Controls**
    *   *Implementation:* Hard-code strict access security controls within the collection schemas.
    *   *Target:* Ensure that while the public contact form can submit data (`create: () => true`), only authenticated administrative users with valid session cookies can query, view, edit, or delete leads (`read: ({ req }) => Boolean(req.user)`).
    *   *Files Affected:* `src/collections/Leads.ts`, `src/collections/Users.ts`
*   **Task 4.5.2: Multi-Layered Input Sanitization & XSS Shielding**
    *   *Implementation:* Validate all incoming payloads against Zod validation schemas inside Next.js Server Actions. Strip out hazardous characters, SQL escape sequences, and HTML/script tags before writing to the Neon PostgreSQL database.
    *   *Files Affected:* `src/lib/actions/submitInquiry.ts` (or your secure submission Server Action)
*   **Task 4.5.3: Production HTTP Security Headers Configuration**
    *   *Implementation:* Apply secure headers within the `next.config.ts` (or root middleware) to block clickjacking, MIME-sniffing, cross-site scripting (XSS), and session hijacking.
    *   *Headers:* `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
    *   *Files Affected:* `next.config.ts` or `next.config.mjs`
*   **Task 4.5.4: API Route Rate Limiting**
    *   *Implementation:* Protect public endpoints like `/api/search` and your contact form Server Action from automated abuse or DDoS attempts by implementing rate limiting.
    *   *Files Affected:* `src/app/api/search/route.ts`, Next.js middleware

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

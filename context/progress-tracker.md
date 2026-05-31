# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 4: Cloud Deployment & Live E2E Testing**

## Current Goal

- Successfully deploy the unified Next.js + Payload CMS v3 monolith to Vercel, connect production Neon PostgreSQL database, configure Cloudinary cloud storage, configure Resend domain records, and execute end-to-end system validation.

## Completed

- **Phase 1: Local Environment & Core CMS Setup**
  - Provisioned serverless PostgreSQL database on Neon.tech.
  - Initialized Payload CMS v3 with `@payloadcms/db-postgres` and Lexical editors.
  - Organized project into logical Next.js Route Groups: `(app)` for public pages and `(payload)` for `/admin` and native API handlers.
  - Modeled database schemas: `Media`, `Projects` (with vertical sliding restrictions), `Journal` (utilizing static templates), `Team` (staff spotlight), and dynamic `Awards` / `Books` flat tables.
  - Set up dynamic slug generation hooks (`beforeValidate`) and atomic asset purges (`afterDelete` hooks with Cloudinary).
- **Phase 2: Frontend Data Hydration & SEO Architecture**
  - Hydrated dynamic frontend templates (`Projects list`, `Project Detail`, `Journal List`, `Profile Page`, `Homepage Slider`) using Payload's Local API for zero-latency server-rendered pages.
  - Implemented parallel search logic on the `/api/search` route with case-insensitive SQL query mapping.
  - Built programmatic sitemaps and search crawler protection protocols (`robots.txt`).
- **Phase 3: The Integration Middleware & CRM Pipeline**
  - Developed a secure Next.js Server Action (`submitInquiry`) to handle public contact form submissions.
  - Implemented strict Zod schema validation, idempotency state locks on the client, and HTML sanitization.
  - Configured lead archival inside the local `Leads` collection, unified transactional mail dispatch via Resend, and asynchronous integrations for CRM sync.
- **Phase 3.5: Dedicated Frontend Polish & Visual Sweep**
  - Refined desktop/mobile navigation bar layout triggers and Lenis scroll parameters.
  - Implemented an exact layout spacing pattern matching desktop viewport grids, falling back to stacked flex on mobile viewports.
  - Corrected character-clipping issues on split text strings by adding appropriate inline wrappers and paddings.

## In Progress

- **Task 4.1: Deploy Next.js to Vercel (Free Tier)**
  - Preparing configuration settings, mapping build commands, and preparing production environment variables.

## Next Up

- **Task 4.2: Connect Production Databases & Storage**
  - Link the Vercel app to the production Neon PostgreSQL database pool.
  - Install and configure `@payloadcms/plugin-cloud-storage` using your Cloudinary production credentials for lightweight, stateless media management.
- **Task 4.3: Resend Domain Verification**
  - Verify domain names and SPF/DKIM records to permit email dispatch from official addresses.
- **Task 4.4: Live End-to-End System Auditing**
  - Execute real-world UI testing, asset uploads, static template checks, and lead pipeline verifications on the live URL.

## Unresolved Open Questions

- None.

## Architecture Decisions

- **Payload CMS over Custom Admin Panel**: Utilized Payload CMS v3's built-in Admin UI, eliminating custom UI maintenance, security liabilities, and vendor lock-in concerns.
- **Payload Native Auth over Clerk**: Chose Payload's built-in, cookie-based, secure authentication system for `/admin` access, removing the complexity and dependencies associated with third-party auth webhooks.
- **Drizzle-Based Postgres Adapter over Prisma**: Replaced the separate Prisma configuration with Payload's native Postgres database adapter (which manages schema migrations natively), ensuring unified database operations through Payload's type-safe schema definitions.
- **Payload Collection Hooks for File Cleanups**: Configured Cloudinary file deletion to run directly inside Payload collection hooks (e.g., `afterDelete` on the `Leads` or `Media` collection), ensuring Cloudinary files are automatically purged when database records are deleted.
- **Direct Integration Middleware**: Opted to execute lead notification emails (Resend) and CRM pushes (Monday.com/HubSpot) directly inside the Next.js Server Action or a Payload Collection hook, avoiding the need for an external background-task runner.

## Session Notes

- **Date:** June 1, 2026.
- **Workspace Status:** Core logic, schemas, and dynamic elements are complete in the local repository. Beginning transition to production cloud environments.

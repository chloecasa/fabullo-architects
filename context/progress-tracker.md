# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 1: Payload CMS v3 & Local Backend Configuration**

## Current Goal

- Install and configure Payload CMS v3 inside the existing Next.js 16 project, establish the Neon PostgreSQL database connection using the native Payload Postgres adapter, and define the standard schema collections.

## Completed

- **Phase 0: Core Frontend Framework**
  - Coded a highly responsive, custom, split-screen `ContactPage.tsx` with GSAP text-splitting and slide-in entrance animations.
  - Standardized user text inputs (like Email) on the contact form to automatically convert to lowercase.
  - Formulated and locked in global design system tokens inside `globals.css` and `ui-context.md`.
  - Provisioned a serverless PostgreSQL database on Neon.tech.

## In Progress

- Installing Payload CMS v3 dependencies.
- Configuring the database connection in `payload.config.ts`.

## Next Up

- Define Payload collections for `Projects`, `Team`, and `Leads`.
- Connect the frontend portfolio components to read directly from Payload's local API.
- Implement the Next.js Server Action on `ContactPage.tsx` to handle inquiries, save to the CMS `Leads` collection, trigger Resend notifications, and push to the external CRM (Monday.com/HubSpot).

## Unresolved Open Questions

- None.

## Architecture Decisions

- **Payload CMS over Custom Admin Panel**: Scrapped the custom-coded React dashboard in favor of Payload CMS v3's built-in Admin UI, eliminating custom UI maintenance, security liabilities, and vendor lock-in concerns.
- **Payload Native Auth over Clerk**: Chose Payload's built-in, cookie-based, secure authentication system for `/admin` access, removing the complexity and dependencies associated with third-party auth webhooks.
- **Drizzle-Based Postgres Adapter over Prisma**: Replaced the separate Prisma configuration with Payload's native Postgres database adapter (which manages schema migrations natively), ensuring unified database operations through Payload's type-safe schema definitions.
- **Payload Collection Hooks for File Cleanups**: Configured Cloudinary file deletion to run directly inside Payload collection hooks (e.g., `afterDelete` on the `Leads` or `Media` collection), ensuring Cloudinary files are automatically purged when database records are deleted.
- **Direct Integration Middleware**: Opted to execute lead notification emails (Resend) and CRM pushes (Monday.com/HubSpot) directly inside the Next.js Server Action or a Payload Collection hook, avoiding the need for an external background-task runner.

## Session Notes

- **Date:** May 31, 2026.
- **Workspace Status:** Frontend templates are complete and optimized. Database is provisioned on Neon. Starting Payload v3 setup within the main Next.js project.

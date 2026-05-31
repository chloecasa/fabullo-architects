# Architecture Context

## Stack

| Layer                 | Technology                            | Role |
| :---                  | :---                                  | :--- |
| **Framework**         | Next.js (App Router v16) + TypeScript | Handles frontend client-side rendering, routing, page generation, and backend API routing. |
| **UI & Styling**      | Tailwind CSS v4 + PostCSS             | Manages custom utility-first styles and unified layout styling rules. |
| **Animations**        | GSAP, Framer Motion, & Split-Type     | Powers high-end text splitting animations, structural timelines, and reactive entrance/exit layout transitions. |
| **Smooth Scroll**     | Lenis                                 | Governs page scrolling physics to make transitions feel fluid and premium. |
| **CMS Platform**      | Payload CMS v3                        | Handles secure admin user sessions, dynamic portfolio content modeling, and leads database archives. |
| **Authentication**    | Payload Auth (Built-In)               | Secures the `/admin` portal with secure cookie-based session management. |
| **Database ORM**      | Payload Postgres Database Adapter     | Manages dynamic relational PostgreSQL schemas and migrations natively inside Neon from TypeScript configurations. |
| **Database Host**     | PostgreSQL (Neon.tech)                | Serves as our serverless, relational database (utilizing Neon Connection Pooling) for all projects, journals, and leads. |
| **File Storage**      | Cloudinary                            | Hosts high-resolution portfolio images (optimized as WebP) and any administrative assets. |
| **Mailing Engine**    | Resend                                | Connects securely to our transactional email API to deliver subscriber notifications and lead alerts. |

## System Boundaries

- `src/app/` — Houses public page routing (portfolio, journal, contact) and the dynamic Payload CMS routing (under `/admin`).
- `src/components/` — Holds reusable UI elements, split-screen layouts, and custom header assets.
- `src/lib/` — Contains initialized third-party API clients, including the local Payload configuration, Resend client, and Cloudinary connectors.
- `context/` — Located at the project root; strictly stores your 6-file architecture rules, progress trackers, and feature specifications.
- `public/` — Located at the project root; holds all **Static Assets** (logos, fallback icons) served directly to the browser.

## Storage Model

- **Neon PostgreSQL (Relational Database)**: Stores highly structured, relational **Metadata**, schemas, ownership records, and transactional logs. This includes Payload's system tables, projects, journals, and lead inquiry logs.
- **Cloudinary (Object Storage)**: Hosts all heavy, unstructured physical files and media assets. This includes high-resolution portfolio photographs (automatically compressed into `.webp` format on upload).

## Auth and Access Model

- **Authentication**: All administrative staff must sign in securely to the CMS using Payload’s built-in session authentication at `/admin`.
- **Access Control**: Strict role-based access rules are written directly into Payload collection configurations (e.g., the `Leads` collection is configure so that only authenticated admin users can read entries, while the public can only write to it via the contact form).
- **Resource Ownership (CMS & CRM)**: All portfolio projects, journal entries, and archived leads are system-wide resources. Only verified, authenticated administrators logged into Payload are authorized to perform **CRUD (Create, Read, Update, Delete)** operations.

## Invariants

1. **Integrated Hook Lifecycles**: Multi-service integrations (such as notifying Resend of a new lead or sending lead metrics to HubSpot) must run asynchronously inside the Next.js Server Action or a Payload Collection Hook, avoiding extra external hosting platforms.
2. **No Orphaned Cloud Assets**: Deletion of any database record containing cloud-hosted files (such as deleting a project containing images) must execute a secure API delete call to Cloudinary via Payload's `afterDelete` hooks *before* the database row is deleted, ensuring no dead file assets are left draining storage limits.
3. **Strict Input Sanitization**: The backend must programmatically sanitize, filter, and strip out all HTML/JavaScript tags from every standard user text input before writing them to PostgreSQL.
4. **Zero-Leak Environmental Variables**: Sensitive private API keys, database connection strings, and third-party credentials (like Cloudinary secrets and Resend keys) must reside strictly on the server-side environment and must never be exposed to the client-side code via `NEXT_PUBLIC_` prefixes.
5. **API & Server Action Self-Protection**: Every backend API route and Server Action must independently verify the user's active administrative session before executing any database changes.

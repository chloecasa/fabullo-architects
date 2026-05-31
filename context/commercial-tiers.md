# Commercial Tiers & Productization Plan

## Strategy Overview

MGK Architects is designed not just as a single-use website, but as a reusable, highly modular **Productized Service** boilerplate. The codebase is architected using **Loose Coupling** principles, allowing the developer to package, license, and sell the system across four distinct commercial tiers. To preserve the value and reusability of this template, all future code additions must strictly follow these modular boundaries.

---

## The 4 Commercial Tiers

### Tier 1: The Public Brochure Site
- **Target Audience:** Low-budget firms who only want a stunning, fast, and animated web presence.
- **Features Included:** Public portfolio grid, individual project pages (with material tagging), design journals, and basic fallback contact form.
- **Hosting Environment:** Vercel (Free Tier).
- **Backend / DB Cost:** $0/month (no active database queries required for static rendering).
- **Downgrade Process:** Delete the `/src/app/admin/` routes and Payload configuration, and use standard static JSON structures to hydrate the frontend portfolio.

### Tier 2: The Static CMS
- **Target Audience:** Mid-range firms who want to manage their own portfolio and blog without code.
- **Features Included:** Tier 1 + Secure Admin Login (`/admin` via Payload) + Portfolio CMS + Journal CMS + Audience Subscriber List (with CSV Export).
- **Hosting Environment:** Vercel (Free) + Neon.tech PostgreSQL (Free Scale-to-Zero tier) + Cloudinary (Free Tier).
- **Backend / DB Cost:** $0/month.
- **Downgrade Process:** Omit the automated CRM integrations and Resend mailer configuration, keeping the Leads collection strictly as an in-CMS database log.

### Tier 3: The Integrated Lead Machine (The CRM Connector)
- **Target Audience:** High-ticket firms who want seamless lead capturing that integrates directly with their existing tools (Monday.com, HubSpot, Slack) without managing a custom database platform.
- **Features Included:** Tier 2 + Contact Form + Automation Pipeline (Instantly logs lead to CMS backup, triggers Resend notifications, and injects clean lead cards directly into Monday.com or HubSpot).
- **Hosting Environment:** Vercel (Free) + Neon (Free) + Cloudinary (Free) + Resend (Free).
- **Backend / DB Cost:** $0/month.
- **Downgrade Process:** Comment out or delete the specific external API sync modules in the Next.js Server Action or Payload hooks.

### Tier 4: The Enterprise Automation Suite
- **Target Audience:** Enterprise/Prestige firms who want the full suite of automation.
- **Features Included:** Tier 3 + Automated Client Alerts (automatic transactional emails dispatched to subscribers whenever a new project is published) + Vercel Cron scheduled automated data cleanups.
- **Hosting Environment:** Vercel (Free) + Neon (Free) + Cloudinary (Free) + Resend (Free).
- **Monthly Cost:** $0/month (leveraging cloud free-tiers).

---

## Architectural Rules for Loose Coupling

To ensure features can be added or removed in seconds, the AI agent must strictly follow these three decoupling rules:

### Rule 1: Schema Isolation
- CMS Collections (`projects`, `journals`) must remain completely independent of CRM/Lead collections (`leads`).
- Never create direct relational constraints in code between a public CMS project and a private CRM lead. If you must associate them, store the association as a raw, nullable text field (like `project_slug`) to prevent schema breaking when leads are purged.

### Rule 2: Server Action Separation
- All Next.js Server Actions must be strictly single-purpose.
- Keep frontend contact form submission functions separate from CMS administration functions. They must reside in separate folders and execute independently.

### Rule 3: Frontend Conditional Import Guards
- Public pages must be designed so that dynamic data hooks can fall back to mock data or static JSON in seconds if the CMS connection is removed.
- Always use standard props or conditional rendering blocks so that transitions between Tier 1 (Static) and Tier 2 (CMS-enabled) require minimal code modifications.

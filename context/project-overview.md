# MGK Architects

## Overview

MGK Architects is a custom full-stack web platform and lead-generation CRM built specifically for high-end architectural firms. The system solves the technical unfamiliarity of backend databases for creative, non-technical architects by utilizing **Payload CMS v3**. 

Instead of building a high-overhead, proprietary custom dashboard, the platform integrates a beautifully styled, high-performance Next.js/GSAP frontend with Payload’s native `/admin` workspace. This setup allows the architects to manage their high-resolution portfolio grids, edit rich-text journals, and securely monitor incoming contact inquiries. When a lead is captured, our lightweight backend middleware automatically backs up the lead inside the local database, notifies the client via Resend, and injects the details directly into the workflow tools they already use (such as Monday.com, HubSpot, or Slack), ensuring absolute operational efficiency.

## Goals

1. **Bespoke Content Control (CMS):** Empower non-technical architects to fully manage public-facing content—including high-resolution portfolio grids, rich-text journals, and SEO metadata—through a native Payload administrative interface, completely eliminating any reliance on developers for day-to-day website updates.
2. **Seamless Workflow Integration:** Intercept incoming leads from the contact form, back them up in a secure internal database, and inject them directly into their active project management environments (Monday.com/HubSpot/Slack) in real-time.
3. **Zero-Maintenance Performance:** Build the entire platform within a single, unified Next.js codebase, leveraging highly optimized serverless configurations (Vercel + Neon + Cloudinary) to run completely free of monthly maintenance costs or software license overheads.

## Core User Flow

1. **Portfolio Browsing:** A public visitor lands on the website. They browse high-resolution portfolio grids and read design journals, populated dynamically from the PostgreSQL database using Payload's zero-latency Local API.
2. **Inquiry Submission:** The visitor navigates to the custom split-screen Contact Page and completes the validated inquiry form (submitting their Name, Email, Phone, Project Type, Project Address, and Description).
3. **Data Interception (Server Action):** On submit, a secure Next.js Server Action captures the payload, validates it using Zod, and strips all hazardous HTML or script tags.
4. **Internal Database Log:** The Server Action writes a new row to the Payload `Leads` collection as a secure local database archive.
5. **Client Notification (Resend):** The server dispatches an automated, styled email notification to the architects containing the complete inquiry parameters.
6. **CRM Integration:** The server immediately executes an asynchronous API push, injecting the lead details directly into the client's preferred business systems (such as creating a new card on their active Monday.com board, logging it in HubSpot, or posting a formatted alert to Slack).
7. **Success Feedback:** The visitor is shown a polished success transition on the contact page.
8. **Secure Admin Access:** The architect accesses `/admin` on their own domain, signing in securely via Payload’s built-in session authentication.
9. **Content Control:** The architect creates new projects, edits material tags, writes journals, and reviews the backup lead logs through a unified, white-labeled dashboard.
10. **Automated Media Cleanups:** When the architect deletes a portfolio item or a lead from the CMS, a Payload collection hook automatically triggers a Cloudinary API call, removing the associated images and preventing orphaned asset leaks.

## Features

### Category 1: Public Website (Frontend)

- **Interactive Hero & Portfolio Grid:** A visually polished gallery of completed works, filterable by category (Residential vs. Commercial) using GSAP animations.
- **Project Template Page (Material Tagged):** Individual project pages displaying dynamic image sliders, design narratives, and an organized list of premium materials used.
- **Journal Grid & Template:** A clean, chronological grid of design updates and rich-text articles with visual layouts controlled dynamically via a Template Picker in the CMS.
- **Optimized Split-Screen Contact Page:** A minimalist contact page that splits the viewport between an architectural photograph and a highly interactive, validated, and secure inquiry form.

### Category 2: Admin CMS & Integration Pipeline (Backend)

- **Secure White-Labeled Admin Panel:** A secure login portal at `/admin` utilizing Payload’s native authentication, completely styled with the firm's branding.
- **Bespoke Portfolio CMS:** An intuitive dashboard to manage projects (complete with material tags, high-res galleries, and SEO metadata fields). Large image uploads are optimized on the client-side into lightweight WebP formats before saving to Cloudinary.
- **Rich-Text Journal Editor:** A modern, visual rich-text editor (using Payload’s native Lexical editor) to draft, schedule, and publish design journals.
- **Centralized Leads Backup:** A secure, read-only collection inside Payload storing a local chronological log of all contact form inquiries for audit and recovery.
- **Instant CRM Sync Middleware:** An integrated backend handler that automatically maps, formats, and pushes contact inquiries directly to external enterprise systems (Monday.com, HubSpot, or Slack) immediately upon submission.
- **Automated Client Alerts:** An automated email trigger (using Resend) that alerts the administrative team the exact moment a new inquiry is logged on the website.
- **Atomic Asset purges**: A Payload database hook that automatically triggers a Cloudinary deletion API call whenever media files or dynamic portfolio pages are removed from the CMS, preventing orphaned cloud storage leaks.

## Scope

### In Scope

- **High-Performance Public Frontend:** A minimalist, fast public portfolio, dynamic design journal, and contact page built with Next.js, React, Tailwind CSS, and optimized GSAP transitions.
- **Seamless CMS Admin Portal:** A white-labeled Payload CMS panel to manage dynamic website content and view backup lead data.
- **Data Integration Pipeline:** A Next.js Server Action that captures lead form entries, writes them to the local database, fires Resend notifications, and pushes cards to Monday.com or HubSpot.
- **Secure Native Session Authentication:** A robust cookie-based authorization system restricting `/admin` access strictly to verified partners.
- **Client-Side Image Compression:** An on-upload compression pipeline that converts large portfolio images to WebP before uploading to Cloudinary.
- **Automated Cloud Purges:** Payload collection hooks that automatically delete assets from Cloudinary when records are deleted.
- **Input Sanitization & Protection:** Automatic stripping of HTML/script tags from incoming forms to prevent XSS.

### Out of Scope

- **Custom-Built Database Dashboards:** We are not coding a custom React administrative dashboard from scratch; all admin interfaces use Payload’s native system.
- **Dynamic Onboarding PDF Generators:** The survey popup and dynamic PDF generation are omitted, relying instead on clean, standardized contact details routed to their CRM.
- **Bulk Email Campaigns:** We do not build an in-site marketing newsletter campaign manager; mailing lists are managed directly in the client's external CRMs.
- **Invoicing or Payments:** The CRM integrations do not process financial transactions or invoices.

## Success Criteria

1. **Zero-Latency Content Rendering:** Public portfolio grids and dynamic journal pages fetch and render data from the Neon database in under 200ms using Payload's Local API.
2. **Zero-Maintenance Overhead:** The entire platform deploys as a single Next.js project on Vercel, functioning flawlessly on free-tier infrastructure (Vercel, Neon, Cloudinary, Resend) with zero recurring monthly platform fees.
3. **Flawless CRM Synchronization:** Submitting the contact form successfully creates a permanent, local read-only backup record in Payload and instantly maps and injects that lead data directly onto the client's external Monday.com board or HubSpot contact index.
4. **Automated Asset Integrity:** Deleting a dynamic project page with images successfully fires active API hooks that delete the physical assets from Cloudinary, maintaining a clean cloud storage footprint.
5. **Robust Security and Shielding:** Unauthenticated users are strictly blocked from accessing `/admin` pages, and any input containing hazardous script tags is automatically sanitized before being written to the database.

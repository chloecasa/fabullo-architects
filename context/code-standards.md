# Code Standards

## General

- **Single-Purpose Modules**: Keep files and modules small and single-purpose. Separate UI rendering, database querying, and external integration handlers into independent files.
- **Root Cause Resolution**: Never layer superficial workarounds; resolve root issues directly in schemas, configurations, or helper utilities.
- **Separation of Concerns**: Do not mix unrelated tasks (such as data fetching, validation, and UI rendering) inside a single page or component.
- **Idempotency & Button Locking**: Every frontend form must implement strict **Idempotency** to prevent duplicate database submissions. All submit buttons must be disabled immediately upon submission using React's `isPending` state or loading variables until the transaction completes.

## TypeScript & Schema Validation

- **Strict Type-Safety**: Enforce strict mode across all configuration files (`tsconfig.json`).
- **No Implicit Any**: Avoid using the `any` type under any circumstances. Use explicit interfaces, types, or generic parameters.
- **Mandatory Schema Validation (Zod)**: All external inputs (such as incoming contact form payloads, Server Action arguments, or API submissions) must be validated and parsed using **Schema Validation (Zod)** before any logic runs.
- **Type Inference**: Leverage Zod's `z.infer` to dynamically generate TypeScript types from schemas, avoiding duplicate manual interface declarations.

## Next.js (Server Components, Actions & Hooks)

- **Default to Server Components**: Keep layouts and pages as Node.js Server Components to minimize client-side bundle sizes.
- **Minimal Browser Interactivity**: Only add the `"use client"` directive when a component requires browser-side states, events (like `onClick` or `onChange`), or GSAP animations.
- **Server Actions for Form Submissions**: Use Next.js **Server Actions** (secured with `"use server"`) to handle the contact form submissions, saving data to the Payload CMS database, and triggering integrations.
- **Payload CMS Local API**: When querying content (such as projects or journals) within server-rendered pages, strictly use Payload's **Local API** (`getPayload`) to read directly from the database, eliminating network latency.
- **Explicit Cache Revalidation**: Every Server Action that modifies database data must execute Next.js's built-in **Cache Revalidation (`revalidatePath` or `revalidateTag`)** before returning, ensuring the browser clears stale router caches and displays fresh data immediately.
- **Structured Action Responses**: Server Actions must never throw raw, uncaught errors directly to the client. All actions must return a standardized, serializable JSON payload (e.g., `{ success: true, data: ... }` on success, or `{ success: false, error: "Friendly message" }` on failure) so the UI can handle errors gracefully.

## Styling & Formatting

- **Token-Strict Styling**: Use only Tailwind utility classes that reference custom properties defined in `ui-context.md`. Never write raw, hardcoded hex values (like `text-[#d6d3d1]`) inside component files.
- **Border Radius Scale**: Enforce razor-sharp boundaries (`rounded-none`) on all public frontend assets as defined in `ui-context.md`.
- **Prettier Code Formatting**: All code files must strictly adhere to our formatting rules: 2-space indentation, double quotes, and mandatory semicolons.

## API & Action Security

- **Context-Aware Sanitization**: 
  - For standard fields (Name, Email, Phone), the backend must completely strip all HTML/Script tags to prevent Cross-Site Scripting (XSS).
  - For rich-text CMS fields (Journal bodies), ensure the CMS is configured to safely output sanitized rich text, shielding the frontend from malicious script injection.
- **Inline Authorization Check**: Every API Route, Payload Collection Hook, and Server Action must independently verify user authentication and access controls before executing database changes.
- **Strict Error Shielding**: All backend operations must be wrapped in `try/catch` blocks. The system must log the raw, detailed error securely on the server-side console for debugging, but return a generic, non-disclosing message (such as "An unexpected error occurred") to the browser to prevent system mapping.
- **Predictable Response Shapes**: Always return consistent JSON response structures (e.g., returning `{ success: true, data: ... }` on success, or `{ success: false, error: ... }` on failure with matching HTTP status codes).

## Data and Storage

- **Metadata Isolation**: Structured relational records (like projects, journals, and leads) reside strictly in the PostgreSQL database.
- **Object Blob Storage**: Unstructured heavy files (such as high-res portfolio images and uploaded documents) belong strictly in Cloudinary, storing only their secure URLs in the database.
- **On-Upload Image Compression**: All portfolio images must be compressed and optimized into `.webp` format on the client-side *before* triggering the upload to Cloudinary.

## File Organization

- `src/app/` — Houses Next.js pages, layouts, and Payload's administrative route mappings.
- `src/components/` — Holds reusable UI elements, split-screen layouts, and custom headers.
- `src/lib/` — Contains database and third-party API configurations (Payload initialization, Resend client, and Cloudinary).

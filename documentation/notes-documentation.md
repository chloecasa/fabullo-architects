# MGK Architects: Deployment & Configuration Notes (Sanity + Resend)

The platform now uses only two third-party services:

- **Sanity** for all content (projects, team, awards, books, images) and the editing studio.
- **Resend** for contact form emails.

Payload CMS, Neon (Postgres) and Cloudinary are no longer used.

---

## 1. Migration plan: Payload to Sanity

Work on a branch (`git checkout -b chore/sanity`). Keep Neon and Cloudinary untouched until the new site has been tested live, so you can roll back.

### Step 1: Create the Sanity project
1. Create a free account at https://www.sanity.io and run `npm create sanity@latest` (or create a project in the dashboard).
2. Note the **Project ID** and the **dataset** name (usually `production`).
3. In the Sanity dashboard go to **API > CORS origins** and add:
   - `http://localhost:3000`
   - your production domain (for example `https://mgk-architects.vercel.app`)
   - allow credentials for both, because the Studio runs inside your site.

### Step 2: Install and remove packages
```bash
npm install next-sanity @sanity/image-url sanity @sanity/vision
npm uninstall payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/storage-cloudinary
```
Remove any other `@payloadcms/*` or `drizzle` / `pg` packages that appear in `package.json` and are no longer used.

### Step 3: Add the Sanity files
```
sanity.config.ts            // studio config (projectId, dataset, schema types)
src/sanity/schemaTypes/     // one file per content type, plus index.ts
src/sanity/lib/client.ts    // createClient from next-sanity
src/sanity/lib/image.ts     // urlFor() helper from @sanity/image-url
src/app/studio/[[...tool]]/page.tsx   // the editing studio, served at /studio
```
The studio replaces Payload's `/admin`. Editors log in at `/studio` with their Sanity account.

### Step 4: Map the Payload collections to Sanity types

| Payload collection | Sanity type | Notes |
| :--- | :--- | :--- |
| `Media` | none (built in) | Sanity stores images as assets. Use `image` fields. |
| `Projects` | `project` | Fields: title, slug, year, credits, consultants, team, heroImg, slides, verticalImages, horizontalGallery. |
| `Team` | `teamMember` | Fields: name, image, description, order. |
| `Awards`, `Books` | `award`, `book` | Simple documents. |
| `Leads` | removed | Inquiries are only emailed through Resend. |
| `Journal` | removed | Journal was deleted from the site. |

Tips for the `project` schema:
- Use `slug` fields with `source: 'title'`.
- Use arrays of `image` for `verticalImages` and `horizontalGallery`. Turn on `options: { hotspot: true }`.
- Keep slide captions as an array of `text` fields, in the same order as `verticalImages`.

### Step 5: Move the content
1. **Export from Payload.** While Payload still runs locally, fetch each collection as JSON (for example `http://localhost:3000/api/projects?limit=1000&depth=1`) and save the files.
2. **Convert to Sanity documents.** Write a small Node script that, for each project:
   - uploads every image from its Cloudinary URL with `client.assets.upload('image', await fetch(url))`
   - creates the document with `client.create({ _type: 'project', ... })`
3. Run the script once against a **test dataset** first, check it in `/studio`, then run it against `production`.
4. If you have only a few projects, entering them by hand in the studio is also fine.

### Step 6: Replace the Payload queries in the code
Every `payload.find(...)` becomes a GROQ query with `client.fetch(...)`.

Example (projects list):
```ts
import { client } from '@/sanity/lib/client';

const projects = await client.fetch(
  `*[_type == "project"] | order(year desc) {
    _id, title, "slug": slug.current, year,
    "heroImg": heroImg.asset->url
  }`
);
```

Project detail page:
```ts
const project = await client.fetch(
  `*[_type == "project" && slug.current == $slug][0] {
    title, year, credits, consultants, team, slides,
    "heroImg": heroImg.asset->url,
    "verticalImages": verticalImages[].asset->url,
    "horizontalGallery": horizontalGallery[].asset->url
  }`,
  { slug }
);
```
Keep the shape the same as the existing `ProjectData` type, so `ProjectDetailView` needs no changes.

### Step 7: Search route
`src/app/api/search/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const results = await client.fetch(
    `*[_type == "project" && title match $term][0...5] {
      "id": _id,
      title,
      "type": "PROJECT",
      "slug": "/projects/" + slug.current,
      "img": heroImg.asset->url
    }`,
    { term: `${q}*` }
  );

  return NextResponse.json({ results });
}
```

### Step 8: Contact form (Resend only)
In the server action that handles the contact form (`submitInquiry`):
- remove the code that saved the lead to Payload / Neon
- keep the `resend.emails.send(...)` call
- keep any Monday.com, HubSpot or Slack hooks if you still use them

### Step 9: Remove Payload from the project
- Delete `src/payload.config.ts`, `src/collections/`, `src/app/(payload)/`, and `payload-types.ts`.
- In `next.config.*`, remove the `withPayload(...)` wrapper.
- Delete migration files in `src/migrations` (if any).
- In `next.config.*` image settings, replace `res.cloudinary.com` with `cdn.sanity.io`.
- Remove Payload scripts from `package.json` (`generate:types`, `generate:importmap`, `payload`).

### Step 10: Update content automatically (revalidation)
So editors see changes on the live site without a redeploy:
1. Add an `/api/revalidate` route that checks a secret and calls `revalidatePath` (or `revalidateTag`).
2. In the Sanity dashboard go to **API > Webhooks** and create a webhook to `https://<your-domain>/api/revalidate` with the same secret.

### Step 11: Test, then go live
```bash
npm run build
npx tsc --noEmit
```
Test on a Vercel **preview** deployment: project pages, menu search, `/studio` login, contact form email. Merge to `main` only when everything works.

---

## 2. Resend email custom domain verification

By default, the platform runs in **Onboarding Mode**, which restricts email dispatches to the developer/admin account. To send branded emails from an official address (for example `studio@mgkarchitects.com.au`):

### Step 1: Register the domain in Resend
1. Log into your Resend dashboard (https://resend.com).
2. Click **Domains** in the left sidebar.
3. Click **Add Domain**.
4. Enter your custom domain (for example `mgkarchitects.com.au`), choose a region, and click **Add**.

### Step 2: Configure DNS settings
Resend generates DNS records proving domain ownership. Enter exactly what Resend shows into your domain registrar (Cloudflare, GoDaddy, Namecheap and so on). Typical records:

- Type `CNAME` or `TXT`, Name `resend._domainkey` (DKIM)
- SPF and return-path records, if shown

Use the values from your Resend dashboard and do not type them by hand from this document, because the names and values can differ per account.

### Step 3: Verify and update environment variables
1. Click **Verify** in Resend. DNS changes can take 2 to 30 minutes.
2. In **Vercel > Settings > Environment Variables**, update the sender / `NOTIFICATION_EMAIL` to use the verified domain.

---

## 3. Production environment variables

Set these in Vercel for **Production** (and Preview, so previews work).

| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project | `abc123de` |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API date | `2025-01-01` |
| `SANITY_API_READ_TOKEN` | Only needed for drafts / private datasets | *(from Sanity > API > Tokens)* |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the revalidate webhook | *(long random string)* |
| `NEXT_PUBLIC_SERVER_URL` | Public production URL | `https://mgk-architects.vercel.app` |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `NOTIFICATION_EMAIL` | Where inquiries are sent | `studio@mgkarchitects.com.au` |

**No longer needed (remove after the new site is live and verified):**
`DATABASE_URL`, `DATABASE_URI`, `PAYLOAD_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Never commit real keys, tokens or personal email addresses to the repository. Keep them only in `.env.local` and Vercel.

---

## 4. Troubleshooting

### A. Vercel Hobby plan: "Blocked" deployments
On the Hobby (free) plan, deployments of a private repository are blocked if the Git commit author's email does not match the email of the GitHub account that owns the Vercel project.

- **Symptom:** a red `Blocked` badge next to the deployment.
- **Fix:** set your Git identity to match, then commit again:
  ```bash
  git config user.email "your-github-email@example.com"
  git config user.name "your-github-username"
  ```
  To fix only the latest commit that has not been shared:
  ```bash
  git commit --amend --reset-author --no-edit
  git push
  ```
  Use `--force` only on your own branch that nobody else uses, and never on `main` unless you are sure.

### B. Studio or site cannot load content
- Check the project ID and dataset env vars in Vercel.
- Check **API > CORS origins** in Sanity includes the exact domain, with credentials allowed.
- Images not showing: check `cdn.sanity.io` is in the Next.js image settings.

### C. Content changes not appearing on the live site
- Check the Sanity webhook delivery log (API > Webhooks).
- Check `SANITY_REVALIDATE_SECRET` is the same in Sanity and Vercel.

### D. Contact form emails not arriving
- In Onboarding Mode, Resend only delivers to the account owner. Verify your domain (section 2).
- Check the Resend dashboard logs for errors.

---

## 5. Cleanup checklist (after the new site is live)

- [ ] Content checked in `/studio` and on the live site
- [ ] Contact form tested, email received
- [ ] Old env vars removed from Vercel
- [ ] Payload files and packages removed from the repo
- [ ] Neon database backed up, then deleted
- [ ] Cloudinary images backed up, then the account removed

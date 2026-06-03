# MGK Architects — Production Deployment & Configuration Notes

This document contains critical instructions and troubleshooting notes compiled during the Phase 4 deployment process. It outlines how to manage, scale, and finalize the platform's third-party integrations once the project is transferred or launched.

---

## 1. Resend Email Custom Domain Verification

By default, the platform runs in **Onboarding Mode**, which restricts email dispatches exclusively to the developer/admin account (`illustrado669@gmail.com`). To allow the contact form to dispatch branded emails from an official address (e.g., `studio@mgkarchitects.com.au`), execute the following steps:

### Step 1: Register the Domain in Resend
1. Log into your [Resend Dashboard](https://resend.com).
2. Click on **Domains** in the left sidebar.
3. Click **"Add Domain"**.
4. Enter your custom domain (e.g., `mgkarchitects.com.au`) and select your regional endpoint. Click **Add**.

### Step 2: Configure DNS Settings
Resend will generate **3 CNAME records** (DKIM keys) proving domain ownership. You must input these into your Domain Registrar (e.g., Cloudflare, GoDaddy, Namecheap):

* **Record 1:** Type: `CNAME` | Name: `resend1._domainkey` | Value: *[Copy from Resend]*
* **Record 2:** Type: `CNAME` | Name: `resend2._domainkey` | Value: *[Copy from Resend]*
* **Record 3:** Type: `CNAME` | Name: `resend3._domainkey` | Value: *[Copy from Resend]*

### Step 3: Verify and Update Environment Variables
1. Click **"Verify"** in Resend. (DNS propagation may take between 2 to 30 minutes).
2. Once verified, go to your **Vercel Settings > Environment Variables** and update your **`NOTIFICATION_EMAIL`** or senders to use your newly verified branded domain.

---

## 2. Production Environment Variables Reference

Ensure these variables are correctly set in your Vercel Production Environment Settings. Note that **both** `DATABASE_URL` and `DATABASE_URI` must be defined to prevent compile-time database fallback errors.

| Variable Name | Role / Purpose | Format Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Pooled Neon Connection String (Next.js & Drizzle) | `postgresql://user:password@host-pool.neon.tech/neondb?sslmode=require` |
| `DATABASE_URI` | Standard Payload Database Target | `postgresql://user:password@host-pool.neon.tech/neondb?sslmode=require` |
| `PAYLOAD_SECRET` | Cryptographic key used to sign secure session cookies | *[64-character random alphanumeric string]* |
| `NEXT_PUBLIC_SERVER_URL` | Your public production domain | `https://mgk-architects.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Product Environment identifier | *[Alphanumeric Cloud Name]* |
| `CLOUDINARY_API_KEY` | Cloudinary credentials access key | *[15-digit numeric key]* |
| `CLOUDINARY_API_SECRET` | Cloudinary cryptographic secret key | *[Cloudinary Secret String]* |
| `RESEND_API_KEY` | Resend Transactional Mail Engine API Key | `re_FdvfGmpm_...` |

---

## 3. Troubleshooting & Deployment Insights (Phase 4 Audits)

### A. Vercel Hobby Plan Author Blocking Rule
On Vercel's Hobby (Free) Plan, private repository deployments will be **"Blocked"** if the local Git commit author's email does not match the Vercel project owner's connected GitHub email. 
* **The Error:** A red `Blocked` badge next to the deployment on the Vercel dashboard.
* **The Fix:** Ensure your local Git identity matches the owner of the GitHub repository before committing:
  ```bash
  git config user.email "your-github-email@example.com"
  git config user.name "chloecasanoba-art"
  git commit --amend --reset-author --no-edit
  git push origin main --force

### B. Fallback Database Crash (127.0.0.1:5432)
The Error: ERROR: cannot connect to Postgres. Details: connect ECONNREFUSED 127.0.0.1:5432 during static page prerendering.
The Cause: Occurs if Vercel is missing the correct environment variable name, causing Payload CMS to fall back to the localhost address.
The Fix: Ensure both DATABASE_URL and DATABASE_URI are fully populated inside Vercel's Production settings (not scoped solely to Development).
code
Code
---

### Next Action: Live System Audit
Once you have created and saved this file locally, please proceed with your **live contact form test** on `https://mgk-architects.vercel.app`.

Please submit a test inquiry and check:
1.  **`/admin`** (to verify the Lead is stored in your Neon DB [3.2]).
2.  **Your email inbox** (to verify the Resend alert works [3.3]).

Let me know the results of your test!

// src/app/(studio)/layout.tsx
// The studio has its own layout, so the site header and footer do not appear in it.
export const metadata = { title: 'Fabullo Studio' };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

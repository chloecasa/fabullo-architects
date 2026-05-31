// src/collections/Media.ts
import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media', // Where files are saved locally during development
    mimeTypes: ['image/*'],    // Restrict uploads strictly to images (prevents CAD/Zip files here)
  },
  access: {
    read: () => true, // Anyone can view the portfolio images
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text is critical for organic SEO and screen-reader accessibility.',
      },
    },
  ],
};

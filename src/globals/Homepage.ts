// src/globals/Homepage.ts
import { GlobalConfig } from 'payload';

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Settings',
  access: {
    read: () => true, // Anyone can fetch the homepage featured data
  },
  fields: [
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects', // Link directly to the Projects collection
      hasMany: true,          // Allow selecting multiple projects [1]
      minRows: 4,             // Force exactly 4 items [1]
      maxRows: 4,             // Block creating a 5th item [1]
      required: true,
      admin: {
        description: 'Search, select, and arrange exactly 4 projects to feature in the homepage horizontal slider.',
      },
    },
  ],
};

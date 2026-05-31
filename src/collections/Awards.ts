// src/collections/Awards.ts
import { CollectionConfig } from 'payload';

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'recognition', // Displays the accolade name in the CMS list view
    defaultColumns: ['year', 'recognition', 'project'], // Customize columns in the dashboard
  },
  access: {
    read: () => true, // Anyone can view the awards list
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., 2025',
      },
    },
    {
      name: 'recognition',
      type: 'text',
      required: true,
      label: 'Recognition Detail',
      admin: {
        placeholder: 'e.g., TIDA HOMES RUNNER UP NEW HOME OF THE YEAR',
      },
    },
    {
      name: 'project',
      type: 'text',
      required: true,
      label: 'Associated Project',
      admin: {
        placeholder: 'e.g., FOREVER HOUSE',
      },
    },
  ],
};

// src/collections/Books.ts
import { CollectionConfig } from 'payload';

export const Books: CollectionConfig = {
  slug: 'books',
  admin: {
    useAsTitle: 'recognition',
    defaultColumns: ['year', 'recognition', 'project'],
  },
  access: {
    read: () => true, // Anyone can view the book publications list
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
      label: 'Publication Detail',
      admin: {
        placeholder: 'e.g., AS FEATURED IN ISSUE NO. 15',
      },
    },
    {
      name: 'project',
      type: 'text',
      required: true,
      label: 'Name of Book / Project',
      admin: {
        placeholder: 'e.g., THE LOCAL PROJECT / FOREVER HOUSE',
      },
    },
  ],
};

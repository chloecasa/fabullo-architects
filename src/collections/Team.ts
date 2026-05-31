// src/collections/Team.ts
import { CollectionConfig } from 'payload';

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name', // Shows the staff name in the CMS list view
    defaultColumns: ['name', 'image', 'sortOrder'], // Customize columns inside the dashboard
  },
  access: {
    read: () => true, // Anyone can view the team profiles on the public site
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., K., MICHAEL G.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media', // Links portrait directly to your Media collection
      required: true,
      label: 'Staff Portrait',
    },
    {
      name: 'desc',
      type: 'textarea',
      required: true,
      label: 'Role & Description',
      admin: {
        description: 'Input the role and description in uppercase (e.g., PRINCIPAL ARCHITECT WITH OVER 20 YEARS OF EXPERIENCE).',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers display first.',
      },
    },
  ],
};

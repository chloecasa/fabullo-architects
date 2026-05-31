// src/collections/Leads.ts
import { CollectionConfig } from 'payload';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'surname', // Displays the sender's last name in the CMS list view [1]
    defaultColumns: ['firstName', 'surname', 'email', 'subject', 'createdAt'], // Customize dashboard columns [1]
  },
  access: {
    create: () => true, // Anyone can submit a contact form inquiry [1]
    read: ({ req: { user } }) => Boolean(user), // Only logged-in admin users can view the inquiries [1]
    update: () => false, // Leads cannot be modified once submitted (maintains audit trail integrity) [1]
    delete: ({ req: { user } }) => Boolean(user), // Only logged-in admin users can delete inquiries [1]
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'surname',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      label: 'Subject Choice',
      options: [
        { label: 'Talk about project', value: 'Talk about project' },
        { label: 'Apply for position', value: 'Apply for position' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Inquiry Details',
    },
  ],
};

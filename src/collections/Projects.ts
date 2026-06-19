// src/collections/Projects.ts
import { CollectionConfig } from 'payload';

// Utility helper to convert plain text into a URL-friendly slug
const formatSlug = (val: string): string =>
  val
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title', // Displays the project title in the CMS list view
  },
  access: {
    read: () => true, // Anyone can view the projects portfolio
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = formatSlug(data.title);
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title if left blank.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Residential', value: 'RESIDENTIAL' },
        { label: 'Commercial', value: 'COMMERCIAL' },
        { label: 'Unbuilt', value: 'UNBUILT' },
      ],
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'Year of completion or phase indicator (e.g., 2025, Unbuilt).',
      },
    },
    {
      name: 'heroImg',
      type: 'upload',
      relationTo: 'media', // Links directly to your Media upload collection
      required: true,
    },
    {
      name: 'credits',
      type: 'text',
      admin: {
        description: 'Photography and styling credits (e.g., PHOTOGRAPHY BY PRUE RUSCOE).',
      },
    },
    {
      name: 'team',
      type: 'array',
      admin: {
        description: 'Design and construction team members.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'val', type: 'text', required: true },
      ],
    },
    {
      name: 'consultants',
      type: 'array',
      admin: {
        description: 'Specialist consultants and suppliers.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'val', type: 'text', required: true },
      ],
    },
    {
      name: 'slides',
  type: 'array',
  minRows: 4, // Enforces exactly 4 slides
  maxRows: 4, // Blocks a 5th slide from being created
  admin: {
    description: 'Enter exactly 4 narrative text paragraphs for the pinned scrolling sequence.',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
          label: 'Slide Paragraph',
        },
      ],
    },
    {
       name: 'verticalImages',
      type: 'array',
      minRows: 4, // Enforces exactly 4 vertical images [1, 2]
      maxRows: 4, // Prevents a 5th vertical image [2]
      admin: {
        description: 'Link exactly 4 vertical layout images for the pinned scrolling sequence.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true, // Forces every slot to contain a linked image file [1]
        },
      ],
    },
    {
      name: 'horizontalGallery',
      type: 'array',
      admin: {
        description: 'The carousel gallery images shown at the bottom of the details page.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // Add this unified group block inside src/collections/Projects.ts at the bottom of the fields array
    {
      name: 'homepageFeatured',
      type: 'group',
      label: 'Featured Project on the Homepage (Optional)', // This renders your layout header [1]
      fields: [
        {
          name: 'line1',
          type: 'text',
          label: 'Project Title',
        },
        {
          name: 'line2',
          type: 'text',
          label: 'Project Subtitle',
        },
      ],
    },
   
  ],
};

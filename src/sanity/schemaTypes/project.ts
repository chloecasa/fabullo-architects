// src/sanity/schemaTypes/project.ts
import { defineArrayMember, defineField, defineType } from 'sanity';

// Alt text is required for SEO and screen readers
const altField = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for SEO and screen readers.',
});

export const project = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Click Generate to create it from the title.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'RESIDENTIAL' },
          { title: 'Commercial', value: 'COMMERCIAL' },
          { title: 'Unbuilt', value: 'UNBUILT' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      type: 'string',
      description: 'Year of completion or phase indicator (e.g., 2025, Unbuilt).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImg',
      title: 'Hero image (desktop, landscape)',
      type: 'image',
      description: 'Recommended: 16:9 landscape, 2400 x 1350 px. Shown on desktop and tablet.',
      options: { hotspot: true },
      fields: [altField],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImgMobile',
      title: 'Hero image (mobile, portrait)',
      type: 'image',
      description: 'Recommended: 9:16 portrait, 1080 x 1920 px. Shown on phones. Leave empty to use the desktop image.',
      options: { hotspot: true },
      fields: [altField],
    }),
    defineField({
      name: 'credits',
      type: 'string',
      description: 'Photography and styling credits (e.g., PHOTOGRAPHY BY PRUE RUSCOE).',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      description: 'Design and construction team members.',
      of: [defineArrayMember({ type: 'labelValue' })],
    }),
    defineField({
      name: 'consultants',
      type: 'array',
      description: 'Specialist consultants and suppliers.',
      of: [defineArrayMember({ type: 'labelValue' })],
    }),
    defineField({
      name: 'slides',
      title: 'Slide paragraphs',
      type: 'array',
      description: 'At least 2 paragraphs. You can add more.',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      validation: (r) => r.min(2),
    }),
    defineField({
      name: 'verticalImages',
      title: 'Sequence images',
      type: 'array',
      description: 'At least 2 images. You can add more. The number does not need to match the paragraphs.',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [altField] })],
      validation: (r) => r.min(2),
    }),
    defineField({
      name: 'horizontalGallery',
      title: 'Gallery images',
      type: 'array',
      description: 'Gallery shown at the bottom of the project page. Any ratio works.',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [altField] })],
    }),
    defineField({
      name: 'homepageFeatured',
      title: 'Featured project on the homepage (optional)',
      type: 'object',
      fields: [
        defineField({ name: 'line1', title: 'Project title', type: 'string' }),
        defineField({ name: 'line2', title: 'Project subtitle', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'year', media: 'heroImg' },
  },
});

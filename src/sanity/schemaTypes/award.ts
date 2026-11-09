// src/sanity/schemaTypes/award.ts
import { defineField, defineType } from 'sanity';

export const award = defineType({
  name: 'award',
  title: 'Awards',
  type: 'document',
  fields: [
    defineField({ name: 'year', type: 'string', description: 'e.g., 2025', validation: (r) => r.required() }),
    defineField({
      name: 'recognition',
      title: 'Recognition detail',
      type: 'string',
      description: 'e.g., TIDA HOMES RUNNER UP NEW HOME OF THE YEAR',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'project',
      title: 'Associated project',
      type: 'string',
      description: 'e.g., FOREVER HOUSE',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'recognition', subtitle: 'year' } },
});

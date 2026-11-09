// src/sanity/schemaTypes/book.ts
import { defineField, defineType } from 'sanity';

export const book = defineType({
  name: 'book',
  title: 'Books',
  type: 'document',
  fields: [
    defineField({ name: 'year', type: 'string', description: 'e.g., 2025', validation: (r) => r.required() }),
    defineField({
      name: 'recognition',
      title: 'Publication detail',
      type: 'string',
      description: 'e.g., AS FEATURED IN ISSUE NO. 15',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'project',
      title: 'Name of book / project',
      type: 'string',
      description: 'e.g., THE LOCAL PROJECT / FOREVER HOUSE',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'recognition', subtitle: 'year' } },
});

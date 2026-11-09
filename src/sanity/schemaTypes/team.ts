// src/sanity/schemaTypes/team.ts
import { defineField, defineType } from 'sanity';

export const team = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'e.g., K., MICHAEL G.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Staff portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'desc',
      title: 'Role and description',
      type: 'text',
      rows: 3,
      description: 'Uppercase, e.g., PRINCIPAL ARCHITECT WITH OVER 20 YEARS OF EXPERIENCE.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers display first.',
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'desc', media: 'image' } },
});

// src/sanity/schemaTypes/homepage.ts
import { defineArrayMember, defineField, defineType } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects (select exactly 4)',
      type: 'array',
      description: 'These 4 projects appear in the homepage slider, in this order.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: (r) => r.required().length(4),
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage Settings' }) },
});

// src/sanity/schemaTypes/labelValue.ts
// Reusable "label - value" row, used for the team and consultants lists
import { defineField, defineType } from 'sanity';

export const labelValue = defineType({
  name: 'labelValue',
  title: 'Label and value',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'val', title: 'Value', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'val' } },
});

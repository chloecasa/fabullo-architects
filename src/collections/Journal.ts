// src/collections/Journal.ts
import { CollectionConfig } from 'payload';

const formatSlug = (val: string): string =>
  val
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

export const Journal: CollectionConfig = {
  slug: 'journal',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Architectural Journal',
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'img',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover Image',
    },
    {
      name: 'previewTemplate',
      type: 'select',
      required: true,
      label: 'Layout Template',
      defaultValue: 'version-1',
      options: [
        { label: 'Template Version 1 (3 Slides)', value: 'version-1' },
        { label: 'Template Version 2 (4 Slides)', value: 'version-2' }, 
         { label: 'Template Version 3 (3 Slides)', value: 'version-3' },
         { label: 'Template Version 4 (4 Slides)', value: 'version-4' },
            { label: 'Template Version 5 (5 Slides)', value: 'version-5' },
      ],
    },
    
    // --- TEMPLATE VERSION 1 STATIC GROUPS ---
    {
      name: 'template1',
      type: 'group',
      label: 'Template 1 Layout Details',
      admin: {
        condition: (data) => data?.previewTemplate === 'version-1',
      },
      fields: [
        {
          name: 'slide1',
          type: 'group',
          label: 'Slide 1 (Header Slide)',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Slide 1 Title',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 1 Primary Image',
            },
          ],
        },
        {
          name: 'slide2',
          type: 'group',
          label: 'Slide 2 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 2 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 2 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 2 Right Text Column',
            },
          ],
        },
        {
          name: 'slide3',
          type: 'group',
          label: 'Slide 3 (Dual Text + Secondary Image Overlay)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 3 Primary Image',
            },
            {
              name: 'smallImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 3 Secondary Small Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 3 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 3 Right Text Column',
            },
          ],
        },
      ],
    },

    // --- TEMPLATE VERSION 2 STATIC GROUPS ---
    {
      name: 'template2',
      type: 'group',
      label: 'Template 2 Layout Details',
      admin: {
        condition: (data) => data?.previewTemplate === 'version-2', // Only show when Version 2 is selected [2]
      },
      fields: [
        // Slide 1 (Title + Image) [1]
        {
          name: 'slide1',
          type: 'group',
          label: 'Slide 1 (Header Slide)',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Slide 1 Title',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 1 Primary Image',
            },
          ],
        },
        // Slide 2 (Image + Left/Right Text) [1]
        {
          name: 'slide2',
          type: 'group',
          label: 'Slide 2 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 2 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 2 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 2 Right Text Column',
            },
          ],
        },
        // Slide 3 (Image + Left/Middle Text) [1]
        {
          name: 'slide3',
          type: 'group',
          label: 'Slide 3 (Dual Text with Middle Column)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 3 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 3 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 3 Right Text Column',
            },
          ],
        },
        // Slide 4 (Image + Left/Right Text) [1]
        {
          name: 'slide4',
          type: 'group',
          label: 'Slide 4 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 4 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 4 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 4 Right Text Column',
            },
          ],
        },
      ],
    },

    // --- TEMPLATE VERSION 3 STATIC GROUPS ---
    {
      name: 'template3',
      type: 'group',
      label: 'Template 3 Layout Details',
      admin: {
        condition: (data) => data?.previewTemplate === 'version-3', // Only show when Version 3 is selected
      },
      fields: [
        // Slide 1 (Title + Image)
        {
          name: 'slide1',
          type: 'group',
          label: 'Slide 1 (Header Slide)',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Slide 1 Title',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 1 Primary Image',
            },
          ],
        },
        // Slide 2 (Image + Left/Right Text)
        {
          name: 'slide2',
          type: 'group',
          label: 'Slide 2 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 2 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 2 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 2 Right Text Column',
            },
          ],
        },
        // Slide 3 (Image + Left/Right Text)
        {
          name: 'slide3',
          type: 'group',
          label: 'Slide 3 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 3 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 3 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 3 Right Text Column',
            },
          ],
        },
      ],
    },

// --- TEMPLATE VERSION 4 STATIC GROUPS ---
    {
      name: 'template4',
      type: 'group',
      label: 'Template 4 Layout Details',
      admin: {
        condition: (data) => data?.previewTemplate === 'version-4', // Only show when Version 4 is selected
      },
      fields: [
        // Slide 1 (Title + Image)
        {
          name: 'slide1',
          type: 'group',
          label: 'Slide 1 (Header Slide)',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Slide 1 Title',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 1 Primary Image',
            },
          ],
        },
        // Slide 2 (Image + Left/Middle/Right Text)
        {
          name: 'slide2',
          type: 'group',
          label: 'Slide 2 (Triple Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 2 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 2 Left Text Column',
            },
            {
              name: 'textMiddle',
              type: 'textarea',
              label: 'Slide 2 Middle Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 2 Right Text Column',
            },
          ],
        },
        // Slide 3 (Image + Left/Right Text)
        {
          name: 'slide3',
          type: 'group',
          label: 'Slide 3 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 3 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 3 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 3 Right Text Column',
            },
          ],
        },
        // Slide 4 (Image + Left Text Only)
        {
          name: 'slide4',
          type: 'group',
          label: 'Slide 4 (Single Text Column)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 4 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 4 Left Text Column',
            },
          ],
        },
      ],
    },

    // --- TEMPLATE VERSION 5 STATIC GROUPS ---
    {
      name: 'template5',
      type: 'group',
      label: 'Template 5 Layout Details',
      admin: {
        condition: (data) => data?.previewTemplate === 'version-5', // Only show when Version 5 is selected
      },
      fields: [
        // Slide 1 (Title + Image)
        {
          name: 'slide1',
          type: 'group',
          label: 'Slide 1 (Header Slide)',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Slide 1 Title',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 1 Primary Image',
            },
          ],
        },
        // Slide 2 (Image + Left/Right Text)
        {
          name: 'slide2',
          type: 'group',
          label: 'Slide 2 (Dual Text Columns)',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide 2 Primary Image',
            },
            {
              name: 'textLeft',
              type: 'textarea',
              label: 'Slide 2 Left Text Column',
            },
            {
              name: 'textRight',
              type: 'textarea',
              label: 'Slide 2 Right Text Column',
            },
          ],
        },
      ],
    },

  ],
};



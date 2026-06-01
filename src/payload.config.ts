// src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import { cloudinaryStorage } from 'payloadcms-storage-cloudinary'; // Import the Cloudinary storage adapter

import { Media } from './collections/Media';
import { Projects } from './collections/Projects';
import { Journal } from './collections/Journal';
import { Leads } from './collections/Leads';
import { Team } from './collections/Team'; 
import { Awards } from './collections/Awards'; 
import { Books } from './collections/Books'; 
import { Homepage } from './globals/Homepage';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    // We will configure white-labeling and visual settings here later
  },
  collections: [
    Media,
    Projects,
    Journal,
    Leads,
    Team,      
    Awards,    
    Books,     
  ],
  globals: [
    Homepage,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  // Register the Cloudinary storage plugin
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});

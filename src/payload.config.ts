// src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import { Media } from './collections/Media';
import { Projects } from './collections/Projects';
import { Journal } from './collections/Journal';
import { Leads } from './collections/Leads';
import { Team } from './collections/Team'; // Import Team [1.1.2]
import { Awards } from './collections/Awards'; // Import Awards [1.1.2]
import { Books } from './collections/Books'; // Import Books [1.1.2]
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
    Team,      // Register Team [1.1.2]
    Awards,    // Register Awards [1.1.2]
    Books,     // Register Books [1.1.2]
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
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});

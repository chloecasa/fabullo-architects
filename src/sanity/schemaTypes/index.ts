// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity';
import { project } from './project';
import { team } from './team';
import { award } from './award';
import { book } from './book';
import { labelValue } from './labelValue';
import { homepage } from './homepage';

export const schemaTypes: SchemaTypeDefinition[] = [labelValue, project, team, award, book, homepage];

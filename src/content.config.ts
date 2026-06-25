import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ------------------------------------------------------------------
   Content collections (Astro Content Layer API).

   Each collection pairs a `loader` (where the data comes from) with a
   `schema` (a Zod shape every entry is validated against at build time).
   Add an entry = drop a .md file in the collection's folder; if its
   frontmatter doesn't match the schema, the build fails loudly. That
   validation is the whole point — typos can't reach the page.
   ------------------------------------------------------------------ */

// Work history. Newest-first ordering is done at render time (see Experience.astro).
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    title: z.string(),          // role, e.g. "Backend Developer"
    company: z.string(),
    start: z.coerce.date(),     // "2024-01" → Date; coerce parses the string
    end: z.coerce.date().nullable(), // null = current role ("Present")
    description: z.string(),
    stack: z.array(z.string()), // tech used, rendered as tag pills
  }),
});

// Noteworthy items: talks, OSS contributions, certs, writing.
const extras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/extras' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),   // optional outbound link
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { experience, extras };

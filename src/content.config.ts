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

// Portfolio samples (client-view case studies). Data-driven like experience/
// extras: add an entry = drop a .md file. Bilingual by design — every prose
// field is a localized { en, pt } object so a sample's two languages live in
// one file and can't drift apart. Language-neutral data (image paths, fact
// VALUES like "60s") stays a plain string.
const localized = z.object({ en: z.string(), pt: z.string() });

const samples = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/samples' }),
  schema: z.object({
    title: localized,
    subtitle: localized.optional(),
    // Honesty rule (DESIGN §7): the badge is NEVER "live". Defaults to a
    // concept-demo label; samples represent what Bruno would build, not
    // delivered client work.
    badge: localized.default({ en: 'concept demo', pt: 'demo conceito' }),
    summary: localized,
    media: z.array(z.string()).default([]),   // committed paths under public/
    video: z.string().optional(),             // optional <1-min walkthrough
    // Live demo you host + control (so it can be framed in the modal). The
    // card becomes clickable when this is set; absent = no live link.
    demoUrl: z.string().url().optional(),
    // Optional source repo ("view source" link on the card).
    repo: z.string().url().optional(),
    // Demo facts, NOT business results (e.g. label "to book" / value "60s").
    facts: z
      .array(z.object({ label: localized, value: z.string() }))
      .default([]),
    capabilities: z.array(localized).default([]), // chips
    order: z.number().default(0),                 // best first (ascending)
  }),
});

export const collections = { experience, extras, samples };

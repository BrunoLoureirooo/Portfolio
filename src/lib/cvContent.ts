// CV-driven content — parses the CV PDF at BUILD time so the PDF is the single
// source for the About bio + Experience timeline. Node-only (fs + unpdf); only
// runs in .astro frontmatter at build. See docs/features/cv-content.md.
import { readFile } from 'node:fs/promises';
import { extractText, getDocumentProxy } from 'unpdf';

export type CvRole = {
  title: string;
  company: string;
  start: string; // "MM/YYYY"
  end: string | null; // "MM/YYYY", or null = "Present"
  bullets: string[];
  stack: string[]; // inferred from the bullets (CV has no per-role tag field)
};

// Identity / contact block from the CV header — the single source for these
// across the site (Hero links, Footer links). All fields live on one line of
// the PDF, right before the Summary header.
export type CvContact = {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
};

export type CvContent = {
  summary: string;
  experience: CvRole[];
  contact: CvContact;
};

// Which PDF to read per locale (filesystem paths, relative to project root).
const CV_FILE: Record<string, string> = {
  en: 'public/CV.pdf',
  pt: 'public/CV_PT.pdf',
};

// Section headers differ by language; the parser slices between these.
type Headers = { sumStart: string; sumEnd: string; expStart: string; expEnd: string };
const HEADERS: Record<string, Headers> = {
  en: {
    sumStart: 'Summary ',
    sumEnd: ' Skills & Certifications',
    expStart: 'Work Experience ',
    expEnd: ' Projects ',
  },
  pt: {
    sumStart: 'Resumo ',
    sumEnd: ' Competências e Certificações',
    expStart: 'Experiência Profissional ',
    expEnd: ' Projetos ',
  },
};

// Extract the PDF as one continuous string (mergePages → single block).
async function extractCvText(file: string): Promise<string> {
  const buf = await readFile(file);
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join('\n') : text;
}

// Grab whatever sits between two header strings (the core slicing trick).
function between(text: string, start: string, end: string): string {
  const s = text.indexOf(start);
  if (s === -1) return '';
  const from = s + start.length;
  const e = text.indexOf(end, from);
  return (e === -1 ? text.slice(from) : text.slice(from, e)).trim();
}

// Curated tech keywords, ordered. Curated (not a broad list) so we don't match
// '.NET' inside 'ASP.NET'; `.filter` preserves this order in the output.
const TECH = [
  'ASP.NET Core', '.NET 8', 'C#', 'Blazor', 'Entity Framework Core', 'MySQL',
  'Redis', 'Docker', 'YARP', 'Angular', 'CQRS', 'Azure', 'Terraform',
  'DevExpress', 'JWT', 'ABAC', 'Clean Architecture', 'SOLID',
];

function inferStack(bullets: string[]): string[] {
  const joined = bullets.join(' ');
  return TECH.filter((t) => joined.includes(t));
}

// Date range — the boundary between the role header (title, company) and its
// bullets. The end is a date, or a word (Present/Presente) which means "current".
const DATE = /(\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{4}|[A-Za-zê]+)/;

// Parse the Work Experience block into roles. NOTE: handles the single current
// role this CV has (matches the first date range); multi-role CVs would need
// iterating over every date match. A parse miss returns [] → caller falls back.
function parseExperience(block: string): CvRole[] {
  const m = block.match(DATE);
  if (!m || m.index === undefined) return [];

  const [title, ...rest] = block.slice(0, m.index).trim().split(',');
  const company = rest.join(',').trim();

  const bullets = block
    .slice(m.index + m[0].length)
    .split(/[●•]/) // EN CV uses ●, PT CV uses •
    .map((b) => b.trim().replace(/-\s+(?=[A-Za-zê])/g, '-')) // fix "Code- First"
    .filter(Boolean);

  // end is a real date only if it matches MM/YYYY; otherwise it's "Present(e)" → null.
  const end = /^\d{2}\/\d{4}$/.test(m[2]) ? m[2] : null;

  return [
    {
      title: title.trim(),
      company,
      start: m[1],
      end,
      bullets,
      stack: inferStack(bullets),
    },
  ];
}

// Pull the identity block out of the CV header (the text before "Summary").
// Each field is matched independently, so a missing/odd field yields '' rather
// than breaking the others. URLs are captured whole; the rest by shape.
function parseContact(header: string): CvContact {
  const first = (re: RegExp) => header.match(re)?.[0]?.trim() ?? '';
  // Leading all-caps run; each word 2+ letters so it can't eat the capital
  // that starts the next, mixed-case word (e.g. the "M" of "Marinha").
  const name = first(/^[A-ZÀ-Ý]{2,}(?:\s+[A-ZÀ-Ý]{2,})*/);
  return {
    name,
    // Location sits between the name and the first "•" separator.
    location: header.slice(name.length).split('•')[0]?.trim() ?? '',
    phone: first(/\+\d[\d ]{6,}\d/),
    email: first(/[\w.+-]+@[\w-]+\.[\w.-]+/),
    linkedin: first(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s•]+/i),
    github: first(/https?:\/\/(?:www\.)?github\.com\/[^\s•]+/i),
  };
}

// A blank contact — the fallback shape when parsing can't run at all.
const EMPTY_CONTACT: CvContact = {
  name: '', location: '', phone: '', email: '', linkedin: '', github: '',
};

// Public entry: read the locale's CV and parse it. Any failure — missing file,
// extraction error, or headers that moved — returns empty content so callers
// fall back to their static defaults. The build never breaks on a bad parse.
export async function getCvContent(locale: string | undefined): Promise<CvContent> {
  const key = locale === 'pt' ? 'pt' : 'en';
  const h = HEADERS[key];
  try {
    const text = await extractCvText(CV_FILE[key]);
    const headerEnd = text.indexOf(h.sumStart);
    const header = headerEnd === -1 ? '' : text.slice(0, headerEnd);
    return {
      summary: between(text, h.sumStart, h.sumEnd),
      experience: parseExperience(between(text, h.expStart, h.expEnd)),
      contact: parseContact(header),
    };
  } catch (err) {
    console.warn('[cv] parse failed, using fallback:', err);
    return { summary: '', experience: [], contact: EMPTY_CONTACT };
  }
}

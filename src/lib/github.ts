// GitHub data layer — the single source of truth for GitHub data shapes and
// fetching. Built up piece by piece below; see docs/features/github-data.md.

// Read an env var safely across THREE runtimes: the Astro build (Vite exposes
// import.meta.env), plain Node (process.env), and the Cloudflare edge (which
// has NEITHER — so every access is guarded, or the module would crash on import
// when the edge function pulls it in). Returns undefined if nothing has it.
function readEnv(key: string): string | undefined {
  const viteEnv = (import.meta as any)?.env;
  if (viteEnv?.[key]) return viteEnv[key];
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];
  return undefined;
}

// Username falls back to a hardcoded default; token falls back to '' (the empty
// string is the signal that flips later code into mock mode).
export const GITHUB_USERNAME = readEnv('GITHUB_USERNAME') ?? 'BrunoLoureirooo';
const TOKEN = readEnv('GITHUB_TOKEN') ?? '';

// ---- Types: the shared vocabulary -----------------------------------------

// One day in the contribution heatmap. `level` is GitHub's own 0–4 intensity
// bucket; we render it straight to a colour, `count` is the raw number.
export type HeatLevel = 0 | 1 | 2 | 3 | 4;
export type HeatCell = { count: number; level: HeatLevel };

// One project card.
export type Project = {
  name: string;
  status: 'active' | 'stable';
  description: string;
  tags: string[];
  repo: string;
  live?: string; // optional homepage / demo URL
  stars: number;
};

// One recent commit row, and one language bar.
export type Commit = { hash: string; repo: string; meta: string; msg: string };
export type Lang = { name: string; pct: number };

// ActivityData = the LIVE-refreshed subset. This is the exact JSON the edge
// function returns AND the props the island starts from — one shape, both
// places, so the island never has to translate fields.
export type ActivityData = {
  fetchedAt: string; // ISO timestamp of this fetch — drives the "last synced" line
  live: boolean; // true = real API data, false = mock fallback
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  prsMerged: number;
  cells: HeatCell[];
  commits: Commit[];
};

// GitHubData = the full BUILD-TIME payload: the live subset PLUS the slow-
// changing projects/langs we only refresh on redeploy. The `&` intersection
// means "ActivityData and also these two fields".
export type GitHubData = ActivityData & {
  langs: Lang[];
  projects: Project[];
};

// ---- Derivations -----------------------------------------------------------

/**
 * Walk the day cells once and derive three numbers:
 *   total   — sum of all contributions
 *   longest — longest run of consecutive non-zero days (anywhere)
 *   current — length of the active run ending at the most recent day
 * Cells are chronological, so "most recent" is the end of the array.
 */
function streaks(cells: HeatCell[]) {
  let longest = 0;
  let run = 0;
  let total = 0;
  for (const c of cells) {
    total += c.count;
    run = c.count > 0 ? run + 1 : 0; // reset to 0 on an empty day
    if (run > longest) longest = run;
  }
  let current = 0;
  for (let i = cells.length - 1; i >= 0 && cells[i].count > 0; i--) current++;
  return { current, longest, total };
}

// ---- Mock fallback (deterministic) ----------------------------------------

const WEEKS = 53;
const DAYS = 7;

// Returns everything EXCEPT fetchedAt/live (those are stamped by the caller).
function mockData(): Omit<GitHubData, 'fetchedAt' | 'live'> {
  // Seeded PRNG (a linear congruential generator). Same seed → same sequence
  // every build, so the mock heatmap never changes between deploys. A plain
  // Math.random() would reshuffle on every build — visual churn for no reason.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff; // normalise to 0..1
  };

  const cells: HeatCell[] = Array.from({ length: WEEKS * DAYS }, () => {
    const r = rand();
    const count = Math.floor(r * r * 13); // squaring skews toward quiet days
    const level: HeatLevel =
      count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    return { count, level };
  });

  const { current, longest, total } = streaks(cells);

  return {
    totalContributions: total,
    currentStreak: current,
    longestStreak: longest,
    prsMerged: 48,
    cells,
    commits: [
      { hash: 'a3f9c21', repo: 'terminal-portfolio', meta: '2h', msg: 'feat: typewriter hero + neofetch panel' },
      { hash: '7b1e045', repo: 'task-api', meta: '1d', msg: 'refactor: extract auth into its own module' },
      { hash: 'c44d8a0', repo: 'spring-ledger', meta: '2d', msg: 'feat: double-entry posting with balance checks' },
      { hash: 'e90f7b3', repo: 'task-api', meta: '4d', msg: 'fix: race in concurrent task assignment' },
      { hash: '1d6a9ff', repo: 'terminal-portfolio', meta: '5d', msg: 'chore: design tokens + CRT atmosphere' },
      { hash: 'f08c512', repo: 'spring-ledger', meta: '1w', msg: 'test: ledger invariants under concurrency' },
    ],
    langs: [
      { name: 'C#', pct: 46 },
      { name: 'TypeScript', pct: 24 },
      { name: 'Java', pct: 18 },
      { name: 'SQL', pct: 12 },
    ],
    projects: [
      {
        name: 'terminal-portfolio',
        status: 'active',
        description:
          'This site — a terminal-themed portfolio on Astro, static-rendered to Cloudflare Pages.',
        tags: ['Astro', 'TypeScript', 'CSS'],
        repo: `https://github.com/${GITHUB_USERNAME}/terminal-portfolio`,
        live: 'https://brunoloureiro.dev',
        stars: 0,
      },
      {
        name: 'task-api',
        status: 'stable',
        description:
          'REST API for task management — JWT auth, clean architecture, and EF Core on PostgreSQL.',
        tags: ['.NET', 'ASP.NET Core', 'PostgreSQL'],
        repo: `https://github.com/${GITHUB_USERNAME}/task-api`,
        stars: 12,
      },
      {
        name: 'spring-ledger',
        status: 'active',
        description:
          'Double-entry ledger service — my hands-on path into the Spring Boot ecosystem.',
        tags: ['Java', 'Spring Boot', 'PostgreSQL'],
        repo: `https://github.com/${GITHUB_USERNAME}/spring-ledger`,
        stars: 3,
      },
      {
        name: 'csv-streamer',
        status: 'stable',
        description:
          'Streaming CSV parser for large files — constant memory, backpressure-aware.',
        tags: ['C#', '.NET'],
        repo: `https://github.com/${GITHUB_USERNAME}/csv-streamer`,
        stars: 7,
      },
      {
        name: 'dotfiles',
        status: 'active',
        description: 'My terminal, editor, and shell config — the setup this site is themed after.',
        tags: ['Shell', 'Lua'],
        repo: `https://github.com/${GITHUB_USERNAME}/dotfiles`,
        stars: 1,
      },
      {
        name: 'rate-limiter',
        status: 'stable',
        description: 'Token-bucket rate limiter middleware with a Redis-backed distributed mode.',
        tags: ['C#', 'Redis'],
        repo: `https://github.com/${GITHUB_USERNAME}/rate-limiter`,
        stars: 5,
      },
    ],
  };
}

// ---- Live fetch: small utilities ------------------------------------------

// Auth + identity headers, built per-call (not a module global) so the SAME
// helpers run at build with the build token and on the edge with the edge token.
const ghHeaders = (token: string, username: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': username, // GitHub requires a User-Agent on every request
});

// GitHub's GraphQL returns an enum for heatmap intensity; map it to our 0–4.
const LEVEL: Record<string, HeatLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// "2026-06-26T..." → "2h" / "3d" / "1w" for compact commit timestamps.
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return 'now';
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

// ---- Live fetch: REST repos → project cards -------------------------------

async function fetchProjects(token: string, username: string): Promise<Project[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    { headers: ghHeaders(token, username) },
  );
  if (!res.ok) throw new Error(`repos: ${res.status}`); // let the caller fall back to mock
  const repos: any[] = await res.json();

  // Drop forks and archived repos — show only things actively owned/built.
  const owned = repos.filter((r) => !r.fork && !r.archived);

  // Cards: ALL owned repos, sorted by stars so the strongest land in the
  // carousel's first-visible three; the rest are reachable by horizontal scroll.
  // "active" if pushed within 60 days, else "stable".
  const now = Date.now();
  const projects: Project[] = [...owned]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map((r) => ({
      name: r.name,
      status: now - new Date(r.pushed_at).getTime() < 60 * 864e5 ? 'active' : 'stable',
      description: r.description ?? '—',
      tags: [r.language].filter(Boolean) as string[], // primary language as the one tag
      repo: r.html_url,
      live: r.homepage || undefined,
      stars: r.stargazers_count,
    }));

  return projects;
}

// ---- Live fetch: GraphQL → real language bytes ----------------------------

async function fetchLanguages(token: string, username: string): Promise<Lang[]> {
  // GitHub's per-repo language byte counts (the metric behind your profile's
  // language bar), fetched for every non-fork repo in ONE query, then summed.
  // Far more accurate than weighting a repo's single primary language by its
  // total disk size.
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          nodes {
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name } }
            }
          }
        }
      }
    }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...ghHeaders(token, username), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  if (!res.ok) throw new Error(`graphql langs: ${res.status}`);
  const json: any = await res.json();
  if (json.errors) throw new Error(`graphql langs: ${JSON.stringify(json.errors)}`);

  // Sum bytes per language across every repo.
  const bytes = new Map<string, number>();
  for (const repo of json.data.user.repositories.nodes)
    for (const e of repo.languages.edges)
      bytes.set(e.node.name, (bytes.get(e.node.name) ?? 0) + e.size);

  // True percentage of total bytes; top 5 (they sum to ~100, the rest is long-tail).
  const total = [...bytes.values()].reduce((s, b) => s + b, 0) || 1;
  return [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, b]) => ({ name, pct: Math.round((b / total) * 100) }));
}

// ---- Live fetch: REST events → recent commits -----------------------------

async function fetchCommits(token: string, username: string): Promise<Commit[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    { headers: ghHeaders(token, username) },
  );
  if (!res.ok) throw new Error(`events: ${res.status}`);
  const events: any[] = await res.json();

  // The events feed is mixed (stars, PRs, pushes…). Keep only PushEvents and
  // flatten their commits until we have 6, newest first.
  const commits: Commit[] = [];
  for (const ev of events) {
    if (ev.type !== 'PushEvent') continue;
    const repo = ev.repo?.name?.split('/').pop() ?? ev.repo?.name ?? '';
    for (const c of ev.payload?.commits ?? []) {
      commits.push({
        hash: String(c.sha).slice(0, 7), // short hash
        repo,
        meta: relativeTime(ev.created_at),
        msg: String(c.message).split('\n')[0], // first line only
      });
      if (commits.length >= 6) return commits;
    }
  }
  return commits;
}

// ---- Live fetch: GraphQL → contribution calendar + merged PRs --------------

async function fetchContributions(
  token: string,
  username: string,
): Promise<{ cells: HeatCell[]; total: number; current: number; longest: number; prsMerged: number }> {
  // The calendar is GraphQL-only (REST can't return it). We grab merged-PR
  // count in the SAME round-trip via the search field — one request, two answers.
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount contributionLevel } }
          }
        }
      }
      search(query: "type:pr author:${username} is:merged", type: ISSUE, first: 1) {
        issueCount
      }
    }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST', // GraphQL is always POST
    headers: { ...ghHeaders(token, username), 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  if (!res.ok) throw new Error(`graphql: ${res.status}`);
  const json: any = await res.json();
  if (json.errors) throw new Error(`graphql: ${JSON.stringify(json.errors)}`); // GraphQL 200s on errors

  // Flatten weeks→days into one chronological cell array (matches the heatmap grid).
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  const cells: HeatCell[] = [];
  for (const w of cal.weeks)
    for (const d of w.contributionDays)
      cells.push({ count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 });

  const s = streaks(cells);
  return {
    cells,
    total: cal.totalContributions,
    current: s.current,
    longest: s.longest,
    prsMerged: json.data.search.issueCount,
  };
}

// ---- Public entry point #1: live full data (edge function + build) ---------

/**
 * The FULL live payload — projects, langs, AND activity. Token + username are
 * PARAMS so this runs on the Cloudflare edge (edge env) as well as at build.
 * No token, or any helper throwing, collapses to mock with live:false so the
 * page never breaks. This is the single fetcher both the endpoint and the
 * build-time getGitHubData() share.
 */
export async function fetchLiveData(
  token: string,
  username: string = GITHUB_USERNAME,
): Promise<GitHubData> {
  const fetchedAt = new Date().toISOString();
  if (!token) return { ...mockData(), fetchedAt, live: false };

  try {
    // Four independent requests in parallel.
    const [projects, langs, commits, contrib] = await Promise.all([
      fetchProjects(token, username),
      fetchLanguages(token, username),
      fetchCommits(token, username),
      fetchContributions(token, username),
    ]);
    return {
      fetchedAt,
      live: true,
      totalContributions: contrib.total,
      currentStreak: contrib.current,
      longestStreak: contrib.longest,
      prsMerged: contrib.prsMerged,
      cells: contrib.cells,
      commits,
      langs,
      projects,
    };
  } catch (err) {
    console.warn('[github] live fetch failed, using mock:', err);
    return { ...mockData(), fetchedAt, live: false };
  }
}

// ---- Public entry point #2: full build-time payload ------------------------

/**
 * Build-time convenience wrapper around fetchLiveData using the module TOKEN.
 * Called from Projects.astro and GitHub.astro frontmatter for the server-
 * rendered first paint (and the islands' initial props).
 */
export async function getGitHubData(): Promise<GitHubData> {
  return fetchLiveData(TOKEN, GITHUB_USERNAME);
}

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-6UedKv/functionsWorker-0.2806131222587429.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function readEnv(key) {
  const viteEnv = import.meta?.env;
  if (viteEnv?.[key]) return viteEnv[key];
  if (typeof process !== "undefined" && process.env?.[key]) return process.env[key];
  return void 0;
}
__name(readEnv, "readEnv");
__name2(readEnv, "readEnv");
var GITHUB_USERNAME = readEnv("GITHUB_USERNAME") ?? "BrunoLoureirooo";
var TOKEN = readEnv("GITHUB_TOKEN") ?? "";
function streaks(cells) {
  let longest = 0;
  let run = 0;
  let total = 0;
  for (const c of cells) {
    total += c.count;
    run = c.count > 0 ? run + 1 : 0;
    if (run > longest) longest = run;
  }
  let current = 0;
  for (let i = cells.length - 1; i >= 0 && cells[i].count > 0; i--) current++;
  return { current, longest, total };
}
__name(streaks, "streaks");
__name2(streaks, "streaks");
var WEEKS = 53;
var DAYS = 7;
function mockData() {
  let seed = 1337;
  const rand = /* @__PURE__ */ __name2(() => {
    seed = seed * 1103515245 + 12345 & 2147483647;
    return seed / 2147483647;
  }, "rand");
  const cells = Array.from({ length: WEEKS * DAYS }, () => {
    const r = rand();
    const count = Math.floor(r * r * 13);
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
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
      { hash: "a3f9c21", repo: "terminal-portfolio", meta: "2h", msg: "feat: typewriter hero + neofetch panel" },
      { hash: "7b1e045", repo: "task-api", meta: "1d", msg: "refactor: extract auth into its own module" },
      { hash: "c44d8a0", repo: "spring-ledger", meta: "2d", msg: "feat: double-entry posting with balance checks" },
      { hash: "e90f7b3", repo: "task-api", meta: "4d", msg: "fix: race in concurrent task assignment" },
      { hash: "1d6a9ff", repo: "terminal-portfolio", meta: "5d", msg: "chore: design tokens + CRT atmosphere" },
      { hash: "f08c512", repo: "spring-ledger", meta: "1w", msg: "test: ledger invariants under concurrency" }
    ],
    langs: [
      { name: "C#", pct: 46 },
      { name: "TypeScript", pct: 24 },
      { name: "Java", pct: 18 },
      { name: "SQL", pct: 12 }
    ],
    projects: [
      {
        name: "terminal-portfolio",
        status: "active",
        description: "This site \u2014 a terminal-themed portfolio on Astro, static-rendered to Cloudflare Pages.",
        tags: ["Astro", "TypeScript", "CSS"],
        repo: `https://github.com/${GITHUB_USERNAME}/terminal-portfolio`,
        live: "https://brunoloureiro.dev",
        stars: 0
      },
      {
        name: "task-api",
        status: "stable",
        description: "REST API for task management \u2014 JWT auth, clean architecture, and EF Core on PostgreSQL.",
        tags: [".NET", "ASP.NET Core", "PostgreSQL"],
        repo: `https://github.com/${GITHUB_USERNAME}/task-api`,
        stars: 12
      },
      {
        name: "spring-ledger",
        status: "active",
        description: "Double-entry ledger service \u2014 my hands-on path into the Spring Boot ecosystem.",
        tags: ["Java", "Spring Boot", "PostgreSQL"],
        repo: `https://github.com/${GITHUB_USERNAME}/spring-ledger`,
        stars: 3
      },
      {
        name: "csv-streamer",
        status: "stable",
        description: "Streaming CSV parser for large files \u2014 constant memory, backpressure-aware.",
        tags: ["C#", ".NET"],
        repo: `https://github.com/${GITHUB_USERNAME}/csv-streamer`,
        stars: 7
      },
      {
        name: "dotfiles",
        status: "active",
        description: "My terminal, editor, and shell config \u2014 the setup this site is themed after.",
        tags: ["Shell", "Lua"],
        repo: `https://github.com/${GITHUB_USERNAME}/dotfiles`,
        stars: 1
      },
      {
        name: "rate-limiter",
        status: "stable",
        description: "Token-bucket rate limiter middleware with a Redis-backed distributed mode.",
        tags: ["C#", "Redis"],
        repo: `https://github.com/${GITHUB_USERNAME}/rate-limiter`,
        stars: 5
      }
    ]
  };
}
__name(mockData, "mockData");
__name2(mockData, "mockData");
var ghHeaders = /* @__PURE__ */ __name2((token, username) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": username
  // GitHub requires a User-Agent on every request
}), "ghHeaders");
var LEVEL = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "now";
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}
__name(relativeTime, "relativeTime");
__name2(relativeTime, "relativeTime");
async function fetchProjects(token, username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
    { headers: ghHeaders(token, username) }
  );
  if (!res.ok) throw new Error(`repos: ${res.status}`);
  const repos = await res.json();
  const owned = repos.filter((r) => !r.fork && !r.archived);
  const now = Date.now();
  const projects = [...owned].sort((a, b) => b.stargazers_count - a.stargazers_count).map((r) => ({
    name: r.name,
    status: now - new Date(r.pushed_at).getTime() < 60 * 864e5 ? "active" : "stable",
    description: r.description ?? "\u2014",
    tags: [r.language].filter(Boolean),
    // primary language as the one tag
    repo: r.html_url,
    live: r.homepage || void 0,
    stars: r.stargazers_count
  }));
  return projects;
}
__name(fetchProjects, "fetchProjects");
__name2(fetchProjects, "fetchProjects");
async function fetchLanguages(token, username) {
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
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...ghHeaders(token, username), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: username } })
  });
  if (!res.ok) throw new Error(`graphql langs: ${res.status}`);
  const json2 = await res.json();
  if (json2.errors) throw new Error(`graphql langs: ${JSON.stringify(json2.errors)}`);
  const bytes = /* @__PURE__ */ new Map();
  for (const repo of json2.data.user.repositories.nodes)
    for (const e of repo.languages.edges)
      bytes.set(e.node.name, (bytes.get(e.node.name) ?? 0) + e.size);
  const total = [...bytes.values()].reduce((s, b) => s + b, 0) || 1;
  return [...bytes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, b]) => ({ name, pct: Math.round(b / total * 100) }));
}
__name(fetchLanguages, "fetchLanguages");
__name2(fetchLanguages, "fetchLanguages");
async function fetchCommits(token, username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/events?per_page=100`,
    { headers: ghHeaders(token, username) }
  );
  if (!res.ok) throw new Error(`events: ${res.status}`);
  const events = await res.json();
  const seen = /* @__PURE__ */ new Set();
  const pushes = [];
  for (const ev of events) {
    if (ev.type !== "PushEvent") continue;
    const sha = ev.payload?.head;
    const repo = ev.repo?.name;
    if (!sha || !repo || seen.has(sha)) continue;
    seen.add(sha);
    pushes.push({ repo, sha, at: ev.created_at });
    if (pushes.length >= 6) break;
  }
  const results = await Promise.all(
    pushes.map(async (p) => {
      try {
        const r = await fetch(
          `https://api.github.com/repos/${p.repo}/commits/${p.sha}`,
          { headers: ghHeaders(token, username) }
        );
        if (!r.ok) return null;
        const c = await r.json();
        const add = c.stats?.additions ?? 0;
        const del = c.stats?.deletions ?? 0;
        return {
          hash: p.sha.slice(0, 7),
          repo: p.repo.split("/").pop() ?? p.repo,
          meta: `${relativeTime(p.at)} \xB7 +${add} \u2212${del}`,
          msg: String(c.commit?.message ?? "").split("\n")[0]
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter((c) => c !== null);
}
__name(fetchCommits, "fetchCommits");
__name2(fetchCommits, "fetchCommits");
async function fetchContributions(token, username) {
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
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    // GraphQL is always POST
    headers: { ...ghHeaders(token, username), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: username } })
  });
  if (!res.ok) throw new Error(`graphql: ${res.status}`);
  const json2 = await res.json();
  if (json2.errors) throw new Error(`graphql: ${JSON.stringify(json2.errors)}`);
  const cal = json2.data.user.contributionsCollection.contributionCalendar;
  const cells = [];
  for (const w of cal.weeks)
    for (const d of w.contributionDays)
      cells.push({ count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 });
  const s = streaks(cells);
  return {
    cells,
    total: cal.totalContributions,
    current: s.current,
    longest: s.longest,
    prsMerged: json2.data.search.issueCount
  };
}
__name(fetchContributions, "fetchContributions");
__name2(fetchContributions, "fetchContributions");
async function fetchLiveData(token, username = GITHUB_USERNAME) {
  const fetchedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (!token) return { ...mockData(), fetchedAt, live: false };
  try {
    const [projects, langs, commits, contrib] = await Promise.all([
      fetchProjects(token, username),
      fetchLanguages(token, username),
      fetchCommits(token, username),
      fetchContributions(token, username)
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
      projects
    };
  } catch (err) {
    console.warn("[github] live fetch failed, using mock:", err);
    return { ...mockData(), fetchedAt, live: false };
  }
}
__name(fetchLiveData, "fetchLiveData");
__name2(fetchLiveData, "fetchLiveData");
var CACHE_SECONDS = 300;
var onRequestGet = /* @__PURE__ */ __name2(async (context) => {
  const cache = caches.default;
  const cacheKey = new Request(new URL(context.request.url).toString(), context.request);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  const data = await fetchLiveData(
    context.env.GITHUB_TOKEN ?? "",
    // no token on Cloudflare → fetchLiveData returns mock
    context.env.GITHUB_USERNAME
  );
  const res = new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      // Cache-Control is what the Cache API obeys; s-maxage targets shared caches.
      "cache-control": `public, s-maxage=${CACHE_SECONDS}`
    }
  });
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}, "onRequestGet");
var SLOT_MINUTES = 30;
var HORIZON_DAYS = 14;
var MIN_LEAD_MINUTES = 60;
var TZ = "Europe/Lisbon";
var WEEKDAY_WINDOWS = [
  [13 * 60 + 30, 14 * 60],
  [19 * 60, 22 * 60]
];
var WEEKEND_WINDOWS = [[9 * 60, 18 * 60]];
function tzOffsetMs(at) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(at);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return wall - at.getTime();
}
__name(tzOffsetMs, "tzOffsetMs");
__name2(tzOffsetMs, "tzOffsetMs");
function lisbonWallToUtc(y, m, d, minutes) {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let ts = guess - tzOffsetMs(new Date(guess));
  const offset = tzOffsetMs(new Date(ts));
  if (guess - offset !== ts) ts = guess - offset;
  return new Date(ts);
}
__name(lisbonWallToUtc, "lisbonWallToUtc");
__name2(lisbonWallToUtc, "lisbonWallToUtc");
function generateSlots(now = /* @__PURE__ */ new Date()) {
  const lisbonNow = new Date(now.getTime() + tzOffsetMs(now));
  const earliest = now.getTime() + MIN_LEAD_MINUTES * 6e4;
  const slots = [];
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const day = new Date(Date.UTC(
      lisbonNow.getUTCFullYear(),
      lisbonNow.getUTCMonth(),
      lisbonNow.getUTCDate() + i
    ));
    const isWeekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
    const windows = isWeekend ? WEEKEND_WINDOWS : WEEKDAY_WINDOWS;
    for (const [from, to] of windows) {
      for (let m = from; m + SLOT_MINUTES <= to; m += SLOT_MINUTES) {
        const start = lisbonWallToUtc(
          day.getUTCFullYear(),
          day.getUTCMonth() + 1,
          day.getUTCDate(),
          m
        );
        if (start.getTime() < earliest) continue;
        slots.push({
          start: start.toISOString(),
          end: new Date(start.getTime() + SLOT_MINUTES * 6e4).toISOString()
        });
      }
    }
  }
  return slots;
}
__name(generateSlots, "generateSlots");
__name2(generateSlots, "generateSlots");
function isValidSlotStart(startIso, now = /* @__PURE__ */ new Date()) {
  return generateSlots(now).some((s) => s.start === startIso);
}
__name(isValidSlotStart, "isValidSlotStart");
__name2(isValidSlotStart, "isValidSlotStart");
async function getAccessToken(creds) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: "refresh_token"
    })
  });
  if (!res.ok) throw new Error(`google token refresh failed: ${res.status}`);
  const json2 = await res.json();
  return json2.access_token;
}
__name(getAccessToken, "getAccessToken");
__name2(getAccessToken, "getAccessToken");
async function createMeetEvent(creds, b) {
  const token = await getAccessToken(creds);
  const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all";
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      summary: `Intro call \u2014 ${b.name}`,
      description: `Booked via brunoloureiro.dev by ${b.name} <${b.email}>.`,
      start: { dateTime: b.start },
      end: { dateTime: b.end },
      attendees: [{ email: b.email }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          // idempotency key Google requires
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    })
  });
  if (!res.ok) throw new Error(`google event create failed: ${res.status} ${await res.text()}`);
  const event = await res.json();
  if (!event.hangoutLink) throw new Error("google event created but no meet link returned");
  return event.hangoutLink;
}
__name(createMeetEvent, "createMeetEvent");
__name2(createMeetEvent, "createMeetEvent");
var KV_PREFIX = "booking:";
var onRequestGet2 = /* @__PURE__ */ __name2(async (context) => {
  const kv = context.env.BOOKINGS;
  const taken = new Set(
    kv ? (await kv.list({ prefix: KV_PREFIX })).keys.map((k) => k.name.slice(KV_PREFIX.length)) : []
  );
  const slots = generateSlots().filter((s) => !taken.has(s.start));
  return new Response(JSON.stringify({ slots }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}, "onRequestGet");
var json = /* @__PURE__ */ __name2((status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" }
}), "json");
var onRequestPost = /* @__PURE__ */ __name2(async (context) => {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json(400, { error: "invalid json" });
  }
  if (body.website) return json(200, { ok: true });
  const name = (body.name ?? "").trim().slice(0, 80);
  const email = (body.email ?? "").trim().slice(0, 120);
  const start = body.start ?? "";
  if (name.length < 2) return json(400, { error: "name required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "valid email required" });
  if (!isValidSlotStart(start)) return json(409, { error: "slot not available" });
  const { BOOKINGS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, BOOKING_DEV } = context.env;
  const dev = BOOKING_DEV === "1";
  const configured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN;
  if (!dev && (!BOOKINGS || !configured)) return json(503, { error: "booking not configured" });
  const end = new Date(new Date(start).getTime() + SLOT_MINUTES * 6e4).toISOString();
  const key = KV_PREFIX + start;
  if (BOOKINGS) {
    if (await BOOKINGS.get(key)) return json(409, { error: "slot not available" });
    await BOOKINGS.put(key, JSON.stringify({ name, email, booked: (/* @__PURE__ */ new Date()).toISOString() }), {
      expirationTtl: 60 * 60 * 24 * 60
      // self-clean after 60 days
    });
  }
  let meetLink;
  try {
    meetLink = dev && !configured ? `https://meet.google.com/dev-fake-link` : await createMeetEvent(
      {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN
      },
      { start, end, name, email }
    );
  } catch (err) {
    await BOOKINGS?.delete(key);
    console.error("booking failed:", err);
    return json(502, { error: "could not create meeting, slot released" });
  }
  return json(200, { ok: true, meetLink, start, end });
}, "onRequestPost");
var routes = [
  {
    routePath: "/api/activity",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/book",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/slots",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/.pnpm/wrangler@4.105.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/.pnpm/wrangler@4.105.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-uGXpEO/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/.pnpm/wrangler@4.105.0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-uGXpEO/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.2806131222587429.js.map

// UI string dictionary — the single source for all static interface text, one
// block per locale (like a .NET .resx per culture). Components read by key via
// useTranslations(locale); the active locale picks which block to read.
//
// NOT for CV-sourced personal data (bio, experience, contact) — that stays
// dynamic from the PDF. This is only the UI chrome: labels, commands, buttons.
//
// `en` is the canonical key set: every key here is what `t()` accepts, and
// `pt` must mirror it. Add a key to `en` first, then translate it in `pt`.
export const defaultLang = 'en';

export const languages = {
  en: 'English',
  pt: 'Português',
} as const;

export const ui = {
  en: {
    'nav.cv': '$ wget cv.pdf',
    'nav.about': 'about',
    'nav.projects': 'projects',
    'nav.experience': 'experience',
    'nav.skills': 'skills',
    'nav.github': 'github',

    // Section headings: `.title` is the a11y label (translates); `.cmd` is the
    // shell command shown as the visible heading (same in every locale).
    'section.about.title': 'About',
    'section.about.cmd': 'cat about.md',
    'section.projects.title': 'Projects',
    'section.projects.cmd': 'ls -la ~/projects',
    'section.experience.title': 'Experience',
    'section.experience.cmd': 'git log --author=bruno --all',
    'section.skills.title': 'Skills',
    'section.skills.cmd': 'cat ~/.config/skills.toml',
    'section.github.title': 'GitHub activity',
    'section.github.cmd': 'gh activity --live',

    // Hero. Terminal-flavor lines (lastlogin/cmd) and the name stay constant;
    // neofetch labels + technical values are program output (kept as-is); only
    // the prose values translate. Tagline content fix is tracked separately.
    'hero.lastlogin': 'Last login: Wed Jun 25 14:08:21 on ttys001',
    'hero.cmd': 'whoami',
    'hero.tagline': 'Backend developer · .NET / JVM',
    'hero.nf.os': 'OS',
    'hero.nf.os.value': 'Arch Linux x86_64',
    'hero.nf.role': 'Role',
    'hero.nf.role.value': 'Software Developer',
    'hero.nf.uptime': 'Uptime',
    'hero.nf.uptime.value': '~3 years coding',
    'hero.nf.shell': 'Shell',
    'hero.nf.shell.value': 'zsh',
    'hero.nf.location': 'Location',
    'hero.nf.location.value': 'Portugal',
    'hero.nf.langs': 'Langs',
    'hero.nf.langs.value': 'C#, TypeScript, SQL, Java',
    'hero.nf.status': 'Status',
    'hero.nf.status.value': 'available for hire',
    'hero.link.github': '~/github',
    'hero.link.email': '↳ email',
    'hero.link.resume': 'resume.pdf ↓',

    // Footer. `exit` and the link labels are terminal/proper-noun constants;
    // the closed-connection line and the sign-off translate.
    'footer.exit': 'exit',
    'footer.closed': 'Connection to brunoloureiro.dev closed.',
    'footer.link.github': 'github',
    'footer.link.linkedin': 'linkedin',
    'footer.link.email': 'email',
    'footer.copy': '© 2026 · built in vim, btw',

    // Skills group labels (the tech items themselves are proper nouns, kept).
    'stack.languages': 'languages/',
    'stack.backend': 'backend/',
    'stack.data': 'data/',
    'stack.tooling': 'tooling/',
    'stack.learning': 'learning/',

    // Activity island. Some values are composed with a number at runtime
    // (e.g. `2` + `m ago`, count + caption), so those parts are split keys.
    'activity.live': 'streaming from the GitHub API',
    'activity.mock': 'mock data — set GITHUB_TOKEN to go live',
    'activity.tag.live': 'live',
    'activity.tag.mock': 'mock',
    'activity.synced': 'synced',
    'activity.ago.now': 'just now',
    'activity.ago.m': 'm ago',
    'activity.ago.h': 'h ago',
    'activity.stat.contributions': 'contributions · 12mo',
    'activity.stat.current': 'current streak',
    'activity.stat.longest': 'longest streak',
    'activity.stat.prs': 'PRs merged',
    'activity.heatmap.caption': 'contributions in the last year',
    'activity.heatmap.less': 'Less',
    'activity.heatmap.more': 'More',
    'activity.panel.commits': 'Recent commits',
    'activity.panel.langs': 'Top languages',
    'activity.cmd.commits': '$ git log --oneline -6',
    'activity.cmd.langs': '$ gh api /langs',

    // Projects island.
    'projects.aria': 'Projects — scroll horizontally for more',
    'projects.repo': 'git:repo →',
    'projects.live': '↗ live',
    'projects.status.active': 'active',
    'projects.status.stable': 'stable',

    // Page <title> + meta description, and the window chrome.
    'meta.title': 'Bruno Loureiro — Software Developer',
    'meta.description': 'Software developer portfolio.',
    'chrome.title': 'bruno@portfolio: ~/dev — zsh — 132×40',
    'chrome.clock': 'Current time',
    'lang.aria': 'Language',
  },
  pt: {
    'nav.cv': '$ wget cv.pdf',
    'nav.about': 'sobre',
    'nav.projects': 'projetos',
    'nav.experience': 'experiência',
    'nav.skills': 'competências',
    'nav.github': 'github',

    'section.about.title': 'Sobre',
    'section.about.cmd': 'cat about.md',
    'section.projects.title': 'Projetos',
    'section.projects.cmd': 'ls -la ~/projects',
    'section.experience.title': 'Experiência',
    'section.experience.cmd': 'git log --author=bruno --all',
    'section.skills.title': 'Competências',
    'section.skills.cmd': 'cat ~/.config/skills.toml',
    'section.github.title': 'Atividade GitHub',
    'section.github.cmd': 'gh activity --live',

    'hero.lastlogin': 'Last login: Wed Jun 25 14:08:21 on ttys001',
    'hero.cmd': 'whoami',
    'hero.tagline': 'Programador backend · .NET / JVM',
    'hero.nf.os': 'OS',
    'hero.nf.os.value': 'Arch Linux x86_64',
    'hero.nf.role': 'Role',
    'hero.nf.role.value': 'Programador de Software',
    'hero.nf.uptime': 'Uptime',
    'hero.nf.uptime.value': '~3 anos a programar',
    'hero.nf.shell': 'Shell',
    'hero.nf.shell.value': 'zsh',
    'hero.nf.location': 'Location',
    'hero.nf.location.value': 'Portugal',
    'hero.nf.langs': 'Langs',
    'hero.nf.langs.value': 'C#, TypeScript, SQL, Java',
    'hero.nf.status': 'Status',
    'hero.nf.status.value': 'disponível para contratar',
    'hero.link.github': '~/github',
    'hero.link.email': '↳ email',
    'hero.link.resume': 'resume.pdf ↓',

    'footer.exit': 'exit',
    'footer.closed': 'Ligação a brunoloureiro.dev terminada.',
    'footer.link.github': 'github',
    'footer.link.linkedin': 'linkedin',
    'footer.link.email': 'email',
    'footer.copy': '© 2026 · feito em vim, btw',

    'stack.languages': 'linguagens/',
    'stack.backend': 'backend/',
    'stack.data': 'dados/',
    'stack.tooling': 'ferramentas/',
    'stack.learning': 'a-aprender/',

    'activity.live': 'a transmitir da API do GitHub',
    'activity.mock': 'dados fictícios — define GITHUB_TOKEN para ativar',
    'activity.tag.live': 'live',
    'activity.tag.mock': 'mock',
    'activity.synced': 'sincronizado',
    'activity.ago.now': 'agora mesmo',
    'activity.ago.m': 'm atrás',
    'activity.ago.h': 'h atrás',
    'activity.stat.contributions': 'contribuições · 12m',
    'activity.stat.current': 'sequência atual',
    'activity.stat.longest': 'sequência mais longa',
    'activity.stat.prs': 'PRs integrados',
    'activity.heatmap.caption': 'contribuições no último ano',
    'activity.heatmap.less': 'Menos',
    'activity.heatmap.more': 'Mais',
    'activity.panel.commits': 'Commits recentes',
    'activity.panel.langs': 'Linguagens principais',
    'activity.cmd.commits': '$ git log --oneline -6',
    'activity.cmd.langs': '$ gh api /langs',

    'projects.aria': 'Projetos — desliza horizontalmente para ver mais',
    'projects.repo': 'git:repo →',
    'projects.live': '↗ live',
    'projects.status.active': 'ativo',
    'projects.status.stable': 'estável',

    'meta.title': 'Bruno Loureiro — Programador de Software',
    'meta.description': 'Portefólio de programador de software.',
    'chrome.title': 'bruno@portfolio: ~/dev — zsh — 132×40',
    'chrome.clock': 'Hora atual',
    'lang.aria': 'Idioma',
  },
} as const;

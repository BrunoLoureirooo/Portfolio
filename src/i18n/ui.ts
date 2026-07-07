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
    // v2 switch pill — flips to the other program (label = the destination).
    'nav.switch.client': '→ client',
    'nav.switch.recruiter': '→ recruiter',
    // Client-view section tabs (shown only on the client program).
    'nav.c.services': 'services',
    'nav.c.work': 'work',
    'nav.c.about': 'about',
    'nav.c.contact': 'contact',

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

    // Entry moment (v2 audience selector). Shown when data-view='ask'. Terminal
    // last-login + whoami lines reuse the hero keys; these are selector-only.
    'entry.aria': 'Choose how to view this site',
    'entry.greeting': "Hi, I'm Bruno",
    'entry.positioning': 'Software developer. Two ways in — pick the one that fits you:',
    'entry.cmd': './welcome.sh --select-audience',
    'entry.recruiter.label': '▸ recruiter',
    'entry.recruiter.desc': 'the engineering — .NET, microservices, live GitHub, deep-dives',
    'entry.recruiter.chip': '$ open ~/dev',
    'entry.client.label': '▸ client',
    'entry.client.desc': 'the outcomes — online bookings, deposits, fewer no-shows',
    'entry.client.chip': '$ open ~/studio',

    // Client-view section headings (cmd = constant; title = a11y label).
    'c.section.pitch.title': 'Pitch',
    'c.section.pitch.cmd': './pitch.sh',
    'c.section.services.title': 'Services',
    'c.section.services.cmd': 'cat services.md',
    'c.section.work.title': 'Work',
    'c.section.work.cmd': 'ls -la ~/demos',
    'c.section.about.title': 'About',
    'c.section.about.cmd': 'whoami --client',
    'c.section.contact.title': 'Contact',
    'c.section.contact.cmd': './contact.sh',

    // Client-view copy. The "I help" statement is the ONE canonical key — reused
    // verbatim in the hero, the Instagram bio, and cold-outreach DMs. The hero
    // splits it on the em-dash to flip the second clause to --fg for emphasis.
    'c.ihelp':
      'I help studios take bookings and deposits online — so you stop chasing no-shows and get paid up front.',
    'c.hero.sub': 'Online booking, deposits, reminders — on a site that looks like you.',
    // Client CTAs (capped at two per section). Shared by hero + contact.
    'c.cta.book': '$ book a 20-min call →',
    'c.cta.sample': '↳ see a sample build',
    'c.cta.email': '↳ email bruno',
    // Services — outcome cards (the "what"), single booking theme.
    'c.svc.tag': '↳ outcome',
    'c.svc.calendar': 'Your calendar fills itself',
    'c.svc.noshows': 'No-shows stop hurting',
    'c.svc.reminders': 'Reminders that actually land',
    'c.svc.site': 'A site that looks like you',
    // Work / about / contact prose.
    'c.work.note': '# concept demo — what I’d build for you, not a delivered result',
    // Sample card actions + demo modal chrome (island is i18n-dumb, gets props).
    'c.work.demo': '▸ open live demo',
    'c.work.repo': 'source ↗',
    'c.work.video': '↳ watch walkthrough',
    'c.demo.open': 'open full ↗',
    'c.demo.close': 'Close demo',
    'c.demo.loading': 'loading demo…',
    'c.about.note': '# why me',
    'c.about.lead':
      'Direct, 1:1 — no agency layers. First studios get founder pricing. Studio work is new; the engineering behind it isn’t.',
    'c.about.trust.direct': '1:1 direct',
    'c.about.trust.pricing': 'founder pricing',
    'c.about.trust.background': 'payments and scheduling background',
    'c.contact.lead': 'Ready when you are — let’s talk about your studio.',
    // Booking modal (docs/features/call-booking.md). Strings are passed to the
    // island as props — the island itself is i18n-dumb.
    'c.book.title': './book-call.sh — 20 min, google meet',
    'c.book.loading': 'loading slots…',
    'c.book.empty': 'no open slots right now — email me instead.',
    'c.book.tz': '# times shown in your timezone',
    'c.book.name': 'name',
    'c.book.email': 'email',
    'c.book.next': 'continue →',
    'c.book.submit': '$ book it →',
    'c.book.submitting': 'booking…',
    'c.book.confirm.title': '✓ booked.',
    'c.book.confirm.body': 'calendar invite with the meet link is on its way to your inbox.',
    'c.book.error': 'that didn’t work — the slot may be taken. pick another or email me.',
    'c.book.back': '← back',
    'c.book.close': 'close booking',

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
    'chrome.close': 'Back to audience selection',
    'lang.aria': 'Language',
  },
  pt: {
    'nav.cv': '$ wget cv.pdf',
    'nav.about': 'sobre',
    'nav.projects': 'projetos',
    'nav.experience': 'experiência',
    'nav.skills': 'competências',
    'nav.github': 'github',
    'nav.switch.client': '→ cliente',
    'nav.switch.recruiter': '→ recrutador',
    'nav.c.services': 'serviços',
    'nav.c.work': 'trabalho',
    'nav.c.about': 'sobre',
    'nav.c.contact': 'contacto',

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

    'entry.aria': 'Escolhe como ver este site',
    'entry.greeting': 'Olá, sou o Bruno',
    'entry.positioning': 'Programador de software. Duas entradas — escolhe a que te encaixa:',
    'entry.cmd': './welcome.sh --select-audience',
    'entry.recruiter.label': '▸ recrutador',
    'entry.recruiter.desc': 'a engenharia — .NET, microserviços, GitHub ao vivo, deep-dives',
    'entry.recruiter.chip': '$ open ~/dev',
    'entry.client.label': '▸ cliente',
    'entry.client.desc': 'os resultados — marcações online, depósitos, menos faltas',
    'entry.client.chip': '$ open ~/studio',

    'c.section.pitch.title': 'Pitch',
    'c.section.pitch.cmd': './pitch.sh',
    'c.section.services.title': 'Serviços',
    'c.section.services.cmd': 'cat services.md',
    'c.section.work.title': 'Trabalho',
    'c.section.work.cmd': 'ls -la ~/demos',
    'c.section.about.title': 'Sobre',
    'c.section.about.cmd': 'whoami --client',
    'c.section.contact.title': 'Contacto',
    'c.section.contact.cmd': './contact.sh',

    'c.ihelp':
      'Ajudo estúdios a aceitar marcações e depósitos online — para deixares de andar atrás de faltas e receberes adiantado.',
    'c.hero.sub': 'Marcações, depósitos e lembretes — num site com a tua cara.',
    'c.cta.book': '$ marca uma chamada de 20 min →',
    'c.cta.sample': '↳ vê um exemplo',
    'c.cta.email': '↳ envia email',
    'c.svc.tag': '↳ resultado',
    'c.svc.calendar': 'A agenda enche-se sozinha',
    'c.svc.noshows': 'As faltas deixam de doer',
    'c.svc.reminders': 'Lembretes que chegam mesmo',
    'c.svc.site': 'Um site com a tua cara',
    'c.work.note': '# demo conceito — o que eu construiria para ti, não um resultado entregue',
    // Ações do cartão + janela da demo.
    'c.work.demo': '▸ abrir demo ao vivo',
    'c.work.repo': 'código ↗',
    'c.work.video': '↳ ver demonstração',
    'c.demo.open': 'abrir completa ↗',
    'c.demo.close': 'Fechar demo',
    'c.demo.loading': 'a carregar demo…',
    'c.about.note': '# porquê eu',
    'c.about.lead':
      'Direto, 1:1 — sem camadas de agência. Os primeiros estúdios têm preço de lançamento. O trabalho com estúdios é novo; a engenharia por trás não é.',
    'c.about.trust.direct': '1:1 direto',
    'c.about.trust.pricing': 'preço de lançamento',
    'c.about.trust.background': 'experiência em pagamentos e agendamento',
    'c.contact.lead': 'Estou pronto quando estiveres — vamos falar do teu estúdio.',
    // Modal de marcação (docs/features/call-booking.md).
    'c.book.title': './book-call.sh — 20 min, google meet',
    'c.book.loading': 'a carregar horários…',
    'c.book.empty': 'sem horários livres — manda antes um email.',
    'c.book.tz': '# horas no teu fuso horário',
    'c.book.name': 'nome',
    'c.book.email': 'email',
    'c.book.next': 'continuar →',
    'c.book.submit': '$ marcar →',
    'c.book.submitting': 'a marcar…',
    'c.book.confirm.title': '✓ marcado.',
    'c.book.confirm.body': 'o convite com o link do meet vai a caminho do teu email.',
    'c.book.error': 'não resultou — o horário pode estar ocupado. escolhe outro ou manda email.',
    'c.book.back': '← voltar',
    'c.book.close': 'fechar marcação',

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
    'chrome.close': 'Voltar à seleção de público',
    'lang.aria': 'Idioma',
  },
} as const;

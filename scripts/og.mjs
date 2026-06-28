// Build-time generator for the social preview card → public/og.png (1200×630).
// Authors an SVG that mirrors the site's terminal window, then rasterizes it
// with sharp. Run manually after changing the brand copy/colors: `pnpm og`.
//
// Strings/colors are duplicated here on purpose (a standalone build tool, not
// part of the Astro graph). Keep in sync with tokens.css + the Hero if they
// change — this file is the OG card's source of truth.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Palette (from src/styles/tokens.css).
const C = {
  page: '#060806',
  screen: '#0a0a0a',
  panel: '#0d110d',
  border: '#1b291b',
  green: '#00ff00',
  fg: '#b9f3c0',
  muted: '#5f8f68',
  dim: '#3a6a45',
  accent: '#ffb000',
  red: '#ff5f56',
  yellow: '#ffbd2e',
  dotGreen: '#27c93f',
};

const FONT = "'JetBrains Mono','DejaVu Sans Mono','Liberation Mono',monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#0c160c"/>
      <stop offset="60%" stop-color="${C.page}"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- backdrop -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- terminal window -->
  <rect x="80" y="70" width="1040" height="490" rx="14" fill="${C.screen}" stroke="${C.border}" stroke-width="2"/>

  <!-- title bar -->
  <rect x="80" y="70" width="1040" height="52" rx="14" fill="${C.panel}"/>
  <rect x="80" y="104" width="1040" height="18" fill="${C.panel}"/>
  <circle cx="112" cy="96" r="8" fill="${C.red}"/>
  <circle cx="140" cy="96" r="8" fill="${C.yellow}"/>
  <circle cx="168" cy="96" r="8" fill="${C.dotGreen}"/>
  <text x="600" y="102" text-anchor="middle" font-family="${FONT}" font-size="20" fill="${C.muted}">bruno@portfolio: ~/dev — zsh</text>

  <!-- prompt line (xml:space=preserve keeps the gap before whoami) -->
  <text x="130" y="210" font-family="${FONT}" font-size="26" xml:space="preserve">
    <tspan fill="${C.green}">bruno@portfolio</tspan><tspan fill="${C.accent}">:~$</tspan><tspan fill="${C.fg}"> whoami</tspan>
  </text>

  <!-- name -->
  <text x="128" y="312" font-family="${FONT}" font-size="80" font-weight="700" fill="${C.green}" filter="url(#glow)">Bruno Loureiro</text>

  <!-- tagline -->
  <text x="130" y="378" font-family="${FONT}" font-size="32" fill="${C.accent}">Backend developer · .NET / JVM</text>

  <!-- status + domain footer -->
  <circle cx="138" cy="468" r="7" fill="${C.dotGreen}"/>
  <text x="156" y="475" font-family="${FONT}" font-size="22" fill="${C.fg}">available for hire</text>
  <text x="130" y="522" font-family="${FONT}" font-size="22" fill="${C.dim}">https://brunoloureiro.dev</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log(`og.png written (${(png.length / 1024).toFixed(1)} KB)`);

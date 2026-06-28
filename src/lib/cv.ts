// Locale-aware CV download path. EN → /CV.pdf, PT → /CV_PT.pdf. Both the nav
// CV button and the hero resume pill use this, so they always point at the
// same per-locale file (files live in public/).
export function cvPath(locale: string | undefined): string {
  return locale === 'pt' ? '/CV_PT.pdf' : '/CV.pdf';
}

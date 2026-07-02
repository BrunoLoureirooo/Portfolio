// One-time helper: mint the GOOGLE_REFRESH_TOKEN for call booking.
// Usage:  node scripts/google-oauth.mjs <client_id> <client_secret>
// Opens a consent URL; after you approve with the Gmail that owns the
// calendar, it prints the refresh token to paste into .dev.vars and the
// Cloudflare Pages secrets. See docs/features/call-booking.md.
import http from 'node:http';

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error('usage: node scripts/google-oauth.mjs <client_id> <client_secret>');
  process.exit(1);
}

const REDIRECT = 'http://localhost:8787/callback';
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

// access_type=offline + prompt=consent → Google returns a refresh token
// (otherwise you only get a 1-hour access token).
const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });

http
  .createServer(async (req, res) => {
    const code = new URL(req.url, REDIRECT).searchParams.get('code');
    if (!code) {
      res.writeHead(404).end();
      return;
    }
    const token = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code',
      }),
    }).then((r) => r.json());

    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('done — check your terminal, you can close this tab.');

    if (token.refresh_token) {
      console.log('\nGOOGLE_REFRESH_TOKEN=' + token.refresh_token + '\n');
    } else {
      console.error('\nno refresh_token in response:', token, '\n');
    }
    process.exit(token.refresh_token ? 0 : 1);
  })
  .listen(8787, () => {
    console.log('1. open this URL and approve with the calendar-owner Gmail:\n');
    console.log(authUrl + '\n');
    console.log('2. waiting on ' + REDIRECT + ' …');
  });

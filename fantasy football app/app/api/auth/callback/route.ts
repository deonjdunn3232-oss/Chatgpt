import { NextRequest, NextResponse } from 'next/server';
import { assertEnv, nowEpoch, b64Basic } from '@/lib/utils';
import { getSession, setSessionCookie } from '@/lib/session';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = req.cookies.get('yf_oauth_state')?.value;
  if (!code || !state || !cookieState || state !== cookieState) {
    return new NextResponse('Invalid OAuth state or code', { status: 400 });
  }
  const clientId = assertEnv('YAHOO_CLIENT_ID');
  const clientSecret = assertEnv('YAHOO_CLIENT_SECRET');
  const redirectUri = assertEnv('OAUTH_REDIRECT_URI');
  const basic = b64Basic(clientId, clientSecret);

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code
  });

  const tokenRes = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basic}`,
      'Accept': 'application/json'
    },
    body
  });

  if (!tokenRes.ok) {
    const t = await tokenRes.text();
    return new NextResponse(`Token exchange failed: ${tokenRes.status} ${tokenRes.statusText}\n${t}`, { status: 500 });
  }
  const tokenJson = await tokenRes.json() as any;
  const expires_at = nowEpoch() + (tokenJson.expires_in ?? 3600);

  setSessionCookie({
    access_token: tokenJson.access_token,
    refresh_token: tokenJson.refresh_token,
    xoauth_yahoo_guid: tokenJson.xoauth_yahoo_guid,
    expires_at
  });

  const next = '/dashboard';
  const res = NextResponse.redirect(new URL(next, url.origin));
  res.cookies.set('yf_oauth_state', '', { expires: new Date(0), path: '/' });
  return res;
}

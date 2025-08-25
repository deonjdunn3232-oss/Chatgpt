import { NextRequest, NextResponse } from 'next/server';
import { randomState, assertEnv } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const clientId = assertEnv('YAHOO_CLIENT_ID');
  const redirectUri = assertEnv('OAUTH_REDIRECT_URI');
  const scope = (process.env.OAUTH_SCOPES || 'fspt-r profile email').split(/[ ,]+/).join(' ');
  const state = randomState();
  // store state in a cookie for CSRF protection
  const res = NextResponse.redirect(`https://api.login.yahoo.com/oauth2/request_auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`);
  res.cookies.set('yf_oauth_state', state, { httpOnly: true, sameSite: 'lax', secure: true, path: '/'});
  return res;
}

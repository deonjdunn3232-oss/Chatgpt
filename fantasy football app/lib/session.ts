import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'yf_session';
type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at: number; // epoch seconds
  xoauth_yahoo_guid?: string;
};

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is required');
  return s;
}

function sign(data: string) {
  return crypto.createHmac('sha256', secret()).update(data).digest('hex');
}

export function setSessionCookie(session: Session) {
  const payload = JSON.stringify(session);
  const sig = sign(payload);
  const value = Buffer.from(JSON.stringify({ p: payload, s: sig })).toString('base64');
  cookies().set(COOKIE_NAME, value, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export function getSession(): Session | null {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (!c) return null;
  try {
    const { p, s } = JSON.parse(Buffer.from(c, 'base64').toString('utf8'));
    if (s !== sign(p)) return null;
    const parsed = JSON.parse(p) as Session;
    return parsed;
  } catch {
    return null;
  }
}

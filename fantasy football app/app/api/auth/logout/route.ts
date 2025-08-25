import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

export async function GET() {
  clearSessionCookie();
  const res = NextResponse.redirect('/');
  return res;
}

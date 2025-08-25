import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function Home() {
  const session = getSession();
  return (
    <main>
      {!session ? (
        <a href="/api/auth/login" style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', textDecoration: 'none' }}>
          Sign in with Yahoo
        </a>
      ) : (
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard">Go to Dashboard</Link>
          <a href="/api/auth/logout">Sign out</a>
        </div>
      )}
      <details style={{ marginTop: 20 }}>
        <summary>Setup hints</summary>
        <ol>
          <li>Create a Yahoo app at <a href="https://developer.yahoo.com/apps/" target="_blank">developer.yahoo.com/apps/</a>.</li>
          <li>Use callback/redirect URI <code>http://localhost:3000/api/auth/callback</code>.</li>
          <li>Scopes: <code>fspt-r profile email</code> for Fantasy read plus basic profile.</li>
          <li>Copy <code>.env.example</code> to <code>.env.local</code> and fill in values.</li>
          <li><code>npm i</code> then <code>npm run dev</code>.</li>
        </ol>
      </details>
    </main>
  );
}

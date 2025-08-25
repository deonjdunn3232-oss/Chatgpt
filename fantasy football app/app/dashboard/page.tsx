import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

type YGame = { game_key: string; name: string; code: string; season: string; };
type YLeague = { league_key: string; name: string; };

export default async function Dashboard() {
  const session = getSession();
  if (!session) redirect('/');
  // Fetch leagues for NFL ("nfl" game key group)
  const res = await fetch('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json', {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store'
  });
  if (!res.ok) {
    const body = await res.text();
    return <pre>Failed to load leagues: {res.status} {res.statusText}\n{body}</pre>;
  }
  const data = await res.json();
  // Navigate the weird Yahoo JSON shape
  const users = data.fantasy_content?.users;
  const gamesRaw = users?.[0]?.user?.[1]?.games;
  const games: YGame[] = [];
  const leagues: YLeague[] = [];
  if (gamesRaw) {
    const count = gamesRaw.count ?? 0;
    for (let i = 0; i < count; i++) {
      const g = gamesRaw[i]?.game?.[0];
      if (g) games.push({ game_key: g.game_key, name: g.name, code: g.code, season: g.season });
      const ls = gamesRaw[i]?.game?.[1]?.leagues;
      if (ls) {
        const lcount = ls.count ?? 0;
        for (let j = 0; j < lcount; j++) {
          const l = ls[j]?.league?.[0];
          if (l) leagues.push({ league_key: l.league_key, name: l.name });
        }
      }
    }
  }
  return (
    <div>
      <h2>Your NFL Leagues</h2>
      {leagues.length === 0 ? <p>No leagues found.</p> : (
        <ul>
          {leagues.map(l => <li key={l.league_key}><strong>{l.name}</strong> <code style={{ color: '#666' }}>({l.league_key})</code></li>)}
        </ul>
      )}
      <div style={{ marginTop: 24 }}>
        <a href="/api/auth/logout">Sign out</a>
      </div>
    </div>
  );
}

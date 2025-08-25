# Yahoo Fantasy OAuth Starter (Next.js)

A minimal Next.js app that implements the OAuth 2.0 Authorization Code flow with Yahoo and fetches your NFL leagues from the Yahoo Fantasy Sports API.

## Quick start

1. Create a Yahoo app at https://developer.yahoo.com/apps/.  
   - **Application Type**: Web-based  
   - **Callback Domain / Redirect URI**: `http://localhost:3000/api/auth/callback` (add prod later)  
   - **Scopes**: `fspt-r profile email` (read-only Fantasy + basic profile)  
2. Copy `.env.example` to `.env.local` and fill in `YAHOO_CLIENT_ID`, `YAHOO_CLIENT_SECRET`, `OAUTH_REDIRECT_URI`, and `SESSION_SECRET`.
3. Install and run:
   ```bash
   npm i
   npm run dev
   ```
4. Open `http://localhost:3000` and click **Sign in with Yahoo**.
5. After authorizing, you'll be redirected to `/dashboard`, which calls:
   ```
   https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/leagues?format=json
   ```
   and lists your leagues.

## Notes

- Token exchange uses `POST https://api.login.yahoo.com/oauth2/get_token` with an `Authorization: Basic base64(client_id:client_secret)` header.  
- Session is stored in an HMAC-signed, HttpOnly cookie (no DB). For production, consider a proper session store/rotating refresh tokens.
- Scopes:
  - `fspt-r` – Fantasy read-only
  - `fspt-w` – Fantasy read/write (if your app needs it)
  - `profile email` – For basic user info (optional for pure Fantasy usage)

## Production

- Add your production URL to Yahoo app's **Callback Domain** and set `OAUTH_REDIRECT_URI` accordingly.
- Use a long, random `SESSION_SECRET` and enable HTTPS.

## Troubleshooting

- 401 / scope errors: Ensure your Yahoo app has `fspt-r` (and `fspt-w` if needed) and your request's `scope` matches.
- 403 from Fantasy API: Confirm the logged-in Yahoo account actually plays in the target league and that you're using the correct game key (e.g., `nfl`). Add `?format=json` to get JSON.
- `invalid_request` on token: Check that `redirect_uri` **exactly** matches what's configured in your Yahoo app.

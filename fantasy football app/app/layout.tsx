export const metadata = {
  title: 'Yahoo Fantasy OAuth Starter',
  description: 'Minimal OAuth2 auth-code flow for Yahoo Fantasy Sports API'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial' }}>
        <div style={{ maxWidth: 820, margin: '40px auto', padding: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Yahoo Fantasy OAuth Starter</h1>
          <p style={{ color: '#555', marginTop: 0 }}>Demo app to authenticate with Yahoo and list your NFL leagues.</p>
          {children}
        </div>
      </body>
    </html>
  );
}

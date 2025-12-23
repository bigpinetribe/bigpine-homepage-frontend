// Cloudflare Pages Function for GitHub OAuth callback
// This exchanges the code for an access token and verifies org membership

const ALLOWED_ORG = 'bigpinetribe';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Check if user is a member of the allowed organization
    const orgResponse = await fetch(`https://api.github.com/user/memberships/orgs/${ALLOWED_ORG}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'BigPineTribe-CMS',
      },
    });

    if (orgResponse.status === 404 || orgResponse.status === 403) {
      // User is not a member of the organization
      const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Access Denied</title>
    <style>
      body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
      .error { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
      h1 { color: #d32f2f; margin-bottom: 1rem; }
      p { color: #666; }
      button { margin-top: 1rem; padding: 0.5rem 1rem; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    </style>
  </head>
  <body>
    <div class="error">
      <h1>Access Denied</h1>
      <p>You must be a member of the <strong>${ALLOWED_ORG}</strong> GitHub organization to access the CMS.</p>
      <p>Please contact an administrator if you believe this is an error.</p>
      <button onclick="window.close()">Close</button>
    </div>
  </body>
</html>
      `;
      return new Response(errorHtml, {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!orgResponse.ok) {
      return new Response(`Error checking organization membership: ${orgResponse.status}`, { status: 500 });
    }

    // User is a member - return success
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Authenticating...</title>
  </head>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          console.log("receiveMessage %o", e);
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: accessToken, provider: 'github' })}',
            e.origin
          );
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
    <p>Authenticating with GitHub...</p>
  </body>
</html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

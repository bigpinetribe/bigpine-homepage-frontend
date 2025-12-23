// Cloudflare Pages Function for GitHub OAuth callback
// This exchanges the code for an access token

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

    // Return HTML that posts the token back to the CMS
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
            'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}',
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

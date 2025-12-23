// Cloudflare Pages Function for GitHub OAuth
// This handles the OAuth flow for Decap CMS

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle the initial auth request
  if (url.pathname === '/auth' || url.pathname === '/auth/') {
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
    authUrl.searchParams.set('scope', 'repo,user');
    authUrl.searchParams.set('state', crypto.randomUUID());

    return Response.redirect(authUrl.toString(), 302);
  }

  return new Response('Not Found', { status: 404 });
}

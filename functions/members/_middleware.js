// Cloudflare Pages Function middleware for protecting /members/* routes
// Verifies Supabase JWT from cookies before allowing access

import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env, next } = context;

  // Get the Supabase URL and anon key from environment
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return redirectToLogin(request);
  }

  // Parse cookies to get the Supabase auth tokens
  const cookies = parseCookies(request.headers.get('Cookie') || '');

  // Supabase stores auth in cookies with project-specific names
  // The access token cookie name follows the pattern: sb-<project-ref>-auth-token
  const authCookieName = Object.keys(cookies).find(
    name => name.startsWith('sb-') && name.endsWith('-auth-token')
  );

  if (!authCookieName) {
    return redirectToLogin(request);
  }

  let authData;
  try {
    // The cookie value is a JSON array: [access_token, refresh_token, ...]
    authData = JSON.parse(cookies[authCookieName]);
  } catch (e) {
    console.error('Failed to parse auth cookie:', e);
    return redirectToLogin(request);
  }

  const accessToken = Array.isArray(authData) ? authData[0] : authData?.access_token;

  if (!accessToken) {
    return redirectToLogin(request);
  }

  // Verify the token with Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    console.error('Auth verification failed:', error?.message);
    return redirectToLogin(request);
  }

  // User is authenticated - proceed to the requested page
  return next();
}

function redirectToLogin(request) {
  const url = new URL(request.url);
  const returnTo = encodeURIComponent(url.pathname + url.search);
  return Response.redirect(`${url.origin}/login?returnTo=${returnTo}`, 302);
}

function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;

  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });

  return cookies;
}

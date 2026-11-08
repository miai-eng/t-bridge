import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

// Supabase client for Server Components, Server Functions, and Route Handlers.
// Create a new client per request; do not share it between requests.
export async function createClient() {
  // Await cookies() first: it marks this as request-time work, so a missing
  // env var surfaces at request time instead of failing the build prerender.
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore until auth is added; a proxy.ts will then
          // refresh sessions.
        }
      },
    },
  });
}

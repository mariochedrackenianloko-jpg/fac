// Client auth helpers (no server middleware)
import { supabase } from "@/integrations/supabase/client";

export async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function requireAuth() {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

// Use in useEffect or before API calls


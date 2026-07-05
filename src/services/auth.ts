import { supabase } from "@/lib/supabase";

export const authService = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
};

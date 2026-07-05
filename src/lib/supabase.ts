import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = "https://sqmhvdkxqcsbrevibvkb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbWh2ZGt4cWNzYnJldmlidmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzYyMzIsImV4cCI6MjA5ODgxMjIzMn0.1vPCf8xNgpjyQOFcYQY7tCX7_I7aSUYzjFunvIltJ98";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

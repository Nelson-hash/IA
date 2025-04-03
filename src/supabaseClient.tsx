import { createClient } from '@supabase/supabase-js';

// Ces valeurs sont sécurisées à exposer dans le frontend car Supabase utilise Row-Level Security
const supabaseUrl = "https://hliaryqpyxjlzfgirito.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaWFyeXFweXhqbHpmZ2lyaXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NjgyOTcsImV4cCI6MjA1OTI0NDI5N30.t_Plh-EEkGLSNncjb7mWqhif1rjhtVB5VqOZzhKvEWE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hliaryqpyxjlzfgirito.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaWFyeXFweXhqbHpmZ2lyaXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NjgyOTcsImV4cCI6MjA1OTI0NDI5N30.t_Plh-EEkGLSNncjb7mWqhif1rjhtVB5VqOZzhKvEWE";

// Créer une seule instance avec des options optimisées
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Pas besoin de persister la session pour les stats anonymes
    autoRefreshToken: false, // Pas besoin de rafraîchir le token
  },
  global: {
    fetch: (...args) => {
      // Ajouter un timeout par défaut aux requêtes fetch
      // @ts-ignore - TypeScript ne reconnaît pas l'option signal
      args[1] = {
        ...args[1],
        signal: AbortSignal.timeout(5000), // Timeout de 5 secondes
      };
      return fetch(...args);
    },
  },
});

// InsForge client singleton — used for all SDK operations (auth + database)
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

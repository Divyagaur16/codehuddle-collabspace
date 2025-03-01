
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xzxprtckbvthfhwcruxn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eHBydGNrYnZ0aGZod2NydXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTkzNzUsImV4cCI6MjA1NjQzNTM3NX0.z-dwgVthTrBOmF-TvsvSfGzZMl2YqZAGU4lgIP2r-50";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

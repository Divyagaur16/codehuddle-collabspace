
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xzxprtckbvthfhwcruxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eHBydGNrYnZ0aGZod2NydXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTkzNzUsImV4cCI6MjA1NjQzNTM3NX0.z-dwgVthTrBOmF-TvsvSfGzZMl2YqZAGU4lgIP2r-50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

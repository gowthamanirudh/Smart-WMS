import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlsynrhwruedsxkemmuu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sc3lucmh3cnVlZHN4a2VtbXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTYxMDUsImV4cCI6MjA1NzI5MjEwNX0.nOOZk25zsJfFGANpqLPXdQDMYr9hPikVNrFCBypQf3Q';
export const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    const { data, error } = await supabase.from('inventory').select('*').limit(1);
  
    if (error) {
      console.error("Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase is working! Sample data:", data);
    }
  }

  // Run the test when the file is imported
  testSupabaseConnection();
  

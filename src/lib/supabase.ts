import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppxxoabvthgeayzlvhxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweHhvYWJ2dGhnZWF5emx2aHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjU4MDcsImV4cCI6MjA4NjQwMTgwN30.zrrOrTGB4WPp-CCKJNEvrWBKsh8o4J8S25dwIwElMp0';

export const supabase = createClient(supabaseUrl, supabaseKey);

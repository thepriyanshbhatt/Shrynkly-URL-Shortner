import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogrburxszfdgnslluxnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncmJ1cnhzemZkZ25zbGx1eG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzY1ODcsImV4cCI6MjA5NTU1MjU4N30.mFVwjnBfASCQoCPElXtZay6vcOAsxIeFFYC2MZMO2SM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

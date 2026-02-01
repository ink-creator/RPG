// supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://zhfqewgnnfejfyfkmyae.supabase.co";
const supabaseKey = "sb_publishable_DGpfjOL9IQ4t8DEiz06fhQ_YDnJABI6";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

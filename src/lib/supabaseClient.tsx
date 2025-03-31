import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hiandtlvaxwfttrjpood.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYW5kdGx2YXh3ZnR0cmpwb29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MzQwODAsImV4cCI6MjA1ODMxMDA4MH0.6GfoLuD4DySLm4CzPWXW4FMyseqhpvIwbEhRux8c4wg";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

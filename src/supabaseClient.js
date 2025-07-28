import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nyfwrxhjuxeiazxkdraf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZndyeGhqdXhlaWF6eGtkcmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MjkxMDMsImV4cCI6MjA2ODMwNTEwM30.7r20dkVDu7liGmNUS1DD-4MHvfp8jO3igPgj71SlNuk'

export const supabase = createClient(supabaseUrl, supabaseKey)
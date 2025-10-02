import { createClient } from '@supabase/supabase-js'

    // Use as variáveis de ambiente que configuraremos mais tarde na Vercel
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    export const supabase = createClient(supabaseUrl, supabaseAnonKey)
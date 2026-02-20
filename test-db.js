const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl)

    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1)
    if (pError) console.error('Error fetching profiles:', pError.message)
    else console.log('Profiles table exists.')

    const { data: assessments, error: aError } = await supabase.from('assessments').select('*').limit(1)
    if (aError) console.error('Error fetching assessments:', aError.message)
    else console.log('Assessments table exists.')

    const { data: stats, error: sError } = await supabase.from('regional_stats').select('*').limit(1)
    if (sError) console.error('Error fetching regional_stats:', sError.message)
    else console.log('Regional_stats table exists.')

    if (!pError && !aError && !sError) {
        console.log('All tables are correctly created and accessible!')
    }
}

testConnection()

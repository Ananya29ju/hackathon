const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStructure() {
    // Try to select something that doesn't exist to force a schema error
    const { error: colError } = await supabase.from('profiles').select('phone').limit(1)
    if (colError) {
        console.log('Column check error:', colError.message)
    } else {
        console.log('Column "phone" exists.')
    }

    const { error: emailError } = await supabase.from('profiles').insert({ id: '00000000-0000-0000-0000-000000000000', email: null })
    if (emailError) {
        console.log('Email null error:', emailError.message)
    }
}

testStructure()

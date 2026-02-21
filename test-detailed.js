const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log('Testing with URL:', supabaseUrl)
    console.log('Testing with Key:', supabaseAnonKey.substring(0, 15) + '...')

    const res = await supabase.from('profiles').select('*').limit(1)
    console.log('Result:', JSON.stringify(res, null, 2))
}
test()

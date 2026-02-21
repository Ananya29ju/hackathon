const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debug() {
    const { data: cols, error: err } = await supabase.from('profiles').select('phone').limit(1)
    if (err) console.log('ER:', err.message)
    else console.log('OK, found phone')

    const { data: cols2, error: err2 } = await supabase.from('profiles').select('non_existent_col').limit(1)
    if (err2) console.log('ER2:', err2.message)
    else console.log('OK2, found non_existent_col (WTF?)')
}
debug()

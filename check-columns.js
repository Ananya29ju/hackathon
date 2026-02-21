const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkColumns() {
    const { data: columns, error } = await supabase.rpc('get_table_columns', { table_name: 'profiles' })
    if (error) {
        // Fallback: try a query and see what's returned
        console.log('RPC failed, trying direct select...')
        const { data, error: selectError } = await supabase.from('profiles').select('*').limit(1)
        if (selectError) {
            console.error('Select error:', selectError.message)
        } else if (data && data.length > 0) {
            console.log('Columns found in first row:', Object.keys(data[0]))
        } else {
            console.log('Table is empty, cannot determine columns via select.')
            // Try to insert a dummy row if possible? No, too risky.
        }
    } else {
        console.log('Columns:', columns)
    }
}

checkColumns()

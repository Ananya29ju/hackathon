const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAssessmentsColumns() {
    const { data, error } = await supabase.from('assessments').select('*').limit(1)
    if (error) {
        console.error('Error fetching assessments:', error.message)
    } else if (data && data.length > 0) {
        console.log('Assessments columns:', Object.keys(data[0]))
    } else {
        console.log('Assessments table is empty or could not fetch columns.')
    }
}

checkAssessmentsColumns()

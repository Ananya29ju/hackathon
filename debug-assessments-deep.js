const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAssessmentsStructure() {
    // Try to select a single row and see all columns returned
    const { data, error } = await supabase.from('assessments').select().limit(1)
    if (error) {
        console.error('Error fetching assessments:', error)
    } else if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]))
    } else {
        console.log('Table is empty. Trying to list columns via RPC if available...')
        // Try to insert a dummy row with only symptoms and see if it returns all columns
        const { data: insertData, error: insertError } = await supabase
            .from('assessments')
            .insert({ symptoms: {} })
            .select()

        if (insertError) {
            console.error('Insert error:', insertError)
        } else {
            console.log('Insert success. Columns:', Object.keys(insertData[0]))
            // Clean up
            await supabase.from('assessments').delete().eq('id', insertData[0].id)
        }
    }
}

checkAssessmentsStructure()

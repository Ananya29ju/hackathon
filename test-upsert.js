const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUpsert() {
    console.log('Testing upsert to profiles...')
    // Use a random UUID to avoid conflicts but test the structure
    const testId = '00000000-0000-0000-0000-000000000000'

    const { data, error } = await supabase.from('profiles').upsert({
        id: testId,
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test User',
        role: 'user'
    })

    if (error) {
        console.error('Upsert Error:', error)
        if (error.message.includes('column "phone" of relation "profiles" does not exist')) {
            console.log('Confirmed: "phone" column is missing.')
        }
    } else {
        console.log('Upsert successful (or at least no error returned).')
    }
}

testUpsert()

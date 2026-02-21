const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsert() {
    console.log('Testing Supabase assessment insertion...')

    // Mock data matching the schema
    const mockAssessment = {
        age: 25,
        patient_name: 'Test Patient',
        patient_phone: '1234567890',
        primary_risk: 'breast',
        menstrual_score: 15.5,
        breast_risk_score: 10,
        ovarian_risk_score: 5,
        endometrial_risk_score: 2,
        symptoms: { test: true, note: 'This is a test insertion' },
        latitude: 19.0760,
        longitude: 72.8777,
        created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('assessments')
        .insert(mockAssessment)
        .select()

    if (error) {
        console.error('Insert failed:', error)
        if (error.code === '42P01') {
            console.error('Table "assessments" does not exist. Please run the SQL in Supabase editor.')
        } else if (error.code === '42703') {
            console.error('One or more columns do not match the schema. Please verify the table columns.')
        }
    } else {
        console.log('Successfully inserted test record:', data)

        // Clean up test data
        const { error: deleteError } = await supabase
            .from('assessments')
            .delete()
            .eq('id', data[0].id)

        if (deleteError) {
            console.warn('Could not delete test record:', deleteError)
        } else {
            console.log('Cleanup successful.')
        }
    }
}

testInsert()

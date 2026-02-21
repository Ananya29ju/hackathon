const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugColumnError() {
    const assessmentData = {
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        age: 25,
        patient_name: 'Debug',
        patient_phone: '123',
        primary_risk: 'Unknown',
        menstrual_score: 0,
        breast_risk_score: 0,
        ovarian_risk_score: 0,
        endometrial_risk_score: 0,
        symptoms: {},
        created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('assessments').insert(assessmentData)
    if (error) {
        console.log('Error Code:', error.code)
        console.log('Error Message:', error.message)
    } else {
        console.log('Success! Columns match.')
    }
}

debugColumnError()

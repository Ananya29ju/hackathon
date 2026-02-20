const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const indiaData = [
    { state: 'Maharashtra', breast_cancer_count: 540, ovarian_cancer_count: 210, endometrial_cancer_count: 150 },
    { state: 'Delhi', breast_cancer_count: 420, ovarian_cancer_count: 180, endometrial_cancer_count: 120 },
    { state: 'Tamil Nadu', breast_cancer_count: 380, ovarian_cancer_count: 160, endometrial_cancer_count: 110 },
    { state: 'Karnataka', breast_cancer_count: 350, ovarian_cancer_count: 140, endometrial_cancer_count: 95 },
    { state: 'Uttar Pradesh', breast_cancer_count: 510, ovarian_cancer_count: 190, endometrial_cancer_count: 140 },
    { state: 'Kerala', breast_cancer_count: 290, ovarian_cancer_count: 110, endometrial_cancer_count: 80 },
    { state: 'West Bengal', breast_cancer_count: 310, ovarian_cancer_count: 130, endometrial_cancer_count: 90 },
]

async function seedData() {
    console.log('Seeding regional stats...')

    // Check if data already exists
    const { data: existing } = await supabase.from('regional_stats').select('id').limit(1)

    if (existing && existing.length > 0) {
        console.log('Data already exists in regional_stats. Skipping seed.')
        return
    }

    const { error } = await supabase.from('regional_stats').insert(indiaData)

    if (error) {
        console.error('Error seeding data:', error.message)
    } else {
        console.log('Successfully seeded regional stats data!')
    }
}

seedData()

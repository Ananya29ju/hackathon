-- Test Data for Heatmap (India Regions)
-- Run this in your Supabase SQL Editor

INSERT INTO public.assessments (age, primary_risk, latitude, longitude, created_at)
VALUES 
  (25, 'low', 28.6139, 77.2090, now() - interval '1 day'),    -- Delhi
  (34, 'moderate', 19.0760, 72.8777, now() - interval '2 days'), -- Mumbai
  (45, 'high', 12.9716, 77.5946, now() - interval '3 days'),     -- Bengaluru
  (29, 'low', 13.0827, 80.2707, now() - interval '12 hours'),   -- Chennai
  (52, 'high', 22.5726, 88.3639, now() - interval '4 days'),     -- Kolkata
  (38, 'moderate', 17.3850, 78.4867, now() - interval '5 days'), -- Hyderabad
  (22, 'low', 23.0225, 72.5714, now() - interval '6 days'),     -- Ahmedabad
  (41, 'high', 26.8467, 80.9462, now() - interval '7 days'),     -- Lucknow
  (31, 'low', 15.2993, 74.1240, now() - interval '8 days'),     -- Goa
  (48, 'moderate', 21.1458, 79.0882, now() - interval '9 days'), -- Nagpur
  (36, 'high', 11.0168, 76.9558, now() - interval '10 days'),    -- Coimbatore
  (27, 'low', 30.7333, 76.7794, now() - interval '11 days'),    -- Chandigarh
  (55, 'high', 20.2961, 85.8245, now() - interval '12 days'),    -- Bhubaneswar
  (33, 'moderate', 26.1445, 91.7362, now() - interval '13 days'), -- Guwahati
  (42, 'low', 10.8505, 76.2711, now() - interval '14 days'),    -- Kerala
  (30, 'high', 24.5854, 73.7125, now() - interval '15 days'),    -- Udaipur
  (39, 'moderate', 21.1702, 72.8311, now() - interval '16 days'), -- Surat
  (26, 'low', 23.2599, 77.4126, now() - interval '17 days'),    -- Bhopal
  (50, 'high', 34.0837, 74.7973, now() - interval '18 days'),    -- Srinagar
  (44, 'moderate', 18.5204, 73.8567, now() - interval '19 days'); -- Pune

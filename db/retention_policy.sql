-- SQL Script to handle 6-month data retention policy
-- Run this in your Supabase SQL Editor

-- 1. Create a function to delete records older than 6 months
CREATE OR REPLACE FUNCTION delete_old_assessments()
RETURNS void AS $$
BEGIN
  DELETE FROM assessments
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

-- 2. (Optional) If you have pg_cron enabled in your Supabase project:
-- SELECT cron.schedule('0 0 * * *', 'SELECT delete_old_assessments()');

-- 3. If you want to run it manually or via edge function, you can call:
-- SELECT delete_old_assessments();

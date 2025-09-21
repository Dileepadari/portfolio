-- SQL queries to update personal_info table in Supabase
-- Run these queries in your Supabase SQL editor

-- 1. Add the new columns to the existing personal_info table
ALTER TABLE public.personal_info 
ADD COLUMN medium TEXT,
ADD COLUMN codeforces TEXT;

-- 2. Update the existing record with the new social media links
UPDATE public.personal_info 
SET 
    medium = 'https://medium.com/@dileepadari',
    codeforces = 'https://codeforces.com/profile/dileepadari'
WHERE name = 'Dileepkumar Adari';

-- 3. Verify the update (optional - to check the results)
SELECT name, medium, codeforces, updated_at 
FROM public.personal_info 
WHERE name = 'Dileepkumar Adari';
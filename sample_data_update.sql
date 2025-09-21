-- Sample SQL to execute in Supabase to populate projects with enhanced repository data
-- Run this after running the migration to add the new columns

-- First, let's update existing projects with repository-like data
UPDATE public.projects SET 
  is_private = FALSE,
  stars = CASE 
    WHEN title ILIKE '%e-commerce%' THEN 45
    WHEN title ILIKE '%task%' THEN 67
    WHEN title ILIKE '%weather%' THEN 23
    WHEN title ILIKE '%portfolio%' THEN 31
    WHEN title ILIKE '%blog%' THEN 18
    WHEN title ILIKE '%chat%' THEN 29
    WHEN title ILIKE '%expense%' THEN 15
    WHEN title ILIKE '%recipe%' THEN 12
    WHEN title ILIKE '%snippet%' THEN 38
    WHEN title ILIKE '%url%' THEN 9
    ELSE FLOOR(RANDOM() * 50)::INTEGER
  END,
  forks = CASE 
    WHEN title ILIKE '%e-commerce%' THEN 12
    WHEN title ILIKE '%task%' THEN 23
    WHEN title ILIKE '%weather%' THEN 8
    WHEN title ILIKE '%portfolio%' THEN 5
    WHEN title ILIKE '%blog%' THEN 4
    WHEN title ILIKE '%chat%' THEN 7
    WHEN title ILIKE '%expense%' THEN 3
    WHEN title ILIKE '%recipe%' THEN 2
    WHEN title ILIKE '%snippet%' THEN 11
    WHEN title ILIKE '%url%' THEN 1
    ELSE FLOOR(RANDOM() * 15)::INTEGER
  END,
  language = CASE 
    WHEN title ILIKE '%react%' OR title ILIKE '%next%' OR title ILIKE '%e-commerce%' OR title ILIKE '%task%' OR title ILIKE '%weather%' THEN 'JavaScript'
    WHEN title ILIKE '%typescript%' OR title ILIKE '%portfolio%' OR title ILIKE '%snippet%' THEN 'TypeScript'
    WHEN title ILIKE '%python%' OR title ILIKE '%flask%' OR title ILIKE '%url%' THEN 'Python'
    WHEN title ILIKE '%vue%' OR title ILIKE '%recipe%' THEN 'Vue'
    WHEN title ILIKE '%mobile%' OR title ILIKE '%flutter%' OR title ILIKE '%expense%' THEN 'Dart'
    ELSE 'JavaScript'
  END,
  language_color = CASE 
    WHEN title ILIKE '%react%' OR title ILIKE '%next%' OR title ILIKE '%e-commerce%' OR title ILIKE '%task%' OR title ILIKE '%weather%' THEN '#f1e05a'
    WHEN title ILIKE '%typescript%' OR title ILIKE '%portfolio%' OR title ILIKE '%snippet%' THEN '#3178c6'
    WHEN title ILIKE '%python%' OR title ILIKE '%flask%' OR title ILIKE '%url%' THEN '#3572A5'
    WHEN title ILIKE '%vue%' OR title ILIKE '%recipe%' THEN '#4FC08D'
    WHEN title ILIKE '%mobile%' OR title ILIKE '%flutter%' OR title ILIKE '%expense%' THEN '#00B4AB'
    ELSE '#f1e05a'
  END,
  tags = CASE 
    WHEN technologies IS NOT NULL AND array_length(technologies, 1) > 0 THEN technologies
    ELSE ARRAY['web-development', 'open-source']
  END,
  repository_url = COALESCE(github_url, 'https://github.com/dileepadari/' || LOWER(REPLACE(title, ' ', '-'))),
  updated_at_display = CASE 
    WHEN EXTRACT(HOUR FROM (NOW() - updated_at)) < 1 THEN 'just now'
    WHEN EXTRACT(HOUR FROM (NOW() - updated_at)) < 24 THEN EXTRACT(HOUR FROM (NOW() - updated_at))::TEXT || ' hours ago'
    WHEN EXTRACT(DAY FROM (NOW() - updated_at)) < 7 THEN EXTRACT(DAY FROM (NOW() - updated_at))::TEXT || ' days ago'
    WHEN EXTRACT(DAY FROM (NOW() - updated_at)) < 30 THEN (EXTRACT(DAY FROM (NOW() - updated_at)) / 7)::TEXT || ' weeks ago'
    ELSE (EXTRACT(DAY FROM (NOW() - updated_at)) / 30)::TEXT || ' months ago'
  END
WHERE TRUE;

-- Set some projects as private for demonstration
UPDATE public.projects SET 
  is_private = TRUE,
  stars = FLOOR(RANDOM() * 10)::INTEGER,
  forks = FLOOR(RANDOM() * 3)::INTEGER
WHERE order_index > 7;

-- Add some realistic recent activity timestamps
UPDATE public.projects SET updated_at_display = '2 hours ago' WHERE title ILIKE '%portfolio%';
UPDATE public.projects SET updated_at_display = '1 day ago' WHERE title ILIKE '%task%';
UPDATE public.projects SET updated_at_display = '3 days ago' WHERE title ILIKE '%weather%';
UPDATE public.projects SET updated_at_display = '1 week ago' WHERE title ILIKE '%e-commerce%';
UPDATE public.projects SET updated_at_display = '2 weeks ago' WHERE title ILIKE '%chat%';

-- Boost featured projects' stats
UPDATE public.projects SET 
  stars = stars + 20,
  forks = forks + 5
WHERE featured = TRUE;
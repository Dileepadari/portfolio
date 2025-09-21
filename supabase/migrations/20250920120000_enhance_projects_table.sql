-- Add repository-like fields to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS forks INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS language_color TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repository_url TEXT; -- Different from github_url for actual repo link
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at_display TEXT; -- Human readable "2 hours ago"

-- Update existing projects with sample data
UPDATE public.projects SET 
  is_private = FALSE,
  stars = FLOOR(RANDOM() * 100)::INTEGER,
  forks = FLOOR(RANDOM() * 20)::INTEGER,
  language = CASE 
    WHEN title ILIKE '%react%' OR title ILIKE '%next%' OR title ILIKE '%javascript%' THEN 'JavaScript'
    WHEN title ILIKE '%typescript%' OR title ILIKE '%ts%' THEN 'TypeScript'
    WHEN title ILIKE '%python%' OR title ILIKE '%flask%' OR title ILIKE '%django%' THEN 'Python'
    WHEN title ILIKE '%vue%' THEN 'Vue'
    WHEN title ILIKE '%mobile%' OR title ILIKE '%flutter%' THEN 'Dart'
    ELSE 'JavaScript'
  END,
  language_color = CASE 
    WHEN title ILIKE '%react%' OR title ILIKE '%next%' OR title ILIKE '%javascript%' THEN '#f1e05a'
    WHEN title ILIKE '%typescript%' OR title ILIKE '%ts%' THEN '#3178c6'
    WHEN title ILIKE '%python%' OR title ILIKE '%flask%' OR title ILIKE '%django%' THEN '#3572A5'
    WHEN title ILIKE '%vue%' THEN '#4FC08D'
    WHEN title ILIKE '%mobile%' OR title ILIKE '%flutter%' THEN '#00B4AB'
    ELSE '#f1e05a'
  END,
  tags = COALESCE(technologies, ARRAY[]::TEXT[]),
  repository_url = github_url,
  updated_at_display = CASE 
    WHEN EXTRACT(HOUR FROM (NOW() - updated_at)) < 1 THEN 'just now'
    WHEN EXTRACT(HOUR FROM (NOW() - updated_at)) < 24 THEN EXTRACT(HOUR FROM (NOW() - updated_at))::TEXT || ' hours ago'
    WHEN EXTRACT(DAY FROM (NOW() - updated_at)) < 7 THEN EXTRACT(DAY FROM (NOW() - updated_at))::TEXT || ' days ago'
    WHEN EXTRACT(DAY FROM (NOW() - updated_at)) < 30 THEN (EXTRACT(DAY FROM (NOW() - updated_at)) / 7)::INTEGER::TEXT || ' weeks ago'
    ELSE (EXTRACT(DAY FROM (NOW() - updated_at)) / 30)::INTEGER::TEXT || ' months ago'
  END
WHERE TRUE;

-- Set some projects as private for demonstration
UPDATE public.projects SET is_private = TRUE 
WHERE title ILIKE '%private%' OR title ILIKE '%personal%' OR order_index > 8;

-- Add some realistic star counts for featured projects
UPDATE public.projects SET 
  stars = CASE 
    WHEN featured = TRUE THEN FLOOR(RANDOM() * 50 + 20)::INTEGER
    ELSE FLOOR(RANDOM() * 30)::INTEGER
  END,
  forks = CASE 
    WHEN featured = TRUE THEN FLOOR(RANDOM() * 15 + 5)::INTEGER
    ELSE FLOOR(RANDOM() * 10)::INTEGER
  END
WHERE TRUE;lll
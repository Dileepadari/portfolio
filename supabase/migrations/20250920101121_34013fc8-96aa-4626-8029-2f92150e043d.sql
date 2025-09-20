-- Add image URLs to projects and blog posts for photos support
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS images text[];

-- Update some existing projects with sample images
UPDATE public.projects SET images = ARRAY['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800'] WHERE title LIKE '%Crop%';
UPDATE public.projects SET images = ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'] WHERE title LIKE '%Extension%';
UPDATE public.projects SET images = ARRAY['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'] WHERE title LIKE '%E-commerce%';

-- Update blog posts with sample images
UPDATE public.blog_posts SET images = ARRAY['https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'] WHERE title LIKE '%React%';
UPDATE public.blog_posts SET images = ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'] WHERE title LIKE '%TypeScript%';
UPDATE public.blog_posts SET images = ARRAY['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800'] WHERE title LIKE '%Full-Stack%';
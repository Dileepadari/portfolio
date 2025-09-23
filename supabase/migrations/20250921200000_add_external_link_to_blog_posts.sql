-- Add external_link column to blog_posts table
-- This allows blogs to link to external URLs instead of internal content

ALTER TABLE blog_posts 
ADD COLUMN external_link TEXT NULL;

-- Add a comment to explain the column
COMMENT ON COLUMN blog_posts.external_link IS 'External URL for blog posts that link to external sites. If set, clicking the blog will redirect to this URL instead of showing internal content.';

-- Update existing sample data to add some external link examples
UPDATE blog_posts 
SET external_link = 'https://react.dev/learn/thinking-in-react'
WHERE slug = 'building-scalable-react-applications-lessons-from-production';

UPDATE blog_posts 
SET external_link = 'https://medium.com/@yourprofile/machine-learning-guide'
WHERE slug = 'understanding-machine-learning-algorithms-practical-guide';
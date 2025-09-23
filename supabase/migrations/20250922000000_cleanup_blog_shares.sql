-- Remove blog_posts_with_engagement view and blog_shares table
-- This migration cleans up unused database objects after simplifying the blog system

-- Drop the view first (if it exists)
DROP VIEW IF EXISTS blog_posts_with_engagement;

-- Drop the blog_shares table and all related objects
DROP TABLE IF EXISTS blog_shares CASCADE;

-- Remove any policies that might reference blog_shares (if they exist)
-- Note: CASCADE should handle this, but being explicit for clarity
DROP POLICY IF EXISTS "Users can view all blog shares" ON blog_shares;
DROP POLICY IF EXISTS "Users can create blog shares" ON blog_shares;
DROP POLICY IF EXISTS "Users can delete their own blog shares" ON blog_shares;
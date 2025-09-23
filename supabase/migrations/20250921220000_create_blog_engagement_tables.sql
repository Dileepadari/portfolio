-- Create blog_likes table
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_ip INET, -- For anonymous likes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one like per user per post (either authenticated or by IP)
    CONSTRAINT unique_user_like UNIQUE (blog_post_id, user_id),
    CONSTRAINT unique_ip_like UNIQUE (blog_post_id, user_ip),
    CONSTRAINT check_user_or_ip CHECK (
        (user_id IS NOT NULL AND user_ip IS NULL) OR 
        (user_id IS NULL AND user_ip IS NOT NULL)
    )
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_shares table
CREATE TABLE IF NOT EXISTS public.blog_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    share_type TEXT NOT NULL CHECK (share_type IN ('twitter', 'facebook', 'linkedin', 'copy_link', 'email')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON public.blog_likes(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_created_at ON public.blog_likes(created_at);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON public.blog_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_blog_shares_post_id ON public.blog_shares(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_shares_type ON public.blog_shares(share_type);
CREATE INDEX IF NOT EXISTS idx_blog_shares_created_at ON public.blog_shares(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_likes
CREATE POLICY "Anyone can view likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can unlike their own likes" ON public.blog_likes FOR DELETE USING (
    auth.uid() = user_id OR user_ip = inet_client_addr()
);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can add comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own comments" ON public.blog_comments FOR UPDATE USING (
    auth.uid() = user_id
) WITH CHECK (
    auth.uid() = user_id
);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments FOR DELETE USING (
    auth.uid() = user_id
);

-- RLS Policies for blog_shares
CREATE POLICY "Anyone can view shares" ON public.blog_shares FOR SELECT USING (true);
CREATE POLICY "Anyone can add shares" ON public.blog_shares FOR INSERT WITH CHECK (true);

-- Function to update comment updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_comments_updated_at_trigger
    BEFORE UPDATE ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_comments_updated_at();
-- Complete Timeline Functionality Setup
-- Single comprehensive migration for git-folio-showcase Timeline feature
-- Run this in Supabase SQL Editor to set up complete timeline functionality

-- ============================================================================
-- 1. TIMELINE EVENTS TABLE
-- ============================================================================

-- Create timeline_events table for dynamic timeline functionality
-- This table stores all timeline events including commits, projects, achievements, education, work, and contributions
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('commit', 'project', 'achievement', 'education', 'work', 'contribution', 'task', 'schedule')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  repository VARCHAR(255),
  language VARCHAR(100),
  language_color VARCHAR(7), -- hex color code
  tags TEXT[], -- array of tags
  link VARCHAR(500),
  impact VARCHAR(255),
  metadata JSONB, -- for additional flexible data
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES AND TRIGGERS
-- ============================================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timeline_events_type ON timeline_events(type);
CREATE INDEX IF NOT EXISTS idx_timeline_events_date ON timeline_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_order ON timeline_events(order_index);
CREATE INDEX IF NOT EXISTS idx_timeline_events_tags ON timeline_events USING GIN(tags);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_timeline_events_updated_at ON timeline_events;
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. ROW LEVEL SECURITY AND POLICIES
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Anyone can view timeline events" ON timeline_events;
DROP POLICY IF EXISTS "Admins can insert timeline events" ON timeline_events;
DROP POLICY IF EXISTS "Admins can update timeline events" ON timeline_events;
DROP POLICY IF EXISTS "Admins can delete timeline events" ON timeline_events;

-- Everyone can view published timeline events
CREATE POLICY "Anyone can view timeline events" ON timeline_events
  FOR SELECT USING (true);

-- Only authenticated users with is_admin = true can insert timeline events
CREATE POLICY "Admins can insert timeline events" ON timeline_events
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Only authenticated users with is_admin = true can update timeline events
CREATE POLICY "Admins can update timeline events" ON timeline_events
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Only authenticated users with is_admin = true can delete timeline events
CREATE POLICY "Admins can delete timeline events" ON timeline_events
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- 4. ADMIN SETUP AND VERIFICATION
-- ============================================================================

-- Function to set current user as admin (run only once during setup)
-- Uncomment and run this section after initial table creation:

-- Check current user
-- SELECT 
--   auth.uid() as current_user_id,
--   auth.role() as current_role;

-- Check if profiles table has the current user
-- SELECT user_id, email, is_admin FROM profiles WHERE user_id = auth.uid();

-- Set current user as admin (uncomment and run once)
-- UPDATE profiles 
-- SET is_admin = true, updated_at = NOW()
-- WHERE user_id = auth.uid();

-- Verify admin status
-- SELECT 
--   user_id, 
--   email, 
--   is_admin, 
--   'Admin setup complete' as status 
-- FROM profiles 
-- WHERE user_id = auth.uid() AND is_admin = true;

-- ============================================================================
-- 5. SAMPLE DATA
-- ============================================================================

-- Insert sample timeline events (will only work if run by admin user)
INSERT INTO timeline_events (type, title, description, date, tags, impact, order_index) 
VALUES
('achievement', 'Won University Hackathon', 'First place in the annual university hackathon with an AI-powered student learning assistant', '2024-01-20', ARRAY['AI', 'React', 'Python', 'OpenAI'], '500+ participants', 1),
('project', 'Launched E-Commerce Platform', 'Built and deployed a full-stack e-commerce solution with payment integration and admin dashboard', '2024-01-15', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'], null, 2),
('contribution', 'Open Source Contribution to React Router', 'Fixed critical bug in route matching algorithm, merged PR with 2.5K+ stars', '2024-01-10', ARRAY['TypeScript', 'React', 'Open Source'], null, 3),
('education', 'Started Data Structures & Algorithms Course', 'Began advanced DSA course focusing on competitive programming and interview preparation', '2024-01-05', ARRAY['Algorithms', 'Computer Science', 'Problem Solving'], null, 4),
('work', 'Frontend Developer Internship', 'Started internship at TechCorp, working on React-based dashboard applications', '2023-12-01', ARRAY['React', 'TypeScript', 'Professional Experience'], '3 month internship', 5),
('commit', 'Major refactor of ML classifier project', 'Improved model accuracy from 87% to 94% through feature engineering and hyperparameter tuning', '2023-11-28', ARRAY['Machine Learning', 'Python', 'TensorFlow'], null, 6),
('achievement', 'Dean''s List Recognition', 'Achieved Dean''s List for academic excellence in Computer Science program', '2023-11-15', ARRAY['Academic Achievement', 'Computer Science'], 'Top 5% of class', 7),
('project', 'Real-time Chat Application', 'Built WebSocket-based chat app with rooms, direct messaging, and file sharing', '2023-11-01', ARRAY['Socket.io', 'React', 'Node.js', 'Real-time'], null, 8),
('education', 'Completed Web Development Bootcamp', 'Intensive 12-week bootcamp covering full-stack development with modern technologies', '2023-10-15', ARRAY['Full-Stack', 'Web Development', 'Bootcamp'], '300+ hours', 9),
('contribution', 'Documentation improvements for Vue.js', 'Contributed to Vue.js documentation with code examples and tutorials', '2023-09-20', ARRAY['Vue.js', 'Documentation', 'Open Source'], null, 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'timeline_events' 
ORDER BY ordinal_position;

-- Verify indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename = 'timeline_events';

-- Verify RLS policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'timeline_events';

-- Count timeline events
SELECT 
  type,
  COUNT(*) as count
FROM timeline_events 
GROUP BY type 
ORDER BY count DESC;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Timeline functionality is now fully set up with:
-- ✅ timeline_events table with proper schema
-- ✅ Performance indexes
-- ✅ RLS policies using profiles.is_admin
-- ✅ Admin permissions (set current user as admin)
-- ✅ Sample data for testing
-- ✅ Verification queries

SELECT 'Timeline setup completed successfully! 🚀' as status;
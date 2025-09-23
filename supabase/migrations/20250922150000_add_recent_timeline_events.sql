-- Add recent timeline events for activity overview testing
-- These events will show up in the GitHub-style contribution graph

INSERT INTO public.timeline_events (type, title, description, date, tags, impact, order_index) 
VALUES
-- Recent commits and contributions (September 2025)
('commit', 'Fixed authentication bug in login system', 'Resolved issue where users could not log in with certain email formats', '2025-09-22', ARRAY['Bug Fix', 'Authentication', 'TypeScript'], null, 100),
('commit', 'Added dark mode toggle to navigation', 'Implemented system-wide dark mode with proper theme persistence', '2025-09-21', ARRAY['UI/UX', 'React', 'CSS'], null, 101),
('commit', 'Optimized database queries in dashboard', 'Reduced load times by 40% through query optimization and indexing', '2025-09-20', ARRAY['Performance', 'Database', 'Optimization'], null, 102),
('contribution', 'Contributed to React Query library', 'Fixed memory leak in cache invalidation mechanism', '2025-09-19', ARRAY['Open Source', 'React Query', 'TypeScript'], null, 103),
('commit', 'Implemented real-time notifications', 'Added WebSocket-based notification system with toast messages', '2025-09-18', ARRAY['WebSocket', 'Real-time', 'Notifications'], null, 104),

-- Projects and achievements
('project', 'Launched Portfolio Showcase Platform', 'Built and deployed the git-folio-showcase platform with full admin capabilities', '2025-09-17', ARRAY['React', 'TypeScript', 'Supabase', 'Portfolio'], null, 105),
('achievement', 'Completed Advanced React Course', 'Finished comprehensive React course covering hooks, context, and performance optimization', '2025-09-16', ARRAY['Education', 'React', 'JavaScript'], '40 hours course', 106),
('commit', 'Added timeline functionality', 'Implemented GitHub-style timeline with events and activity overview', '2025-09-15', ARRAY['Timeline', 'UI/UX', 'React'], null, 107),
('contribution', 'Updated Tailwind CSS documentation', 'Added examples and improved clarity in utility classes documentation', '2025-09-14', ARRAY['Documentation', 'Tailwind CSS', 'Open Source'], null, 108),
('commit', 'Enhanced task management system', 'Added recurring tasks, templates, and improved filtering capabilities', '2025-09-13', ARRAY['Task Management', 'React', 'Database'], null, 109),

-- More recent activity (earlier September)
('project', 'Built API Rate Limiting Middleware', 'Created reusable middleware for API rate limiting with Redis caching', '2025-09-12', ARRAY['API', 'Node.js', 'Redis', 'Middleware'], null, 110),
('commit', 'Improved error handling across application', 'Added comprehensive error boundaries and user-friendly error messages', '2025-09-11', ARRAY['Error Handling', 'React', 'User Experience'], null, 111),
('achievement', 'Published npm package for date utilities', 'Created and published utility library for date formatting and manipulation', '2025-09-10', ARRAY['npm', 'JavaScript', 'Open Source', 'Publishing'], '100+ weekly downloads', 112),
('commit', 'Added comprehensive unit tests', 'Achieved 95% test coverage for core application components', '2025-09-09', ARRAY['Testing', 'Jest', 'React Testing Library'], null, 113),
('contribution', 'Fixed critical bug in Vue.js router', 'Resolved navigation issue affecting mobile users in Vue Router', '2025-09-08', ARRAY['Vue.js', 'Mobile', 'Bug Fix', 'Open Source'], null, 114),

-- August activity (still within 365 days)
('commit', 'Implemented advanced search functionality', 'Added full-text search with filters and sorting capabilities', '2025-08-30', ARRAY['Search', 'Database', 'React'], null, 115),
('project', 'Created Developer Tools Chrome Extension', 'Built Chrome extension for debugging React applications', '2025-08-25', ARRAY['Chrome Extension', 'JavaScript', 'Developer Tools'], null, 116),
('achievement', 'Spoke at Local Tech Meetup', 'Presented on modern React patterns and performance optimization', '2025-08-20', ARRAY['Speaking', 'Community', 'React', 'Meetup'], '50+ attendees', 117),
('commit', 'Added internationalization support', 'Implemented i18n with support for 5 languages', '2025-08-15', ARRAY['i18n', 'Internationalization', 'React'], null, 118),
('contribution', 'Improved accessibility in Material-UI', 'Enhanced keyboard navigation and screen reader support', '2025-08-10', ARRAY['Accessibility', 'Material-UI', 'Open Source'], null, 119),

-- July activity
('commit', 'Optimized bundle size with code splitting', 'Reduced initial bundle size by 60% using dynamic imports', '2025-07-28', ARRAY['Performance', 'Webpack', 'Code Splitting'], null, 120),
('project', 'Built Real-time Collaboration Tool', 'Created collaborative document editor with real-time sync', '2025-07-20', ARRAY['Collaboration', 'WebSocket', 'Real-time', 'React'], null, 121),
('achievement', 'Mentored Junior Developer', 'Successfully onboarded and mentored new team member', '2025-07-15', ARRAY['Mentoring', 'Leadership', 'Team Building'], '3 month program', 122),
('commit', 'Implemented progressive web app features', 'Added service worker and offline functionality', '2025-07-10', ARRAY['PWA', 'Service Worker', 'Offline'], null, 123)

ON CONFLICT (id) DO NOTHING;
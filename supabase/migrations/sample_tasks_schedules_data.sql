-- Sample Data for Enhanced Tasks and Schedules System
-- This file provides comprehensive sample data demonstrating all features

-- First, let's create some sample task templates for quick task creation
INSERT INTO public.task_templates (name, title, description, category, priority, estimated_hours, tags, is_active) VALUES
('daily-standup', 'Daily Team Standup', 'Participate in daily team standup meeting', 'work', 'medium', 0.5, '{"meeting", "team", "agile"}', true),
('code-review', 'Code Review Task', 'Review pull requests and provide feedback', 'work', 'high', 1.0, '{"development", "review", "code"}', true),
('exercise', 'Daily Exercise', 'Complete daily workout routine', 'personal', 'medium', 1.0, '{"health", "fitness", "personal"}', true),
('email-check', 'Check and Respond to Emails', 'Process inbox and respond to important emails', 'work', 'low', 0.5, '{"communication", "admin"}', true),
('learning', 'Learning Session', 'Study new technology or skill', 'personal', 'medium', 2.0, '{"learning", "development", "growth"}', true);

-- Sample schedule templates
INSERT INTO public.schedule_templates (name, title, description, duration_minutes, type, category, color, reminder_minutes, tags, is_active) VALUES
('team-meeting', 'Team Meeting', 'Regular team sync meeting', 60, 'meeting', 'work', '#3b82f6', '{15, 60}', '{"team", "sync", "work"}', true),
('one-on-one', '1:1 Meeting', 'One-on-one meeting with team member', 30, 'meeting', 'work', '#10b981', '{15}', '{"1:1", "management", "work"}', true),
('client-call', 'Client Call', 'Call with client to discuss project progress', 45, 'call', 'work', '#f59e0b', '{30, 60}', '{"client", "call", "business"}', true),
('lunch-break', 'Lunch Break', 'Daily lunch break', 60, 'event', 'personal', '#8b5cf6', '{5}', '{"break", "personal", "health"}', true),
('focus-time', 'Deep Work Session', 'Focused work time with no interruptions', 120, 'event', 'work', '#ef4444', '{10}', '{"focus", "deep-work", "productivity"}', true);

-- Sample tasks with various features
INSERT INTO public.tasks (title, description, due_date, status, priority, category, tags, estimated_hours, actual_hours, assignee_email, notes, is_recurring, recurrence_pattern, order_index) VALUES
-- Regular tasks
('Complete Project Proposal', 'Write and finalize the Q4 project proposal document', '2025-09-25', 'in-progress', 'high', 'work', '{"proposal", "documentation", "Q4"}', 8.0, 3.5, 'john.doe@company.com', 'Started outline, need to add budget section', false, null, 1),

('Setup Development Environment', 'Configure local development environment for new project', '2025-09-24', 'todo', 'medium', 'work', '{"setup", "development", "environment"}', 4.0, null, 'jane.smith@company.com', 'Includes Docker, database setup, and IDE configuration', false, null, 2),

('Review Security Policies', 'Annual review of company security policies and procedures', '2025-09-30', 'todo', 'high', 'work', '{"security", "policies", "compliance"}', 6.0, null, 'security@company.com', 'Focus on remote work guidelines and data protection', false, null, 3),

('Plan Weekend Trip', 'Research and book accommodation for weekend getaway', '2025-09-28', 'todo', 'low', 'personal', '{"travel", "weekend", "planning"}', 2.0, null, null, 'Consider mountain cabin or beach house options', false, null, 4),

('Prepare Presentation', 'Create slides for next week client presentation', '2025-09-26', 'in-progress', 'high', 'work', '{"presentation", "client", "slides"}', 5.0, 2.0, 'presenter@company.com', 'Include demo section and Q4 roadmap', false, null, 5),

-- Recurring tasks
('Daily Exercise', 'Complete 30-minute workout routine', '2025-09-23', 'completed', 'medium', 'personal', '{"health", "fitness", "daily"}', 0.5, 0.5, null, 'Today did cardio and strength training', true, '{"freq": "daily", "interval": 1, "end_date": "2025-12-31"}', 6),

('Team Standup Preparation', 'Prepare updates for daily standup meeting', '2025-09-23', 'completed', 'medium', 'work', '{"standup", "team", "daily"}', 0.25, 0.25, null, 'Prepared yesterday progress and today goals', true, '{"freq": "daily", "interval": 1, "end_date": "2025-12-31"}', 7),

('Weekly Code Review', 'Review team code submissions for the week', '2025-09-27', 'todo', 'high', 'work', '{"code-review", "weekly", "team"}', 2.0, null, 'lead@company.com', 'Focus on new API endpoints and security fixes', true, '{"freq": "weekly", "interval": 1, "days_of_week": [5], "end_date": "2025-12-31"}', 8),

('Monthly Budget Review', 'Review and update personal monthly budget', '2025-09-30', 'todo', 'medium', 'personal', '{"budget", "finance", "monthly"}', 1.0, null, null, 'Include new subscription costs and salary changes', true, '{"freq": "monthly", "interval": 1, "end_date": "2025-12-31"}', 9),

-- Completed tasks
('Setup CI/CD Pipeline', 'Configure automated testing and deployment pipeline', '2025-09-20', 'completed', 'high', 'work', '{"devops", "automation", "pipeline"}', 12.0, 14.5, 'devops@company.com', 'Took longer due to Docker configuration issues, but working well now', false, null, 10),

('Dentist Appointment', 'Regular dental checkup and cleaning', '2025-09-18', 'completed', 'medium', 'personal', '{"health", "appointment", "dental"}', 1.5, 1.5, null, 'All good, next appointment in 6 months', false, null, 11);

-- Update completed_at for completed tasks
UPDATE public.tasks SET completed_at = '2025-09-22 14:30:00+00' WHERE title = 'Daily Exercise' AND status = 'completed';
UPDATE public.tasks SET completed_at = '2025-09-22 09:15:00+00' WHERE title = 'Team Standup Preparation' AND status = 'completed';
UPDATE public.tasks SET completed_at = '2025-09-20 17:45:00+00' WHERE title = 'Setup CI/CD Pipeline';
UPDATE public.tasks SET completed_at = '2025-09-18 11:00:00+00' WHERE title = 'Dentist Appointment';

-- Sample schedules with various features
INSERT INTO public.schedules (title, description, start_time, end_time, location, meeting_url, type, status, category, tags, color, reminder_minutes, notes, task_id, is_recurring, recurrence_rule, attendees) VALUES
-- Regular meetings and events
('Project Kickoff Meeting', 'Initial meeting to discuss new project requirements and timeline', '2025-09-23 10:00:00+00', '2025-09-23 11:30:00+00', 'Conference Room A', 'https://meet.company.com/project-kickoff', 'meeting', 'scheduled', 'meeting', '{"project", "kickoff", "planning"}', '#3b82f6', '{15, 30}', 'Bring laptops for technical discussion', null, false, null, '{"john.doe@company.com", "jane.smith@company.com", "pm@company.com"}'),

('Client Presentation', 'Present Q4 roadmap and feature updates to key client', '2025-09-26 14:00:00+00', '2025-09-26 15:00:00+00', 'Client Office', 'https://zoom.us/j/client-presentation', 'meeting', 'scheduled', 'meeting', '{"client", "presentation", "roadmap"}', '#f59e0b', '{30, 60}', 'Prepare demo environment and backup slides', (SELECT id FROM public.tasks WHERE title = 'Prepare Presentation'), false, null, '{"presenter@company.com", "client@clientcompany.com", "sales@company.com"}'),

('Lunch with Sarah', 'Catch up lunch with college friend', '2025-09-24 12:30:00+00', '2025-09-24 13:30:00+00', 'Downtown Cafe', null, 'event', 'scheduled', 'personal', '{"social", "lunch", "friends"}', '#10b981', '{15}', 'Try their new seasonal menu', null, false, null, '{"sarah.friend@email.com"}'),

('Doctor Appointment', 'Annual physical checkup', '2025-09-27 09:00:00+00', '2025-09-27 10:00:00+00', 'Medical Center', null, 'event', 'scheduled', 'personal', '{"health", "doctor", "checkup"}', '#8b5cf6', '{60, 1440}', 'Bring insurance card and medication list', null, false, null, '{}'),

('Team Workshop', 'Agile methodology workshop for development team', '2025-09-25 13:00:00+00', '2025-09-25 17:00:00+00', 'Training Room B', null, 'event', 'scheduled', 'work', '{"workshop", "agile", "training"}', '#ef4444', '{30}', 'Interactive session with external trainer', null, false, null, '{"team@company.com", "trainer@agilecorp.com"}'),

-- Recurring schedules
('Daily Standup', 'Daily team standup meeting', '2025-09-23 09:00:00+00', '2025-09-23 09:15:00+00', 'Virtual', 'https://meet.company.com/daily-standup', 'meeting', 'completed', 'meeting', '{"standup", "daily", "team"}', '#3b82f6', '{5}', 'Quick sync on progress and blockers', (SELECT id FROM public.tasks WHERE title = 'Team Standup Preparation'), true, '{"freq": "daily", "interval": 1, "end_date": "2025-12-31"}', '{"team@company.com"}'),

('Weekly Team Lunch', 'Team building lunch every Friday', '2025-09-27 12:00:00+00', '2025-09-27 13:00:00+00', 'Office Cafeteria', null, 'event', 'scheduled', 'work', '{"team", "lunch", "weekly"}', '#10b981', '{30}', 'Rotating restaurant selection', null, true, '{"freq": "weekly", "interval": 1, "days_of_week": [5], "end_date": "2025-12-31"}', '{"team@company.com"}'),

('Morning Workout', 'Personal fitness session at gym', '2025-09-23 07:00:00+00', '2025-09-23 08:00:00+00', 'Local Gym', null, 'event', 'completed', 'personal', '{"fitness", "workout", "morning"}', '#ef4444', '{15}', 'Focus on strength training today', (SELECT id FROM public.tasks WHERE title = 'Daily Exercise'), true, '{"freq": "daily", "interval": 1, "end_date": "2025-12-31"}', '{}'),

('Monthly All-Hands', 'Company-wide monthly meeting', '2025-09-30 15:00:00+00', '2025-09-30 16:00:00+00', 'Main Auditorium', 'https://meet.company.com/all-hands', 'meeting', 'scheduled', 'meeting', '{"all-hands", "company", "monthly"}', '#8b5cf6', '{60, 1440}', 'Company updates and Q&A session', null, true, '{"freq": "monthly", "interval": 1, "end_date": "2025-12-31"}', '{"everyone@company.com"}'),

-- Past events
('Code Review Session', 'Weekly code review with senior developers', '2025-09-20 14:00:00+00', '2025-09-20 16:00:00+00', 'Development Room', null, 'meeting', 'completed', 'work', '{"code-review", "development", "weekly"}', '#f59e0b', '{15}', 'Reviewed 8 PRs, identified 3 critical issues', (SELECT id FROM public.tasks WHERE title = 'Weekly Code Review'), false, null, '{"lead@company.com", "senior@company.com"}'),

('Weekend Hiking', 'Mountain hiking trip with friends', '2025-09-21 08:00:00+00', '2025-09-21 16:00:00+00', 'Blue Ridge Mountains', null, 'event', 'completed', 'personal', '{"hiking", "outdoor", "friends"}', '#10b981', '{60}', 'Great weather, completed 12-mile trail', null, false, null, '{"friend1@email.com", "friend2@email.com"}');

-- Sample quick actions for common tasks and schedules
INSERT INTO public.quick_actions (name, type, template_data, icon, color, sort_order, is_active) VALUES
('Quick Task', 'task', '{"title": "", "description": "", "priority": "medium", "category": "general", "estimated_hours": 1.0}', 'plus', '#3b82f6', 1, true),
('Urgent Bug Fix', 'task', '{"title": "Bug Fix: ", "description": "Critical bug that needs immediate attention", "priority": "high", "category": "work", "estimated_hours": 2.0, "tags": ["bug", "urgent"]}', 'alert-triangle', '#ef4444', 2, true),
('Meeting Prep', 'task', '{"title": "Prepare for ", "description": "Preparation tasks for upcoming meeting", "priority": "medium", "category": "work", "estimated_hours": 0.5, "tags": ["meeting", "preparation"]}', 'calendar', '#f59e0b', 3, true),
('Learning Session', 'task', '{"title": "Learn ", "description": "Dedicated time for learning new skills", "priority": "low", "category": "personal", "estimated_hours": 2.0, "tags": ["learning", "development"]}', 'book-open', '#8b5cf6', 4, true),

('Quick Meeting', 'schedule', '{"title": "", "description": "", "duration": 30, "type": "meeting", "category": "meeting", "color": "#3b82f6", "reminder_minutes": [15]}', 'users', '#3b82f6', 5, true),
('Focus Block', 'schedule', '{"title": "Deep Work: ", "description": "Focused work time with no interruptions", "duration": 120, "type": "event", "category": "work", "color": "#ef4444", "reminder_minutes": [10]}', 'focus', '#ef4444', 6, true),
('Coffee Break', 'schedule', '{"title": "Coffee Break", "description": "Short break for coffee and relaxation", "duration": 15, "type": "event", "category": "personal", "color": "#10b981", "reminder_minutes": [5]}', 'coffee', '#10b981', 7, true),
('Client Call', 'schedule', '{"title": "Client Call: ", "description": "Call with client to discuss project", "duration": 45, "type": "call", "category": "meeting", "color": "#f59e0b", "reminder_minutes": [30, 60]}', 'phone', '#f59e0b', 8, true);

-- Sample notifications for upcoming events and task reminders
INSERT INTO public.notifications (title, message, type, reference_type, reference_id, scheduled_for, is_read, is_sent) VALUES
('Upcoming Meeting', 'Project Kickoff Meeting starts in 15 minutes', 'schedule_reminder', 'schedule', (SELECT id FROM public.schedules WHERE title = 'Project Kickoff Meeting'), '2025-09-23 09:45:00+00', false, false),
('Task Due Soon', 'Setup Development Environment is due tomorrow', 'task_due', 'task', (SELECT id FROM public.tasks WHERE title = 'Setup Development Environment'), '2025-09-23 18:00:00+00', false, false),
('Daily Standup Reminder', 'Daily Standup starts in 5 minutes', 'schedule_reminder', 'schedule', (SELECT id FROM public.schedules WHERE title = 'Daily Standup'), '2025-09-23 08:55:00+00', true, true),
('High Priority Task', 'Complete Project Proposal is marked as high priority and due in 2 days', 'task_due', 'task', (SELECT id FROM public.tasks WHERE title = 'Complete Project Proposal'), '2025-09-23 10:00:00+00', false, false),
('Weekly Planning', 'Time for weekly planning and review', 'reminder', 'general', null, '2025-09-23 16:00:00+00', false, false);

-- Sample task dependencies
INSERT INTO public.task_dependencies (task_id, dependent_task_id, dependency_type) VALUES
((SELECT id FROM public.tasks WHERE title = 'Setup Development Environment'), (SELECT id FROM public.tasks WHERE title = 'Complete Project Proposal'), 'blocks'),
((SELECT id FROM public.tasks WHERE title = 'Review Security Policies'), (SELECT id FROM public.tasks WHERE title = 'Setup Development Environment'), 'blocks');

-- Add some recurring event instances (simulating generated recurring events)
-- These would normally be generated by the generate_recurring_events function

-- Daily standup instances for the next few days
INSERT INTO public.schedules (title, description, start_time, end_time, location, meeting_url, type, status, category, tags, color, reminder_minutes, notes, task_id, is_recurring, parent_event_id, original_start_time, attendees) VALUES
('Daily Standup', 'Daily team standup meeting', '2025-09-24 09:00:00+00', '2025-09-24 09:15:00+00', 'Virtual', 'https://meet.company.com/daily-standup', 'meeting', 'scheduled', 'meeting', '{"standup", "daily", "team"}', '#3b82f6', '{5}', 'Quick sync on progress and blockers', null, false, (SELECT id FROM public.schedules WHERE title = 'Daily Standup' AND is_recurring = true), '2025-09-24 09:00:00+00', '{"team@company.com"}'),

('Daily Standup', 'Daily team standup meeting', '2025-09-25 09:00:00+00', '2025-09-25 09:15:00+00', 'Virtual', 'https://meet.company.com/daily-standup', 'meeting', 'scheduled', 'meeting', '{"standup", "daily", "team"}', '#3b82f6', '{5}', 'Quick sync on progress and blockers', null, false, (SELECT id FROM public.schedules WHERE title = 'Daily Standup' AND is_recurring = true), '2025-09-25 09:00:00+00', '{"team@company.com"}'),

-- Morning workout instances
('Morning Workout', 'Personal fitness session at gym', '2025-09-24 07:00:00+00', '2025-09-24 08:00:00+00', 'Local Gym', null, 'event', 'scheduled', 'personal', '{"fitness", "workout", "morning"}', '#ef4444', '{15}', 'Cardio focus today', null, false, (SELECT id FROM public.schedules WHERE title = 'Morning Workout' AND is_recurring = true), '2025-09-24 07:00:00+00', '{}'),

('Morning Workout', 'Personal fitness session at gym', '2025-09-25 07:00:00+00', '2025-09-25 08:00:00+00', 'Local Gym', null, 'event', 'scheduled', 'personal', '{"fitness", "workout", "morning"}', '#ef4444', '{15}', 'Strength training focus', null, false, (SELECT id FROM public.schedules WHERE title = 'Morning Workout' AND is_recurring = true), '2025-09-25 07:00:00+00', '{}');

-- Create some sample project associations (if projects table exists)
-- Note: This assumes a projects table exists with basic structure
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    -- Update tasks with project associations
    UPDATE public.tasks SET project_id = (
      SELECT id FROM public.projects WHERE title ILIKE '%portfolio%' LIMIT 1
    ) WHERE title IN ('Complete Project Proposal', 'Setup Development Environment', 'Prepare Presentation');
    
    UPDATE public.tasks SET project_id = (
      SELECT id FROM public.projects WHERE title ILIKE '%internal%' LIMIT 1
    ) WHERE title IN ('Review Security Policies', 'Setup CI/CD Pipeline');
  END IF;
END $$;

-- Add some sample comments or notes to demonstrate the notes field
UPDATE public.tasks SET notes = CONCAT(COALESCE(notes, ''), E'\n\nProgress Update (', CURRENT_DATE, '): Making good progress on implementation phase.') 
WHERE title = 'Complete Project Proposal';

UPDATE public.schedules SET notes = CONCAT(COALESCE(notes, ''), E'\n\nMeeting Notes: Need to follow up on action items from last discussion.') 
WHERE title = 'Project Kickoff Meeting';

-- Sample data summary statistics
-- This can be run separately to verify the data was inserted correctly
/*
SELECT 
  'Tasks' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress_count,
  COUNT(*) FILTER (WHERE status = 'todo') as todo_count,
  COUNT(*) FILTER (WHERE is_recurring = true) as recurring_count
FROM public.tasks

UNION ALL

SELECT 
  'Schedules' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_count,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
  COUNT(*) FILTER (WHERE is_recurring = true) as recurring_count
FROM public.schedules

UNION ALL

SELECT 
  'Templates' as entity_type,
  (SELECT COUNT(*) FROM public.task_templates) + (SELECT COUNT(*) FROM public.schedule_templates) as total_count,
  (SELECT COUNT(*) FROM public.task_templates WHERE is_active = true) as active_task_templates,
  (SELECT COUNT(*) FROM public.schedule_templates WHERE is_active = true) as active_schedule_templates,
  0 as unused_field,
  0 as unused_field2
  
UNION ALL

SELECT 
  'Quick Actions' as entity_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE type = 'task') as task_actions,
  COUNT(*) FILTER (WHERE type = 'schedule') as schedule_actions,
  COUNT(*) FILTER (WHERE is_active = true) as active_actions,
  0 as unused_field
FROM public.quick_actions;
*/
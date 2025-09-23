-- Enhanced Tasks and Schedules System with Recurring Events and Advanced Features

-- First, let's enhance the existing tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('personal', 'work', 'project', 'academic', 'general'));
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC(4,2);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(4,2);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assignee_email TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recurrence_pattern JSONB;

-- Create task templates table for quick task creation
CREATE TABLE IF NOT EXISTS public.task_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('personal', 'work', 'project', 'academic', 'general')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_hours NUMERIC(4,2),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhance schedules table with recurring events and more features
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'meeting' CHECK (category IN ('meeting', 'appointment', 'event', 'deadline', 'reminder', 'personal', 'work'));
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER[] DEFAULT '{15}';
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL;

-- Recurring events support
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS recurrence_rule JSONB;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE;
ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS original_start_time TIMESTAMP WITH TIME ZONE;

-- Create schedule templates table
CREATE TABLE IF NOT EXISTS public.schedule_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  type TEXT DEFAULT 'meeting' CHECK (type IN ('meeting', 'call', 'event', 'deadline')),
  category TEXT DEFAULT 'meeting' CHECK (category IN ('meeting', 'appointment', 'event', 'deadline', 'reminder', 'personal', 'work')),
  color TEXT DEFAULT '#3b82f6',
  reminder_minutes INTEGER[] DEFAULT '{15}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependent_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'subtask')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, dependent_task_id)
);

-- Create notifications table for reminders
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'reminder' CHECK (type IN ('reminder', 'deadline', 'task_due', 'schedule_reminder')),
  reference_type TEXT CHECK (reference_type IN ('task', 'schedule', 'general')),
  reference_id UUID,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quick actions table for frequently used actions
CREATE TABLE IF NOT EXISTS public.quick_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task', 'schedule')),
  template_data JSONB NOT NULL,
  icon TEXT DEFAULT 'plus',
  color TEXT DEFAULT '#3b82f6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for task_templates
CREATE POLICY "Task templates editable by admin" 
ON public.task_templates 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Task templates viewable by everyone" 
ON public.task_templates 
FOR SELECT 
USING (is_active = true);

-- Create policies for schedule_templates
CREATE POLICY "Schedule templates editable by admin" 
ON public.schedule_templates 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Schedule templates viewable by everyone" 
ON public.schedule_templates 
FOR SELECT 
USING (is_active = true);

-- Create policies for task_dependencies
CREATE POLICY "Task dependencies editable by admin" 
ON public.task_dependencies 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Task dependencies viewable by everyone" 
ON public.task_dependencies 
FOR SELECT 
USING (true);

-- Create policies for notifications
CREATE POLICY "Notifications editable by admin" 
ON public.notifications 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Notifications viewable by everyone" 
ON public.notifications 
FOR SELECT 
USING (true);

-- Create policies for quick_actions
CREATE POLICY "Quick actions editable by admin" 
ON public.quick_actions 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Quick actions viewable by everyone" 
ON public.quick_actions 
FOR SELECT 
USING (is_active = true);

-- Add update triggers for new tables
CREATE TRIGGER update_task_templates_updated_at
BEFORE UPDATE ON public.task_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_templates_updated_at
BEFORE UPDATE ON public.schedule_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_actions_updated_at
BEFORE UPDATE ON public.quick_actions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate recurring events
CREATE OR REPLACE FUNCTION generate_recurring_events(
  parent_schedule_id UUID,
  recurrence_rule JSONB,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS INTEGER AS $$
DECLARE
  parent_schedule RECORD;
  current_iter_date TIMESTAMP WITH TIME ZONE;
  next_date TIMESTAMP WITH TIME ZONE;
  interval_type TEXT;
  interval_value INTEGER;
  days_of_week INTEGER[];
  generated_count INTEGER := 0;
  max_events INTEGER := 100; -- Safety limit
BEGIN
  -- Get parent schedule details
  SELECT * INTO parent_schedule FROM public.schedules WHERE id = parent_schedule_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Extract recurrence parameters
  interval_type := recurrence_rule->>'type'; -- 'daily', 'weekly', 'monthly', 'yearly'
  interval_value := COALESCE((recurrence_rule->>'interval')::INTEGER, 1);
  days_of_week := CASE 
    WHEN recurrence_rule ? 'daysOfWeek' THEN 
      ARRAY(SELECT jsonb_array_elements_text(recurrence_rule->'daysOfWeek'))::INTEGER[]
    ELSE NULL
  END;
  
  current_iter_date := parent_schedule.start_time;
  
  -- Generate recurring events
  WHILE current_iter_date < end_date AND generated_count < max_events LOOP
    -- Calculate next occurrence based on recurrence type
    CASE interval_type
      WHEN 'daily' THEN
        next_date := current_iter_date + (interval_value || ' days')::INTERVAL;
      WHEN 'weekly' THEN
        IF days_of_week IS NOT NULL THEN
          -- Handle specific days of week
          next_date := current_iter_date + '1 day'::INTERVAL;
          WHILE NOT (EXTRACT(DOW FROM next_date)::INTEGER = ANY(days_of_week)) AND next_date < end_date LOOP
            next_date := next_date + '1 day'::INTERVAL;
          END LOOP;
        ELSE
          next_date := current_iter_date + (interval_value || ' weeks')::INTERVAL;
        END IF;
      WHEN 'monthly' THEN
        next_date := current_iter_date + (interval_value || ' months')::INTERVAL;
      WHEN 'yearly' THEN
        next_date := current_iter_date + (interval_value || ' years')::INTERVAL;
      ELSE
        EXIT; -- Unknown interval type
    END CASE;
    
    -- Skip if next date exceeds end date
    IF next_date >= end_date THEN
      EXIT;
    END IF;
    
    -- Create recurring event instance
    INSERT INTO public.schedules (
      title, description, start_time, end_time, type, category, status,
      attendees, location, meeting_url, is_public, color, reminder_minutes,
      notes, tags, is_recurring, parent_event_id, original_start_time
    ) VALUES (
      parent_schedule.title,
      parent_schedule.description,
      next_date,
      next_date + (parent_schedule.end_time - parent_schedule.start_time),
      parent_schedule.type,
      parent_schedule.category,
      'scheduled',
      parent_schedule.attendees,
      parent_schedule.location,
      parent_schedule.meeting_url,
      parent_schedule.is_public,
      parent_schedule.color,
      parent_schedule.reminder_minutes,
      parent_schedule.notes,
      parent_schedule.tags,
      false, -- Individual instances are not recurring
      parent_schedule_id,
      next_date
    );
    
    current_iter_date := next_date;
    generated_count := generated_count + 1;
  END LOOP;
  
  RETURN generated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to create quick task
CREATE OR REPLACE FUNCTION create_quick_task(
  template_id UUID DEFAULT NULL,
  task_data JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
  new_task_id UUID;
  template_data RECORD;
  final_data JSONB;
BEGIN
  -- If template_id provided, merge with template data
  IF template_id IS NOT NULL THEN
    SELECT * INTO template_data FROM public.task_templates WHERE id = template_id AND is_active = true;
    IF FOUND THEN
      final_data := jsonb_build_object(
        'title', COALESCE(task_data->>'title', template_data.title),
        'description', COALESCE(task_data->>'description', template_data.description),
        'category', COALESCE(task_data->>'category', template_data.category),
        'priority', COALESCE(task_data->>'priority', template_data.priority),
        'estimated_hours', COALESCE((task_data->>'estimated_hours')::NUMERIC, template_data.estimated_hours),
        'tags', COALESCE(task_data->'tags', to_jsonb(template_data.tags))
      );
    ELSE
      final_data := task_data;
    END IF;
  ELSE
    final_data := task_data;
  END IF;
  
  -- Create the task
  INSERT INTO public.tasks (
    title, description, category, priority, estimated_hours, tags
  ) VALUES (
    final_data->>'title',
    final_data->>'description',
    COALESCE(final_data->>'category', 'general'),
    COALESCE(final_data->>'priority', 'medium'),
    (final_data->>'estimated_hours')::NUMERIC,
    CASE 
      WHEN final_data ? 'tags' THEN ARRAY(SELECT jsonb_array_elements_text(final_data->'tags'))
      ELSE '{}'::TEXT[]
    END
  ) RETURNING id INTO new_task_id;
  
  RETURN new_task_id;
END;
$$ LANGUAGE plpgsql;

-- Insert some default quick actions
INSERT INTO public.quick_actions (name, type, template_data, icon, color, sort_order) VALUES
('Quick Task', 'task', '{"title": "", "priority": "medium", "category": "general"}', 'plus', '#3b82f6', 1),
('Meeting', 'schedule', '{"title": "", "type": "meeting", "duration_minutes": 60}', 'calendar', '#10b981', 2),
('Deadline', 'schedule', '{"title": "", "type": "deadline", "duration_minutes": 0}', 'clock', '#f59e0b', 3),
('Call', 'schedule', '{"title": "", "type": "call", "duration_minutes": 30}', 'phone', '#8b5cf6', 4);

-- Insert some default task templates
INSERT INTO public.task_templates (name, title, description, category, priority, estimated_hours, tags) VALUES
('Daily Standup', 'Daily Standup Meeting', 'Prepare for daily standup - review yesterday''s work and plan today', 'work', 'medium', 0.25, '{"meeting", "daily"}'),
('Code Review', 'Code Review', 'Review pull request and provide feedback', 'work', 'high', 1, '{"review", "development"}'),
('Documentation', 'Update Documentation', 'Update project documentation', 'work', 'low', 2, '{"documentation", "writing"}'),
('Bug Fix', 'Fix Bug', 'Investigate and fix reported bug', 'work', 'high', 3, '{"bug", "development"}'),
('Research Task', 'Research', 'Research new technology or approach', 'project', 'medium', 4, '{"research", "learning"}');

-- Insert some default schedule templates
INSERT INTO public.schedule_templates (name, title, description, duration_minutes, type, category, color, reminder_minutes, tags) VALUES
('Team Meeting', 'Team Meeting', 'Weekly team sync meeting', 60, 'meeting', 'work', '#3b82f6', '{15, 5}', '{"team", "weekly"}'),
('1-on-1', '1-on-1 Meeting', 'One-on-one meeting with team member', 30, 'meeting', 'work', '#10b981', '{15}', '{"1on1", "personal"}'),
('Client Call', 'Client Call', 'Client consultation call', 45, 'call', 'work', '#f59e0b', '{30, 15}', '{"client", "consultation"}'),
('Workshop', 'Workshop', 'Educational workshop or training session', 120, 'event', 'work', '#8b5cf6', '{60, 30}', '{"workshop", "training"}'),
('Project Deadline', 'Project Deadline', 'Important project milestone deadline', 0, 'deadline', 'work', '#ef4444', '{1440, 720, 60}', '{"deadline", "project"}');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON public.tasks(status, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_is_recurring ON public.tasks(is_recurring) WHERE is_recurring = true;

CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON public.schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_schedules_status_type ON public.schedules(status, type);
CREATE INDEX IF NOT EXISTS idx_schedules_is_recurring ON public.schedules(is_recurring) WHERE is_recurring = true;
CREATE INDEX IF NOT EXISTS idx_schedules_parent_event ON public.schedules(parent_event_id) WHERE parent_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON public.notifications(scheduled_for) WHERE is_sent = false;
CREATE INDEX IF NOT EXISTS idx_notifications_reference ON public.notifications(reference_type, reference_id);
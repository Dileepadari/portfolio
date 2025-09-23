import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'project' | 'academic' | 'general';
  due_date?: string;
  project_id?: string;
  order_index: number;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
  completed_at?: string;
  assignee_email?: string;
  notes?: string;
  is_recurring: boolean;
  recurrence_pattern?: any;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'meeting' | 'call' | 'event' | 'deadline';
  category: 'meeting' | 'appointment' | 'event' | 'deadline' | 'reminder' | 'personal' | 'work';
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees?: string[];
  location?: string;
  meeting_url?: string;
  is_public: boolean;
  color: string;
  reminder_minutes: number[];
  notes?: string;
  tags: string[];
  task_id?: string;
  is_recurring: boolean;
  recurrence_rule?: any;
  recurrence_end_date?: string;
  parent_event_id?: string;
  original_start_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  category: 'personal' | 'work' | 'project' | 'academic' | 'general';
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  duration_minutes: number;
  type: 'meeting' | 'call' | 'event' | 'deadline';
  category: 'meeting' | 'appointment' | 'event' | 'deadline' | 'reminder' | 'personal' | 'work';
  color: string;
  reminder_minutes: number[];
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickAction {
  id: string;
  name: string;
  type: 'task' | 'schedule';
  template_data: any;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Type assertion since the database might not have all the new fields yet
      setData((tasks || []) as Task[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('tasks').insert([task]);
    if (error) throw error;
    await fetchTasks();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchTasks();
  };

  const createQuickTask = async (taskData: Partial<Task>) => {
    const defaultTask = {
      title: taskData.title || 'New Task',
      status: 'todo' as const,
      priority: 'medium' as const,
      category: 'general' as const,
      order_index: 0,
      tags: [],
      is_recurring: false,
      ...taskData
    };
    
    return await createTask(defaultTask);
  };

  const convertTaskToSchedule = async (taskId: string, scheduleData: Partial<Schedule>) => {
    const task = data.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const schedulePayload = {
      title: scheduleData.title || task.title,
      description: scheduleData.description || task.description,
      start_time: scheduleData.start_time!,
      end_time: scheduleData.end_time!,
      type: scheduleData.type || 'event' as const,
      category: scheduleData.category || 'work' as const,
      status: 'scheduled' as const,
      is_public: scheduleData.is_public || false,
      color: scheduleData.color || '#3b82f6',
      reminder_minutes: scheduleData.reminder_minutes || [15],
      tags: [...(task.tags || []), ...(scheduleData.tags || [])],
      is_recurring: false
    };

    const { error } = await supabase
      .from('schedules')
      .insert([schedulePayload]);
    
    if (error) throw error;
    await fetchTasks();
  };

  return { 
    data, 
    loading, 
    error, 
    createTask, 
    createQuickTask,
    updateTask, 
    deleteTask, 
    convertTaskToSchedule,
    refetch: fetchTasks 
  };
};

export function useSchedules() {
  const [data, setData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      const { data: result, error } = await supabase
        .from('schedules')
        .select('*')
        .order('start_time');

      if (error) throw error;
      setData((result || []) as Schedule[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const createSchedule = async (schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('schedules')
      .insert([schedule]);
    
    if (error) throw error;
    // Refetch data
    await fetchSchedules();
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    const { error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    await fetchSchedules();
  };

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    await fetchSchedules();
  };

  return { data, loading, error, createSchedule, updateSchedule, deleteSchedule };
}

export function useContactMessages() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const { data: result, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData((result || []) as ContactMessage[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const createMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { error } = await supabase
      .from('contact_messages')
      .insert([message]);
    
    if (error) throw error;
    return { error: null };
  };

  const updateMessage = async (id: string, updates: Partial<ContactMessage>) => {
    const { error } = await supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    await fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    await fetchMessages();
  };

  return { data, loading, error, createMessage, updateMessage, deleteMessage };
}
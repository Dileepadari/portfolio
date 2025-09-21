import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id?: string;
  order_index: number;
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
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees?: string[];
  location?: string;
  meeting_url?: string;
  is_public: boolean;
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

export function useTasks() {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data: result, error } = await supabase
          .from('tasks')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData((result || []) as Task[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('tasks')
      .insert([task]);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  return { data, loading, error, createTask, updateTask, deleteTask };
}

export function useSchedules() {
  const [data, setData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
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
    }

    fetchSchedules();
  }, []);

  const createSchedule = async (schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('schedules')
      .insert([schedule]);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    const { error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    // Refetch data
    window.location.reload();
  };

  return { data, loading, error, createSchedule, updateSchedule, deleteSchedule };
}

export function useContactMessages() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
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
    }

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
    window.location.reload();
  };

  return { data, loading, error, createMessage, updateMessage };
}
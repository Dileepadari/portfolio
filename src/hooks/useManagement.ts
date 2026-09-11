/**
 * Admin-only reads and writes that the public client cannot see.
 *
 * The contact inbox and unpublished drafts are hidden from the anon role by row
 * level security, so they come back through the gateway instead of PostgREST.
 * Everything here therefore requires a signed-in admin and returns nothing
 * useful without one.
 *
 * @module admin
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { adminApi } from '@/lib/adminApi';
import { useAdmin } from '@/hooks/useAdmin';

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

export interface TaskRequest {
  id: string;
  requester_name: string;
  requester_email: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'project' | 'personal' | 'work';
  due_date?: string;
  due_time?: string;
  estimated_duration?: string;
  budget?: string;
  additional_notes?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

// contact_messages: anyone can submit (public RLS insert policy), but only
// admins can read/update/delete - that part goes through the admin gateway.
export function useContactMessages() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  const fetchMessages = useCallback(async () => {
    if (!isAdmin) {
      setData([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setData(await adminApi.select<ContactMessage>('contact_messages'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const createMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { error } = await supabase
      .from('contact_messages')
      .insert([message]);

    if (error) throw error;
    return { error: null };
  };

  const updateMessage = async (id: string, updates: Partial<ContactMessage>) => {
    await adminApi.update('contact_messages', id, updates);
    await fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    await adminApi.remove('contact_messages', id);
    await fetchMessages();
  };

  return { data, loading, error, createMessage, updateMessage, deleteMessage };
}

// task_requests: same public-insert / admin-only-read shape as
// contact_messages, but with real structured columns instead of parsing
// fields back out of a formatted text blob.
export function useTaskRequests() {
  const [data, setData] = useState<TaskRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  const fetchTaskRequests = useCallback(async () => {
    if (!isAdmin) {
      setData([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setData(await adminApi.select<TaskRequest>('task_requests'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchTaskRequests();
  }, [fetchTaskRequests]);

  const createTaskRequest = async (request: Omit<TaskRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { error } = await supabase.from('task_requests').insert([request]);
    if (error) throw error;
  };

  const updateTaskRequest = async (id: string, updates: Partial<TaskRequest>) => {
    await adminApi.update('task_requests', id, updates);
    await fetchTaskRequests();
  };

  const deleteTaskRequest = async (id: string) => {
    await adminApi.remove('task_requests', id);
    await fetchTaskRequests();
  };

  return { data, loading, error, createTaskRequest, updateTaskRequest, deleteTaskRequest };
}
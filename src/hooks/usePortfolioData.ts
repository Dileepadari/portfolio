import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  medium?: string;
  codeforces?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  avatar_url?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  gpa?: string;
  location?: string;
  description?: string;
  coursework?: string[];
  order_index: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  location?: string;
  description?: string[];
  technologies?: string[];
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  images?: string[];
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  is_private?: boolean;
  stars?: number;
  forks?: number;
  language?: string;
  language_color?: string;
  tags?: string[];
  repository_url?: string;
  updated_at_display?: string;
}

export interface Skill {
  id: string;
  category: string;
  skill_name: string;
  proficiency: number;
  icon_url?: string;
  order_index: number;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date_achieved?: string;
  certificate_url?: string;
  order_index: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  images?: string[];
  published: boolean;
  tags?: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPersonalInfo() {
      try {
        const { data: result, error } = await supabase
          .from('personal_info')
          .select('*')
          .maybeSingle();

        if (error) throw error;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalInfo();
  }, []);

  return { data, loading, error };
}

export function useEducation() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducation() {
      try {
        const { data: result, error } = await supabase
          .from('education')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEducation();
  }, []);

  return { data, loading, error };
}

export function useExperience() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data: result, error } = await supabase
          .from('experience')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, []);

  return { data, loading, error };
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: result, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { data, loading, error };
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const { data: result, error } = await supabase
          .from('skills')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return { data, loading, error };
}

export function useAchievements() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const { data: result, error } = await supabase
          .from('achievements')
          .select('*')
          .order('order_index');

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  return { data, loading, error };
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return { data, loading, error };
}
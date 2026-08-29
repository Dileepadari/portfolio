import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/lib/visitor';
import { adminApi } from '@/lib/adminApi';
import { useAdmin } from '@/hooks/useAdmin';

// Types
export interface PersonalHighlight {
  icon: string;
  title: string;
  description: string;
}

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
  highlights: PersonalHighlight[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
  proficiency: number;
  order_index: number;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  parent_comment_id?: string;
  visitor_id?: string;
  author_name: string;
  author_email?: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  replies?: BlogComment[];
}

export interface BlogLike {
  id: string;
  blog_post_id: string;
  visitor_id: string;
  created_at: string;
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
  github_url?: string;
  live_url?: string;
  image_url?: string;
  images?: string[];
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  is_contributed?: boolean;
  stars?: number;
  forks?: number;
  language?: string;
  language_color?: string;
  tags?: string[];
  category?: string;
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

export interface Course {
  id: string;
  name: string;
  description?: string;
  institution?: string;
  completion_date?: string;
  certificate_url?: string;
  is_favorite: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  external_link?: string;
  image_url?: string;
  published: boolean;
  tags?: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

const memoryCache: Record<string, unknown> = {};

function getCachedData<T>(key: string): T | null {
  if (memoryCache[key] !== undefined) return memoryCache[key] as T;
  try {
    const raw = sessionStorage.getItem(`cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache[key] = parsed;
      return parsed as T;
    }
  } catch (err) {
    void err;
  }
  return null;
}

function setCachedData(key: string, value: unknown): void {
  memoryCache[key] = value;
  try {
    sessionStorage.setItem(`cache_${key}`, JSON.stringify(value));
  } catch (err) {
    void err;
  }
}

export function clearPortfolioCache(key?: string): void {
  if (key) {
    delete memoryCache[key];
    try {
      sessionStorage.removeItem(`cache_${key}`);
    } catch (err) {
      void err;
    }
  } else {
    Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
    try {
      sessionStorage.clear();
    } catch (err) {
      void err;
    }
  }
}

export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(() => getCachedData<PersonalInfo>('personal_info'));
  const [loading, setLoading] = useState(() => !getCachedData<PersonalInfo>('personal_info'));
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('personal_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setData(result);
      setCachedData('personal_info', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<PersonalInfo>('personal_info')) {
      fetchPersonalInfo();
    }
  }, [fetchPersonalInfo]);

  return { data, loading, error, refetch: fetchPersonalInfo };
}

export function useEducation() {
  const [data, setData] = useState<Education[]>(() => getCachedData<Education[]>('education') || []);
  const [loading, setLoading] = useState(() => !getCachedData<Education[]>('education'));
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('education')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(result || []);
      setCachedData('education', result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<Education[]>('education')) {
      fetchEducation();
    }
  }, [fetchEducation]);

  return { data, loading, error, refetch: fetchEducation };
}

export function useExperience() {
  const [data, setData] = useState<Experience[]>(() => getCachedData<Experience[]>('experience') || []);
  const [loading, setLoading] = useState(() => !getCachedData<Experience[]>('experience'));
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(result || []);
      setCachedData('experience', result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<Experience[]>('experience')) {
      fetchExperience();
    }
  }, [fetchExperience]);

  return { data, loading, error, refetch: fetchExperience };
}

export function useProjects() {
  const [data, setData] = useState<Project[]>(() => getCachedData<Project[]>('projects') || []);
  const [loading, setLoading] = useState(() => !getCachedData<Project[]>('projects'));
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(result || []);
      setCachedData('projects', result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<Project[]>('projects')) {
      fetchProjects();
    }
  }, [fetchProjects]);

  return { data, loading, error, refetch: fetchProjects };
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>(() => getCachedData<Skill[]>('skills') || []);
  const [loading, setLoading] = useState(() => !getCachedData<Skill[]>('skills'));
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(result || []);
      setCachedData('skills', result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<Skill[]>('skills')) {
      fetchSkills();
    }
  }, [fetchSkills]);

  return { data, loading, error, refetch: fetchSkills };
}

export function useAchievements() {
  const [data, setData] = useState<Achievement[]>(() => getCachedData<Achievement[]>('achievements') || []);
  const [loading, setLoading] = useState(() => !getCachedData<Achievement[]>('achievements'));
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(result || []);
      setCachedData('achievements', result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getCachedData<Achievement[]>('achievements')) {
      fetchAchievements();
    }
  }, [fetchAchievements]);

  return { data, loading, error, refetch: fetchAchievements };
}

/**
 * Generic read (public, anon key) + write (admin gateway) hook for a simple
 * "list of rows ordered by a column" table - the shape every one of
 * education/experience/skills/achievements/courses/languages shares. New
 * tables should use this instead of hand-copying the fetch/create/update/
 * delete boilerplate above.
 */
function useAdminCrud<T extends { id: string }>(table: string, orderBy: string) {
  const [data, setData] = useState<T[]>(() => getCachedData<T[]>(`crud_${table}`) || []);
  const [loading, setLoading] = useState(() => !getCachedData<T[]>(`crud_${table}`));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.from(table).select('*').order(orderBy);
      if (error) throw error;
      setData((result || []) as T[]);
      setCachedData(`crud_${table}`, result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [table, orderBy]);

  useEffect(() => {
    if (!getCachedData<T[]>(`crud_${table}`)) {
      refetch();
    }
  }, [refetch, table]);

  const create = async (payload: Omit<T, 'id'>) => {
    await adminApi.insert(table, payload);
    await refetch();
  };
  const update = async (id: string, payload: Partial<T>) => {
    await adminApi.update(table, id, payload);
    await refetch();
  };
  const remove = async (id: string) => {
    await adminApi.remove(table, id);
    await refetch();
  };

  return { data, loading, error, refetch, create, update, remove };
}

export function useLanguages() {
  return useAdminCrud<Language>('languages', 'order_index');
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  const fetchBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      // Public reads only ever see published posts (see RLS policy on
      // blog_posts). Admins need drafts too, so they go through the
      // authenticated admin gateway instead, which bypasses RLS.
      if (isAdmin) {
        setData(await adminApi.select<BlogPost>('blog_posts'));
      } else {
        const { data: result, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setData(result || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return { data, loading, error, refetch: fetchBlogPosts };
}

// Blog CRUD operations (admin-only, routed through the admin Edge Function)
export async function addBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  return adminApi.insert<BlogPost>('blog_posts', blogPost);
}

export async function updateBlogPost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
  return adminApi.update<BlogPost>('blog_posts', id, updates);
}

export async function deleteBlogPost(id: string) {
  await adminApi.remove('blog_posts', id);
}

export function useCourses() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { data, loading, error, refetch: fetchCourses };
}

// Blog engagement hooks
export function useBlogComments(blogPostId: string) {
  const [data, setData] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_post_id', blogPostId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Organize comments into threads
      const comments = result || [];
      const threaded = comments.reduce((acc: BlogComment[], comment) => {
        if (!comment.parent_comment_id) {
          acc.push({
            ...comment,
            replies: comments.filter(c => c.parent_comment_id === comment.id)
          });
        }
        return acc;
      }, []);
      
      setData(threaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [blogPostId]);

  useEffect(() => {
    if (blogPostId) {
      fetchComments();
    }
  }, [blogPostId, fetchComments]);

  return { data, loading, error, refetch: fetchComments };
}

export function useBlogLike(blogPostId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const visitorId = getVisitorId();

  const checkLikeStatus = useCallback(async () => {
    try {
      const { data: likes } = await supabase
        .from('blog_likes')
        .select('visitor_id')
        .eq('blog_post_id', blogPostId);

      setLikeCount(likes?.length || 0);
      setIsLiked(!!likes?.some((like) => like.visitor_id === visitorId));
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [blogPostId, visitorId]);

  const toggleLike = async () => {
    try {
      setLoading(true);

      if (isLiked) {
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', blogPostId)
          .eq('visitor_id', visitorId);

        if (!error) {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        }
      } else {
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            blog_post_id: blogPostId,
            visitor_id: visitorId,
          });

        if (!error) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogPostId) {
      checkLikeStatus();
    }
  }, [blogPostId, checkLikeStatus]);

  return { isLiked, likeCount, toggleLike, loading };
}

// Hook to get engagement counts for a blog post
export function useBlogEngagement(blogPostId: string) {
  const [counts, setCounts] = useState({
    likes: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchEngagementCounts = useCallback(async () => {
    if (!blogPostId) return;
    
    try {
      setLoading(true);
      
      // Fetch counts in parallel
      const [likesResult, commentsResult] = await Promise.all([
        supabase.from('blog_likes').select('id', { count: 'exact' }).eq('blog_post_id', blogPostId),
        supabase.from('blog_comments').select('id', { count: 'exact' }).eq('blog_post_id', blogPostId).eq('is_approved', true)
      ]);

      setCounts({
        likes: likesResult.count || 0,
        comments: commentsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching engagement counts:', error);
    } finally {
      setLoading(false);
    }
  }, [blogPostId]);

  useEffect(() => {
    fetchEngagementCounts();
  }, [blogPostId, fetchEngagementCounts]);

  return { counts, loading, refetch: fetchEngagementCounts };
}

// CRUD operations for engagement
export const addBlogComment = async (commentData: Omit<BlogComment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert(commentData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** Deletes a comment the caller owns (RLS checks the x-visitor-id header
 *  matches the comment's visitor_id) - will fail for comments belonging to
 *  someone else. */
export const deleteBlogComment = async (commentId: string) => {
  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

/** Admin moderation: deletes any comment regardless of ownership, via the
 *  service-role admin gateway (bypasses RLS). */
export const adminDeleteBlogComment = async (commentId: string) => {
  await adminApi.remove('blog_comments', commentId);
};

// Site-wide settings (footer text, auth page copy, admin quick links) - a
// small public-readable key/value table, replacing what used to be hardcoded
// strings scattered across Layout.tsx, Auth.tsx, and Navigation.tsx.
export interface AdminQuickLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  footer_text?: string;
  footer_github_url?: string;
  auth_title?: string;
  auth_description?: string;
  admin_quick_links?: AdminQuickLink[];
}

const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  footer_text: 'Dileepadari',
  footer_github_url: 'https://github.com/dileepadari/portfolio',
  auth_title: 'Admin Sign In',
  auth_description: "This is Dileep Adari's portfolio. Only authorized users can access admin features.",
  admin_quick_links: [],
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) throw error;
      const merged = { ...SITE_SETTINGS_DEFAULTS };
      for (const row of data || []) {
        (merged as Record<string, unknown>)[row.key] = row.value;
      }
      setSettings(merged);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = async <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    await adminApi.upsert('site_settings', { key, value }, 'key');
    await fetchSettings();
  };

  return { settings, loading, updateSetting, refetch: fetchSettings };
}


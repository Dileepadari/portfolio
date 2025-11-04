import { useState, useEffect, useCallback } from 'react';
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

export interface BlogComment {
  id: string;
  blog_post_id: string;
  parent_comment_id?: string;
  user_id?: string;
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
  user_id?: string;
  user_ip?: string;
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
  images?: string[];
  published: boolean;
  tags?: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  type: 'commit' | 'project' | 'achievement' | 'education' | 'work' | 'contribution' | 'task' | 'schedule';
  title: string;
  description: string;
  date: string;
  repository?: string;
  language?: string;
  language_color?: string;
  tags?: string[];
  link?: string;
  impact?: string;
  metadata?: Record<string, unknown>;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityStats {
  totalEvents: number;
  projects: number;
  achievements: number;
  contributions: number;
  commits: number;
  tasks: number;
  schedules: number;
  recentActivity: {
    date: string;
    count: number;
    types: string[];
  }[];
}

export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return { data, loading, error, refetch: fetchPersonalInfo };
}

export function useEducation() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return { data, loading, error, refetch: fetchEducation };
}

export function useExperience() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return { data, loading, error, refetch: fetchExperience };
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { data, loading, error, refetch: fetchProjects };
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return { data, loading, error, refetch: fetchSkills };
}

export function useAchievements() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return { data, loading, error, refetch: fetchAchievements };
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return { data, loading, error, refetch: fetchBlogPosts };
}

// Blog CRUD operations
export async function addBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([blogPost])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
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

  const checkLikeStatus = useCallback(async () => {
    try {
      const { data: likeCountData } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_post_id', blogPostId);

      setLikeCount(likeCountData?.length || 0);

      // Check if current user/IP has liked
      const { data: userLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_post_id', blogPostId)
        .limit(1);

      setIsLiked((userLike?.length || 0) > 0);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [blogPostId]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', blogPostId);
        
        if (!error) {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        }
      } else {
        // Like
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            blog_post_id: blogPostId,
            user_ip: null // Will be handled by database
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

export const deleteBlogComment = async (commentId: string) => {
  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

export const updateBlogComment = async (commentId: string, updates: Partial<BlogComment>) => {
  const { data, error } = await supabase
    .from('blog_comments')
    .update(updates)
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Timeline Events Hooks
export function useTimelineEvents() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimelineEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // supabase client is strongly typed to known table names; use a narrow exception here
      const { data, error, count: _count } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('timeline_events' as any)
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      const events = (data as unknown as TimelineEvent[]) || [];
      setTimelineEvents(events);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timeline events');
      setTimelineEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelineEvents();
  }, [fetchTimelineEvents]);

  return { timelineEvents, loading, error, refetch: fetchTimelineEvents };
}

export function useTimelineManagement() {
  const [loading, setLoading] = useState(false);

  // Add a function to check user permissions
  const checkUserPermissions = async () => {
    const { data: { user }, error: _authError } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user has admin privileges
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    } else if (!profile || !profile.is_admin) {
      throw new Error('User does not have admin permissions required for timeline management');
    }
    
    return { user, profile };
  };

  const addTimelineEvent = async (eventData: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Check user permissions first
      await checkUserPermissions();
      
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('timeline_events' as any)
        .insert([{
          ...eventData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      return data as unknown as TimelineEvent;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Failed to add timeline event');
    } finally {
      setLoading(false);
    }
  };

  const updateTimelineEvent = async (id: string, updates: Partial<TimelineEvent>) => {
    try {
      setLoading(true);
      
      // Check user permissions first
      await checkUserPermissions();
      
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('timeline_events' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from update operation');
      }
      
      return data as unknown as TimelineEvent;
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Failed to update timeline event');
    } finally {
      setLoading(false);
    }
  };

  const deleteTimelineEvent = async (id: string) => {
    try {
      setLoading(true);
      
      // Check user permissions first
      await checkUserPermissions();
      
      // Perform the delete
      const { data: deletedData, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('timeline_events' as any)
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      // Check if anything was actually deleted
      if (!deletedData || deletedData.length === 0) {
        throw new Error('No records were deleted - this might be a permissions issue');
      }
      
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Failed to delete timeline event');
    } finally {
      setLoading(false);
    }
  };

  return { addTimelineEvent, updateTimelineEvent, deleteTimelineEvent, loading };
}

// Activity Overview Hook
export function useActivityOverview() {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch timeline events
      const { data: timelineData, error: timelineError } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('timeline_events' as any)
        .select('type, date, created_at, title');

      if (timelineError) {
        throw timelineError;
      }

      // Fetch schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('start_time, created_at, type, title, status')
        .order('start_time', { ascending: false });

      if (schedulesError) {
        throw schedulesError;
      }

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('due_date, created_at, status, title, updated_at')
        .order('created_at', { ascending: false });

      if (tasksError) {
        throw tasksError;
      }

      // Normalize data
  const events = (timelineData as unknown as TimelineEvent[]) || [];
  const schedules = (schedulesData as { start_time?: string; created_at?: string; type?: string; title?: string; status?: string }[]) || [];
  const tasks = (tasksData as { due_date?: string; created_at?: string; updated_at?: string }[]) || [];

  // Calculate stats from all sources
  const totalEvents = events.length + schedules.length + tasks.length;
      
  const projects = events.filter((e: TimelineEvent) => e.type === 'project').length;
  const achievements = events.filter((e: TimelineEvent) => e.type === 'achievement').length;
  const contributions = events.filter((e: TimelineEvent) => e.type === 'contribution').length;
  const commits = events.filter((e: TimelineEvent) => e.type === 'commit').length;
  const timelineTasks = events.filter((e: TimelineEvent) => e.type === 'task').length;
  const actualTasks = tasks.length;
  const schedulesCount = schedules.length;

      // Calculate recent activity (last 365 days for GitHub-style graph)
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);

      const recentEvents = events.filter((e: TimelineEvent) => new Date(e.date || e.created_at) >= oneYearAgo);
      const recentSchedules = schedules.filter((s) => new Date(s.start_time || s.created_at) >= oneYearAgo);
      const recentTasks = tasks.filter((t) => {
        const taskDate = t.due_date || t.updated_at || t.created_at;
        return new Date(taskDate) >= oneYearAgo;
      });

      // Create activity map for all 365 days
      const activityMap = new Map<string, { count: number; types: Set<string> }>();
      
      // Initialize all 365 days with zero activity
      for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        activityMap.set(dateStr, { count: 0, types: new Set() });
      }
      
      // Fill in timeline events activity
      recentEvents.forEach((item: TimelineEvent) => {
        const date = new Date(item.date || item.created_at).toISOString().split('T')[0];
        if (activityMap.has(date)) {
          const activity = activityMap.get(date)!;
          activity.count++;
          activity.types.add(item.type || 'timeline');
        }
      });

      // Fill in schedules activity
      recentSchedules.forEach((item) => {
        const date = new Date(item.start_time || item.created_at).toISOString().split('T')[0];
        if (activityMap.has(date)) {
          const activity = activityMap.get(date)!;
          activity.count++;
          activity.types.add('schedule');
        }
      });

      // Fill in tasks activity
      recentTasks.forEach((item) => {
        // Use due_date if available, otherwise use updated_at (for completion), then created_at
        const taskDate = item.due_date || item.updated_at || item.created_at;
        const date = new Date(taskDate).toISOString().split('T')[0];
        if (activityMap.has(date)) {
          const activity = activityMap.get(date)!;
          activity.count++;
          activity.types.add('task');
        }
      });

      // Convert to sorted array (oldest to newest for proper grid display)
      const recentActivity = Array.from(activityMap.entries())
        .map(([date, { count, types }]) => ({
          date,
          count,
          types: Array.from(types)
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setStats({
        totalEvents,
        projects,
        achievements,
        contributions,
        commits,
        tasks: timelineTasks + actualTasks,
        schedules: schedulesCount,
        recentActivity
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityStats();
  }, [fetchActivityStats]);

  return { stats, loading, error, refetch: fetchActivityStats };
}
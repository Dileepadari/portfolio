import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSchedules, useTasks } from "@/hooks/useManagement";
import type { Schedule as ScheduleType, Task as TaskType } from "@/hooks/useManagement";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Code,
  Users,
  Coffee,
  Target,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Search
} from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, addHours } from "date-fns";

// Local narrow types to avoid using `any` in handlers
type LocalScheduleCategory = "meeting" | "appointment" | "event" | "deadline" | "reminder" | "personal" | "work";
type LocalScheduleType = "meeting" | "call" | "event" | "deadline";
type LocalScheduleStatus = "scheduled" | "completed" | "cancelled";
type LocalTaskPriority = "low" | "medium" | "high";
type LocalTaskCategory = "personal" | "work" | "project" | "academic" | "general";
type LocalTaskStatus = "todo" | "in-progress" | "completed";

export function Schedule() {
  const { toast } = useToast();
  
  // Hooks for data management
  const {
    data: schedules,
    loading: schedulesLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule
  } = useSchedules();
  
  const {
    data: tasks,
    loading: tasksLoading,
    createTask,
    updateTask,
    deleteTask,
    convertTaskToSchedule: _convertTaskToSchedule
  } = useTasks();

  // State management
  const [_selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleType | null>(null);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  // Form data for creating/editing schedules
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    meeting_url: "",
    category: "meeting" as "meeting" | "appointment" | "event" | "deadline" | "reminder" | "personal" | "work",
    type: "meeting" as "meeting" | "call" | "event" | "deadline",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
    attendees: [] as string[],
    tags: "",
    color: "#3b82f6",
    is_public: false,
    reminder_minutes: [15],
    notes: "",
    is_recurring: false,
    recurrence_rule: null as { freq?: string; interval?: number } | null,
    recurrence_end_date: "",
    parent_event_id: "",
    original_start_time: "",
    task_id: ""
  });

  // Form data for creating/editing tasks
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: "medium" as "low" | "medium" | "high",
    category: "personal" as "personal" | "work" | "project" | "academic" | "general",
    status: "todo" as "todo" | "in-progress" | "completed",
    tags: "",
    estimated_hours: 1,
    actual_hours: 0,
    order_index: 0,
    is_recurring: false,
    recurrence_pattern: null as { freq?: string; interval?: number } | null,
    notes: "",
    assignee_email: "",
    project_id: "",
    completed_at: ""
  });

  // Load data on component mount
  useEffect(() => {
    // Data is automatically loaded by the hooks
  }, []);

  // Utility functions for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      case 'in-progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'pending': return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'work': return <Users className="w-4 h-4" />;
      case 'personal': return <Coffee className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meeting': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'class': return 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20';
      case 'deadline': return 'text-red-500 bg-red-500/10 border-red-500/20 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20';
      case 'exam': return 'text-orange-500 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-400/10 dark:border-orange-400/20';
      case 'personal': return 'text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      case 'event': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400 dark:bg-indigo-400/10 dark:border-indigo-400/20';
      case 'appointment': return 'text-teal-500 bg-teal-500/10 border-teal-500/20 dark:text-teal-400 dark:bg-teal-400/10 dark:border-teal-400/20';
      case 'reminder': return 'text-pink-500 bg-pink-500/10 border-pink-500/20 dark:text-pink-400 dark:bg-pink-400/10 dark:border-pink-400/20';
      case 'work': return 'text-slate-500 bg-slate-500/10 border-slate-500/20 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'text-blue-600 bg-blue-600/10 border-blue-600/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'call': return 'text-green-600 bg-green-600/10 border-green-600/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      case 'event': return 'text-purple-600 bg-purple-600/10 border-purple-600/20 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20';
      case 'deadline': return 'text-red-600 bg-red-600/10 border-red-600/20 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };

  // Data filtering and processing
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = taskFilter === "all" || task.status === taskFilter;
    const matchesSearch = searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    // Handle both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss+00:00" formats
    const taskDate = format(new Date(task.due_date), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    return taskDate === today;
  });

  const todaySchedules = schedules.filter(schedule => {
    const scheduleDate = format(new Date(schedule.start_time), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    return scheduleDate === today;
  });

  const upcomingTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) > new Date() && task.status !== 'completed'
  ).slice(0, 5);

  const upcomingSchedules = schedules.filter(schedule => 
    new Date(schedule.start_time) >= new Date()
  ).slice(0, 5);

  // Separate past and future schedules
  const futureSchedules = schedules.filter(schedule => 
    new Date(schedule.start_time) > new Date()
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const pastSchedules = schedules.filter(schedule => 
    new Date(schedule.start_time) <= new Date()
  ).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // Week navigation
  const getWeekDays = () => {
    const start = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'next' ? addWeeks(currentWeek, 1) : subWeeks(currentWeek, 1));
  };

  // Form handlers
  const handleCreateSchedule = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Build a payload that matches the Schedule type (avoid `null` values)
      const scheduleData: Omit<ScheduleType, 'id' | 'created_at' | 'updated_at'> = {
        title: scheduleForm.title,
        description: scheduleForm.description || undefined,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        location: scheduleForm.location?.trim() || undefined,
        meeting_url: scheduleForm.meeting_url?.trim() || undefined,
        category: scheduleForm.category,
        type: scheduleForm.type,
        status: scheduleForm.status,
        attendees: scheduleForm.attendees || [],
        tags: scheduleForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        color: scheduleForm.color,
        is_public: scheduleForm.is_public,
        reminder_minutes: scheduleForm.reminder_minutes,
        notes: scheduleForm.notes || undefined,
        is_recurring: scheduleForm.is_recurring,
        recurrence_rule: scheduleForm.is_recurring ? scheduleForm.recurrence_rule : undefined,
        recurrence_end_date: scheduleForm.recurrence_end_date || undefined,
        parent_event_id: scheduleForm.parent_event_id || undefined,
        original_start_time: scheduleForm.original_start_time || undefined,
        task_id: scheduleForm.task_id || undefined
      };

      await createSchedule(scheduleData);
      setShowCreateDialog(false);
      setScheduleForm({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        location: "",
        meeting_url: "",
        category: "meeting",
        type: "meeting",
        status: "scheduled",
        attendees: [],
        tags: "",
        color: "#3b82f6",
        is_public: false,
        reminder_minutes: [15],
        notes: "",
        is_recurring: false,
        recurrence_rule: null,
        recurrence_end_date: "",
        parent_event_id: "",
        original_start_time: "",
        task_id: ""
      });
      
      toast({
        title: "Schedule created",
        description: "Your schedule has been created successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Create schedule error:', message);
      toast({
        title: "Error",
        description: `Failed to create schedule. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Prepare task data with proper formatting and filtering (avoid `null`)
      const taskData: Omit<TaskType, 'id' | 'created_at' | 'updated_at'> = {
        title: taskForm.title,
        description: taskForm.description || undefined,
        due_date: taskForm.due_date || undefined,
        status: taskForm.status,
        priority: taskForm.priority,
        category: taskForm.category,
        estimated_hours: taskForm.estimated_hours || undefined,
        actual_hours: taskForm.actual_hours || undefined,
        notes: taskForm.notes || undefined,
        is_recurring: taskForm.is_recurring,
        order_index: tasks.length, // Set to current length for proper ordering
        tags: taskForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Only include optional fields if they have values
      if (taskForm.assignee_email && taskForm.assignee_email.trim()) {
        taskData.assignee_email = taskForm.assignee_email.trim();
      }

      if (taskForm.project_id && taskForm.project_id.trim()) {
        taskData.project_id = taskForm.project_id.trim();
      }

      if (taskForm.completed_at && taskForm.completed_at.trim()) {
        taskData.completed_at = taskForm.completed_at;
      }

      if (taskForm.is_recurring && taskForm.recurrence_pattern) {
        taskData.recurrence_pattern = taskForm.recurrence_pattern;
      }
      
      await createTask(taskData);
      setShowCreateTaskDialog(false);
      setTaskForm({
        title: "",
        description: "",
        due_date: format(new Date(), 'yyyy-MM-dd'),
        priority: "medium",
        category: "personal",
        status: "todo",
        tags: "",
        estimated_hours: 1,
        actual_hours: 0,
        order_index: 0,
        is_recurring: false,
        recurrence_pattern: null,
        notes: "",
        assignee_email: "",
        project_id: "",
        completed_at: ""
      });
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Create task error:', message);
      toast({
        title: "Error",
        description: `Failed to create task. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleTaskToSchedule = async (task: TaskType) => {
    try {
      const scheduleData = {
        title: task.title,
        description: task.description || "",
        start_time: task.due_date ? `${task.due_date}T09:00:00` : new Date().toISOString(),
        end_time: task.due_date ? `${task.due_date}T10:00:00` : new Date().toISOString(),
        type: "deadline" as const,
        category: "work" as const,
        status: "scheduled" as const,
        tags: task.tags || [],
        color: "#f59e0b",
        is_public: false,
        reminder_minutes: [15],
        is_recurring: false,
        task_id: task.id
      };
      
      await createSchedule(scheduleData);
      toast({
        title: "Task converted",
        description: "Task has been converted to a schedule successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Convert task to schedule error:', message);
      toast({
        title: "Error",
        description: `Failed to convert task to schedule. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteSchedule(id);
      toast({
        title: "Schedule deleted",
        description: "The schedule has been deleted successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Delete schedule error:', message);
      toast({
        title: "Error",
        description: `Failed to delete schedule. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Delete task error:', message);
      toast({
        title: "Error",
        description: `Failed to delete task. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditSchedule = (schedule: ScheduleType) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      title: schedule.title,
      description: schedule.description || "",
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      location: schedule.location || "",
      meeting_url: schedule.meeting_url || "",
      category: schedule.category,
      type: schedule.type,
      status: schedule.status,
      attendees: schedule.attendees || [],
      tags: schedule.tags.join(', '),
      color: schedule.color,
      is_public: schedule.is_public,
      reminder_minutes: schedule.reminder_minutes,
      notes: schedule.notes || "",
      is_recurring: schedule.is_recurring,
      recurrence_rule: schedule.recurrence_rule,
      recurrence_end_date: schedule.recurrence_end_date || "",
      parent_event_id: schedule.parent_event_id || "",
      original_start_time: schedule.original_start_time || "",
      task_id: schedule.task_id || ""
    });
    setShowEditDialog(true);
  };

  const handleEditTask = (task: TaskType) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || format(new Date(), 'yyyy-MM-dd'),
      priority: task.priority,
      category: task.category,
      status: task.status,
      tags: task.tags.join(', '),
      estimated_hours: task.estimated_hours || 1,
      actual_hours: task.actual_hours || 0,
      order_index: task.order_index,
      is_recurring: task.is_recurring,
      recurrence_pattern: task.recurrence_pattern,
      notes: task.notes || "",
      assignee_email: task.assignee_email || "",
      project_id: task.project_id || "",
      completed_at: task.completed_at || ""
    });
    setShowEditTaskDialog(true);
  };

  const handleUpdateSchedule = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingSchedule) return;
    
    try {
      // Prepare schedule data with proper formatting and filtering (avoid nulls)
      const scheduleData: Partial<ScheduleType> = {
        title: scheduleForm.title,
        description: scheduleForm.description || undefined,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        type: scheduleForm.type,
        category: scheduleForm.category,
        status: scheduleForm.status,
        color: scheduleForm.color,
        reminder_minutes: scheduleForm.reminder_minutes,
        notes: scheduleForm.notes || undefined,
        is_recurring: scheduleForm.is_recurring,
        is_public: scheduleForm.is_public,
        tags: scheduleForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        attendees: scheduleForm.attendees || []
      };

      // Only include optional fields if they have values
      if (scheduleForm.location && scheduleForm.location.trim()) {
        scheduleData.location = scheduleForm.location.trim();
      }

      if (scheduleForm.meeting_url && scheduleForm.meeting_url.trim()) {
        scheduleData.meeting_url = scheduleForm.meeting_url.trim();
      }

      if (scheduleForm.task_id && scheduleForm.task_id.trim()) {
        scheduleData.task_id = scheduleForm.task_id.trim();
      }

      if (scheduleForm.is_recurring && scheduleForm.recurrence_rule) {
        scheduleData.recurrence_rule = scheduleForm.recurrence_rule;
      }

      if (scheduleForm.recurrence_end_date && scheduleForm.recurrence_end_date.trim()) {
        scheduleData.recurrence_end_date = scheduleForm.recurrence_end_date;
      }

      if (scheduleForm.parent_event_id && scheduleForm.parent_event_id.trim()) {
        scheduleData.parent_event_id = scheduleForm.parent_event_id.trim();
      }

      if (scheduleForm.original_start_time && scheduleForm.original_start_time.trim()) {
        scheduleData.original_start_time = scheduleForm.original_start_time;
      }
      
      await updateSchedule(editingSchedule.id, scheduleData);
      setShowEditDialog(false);
      setEditingSchedule(null);
      
      toast({
        title: "Schedule updated",
        description: "Your schedule has been updated successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Update schedule error:', message);
      toast({
        title: "Error",
        description: `Failed to update schedule. ${message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingTask) return;
    
    try {
      // Prepare task data with proper formatting and filtering
      const taskData: Partial<TaskType> = {
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: taskForm.due_date || null,
        status: taskForm.status,
        priority: taskForm.priority,
        category: taskForm.category,
        estimated_hours: taskForm.estimated_hours || null,
        actual_hours: taskForm.actual_hours || null,
        notes: taskForm.notes || null,
        is_recurring: taskForm.is_recurring,
        tags: taskForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Only include optional fields if they have values
      if (taskForm.assignee_email && taskForm.assignee_email.trim()) {
        taskData.assignee_email = taskForm.assignee_email.trim();
      }

      if (taskForm.project_id && taskForm.project_id.trim()) {
        taskData.project_id = taskForm.project_id.trim();
      }

      if (taskForm.completed_at && taskForm.completed_at.trim()) {
        taskData.completed_at = taskForm.completed_at;
      }

      if (taskForm.is_recurring && taskForm.recurrence_pattern) {
        taskData.recurrence_pattern = taskForm.recurrence_pattern;
      }
      
      await updateTask(editingTask.id, taskData);
      setShowEditTaskDialog(false);
      setEditingTask(null);
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Update task error:', message);
      toast({
        title: "Error",
        description: `Failed to update task. ${message}`,
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (schedulesLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Schedule & Tasks</h1>
            <p className="text-muted-foreground text-lg">Stay organized and productive</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCreateTaskDialog} onOpenChange={setShowCreateTaskDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Quick Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Title *</Label>
                    <Input
                      id="task-title"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                      placeholder="Enter task title..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                      placeholder="Task description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-due-date">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={taskForm.due_date}
                        onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-status">Status</Label>
                      <Select value={taskForm.status} onValueChange={(value: LocalTaskStatus) => setTaskForm({...taskForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select value={taskForm.priority} onValueChange={(value: LocalTaskPriority) => setTaskForm({...taskForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-category">Category</Label>
                      <Select value={taskForm.category} onValueChange={(value: LocalTaskCategory) => setTaskForm({...taskForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-estimated">Estimated Hours</Label>
                      <Input
                        id="task-estimated"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={taskForm.estimated_hours}
                        onChange={(e) => setTaskForm({...taskForm, estimated_hours: parseFloat(e.target.value) || 1})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-actual">Actual Hours</Label>
                      <Input
                        id="task-actual"
                        type="number"
                        min="0"
                        step="0.5"
                        value={taskForm.actual_hours}
                        onChange={(e) => setTaskForm({...taskForm, actual_hours: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-assignee">Assignee Email</Label>
                    <Input
                      id="task-assignee"
                      type="email"
                      value={taskForm.assignee_email}
                      onChange={(e) => setTaskForm({...taskForm, assignee_email: e.target.value})}
                      placeholder="assignee@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-project">Project ID</Label>
                    <Input
                      id="task-project"
                      value={taskForm.project_id}
                      onChange={(e) => setTaskForm({...taskForm, project_id: e.target.value})}
                      placeholder="Optional project identifier"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-tags">Tags (comma separated)</Label>
                    <Input
                      id="task-tags"
                      value={taskForm.tags}
                      onChange={(e) => setTaskForm({...taskForm, tags: e.target.value})}
                      placeholder="work, urgent, project..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-notes">Notes</Label>
                    <Textarea
                      id="task-notes"
                      value={taskForm.notes}
                      onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="task-recurring"
                        checked={taskForm.is_recurring}
                        onCheckedChange={(checked) => setTaskForm({...taskForm, is_recurring: !!checked})}
                      />
                      <Label htmlFor="task-recurring">Recurring task</Label>
                    </div>
                    
                    {taskForm.is_recurring && (
                      <div className="ml-6 space-y-3 p-3 border rounded-lg bg-muted/30">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Recurrence Pattern</Label>
                            <Select 
                              value={taskForm.recurrence_pattern?.freq || 'DAILY'} 
                              onValueChange={(value) => setTaskForm({
                                ...taskForm, 
                                recurrence_pattern: {...(taskForm.recurrence_pattern || {}), freq: value}
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Interval</Label>
                            <Input
                              type="number"
                              min="1"
                              value={taskForm.recurrence_pattern?.interval || 1}
                              onChange={(e) => setTaskForm({
                                ...taskForm,
                                recurrence_pattern: {...(taskForm.recurrence_pattern || {}), interval: parseInt(e.target.value) || 1}
                              })}
                              placeholder="Every X days/weeks/months"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {taskForm.status === 'completed' && (
                    <div className="grid gap-2">
                      <Label htmlFor="task-completed">Completed At</Label>
                      <Input
                        id="task-completed"
                        type="datetime-local"
                        value={taskForm.completed_at}
                        onChange={(e) => setTaskForm({...taskForm, completed_at: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateTaskDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleCreateTask} 
                    disabled={!taskForm.title}
                  >
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Event
            </Button>
          </div>
        </div>

        {/* Edit Schedule Dialog */}
        <Dialog open={showEditDialog} onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditingSchedule(null);
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
            </DialogHeader>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpdateSchedule();
              }}
            >
              <div 
                className="grid gap-4 py-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule-title">Title *</Label>
                <Input
                  id="edit-schedule-title"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                  placeholder="Enter event title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule-description">Description</Label>
                <Textarea
                  id="edit-schedule-description"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                  placeholder="Event description..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-start">Start Time *</Label>
                  <Input
                    id="edit-schedule-start"
                    type="datetime-local"
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-end">End Time *</Label>
                  <Input
                    id="edit-schedule-end"
                    type="datetime-local"
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-category">Category</Label>
                  <Select value={scheduleForm.category} onValueChange={(value: LocalScheduleCategory) => setScheduleForm({...scheduleForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-type">Type</Label>
                  <Select value={scheduleForm.type} onValueChange={(value: LocalScheduleType) => setScheduleForm({...scheduleForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-status">Status</Label>
                  <Select value={scheduleForm.status} onValueChange={(value: LocalScheduleStatus) => setScheduleForm({...scheduleForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-location">Location</Label>
                  <Input
                    id="edit-schedule-location"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                    placeholder="Location or meeting room..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule-color">Color</Label>
                  <Input
                    id="edit-schedule-color"
                    type="color"
                    value={scheduleForm.color}
                    onChange={(e) => setScheduleForm({...scheduleForm, color: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule-notes">Notes</Label>
                <Textarea
                  id="edit-schedule-notes"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!scheduleForm.title || !scheduleForm.start_time || !scheduleForm.end_time}
              >
                Update Schedule
              </Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={showEditTaskDialog} onOpenChange={(open) => {
          setShowEditTaskDialog(open);
          if (!open) setEditingTask(null);
        }}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-task-title">Title *</Label>
                <Input
                  id="edit-task-title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea
                  id="edit-task-description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-due-date">Due Date</Label>
                  <Input
                    id="edit-task-due-date"
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-status">Status</Label>
                  <Select value={taskForm.status} onValueChange={(value: LocalTaskStatus) => setTaskForm({...taskForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-priority">Priority</Label>
                  <Select value={taskForm.priority} onValueChange={(value: LocalTaskPriority) => setTaskForm({...taskForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-category">Category</Label>
                  <Select value={taskForm.category} onValueChange={(value: LocalTaskCategory) => setTaskForm({...taskForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-estimated">Estimated Hours</Label>
                  <Input
                    id="edit-task-estimated"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={taskForm.estimated_hours}
                    onChange={(e) => setTaskForm({...taskForm, estimated_hours: parseFloat(e.target.value) || 1})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-actual">Actual Hours</Label>
                  <Input
                    id="edit-task-actual"
                    type="number"
                    min="0"
                    step="0.5"
                    value={taskForm.actual_hours}
                    onChange={(e) => setTaskForm({...taskForm, actual_hours: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-task-notes">Notes</Label>
                <Textarea
                  id="edit-task-notes"
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditTaskDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleUpdateTask} 
                disabled={!taskForm.title}
              >
                Update Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border-border mb-6">
            <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:text-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-muted-foreground data-[state=active]:text-foreground">
              <Target className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="schedules" className="text-muted-foreground data-[state=active]:text-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Schedules
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-muted-foreground data-[state=active]:text-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Calendar */}
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {format(currentWeek, 'MMMM yyyy')}
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigateWeek('prev')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCurrentWeek(new Date())}
                        className="text-muted-foreground hover:text-foreground text-xs px-2"
                      >
                        Today
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigateWeek('next')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                    {getWeekDays().map((date) => {
                      const daySchedules = schedules.filter(schedule => 
                        format(new Date(schedule.start_time), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      );
                      const dayTasks = tasks.filter(task => 
                        task.due_date === format(date, 'yyyy-MM-dd')
                      );
                      
                      return (
                        <div
                          key={format(date, 'yyyy-MM-dd')}
                          className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors ${
                            isToday(date) 
                              ? 'bg-primary/10 border-primary/30' 
                              : 'bg-muted/30 border-border hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="text-sm font-medium mb-1">
                            {format(date, 'd')}
                          </div>
                          <div className="space-y-1">
                            {daySchedules.slice(0, 2).map((schedule) => (
                              <div
                                key={schedule.id}
                                className="text-xs p-1 rounded truncate"
                                style={{ backgroundColor: schedule.color + '20', color: schedule.color }}
                              >
                                {schedule.title}
                              </div>
                            ))}
                            {dayTasks.slice(0, 1).map((task) => (
                              <div
                                key={task.id}
                                className={`text-xs p-1 rounded truncate border ${getPriorityColor(task.priority)}`}
                              >
                                📝 {task.title}
                              </div>
                            ))}
                            {(daySchedules.length + dayTasks.length) > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{(daySchedules.length + dayTasks.length) - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedules */}
              <div className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
                  </CardHeader>
                  <CardContent>
                    {todaySchedules.length > 0 ? (
                      <div className="space-y-3">
                        {todaySchedules.map((schedule) => (
                          <div key={schedule.id} className="p-3 bg-muted rounded border border-border">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`${getCategoryColor(schedule.category)} capitalize text-xs`}>
                                    {schedule.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {format(new Date(schedule.start_time), 'HH:mm')} - 
                                      {format(new Date(schedule.end_time), 'HH:mm')}
                                    </span>
                                  </div>
                                </div>
                                <h4 className="font-medium text-foreground text-sm">{schedule.title}</h4>
                                {schedule.location && (
                                  <p className="text-xs text-muted-foreground mt-1">{schedule.location}</p>
                                )}
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleEditSchedule(schedule)}
                                  title="Edit Schedule"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                  title="Delete Schedule"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No schedules today</p>
                        {schedules.length > 0 && (
                          <p className="text-xs mt-1">
                            You have {schedules.length} schedule(s) total
                          </p>
                        )}
                        {schedules.length === 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={async () => {
                              const now = new Date();
                              const in2Hours = addHours(now, 2);
                              await createSchedule({
                                title: "Test Meeting",
                                description: "A test meeting to verify the display is working",
                                start_time: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss'),
                                end_time: format(in2Hours, 'yyyy-MM-dd\'T\'HH:mm:ss'),
                                type: "meeting",
                                category: "meeting",
                                status: "scheduled",
                                color: "#3b82f6",
                                reminder_minutes: [15],
                                tags: ["test"],
                                attendees: [],
                                is_public: false,
                                is_recurring: false
                              });
                            }}
                          >
                            Add Test Schedule for Today
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
                  </CardHeader>
                  <CardContent>
                    {todayTasks.length > 0 ? (
                      <div className="space-y-3">
                        {todayTasks.map((task) => (
                          <div key={task.id} className="p-3 bg-muted rounded border border-border">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${getPriorityColor(task.priority)} capitalize text-xs`}>
                                {task.priority}
                              </Badge>
                              <Badge className={`${getStatusColor(task.status)} capitalize text-xs`}>
                                {task.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                            {task.due_date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <Target className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No tasks due today</p>
                        {tasks.length > 0 && (
                          <p className="text-xs mt-1">
                            You have {tasks.length} task(s) total
                          </p>
                        )}
                        {tasks.length === 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={async () => {
                              await createTask({
                                title: "Test Task for Today",
                                description: "A test task to verify the display is working",
                                due_date: format(new Date(), 'yyyy-MM-dd'),
                                status: "todo",
                                priority: "medium",
                                category: "personal",
                                estimated_hours: 1,
                                order_index: 0,
                                tags: ["test"],
                                is_recurring: false
                              });
                            }}
                          >
                            Add Test Task for Today
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={taskFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("all")}
                  className="text-sm"
                >
                  All Tasks ({tasks.length})
                </Button>
                <Button
                  variant={taskFilter === "todo" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("todo")}
                  className="text-sm"
                >
                  Todo ({tasks.filter(t => t.status === 'todo').length})
                </Button>
                <Button
                  variant={taskFilter === "in-progress" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("in-progress")}
                  className="text-sm"
                >
                  In Progress ({tasks.filter(t => t.status === 'in-progress').length})
                </Button>
                <Button
                  variant={taskFilter === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("completed")}
                  className="text-sm"
                >
                  Completed ({tasks.filter(t => t.status === 'completed').length})
                </Button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="bg-card border-border hover:border-primary/50 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <Badge className={`${getPriorityColor(task.priority)} capitalize text-xs`}>
                              {task.priority}
                            </Badge>
                          </div>
                          <Badge className={`${getStatusColor(task.status)} capitalize text-xs`}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{task.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="bg-transparent text-muted-foreground border-border text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}</span>
                      </div>
                      {task.estimated_hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimated_hours}h</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => handleTaskToSchedule(task)}
                        title="Convert to Schedule"
                      >
                        <CalendarDays className="w-3 h-3 mr-1" />
                        Schedule
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => handleEditTask(task)}
                        title="Edit Task"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
           {/* Future Schedules Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-foreground">Upcoming Schedules</h3>
                <Badge variant="secondary" className="text-xs">
                  {futureSchedules.length}
                </Badge>
              </div>
              
              {futureSchedules.length > 0 ? (
                <div className="grid gap-4">
                  {futureSchedules.map((schedule) => (
                    <Card key={schedule.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getCategoryColor(schedule.category)} capitalize text-xs`}>
                                {schedule.category}
                              </Badge>
                              <Badge className={`${getTypeColor(schedule.type)} capitalize text-xs`}>
                                {schedule.type}
                              </Badge>
                              <Badge className={`${getStatusColor(schedule.status)} capitalize text-xs`}>
                                {schedule.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground text-lg mb-1">{schedule.title}</h3>
                            {schedule.description && (
                              <p className="text-sm text-muted-foreground mb-2">{schedule.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(new Date(schedule.start_time), 'MMM dd, yyyy HH:mm')} - 
                                  {format(new Date(schedule.end_time), 'HH:mm')}
                                </span>
                              </div>
                              {schedule.location && (
                                <div className="flex items-center gap-1">
                                  <span>📍 {schedule.location}</span>
                                </div>
                              )}
                              {schedule.attendees && schedule.attendees.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{schedule.attendees.length} attendees</span>
                                </div>
                              )}
                            </div>
                            {schedule.notes && (
                              <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">
                                {schedule.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSchedule(schedule)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No Upcoming Schedules</h3>
                    <p className="text-sm text-muted-foreground">Create a new schedule to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Past Schedules Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-foreground">Past Schedules</h3>
                <Badge variant="outline" className="text-xs">
                  {pastSchedules.length}
                </Badge>
              </div>
              
              {pastSchedules.length > 0 ? (
                <div className="grid gap-4">
                  {pastSchedules.map((schedule) => (
                    <Card key={schedule.id} className="bg-card border-border opacity-80">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getCategoryColor(schedule.category)} capitalize text-xs opacity-70`}>
                                {schedule.category}
                              </Badge>
                              <Badge className={`${getTypeColor(schedule.type)} capitalize text-xs opacity-70`}>
                                {schedule.type}
                              </Badge>
                              <Badge className={`${getStatusColor(schedule.status)} capitalize text-xs opacity-70`}>
                                {schedule.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground text-lg mb-1 opacity-80">{schedule.title}</h3>
                            {schedule.description && (
                              <p className="text-sm text-muted-foreground mb-2 opacity-70">{schedule.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground opacity-70">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(new Date(schedule.start_time), 'MMM dd, yyyy HH:mm')} - 
                                  {format(new Date(schedule.end_time), 'HH:mm')}
                                </span>
                              </div>
                              {schedule.location && (
                                <div className="flex items-center gap-1">
                                  <span>📍 {schedule.location}</span>
                                </div>
                              )}
                              {schedule.attendees && schedule.attendees.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{schedule.attendees.length} attendees</span>
                                </div>
                              )}
                            </div>
                            {schedule.notes && (
                              <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded opacity-70">
                                {schedule.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSchedule(schedule)}
                              className="opacity-70 hover:opacity-100"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 opacity-70 hover:opacity-100"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No Past Schedules</h3>
                    <p className="text-sm text-muted-foreground">Your completed schedules will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                    {tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">{schedules.length}</div>
                  <div className="text-sm text-muted-foreground">Total Events</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getPriorityColor(task.priority)} capitalize text-xs`}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                            </span>
                          </div>
                        </div>
                        <AlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground py-4">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No upcoming deadlines</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingSchedules.length > 0 ? upcomingSchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{schedule.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getCategoryColor(schedule.category)} capitalize text-xs`}>
                              {schedule.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(schedule.start_time), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                        </div>
                        <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    )) : (
                      <div className="text-center text-muted-foreground py-4">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No upcoming events</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Productivity Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span className="text-foreground">
                          {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 dark:bg-green-400 h-2 rounded-full" 
                          style={{ 
                            width: `${(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Tasks by Category</h4>
                      {['academic', 'project', 'personal', 'work'].map((category) => {
                        const count = tasks.filter(t => t.category === category).length;
                        return (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize flex items-center gap-1">
                              {getCategoryIcon(category)}
                              {category}
                            </span>
                            <span className="text-foreground">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Schedule Dialog - Shared across all tabs */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
            </DialogHeader>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCreateSchedule();
              }}
            >
              <div 
                className="grid gap-4 py-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
              <div className="grid gap-2">
                <Label htmlFor="schedule-title">Title</Label>
                <Input
                  id="schedule-title"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                  placeholder="Meeting title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-description">Description</Label>
                <Textarea
                  id="schedule-description"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                  placeholder="Meeting description..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-start">Start Time</Label>
                  <Input
                    id="schedule-start"
                    type="datetime-local"
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-end">End Time</Label>
                  <Input
                    id="schedule-end"
                    type="datetime-local"
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-type">Type</Label>
                  <Select value={scheduleForm.type} onValueChange={(value: LocalScheduleType) => setScheduleForm({...scheduleForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-category">Category</Label>
                  <Select value={scheduleForm.category} onValueChange={(value: LocalScheduleCategory) => setScheduleForm({...scheduleForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-status">Status</Label>
                  <Select value={scheduleForm.status} onValueChange={(value: LocalScheduleStatus) => setScheduleForm({...scheduleForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-color">Color</Label>
                  <Input
                    id="schedule-color"
                    type="color"
                    value={scheduleForm.color}
                    onChange={(e) => setScheduleForm({...scheduleForm, color: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-location">Location</Label>
                  <Input
                    id="schedule-location"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                    placeholder="Meeting location..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule-url">Meeting URL</Label>
                  <Input
                    id="schedule-url"
                    value={scheduleForm.meeting_url}
                    onChange={(e) => setScheduleForm({...scheduleForm, meeting_url: e.target.value})}
                    placeholder="https://meet.example.com/..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-attendees">Attendees (comma-separated emails)</Label>
                <Input
                  id="schedule-attendees"
                  value={scheduleForm.attendees.join(', ')}
                  onChange={(e) => setScheduleForm({...scheduleForm, attendees: e.target.value.split(',').map(email => email.trim()).filter(email => email)})}
                  placeholder="john@example.com, jane@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-reminders">Reminder Minutes</Label>
                <div className="flex gap-2 flex-wrap">
                  {[5, 10, 15, 30, 60, 120, 1440].map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => {
                        const newReminders = scheduleForm.reminder_minutes.includes(minutes)
                          ? scheduleForm.reminder_minutes.filter(m => m !== minutes)
                          : [...scheduleForm.reminder_minutes, minutes];
                        setScheduleForm({...scheduleForm, reminder_minutes: newReminders});
                      }}
                      className={`px-3 py-1 text-xs rounded border ${
                        scheduleForm.reminder_minutes.includes(minutes)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {minutes < 60 ? `${minutes}m` : minutes === 60 ? '1h' : minutes === 120 ? '2h' : '1d'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-tags">Tags (comma separated)</Label>
                <Input
                  id="schedule-tags"
                  value={scheduleForm.tags}
                  onChange={(e) => setScheduleForm({...scheduleForm, tags: e.target.value})}
                  placeholder="important, client, weekly..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule-notes">Notes</Label>
                <Textarea
                  id="schedule-notes"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="schedule-recurring"
                    checked={scheduleForm.is_recurring}
                    onCheckedChange={(checked) => setScheduleForm({...scheduleForm, is_recurring: !!checked})}
                  />
                  <Label htmlFor="schedule-recurring">Recurring event</Label>
                </div>
                
                {scheduleForm.is_recurring && (
                  <div className="ml-6 space-y-3 p-3 border rounded-lg bg-muted/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Recurrence Pattern</Label>
                        <Select 
                          value={scheduleForm.recurrence_rule?.freq || 'DAILY'} 
                          onValueChange={(value) => setScheduleForm({
                            ...scheduleForm, 
                            recurrence_rule: {...(scheduleForm.recurrence_rule || {}), freq: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Interval</Label>
                        <Input
                          type="number"
                          min="1"
                          value={scheduleForm.recurrence_rule?.interval || 1}
                          onChange={(e) => setScheduleForm({
                            ...scheduleForm,
                            recurrence_rule: {...(scheduleForm.recurrence_rule || {}), interval: parseInt(e.target.value) || 1}
                          })}
                          placeholder="Every X days/weeks/months"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="recurrence-end">End Date (optional)</Label>
                      <Input
                        id="recurrence-end"
                        type="date"
                        value={scheduleForm.recurrence_end_date}
                        onChange={(e) => setScheduleForm({...scheduleForm, recurrence_end_date: e.target.value})}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="schedule-public"
                    checked={scheduleForm.is_public}
                    onCheckedChange={(checked) => setScheduleForm({...scheduleForm, is_public: !!checked})}
                  />
                  <Label htmlFor="schedule-public">Public event</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!scheduleForm.title}
              >
                Create Schedule
              </Button>
            </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
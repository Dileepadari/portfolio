import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  GitCommit,
  GitPullRequest,
  Calendar,
  Zap,
  Code,
  Award,
  BookOpen,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Save,
  Link,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { useTimelineEvents, useTimelineManagement, useActivityOverview, TimelineEvent } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";

export function Timeline() {
  // Timeline type filter
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const timelineTypes = [
    { value: 'all', label: 'All' },
    { value: 'project', label: 'Project' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'contribution', label: 'Contribution' },
    { value: 'education', label: 'Education' },
    { value: 'work', label: 'Work' },
    { value: 'commit', label: 'Commit' },
    { value: 'task', label: 'Task' },
    { value: 'schedule', label: 'Schedule' },
  ];
  const { timelineEvents, loading, error, refetch } = useTimelineEvents();
  const { addTimelineEvent, updateTimelineEvent, deleteTimelineEvent, loading: managementLoading } = useTimelineManagement();
  const { stats, loading: statsLoading, error: _statsError } = useActivityOverview();
  const { isAdmin } = useAdmin();

  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineEvent>>({
    type: 'project',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    order_index: 0
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      case 'work': return <Briefcase className="w-4 h-4" />;
      case 'contribution': return <GitPullRequest className="w-4 h-4" />;
      case 'task': return <Zap className="w-4 h-4" />;
      case 'schedule': return <Calendar className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'commit': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'project': return 'text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      case 'achievement': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20';
      case 'education': return 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20';
      case 'work': return 'text-pink-500 bg-pink-500/10 border-pink-500/20 dark:text-pink-400 dark:bg-pink-400/10 dark:border-pink-400/20';
      case 'contribution': return 'text-orange-500 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-400/10 dark:border-orange-400/20';
      case 'task': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400 dark:bg-indigo-400/10 dark:border-indigo-400/20';
      case 'schedule': return 'text-teal-500 bg-teal-500/10 border-teal-500/20 dark:text-teal-400 dark:bg-teal-400/10 dark:border-teal-400/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingEvent) {
        await updateTimelineEvent(editingEvent.id, formData);
        toast.success('Timeline event updated successfully');
        setEditingEvent(null);
      } else {
        await addTimelineEvent(formData as Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Timeline event added successfully');
        setIsAddingEvent(false);
      }

      // Reset form
      setFormData({
        type: 'project',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
        order_index: 0
      });

      // Refresh data
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to save timeline event: ${message}`);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteTimelineEvent(eventId);
      toast.success('Timeline event deleted successfully');
      setDeletingEventId(null);

      // Refresh the data after a short delay to ensure the delete is processed
      setTimeout(() => {
        refetch();
      }, 100);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to delete timeline event: ${message}`);
    }
  };

  const confirmDelete = (eventId: string) => {
    setDeletingEventId(eventId);
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      type: event.type,
      title: event.title,
      description: event.description,
      date: event.date,
      repository: event.repository,
      language: event.language,
      language_color: event.language_color,
      tags: event.tags,
      link: event.link,
      impact: event.impact,
      order_index: event.order_index
    });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading timeline...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading timeline: {error}</p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Timeline</h1>
              <p className="text-muted-foreground text-lg">My journey in tech, one milestone at a time</p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setIsAddingEvent(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats?.totalEvents || 0}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">{stats?.projects || 0}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{stats?.achievements || 0}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">{stats?.contributions || 0}</div>
              <div className="text-sm text-muted-foreground">Contributions</div>
            </CardContent>
          </Card>
        </div>

          {/* Timeline Type Filter */}
          <div className="flex flex-wrap gap-2 mt-6 mb-8">
            {timelineTypes.map(type => (
              <Button
                key={type.value}
                variant={typeFilter === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type.value)}
                className="capitalize"
              >
                {type.label}
              </Button>
            ))}
          </div>
   
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border"></div>

          <div className="space-y-6">
            {timelineEvents
              .filter(event => typeFilter === 'all' || event.type === typeFilter)
              .map((event, _index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className={`relative flex-shrink-0 w-16 h-16 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center z-10`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Event card */}
                <Card className="flex-1 bg-card border-border hover:border-primary/50 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getEventColor(event.type)} capitalize`}>
                            {event.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-1 ml-auto">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(event)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDelete(event.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {event.title}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed mb-3">
                          {event.description}
                        </p>

                        {event.repository && (
                          <div className="flex items-center gap-2 mb-3 text-sm">
                            <Code className="w-4 h-4 text-muted-foreground" />
                            <span className="text-primary">{event.repository}</span>
                            {event.language && (
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: event.language_color }}
                                />
                                <span className="text-muted-foreground">{event.language}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {event.impact && (
                          <div className="flex items-center gap-1 mb-3 text-sm text-yellow-500 dark:text-yellow-400">
                            <Zap className="w-3 h-3" />
                            <span>{event.impact}</span>
                          </div>
                        )}

                        {event.link && (
                          <div className="flex items-center gap-1 mb-3 text-sm">
                            <Link className="w-3 h-3 text-muted-foreground" />
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Project
                            </a>
                          </div>
                        )}

                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {event.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="bg-transparent text-muted-foreground border-border text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Graph - GitHub Style */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Activity Overview
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              {statsLoading ? (
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading activity data...</p>
                </div>
              ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div>
                  {/* GitHub-style header */}
                  {/* GitHub-style header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        <span className="text-primary font-semibold">{stats.totalEvents}</span> contributions in the last year
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Building projects, achievements, and contributions every day
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                      <span className="text-xs text-muted-foreground">Less</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted border border-border"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/40 border border-primary/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/70"></div>
                        <div className="w-3 h-3 rounded-sm bg-primary border border-primary"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">More</span>
                    </div>
                  </div>

                  {/* GitHub-style 365-day contribution grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-fit">
                      {/* Month labels */}
                      <div className="flex mb-1">
                        <div className="w-10"></div> {/* Space for day labels */}
                        <div className="flex space-x-3.5 flex-1">
                          {(() => {
                            // Calculate the starting date (365 days ago)
                            const startDate = new Date();
                            startDate.setDate(startDate.getDate() - 364);
                            const dayOfWeek = startDate.getDay();
                            const adjustedStartDate = new Date(startDate);
                            adjustedStartDate.setDate(startDate.getDate() - dayOfWeek);

                            const monthLabels = [];
                            let currentMonth = -1;

                            // Create labels for each week column
                            for (let week = 0; week < 53; week++) {
                              const weekStartDate = new Date(adjustedStartDate);
                              weekStartDate.setDate(adjustedStartDate.getDate() + (week * 7));
                              const monthNumber = weekStartDate.getMonth();

                              // Only show month label if it's the first week of that month
                              if (monthNumber !== currentMonth) {
                                const monthName = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
                                currentMonth = monthNumber;
                                monthLabels.push(
                                  <div key={week} className="text-xs text-muted-foreground text-left">
                                    {monthName}
                                  </div>
                                );
                              } else {
                                monthLabels.push(
                                  <div key={week} className="text-xs">
                                    {/* Empty space for weeks within the same month */}
                                  </div>
                                );
                              }
                            }

                            return monthLabels;
                          })()}
                        </div>
                      </div>

                      {/* Days of week and activity grid */}
                      <div className="flex">
                        {/* Day labels */}
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground mr-2 pt-1">
                          <div className="h-3"></div>
                          <div className="h-3 flex items-center">Mon</div>
                          <div className="h-3"></div>
                          <div className="h-3 flex items-center">Wed</div>
                          <div className="h-3"></div>
                          <div className="h-3 flex items-center">Fri</div>
                          <div className="h-3"></div>
                        </div>

                        {/* Activity grid - 53 weeks x 7 days */}
                        <div className="grid grid-rows-7 grid-flow-col gap-1 ml-3">
                          {(() => {
                            // Calculate the starting date (365 days ago)
                            const startDate = new Date();
                            startDate.setDate(startDate.getDate() - 364);

                            // Adjust to start on Sunday for proper week alignment
                            const dayOfWeek = startDate.getDay();
                            const adjustedStartDate = new Date(startDate);
                            adjustedStartDate.setDate(startDate.getDate() - dayOfWeek);

                            const squares = [];

                            for (let i = 0; i < 371; i++) { // 53 weeks × 7 days = 371 squares
                              const currentDate = new Date(adjustedStartDate);
                              currentDate.setDate(adjustedStartDate.getDate() + i);
                              const dateStr = currentDate.toISOString().split('T')[0];

                              const activity = stats.recentActivity.find(a => a.date === dateStr);
                              const count = activity?.count || 0;
                              const types = activity?.types || [];

                              const intensity = count === 0 ? 0 :
                                count <= 1 ? 1 :
                                  count <= 3 ? 2 :
                                    count <= 6 ? 3 : 4;

                              const intensityClasses = [
                                'bg-muted border border-border hover:border-muted-foreground/40', // 0 contributions
                                'bg-green-100 border border-green-200 hover:border-green-300 dark:bg-green-950 dark:border-green-800', // 1 contribution
                                'bg-green-200 border border-green-300 hover:border-green-400 dark:bg-green-900 dark:border-green-700', // 2-3 contributions  
                                'bg-green-400 border border-green-500 hover:border-green-600 dark:bg-green-700 dark:border-green-600', // 4-6 contributions
                                'bg-green-600 border border-green-700 hover:border-green-800 dark:bg-green-500 dark:border-green-400' // 7+ contributions
                              ];

                              // Check if this date is in the future
                              const isToday = dateStr === new Date().toISOString().split('T')[0];
                              const isFuture = currentDate > new Date();

                              squares.push(
                                <div
                                  key={dateStr}
                                  className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-all duration-200 ${isFuture ? 'bg-muted/30 border border-border/30' : intensityClasses[intensity]
                                    } ${isToday ? 'ring-1 ring-primary ring-offset-1' : ''}`}
                                  title={isFuture ? 'Future date' : `${currentDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}: ${count} contribution${count !== 1 ? 's' : ''}${count > 0 ? ` (${types.join(', ')})` : ''}`}
                                />
                              );
                            }

                            return squares;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats summary - GitHub style */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500 mb-1">{stats.commits}</div>
                        <div className="text-sm text-muted-foreground">Commits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">{stats.projects}</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500 mb-1">{stats.achievements}</div>
                        <div className="text-sm text-muted-foreground">Achievements</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">{stats.contributions}</div>
                        <div className="text-sm text-muted-foreground">Contributions</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                  <p className="text-sm max-w-md mx-auto">
                    Your contribution graph will show up here once you start adding timeline events.
                    {isAdmin && " Click the 'Add Event' button to get started!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Event Dialog */}
        <Dialog open={isAddingEvent || editingEvent !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddingEvent(false);
            setEditingEvent(null);
            setFormData({
              type: 'project',
              title: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              tags: [],
              order_index: 0
            });
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Timeline Event' : 'Add New Timeline Event'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: TimelineEvent['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="contribution">Contribution</SelectItem>
                      <SelectItem value="commit">Commit</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="repository">Repository (optional)</Label>
                  <Input
                    id="repository"
                    value={formData.repository || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, repository: e.target.value }))}
                    placeholder="e.g., react-app"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language (optional)</Label>
                  <Input
                    id="language"
                    value={formData.language || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    placeholder="e.g., TypeScript"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="languageColor">Language Color (optional)</Label>
                  <Input
                    id="languageColor"
                    type="color"
                    value={formData.language_color || '#3572A5'}
                    onChange={(e) => setFormData(prev => ({ ...prev, language_color: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="link">Link (optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="impact">Impact (optional)</Label>
                <Input
                  id="impact"
                  value={formData.impact || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                  placeholder="e.g., 500+ participants, 3 month project"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div>
                <Label htmlFor="orderIndex">Order Index</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={formData.order_index || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingEvent(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={managementLoading}>
                  {managementLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingEvent ? 'Update' : 'Add'} Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingEventId !== null} onOpenChange={(open) => {
          if (!open) setDeletingEventId(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Timeline Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this timeline event? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingEventId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingEventId && handleDelete(deletingEventId)}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
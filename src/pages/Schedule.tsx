import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronRight
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'project' | 'personal' | 'work';
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'meeting' | 'deadline' | 'exam' | 'personal';
  location?: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Complete Data Structures Assignment",
    description: "Implement AVL tree with all operations and write test cases",
    dueDate: "2024-01-25",
    dueTime: "23:59",
    priority: "high",
    category: "academic",
    status: "in-progress",
    tags: ["Data Structures", "Programming", "Assignment"]
  },
  {
    id: "2",
    title: "Deploy E-commerce Project",
    description: "Deploy the e-commerce application to production and configure CI/CD pipeline",
    dueDate: "2024-01-22",
    dueTime: "18:00",
    priority: "high",
    category: "project",
    status: "pending",
    tags: ["Deployment", "DevOps", "Project"]
  },
  {
    id: "3",
    title: "Prepare for Algorithm Interview",
    description: "Practice dynamic programming problems and system design questions",
    dueDate: "2024-01-20",
    priority: "medium",
    category: "personal",
    status: "in-progress",
    tags: ["Interview", "Algorithms", "Career"]
  },
  {
    id: "4",
    title: "Write Blog Post on React Hooks",
    description: "Complete blog post about advanced React hooks patterns and best practices",
    dueDate: "2024-01-28",
    priority: "medium",
    category: "personal",
    status: "pending",
    tags: ["Blog", "React", "Writing"]
  },
  {
    id: "5",
    title: "Code Review for Team Project",
    description: "Review pull requests from team members and provide feedback",
    dueDate: "2024-01-19",
    dueTime: "17:00",
    priority: "high",
    category: "work",
    status: "completed",
    tags: ["Code Review", "Team", "Collaboration"]
  }
];

const events: Event[] = [
  {
    id: "1",
    title: "Database Systems Lecture",
    description: "Advanced SQL queries and optimization techniques",
    date: "2024-01-19",
    startTime: "09:00",
    endTime: "10:30",
    type: "class",
    location: "Room 301, CS Building"
  },
  {
    id: "2",
    title: "Team Standup Meeting",
    description: "Daily standup with development team",
    date: "2024-01-19",
    startTime: "10:00",
    endTime: "10:30",
    type: "meeting",
    location: "Conference Room A"
  },
  {
    id: "3",
    title: "Machine Learning Project Deadline",
    description: "Final submission for ML classification project",
    date: "2024-01-20",
    startTime: "23:59",
    endTime: "23:59",
    type: "deadline"
  },
  {
    id: "4",
    title: "Technical Interview - TechCorp",
    description: "Second round technical interview",
    date: "2024-01-22",
    startTime: "14:00",
    endTime: "15:30",
    type: "meeting",
    location: "Virtual - Zoom"
  }
];

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const [taskFilter, setTaskFilter] = useState<string>("all");

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'meeting': return 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20';
      case 'deadline': return 'text-red-500 bg-red-500/10 border-red-500/20 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20';
      case 'exam': return 'text-orange-500 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-400/10 dark:border-orange-400/20';
      case 'personal': return 'text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20';
      default: return 'text-muted-foreground bg-muted-foreground/10 border-muted-foreground/20';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === "all") return true;
    return task.status === taskFilter;
  });

  const todayTasks = tasks.filter(task => 
    task.dueDate === new Date().toISOString().split('T')[0]
  );

  const todayEvents = events.filter(event => 
    event.date === new Date().toISOString().split('T')[0]
  );

  const upcomingTasks = tasks.filter(task => 
    new Date(task.dueDate) > new Date() && task.status !== 'completed'
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Schedule & Tasks</h1>
          <p className="text-muted-foreground text-lg">Stay organized and productive</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border-border mb-6">
            <TabsTrigger value="calendar" className="text-muted-foreground data-[state=active]:text-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-muted-foreground data-[state=active]:text-foreground">
              <Target className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:text-foreground">
              <CheckCircle className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                    <p>Interactive calendar coming soon...</p>
                    <p className="text-sm mt-1">View and manage your schedule visually</p>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Events */}
              <div className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold text-foreground">Today's Events</h3>
                  </CardHeader>
                  <CardContent>
                    {todayEvents.length > 0 ? (
                      <div className="space-y-3">
                        {todayEvents.map((event) => (
                          <div key={event.id} className="p-3 bg-muted rounded border border-border">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${getEventTypeColor(event.type)} capitalize text-xs`}>
                                {event.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                            </div>
                            <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                            {event.location && (
                              <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No events today</p>
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
                            {task.dueTime && (
                              <p className="text-xs text-muted-foreground mt-1">Due: {task.dueTime}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <Target className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No tasks due today</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={taskFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("all")}
                  className="text-sm"
                >
                  All Tasks
                </Button>
                <Button
                  variant={taskFilter === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("pending")}
                  className="text-sm"
                >
                  Pending
                </Button>
                <Button
                  variant={taskFilter === "in-progress" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("in-progress")}
                  className="text-sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={taskFilter === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTaskFilter("completed")}
                  className="text-sm"
                >
                  Completed
                </Button>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
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
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        {task.dueTime && (
                          <>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>{task.dueTime}</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 dark:hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getPriorityColor(task.priority)} capitalize text-xs`}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <AlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                      </div>
                    ))}
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
      </div>
    </div>
  );
}
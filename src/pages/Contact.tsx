import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usePersonalInfo } from "@/hooks/usePortfolioData";
import { useTasks, useSchedules } from "@/hooks/useManagement";
import { useAdmin } from "@/hooks/useAdmin";
import { Mail, Phone, MapPin, Send, MessageCircle, Calendar, Clock, CheckSquare, Info, Eye, Trash2, CalendarPlus, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContactMessages, type ContactMessage } from "@/hooks/useManagement";

export default function Contact() {
  const { data: personalInfo } = usePersonalInfo();
  const { toast } = useToast();
  const { createMessage, data: contactMessages, loading: messagesLoading, updateMessage, deleteMessage } = useContactMessages();
  const { createTask } = useTasks();
  const { createSchedule } = useSchedules();
  const { isAdmin } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [taskRequest, setTaskRequest] = useState({
    requesterName: "",
    requesterEmail: "",
    taskTitle: "",
    taskDescription: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "project" as "academic" | "project" | "personal" | "work",
    dueDate: "",
    dueTime: "",
    estimatedDuration: "",
    budget: "",
    additionalNotes: ""
  });

  // Admin state
  const [_selectedMessage, _setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [convertDialog, setConvertDialog] = useState<{ open: boolean; type: 'task' | 'schedule' | null; message: ContactMessage | null }>({
    open: false,
    type: null,
    message: null
  });
  // Narrow type for the convert dialog form data
  type ConvertFormData = {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    dueTime?: string;
    startTime?: string;
    endTime?: string;
    type?: 'meeting' | 'call' | 'event' | 'deadline';
    isPublic?: boolean;
  };

  const [convertFormData, setConvertFormData] = useState<ConvertFormData>({});

  // Helper function to check if a message is a task request
  const isTaskRequest = (message: ContactMessage) => {
    return message.subject.startsWith('Task Request:') && message.message.includes('TASK REQUEST DETAILS:');
  };

  // Helper function to parse task request details from message
  const parseTaskRequest = (message: ContactMessage) => {
    const lines = message.message.split('\n');
    const taskData = {
      title: '',
      description: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      category: 'project',
      dueDate: '',
      estimatedDuration: '',
      budget: '',
      additionalNotes: ''
    };

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('Task: ')) {
        taskData.title = line.replace('Task: ', '').trim();
      } else if (line.startsWith('Description: ')) {
        taskData.description = line.replace('Description: ', '').trim();
      } else if (line.startsWith('Priority: ')) {
        taskData.priority = line.replace('Priority: ', '').trim() as 'low' | 'medium' | 'high';
      } else if (line.startsWith('Category: ')) {
        taskData.category = line.replace('Category: ', '').trim();
      } else if (line.startsWith('Due Date: ')) {
        const dueDateStr = line.replace('Due Date: ', '').trim();
        if (dueDateStr && dueDateStr !== '') {
          // Extract just the date part (YYYY-MM-DD)
          taskData.dueDate = dueDateStr.split(' ')[0];
        }
      } else if (line.startsWith('Estimated Duration: ')) {
        taskData.estimatedDuration = line.replace('Estimated Duration: ', '').trim();
      } else if (line.startsWith('Budget: ')) {
        taskData.budget = line.replace('Budget: ', '').trim();
      } else if (line.startsWith('Additional Notes:')) {
        currentSection = 'notes';
      } else if (currentSection === 'notes' && line.trim() && !line.includes('---')) {
        taskData.additionalNotes += (taskData.additionalNotes ? '\n' : '') + line.trim();
      }
    }

    return taskData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await createMessage(formData);
      if (error) throw error;
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For now, we'll send this as a special contact message with task details
      // Later this could be stored in a separate task_requests table
      const taskMessage = {
        name: taskRequest.requesterName,
        email: taskRequest.requesterEmail,
        subject: `Task Request: ${taskRequest.taskTitle}`,
        message: `
TASK REQUEST DETAILS:

Task: ${taskRequest.taskTitle}
Description: ${taskRequest.taskDescription}
Priority: ${taskRequest.priority}
Category: ${taskRequest.category}
Due Date: ${taskRequest.dueDate} ${taskRequest.dueTime || ''}
Estimated Duration: ${taskRequest.estimatedDuration}
Budget: ${taskRequest.budget}

Additional Notes:
${taskRequest.additionalNotes}

---
This is an automated task request submission.
        `.trim()
      };

      const { error } = await createMessage(taskMessage);
      if (error) throw error;
      
      toast({
        title: "Task request submitted!",
        description: "Your task request has been sent. I'll review it and get back to you soon!",
      });
      setTaskRequest({
        requesterName: "",
        requesterEmail: "",
        taskTitle: "",
        taskDescription: "",
        priority: "medium",
        category: "project",
        dueDate: "",
        dueTime: "",
        estimatedDuration: "",
        budget: "",
        additionalNotes: ""
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit task request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Admin functions
  const handleAcceptTaskRequest = async (message: ContactMessage) => {
    try {
      const taskData = parseTaskRequest(message);
      
      await createTask({
        title: taskData.title,
        description: taskData.description,
        status: 'todo',
        priority: taskData.priority,
        due_date: taskData.dueDate || undefined,
        order_index: 0,
        category: 'general',
        tags: [],
        is_recurring: false
      });
      
      // Mark original message as replied
      await updateMessage(message.id, { status: 'replied' });
      
      toast({
        title: "Task request accepted!",
        description: `"${taskData.title}" has been added to your tasks.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to accept task request.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await updateMessage(messageId, { status: 'read' });
      toast({
        title: "Message marked as read",
        description: "The message status has been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsReplied = async (messageId: string) => {
    try {
      await updateMessage(messageId, { status: 'replied' });
      toast({
        title: "Message marked as replied",
        description: "The message status has been updated.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast({
        title: "Message deleted",
        description: "The message has been permanently deleted.",
      });
      setDeletingMessageId(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const handleConvertToTask = async () => {
    if (!convertDialog.message) return;
    
    try {
      await createTask({
        title: convertFormData.title || convertDialog.message.subject,
        description: convertFormData.description || convertDialog.message.message,
        status: 'todo',
        priority: convertFormData.priority || 'medium',
        due_date: convertFormData.dueDate,
        order_index: 0,
        category: 'general',
        tags: [],
        is_recurring: false
      });
      
      // Mark original message as replied
      await updateMessage(convertDialog.message.id, { status: 'replied' });
      
      toast({
        title: "Task created successfully",
        description: "The message has been converted to a task.",
      });
      
      setConvertDialog({ open: false, type: null, message: null });
      setConvertFormData({});
    } catch {
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleConvertToSchedule = async () => {
    if (!convertDialog.message) return;
    
    try {
      await createSchedule({
        title: convertFormData.title || convertDialog.message.subject,
        description: convertFormData.description || convertDialog.message.message,
        start_time: convertFormData.startTime,
        end_time: convertFormData.endTime,
        type: convertFormData.type || 'meeting',
        status: 'scheduled',
        attendees: [convertDialog.message.email],
        is_public: convertFormData.isPublic || false,
        category: 'work',
        color: '#3b82f6',
        reminder_minutes: [15],
        tags: [],
        is_recurring: false
      });
      
      // Mark original message as replied
      await updateMessage(convertDialog.message.id, { status: 'replied' });
      
      toast({
        title: "Schedule created successfully",
        description: "The message has been converted to a schedule item.",
      });
      
      setConvertDialog({ open: false, type: null, message: null });
      setConvertFormData({});
    } catch {
      toast({
        title: "Error",
        description: "Failed to create schedule item.",
        variant: "destructive",
      });
    }
  };

  // Separate task requests from regular messages
  const allMessages = contactMessages || [];
  const taskRequests = allMessages.filter(message => isTaskRequest(message));
  const regularMessages = allMessages.filter(message => !isTaskRequest(message));

  // Apply filter to both collections
  const filteredTaskRequests = taskRequests.filter(message => {
    if (messageFilter === 'all') return true;
    return message.status === messageFilter;
  });

  const filteredRegularMessages = regularMessages.filter(message => {
    if (messageFilter === 'all') return true;
    return message.status === messageFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTaskRequest(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-8 space-y-6">
            {/* Task Requests Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Task Requests ({filteredTaskRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filter for task requests */}
                  <div className="flex items-center gap-4">
                    <Label htmlFor="taskRequestFilter">Filter by status:</Label>
                    <Select value={messageFilter} onValueChange={(value: 'all' | 'unread' | 'read' | 'replied') => setMessageFilter(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Requests</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Task Requests List */}
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {messagesLoading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading task requests...</div>
                    ) : filteredTaskRequests.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No task requests found</div>
                    ) : (
                      filteredTaskRequests.map((message) => {
                        const taskData = parseTaskRequest(message);
                        return (
                          <Card key={message.id} className="p-4 hover:bg-muted/50 transition-colors border-l-4 border-l-blue-500">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${getStatusColor(message.status)} text-white text-xs`}>
                                    {message.status === 'replied' ? 'accepted' : message.status}
                                  </Badge>
                                  <span className="font-medium truncate">{message.name}</span>
                                  <span className="text-sm text-muted-foreground truncate">{message.email}</span>
                                </div>
                                <h4 className="font-semibold text-base mb-2">{taskData.title}</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                                  <div>
                                    <span className="text-muted-foreground">Priority:</span>
                                    <Badge variant="outline" className="ml-1 capitalize">{taskData.priority}</Badge>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Category:</span>
                                    <Badge variant="outline" className="ml-1 capitalize">{taskData.category}</Badge>
                                  </div>
                                  {taskData.dueDate && (
                                    <div>
                                      <span className="text-muted-foreground">Due:</span>
                                      <span className="ml-1">{new Date(taskData.dueDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {taskData.budget && (
                                    <div>
                                      <span className="text-muted-foreground">Budget:</span>
                                      <span className="ml-1">{taskData.budget}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{taskData.description}</p>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(message.created_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {message.status !== 'replied' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptTaskRequest(message)}
                                    className="h-8 px-3 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckSquare className="w-3 h-3 mr-1" />
                                    Accept
                                  </Button>
                                )}
                                {message.status === 'unread' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkAsRead(message.id)}
                                    className="h-8 px-2"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setConvertDialog({ open: true, type: 'schedule', message })}
                                  className="h-8 px-2"
                                >
                                  <CalendarPlus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeletingMessageId(message.id)}
                                  className="h-8 px-2 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Messages Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Regular Messages ({filteredRegularMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Regular Messages List */}
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {messagesLoading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading messages...</div>
                    ) : filteredRegularMessages.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No regular messages found</div>
                    ) : (
                      filteredRegularMessages.map((message) => (
                        <Card key={message.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${getStatusColor(message.status)} text-white text-xs`}>
                                  {message.status}
                                </Badge>
                                <span className="font-medium truncate">{message.name}</span>
                                <span className="text-sm text-muted-foreground truncate">{message.email}</span>
                              </div>
                              <h4 className="font-medium text-sm mb-1 truncate">{message.subject}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(message.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {message.status === 'unread' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsRead(message.id)}
                                  className="h-8 px-2"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              )}
                              {message.status !== 'replied' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsReplied(message.id)}
                                  className="h-8 px-2"
                                >
                                  <CheckCheck className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConvertDialog({ open: true, type: 'task', message })}
                                className="h-8 px-2"
                              >
                                <CheckSquare className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConvertDialog({ open: true, type: 'schedule', message })}
                                className="h-8 px-2"
                              >
                                <CalendarPlus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeletingMessageId(message.id)}
                                className="h-8 px-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Let's Discuss Ideas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hello? 
            I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Forms */}
          <div className="space-y-6">
            <Tabs defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="message" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </TabsTrigger>
                <TabsTrigger value="task" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Request Task
                </TabsTrigger>
              </TabsList>

              <TabsContent value="message">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Send me a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project or idea..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="task">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        Request a Task
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Info className="w-4 h-4 mr-1" />
                            Guidelines
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Task Request Guidelines</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Timeline Expectations
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Most tasks are reviewed within 24-48 hours. Urgent requests will be prioritized.
                              </p>
                            </div>
                            
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Clear Requirements
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Provide detailed descriptions and acceptance criteria for better accuracy. Include any specific technologies, frameworks, or constraints you have in mind.
                              </p>
                            </div>
                            
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" />
                                Approval Process
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                I'll review your request and either approve it for my schedule or suggest alternatives. You'll receive an email response with my decision and any follow-up questions.
                              </p>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Tips for Better Requests
                              </h4>
                              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                                <li>• Be specific about deliverables and success criteria</li>
                                <li>• Include reference materials or examples if available</li>
                                <li>• Mention your preferred communication method</li>
                                <li>• Provide realistic timelines considering complexity</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTaskRequest} className="space-y-6">
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="requesterName">Your Name</Label>
                          <Input
                            id="requesterName"
                            name="requesterName"
                            value={taskRequest.requesterName}
                            onChange={handleTaskChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="requesterEmail">Your Email</Label>
                          <Input
                            id="requesterEmail"
                            name="requesterEmail"
                            type="email"
                            value={taskRequest.requesterEmail}
                            onChange={handleTaskChange}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Task Details */}
                      <div>
                        <Label htmlFor="taskTitle">Task Title</Label>
                        <Input
                          id="taskTitle"
                          name="taskTitle"
                          value={taskRequest.taskTitle}
                          onChange={handleTaskChange}
                          placeholder="Brief title for the task"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="taskDescription">Task Description</Label>
                        <Textarea
                          id="taskDescription"
                          name="taskDescription"
                          value={taskRequest.taskDescription}
                          onChange={handleTaskChange}
                          placeholder="Detailed description of what you need..."
                          rows={4}
                          required
                        />
                      </div>

                      {/* Task Properties */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select 
                            value={taskRequest.priority} 
                            onValueChange={(value: "low" | "medium" | "high") => 
                              setTaskRequest(prev => ({ ...prev, priority: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={taskRequest.category} 
                            onValueChange={(value: "academic" | "project" | "personal" | "work") => 
                              setTaskRequest(prev => ({ ...prev, category: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={taskRequest.dueDate}
                            onChange={handleTaskChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueTime">Due Time (optional)</Label>
                          <Input
                            id="dueTime"
                            name="dueTime"
                            type="time"
                            value={taskRequest.dueTime}
                            onChange={handleTaskChange}
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                          <Input
                            id="estimatedDuration"
                            name="estimatedDuration"
                            value={taskRequest.estimatedDuration}
                            onChange={handleTaskChange}
                            placeholder="e.g., 2 hours, 1 week"
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget (optional)</Label>
                          <Input
                            id="budget"
                            name="budget"
                            value={taskRequest.budget}
                            onChange={handleTaskChange}
                            placeholder="e.g., $500, ₹10,000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          value={taskRequest.additionalNotes}
                          onChange={handleTaskChange}
                          placeholder="Any additional information, requirements, or constraints..."
                          rows={3}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Submit Task Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact Info & Ideas */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Get in touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personalInfo?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href={`mailto:${personalInfo.email}`}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {personalInfo?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{personalInfo.phone}</p>
                    </div>
                  </div>
                )}
                
                {personalInfo?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{personalInfo.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Ideas */}
            <Card>
              <CardHeader>
                <CardTitle>What can we build together?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Web Applications</h4>
                    <p className="text-sm text-muted-foreground">
                      Full-stack web apps with frameworks like Next.js, and Node.js
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">API Development</h4>
                    <p className="text-sm text-muted-foreground">
                      RESTful APIs endpoints for mobile and web applications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Quick Response</h4>
                  <p className="text-sm text-muted-foreground">
                    I typically respond within 24 hours. For urgent matters, 
                    please mention it in your message.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Convert to Task/Schedule Dialog */}
        <Dialog open={convertDialog.open} onOpenChange={(open) => {
          if (!open) {
            setConvertDialog({ open: false, type: null, message: null });
            setConvertFormData({});
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Convert to {convertDialog.type === 'task' ? 'Task' : 'Schedule'}
              </DialogTitle>
            </DialogHeader>
            
            {convertDialog.type === 'task' ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    value={convertFormData.title || convertDialog.message?.subject || ''}
                    onChange={(e) => setConvertFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={convertFormData.description || convertDialog.message?.message || ''}
                    onChange={(e) => setConvertFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={convertFormData.priority || 'medium'} onValueChange={(value) => setConvertFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}>
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
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={convertFormData.dueDate || ''}
                      onChange={(e) => setConvertFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setConvertDialog({ open: false, type: null, message: null })}>
                    Cancel
                  </Button>
                  <Button onClick={handleConvertToTask}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scheduleTitle">Schedule Title</Label>
                  <Input
                    id="scheduleTitle"
                    value={convertFormData.title || convertDialog.message?.subject || ''}
                    onChange={(e) => setConvertFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleDescription">Description</Label>
                  <Textarea
                    id="scheduleDescription"
                    value={convertFormData.description || convertDialog.message?.message || ''}
                    onChange={(e) => setConvertFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={convertFormData.startTime || ''}
                      onChange={(e) => setConvertFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={convertFormData.endTime || ''}
                      onChange={(e) => setConvertFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduleType">Type</Label>
                    <Select value={convertFormData.type || 'meeting'} onValueChange={(value) => setConvertFormData(prev => ({ ...prev, type: value as 'meeting' | 'call' | 'event' | 'deadline' }))}>
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
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={convertFormData.isPublic || false}
                      onChange={(e) => setConvertFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                    <Label htmlFor="isPublic" className="text-sm">Public</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setConvertDialog({ open: false, type: null, message: null })}>
                    Cancel
                  </Button>
                  <Button onClick={handleConvertToSchedule}>
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Create Schedule
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingMessageId !== null} onOpenChange={(open) => {
          if (!open) setDeletingMessageId(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingMessageId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingMessageId && handleDeleteMessage(deletingMessageId)}
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

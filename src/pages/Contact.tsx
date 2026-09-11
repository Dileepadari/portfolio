/**
 * The contact form. Writes into the inbox table that only an admin can read.
 *
 * @module contact
 */

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
import { useAdmin } from "@/hooks/useAdmin";
import { Mail, Phone, MapPin, Send, MessageCircle, Calendar, Clock, CheckSquare, Info, Eye, Trash2, CheckCheck, ExternalLink, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContactMessages, useTaskRequests, type ContactMessage, type TaskRequest } from "@/hooks/useManagement";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function Contact() {
  useDocumentMeta(
    "Contact | Dileep Adari",
    "Get in touch about work, collaboration or a project."
  );
  const { data: personalInfo } = usePersonalInfo();
  const { toast } = useToast();
  const { createMessage, data: contactMessages, loading: messagesLoading, updateMessage, deleteMessage } = useContactMessages();
  const {
    createTaskRequest,
    data: taskRequests,
    loading: taskRequestsLoading,
    updateTaskRequest,
    deleteTaskRequest,
  } = useTaskRequests();
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
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [deletingItem, setDeletingItem] = useState<{ id: string; kind: 'message' | 'taskRequest' } | null>(null);
  const [viewingItem, setViewingItem] = useState<
    { kind: 'message'; item: ContactMessage } | { kind: 'taskRequest'; item: TaskRequest } | null
  >(null);

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
      await createTaskRequest({
        requester_name: taskRequest.requesterName,
        requester_email: taskRequest.requesterEmail,
        title: taskRequest.taskTitle,
        description: taskRequest.taskDescription || undefined,
        priority: taskRequest.priority,
        category: taskRequest.category,
        due_date: taskRequest.dueDate || undefined,
        due_time: taskRequest.dueTime || undefined,
        estimated_duration: taskRequest.estimatedDuration || undefined,
        budget: taskRequest.budget || undefined,
        additional_notes: taskRequest.additionalNotes || undefined,
      });

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
  const handleSendToWorkOs = async (request: TaskRequest) => {
    try {
      await updateTaskRequest(request.id, { status: 'accepted' });
      toast({
        title: "Marked as sent to WorkOS",
        description: `"${request.title}" is now tracked as handled in WorkOS.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task request.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineTaskRequest = async (request: TaskRequest) => {
    try {
      await updateTaskRequest(request.id, { status: 'declined' });
      toast({ title: "Task request declined", description: "The request has been marked as declined." });
    } catch {
      toast({ title: "Error", description: "Failed to decline task request.", variant: "destructive" });
    }
  };

  const openMessageDetail = (message: ContactMessage) => {
    setViewingItem({ kind: 'message', item: message });
    if (message.status === 'unread') {
      handleMarkAsRead(message.id);
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

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    try {
      if (deletingItem.kind === 'taskRequest') {
        await deleteTaskRequest(deletingItem.id);
      } else {
        await deleteMessage(deletingItem.id);
      }
      toast({
        title: "Deleted",
        description: "The item has been permanently deleted.",
      });
      setDeletingItem(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete.",
        variant: "destructive",
      });
    }
  };

  const regularMessages = contactMessages || [];

  const filteredRegularMessages = regularMessages.filter(message => {
    if (messageFilter === 'all') return true;
    return message.status === messageFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      case 'pending': return 'bg-red-500';
      case 'accepted': return 'bg-blue-500';
      case 'declined': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // task_requests.status is stored as pending/accepted/declined (DB check
  // constraint) - "accepted" means it was taken and is now tracked in the
  // separate WorkOS app, not that it became an internal Task here.
  const getTaskRequestStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return 'Sent to WorkOS';
      case 'declined': return 'Declined';
      default: return 'Pending';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-8 space-y-6">
            {/* Task Requests Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Task Requests ({taskRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden">
                  {taskRequestsLoading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading task requests...</div>
                  ) : taskRequests.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No task requests found</div>
                  ) : (
                    taskRequests.map((request) => (
                      <Card
                        key={request.id}
                        className="p-4 hover:bg-muted/50 transition-colors border-l-4 border-l-blue-500 cursor-pointer"
                        onClick={() => setViewingItem({ kind: 'taskRequest', item: request })}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={`${getStatusColor(request.status)} text-white text-xs shrink-0`}>
                                {getTaskRequestStatusLabel(request.status)}
                              </Badge>
                              <span className="font-medium break-words">{request.requester_name}</span>
                              <span className="text-sm text-muted-foreground break-words">{request.requester_email}</span>
                            </div>
                            <h4 className="font-semibold text-base mb-2 break-words">{request.title}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                              <div>
                                <span className="text-muted-foreground">Priority:</span>
                                <Badge variant="outline" className="ml-1 capitalize">{request.priority}</Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Category:</span>
                                <Badge variant="outline" className="ml-1 capitalize">{request.category}</Badge>
                              </div>
                              {request.due_date && (
                                <div>
                                  <span className="text-muted-foreground">Due:</span>
                                  <span className="ml-1">{new Date(request.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {request.budget && (
                                <div>
                                  <span className="text-muted-foreground">Budget:</span>
                                  <span className="ml-1 break-words">{request.budget}</span>
                                </div>
                              )}
                            </div>
                            {request.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2 break-words">{request.description}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {new Date(request.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewingItem({ kind: 'taskRequest', item: request })}
                              className="h-8 px-2"
                              title="View details"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSendToWorkOs(request)}
                                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                                  title="Mark as sent to WorkOS"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Sent to WorkOS
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeclineTaskRequest(request)}
                                  className="h-8 px-2"
                                  title="Decline"
                                >
                                  <Ban className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeletingItem({ id: request.id, kind: 'taskRequest' })}
                              className="h-8 px-2 text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Regular Messages Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Regular Messages ({filteredRegularMessages.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="messageFilter" className="text-sm text-muted-foreground">Filter:</Label>
                    <Select value={messageFilter} onValueChange={(value: 'all' | 'unread' | 'read' | 'replied') => setMessageFilter(value)}>
                      <SelectTrigger id="messageFilter" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Regular Messages List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden">
                    {messagesLoading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading messages...</div>
                    ) : filteredRegularMessages.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No regular messages found</div>
                    ) : (
                      filteredRegularMessages.map((message) => (
                        <Card
                          key={message.id}
                          className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => openMessageDetail(message)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <Badge className={`${getStatusColor(message.status)} text-white text-xs shrink-0`}>
                                  {message.status}
                                </Badge>
                                <span className="font-medium break-words">{message.name}</span>
                                <span className="text-sm text-muted-foreground break-words">{message.email}</span>
                              </div>
                              <h4 className="font-medium text-sm mb-1 break-words">{message.subject}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 break-words">{message.message}</p>
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
                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openMessageDetail(message)}
                                className="h-8 px-2"
                                title="View details"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              {message.status !== 'replied' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsReplied(message.id)}
                                  className="h-8 px-2"
                                  title="Mark as replied"
                                >
                                  <CheckCheck className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeletingItem({ id: message.id, kind: 'message' })}
                                className="h-8 px-2 text-red-500 hover:text-red-700"
                                title="Delete"
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

        {/* Detail View Dialog - full, un-truncated content for a message or task request */}
        <Dialog open={viewingItem !== null} onOpenChange={(open) => { if (!open) setViewingItem(null); }}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            {viewingItem?.kind === 'message' && (
              <>
                <DialogHeader className="min-w-0">
                  <DialogTitle className="flex items-center gap-2 flex-wrap break-words pr-6 min-w-0">
                    <Badge className={`${getStatusColor(viewingItem.item.status)} text-white text-xs shrink-0`}>
                      {viewingItem.item.status}
                    </Badge>
                    <span className="break-words">{viewingItem.item.subject}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium break-words">{viewingItem.item.name}</span>
                    <span className="text-muted-foreground"> &lt;</span>
                    <a href={`mailto:${viewingItem.item.email}`} className="text-muted-foreground hover:text-primary break-words">
                      {viewingItem.item.email}
                    </a>
                    <span className="text-muted-foreground">&gt;</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{viewingItem.item.message}</p>
                  <div className="text-xs text-muted-foreground">
                    {new Date(viewingItem.item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 flex-wrap">
                  {viewingItem.item.status !== 'replied' && (
                    <Button size="sm" onClick={() => { handleMarkAsReplied(viewingItem.item.id); setViewingItem(null); }}>
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => { setDeletingItem({ id: viewingItem.item.id, kind: 'message' }); setViewingItem(null); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            )}

            {viewingItem?.kind === 'taskRequest' && (
              <>
                <DialogHeader className="min-w-0">
                  <DialogTitle className="flex items-center gap-2 flex-wrap break-words pr-6 min-w-0">
                    <Badge className={`${getStatusColor(viewingItem.item.status)} text-white text-xs shrink-0`}>
                      {getTaskRequestStatusLabel(viewingItem.item.status)}
                    </Badge>
                    <span className="break-words">{viewingItem.item.title}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium break-words">{viewingItem.item.requester_name}</span>
                    <span className="text-muted-foreground"> &lt;</span>
                    <a href={`mailto:${viewingItem.item.requester_email}`} className="text-muted-foreground hover:text-primary break-words">
                      {viewingItem.item.requester_email}
                    </a>
                    <span className="text-muted-foreground">&gt;</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Priority:</span>{" "}
                      <Badge variant="outline" className="capitalize">{viewingItem.item.priority}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>{" "}
                      <Badge variant="outline" className="capitalize">{viewingItem.item.category}</Badge>
                    </div>
                    {viewingItem.item.due_date && (
                      <div>
                        <span className="text-muted-foreground">Due:</span>{" "}
                        {new Date(viewingItem.item.due_date).toLocaleDateString()}
                        {viewingItem.item.due_time ? ` ${viewingItem.item.due_time}` : ""}
                      </div>
                    )}
                    {viewingItem.item.estimated_duration && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>{" "}
                        <span className="break-words">{viewingItem.item.estimated_duration}</span>
                      </div>
                    )}
                    {viewingItem.item.budget && (
                      <div>
                        <span className="text-muted-foreground">Budget:</span>{" "}
                        <span className="break-words">{viewingItem.item.budget}</span>
                      </div>
                    )}
                  </div>
                  {viewingItem.item.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{viewingItem.item.description}</p>
                    </div>
                  )}
                  {viewingItem.item.additional_notes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Additional Notes</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{viewingItem.item.additional_notes}</p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(viewingItem.item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 flex-wrap">
                  {viewingItem.item.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => { handleSendToWorkOs(viewingItem.item as TaskRequest); setViewingItem(null); }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Sent to WorkOS
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { handleDeclineTaskRequest(viewingItem.item as TaskRequest); setViewingItem(null); }}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => { setDeletingItem({ id: viewingItem.item.id, kind: 'taskRequest' }); setViewingItem(null); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deletingItem !== null} onOpenChange={(open) => {
          if (!open) setDeletingItem(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deletingItem?.kind === 'taskRequest' ? 'Delete Task Request' : 'Delete Message'}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {deletingItem?.kind === 'taskRequest' ? 'task request' : 'message'}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingItem(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteItem}
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

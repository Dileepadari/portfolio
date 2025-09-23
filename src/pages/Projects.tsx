import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Eye,
  Calendar,
  Users,
  Code,
  Zap,
  Plus,
  FolderOpen,
  Lock,
  Globe,
  Dot,
  Edit2,
  Trash2,
  Save,
  X
} from "lucide-react";

import { Project } from "@/hooks/usePortfolioData";
import { useProjects } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";

// Project categories
const projectCategories = [
  "all",
  "web development",
  "mobile development",
  "extension development", 
  "distributed systems", 
  "embedded", 
  "hardware", 
  "iot", 
  "machine learning",
  "game development"
];

export function Projects() {
  const { data: projects = [], loading, refetch: refetchProjects } = useProjects();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Admin states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addingProject, setAddingProject] = useState(false);

  // CRUD Functions
  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
      
      refetchProjects();
      setEditingProject(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  const addProject = async (newProject: Omit<Project, 'id'>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([newProject]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project added successfully!",
      });
      
      refetchProjects();
      setAddingProject(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      
      refetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  // Extract unique languages from projects
  const availableLanguages = [...new Set(projects.map(p => p.language).filter(Boolean))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.technologies && project.technologies.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                         (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "featured" && project.featured) ||
                         (selectedFilter === "public" && !project.is_private) ||
                         (selectedFilter === "private" && project.is_private) ||
                         (selectedFilter === project.language);
    
    const matchesCategory = selectedCategory === "all" ||
                           (project.tags && project.tags.some(tag => 
                             tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                             selectedCategory.toLowerCase().includes(tag.toLowerCase())
                           )) ||
                           (project.technologies && project.technologies.some(tech => 
                             tech.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                             selectedCategory.toLowerCase().includes(tech.toLowerCase())
                           )) ||
                           project.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesFilter && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "stars":
        return (b.stars || 0) - (a.stars || 0);
      case "updated":
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const featuredProjects = projects.filter(p => p.featured);
  const publicProjects = projects.filter(p => !p.is_private).length;
  const privateProjects = projects.filter(p => p.is_private).length;
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          {/* Header with Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Projects & Repositories</h1>
              <p className="text-muted-foreground text-lg mb-4">Building the future, one commit at a time</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{projects.length} repositories</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{publicProjects} public</span>
                </div>
                {privateProjects > 0 && (
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>{privateProjects} private</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{totalStars} stars</span>
                </div>
              </div>
            </div>
            {isAdmin && (
              <Button 
                className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setAddingProject(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New repository
              </Button>
            )}
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    featured 
                    isAdmin={isAdmin}
                    onEdit={() => setEditingProject(project)}
                    onDelete={() => deleteProject(project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Project Categories Tabs */}
          <div className="mb-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 bg-muted/50 min-w-full justify-start">
                  {projectCategories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap flex-shrink-0"
                    >
                      {category === "all" ? "All Projects" : 
                       category === "iot" ? "IoT" :
                       category.split(' ').map(word => 
                         word.charAt(0).toUpperCase() + word.slice(1)
                       ).join(' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Find a repository..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-56 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {/* General Filters */}
                    <SelectItem value="all">All repositories</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="public">Public only</SelectItem>
                    <SelectItem value="private">Private only</SelectItem>
                    
                    {/* Languages */}
                    {availableLanguages.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t mt-1 pt-2">
                          Languages
                        </div>
                        {availableLanguages.sort().map((language) => (
                          <SelectItem key={`lang-${language}`} value={language}>
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full" 
                                style={{ 
                                  backgroundColor: projects.find(p => p.language === language)?.language_color || '#666' 
                                }}
                              />
                              {language}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last updated</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="stars">Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <div key={project.id} className="scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProjectCard 
                  project={project} 
                  isAdmin={isAdmin}
                  onEdit={() => setEditingProject(project)}
                  onDelete={() => deleteProject(project.id)}
                />
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No repositories found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Project Dialog */}
      {addingProject && (
        <Dialog open={addingProject} onOpenChange={setAddingProject}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectEditForm
              project={{
                id: '',
                title: '',
                description: '',
                technologies: [],
                github_url: '',
                live_url: '',
                image_url: '',
                images: [],
                featured: false,
                order_index: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_private: false,
                stars: 0,
                forks: 0,
                language: '',
                language_color: '',
                tags: [],
                repository_url: '',
                updated_at_display: ''
              }}
              onSave={(data) => addProject(data as Omit<Project, 'id'>)}
              onCancel={() => setAddingProject(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectEditForm
              project={editingProject}
              onSave={(data) => updateProject(editingProject.id, data)}
              onCancel={() => setEditingProject(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function ProjectCard({ project, featured = false, isAdmin = false, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className={`bg-card border-border hover:border-primary transition-all duration-200 group ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      {(project.image_url || (project.images && project.images.length > 0)) && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
          <img 
            src={project.images?.[0] || project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-background/80 hover:bg-background text-foreground"
                onClick={onEdit}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/80 hover:bg-destructive text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{project.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer flex items-center gap-2">
                {project.title}
                {project.is_private && <Lock className="w-4 h-4 text-muted-foreground" />}
              </h3>
              {featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {project.description}
            </p>

            {/* Language and Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              {project.language && (
                <div className="flex items-center gap-1">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.language_color }}
                  />
                  <span>{project.language}</span>
                </div>
              )}
              
              {(project.stars || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{project.stars}</span>
                </div>
              )}
              
              {(project.forks || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  <span>{project.forks}</span>
                </div>
              )}

              {project.updated_at_display ? (
                <div className="flex items-center gap-1">
                  <Dot className="w-3 h-3" />
                  <span>Updated {project.updated_at_display}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Dot className="w-3 h-3" />
                  <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          {isAdmin && !(project.image_url || (project.images && project.images.length > 0)) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted-foreground/20"
                onClick={onEdit}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{project.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {(project.technologies || project.tags) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(project.tags || project.technologies || []).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex gap-2 justify-end">
          {(project.github_url || project.repository_url) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              asChild
            >
              <a href={project.repository_url || project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-3 h-3" />
              </a>
            </Button>
          )}
          
          {project.live_url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              asChild
            >
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Project Edit Form Component
interface ProjectEditFormProps {
  project: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectEditForm({ project, onSave, onCancel }: ProjectEditFormProps) {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    github_url: project.github_url || '',
    live_url: project.live_url || '',
    image_url: project.image_url || '',
    language: project.language || '',
    language_color: project.language_color || '',
    featured: project.featured || false,
    is_private: project.is_private || false,
    stars: project.stars || 0,
    forks: project.forks || 0,
    technologies: project.technologies?.join(', ') || '',
    tags: project.tags?.join(', ') || '',
    category: project.tags?.find(tag => projectCategories.includes(tag.toLowerCase())) || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine existing tags with category
    const existingTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const allTags = formData.category ? 
      [...existingTags.filter(tag => !projectCategories.includes(tag.toLowerCase())), formData.category] :
      existingTags;
    
    const submissionData = {
      ...formData,
      technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()).filter(t => t) : [],
      tags: allTags,
      github_url: formData.github_url || null,
      live_url: formData.live_url || null,
      image_url: formData.image_url || null,
      language: formData.language || null,
      language_color: formData.language_color || null,
    };
    
    // Remove category from submission data as it's now in tags
    const { category, ...finalData } = submissionData;
    onSave(finalData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Awesome Project"
            required
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="TypeScript"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description"
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            name="live_url"
            value={formData.live_url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="language_color">Language Color</Label>
          <Input
            id="language_color"
            name="language_color"
            value={formData.language_color}
            onChange={handleChange}
            placeholder="#3178c6"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="web, frontend, mobile"
          />
        </div>
        <div>
          <Label htmlFor="category">Project Category</Label>
          <Select 
            value={formData.category || ''} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {projectCategories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "iot" ? "IoT" :
                   category.split(' ').map(word => 
                     word.charAt(0).toUpperCase() + word.slice(1)
                   ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stars">Stars</Label>
          <Input
            id="stars"
            name="stars"
            type="number"
            min="0"
            value={formData.stars}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="forks">Forks</Label>
          <Input
            id="forks"
            name="forks"
            type="number"
            min="0"
            value={formData.forks}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor="featured">Featured project</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_private"
            name="is_private"
            checked={formData.is_private}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor="is_private">Private repository</Label>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
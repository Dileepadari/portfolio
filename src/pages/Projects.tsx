import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/providers/ThemeProvider";
import { preventAccidentalDialogClose, sanitizeHtml } from "@/lib/utils";
import { ProjectsSkeleton } from "@/components/skeletons/pages";
import { 
  Search, 
  ExternalLink, 
  Github, 
  Star, 
  Cloud,
  Plus,
  FolderOpen,
  Dot,
  Edit2,
  Trash2,
  Save,
  X,
  User,
  Users,
  Globe,
  Upload,
  Loader2
} from "lucide-react";

import { Project } from "@/hooks/usePortfolioData";
import { useProjects } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { adminApi } from "@/lib/adminApi";
import { ImageUploadField } from "@/components/ImageUploadField";
import { ThemedImage } from "@/components/ThemedImage";
import { Link } from "react-router-dom";

// Helper function to convert timestamp to human-readable format
const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Project categories
const projectCategories = [
  "all",
  "web development",
  "mobile development",
  "extension development", 
  "distributed systems", 
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
      await adminApi.update('projects', id, updatedProject);

      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
      
      refetchProjects();
      setEditingProject(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  const addProject = async (newProject: Omit<Project, 'id'>) => {
    try {
      await adminApi.insert('projects', newProject);

      toast({
        title: "Success",
        description: "Project added successfully!",
      });
      
      refetchProjects();
      setAddingProject(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await adminApi.remove('projects', id);

      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      
      refetchProjects();
    } catch {
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
                         (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "mine" && !project.is_contributed) ||
                         (selectedFilter === "contributed" && project.is_contributed) ||
                         (selectedFilter === "deployed" && project.live_url) ||
                         (selectedFilter === project.language);
    
    const matchesCategory = selectedCategory === "all" ||
                           (project.tags && project.tags.some(tag => 
                             tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                             selectedCategory.toLowerCase().includes(tag.toLowerCase())
                           )) ||
                           project.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesFilter && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "updated":
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedFilter, selectedCategory, sortBy]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProjects.length));
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredProjects.length, visibleCount]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const featuredProjects = projects.filter(p => p.featured);
  const ownedProjects = projects.filter(p => !p.is_contributed).length;
  const contributedProjects = projects.filter(p => p.is_contributed).length;
  const totalDeployed = projects.filter(p => p.live_url).length;

  if (loading) {
    return <ProjectsSkeleton />;
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
                  <span>{projects.length} Projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{ownedProjects} Owned</span>
                </div>
                {contributedProjects > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{contributedProjects} Contributed</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Cloud className="w-4 h-4" />
                  <span>{totalDeployed} deployed</span>
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
              <div className="overflow-x-auto md:scrollbar-hide">
                <TabsList className="inline-flex h-auto p-1 bg-muted/50 w-full sm:min-w-full justify-start">
                  {projectCategories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap flex-shrink-0"
                    >
                      {category === "all" ? "All" : 
                       category === "iot" ? "IoT" :
                       category === "web development" ? "Web" :
                       category === "mobile development" ? "Mobile" :
                       category === "extension development" ? "Extensions" :
                       category === "distributed systems" ? "Distributed" :
                       category === "machine learning" ? "ML" :
                       category === "game development" ? "Games" :
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
                    className="pl-10 bg-muted border-border"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-56 bg-muted border-border">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="mine">Mine (Owned)</SelectItem>
                    <SelectItem value="contributed">Contributed</SelectItem>
                    <SelectItem value="deployed">Deployed</SelectItem>
                    
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
                  <SelectTrigger className="w-full sm:w-40 bg-muted border-border">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last updated</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleProjects.map((project, index) => (
              <div key={project.id} className="scale-in" style={{ animationDelay: `${(index % PAGE_SIZE) * 0.05}s` }}>
                <ProjectCard 
                  project={project} 
                  isAdmin={isAdmin}
                  onEdit={() => setEditingProject(project)}
                  onDelete={() => deleteProject(project.id)}
                />
              </div>
            ))}
          </div>

          {/* Infinite Scroll Sentinel & Loader */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Loading more projects ({visibleProjects.length} of {filteredProjects.length})...</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 text-xs"
                onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProjects.length))}
              >
                Load more
              </Button>
            </div>
          )}

          {!hasMore && filteredProjects.length > PAGE_SIZE && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Showing all {filteredProjects.length} projects
            </div>
          )}

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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" {...preventAccidentalDialogClose}>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectEditForm
              project={{
                id: '',
                title: '',
                description: '',
                github_url: '',
                live_url: '',
                image_url: '',
                images: [],
                featured: false,
                order_index: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_contributed: false,
                stars: 0,
                forks: 0,
                language: '',
                language_color: '',
                tags: [],
                category: ''
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" {...preventAccidentalDialogClose}>
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
  const { resolvedTheme } = useTheme();

  // The card image is a dark/light pair. `resolvedTheme` rather than `theme`:
  // `theme` can be the literal "system", which matched neither branch of the
  // old comparison and sent every system-preference visitor to the colour logo.
  const dark = project.image_url || project.images?.[0];
  const light = project.image_url_light || project.images_light?.[0];

  // With no image at all, the brand mark stands in, and it needs the opposite
  // of the background it sits on.
  const fallback =
    resolvedTheme === 'light' ? '/adk_dev_logo_dark.png' : '/adk_dev_logo_light.png';

  const cardImage = (
    <ThemedImage
      dark={dark}
      light={light}
      fallback={fallback}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
    />
  );

  return (
    <Card className={`bg-card border-border hover:border-primary transition-all duration-200 group ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
        {project.slug ? (
          <Link to={`/projects/${project.slug}`} aria-label={`Open ${project.title}`} className="block h-full w-full">
            {cardImage}
          </Link>
        ) : (
          cardImage
        )}
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
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-primary flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                {/* The title was styled as a link and did nothing. It goes to
                    the showcase page now, when the project has a slug. */}
                {project.slug ? (
                  <Link
                    to={`/projects/${project.slug}`}
                    className="truncate hover:underline"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.title) }}
                  />
                ) : (
                  <span
                    className="truncate"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.title) }}
                  />
                )}
                {project.is_contributed && <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />}
                {featured && <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />}
              </h3>
              
              {/* GitHub and Live Links */}
              <div className="flex gap-1 flex-shrink-0">
                {project.github_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    asChild
                  >
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
                
                {project.live_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    asChild
                  >
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <p
              className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 text-justify"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
            />

            {/* Language and Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-3">
              {project.language && (
                <div className="flex items-center gap-1">
                  <span 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: project.language_color }}
                  />
                  <span
                    className="truncate"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.language) }}
                  />
                </div>
              )}
              
              {(project.is_contributed === false) ? (
                <div className="flex items-center gap-1">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="hidden sm:inline">Owned</span>
                  <span className="sm:hidden">Mine</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="hidden sm:inline">Contributed</span>
                  <span className="sm:hidden">Contrib</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Dot className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">Updated {getTimeAgo(project.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {(project.tags) && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
            {(project.tags || []).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
      </CardContent>
    </Card>
  );
}

// Project Edit Form Component
/**
 * A JSON array, edited as text.
 *
 * `features`, `metrics` and `tech_stack` are two- and three-key shapes. Three
 * bespoke repeatable-row widgets would be more code than the fields deserve,
 * and a raw textarea silently saves null on a typo, so this is the middle:
 * a textarea that shows the parse error inline and refuses to submit.
 */
function JsonListField({
  id,
  label,
  hint,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="font-mono text-xs"
        placeholder={hint}
        aria-invalid={!!error}
      />
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          A JSON array. Leave blank to omit the section. Shape: <code>{hint}</code>
        </p>
      )}
    </div>
  );
}

interface ProjectEditFormProps {
  project: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectEditForm({ project, onSave, onCancel }: ProjectEditFormProps) {
  const [formData, setFormData] = useState({
    title: project.title || '',
    slug: project.slug || '',
    tagline: project.tagline || '',
    description: project.description || '',
    github_url: project.github_url || '',
    live_url: project.live_url || '',
    demo_url: project.demo_url || '',
    docs_url: project.docs_url || '',
    image_url: project.image_url || '',
    image_url_light: project.image_url_light || '',
    hero_url: project.hero_url || '',
    hero_url_light: project.hero_url_light || '',
    images: project.images?.join(', ') || '',
    images_light: project.images_light?.join(', ') || '',
    overview: project.overview || '',
    problem: project.problem || '',
    architecture: project.architecture || '',
    getting_started: project.getting_started || '',
    readme: project.readme || '',
    project_role: project.project_role || '',
    timeline: project.timeline || '',
    status: project.status || '',
    language: project.language || '',
    language_color: project.language_color || '',
    featured: project.featured || false,
    is_contributed: project.is_contributed || false,
    tags: project.tags?.join(', ') || '',
    category: project.category || '',
    order_index: project.order_index || 0,
    stars: project.stars || 0,
    forks: project.forks || 0,
  });

  // The three structured lists are edited as JSON. A textarea of JSON is not a
  // lovely editor, but these are shapes with two or three keys each and the
  // alternative is three bespoke repeatable-row widgets; the parse error is
  // shown inline so a typo cannot be saved as null.
  const [jsonFields, setJsonFields] = useState({
    features: project.features?.length ? JSON.stringify(project.features, null, 2) : '',
    metrics: project.metrics?.length ? JSON.stringify(project.metrics, null, 2) : '',
    tech_stack: project.tech_stack?.length ? JSON.stringify(project.tech_stack, null, 2) : '',
  });
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up list-type fields
    const parseList = (str: string) =>
      str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    // An empty string is not the same as "no value": the detail page decides
    // whether to render a section by whether its column is null, so a blank
    // field has to become null or every section would render empty.
    const orNull = (value: string) => (value.trim() ? value : null);

    const parsed: Record<string, unknown> = {};
    const errors: Record<string, string> = {};
    for (const [key, raw] of Object.entries(jsonFields)) {
      if (!raw.trim()) {
        parsed[key] = null;
        continue;
      }
      try {
        const value = JSON.parse(raw);
        if (!Array.isArray(value)) throw new Error('must be a JSON array');
        parsed[key] = value;
      } catch (error) {
        errors[key] = error instanceof Error ? error.message : 'invalid JSON';
      }
    }
    if (Object.keys(errors).length > 0) {
      setJsonErrors(errors);
      return;
    }
    setJsonErrors({});

    const submissionData = {
      ...formData,
      ...parsed,
      tags: parseList(formData.tags),
      images: parseList(formData.images),
      images_light: parseList(formData.images_light),
      // Slug is what the detail page is addressed by, so derive one rather than
      // leaving the project unreachable when the field is left blank.
      slug: (formData.slug.trim() ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || null,
      github_url: orNull(formData.github_url),
      live_url: orNull(formData.live_url),
      demo_url: orNull(formData.demo_url),
      docs_url: orNull(formData.docs_url),
      image_url: orNull(formData.image_url),
      image_url_light: orNull(formData.image_url_light),
      hero_url: orNull(formData.hero_url),
      hero_url_light: orNull(formData.hero_url_light),
      tagline: orNull(formData.tagline),
      overview: orNull(formData.overview),
      problem: orNull(formData.problem),
      architecture: orNull(formData.architecture),
      getting_started: orNull(formData.getting_started),
      readme: orNull(formData.readme),
      project_role: orNull(formData.project_role),
      timeline: orNull(formData.timeline),
      status: orNull(formData.status),
      category: orNull(formData.category),
      language: orNull(formData.language),
      language_color: orNull(formData.language_color),
    };

    onSave(submissionData as Partial<Project>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const galleryLightFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const { toast } = useToast();

  /**
   * Appends an uploaded image to one of the two gallery lists.
   *
   * `field` is the theme: entry n of `images` and entry n of `images_light`
   * are the same screenshot, so they are uploaded into the same position by
   * being appended in the same order.
   */
  const handleGalleryUpload = (field: 'images' | 'images_light') => async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      setUploadingGalleryImage(true);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const url = await adminApi.upload(file, { fileType: 'images', fileName: `${crypto.randomUUID()}-${sanitizedName}` });
      setFormData(prev => ({ ...prev, [field]: prev[field] ? `${prev[field]}, ${url}` : url }));
      toast({ title: 'Uploaded', description: 'Image added to gallery.' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Title + Language */}
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

      {/* Description */}
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

      {/* URLs */}
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

      {/* ---------------------------------------------------------------- */}
      {/* Imagery. Every image is a dark/light pair and the light half is    */}
      {/* optional: leave it blank and the dark one is used in both themes,  */}
      {/* which is the right answer for a photo or a theme-neutral diagram.  */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <p className="text-sm font-medium">Imagery</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Card image (dark)"
            value={formData.image_url}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Card image (light, optional)"
            value={formData.image_url_light}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url_light: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Detail banner (dark)"
            value={formData.hero_url}
            onChange={(url) => setFormData(prev => ({ ...prev, hero_url: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Detail banner (light, optional)"
            value={formData.hero_url_light}
            onChange={(url) => setFormData(prev => ({ ...prev, hero_url_light: url }))}
            fileType="images"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="images">Gallery, dark (comma-separated URLs)</Label>
            <input
              ref={galleryFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload('images')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploadingGalleryImage}
              onClick={() => galleryFileInputRef.current?.click()}
            >
              {uploadingGalleryImage ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
              Upload & add
            </Button>
          </div>
          <Input
            id="images"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="https://img1.jpg, https://img2.jpg"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="images_light">Gallery, light (optional, same order)</Label>
            <input
              ref={galleryLightFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload('images_light')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploadingGalleryImage}
              onClick={() => galleryLightFileInputRef.current?.click()}
            >
              {uploadingGalleryImage ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
              Upload & add
            </Button>
          </div>
          <Input
            id="images_light"
            name="images_light"
            value={formData.images_light}
            onChange={handleChange}
            placeholder="Entry 1 here is the light twin of entry 1 above"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Paired by position. A shorter list is fine: the missing entries fall back to their dark twin.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Showcase content. Everything here is optional, and the detail page  */}
      {/* omits the section for anything left blank rather than rendering an  */}
      {/* empty heading. Blank is a valid answer.                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Showcase: for the reader</p>
          <p className="text-xs text-muted-foreground">
            The upper half of the detail page. Someone deciding whether this project is interesting.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="derived from the title when blank"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Shipped, In progress, Archived"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="One line, shown under the title"
          />
        </div>

        <div>
          <Label htmlFor="overview">Overview (markdown)</Label>
          <Textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            rows={4}
            placeholder="What it is, in a paragraph or two"
          />
        </div>

        <div>
          <Label htmlFor="problem">The problem (markdown)</Label>
          <Textarea
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            rows={4}
            placeholder="Why it exists. What was wrong before it."
          />
        </div>

        <JsonListField
          id="features"
          label="Features"
          hint='[{ "title": "Live dashboard", "description": "Every sensor, judged" }]'
          value={jsonFields.features}
          error={jsonErrors.features}
          onChange={(value) => setJsonFields(prev => ({ ...prev, features: value }))}
        />

        <JsonListField
          id="metrics"
          label="Headline numbers"
          hint='[{ "label": "Tests", "value": "176" }]'
          value={jsonFields.metrics}
          error={jsonErrors.metrics}
          onChange={(value) => setJsonFields(prev => ({ ...prev, metrics: value }))}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="project_role">Your role</Label>
            <Input
              id="project_role"
              name="project_role"
              value={formData.project_role}
              onChange={handleChange}
              placeholder="Sole author, Backend, Team of four"
            />
          </div>
          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="Aug 2026 - present"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Showcase: for developers</p>
          <p className="text-xs text-muted-foreground">
            The lower half, below the divider. Someone who has decided to build or read it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
              id="demo_url"
              name="demo_url"
              value={formData.demo_url}
              onChange={handleChange}
              placeholder="https://example.com/demo"
            />
          </div>
          <div>
            <Label htmlFor="docs_url">Docs URL</Label>
            <Input
              id="docs_url"
              name="docs_url"
              value={formData.docs_url}
              onChange={handleChange}
              placeholder="https://example.com/docs"
            />
          </div>
        </div>

        <JsonListField
          id="tech_stack"
          label="Tech stack"
          hint='[{ "name": "React 18", "role": "Frontend" }]'
          value={jsonFields.tech_stack}
          error={jsonErrors.tech_stack}
          onChange={(value) => setJsonFields(prev => ({ ...prev, tech_stack: value }))}
        />

        <div>
          <Label htmlFor="architecture">Architecture (markdown)</Label>
          <Textarea
            id="architecture"
            name="architecture"
            value={formData.architecture}
            onChange={handleChange}
            rows={6}
            placeholder="How the pieces fit. A fenced code block renders as a diagram."
          />
        </div>

        <div>
          <Label htmlFor="getting_started">Getting started (markdown)</Label>
          <Textarea
            id="getting_started"
            name="getting_started"
            value={formData.getting_started}
            onChange={handleChange}
            rows={6}
            placeholder="Clone, install, run"
          />
        </div>

        <div>
          <Label htmlFor="readme">README (markdown)</Label>
          <Textarea
            id="readme"
            name="readme"
            value={formData.readme}
            onChange={handleChange}
            rows={14}
            className="font-mono text-xs"
            placeholder="Paste the project's README here"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Rendered in full at the bottom of the detail page. Not synced from GitHub: this is the
            curated copy, so it works for contributed and private repos too.
          </p>
        </div>
      </div>

      {/* Language Color */}
      <div>
        <Label htmlFor="language_color">Language Color</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="color"
            id="language_color"
            name="language_color"
            value={formData.language_color || '#3178c6'}
            onChange={handleChange}
            className="w-20 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={formData.language_color}
            onChange={handleChange}
            name="language_color"
            placeholder="#3178c6"
            className="flex-1"
          />
        </div>
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
                  {category === "iot" ? "IoT & Embedded Systems" :
                    category.split(' ').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Index, Stars, Forks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="order_index">Order Index</Label>
          <Input
            type="number"
            id="order_index"
            name="order_index"
            value={formData.order_index}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="stars">Stars</Label>
          <Input
            type="number"
            id="stars"
            name="stars"
            value={formData.stars}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="forks">Forks</Label>
          <Input
            type="number"
            id="forks"
            name="forks"
            value={formData.forks}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      {/* Toggles */}
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
            id="is_contributed"
            name="is_contributed"
            checked={formData.is_contributed}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor="is_contributed">Contributed to (not owned by me)</Label>
        </div>
      </div>

      {/* Buttons */}
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

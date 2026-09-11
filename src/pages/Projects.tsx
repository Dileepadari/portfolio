import { useState, useRef, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  User,
  Users,
  Globe,
  Loader2
} from "lucide-react";

import { Project } from "@/hooks/usePortfolioData";
import { useProjects } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { adminApi } from "@/lib/adminApi";
import { ThemedImage } from "@/components/ThemedImage";
import { ProjectEditDialog, ProjectEditForm } from "@/components/ProjectEditDialog";
import { projectCategories } from "@/lib/projectCategories";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

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


export function Projects() {
  useDocumentMeta(
    "Projects | Dileep Adari",
    "Open source projects and repositories: distributed systems, IoT, web applications and the tooling around them."
  );
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

      <ProjectEditDialog
        projectId={editingProject?.id ?? null}
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        onSaved={refetchProjects}
      />
    </div>
  );
}

/**
 * Loads the complete project row before showing the editor.
 *
 * The row the card was rendered from came out of the list query, which omits
 * the showcase columns. Handing that to the form made every one of them look
 * empty, and saving would have written that emptiness back: galleries, README
 * and all. Waiting one request is the price of not doing that.
 */
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

  const hasImage = Boolean(dark || light);
  const mark = resolvedTheme === 'light' ? '/adk_dev_logo_dark.png' : '/adk_dev_logo_light.png';

  // Contained over a blurred copy of itself, the same treatment as the detail
  // page banner and for the same reason: a card image is whatever somebody
  // uploaded. `object-cover` on a full application screenshot crops it to a
  // zoomed slice of its top-left corner, which is not recognisable as anything.
  // Contained shows the whole thing, and the blurred fill stops it floating in
  // an empty box.
  const cardImage = hasImage ? (
    <>
      <ThemedImage
        dark={dark}
        light={light}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl saturate-125 opacity-60"
      />
      <ThemedImage
        dark={dark}
        light={light}
        alt={project.title}
        className="relative mx-auto h-full w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
      />
    </>
  ) : (
    // No screenshot yet. A visible, deliberate panel beats a near-invisible
    // speck: the mark sits on a tint drawn from the project's own language
    // colour, so a grid of coverless projects still reads as distinct cards.
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background: project.language_color
          ? `radial-gradient(circle at 50% 45%, ${project.language_color}26, transparent 70%)`
          : undefined,
      }}
      aria-hidden
    >
      {/* Sized as a fraction of the cover rather than a fixed pixel height, so
          the mark keeps the same presence on a wide featured card as on a
          narrow one instead of shrinking to a speck in the middle of the box. */}
      <img
        src={mark}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-[42%] w-auto max-w-[64%] object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
      />
    </div>
  );

  return (
    // h-full + flex column: the grid gives every cell the height of the tallest
    // card in its row, and this makes the card actually fill it instead of
    // stopping at its own content and leaving a ragged bottom edge.
    <Card className={`flex h-full flex-col bg-card border-border hover:border-primary transition-all duration-200 group ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      {/* bg-muted/40 rather than transparent: with a contained image there
          is always some letterboxing, and it should look like a frame rather
          than a hole in the card. */}
      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative bg-muted/40">
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
      
      <CardHeader className="flex flex-1 flex-col pb-3">
        <div className="flex min-w-0 items-start justify-between">
          {/* min-w-0: a flex child's default min-width is auto, so this column
              refused to shrink below its longest unbroken word and pushed the
              whole card past the grid at tablet widths. */}
          <div className="min-w-0 flex-1">
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
            
            {/* Clamped to three lines and given the height of three lines, so
                a short description leaves the same gap a long one fills and
                every card's meta row starts at the same y. Rewriting the copy
                to a uniform length gets most of the way there; this is what
                holds once somebody edits one. */}
            <p
              className="mb-3 line-clamp-3 min-h-[3.75rem] text-justify text-xs leading-relaxed text-muted-foreground sm:min-h-[4.125rem] sm:text-sm"
              title={project.description}
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

        {/* mt-auto pins the tags to the bottom of the card; showing at most
            four keeps a heavily tagged project from setting the height for
            every card beside it, and the rest are still reachable on the
            project's own page. */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-3 sm:gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge
                variant="secondary"
                className="border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:px-2 sm:text-xs"
                title={project.tags.slice(4).join(", ")}
              >
                +{project.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
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

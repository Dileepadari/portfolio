import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Dot
} from "lucide-react";

import { Project } from "@/hooks/usePortfolioData";
import { useProjects } from "@/hooks/usePortfolioData";

export function Projects() {
  const { data: projects = [], loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");

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
    
    return matchesSearch && matchesFilter;
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
            <Button className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New repository
            </Button>
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
                  <ProjectCard key={project.id} project={project} featured />
                ))}
              </div>
            </div>
          )}

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
                <ProjectCard project={project} />
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
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Card className={`bg-card border-border hover:border-primary transition-all duration-200 ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      {(project.image_url || (project.images && project.images.length > 0)) && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={project.images?.[0] || project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
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
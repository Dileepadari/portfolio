import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Zap
} from "lucide-react";

import { Project } from "@/hooks/usePortfolioData";

import { useProjects } from "@/hooks/usePortfolioData";

export function Projects() {
  const { data: projects = [], loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.technologies && project.technologies.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = selectedType === "all" || 
                       (selectedType === "featured" && project.featured) ||
                       (selectedType === "personal" && !project.featured);
    
    return matchesSearch && matchesType;
  });

  const featuredProjects = projects.filter(p => p.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Projects</h1>
          <p className="text-muted-foreground text-lg">Building the future, one commit at a time</p>
        </div>

        {/* Featured Projects */}
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

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs value={selectedType} onValueChange={setSelectedType} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No projects found matching your criteria</div>
          </div>
        )}
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
              <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                {project.title}
              </h3>
              {featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {project.description}
            </p>
          </div>
        </div>

        {project.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.map((tag) => (
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
          {project.github_url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              asChild
            >
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
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
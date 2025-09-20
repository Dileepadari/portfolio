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
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0d1117'}}>
        <div className="animate-pulse text-[#e6edf3]">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0d1117', color: '#e6edf3'}}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#e6edf3]">Projects</h1>
          <p className="text-[#8b949e] text-lg">Building the future, one commit at a time</p>
        </div>

        {/* Featured Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-[#e6edf3]">
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
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e]" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#21262d] border-[#30363d] text-[#e6edf3] placeholder-[#8b949e]"
                />
              </div>
            </div>
            
            <Tabs value={selectedType} onValueChange={setSelectedType} className="w-auto">
              <TabsList className="bg-[#21262d] border-[#30363d]">
                <TabsTrigger value="all" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">All</TabsTrigger>
                <TabsTrigger value="featured" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Featured</TabsTrigger>
                <TabsTrigger value="personal" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Personal</TabsTrigger>
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
            <div className="text-[#8b949e] text-lg">No projects found matching your criteria</div>
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
    <Card className={`bg-[#21262d] border-[#30363d] hover:border-[#58a6ff] transition-all duration-200 ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#58a6ff] hover:underline cursor-pointer">
                {project.title}
              </h3>
              {featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            </div>
            <p className="text-[#8b949e] text-sm leading-relaxed mb-3">
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
                className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
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
              className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
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
              className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
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